from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # DRF 自带的登录/登出页面，方便直接打开 /api/todos/ 浏览接口
    path('api-auth/', include('rest_framework.urls')),
]
