import json

from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response

from todo.models import Todo

from .serializers import TodoSerializer, TodoToggleCompleteSerializer


class TodoListCreate(generics.ListCreateAPIView):
    """GET  /api/todos/  列出当前用户的任务
    POST /api/todos/  新建任务（owner 由后端自动填入）
    """

    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(owner=self.request.user).order_by('-created_time')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TodoDetail(generics.RetrieveUpdateDestroyAPIView):
    """GET / PUT / PATCH / DELETE /api/todos/<id>/"""

    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 只允许操作自己的任务，别人的 id 一律 404
        return Todo.objects.filter(owner=self.request.user)


class TodoToggleComplete(generics.UpdateAPIView):
    """PUT /api/todos/<id>/complete/  在“完成/未完成”之间切换"""

    serializer_class = TodoToggleCompleteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.instance.is_completed = not serializer.instance.is_completed
        serializer.save()


class CustomAuthToken(ObtainAuthToken):
    """POST /api/api-token-auth/  {username, password} -> {token, user_id, username}"""

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
        })


@csrf_exempt
def signup(request):
    """POST /api/signup/  {username, password} -> 201 + token

    前端来自不同源、且没有 CSRF token，所以用 csrf_exempt；
    请求体解析做了容错，空 body 或非 JSON 会返回 400 JSON，而不是 500 ParseError。
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    try:
        data = json.loads(request.body or b'{}')
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({'error': 'Request body must be valid JSON'}, status=400)

    if not isinstance(data, dict):
        return JsonResponse({'error': 'Request body must be a JSON object'}, status=400)

    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    if not username or not password:
        return JsonResponse({'error': 'username and password are required'}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'username already taken'}, status=400)

    user = User.objects.create_user(username=username, password=password)
    token = Token.objects.create(user=user)
    return JsonResponse({
        'token': token.key,
        'user_id': user.pk,
        'username': user.username,
    }, status=201)
