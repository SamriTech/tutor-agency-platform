from django.utils import timezone
from rest_framework.response import Response

def verify_phone_util(request,otp_obj,callback):
    if(otp_obj.exists()):
        if(otp_obj.first().expire_date > timezone.now()):
            if(otp_obj.first().code == request.data.get("otp")):
                return callback()
            else:
                return Response({"status":"error","messsage":"Wrong OTP"},status=401)  
        else:
            return Response({"status":"error","messsage":"OTP expired"},status=401)
    else:
        return Response({"status":"error","messsage":"User didn't ask for OTP"},status=401)