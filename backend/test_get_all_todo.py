import requests

TOKEN = "37a6519fb41af82ff20f4b2f5a8e8b37e17b5c25"
url = "http://127.0.0.1:8000/api/todos/"

headers = {
    "Authorization": f"Token {TOKEN}"
}

response = requests.get(url, headers=headers)
print("Status code: ", response.status_code)
print("所有Todo列表：", response.text)
