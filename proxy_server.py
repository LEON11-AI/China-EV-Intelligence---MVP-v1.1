# proxy_server.py (v3 - with Preflight Request support)
import http.server
import socketserver
import json
import requests
import hashlib
import random
import traceback

PORT = 8001

class TranslationProxy(http.server.SimpleHTTPRequestHandler):
    # THIS IS THE NEW, CRUCIAL PART THAT HANDLES THE "PREFLIGHT" REQUEST
    def do_OPTIONS(self):
        print("--- Received an OPTIONS (preflight) request, sending approval ---")
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        print("\n--- Received a POST request from the browser ---")
        if self.path == '/translate':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data)
                print(f"Request data: {data}")

                appId = data.get('appId')
                secretKey = data.get('secretKey')
                query = data.get('query')

                if not all([appId, secretKey, query]):
                    self._send_response(400, {'error': 'Missing parameters'})
                    return

                salt = random.randint(32768, 65536)
                sign_str = appId + query + str(salt) + secretKey
                sign = hashlib.md5(sign_str.encode('utf-8')).hexdigest()
                
                api_url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
                params = { 'q': query, 'from': 'en', 'to': 'cht', 'appid': appId, 'salt': salt, 'sign': sign }
                
                print(f"Sending request to Baidu...")
                response = requests.get(api_url, params=params, timeout=10)
                response.raise_for_status()
                
                print("Successfully received response from Baidu.")
                self._send_response(200, response.json())

            except Exception as e:
                print("\n---!!! AN ERROR OCCURRED IN THE PROXY SERVER !!!---")
                traceback.print_exc()
                self._send_response(500, {'error': str(e)})
        else:
            self._send_response(404, {'error': 'Not Found'})

    def _send_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def log_message(self, format, *args):
        # We override this to prevent default logging, so we only see our custom prints.
        return

Handler = TranslationProxy

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Baidu Translation Proxy Server (v3 with Preflight Support) running at http://localhost:{PORT}")
    httpd.serve_forever()