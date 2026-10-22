from django.contrib import admin
from .models import Todo

# 中文注释：配置Todo模型在Django后台的展示字段
class TodoAdmin(admin.ModelAdmin):
    # 列表页面展示的字段：标题、备注、创建时间、是否完成、所属用户
    list_display = ('title', 'memo', 'created_time', 'is_completed', 'owner')
    # 支持按是否完成筛选
    list_filter = ('is_completed',)

admin.site.register(Todo, TodoAdmin)