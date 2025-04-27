from rest_framework import generics, permissions
from .models import Role, Question, UserProgress, UserNote
from .serializers import RoleSerializer, QuestionSerializer, UserProgressSerializer, UserNoteSerializer
from rest_framework.response import Response


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

# Manage User Progress (List/Create/Update/Delete)
# class UserProgressListCreateView(generics.ListCreateAPIView):
#     queryset = UserProgress.objects.all()
#     serializer_class = UserProgressSerializer
#     permission_classes = [permissions.IsAuthenticated]
class UserProgressListCreateView(generics.ListCreateAPIView):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = []  # AllowAny for now

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


class UserProgressDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

# Manage User Notes (List/Create/Update/Delete)
class UserNoteListCreateView(generics.ListCreateAPIView):
    queryset = UserNote.objects.all()
    serializer_class = UserNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserNote.objects.all()
    serializer_class = UserNoteSerializer
    permission_classes = [permissions.IsAuthenticated]
