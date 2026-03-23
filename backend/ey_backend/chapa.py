import requests
from django.conf import settings
import uuid

class Chapa:
    """
    A utility class to handle Chapa API requests.
    """
    SECRET_KEY = settings.CHAPA_SECRET_KEY
    BASE_URL = "https://api.chapa.co/v1"

    @classmethod
    def initialize_payment(cls, amount, email, first_name, last_name, tx_ref, callback_url=None, return_url=None):
        """
        Initialize a payment and get the checkout URL.
        """
        url = f"{cls.BASE_URL}/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {cls.SECRET_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "amount": str(amount),
            "currency": "ETB",
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "tx_ref": tx_ref,
            "callback_url": callback_url,
            "return_url": return_url,
        }
        response = requests.post(url, json=data, headers=headers)
        return response.json()

    @classmethod
    def verify_transaction(cls, tx_ref):
        """
        Verify a transaction with Chapa.
        """
        url = f"{cls.BASE_URL}/transaction/verify/{tx_ref}"
        headers = {
            "Authorization": f"Bearer {cls.SECRET_KEY}"
        }
        response = requests.get(url, headers=headers)
        return response.json()

    @classmethod
    def transfer(cls, account_name, account_number, amount, bank_code, reference):
        """
        Initiate a transfer to a bank account.
        """
        url = f"{cls.BASE_URL}/transfer"
        headers = {
            "Authorization": f"Bearer {cls.SECRET_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "account_name": account_name,
            "account_number": account_number,
            "amount": str(amount),
            "currency": "ETB",
            "beneficiary_name": account_name,
            "reference": reference,
            "bank_code": bank_code
        }
        response = requests.post(url, json=data, headers=headers)
        return response.json()
