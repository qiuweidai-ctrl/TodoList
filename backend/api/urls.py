from django.urls import path
from . import views

urlpatterns = [
    # 获取列表 + 创建新任务
    path('todos/', views.TodoListCreate.as_view()),
    # 单条：读取/修改/删除，pk是任务id
    path('todos/<int:pk>/', views.TodoRetrieveUpdateDestroy.as_view()),
]