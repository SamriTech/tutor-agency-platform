from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import UserDetailsSerializer
from dj_rest_auth.serializers import LoginSerializer
from phonenumber_field.serializerfields import PhoneNumberField
from .models import (MyUser, OTP, PasswordResetToken, Qualification, 
                    QualificationImage, Transaction, Review,
                    Availability,Subject, Expertise,
                    StudentProfile, TutorProfile,TutoringRequest)
from rest_framework import serializers
from django.db.models import Avg, Count

class ExpertiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expertise
        fields = ['id', 'name']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name',"type"]

class StudentProfileSerializer(serializers.ModelSerializer):
    grade_level_name = serializers.CharField(source='grade_level.name', read_only=True)
    grade_level_id = serializers.IntegerField(source='grade_level.id', read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = ['grade_level', 'grade_level_name', 'grade_level_id']

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'reviewer_name', 'reviewee', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']



class QualificationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualificationImage
        fields = ['id', 'image']

class QualificationSerializer(serializers.ModelSerializer):
    images = QualificationImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )

    class Meta:
        model = Qualification
        fields = [
            'id', 'tutor', 'title', 'type', 'status', 
            'description', 'link', 'pdf', 'word_doc', 
            'images', 'uploaded_images'
        ]
        read_only_fields = ['tutor', 'status']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        qualification = Qualification.objects.create(**validated_data)
        for image in uploaded_images:
            QualificationImage.objects.create(qualification=qualification, image=image)
        return qualification

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        instance = super().update(instance, validated_data)
        if uploaded_images:
            for image in uploaded_images:
                QualificationImage.objects.create(qualification=instance, image=image)
        return instance

class AvailabilitySerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = Availability
        fields = ['id', 'tutor', 'day_of_week', 'day_name', 'start_time', 'end_time']
        read_only_fields = ['tutor']
class TutorProfileSerializer(serializers.ModelSerializer):
    expertise = ExpertiseSerializer(many=True, read_only=True)
    qualifications = serializers.SerializerMethodField()
    availabilities = AvailabilitySerializer(many=True, read_only=True)
    
    def get_qualifications(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and (request.user.is_superuser or request.user == obj.user):
            return QualificationSerializer(obj.qualifications.all(), many=True).data
        return QualificationSerializer(obj.qualifications.filter(status='approved'), many=True).data
    
    class Meta:
        model = TutorProfile
        fields = [
            'bio', 'hourly_rate', 
            'id_photo', 'title', 'expertise',
            'qualifications', 'availabilities'
        ]
class CustomUserDetailSerializer(UserDetailsSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    tutor_profile = TutorProfileSerializer(read_only=True)
    subject = SubjectSerializer(many=True, read_only=True)
    rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    reviews_received = ReviewSerializer(many=True, read_only=True)
    
    role = serializers.SerializerMethodField()
    id_verification_status = serializers.CharField(source='tutor_profile.id_verification_status', read_only=True)

    class Meta:
        fields = [
            "id", "username", "first_name", "last_name", "email", 
            "is_phone_verified", "photo", "role", "location", "subject",
            "student_profile", "tutor_profile", "rating", "reviews_count",
            "reviews_received", "phone_number","balance",
            "id_verification_status"
        ]
        model = MyUser

    def get_rating(self, obj):
        avg_rating = obj.reviews_received.aggregate(Avg('rating'))['rating__avg']
        return avg_rating if avg_rating is not None else 0

    def get_reviews_count(self, obj):
        return obj.reviews_received.count()

    def get_role(self, obj):
        if obj.is_superuser:
            return 'admin'
        return obj.role


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['user', 'status', 'reference', 'created_at']

class CustomLoginSerializer(LoginSerializer):
    def to_internal_value(self, data):
        internal_value = super().to_internal_value(data) 
        return internal_value

class CustomRegisterSerializer(RegisterSerializer):
    first_name=serializers.CharField()
    last_name=serializers.CharField()
    location = serializers.CharField(required=True)
    phone_number = PhoneNumberField(required=True)
    role = serializers.ChoiceField(choices=MyUser.ROLE_CHOICES, required=True)
    password2 = None

    def validate(self, attrs):
        email = attrs.get('email')
        if email and MyUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": ["Email already exists"]})
        return attrs
    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['phone_number'] = self.validated_data.get('phone_number', '')
        data['location'] = self.validated_data.get('location', '')
        data['role'] = self.validated_data.get('role', 'student')
        data["email"] = self.validated_data.get("email","")
        data["first_name"] = self.validated_data.get("first_name","")
        data["last_name"] = self.validated_data.get("last_name","")

        return data

class FinishSignupSerializer(serializers.ModelSerializer):
    # Basic fields
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False)
    phone_number = PhoneNumberField(required=False)
    location = serializers.CharField(required=False)
    role = serializers.ChoiceField(choices=MyUser.ROLE_CHOICES, required=False)
    username = serializers.CharField(required=False)
    
    # Profile fields
    # Profile fields
    grade_level = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.filter(type='grade'), required=False, allow_null=True)
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True, required=False)
    hourly_rate = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    title = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    expertise = serializers.PrimaryKeyRelatedField(queryset=Expertise.objects.all(), many=True, required=False)
    bio = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    id_photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = MyUser
        fields = [
            'first_name', 'last_name', 'email', 'phone_number', 
            'location', 'role', 'grade_level', 'subject', 
            'hourly_rate', 'title', 'expertise', 'bio', 
            'id_photo', 'username'
        ]

    def validate(self, data):
        if data.get('role') == 'tutor':
            if not data.get('subject'):
                raise serializers.ValidationError({"subject": "Subject is required for tutors."})
            if not data.get('hourly_rate'):
                raise serializers.ValidationError({"hourly_rate": "Hourly rate is required for tutors."})
        return data

    def update(self, instance, validated_data):
        grade_level = validated_data.pop('grade_level', None)
        subject = validated_data.pop('subject', None)
        hourly_rate = validated_data.pop('hourly_rate', None)
        title = validated_data.pop('title', None)
        expertise = validated_data.pop('expertise', [])
        bio = validated_data.pop('bio', None)
        id_photo = validated_data.pop('id_photo', None)

        # Handle id_verification_status if id_photo is uploaded
        if id_photo and instance.role == 'tutor':
            instance.tutor_profile.id_verification_status = 'pending'
            instance.tutor_profile.save()

        instance = super().update(instance, validated_data)

        if instance.role == 'student' and grade_level:
            profile = instance.student_profile
            profile.grade_level = grade_level
            profile.save()
        elif instance.role == 'tutor':
            profile = instance.tutor_profile
            if hourly_rate: profile.hourly_rate = hourly_rate
            if title: profile.title = title
            if bio: profile.bio = bio
            if id_photo: profile.id_photo = id_photo
            profile.save()
            
            if expertise:
                profile.expertise.set(expertise)

        if subject is not None:
            instance.subject.set(subject)

        return instance

class CustomPasswordResetSerializer(serializers.Serializer):
    phone = PhoneNumberField(region="ET")
    def save(self,*args,**kwargs):
        user = MyUser.objects.filter(phone_number=self.validated_data.get("phone"))
        if(user.exists()):
            otp_obj,created = OTP.objects.get_or_create(user=user.first())
            print(otp_obj.code)
            return {"status":"success","message":"otp sent"}
        else:
            return {"status":"error","message":"The account does not exist"}

class PasswordRestTokenSeriailzer(serializers.Serializer):
    code = serializers.CharField()
    def save(self,*args,**kwargs):
        otp_obj = OTP.objects.filter(code=self.validated_data.get("code"))
        if(otp_obj.exists()):
            otp_obj,created = PasswordResetToken.objects.get_or_create(otp=otp_obj.first())
            return {"status":"success","message":"Everything works","token":otp_obj.code}
        else:
            return {"status":"error","message":"otp could't be verified"}

class ChangePasswordSerailzer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password =serializers.CharField(required=True)
    confirm_password =serializers.CharField(required=True)

    def validate(self,data):
        if(data.get("password") != data.get("confirm_password")):
            return serializers.ValidationError("Passwords dont match")
        return data


class ProfileChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data.get("new_password") != data.get("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords don't match"})
        return data

class PhoneChangeRequestSerializer(serializers.Serializer):
    phone_number = PhoneNumberField(required=True)

    def validate_phone_number(self, value):
        if MyUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("This phone number is already in use.")
        return value

class PhoneChangeVerifySerializer(serializers.Serializer):
    code = serializers.CharField(required=True)

class TutoringRequestSerializer(serializers.ModelSerializer):
    parent_name = serializers.SerializerMethodField()
    parent_photo = serializers.SerializerMethodField()
    is_unlocked = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()
    tutor_name = serializers.SerializerMethodField()
    tutor_photo = serializers.SerializerMethodField()
    has_review = serializers.SerializerMethodField()
    parent_phone = serializers.SerializerMethodField()
    parent_email = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    grade = serializers.SerializerMethodField()
    review_rating = serializers.SerializerMethodField()
    review_comment = serializers.SerializerMethodField()

    class Meta:
        model = TutoringRequest
        fields = [
            'id', 'tutor', 'description', 
            'created_at', 'is_active', 'parent_name', 
            'parent_photo', 'is_unlocked', 'has_review', 'subject_name',
            'seen', 'tutor_name', 'tutor_photo',
            'parent_phone', 'parent_email', 'location', 'grade',
            'review_rating', 'review_comment'
        ]

    def get_parent_name(self, obj):
        return f"{obj.parent.first_name} {obj.parent.last_name}".strip() or obj.parent.username

    def get_parent_photo(self, obj):
        if obj.parent.photo:
            return obj.parent.photo.url
        return None

    def get_parent_phone(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Show if it's the parent themselves OR a tutor who unlocked the lead
            if request.user == obj.parent or obj.purchased_by.filter(tutor=request.user).exists():
                return obj.parent.phone_number.as_international
        return "********"

    def get_parent_email(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user == obj.parent or obj.purchased_by.filter(tutor=request.user).exists():
                return obj.parent.email
        return "********@****.***"

    def get_location(self, obj):
        return obj.parent.location or 'Not specified'

    def get_grade(self, obj):
        if hasattr(obj.parent, 'student_profile') and obj.parent.student_profile.grade_level:
            return obj.parent.student_profile.grade_level.name
        return 'Not specified'

    def get_tutor_name(self, obj):
        return f"{obj.tutor.first_name} {obj.tutor.last_name}".strip() or obj.tutor.username

    def get_tutor_photo(self, obj):
        if obj.tutor.photo:
            return obj.tutor.photo.url
        return None

    def get_is_unlocked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.purchased_by.filter(tutor=request.user).exists()
        return False

    def get_has_review(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Review.objects.filter(reviewer=request.user, reviewee=obj.tutor).exists()
        return False

    def get_subject_name(self, obj):
        subject = obj.parent.subject.first()
        return subject.name if subject else "General Tutoring"

    def get_review_rating(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            review = Review.objects.filter(reviewer=request.user, reviewee=obj.tutor).first()
            return review.rating if review else None
        return None

    def get_review_comment(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            review = Review.objects.filter(reviewer=request.user, reviewee=obj.tutor).first()
            return review.comment if review else None
        return None