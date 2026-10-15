from django.contrib.auth.models import User
from django.db import models

# Todo任务模型，补齐memo、created_at、user字段
class Todo(models.Model):
    title = models.CharField(max_length=100)  # 任务标题，最大100字符
    memo = models.TextField(blank=True)       # 任务备注，允许为空
    created_at = models.DateTimeField(auto_now_add=True) # 创建时自动记录当前时间
    completed = models.BooleanField(default=False) # 是否完成，默认False未完成
    # null=True：数据库层面允许为空，解决旧数据迁移报错
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title