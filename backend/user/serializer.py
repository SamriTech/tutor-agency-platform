from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import UserDetailsSerializer
from dj_rest_auth.serializers import LoginSerializer
from phonenumber_field.serializerfields import PhoneNumberField
from .models import (MyUser, OTP, PasswordResetToken, Qualification, 
                    QualificationImage, Transaction,
                    Availability,Subject, Expertise,
                    StudentProfile, TutorProfile)
from rest_framework import serializers

class ExpertiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expertise
        fields = ['id', 'name']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['grade_level']

class TutorProfileSerializer(serializers.ModelSerializer):
    expertise = ExpertiseSerializer(many=True, read_only=True)
    subject = SubjectSerializer(many=True, read_only=True)
    
    class Meta:
        model = TutorProfile
        fields = [
            'bio', 'subject', 'hourly_rate', 
            'id_photo', 'title', 'expertise'
        ]

class CustomUserDetailSerializer(UserDetailsSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    tutor_profile = TutorProfileSerializer(read_only=True)
    
    class Meta:
        fields = [
            "id", "username", "first_name", "last_name", "email", 
            "is_phone_verified", "photo", "role", "location", 
            "student_profile", "tutor_profile"
        ]
        model = MyUser

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
        return data

class FinishSignupSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField(required=True)
    location = serializers.CharField(required=True)
    role = serializers.ChoiceField(choices=MyUser.ROLE_CHOICES, required=True)
    
    # Profile fields
    grade_level = serializers.CharField(required=False)
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True, required=False)
    hourly_rate = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    title = serializers.CharField(required=False)
    expertise = serializers.PrimaryKeyRelatedField(queryset=Expertise.objects.all(), many=True, required=False)
    bio = serializers.CharField(required=False)

    class Meta:
        model = MyUser
        fields = [
            'phone_number', 'location', 'role', 
            'grade_level', 'subject', 'hourly_rate', 
            'title', 'expertise', 'bio'
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
        subject = validated_data.pop('subject', [])
        hourly_rate = validated_data.pop('hourly_rate', None)
        title = validated_data.pop('title', None)
        expertise = validated_data.pop('expertise', [])
        bio = validated_data.pop('bio', None)

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
            profile.save()
            
            if subject:
                profile.subject.set(subject)
            if expertise:
                profile.expertise.set(expertise)

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