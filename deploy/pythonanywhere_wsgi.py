"""PythonAnywhere 的 WSGI 配置文件模板（Practical 14–17）。

用法：在 PythonAnywhere 的 Web 页签点 “WSGI configuration file” 打开编辑器，
把下面内容整段贴进去（替换掉原有内容），改掉 4 处中文占位符，然后 Reload。

为什么要把环境变量写在这里：本项目所有配置都从环境变量读取（见 backend/settings.py），
而 PythonAnywhere 的 Web 页签能不能设环境变量取决于账号版本，写在 WSGI 文件里最稳。
"""

import os
import sys

# 1) 项目里的 backend 目录（含 manage.py 的那一层）
project_home = "/home/qiuweidai/TodoList/backend"
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# 2) 环境变量
os.environ["DJANGO_SETTINGS_MODULE"] = "backend.settings"
os.environ["DJANGO_SECRET_KEY"] = "把这里换成随机长字符串"
os.environ["DJANGO_DEBUG"] = "False"
os.environ["DJANGO_ALLOWED_HOSTS"] = "qiuweidai.pythonanywhere.com"
# Netlify 地址（拿到后填进来，多个用英文逗号分隔，末尾不要斜杠）
os.environ["DJANGO_CORS_ORIGINS"] = "https://你的站点.netlify.app"

# 3) 启动 WSGI 应用
from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
