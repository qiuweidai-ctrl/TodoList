from rest_framework import serializers

from todo.models import Todo


class TodoSerializer(serializers.ModelSerializer):
    """任务的完整序列化器：列出、新增、修改、删除都用它。"""

    class Meta:
        model = Todo
        # 字段名必须和 todo/models.py 完全一致（is_completed / created_time）
        fields = ['id', 'title', 'memo', 'is_completed', 'created_time']
        read_only_fields = ['id', 'created_time']


class TodoToggleCompleteSerializer(serializers.ModelSerializer):
    """只用于“切换完成状态”接口，所有业务字段只读，状态由后端取反。"""

    class Meta:
        model = Todo
        fields = ['id', 'title', 'memo', 'is_completed', 'created_time']
        read_only_fields = ['id', 'title', 'memo', 'created_time']
