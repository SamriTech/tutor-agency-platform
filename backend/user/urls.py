from django.urls import path, include
from .views import *

urlpatterns = [
    path("finish-signup/", FinishSignupView.as_view(), name="finish_signup"),
    path("update-profile/", UpdateProfileView.as_view(), name="update_profile"),
    
    path("users/", UserListView.as_view(), name="user_list"), 
    path("users/me/", MeProfileView.as_view(), name="me_profile"),
    path("users/me/update/", MeProfileUpdateView.as_view(), name="me_profile_update"),
    path("users/<int:id>/", UserByIDView.as_view(), name="user_detail"),

    # Qualification Endpoints
    path("users/qualifications/", QualificationListCreateView.as_view(), name="qualification_list_create"),
    path("users/qualifications/<int:id>/", QualificationDetailView.as_view(), name="qualification_detail"),
    path("users/<int:user_id>/qualifications/", UserQualificationsView.as_view(), name="user_qualifications"),

    # Availability Endpoints
    path("users/availabilities/", AvailabilityListCreateView.as_view(), name="availability_list_create"),
    path("users/availabilities/<int:id>/", AvailabilityDetailView.as_view(), name="availability_detail"),
    path("users/<int:user_id>/availabilities/", UserAvailabilityView.as_view(), name="user_availabilities"),

    # Expertise Endpoints
    path("expertise/", ExpertiseListView.as_view(), name="expertise_list"),
    path("subjects/", SubjectListView.as_view(), name="subject_list"),

    path("wallet/", BalanceTransactionView.as_view(), name="balance_transactions"),
    path("wallet/deposit/", DepositView.as_view(), name="deposit"),
    path("wallet/withdraw/", WithdrawView.as_view(), name="withdraw"),
    path("wallet/verify/<str:tx_ref>/", PaymentVerifyView.as_view(), name="payment_verify"),
    path("wallet/webhook/", ChapaWebhookView.as_view(), name="chapa_webhook"),

    ## password reset views
    path('password/reset/', PasswordResetView.as_view(), name="start_password_reset"),
    path("password/reset/verify", PasswordResetOTPVerify.as_view(), name="password_reset_otp"),
    path("changepassword", ChangePasswordView.as_view(), name="passwordchange"),
    
    path("verifyotp", VerifyCode.as_view(), name="verify_otp_code"),
    path("resend-otp/", ResendOTPView.as_view(), name="resend_otp"),
    
    # New Profile Management Paths
    path("check-username/", CheckUsernameView.as_view(), name="check_username"),
    path("profile/change-password/", ProfileChangePasswordView.as_view(), name="profile_change_password"),
    path("profile/request-phone-change/", RequestPhoneChangeView.as_view(), name="request_phone_change"),
    path("profile/verify-phone-change/", VerifyPhoneChangeView.as_view(), name="verify_phone_change"),

    path('google/', GoogleLogin.as_view(), name='google_login'),
    path('logout/', CustomLogoutView.as_view(), name='custom_logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('', include('dj_rest_auth.urls')),
    path('registration/', CustomRegisterView.as_view(), name='custom_register'),

    # Tutor request View
    path('tutor-requests/', TutorRequestView.as_view(), name='tutor_requests'),
    path('tutor-requests/<int:request_id>/', TutorRequestDetailView.as_view(), name='tutor_request_detail'),
    path('tutor-requests/<int:tutor_id>/create/', CreateTutorRequest.as_view(), name='create_tutor_request'),
    path('tutor-requests/<int:request_id>/accept/', AcceptTutorRequestView.as_view(), name='accept_tutor_request'),
    path('tutor-requests/<int:request_id>/refuse/', RefuseTutorRequestView.as_view(), name='refuse_tutor_request'),
    path("unlock-lead/<int:request_id>/",UnlockLeadView.as_view(),name="unlock_lead"),

    # Parent Booking Management
    path("parent-requests/", ParentRequestsView.as_view(), name="parent_requests"),
    path("parent-requests/<int:request_id>/", UpdateDeleteBookingView.as_view(), name="update_delete_booking"),
    path("reviews/", ReviewListCreateView.as_view(), name="review_list_create"),
    path("tutor/reviews/", TutorReviewsView.as_view(), name="tutor_reviews"),
    path("account/delete/", DeleteAccountView.as_view(), name="delete_account"),
]