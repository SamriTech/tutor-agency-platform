from django.shortcuts import render
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework import status
from dj_rest_auth.jwt_auth import set_jwt_cookies
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes, authentication_classes, api_view
from .models import (OTP, PasswordResetToken, Qualification, 
                    MyUser, Transaction, Availability, Expertise)
from rest_framework.response import Response
from .serializer import (
    CustomPasswordResetSerializer, 
    PasswordRestTokenSeriailzer, 
    ChangePasswordSerailzer,
    FinishSignupSerializer,
    QualificationSerializer,
    CustomUserDetailSerializer,
    TransactionSerializer,
    AvailabilitySerializer,
    ExpertiseSerializer
)
from dj_rest_auth.registration.views import RegisterView
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .utils import verify_phone_util
from .adapter import CustomAccountAdapter
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

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
from .adapter import CustomAccountAdapter
from django_filters.rest_framework import DjangoFilterBackend
from ey_backend.chapa import Chapa
import uuid

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
class ExpertiseListView(ListAPIView):
    queryset = Expertise.objects.all()
    serializer_class = ExpertiseSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {'name': ['icontains', 'exact']}

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
            callback_url=request.build_absolute_uri(f"/api/auth/wallet/verify/{tx_ref}/")
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
                user.balance += transaction.amount
                user.save()
                
                return Response({"status": "success", "message": "Payment verified and balance updated."})
            return Response({"status": "success", "message": "Transaction already processed."})
        else:
            transaction.status = 'failed'
            transaction.save()
            return Response({"status": "error", "message": "Payment verification failed."}, status=400)

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
        if user.balance < float(amount):
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
            user.balance -= float(amount)
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

class UserListView(ListAPIView):
    queryset = MyUser.objects.all()
    serializer_class = CustomUserDetailSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'role': ['exact'],
        'tutor_profile__subject': ['exact'],
        'location': ['icontains', 'exact'],
        'tutor_profile__expertise': ['exact']
    }
    permission_classes = [AllowAny]

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/auth/callback/google"
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