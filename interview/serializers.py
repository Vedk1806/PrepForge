from rest_framework import serializers
from .models import Role, Question, UserProgress, UserNote
from django.contrib.auth.models import User


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)  # Nested Role inside Question (nice for frontend)

    class Meta:
        model = Question
        fields = '__all__'

# class UserProgressSerializer(serializers.ModelSerializer):
#     question = QuestionSerializer(read_only=True)  # Nested question details inside progress

#     class Meta:
#         model = UserProgress
#         fields = '__all__'

class UserProgressSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = UserProgress
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}}  # This line tells: "user is not required from frontend"



class UserNoteSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())  # FIXED!

    class Meta:
        model = UserNote
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}}  # This line tells: "user is not required from frontend"
