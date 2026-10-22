import requests

TOKEN = "37a6519fb41af82ff20f4b2f5a8e8b37e17b5c25"
# 修改id=7的todo
url = "http://127.0.0.1:8000/api/todos/7/"
payload = {
    "title": "学习Django",
    "memo": "后端接口全部调试完毕",
    "completed": True
}
headers = {
    "Authorization": f"Token {TOKEN}"
}

response = requests.put(url, json=payload, headers=headers)
print("Status code: ", response.status_code)
print("更新后的Todo：", response.text)
