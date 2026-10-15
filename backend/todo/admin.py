from django.contrib import admin
from .models import Todo

# 在后台注册Todo模型，后台页面可以管理任务
@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    # 后台列表页面展示的字段
    list_display = ('title', 'memo', 'created_at', 'completed', 'user')
    # 支持按照完成状态筛选
    list_filter = ('completed',)
    # 搜索框，可以按标题搜索任务
    search_fields = ('title', 'memo')