from django.urls import path, include
from .views import *

urlpatterns = [
    path("finish-signup/", FinishSignupView.as_view(), name="finish_signup"),
    
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

    path("wallet/", BalanceTransactionView.as_view(), name="balance_transactions"),
    path("wallet/deposit/", DepositView.as_view(), name="deposit"),
    path("wallet/withdraw/", WithdrawView.as_view(), name="withdraw"),
    path("wallet/verify/<str:tx_ref>/", PaymentVerifyView.as_view(), name="payment_verify"),

    ## password reset views
    path('password/reset/', PasswordResetView.as_view(), name="start_password_reset"),
    path("password/reset/verify", PasswordResetOTPVerify.as_view(), name="password_reset_otp"),
    path("changepassword", ChangePasswordView.as_view(), name="passwordchange"),
    
    path("verifyotp", VerifyCode.as_view(), name="verify_otp_code"),
    path("resend-otp/", ResendOTPView.as_view(), name="resend_otp"),
    path('google/', GoogleLogin.as_view(), name='google_login'),
    path('logout/', CustomLogoutView.as_view(), name='custom_logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('', include('dj_rest_auth.urls')),
    path('registration/', CustomRegisterView.as_view(), name='custom_register'),
]