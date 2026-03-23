from django.urls import path
from . import views

urlpatterns = [
    # User Verification
    path('verifications/users/', views.PendingUserVerificationListView.as_view(), name='admin_pending_users'),
    path('verifications/users/<int:id>/', views.UserVerificationDetailView.as_view(), name='admin_user_verify'),

    # Qualification Verification
    path('verifications/qualifications/', views.PendingQualificationListView.as_view(), name='admin_pending_qualifications'),
    path('verifications/qualifications/<int:id>/', views.QualificationVerificationDetailView.as_view(), name='admin_qualification_verify'),

    # General Management
    path('users/', views.AdminUserListView.as_view(), name='admin_user_list'),
    path('users/<int:id>/action/', views.AdminUserActionView.as_view(), name='admin_user_action'),
    path('qualifications/', views.AdminQualificationListView.as_view(), name='admin_all_qualifications'),
]