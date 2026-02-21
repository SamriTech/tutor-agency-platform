from django.db import models
from django.contrib.auth.models import AbstractUser,UserManager
from phonenumber_field.modelfields import PhoneNumberField
from allauth.account.adapter import generate_user_code
from django.utils import timezone
# Create your models here.

class Expertise(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name
class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class MyManager(UserManager):
    def create_user(self,username,email,password=None,**extra_fields):
        if not username:
            raise ValueError("The username must be set")
        user=self.model(username=username,email=email,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self,username,email,password=None,**extra_fields):
        extra_fields.setdefault("is_staff",True)
        extra_fields.setdefault("is_superuser",True)
        return self.create_user(username,email,password,**extra_fields)

def user_directory_path(instance, filename):
    now = timezone.now()
    new_filename = filename.split(".")[0] + "_" + now.strftime("%Y%m%d%H%M%S") + "." + filename.split(".")[1]
    return f'users/{instance.id}/{new_filename}'
class MyUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('tutor', 'Tutor'),
    ]
    phone_number = PhoneNumberField(max_length=15, unique=True, null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    is_id_verified = models.BooleanField(default=False)
    email = models.EmailField(unique=True,blank=True,null=True)
    photo = models.ImageField(upload_to=user_directory_path, default='defaults/default.jpg',null=True, blank=True)
    
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    location = models.CharField(max_length=255,blank=True)
    
    objects = MyManager()
    USERNAME_FIELD = "username"

class StudentProfile(models.Model):
    user = models.OneToOneField(MyUser, on_delete=models.CASCADE, related_name='student_profile')
    grade_level = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"Student Profile for {self.user.username}"

class TutorProfile(models.Model):
    user = models.OneToOneField(MyUser, on_delete=models.CASCADE, related_name='tutor_profile')
    bio = models.TextField(blank=True, null=True)
    subject = models.ManyToManyField(Subject)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    id_photo = models.ImageField(upload_to='users/ids/', null=True, blank=True)
    title = models.CharField(max_length=100, null=True, blank=True, help_text="e.g. Physics Specialist")
    expertise = models.ManyToManyField(Expertise, blank=True, related_name='tutor_profiles')

    def __str__(self):
        return f"Tutor Profile for {self.user.username}"

class Qualification(models.Model):
    QUALIFICATION_TYPES = [
        ('education', 'Education'),
        ('award', 'Award'),
        ('certificate', 'Certificate'),
        ('work_experience', 'Work Experience'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='qualifications')
    title = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(max_length=20, choices=QUALIFICATION_TYPES, default='education')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    description = models.TextField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    pdf = models.FileField(upload_to='qualifications/pdfs/', blank=True, null=True)
    word_doc = models.FileField(upload_to='qualifications/docs/', blank=True, null=True)

    def __str__(self):
        return f"{self.type.title()} of {self.tutor.user.username}: {self.title} ({self.status})"

class QualificationImage(models.Model):
    qualification = models.ForeignKey(Qualification, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='qualifications/images/')

class Review(models.Model):
    reviewer = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='reviews_given')
    reviewee = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='reviews_received')
    rating = models.PositiveSmallIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('reviewer', 'reviewee')

    def __str__(self):
        return f"Review from {self.reviewer.username} to {self.reviewee.username}: {self.rating}"

def expire_time():
    return  timezone.now() + timezone.timedelta(minutes=10)
class OTP(models.Model):
    user = models.ForeignKey(MyUser,on_delete=models.CASCADE)
    code =models.CharField(max_length=25,default=generate_user_code) 
    expire_date = models.DateTimeField(default=expire_time)
class Availability(models.Model):
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='availabilities')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        verbose_name_plural = "Availabilities"
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        return f"{self.tutor.user.username} - {self.get_day_of_week_display()} {self.start_time} to {self.end_time}"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdraw', 'Withdraw'),
        ('payment', 'Payment'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} for {self.user.username} ({self.status})"

def generate_token():
    return generate_user_code(50)
class PasswordResetToken(models.Model):
    otp = models.ForeignKey(OTP,on_delete=models.CASCADE)
    code =models.CharField(max_length=200,default=generate_token) 
    expire_date = models.DateTimeField(default=expire_time)