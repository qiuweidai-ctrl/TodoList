from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
# ✅ 关键！补上这一行导入action
from rest_framework.decorators import action
from todo.models import Todo
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['patch'])
    def complete(self, request, pk=None):
        todo = self.get_object()
        todo.is_completed = not todo.is_completed
        todo.save()
        return Response(TodoSerializer(todo).data)