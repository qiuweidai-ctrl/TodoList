import requests

TOKEN = "37a6519fb41af82ff20f4b2f5a8e8b37e17b5c25"
url = "http://127.0.0.1:8000/api/todos/7/"
# 只修改completed这一个字段
payload = {
    "completed": True
}
headers = {
    "Authorization": f"Token {TOKEN}"
}

response = requests.patch(url, json=payload, headers=headers)
print("Status code: ", response.status_code)
print("更新后的Todo：", response.text)
