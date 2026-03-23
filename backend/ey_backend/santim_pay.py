import requests
from django.conf import settings
import time
import jwt # PyJWT

class SantimPay:
    """
    A utility class to handle Santim Pay API requests.
    """
    MERCHANT_ID = getattr(settings, 'SANTIM_PAY_MERCHANT_ID', 'your_merchant_id')
    GATEWAY_TOKEN = getattr(settings, 'SANTIM_PAY_GATEWAY_TOKEN', 'your_gateway_token')
    PRIVATE_KEY = getattr(settings, 'SANTIM_PAY_PRIVATE_KEY', 'your_private_key')
    BASE_URL = "https://testapi.santimpay.com/api/v1" # Use production URL for live

    @classmethod
    def generate_token(cls, amount, tx_ref):
        """
        Generate a signed token for the payment request if required by Santim Pay.
        Note: Exact implementation depends on Santim Pay's specific JWT requirement.
        """
        payload = {
            "amount": amount,
            "paymentReference": tx_ref,
            "merchantId": cls.MERCHANT_ID,
            "iat": int(time.time())
        }
        return jwt.encode(payload, cls.PRIVATE_KEY, algorithm="RS256")

    @classmethod
    def initialize_payment(cls, amount, tx_ref, cancel_url, success_url, phone_number=None):
        """
        Initialize a payment with Santim Pay.
        """
        url = f"{cls.BASE_URL}/gateway/initiate-payment"
        headers = {
            "Authorization": f"Bearer {cls.GATEWAY_TOKEN}",
            "Content-Type": "application/json"
        }
        data = {
            "amount": float(amount),
            "paymentReference": tx_ref,
            "merchantId": cls.MERCHANT_ID,
            "cancelUrl": cancel_url,
            "successUrl": success_url,
            "reason": "Wallet Top-up",
        }
        if phone_number:
            data["phoneNumber"] = str(phone_number)

        response = requests.post(url, json=data, headers=headers)
        return response.json()

    @classmethod
    def verify_transaction(cls, tx_ref):
        """
        Verify a transaction with Santim Pay.
        """
        # Note: Santim Pay usually uses webhooks or a status check endpoint
        url = f"{cls.BASE_URL}/gateway/verify-payment/{tx_ref}"
        headers = {
            "Authorization": f"Bearer {cls.GATEWAY_TOKEN}"
        }
        response = requests.get(url, headers=headers)
        return response.json()
