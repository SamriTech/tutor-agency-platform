from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework import status
import pandas as pd

# Models and Serializers
from user.models import MyUser, Qualification, TutorProfile
from .serializers import AdminUserVerificationSerializer, AdminQualificationVerificationSerializer
from user.serializer import TutorProfileSerializer # Assuming this exists for the frontend results
from .permission import IsAdmin

# Import your AI logic
from .services import recommend_tutors_django

# ---------------------------------------------------------
# ADMIN VERIFICATION VIEWS 
# ---------------------------------------------------------

class PendingUserVerificationListView(ListAPIView):
    serializer_class = AdminUserVerificationSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return TutorProfile.objects.filter(
            user__is_id_verified=False
        ).exclude(id_photo__in=['', None])

class UserVerificationDetailView(RetrieveUpdateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = AdminUserVerificationSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        is_verified = request.data.get('is_id_verified')
        if is_verified is not None:
            instance.is_id_verified = is_verified
            instance.save()
            return Response({"status": "success", "message": f"User status: {is_verified}."}, status=status.HTTP_200_OK)
        return Response({"error": "is_id_verified required."}, status=status.HTTP_400_BAD_REQUEST)

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
            return Response({"status": "success", "message": f"Status: {new_status}."}, status=status.HTTP_200_OK)
        return Response({"error": "Valid status required."}, status=status.HTTP_400_BAD_REQUEST)

# ---------------------------------------------------------
# AI RECOMMENDATION VIEW 
# ---------------------------------------------------------

class RecommendTutorView(APIView):
    """
    Bridge between Frontend Form and the AI service logic.
    """
    def post(self, request):
        # 1. Collect all verified tutors
        tutors = TutorProfile.objects.filter(user__is_id_verified=True)
        
        if not tutors.exists():
            return Response({"message": "No verified tutors available yet."}, status=200)

        # 2. Prepare Data for Pandas (matching your services.py logic)
        tutor_list = []
        for t in tutors:
            # We take the first subject associated with the tutor
            sub_name = t.subject.first().name if t.subject.exists() else "General"
            
            tutor_list.append({
                "id": t.id,
                "subject": sub_name,
                "grade_level": "Grade 1", # Default if not in model yet
                "mode": "Online",         # Default if not in model yet
                "location": t.user.location or "Addis Ababa",
                "experience": 2,          # Default numeric value for AI math
                "rating": 4.0             # Default numeric value for AI math
            })
        
        tutors_df = pd.DataFrame(tutor_list)

        # 3. Create Request Dictionary from Frontend data
        request_dict = {
            "subject": request.data.get("subject", "Mathematics"),
            "grade_level": request.data.get("grade_level", "Grade 1"),
            "mode": request.data.get("mode", "Online"),
            "location": request.data.get("location", "Addis Ababa")
        }

        # 4. Run AI Matcher
        try:
            results_df = recommend_tutors_django(request_dict, tutors_df, top_n=3)
            
            # 5. Convert matched IDs back to Django Objects to serialize properly
            matched_ids = results_df["id"].tolist()
            recommended_tutors = TutorProfile.objects.filter(id__in=matched_ids)
            
            serializer = TutorProfileSerializer(recommended_tutors, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": f"AI Engine Error: {str(e)}"}, status=500)