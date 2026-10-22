from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404

from .models import Todo


# 第一节课的模板版 Todo 页面。字段名必须和 models.py 一致：
# owner / is_completed / created_time（之前写的 user / completed / created_at 并不存在，会直接报错）
@login_required
def todo_list(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        memo = request.POST.get('memo', '')
        Todo.objects.create(title=title, memo=memo, owner=request.user)
        return redirect('todo_list')

    todos = Todo.objects.filter(owner=request.user).order_by('-created_time')
    return render(request, 'todo/todo_list.html', {'todos': todos})


@login_required
def toggle(request, todo_id):
    todo = get_object_or_404(Todo, id=todo_id, owner=request.user)
    todo.is_completed = not todo.is_completed
    todo.save()
    return redirect('todo_list')


@login_required
def todo_delete(request, todo_id):
    todo = get_object_or_404(Todo, id=todo_id, owner=request.user)
    todo.delete()
    return redirect('todo_list')


@login_required
def todo_edit(request, todo_id):
    todo = get_object_or_404(Todo, id=todo_id, owner=request.user)
    if request.method == 'POST':
        todo.title = request.POST.get('title')
        todo.memo = request.POST.get('memo', '')
        todo.save()
        return redirect('todo_list')
    return render(request, 'edit.html', {'todo': todo})
