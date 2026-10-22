import requests

# API地址，修改todo完成状态，数字1替换成你创建出来的todo id
url = "http://127.0.0.1:8000/api/todos/1/complete/"
# 身份认证头
headers = {
    "Authorization": "Token 90012e80da6c338c9cd3b957436692611e379719"
}

# 发送PUT请求切换任务完成状态
response = requests.put(url, headers=headers)
# 打印状态码
print("Status code: ", response.status_code)
# 打印返回结果
print("Response content: ", response.json())