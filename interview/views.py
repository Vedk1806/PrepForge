from rest_framework import generics, permissions
from .models import Role, Question, UserProgress, UserNote
from .serializers import RoleSerializer, QuestionSerializer, UserProgressSerializer, UserNoteSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated



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

# Manage User Progress (List/Create/Update/Delete)
# class UserProgressListCreateView(generics.ListCreateAPIView):
#     queryset = UserProgress.objects.all()
#     serializer_class = UserProgressSerializer
#     permission_classes = [permissions.IsAuthenticated] # this is commented, to use it after auth is made active.

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
    queryset = UserNote.objects.all()
    serializer_class = UserNoteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        mutable_request_data = request.data.copy()
        mutable_request_data['user'] = request.user.id  # 🔥 Inject the user ID into the validated data
        serializer = self.get_serializer(data=mutable_request_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)


class UserNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserNote.objects.all()
    serializer_class = UserNoteSerializer
    permission_classes = [IsAuthenticated]
