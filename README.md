# TodoList

Django REST Framework + React 的全栈任务管理应用（Practical 1–14 的完整项目）。

- 后端：Django + DRF，Token 认证，SQLite
- 前端：React 19 + React Router + React-Bootstrap + Axios

## 目录结构

```
TodoList/
├── backend/               Django 项目
│   ├── backend/           settings / urls / wsgi
│   ├── api/               REST 接口（views / serializers / urls / 测试）
│   ├── todo/              Todo 模型 + Django 后台 + 旧的模板页面
│   ├── scripts/api_demo.py  命令行冒烟测试（纯标准库）
│   └── manage.py
├── frontend/              React 前端
│   └── src/
│       ├── App.js         路由与登录状态
│       ├── components/    login / signup / todos-list / add-todo / todo
│       └── services/      axios 封装的 API 调用
└── todo_venv/             本地虚拟环境（不入库）
```

## 本地运行

### 1. 后端

```bash
cd backend
# 首次：创建并激活虚拟环境
python -m venv ../todo_venv
../todo_venv/Scripts/activate        # Windows
# source ../todo_venv/bin/activate   # macOS / Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser     # 可选，用于 /admin/
python manage.py runserver
```

后端地址：<http://127.0.0.1:8000>

### 2. 前端

```bash
cd frontend
npm install
npm start
```

前端地址：<http://127.0.0.1:3000>，浏览器打开后先注册账号再使用。

## API 一览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/signup/` | 注册，返回 `token` |
| POST | `/api/api-token-auth/` | 登录，返回 `token`（别名 `/api/token/`） |
| GET | `/api/todos/` | 当前用户的任务列表 |
| POST | `/api/todos/` | 新建任务（`owner` 由后端填充） |
| GET | `/api/todos/<id>/` | 单条任务 |
| PUT / PATCH | `/api/todos/<id>/` | 修改任务 |
| DELETE | `/api/todos/<id>/` | 删除任务 |
| PUT | `/api/todos/<id>/complete/` | 切换完成状态 |

除注册和登录外，所有请求都要带请求头：`Authorization: Token <token>`。

任务字段：`id`、`title`、`memo`、`is_completed`、`created_time`。

## 测试

```bash
cd backend
python manage.py test api -v 2      # 11 个接口回归测试

# 后端跑起来之后，再跑命令行冒烟测试
python scripts/api_demo.py

cd ../frontend
CI=true npm test                    # 前端组件测试
npm run build                       # 生产构建
```

## 配置（环境变量 / backend/.env）

后端所有环境相关配置都从环境变量读取，也支持 `backend/.env`（参考 `backend/.env.example`）：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | 开发用占位值 | 部署前必须换成随机值 |
| `DJANGO_DEBUG` | `True` | 部署时设为 `False` |
| `DJANGO_ALLOWED_HOSTS` | `127.0.0.1,localhost` | 逗号分隔 |
| `DJANGO_CORS_ORIGINS` | `localhost:3000,127.0.0.1:3000` | 前端地址白名单 |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | 空 | 同域部署时需要 |

前端 API 地址通过 `REACT_APP_API_URL` 配置（参考 `frontend/.env.example`），不设置时默认 `http://127.0.0.1:8000/api`。

## 部署到 PythonAnywhere（Practical 13–14）

1. 代码推到 GitHub（本仓库）。
2. PythonAnywhere Bash 里 `git clone` 仓库，创建 virtualenv 并 `pip install -r backend/requirements.txt`。
3. Web 标签页新建 Web App，选 **Manual configuration**（不要选 Django），Python 版本与 virtualenv 一致。
4. Source code / Working directory 都填 `.../TodoList/backend`。
5. WSGI 文件里指向 `backend.wsgi`，并设置环境变量：
   ```python
   os.environ["DJANGO_SECRET_KEY"] = "生成的随机密钥"
   os.environ["DJANGO_DEBUG"] = "False"
   os.environ["DJANGO_ALLOWED_HOSTS"] = "yourname.pythonanywhere.com"
   ```
6. 执行 `python manage.py migrate` 和 `python manage.py collectstatic`，然后 Reload。

## 常见问题

- **登录失败 / 提示 “wrong username or password”，但密码没错**：多半是前端换了端口。3000 被占用时 CRA 会自动用 3001、3002……，而旧的白名单只写了 3000，浏览器会因跨域拿不到响应。`DEBUG=True` 时后端已放行 `localhost` / `127.0.0.1` 的任意端口；部署环境请显式配置 `DJANGO_CORS_ORIGINS`。
- **登录 404**：确认后端地址与 `/api/api-token-auth/` 一致，且 `runserver` 已启动。
- **浏览器控制台 CORS 报错**：把前端地址加入 `DJANGO_CORS_ORIGINS`。
- **接口 401**：请求头缺少 `Authorization: Token <token>`，或 token 已被删除。
- **看不到别人（或后台新建）的任务**：任务按 `owner` 隔离，只会返回当前登录用户自己的数据。
