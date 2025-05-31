from django.urls import path
from .views import RoleListView, QuestionListView, UserProgressListCreateView, UserProgressDetailView, UserNoteListCreateView, UserNoteDetailView
from .views import register_user
from .views import ask_ai



urlpatterns = [
    path('roles/', RoleListView.as_view(), name='role-list'),
    path('questions/<int:role_id>/', QuestionListView.as_view(), name='question-list'),
    path('progress/', UserProgressListCreateView.as_view(), name='userprogress-list-create'),
    path('progress/<int:pk>/', UserProgressDetailView.as_view(), name='userprogress-detail'),
    path('notes/', UserNoteListCreateView.as_view(), name='usernote-list-create'),
    path('notes/<int:pk>/', UserNoteDetailView.as_view(), name='usernote-detail'),
    path('register/', register_user, name='register_user'),
    path('ask-ai/', ask_ai, name='ask-ai'),

]
