from rest_framework import serializers
from user.models import MyUser, Qualification, QualificationImage

class AdminUserVerificationSerializer(serializers.ModelSerializer):
    id_photo = serializers.ImageField(source='tutor_profile.id_photo', read_only=True)
    
    class Meta:
        model = MyUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'id_photo', 'is_id_verified']
        read_only_fields = ['id', 'username', 'first_name', 'last_name', 'email', 'id_photo']

class AdminQualificationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualificationImage
        fields = ['id', 'image']

class AdminQualificationVerificationSerializer(serializers.ModelSerializer):
    images = AdminQualificationImageSerializer(many=True, read_only=True)
    username = serializers.CharField(source='tutor.user.username', read_only=True)

    class Meta:
        model = Qualification
        fields = ['id', 'tutor', 'username', 'title', 'type', 'status', 'description', 'link', 'pdf', 'word_doc', 'images']
        read_only_fields = ['id', 'tutor', 'username', 'title', 'type', 'description', 'link', 'pdf', 'word_doc']
