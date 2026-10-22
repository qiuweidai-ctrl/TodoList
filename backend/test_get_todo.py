import requests

# 获取全部待办任务的接口地址
url = "http://127.0.0.1:8000/api/todos/"
# 身份认证Token
headers = {
    "Authorization": "Token 90012e80da6c338c9cd3b957436692611e379719"
}

# GET请求，查询所有todo
response = requests.get(url, headers=headers)
# 打印状态码
print("Status code: ", response.status_code)
# 打印返回列表
print("Response content: ", response.json())