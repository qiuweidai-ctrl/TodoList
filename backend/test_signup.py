import requests

url = "http://127.0.0.1:8000/api/signup/"
payload = {
    "username": "student01",
    "password": "test123456"
}

response = requests.post(url, json=payload)
print("Status code: ", response.status_code)
print("==== Raw Response Text ====")
print(response.text)

# 下面这行注释，不要执行，否则直接崩溃
# print("Response content: ", response.json())
