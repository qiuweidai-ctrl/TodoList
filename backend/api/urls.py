from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet

router = DefaultRouter()
# 必须写 basename="todo"！！
router.register(r'todos', TodoViewSet, basename="todo")

urlpatterns = [
    path('', include(router.urls)),
]