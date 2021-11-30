from waitress import serve;
import http.server
import socketserver
from http import HTTPStatus
class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(HTTPStatus.OK)
        self.end_headers()
        self.wfile.write(b'Hello world')
    def do_POST(self):
        self.send_response(HTTPStatus.OK)
        self.end_headers()
        self.wfile.write(b'Hello world PY')

if __name__ == '__main__':
    httpd = socketserver.TCPServer(('', 8082), Handler)
    httpd.serve_forever()

    #app.run( host="0.0.0.0",port=8082, debug=True)    
    #serve(httpd,listen='0.0.0.0:8082',threads=8)
    
