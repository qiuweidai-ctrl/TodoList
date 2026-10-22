import requests

# 刚才拿到的token，复制粘贴在这里
TOKEN = "37a6519fb41af82ff20f4b2f5a8e8b37e17b5c25"

url = "http://127.0.0.1:8000/api/todos/"
payload = {
    "title": "学习Django",
    "description": "完成TodoList项目",
    "completed": False
}
headers = {
    "Authorization": f"Token {TOKEN}"
}

response = requests.post(url, json=payload, headers=headers)
print("Status code: ", response.status_code)
print("Response: ", response.text)
