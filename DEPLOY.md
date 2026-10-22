# 部署手册（Practical 15 – 17）

本项目已经把所有"写死"的地方改成配置项，所以部署时**不需要改代码**，只要设环境变量。
下面按讲义的顺序走，每一步都写了验证方法。

结构回顾：

```
TodoList/
├── backend/     -> 部署到 PythonAnywhere
└── frontend/    -> 部署到 Netlify
```

---

## Practical 15 — 后端收尾（PythonAnywhere）

### 15.1 创建生产环境超级用户

Web 页签 → **Bash console**：

```bash
source .virtualenvs/todo_venv/bin/activate
cd ~/TodoList/backend        # 换成你的实际路径（含 manage.py 的那层）
python manage.py createsuperuser
```

记下用户名、邮箱、密码（后台登录用）。

> 注意：本地 `db.sqlite3` 不会上传（已在 `.gitignore` 里），
> 所以线上是**空库**，必须先 `migrate` 再 `createsuperuser`：
>
> ```bash
> python manage.py migrate
> ```

### 15.2 确认 `.gitignore`

已经配好，覆盖讲义要求的三类：

| 规则 | 作用 |
| --- | --- |
| `__pycache__/`、`*.py[cod]` | Django 运行生成的字节码 |
| `backend/db.sqlite3` | 本地数据库，绝不能推上生产 |
| `.DS_Store`、`Thumbs.db` | 系统垃圾文件 |
| `todo_venv/`、`.idea/`、`.env` | 虚拟环境、IDE 配置、密钥文件 |

### 15.3 更换数据库（可选）

免费账号只能用 MySQL（PostgreSQL 需要付费）。按官方文档建库后，在 Web 页签的
Environment variables（或 WSGI 文件）里设置连接信息，再改 `backend/settings.py` 的
`DATABASES`。换库之后是全新数据库，**必须重新执行**：

```bash
python manage.py migrate
python manage.py createsuperuser
```

如果暂时只是课程演示，继续用 SQLite 完全够用。

### 15.4 CORS 留到最后一步

CORS 白名单需要**前端的线上地址**，所以先完成 Practical 16 再回来配（见下面 17）。

---

## Practical 16 — 部署前端（Netlify）

### 16.1 让前端指向线上后端

讲义的做法是手动把 `services/todos.js` 里的 `localhost:8000` 替换成 PythonAnywhere 地址。
本项目等价的做法是**设环境变量**（代码里已经是 `process.env.REACT_APP_API_URL`：

```bash
cd frontend
# PowerShell
$env:REACT_APP_API_URL="https://你的用户名.pythonanywhere.com/api"

# macOS / Linux
export REACT_APP_API_URL="https://你的用户名.pythonanywhere.com/api"
```

也可以复制 `frontend/.env.production.example` 为 `frontend/.env.production` 并填写，
`npm run build` 会自动读取（该文件不进 Git）。

### 16.2 构建

```bash
npm run build
```

产物在 `frontend/build/`。

### 16.3 拖拽到 Netlify

1. 打开 <https://app.netlify.com/drop>
2. 把 `frontend/build` **文件夹本身**拖进虚线框
3. 几秒后得到形如 `https://random-name-123456.netlify.app` 的地址

### 16.4 为什么还要 `_redirects`

`public/_redirects` 里有一行 `/*  /index.html  200`。它是给 React Router 用的：
直接打开 `https://你的站点.netlify.app/login` 时，Netlify 上没有 `/login` 这个文件，
没有这条规则就会 404。CRA 会把它一起复制进 `build/`，所以拖拽部署自动生效。

---

## Practical 17 — 打通前后端（CORS）

拿到 Netlify 地址后，回到 PythonAnywhere 的 **Web** 页签，在 Environment variables
（或打开 WSGI 文件）里追加：

```
DJANGO_CORS_ORIGINS = https://你的站点.netlify.app
```

如果之前已经设过其它地址，用逗号分隔，例如：

```
DJANGO_CORS_ORIGINS = https://你的站点.netlify.app,http://localhost:3000
```

同时确认这三项也对：

| 变量 | 值 |
| --- | --- |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `你的用户名.pythonanywhere.com` |
| `DJANGO_SECRET_KEY` | 随机生成的长字符串 |

然后点 **Reload**。

### 验证

1. 打开 Netlify 站点，注册一个新账号 → 应能直接进入列表页
2. 新增 / 编辑 / 完成 / 删除各点一次
3. 用旧账号登录，能看到之前的任务

若还是失败，按这个顺序排查：

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 控制台 `CORS policy` 报错 | `DJANGO_CORS_ORIGINS` 没加或多了斜杠 | 只写协议+域名，**末尾不要 `/`** |
| 登录弹 "cannot reach the backend" | 构建时 `REACT_APP_API_URL` 没设 | 重新构建并重新拖拽 |
| 页面 404 | 缺 `_redirects` | 确认 `build/_redirects` 存在 |
| 后台 502 / 一直转圈 | Reload 后 WSGI 报错 | 看 Web 页签的 error log，多半是 `ALLOWED_HOSTS` |
