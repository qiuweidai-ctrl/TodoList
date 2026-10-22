"""api 接口的回归测试。

运行：
    python manage.py test api -v 2

覆盖：注册、重复注册、空请求体、登录取 token、未登录被拒、
      增删改查、完成状态切换、只能看到/操作自己的任务。
"""

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

import json

from todo.models import Todo


class TodoApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    # ---------- helpers ----------
    def signup(self, username="alice", password="pass12345"):
        return self.client.post(
            "/api/signup/",
            {"username": username, "password": password},
            format="json",
        )

    def login(self, username="alice", password="pass12345"):
        response = self.client.post(
            "/api/api-token-auth/",
            {"username": username, "password": password},
            format="json",
        )
        return response

    def auth(self, token):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token)

    def create_user_with_token(self, username="alice"):
        user = User.objects.create_user(username=username, password="pass12345")
        token, _ = Token.objects.get_or_create(user=user)
        return user, token.key

    # ---------- signup ----------
    def test_signup_creates_user_and_returns_token(self):
        response = self.signup()
        self.assertEqual(response.status_code, 201)
        payload = json.loads(response.content)
        self.assertIn("token", payload)
        self.assertTrue(User.objects.filter(username="alice").exists())
        self.assertTrue(Token.objects.filter(user__username="alice").exists())

    def test_signup_duplicate_username_returns_400(self):
        self.signup()
        response = self.signup()
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", json.loads(response.content))

    def test_signup_empty_body_returns_400_not_500(self):
        # 这就是之前 dy 里那个 ParseError 的场景：空 body 曾经直接 500
        response = self.client.post("/api/signup/", data="", content_type="application/json")
        self.assertIn(response.status_code, (400, 405))
        self.assertNotEqual(response.status_code, 500)

    def test_signup_invalid_json_returns_400(self):
        response = self.client.post(
            "/api/signup/", data="{not json", content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

    # ---------- login ----------
    def test_login_returns_token(self):
        self.signup()
        response = self.login()
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["username"], "alice")

    def test_login_wrong_password_returns_400(self):
        self.signup()
        response = self.login(password="wrong-password")
        self.assertEqual(response.status_code, 400)

    # ---------- auth guard ----------
    def test_todo_list_requires_authentication(self):
        response = self.client.get("/api/todos/")
        self.assertIn(response.status_code, (401, 403))

    # ---------- CRUD ----------
    def test_create_and_list_own_todos(self):
        user, token = self.create_user_with_token("alice")
        other, other_token = self.create_user_with_token("bob")
        Todo.objects.create(title="bob's task", owner=other)

        self.auth(token)
        created = self.client.post(
            "/api/todos/", {"title": "buy milk", "memo": "2 litres"}, format="json"
        )
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.data["is_completed"], False)
        self.assertEqual(Todo.objects.get(pk=created.data["id"]).owner, user)

        listed = self.client.get("/api/todos/")
        self.assertEqual(listed.status_code, 200)
        self.assertEqual(len(listed.data), 1)
        self.assertEqual(listed.data[0]["title"], "buy milk")

    def test_cannot_access_other_users_todo(self):
        _alice, alice_token = self.create_user_with_token("alice")
        bob, _bob_token = self.create_user_with_token("bob")
        bob_todo = Todo.objects.create(title="secret", owner=bob)

        self.auth(alice_token)
        self.assertEqual(self.client.get(f"/api/todos/{bob_todo.pk}/").status_code, 404)

    def test_update_and_delete_todo(self):
        _user, token = self.create_user_with_token()
        self.auth(token)
        todo = Todo.objects.create(title="old", owner=_user)

        updated = self.client.put(
            f"/api/todos/{todo.pk}/",
            {"title": "new title", "memo": "m", "is_completed": False},
            format="json",
        )
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(Todo.objects.get(pk=todo.pk).title, "new title")

        deleted = self.client.delete(f"/api/todos/{todo.pk}/")
        self.assertEqual(deleted.status_code, 204)
        self.assertFalse(Todo.objects.filter(pk=todo.pk).exists())

    # ---------- complete toggle ----------
    def test_complete_toggles_status_both_ways(self):
        user, token = self.create_user_with_token()
        self.auth(token)
        todo = Todo.objects.create(title="toggle me", owner=user)

        first = self.client.put(f"/api/todos/{todo.pk}/complete/", {}, format="json")
        self.assertEqual(first.status_code, 200)
        self.assertTrue(Todo.objects.get(pk=todo.pk).is_completed)

        second = self.client.put(f"/api/todos/{todo.pk}/complete/", {}, format="json")
        self.assertEqual(second.status_code, 200)
        self.assertFalse(Todo.objects.get(pk=todo.pk).is_completed)
