from django.urls import path
from . import views

urlpatterns = [
    path('', views.todo_list, name='todo_list'),
    path('toggle/<int:todo_id>/', views.toggle, name="toggle"),
    path('delete/<int:todo_id>/', views.todo_delete, name="delete"),
    path('edit/<int:todo_id>/', views.todo_edit, name="edit"),
]