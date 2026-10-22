# TodoList

A full-stack todo application built with Django REST Framework and React
(complete project for Practicals 1–17).

- **Backend:** Django + DRF, token authentication, SQLite
- **Frontend:** React 18 + React Router 6 + React-Bootstrap + Axios

## Live deployment

| Part | URL |
| --- | --- |
| Frontend (Netlify) | https://venerable-entremet-f4ed6f.netlify.app |
| Backend (PythonAnywhere) | https://qiuweidai.pythonanywhere.com |
| Admin panel | https://qiuweidai.pythonanywhere.com/admin/ |

Step-by-step deployment instructions: [DEPLOY.md](DEPLOY.md).

## Project structure

```
TodoList/
├── backend/               Django project
│   ├── backend/           settings / urls / wsgi
│   ├── api/               REST endpoints (views, serializers, urls, tests)
│   ├── todo/              Todo model, Django admin, legacy template views
│   ├── scripts/api_demo.py  command-line smoke test (stdlib only)
│   └── manage.py
├── frontend/              React app
│   └── src/
│       ├── App.js         routing and login state
│       ├── components/    login / signup / todos-list / add-todo / todo
│       └── services/      axios wrappers around the API
└── todo_venv/             local virtualenv (not committed)
```

## Running locally

### 1. Backend

```bash
cd backend
# First time only: create and activate a virtualenv
python -m venv ../todo_venv
../todo_venv/Scripts/activate        # Windows
# source ../todo_venv/bin/activate   # macOS / Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser     # optional, for /admin/
python manage.py runserver
```

Backend runs at <http://127.0.0.1:8000>.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at <http://127.0.0.1:3000>. Sign up for an account before using it.

## API reference

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/signup/` | Register a user, returns a `token` |
| POST | `/api/api-token-auth/` | Log in, returns a `token` (alias: `/api/token/`) |
| GET | `/api/todos/` | List the current user's todos |
| POST | `/api/todos/` | Create a todo (`owner` is set by the backend) |
| GET | `/api/todos/<id>/` | Retrieve one todo |
| PUT / PATCH | `/api/todos/<id>/` | Update a todo |
| DELETE | `/api/todos/<id>/` | Delete a todo |
| PUT | `/api/todos/<id>/complete/` | Toggle the completed flag |

Every request except signup and login must send `Authorization: Token <token>`.

Todo fields: `id`, `title`, `memo`, `is_completed`, `created_time`.

## Tests

```bash
cd backend
python manage.py test api -v 2      # 11 API regression tests

# with the backend running, also try the command-line smoke test
python scripts/api_demo.py

cd ../frontend
CI=true npm test                    # component test
npm run build                       # production build
```

## Configuration (environment variables / backend/.env)

All environment-specific backend settings come from environment variables;
`backend/.env` is also supported (see `backend/.env.example`):

| Variable | Default | Description |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | dev placeholder | Must be replaced before deploying |
| `DJANGO_DEBUG` | `True` | Set to `False` in production |
| `DJANGO_ALLOWED_HOSTS` | `127.0.0.1,localhost` | Comma separated |
| `DJANGO_CORS_ORIGINS` | `localhost:3000,127.0.0.1:3000` | Frontend origin whitelist |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | empty | Needed for same-origin deployments |

The frontend API address is configured with `REACT_APP_API_URL`
(see `frontend/.env.example`); it defaults to `http://127.0.0.1:8000/api`.

## Deployment (Practicals 13–17)

Full instructions (PythonAnywhere backend, Netlify frontend, CORS) are in
**[DEPLOY.md](DEPLOY.md)**.

Quick overview:

1. Push the code to GitHub (this repository).
2. In a PythonAnywhere Bash console: `git clone` the repo, create a virtualenv
   and run `pip install -r backend/requirements.txt`.
3. On the Web tab create a new Web App and choose **Manual configuration**
   (not the Django option); pick the same Python version as the virtualenv.
4. Set both Source code and Working directory to `.../TodoList/backend`.
5. Point the WSGI file at `backend.wsgi` and set the environment variables:
   ```python
   os.environ["DJANGO_SECRET_KEY"] = "a generated random key"
   os.environ["DJANGO_DEBUG"] = "False"
   os.environ["DJANGO_ALLOWED_HOSTS"] = "yourname.pythonanywhere.com"
   ```
6. Run `python manage.py migrate` and `python manage.py collectstatic`, then Reload.
7. Build the frontend with `REACT_APP_API_URL=https://yourname.pythonanywhere.com/api npm run build`
   and drag the `build` folder into Netlify.
8. Back on PythonAnywhere, add the Netlify URL to `DJANGO_CORS_ORIGINS` and Reload.

## Troubleshooting

- **Login fails with "wrong username or password" even though the password is right.**
  The frontend probably moved to another port. When 3000 is taken, CRA falls back to
  3001, 3002, and so on, while the whitelist only listed 3000 — the browser then blocks
  the request and it looks like bad credentials. With `DEBUG=True` the backend now allows
  any `localhost` / `127.0.0.1` port; in production configure `DJANGO_CORS_ORIGINS` explicitly.
- **Login returns 404.** Make sure the API base URL ends with `/api` and that
  `/api/api-token-auth/` is correct, and that `runserver` is actually running.
- **CORS error in the browser console.** Add the frontend origin to `DJANGO_CORS_ORIGINS`.
- **API returns 401.** The `Authorization: Token <token>` header is missing, or the token
  was deleted.
- **You cannot see todos created by others (or in the admin).** Todos are isolated by
  `owner`: the API only returns rows belonging to the logged-in user.
