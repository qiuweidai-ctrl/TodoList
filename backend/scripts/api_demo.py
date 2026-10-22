#!/usr/bin/env python
"""命令行冒烟测试：注册 -> 登录 -> 新建 -> 列表 -> 完成切换 -> 修改 -> 删除。

只用标准库，不依赖 requests。先启动后端，然后：

    python scripts/api_demo.py
    python scripts/api_demo.py --base http://127.0.0.1:8000/api --username demo --password demo12345

退出码 0 表示全部通过。
"""

import argparse
import json
import sys
import urllib.error
import urllib.request


def call(method, url, payload=None, token=None):
    body = None
    headers = {"Accept": "application/json"}
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Token {token}"

    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            raw = response.read().decode("utf-8")
            return response.status, (json.loads(raw) if raw else None)
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8")
        try:
            return exc.code, json.loads(raw)
        except json.JSONDecodeError:
            return exc.code, raw


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://127.0.0.1:8000/api")
    parser.add_argument("--username", default="demo_user")
    parser.add_argument("--password", default="demo_pass_2026")
    args = parser.parse_args()

    base = args.base.rstrip("/")
    checks = []

    # 1. 注册（已存在则忽略）
    status, data = call("POST", f"{base}/signup/", {"username": args.username, "password": args.password})
    ok = status == 201 or (status == 400 and "already" in str(data))
    checks.append(("signup", ok, status, data))

    # 2. 登录拿 token
    status, data = call("POST", f"{base}/api-token-auth/", {"username": args.username, "password": args.password})
    checks.append(("login", status == 200 and data.get("token"), status, data))
    if status != 200:
        return report(checks)
    token = data["token"]

    # 3. 未带 token 访问应该被拒
    status, data = call("GET", f"{base}/todos/")
    checks.append(("list without token -> 401", status in (401, 403), status, data))

    # 4. 新建
    status, created = call("POST", f"{base}/todos/", {"title": "api_demo task", "memo": "created by script"}, token=token)
    checks.append(("create", status == 201 and created.get("id"), status, created))
    if status != 201:
        return report(checks)
    todo_id = created["id"]

    # 5. 列表
    status, todos = call("GET", f"{base}/todos/", token=token)
    checks.append(("list", status == 200 and any(t["id"] == todo_id for t in todos), status, f"{len(todos)} item(s)"))

    # 6. 切换完成
    status, toggled = call("PUT", f"{base}/todos/{todo_id}/complete/", {}, token=token)
    checks.append(("toggle complete", status == 200 and toggled.get("is_completed") is True, status, toggled))

    # 7. 修改
    status, updated = call(
        "PUT",
        f"{base}/todos/{todo_id}/",
        {"title": "api_demo task (edited)", "memo": "updated", "is_completed": True},
        token=token,
    )
    checks.append(("update", status == 200 and updated.get("title") == "api_demo task (edited)", status, updated))

    # 8. 删除
    status, _ = call("DELETE", f"{base}/todos/{todo_id}/", token=token)
    checks.append(("delete", status == 204, status, ""))

    return report(checks)


def report(checks):
    failed = 0
    for name, ok, status, detail in checks:
        print(f"[{'PASS' if ok else 'FAIL'}] {name:<32} HTTP {status}  {detail}")
        if not ok:
            failed += 1
    print(f"\n{len(checks) - failed}/{len(checks)} passed")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
