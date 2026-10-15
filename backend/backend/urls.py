from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('todo.urls')),
    path('api/', include('api.urls')),
    # 内置登录登出页面
    path('accounts/', include('django.contrib.auth.urls')),
]