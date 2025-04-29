from rest_framework import generics, permissions
from .models import Role, Question, UserProgress, UserNote
from .serializers import RoleSerializer, QuestionSerializer, UserProgressSerializer, UserNoteSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework import status



# List all Roles
class RoleListView(generics.ListAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.AllowAny]

# List all Questions for a given Role ID
class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        role_id = self.kwargs['role_id']
        return Question.objects.filter(role_id=role_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        user_id = request.GET.get('user', 1)  # defaulting to user=1 for now

        results = []
        for question in queryset:
            try:
                progress = UserProgress.objects.get(user_id=user_id, question=question)
                status = progress.status
            except UserProgress.DoesNotExist:
                status = None

            results.append({
                'id': question.id,
                'text': question.text,
                'difficulty': question.difficulty,
                'status': status,
            })

        return Response(results)

class UserProgressListCreateView(generics.ListCreateAPIView):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]  # AllowAny for now

    def post(self, request, *args, **kwargs):
        user = request.data.get('user')
        question = request.data.get('question')
        status_text = request.data.get('status')

        try:
            progress = UserProgress.objects.get(user=user, question=question)
            # 🔥 If exists, update status
            progress.status = status_text
            progress.save()
            return Response({'message': 'Progress updated successfully!'})
        except UserProgress.DoesNotExist:
            # 🔥 If does not exist, create new
            return self.create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserProgressDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

# Manage User Notes (List/Create/Update/Delete)
class UserNoteListCreateView(generics.ListCreateAPIView):
    serializer_class = UserNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        question_id = self.request.query_params.get('question')
        user = self.request.user
        if question_id:
            return UserNote.objects.filter(user=user, question_id=question_id)
        return UserNote.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # 🔥 Automatically assign user


# class UserProgressListCreateView(generics.ListCreateAPIView):
#     queryset = UserProgress.objects.all()
#     serializer_class = UserProgressSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         question_id = self.request.query_params.get('question')
#         user = self.request.user
#         if question_id:
#             return UserProgress.objects.filter(user=user, question_id=question_id)
#         return UserProgress.objects.filter(user=user)

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)



class UserNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserNote.objects.all()
    serializer_class = UserNoteSerializer
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password1 = request.data.get('password1')
    password2 = request.data.get('password2')

    if password1 != password2:
        return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password1)
    user.save()

    return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
