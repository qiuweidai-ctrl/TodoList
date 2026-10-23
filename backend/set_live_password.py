"""Step 1: set the password of the existing live `newuser123` to 1234.

Run this ON PythonAnywhere in the Bash console:

    source ~/.virtualenvs/todo_venv/bin/activate
    cd ~/TodoList/backend
    python set_live_password.py

It uses PythonAnywhere's own Django, so it needs no network access.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# these normally come from the WSGI file; defaults are fine for a CLI script
os.environ.setdefault("DJANGO_ALLOWED_HOSTS", "qiuweidai.pythonanywhere.com")

import django  # noqa: E402

django.setup()

from django.contrib.auth.models import User  # noqa: E402

USERNAME = "newuser123"
PASSWORD = "1234"

try:
    user = User.objects.get(username=USERNAME)
except User.DoesNotExist:
    user = User.objects.create_superuser(USERNAME, "", PASSWORD)
    print(f"created user {USERNAME}")
else:
    user.set_password(PASSWORD)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print(f"reset password for existing user {USERNAME}")

user.refresh_from_db()
print("username:", user.username)
print("is_superuser:", user.is_superuser)
print("password ok:", user.check_password(PASSWORD))
print("todos owned:", user.todo_set.count())
