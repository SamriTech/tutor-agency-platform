from decimal import Decimal
from django.shortcuts import render
from django.db.models import Q
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework import status
from dj_rest_auth.jwt_auth import set_jwt_cookies
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from .models import (OTP, PasswordResetToken, Qualification, 
                    MyUser, Transaction, Availability, Expertise, Subject,
                    TutoringRequest,LeadUnlock,LEAD_PRICES,Review)
from .serializer import (
    CustomPasswordResetSerializer, 
    PasswordRestTokenSeriailzer, 
    ChangePasswordSerailzer,
    FinishSignupSerializer,
    QualificationSerializer,
    CustomUserDetailSerializer,
    TransactionSerializer,
    AvailabilitySerializer,
    ExpertiseSerializer,
    SubjectSerializer,
    ProfileChangePasswordSerializer,
    PhoneChangeRequestSerializer,
    PhoneChangeVerifySerializer,
    TutoringRequestSerializer,
    ReviewSerializer
)
from rest_framework.response import Response
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from dj_rest_auth.registration.views import RegisterView
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .utils import verify_phone_util
from .adapter import CustomAccountAdapter
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Case, When
from .ai_utils import TutorMatcher
from django_filters.rest_framework import DjangoFilterBackend
from ey_backend.chapa import Chapa
from rest_framework.filters import SearchFilter
import uuid

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Try to get user status from the refresh token
            refresh_token = request.COOKIES.get('jwt-refresh-token') or request.data.get('refresh')
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    user_id = token['user_id']
                    user = MyUser.objects.get(id=user_id)
                    response.data['user'] = {
                        'is_phone_verified': user.is_phone_verified,
                        'role': user.role,
                        'username': user.username
                    }
                except Exception:
                    pass
        return response

class ResendOTPView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        user = request.user
        if user.is_phone_verified:
            return Response({"detail": "Phone already verified."}, status=status.HTTP_400_BAD_REQUEST)
        
        adapter = CustomAccountAdapter()
        # Delete old OTP if exists to force a new one
        OTP.objects.filter(user=user).delete()
        otp_obj = OTP.objects.create(user=user)
        
        adapter.send_verification_code_sms(user, str(user.phone_number), otp_obj.code)
        
        return Response({
            "status": "success",
            "message": "A new verification code has been sent to your phone."
        }, status=status.HTTP_200_OK)

class MeProfileView(RetrieveAPIView):
    serializer_class = CustomUserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class MeProfileUpdateView(UpdateAPIView):
    serializer_class = CustomUserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def post(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class UserByIDView(RetrieveAPIView):
    queryset = MyUser.objects.all()
    serializer_class = CustomUserDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

# Qualification Views
class QualificationListCreateView(ListCreateAPIView):
    serializer_class = QualificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Qualification.objects.filter(tutor__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user.tutor_profile)

class QualificationDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = QualificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Qualification.objects.filter(tutor__user=self.request.user)

class UserQualificationsView(ListAPIView):
    serializer_class = QualificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Qualification.objects.filter(tutor__user_id=user_id, status='approved')

# Availability Views
class AvailabilityListCreateView(ListCreateAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Availability.objects.filter(tutor__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user.tutor_profile)

class AvailabilityDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Availability.objects.filter(tutor__user=self.request.user)

class UserAvailabilityView(ListAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Availability.objects.filter(tutor__user_id=user_id)

# Expertise Views
class ExpertiseListView(ListCreateAPIView):
    queryset = Expertise.objects.all()
    serializer_class = ExpertiseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'name': ['icontains', 'exact']}

class SubjectListView(ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'name': ['icontains', 'exact']}

    def list(self,request,*args,**kwargs):
        test = request.GET.get('type')
        if(test == "grade"):
            queryset = self.get_queryset().filter(type="grade")
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        elif (test=="All"):
            return super().list(request, *args, **kwargs)
        else:
            queryset = self.get_queryset().filter(type="subject")
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
class BalanceTransactionView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        transactions = Transaction.objects.filter(user=user).order_by('-created_at')
        serializer = TransactionSerializer(transactions, many=True)
        return Response({
            "balance": user.balance,
            "transactions": serializer.data
        })

class DepositView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        amount = request.data.get("amount")
        if not amount:
            return Response({"error": "Amount is required."}, status=400)
        
        user = request.user
        tx_ref = f"txn-{uuid.uuid4()}"
        
        transaction = Transaction.objects.create(
            user=user,
            amount=amount,
            transaction_type='deposit',
            status='pending',
            reference=tx_ref
        )
        
        res = Chapa.initialize_payment(
            amount=amount,
            email=user.email or "user@example.com",
            first_name=user.first_name or user.username,
            last_name=user.last_name or "",
            tx_ref=tx_ref,
            callback_url=request.build_absolute_uri(f"/api/auth/wallet/verify/{tx_ref}/"),
            return_url=request.build_absolute_uri("/wallet/history")
        )
        
        if res.get("status") == "success":
            return Response({
                "status": "success",
                "checkout_url": res["data"]["checkout_url"],
                "tx_ref": tx_ref
            })
        else:
            transaction.delete()
            return Response({"status": "error", "message": res.get("message")}, status=400)

class PaymentVerifyView(GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, tx_ref, *args, **kwargs):
        res = Chapa.verify_transaction(tx_ref)
        
        try:
            transaction = Transaction.objects.get(reference=tx_ref)
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found."}, status=404)
        
        if res.get("status") == "success" and res["data"]["status"] == "success":
            if transaction.status == 'pending':
                transaction.status = 'success'
                transaction.save()
                
                user = transaction.user
                user.balance += Decimal(transaction.amount)
                user.save()
                
                return Response({"status": "success", "message": "Payment verified and balance updated."})
            return Response({"status": "success", "message": "Transaction already processed."})
        else:
            # Only mark as failed if it's not already success (webhook might have won)
            if transaction.status == 'pending':
                transaction.status = 'failed'
                transaction.save()
            return Response({"status": "error", "message": "Payment verification failed."}, status=400)

class ChapaWebhookView(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        tx_ref = data.get("tx_ref")
        
        if not tx_ref:
            return Response({"status": "failed"}, status=400)
            
        res = Chapa.verify_transaction(tx_ref)
        if res.get("status") == "success" and res["data"]["status"] == "success":
            try:
                transaction = Transaction.objects.get(reference=tx_ref)
                if transaction.status == 'pending':
                    transaction.status = 'success'
                    transaction.save()
                    
                    user = transaction.user
                    user.balance += Decimal(transaction.amount)
                    user.save()
            except Transaction.DoesNotExist:
                pass
        
        return Response({"status": "handled"})

class WithdrawView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        amount = request.data.get("amount")
        account_name = request.data.get("account_name")
        account_number = request.data.get("account_number")
        bank_code = request.data.get("bank_code")
        
        if not all([amount, account_name, account_number, bank_code]):
            return Response({"error": "Missing required fields."}, status=400)
        
        user = request.user
        if user.balance < Decimal(amount):
            return Response({"error": "Insufficient balance."}, status=400)
        
        tx_ref = f"wd-{uuid.uuid4()}"
        
        res = Chapa.transfer(
            account_name=account_name,
            account_number=account_number,
            amount=amount,
            bank_code=bank_code,
            reference=tx_ref
        )
        
        if res.get("status") == "success":
            user.balance -= Decimal(amount)
            user.save()
            
            Transaction.objects.create(
                user=user,
                amount=amount,
                transaction_type='withdraw',
                status='success',
                reference=tx_ref
            )
            return Response({"status": "success", "message": "Withdrawal successful."})
        else:
            return Response({"status": "error", "message": res.get("message")}, status=400)

class UserFilter(django_filters.FilterSet):
    min_rate = django_filters.NumberFilter(field_name="tutor_profile__hourly_rate", lookup_expr='gte')
    max_rate = django_filters.NumberFilter(field_name="tutor_profile__hourly_rate", lookup_expr='lte')
    subject = django_filters.NumberFilter(field_name="subject")
    grade = django_filters.NumberFilter(field_name="tutor_profile__grade")
    location = django_filters.CharFilter(field_name="location", lookup_expr='icontains')
    expertise = django_filters.NumberFilter(field_name="tutor_profile__expertise")

    class Meta:
        model = MyUser
        fields = ['role', 'subject', 'location', 'expertise']

class UserListView(ListAPIView):
    queryset = MyUser.objects.all()
    serializer_class = CustomUserDetailSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = UserFilter
    search_fields = [
        'username', 
        'first_name', 
        'last_name', 
        'tutor_profile__bio', 
        'tutor_profile__title', 
        'subject__name',
        'tutor_profile__expertise__name',
        'tutor_profile__qualifications__title',
        'tutor_profile__qualifications__description'
    ]
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        matched = request.query_params.get('matched') == 'true'
        role = request.query_params.get('role', 'tutor')
        
        if matched:
            # Check if user is tutor - tutors don't get AI matching for themselves
            if request.user.is_authenticated and request.user.role == 'tutor':
                return super().list(request, *args, **kwargs)

            # 1. Get filtered base pool (only tutors)
            queryset = self.filter_queryset(MyUser.objects.filter(role='tutor'))
            
            # 2. Extract search params for AI
            subject_id = request.query_params.get('subject')
            subject_name = request.query_params.get('search', "")
            if subject_id:
                try:
                    subject_name = Subject.objects.get(id=subject_id).name
                except Subject.DoesNotExist:
                    pass
            
            search_params = {
                "subject_name": subject_name,
                "grade_level": request.query_params.get('grade_level', ""),
                "location": request.query_params.get('location', ""),
                "mode": request.query_params.get('mode', "Online")
            }
            
            # 3. Matching
            matcher = TutorMatcher(queryset, request.user if request.user.is_authenticated else None, search_params)
            ranked_data = matcher.rank_tutors()
            
            if len(ranked_data) == 0:
                return Response({"count": 0, "results": []})

            # 4. Map back to objects
            ranked_ids = [d['id'] for d in ranked_data]
            # Order queryset by the ranked IDs
            preserved = Case(*[When(id=pk, then=pos) for pos, pk in enumerate(ranked_ids)])
            queryset = MyUser.objects.filter(id__in=ranked_ids).order_by(preserved)
            
            # 5. Pagination
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                # Inject scores
                scores = [d['match_score'] for d in ranked_data]
                for data, score in zip(serializer.data, scores):
                    data['match_score'] = round(score * 100, 1)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            # Inject scores for non-paginated results
            scores = [d['match_score'] for d in ranked_data]
            for data, score in zip(serializer.data, scores):
                data['match_score'] = round(score * 100, 1)
            return Response(serializer.data)
            
        return super().list(request, *args, **kwargs)
    
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client

class PasswordResetView(GenericAPIView):
    serializer_class = CustomPasswordResetSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return_status = serializer.save()
        return Response(return_status, status=200 if return_status.get("status") == "success" else 401)

class PasswordResetOTPVerify(GenericAPIView):
    serializer_class = PasswordRestTokenSeriailzer
    permission_classes = (AllowAny,)
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return_status = serializer.save()
        return Response(return_status, status=200 if return_status.get("status") == "success" else 401)

class ChangePasswordView(GenericAPIView):
    serializer_class = ChangePasswordSerailzer
    def post(self, request, *args, **kwargs):
        objs = self.get_serializer(data=request.data)
        if objs.is_valid():
            token = objs.validated_data.get('token')
            password = objs.validated_data.get('password')
            token_obj = PasswordResetToken.objects.filter(code=token)
            if token_obj.exists():
                user = token_obj.first().otp.user
                user.set_password(password)
                user.save()
                return Response({'status':"success","message":"password has been changed"})
            return Response({'status':"error","message":"token does not match"})
        return Response({'status':"error","message":"invalid credentials"}, status=400)


class CustomLogoutView(GenericAPIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        response.delete_cookie('jwt-access-token',samesite="None")
        response.delete_cookie('jwt-refresh-token',samesite="None")
        return response

class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        access_token = response.data.get('access')
        refresh_token = response.data.get('refresh')
        if access_token and refresh_token:
            set_jwt_cookies(response, access_token, refresh_token)
        return response

class FinishSignupView(GenericAPIView):
    serializer_class = FinishSignupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(instance=request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        adapter = CustomAccountAdapter()
        otp_obj, created = OTP.objects.get_or_create(user=user)
        adapter.send_verification_code_sms(user, str(user.phone_number), otp_obj.code)
        
        return Response({
            "status": "success",
            "message": "Signup finished, please verify your phone number.",
            "user": {
                "username": user.username,
                "role": user.role,
                "is_phone_verified": user.is_phone_verified
            }
        }, status=200)

class UpdateProfileView(GenericAPIView):
    serializer_class = FinishSignupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Allow updating first_name, last_name, email, username
        serializer = self.get_serializer(instance=request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "status": "success",
            "message": "Profile updated successfully.",
            "user": CustomUserDetailSerializer(user).data
        }, status=200)

class CheckUsernameView(GenericAPIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username')
        if not username:
            return Response({"error": "Username is required"}, status=400)
        exists = MyUser.objects.filter(username=username).exists()
        return Response({"exists": exists})

class ProfileChangePasswordView(GenericAPIView):
    serializer_class = ProfileChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"error": "Incorrect old password"}, status=400)
            
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"status": "success", "message": "Password changed successfully"})

class RequestPhoneChangeView(GenericAPIView):
    serializer_class = PhoneChangeRequestSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        new_phone = serializer.validated_data['phone_number']
        user.pending_phone_number = new_phone
        user.save()
        
        adapter = CustomAccountAdapter()
        otp_obj, created = OTP.objects.get_or_create(user=user)
        adapter.send_verification_code_sms(user, str(new_phone), otp_obj.code)
        
        return Response({"status": "success", "message": "Verification code sent to new phone number."})

class VerifyPhoneChangeView(GenericAPIView):
    serializer_class = PhoneChangeVerifySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        otp_obj = OTP.objects.filter(user=user, code=serializer.validated_data['code'])
        if not otp_obj.exists():
            return Response({"error": "Invalid verification code"}, status=400)
            
        if not user.pending_phone_number:
            return Response({"error": "No pending phone number change"}, status=400)
            
        user.phone_number = user.pending_phone_number
        user.pending_phone_number = None
        user.is_phone_verified = True
        user.save()
        otp_obj.delete()
        
        return Response({"status": "success", "message": "Phone number updated successfully."})
        
class VerifyCode(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        user = request.user
        otp_obj = OTP.objects.filter(user=user)
        def callback():
            user.is_phone_verified = True
            user.save()
            otp_obj.first().delete()
            return Response({"status":"success","message":"Account Verified"}, status=200)
        return verify_phone_util(request, otp_obj, callback)

class TutorRequestView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        base_requests = TutoringRequest.objects.filter(tutor=user, is_active=True, status='pending')
        
        # New requests: active, non-seen, AND unbought (unlocked)
        new_requests_qs = base_requests.filter(
            seen=False
        ).exclude(purchased_by__tutor=user)
        
        # Upcoming session: seen OR bought (unlocked)
        upcoming_requests_qs = base_requests.filter(
            Q(seen=True) | Q(purchased_by__tutor=user)
        )
        
        return Response({
            "new_requests": TutoringRequestSerializer(new_requests_qs, many=True, context={'request': request}).data,
            "upcoming_requests": TutoringRequestSerializer(upcoming_requests_qs, many=True, context={'request': request}).data
        })
class TutorRequestDetailView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request,request_id, *args, **kwargs):
        user = request.user
        try:
            tutor_request = TutoringRequest.objects.get(id=request_id)
        except TutoringRequest.DoesNotExist:
            return Response({"status":"error","message":"Request not found"}, status=404)
        
        # We allow tutors to see a preview of the request even if not paid.
        # The serializer will filter out contact information.
        
        # Mark as seen when the tutor views it
        if not tutor_request.seen and tutor_request.tutor == user:
            tutor_request.seen = True
            tutor_request.save()
            
        serializer = TutoringRequestSerializer(tutor_request, context={'request': request})
        return Response({
            "tutor_request": serializer.data
        })
class CreateTutorRequest(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self,request,tutor_id, *args, **kwargs):
        user = request.user
        tutor = MyUser.objects.get(id=tutor_id)
        
        # Check if an active request already exists
        if TutoringRequest.objects.filter(parent=user, tutor=tutor, is_active=True).exists():
            return Response({"status":"error","message":"You already have an active request with this tutor"}, status=400)
            
        description = request.data.get("description", "need a tutor")
        obj=TutoringRequest.objects.create(
            parent=user, 
            tutor=tutor,
            description=description
        )
        return Response({"status":"success","message":"Tutor request sent successfully", "id": obj.id}, status=200)

class UnlockLeadView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self,request,request_id, *args, **kwargs):
        user = request.user
        lead = TutoringRequest.objects.get(id=request_id)
        if LeadUnlock.objects.filter(tutor=user, lead=lead).exists():
            return Response({"status":"error","message":"Lead already unlocked"}, status=400)
        
        price = LEAD_PRICES.get("Low")
        if user.balance < price:
            return Response({"status":"error","message":"Insufficient balance"}, status=400)
            
        user.balance -= Decimal(price)
        user.save()
        
        LeadUnlock.objects.create(tutor=user, lead=lead, price_paid=price)
        
        # Create a transaction record
        Transaction.objects.create(
            user=user,
            amount=price,
            transaction_type='payment',
            status='success',
            reference=f"unlock-{uuid.uuid4().hex[:8]}"
        )
        
        return Response({"status":"success","message":"Lead unlocked successfully"}, status=200)

class AcceptTutorRequestView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, request_id, *args, **kwargs):
        user = request.user
        try:
            tutoring_request = TutoringRequest.objects.get(id=request_id, tutor=user)
        except TutoringRequest.DoesNotExist:
            return Response({"status":"error","message":"Request not found"}, status=404)
            
        # Ensure lead is unlocked
        if not LeadUnlock.objects.filter(tutor=user, lead=tutoring_request).exists():
            return Response({"status":"error","message":"You must unlock this lead before accepting it"}, status=400)
            
            
        tutoring_request.is_active = False # Mark as accepted/deactivated as a lead
        tutoring_request.status = 'accepted'
        tutoring_request.save()
        
        return Response({"status":"success","message":"Request accepted successfully"}, status=200)

class RefuseTutorRequestView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, request_id, *args, **kwargs):
        user = request.user
        try:
            tutoring_request = TutoringRequest.objects.get(id=request_id, tutor=user)
        except TutoringRequest.DoesNotExist:
            return Response({"status":"error","message":"Request not found"}, status=404)
            
        tutoring_request.is_active = False
        tutoring_request.status = 'refused'
        tutoring_request.save()
        
        return Response({"status":"success","message":"Request refused successfully"}, status=200)

class ParentRequestsView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        requests = TutoringRequest.objects.filter(parent=user)
        serializer = TutoringRequestSerializer(requests, many=True, context={'request': request})
        return Response({
            "requests": serializer.data
        })

class UpdateDeleteBookingView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, request_id, *args, **kwargs):
        user = request.user
        tutoring_request = TutoringRequest.objects.get(id=request_id, parent=user)
        if tutoring_request.seen:
            return Response({"status":"error","message":"Cannot edit a request that has already been seen by the tutor"}, status=400)
        
        description = request.data.get('description')
        if description:
            tutoring_request.description = description
            tutoring_request.save()
            return Response({"status":"success","message":"Booking updated successfully"}, status=200)
        return Response({"status":"error","message":"Description is required"}, status=400)

    def delete(self, request, request_id, *args, **kwargs):
        user = request.user
        tutoring_request = TutoringRequest.objects.get(id=request_id, parent=user)
        
        # Allow deletion if NOT seen OR if REFUSED by tutor
        if tutoring_request.seen and tutoring_request.status != 'refused':
            return Response({"status":"error","message":"Cannot cancel a request that has already been seen by the tutor"}, status=400)
        
        tutoring_request.delete()
        return Response({"status":"success","message":"Booking deleted successfully"}, status=200)
            
class ReviewListCreateView(ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        reviewer = request.user
        reviewee_id = request.data.get('reviewee')
        rating = request.data.get('rating')
        comment = request.data.get('comment')
        
        review, created = Review.objects.update_or_create(
            reviewer=reviewer,
            reviewee_id=reviewee_id,
            defaults={
                'rating': rating,
                'comment': comment
            }
        )
        serializer = self.get_serializer(review)
        status_code = 201 if created else 200
        return Response(serializer.data, status=status_code)

    def perform_create(self, serializer):
        # This is fallback for any other creation path, but create() above takes precedence for POST
        serializer.save(reviewer=self.request.user)

    def get_queryset(self):
        # Allow filtering by reviewee (tutor)
        tutor_id = self.request.query_params.get('tutor_id')
        if tutor_id:
            return self.queryset.filter(reviewee_id=tutor_id)
        return self.queryset
