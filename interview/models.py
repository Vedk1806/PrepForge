from django.db import models
from django.contrib.auth.models import User

# Role Model (Example: SDE-1, Frontend Developer, Data Engineer)
class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

# Question Model
class Question(models.Model):
    role = models.ForeignKey(Role, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    difficulty = models.CharField(max_length=50, choices=[('Easy', 'Easy'), ('Medium', 'Medium'), ('Hard', 'Hard')])
    source = models.CharField(max_length=255, blank=True)  # Optional: Company name or custom
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]  # First 50 characters of question

# User Progress Model
class UserProgress(models.Model):
    STATUS_CHOICES = [
        ('Not Started', 'Not Started'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Bookmarked', 'Bookmarked'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Not Started')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'question')  # One progress per user-question pair

    def __str__(self):
        return f"{self.user.username} - {self.question.text[:30]} - {self.status}"

# User Notes Model
class UserNote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'question')  # One note per user-question pair

    def __str__(self):
        return f"Note by {self.user.username} on {self.question.text[:30]}"
