# server.py (v-final: The All-in-One Server)
import http.server
import socketserver
import json
import requests
import hashlib
import random
import traceback

PORT = 8000

class IntegratedServer(http.server.SimpleHTTPRequestHandler):
    # This part handles the translation request
    def do_POST(self):
        if self.path == '/translate':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data)

                appId = data.get('appId')
                secretKey = data.get('secretKey')
                query = data.get('query')

                salt = random.randint(32768, 65536)
                sign_str = appId + query + str(salt) + secretKey
                sign = hashlib.md5(sign_str.encode('utf-8')).hexdigest()
                
                api_url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
                params = { 'q': query, 'from': 'en', 'to': 'cht', 'appid': appId, 'salt': salt, 'sign': sign }
                
                response = requests.get(api_url, params=params, timeout=10)
                response.raise_for_status()
                
                self._send_response(200, response.json())
            except Exception as e:
                traceback.print_exc()
                self._send_response(500, {'error': str(e)})
        else:
            self._send_response(404, {'error': 'Not Found'})

    def _send_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    # This part handles serving files like admin.html, index.html, etc.
    # It's the default behavior, so we don't need to change it.
    # We just override the log_message to keep the console clean.
    def log_message(self, format, *args):
        return

Handler = IntegratedServer

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Volt China Integrated Server is running at http://localhost:{PORT}")
    print("This server BOTH serves your website AND handles translation.")
    print("You only need to run this one server.")
    httpd.serve_forever()