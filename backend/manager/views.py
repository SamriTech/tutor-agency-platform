from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from user.models import MyUser, Qualification
from .serializers import AdminUserVerificationSerializer, AdminQualificationVerificationSerializer
from .permission import IsAdmin
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView

class PendingUserVerificationListView(ListAPIView):
    serializer_class = AdminUserVerificationSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        # List users who have an ID photo but are not verified yet
        return MyUser.objects.filter(is_id_verified=False,tutor_profile__isnull=False).exclude(tutor_profile__id_photo='')

class UserVerificationDetailView(RetrieveUpdateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = AdminUserVerificationSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        is_verified = request.data.get('is_id_verified')
        new_status = request.data.get('status') # 'verified', 'rejected', 'none'
        
        if is_verified is not None:
            instance.is_id_verified = is_verified
            if hasattr(instance, 'tutor_profile'):
                if is_verified:
                    instance.tutor_profile.id_verification_status = 'verified'
                elif new_status == 'rejected':
                    instance.tutor_profile.id_verification_status = 'rejected'
                instance.tutor_profile.save()
            instance.save()
            return Response({"status": "success", "message": "User verification status updated."}, status=status.HTTP_200_OK)
        
        return Response({"error": "is_id_verified field is required."}, status=status.HTTP_400_BAD_REQUEST)

class PendingQualificationListView(ListAPIView):
    serializer_class = AdminQualificationVerificationSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return Qualification.objects.filter(status='pending')

class QualificationVerificationDetailView(RetrieveUpdateAPIView):
    queryset = Qualification.objects.all()
    serializer_class = AdminQualificationVerificationSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in ['approved', 'rejected']:
            instance.status = new_status
            instance.save()
            return Response({"status": "success", "message": f"Qualification status updated to {new_status}."}, status=status.HTTP_200_OK)
        
        return Response({"error": "A valid status (approved/rejected) is required."}, status=status.HTTP_400_BAD_REQUEST)

class AdminUserListView(ListAPIView):
    queryset = MyUser.objects.all()
    serializer_class = AdminUserVerificationSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['role', 'is_active', 'is_id_verified']
    search_fields = ['username', 'first_name', 'last_name', 'email']

class AdminUserActionView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, id):
        user = MyUser.objects.get(id=id)
        action = request.data.get('action')

        if action == 'ban':
            user.is_active = False
            user.save()
            return Response({"status": "success", "message": "User banned successfully."})
        elif action == 'unban':
            user.is_active = True
            user.save()
            return Response({"status": "success", "message": "User unbanned successfully."})
        elif action == 'reset_password':
            user.set_password('1234567890')
            user.save()
            return Response({"status": "success", "message": "Password reset to 1234567890."})
        
        return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

class AdminQualificationListView(ListAPIView):
    queryset = Qualification.objects.all().order_by('-id')
    serializer_class = AdminQualificationVerificationSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['status', 'type']
    search_fields = ['title', 'tutor__user__username']
