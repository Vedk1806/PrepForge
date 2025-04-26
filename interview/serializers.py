from rest_framework import serializers
from .models import Role, Question, UserProgress, UserNote

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)  # Nested Role inside Question (nice for frontend)

    class Meta:
        model = Question
        fields = '__all__'

class UserProgressSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)  # Nested question details inside progress

    class Meta:
        model = UserProgress
        fields = '__all__'

class UserNoteSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)

    class Meta:
        model = UserNote
        fields = '__all__'
