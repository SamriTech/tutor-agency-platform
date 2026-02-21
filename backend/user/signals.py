from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import MyUser, StudentProfile, TutorProfile

@receiver(post_save, sender=MyUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'student':
            StudentProfile.objects.get_or_create(user=instance)
        elif instance.role == 'tutor':
            TutorProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=MyUser)
def save_user_profile(sender, instance, **kwargs):
    if instance.role == 'student':
        # Ensure profile exists before saving
        StudentProfile.objects.get_or_create(user=instance)
        instance.student_profile.save()
    elif instance.role == 'tutor':
        # Ensure profile exists before saving
        TutorProfile.objects.get_or_create(user=instance)
        instance.tutor_profile.save()
