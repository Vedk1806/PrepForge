from django.contrib import admin
from .models import Role, Question, UserProgress, UserNote

admin.site.register(Role)
admin.site.register(Question)
admin.site.register(UserProgress)
admin.site.register(UserNote)
