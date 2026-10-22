from django.db import models
from django.contrib.auth.models import User

class Todo(models.Model):
    # Task title
    title = models.CharField(max_length=200, verbose_name="Task Title")
    # Memo content
    memo = models.TextField(blank=True, verbose_name="Memo")
    # Auto save create time
    created_time = models.DateTimeField(auto_now_add=True, verbose_name="Created Time")
    # Is task completed
    is_completed = models.BooleanField(default=False, verbose_name="Is Completed")
    # Belong to user, foreign key to User, 修改related_name避免冲突
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="api_todo_items", verbose_name="Owner")

    def __str__(self):
        # Show title in django admin page
        return self.titles