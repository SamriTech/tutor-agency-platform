from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth.hashers import make_password
import secrets
from .models import OTP

class CustomAccountAdapter(DefaultAccountAdapter):
    def send_confirmation_mail(self, request, emailconfirmation, signup):
        user = emailconfirmation.email_address.user
        if hasattr(user, 'phone_number') and user.phone_number:
            otp_obj, created = OTP.objects.get_or_create(user=user)
            code = otp_obj.code
            self.send_verification_code_sms(user, str(user.phone_number), code)
        else:
            super().send_confirmation_mail(request, emailconfirmation, signup)

    def save_user(self, request, user, form, commit=True):
        user = super().save_user(request, user, form, commit=False)
        data = form.get_cleaned_data()
        user.phone_number = data.get('phone_number')
        user.location = data.get('location')
        user.role = data.get('role')
        if not user.email or user.email == "":
            user.email = None
        user.save()
        if user.phone_number:
            otp_obj, created = OTP.objects.get_or_create(user=user)
            self.send_verification_code_sms(user, str(user.phone_number), otp_obj.code)
        return user
    def send_verification_code_sms(self, user, phone, code, **kwargs):
        import requests
        import os
        
        sms_key = os.getenv("SMS_KEY")
        if not sms_key:
            print(f"SMS_KEY not found in environment. Code for {phone}: {code}")
            return

        try:
            url = "https://smsethiopia.et/api/sms/send"
            clean_phone = phone[1:]
            payload = {
                "msisdn": clean_phone,
                "text": f"Your Hytor verification code is: {code}",
            }
            
            response = requests.post(url, json=payload, headers={"KEY": sms_key,"Content-Type": "application/json"})
            response.raise_for_status()
            print(f"SMS sent successfully to {clean_phone} - {code}")
        except Exception as e:
            print(f"Failed to send SMS to {phone}: {str(e)}")

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_auto_signup_allowed(self, request, sociallogin):
        return True

    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        
        extra_data = sociallogin.account.extra_data
        if sociallogin.account.provider == "google":
            picture = extra_data.get("picture")
            if picture:
                user.photo = picture
        
        # Ensure we have a username if allauth didn't provide one
        if not user.username:
            email = extra_data.get('email', '')
            user.username = email.split('@')[0] if email else f"user_{secrets.token_hex(4)}"
        
        # Set a random password for social users
        if not user.password:
            user.password = make_password(secrets.token_urlsafe(16))
            
        user.save()
        return user