from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Todo

@login_required
def todo_list(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        memo = request.POST.get('memo')
        Todo.objects.create(title=title, memo=memo, user=request.user)
        return redirect('todo_list')

    todos = Todo.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'todo/todo_list.html', {'todos': todos})


@login_required
def toggle(request, todo_id):
    todo = get_object_or_404(Todo, id=todo_id, user=request.user)
    todo.completed = not todo.completed
    todo.save()
    return redirect('todo_list')


@login_required
def todo_delete(request, todo_id):
    todo = get_object_or_404(Todo, id=todo_id, user=request.user)
    todo.delete()
    return redirect('todo_list')


@login_required
def todo_edit(request, todo_id):
    todo = get_object_or_404(Todo, id=todo_id, user=request.user)
    if request.method == 'POST':
        todo.title = request.POST.get('title')
        todo.memo = request.POST.get('memo')
        todo.save()
        return redirect('todo_list')
    return render(request, 'todo/todo_edit.html', {'todo': todo})