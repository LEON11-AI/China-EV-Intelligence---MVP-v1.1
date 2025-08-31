# direct_api_test.py
import requests
import hashlib
import random
import json

# --- 请您在这里，用您自己的密钥，替换掉下面的占位符 ---
APP_ID = '20250831002443078'
SECRET_KEY = 'g0cqeSh71JQhBI34UNuw'
# ---------------------------------------------------------

# 要翻译的文本
query = 'Hello world'

def baidu_translate(query, app_id, secret_key):
    salt = random.randint(32768, 65536)
    sign_str = app_id + query + str(salt) + secret_key
    sign = hashlib.md5(sign_str.encode('utf-8')).hexdigest()
    
    url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
    params = {
        'q': query,
        'from': 'en',
        'to': 'cht',
        'appid': app_id,
        'salt': salt,
        'sign': sign
    }

    print("--- 正在向百度API发送请求 ---")
    print(f"请求地址: {url}")
    print(f"发送的参数: {params}\n")

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # 如果请求失败 (例如 4xx/5xx 错误), 会在这里抛出异常
        
        print("--- 成功收到百度的回应 ---\n")
        # 将收到的JSON数据格式化后打印出来
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))

    except requests.exceptions.RequestException as e:
        print("--- 请求失败! 发生了一个网络错误 ---")
        print(f"错误类型: {type(e).__name__}")
        print(f"错误信息: {e}")

if __name__ == '__main__':
    if APP_ID == '在此处粘贴您的APP ID' or SECRET_KEY == '在此处粘贴您的密钥':
        print("!!! 错误: 请先打开 direct_api_test.py 文件, 并填入您的APP ID和密钥。")
    else:
        baidu_translate(query, APP_ID, SECRET_KEY)