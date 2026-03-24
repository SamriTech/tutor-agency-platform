from django.contrib import admin
from .models import (MyUser,OTP,PasswordResetToken,Qualification,
                    QualificationImage,Availability,Expertise,Subject,
                    StudentProfile,TutorProfile,Review,TutoringRequest,Transaction)
# Register your models here.
@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user',)
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'reviewee', 'rating', 'comment')

@admin.register(TutoringRequest)
class TutoringRequestAdmin(admin.ModelAdmin):
    list_display = ("description","parent","tutor")
@admin.register(Expertise)
class ExpertiseAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name',)
@admin.register(Qualification)
class QualificationAdmin(admin.ModelAdmin):
    list_display = ('tutor', 'title', 'type', 'status')

@admin.register(QualificationImage)
class QualificationImageAdmin(admin.ModelAdmin):
    list_display = ('qualification', 'image')

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('tutor', 'day_of_week', 'start_time', 'end_time')

@admin.register(MyUser)
class MyUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff')

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'expire_date')

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('otp', 'code', 'expire_date')

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'grade_level')

@admin.register(TutorProfile)
class TutorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio', 'hourly_rate')
