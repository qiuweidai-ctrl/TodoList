from django.urls import path

from .views import (
    CustomAuthToken,
    TodoDetail,
    TodoListCreate,
    TodoToggleComplete,
    signup,
)

urlpatterns = [
    # 注册
    path('signup/', signup, name='signup'),

    # 登录取 token（前端 services/todos.js 用的就是 api-token-auth/）
    path('api-token-auth/', CustomAuthToken.as_view(), name='api_token_auth'),
    # 兼容课本里提到的另一个写法
    path('token/', CustomAuthToken.as_view(), name='api_token_auth_alt'),

    # 任务的增删改查
    path('todos/', TodoListCreate.as_view(), name='todo-list'),
    path('todos/<int:pk>/', TodoDetail.as_view(), name='todo-detail'),
    path('todos/<int:pk>/complete/', TodoToggleComplete.as_view(), name='todo-complete'),
]
