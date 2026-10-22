from django.urls import path

from . import views

urlpatterns = [
    path('', views.todo_list, name='todo_list'),
    path('<int:todo_id>/toggle/', views.toggle, name='toggle'),
    path('<int:todo_id>/delete/', views.todo_delete, name='delete'),
    path('<int:todo_id>/edit/', views.todo_edit, name='edit'),
]
