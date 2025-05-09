import os
import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
from dashscope import Generation
import dashscope
from dotenv import load_dotenv

load_dotenv()

# Configuration
dashscope.api_key = os.getenv('DASHSCOPE_API_KEY')
dashscope.base_http_api_url = os.getenv('DASHSCOPE_BASE_URL', 'https://dashscope-intl.aliyuncs.com/api/v1')
PUBLIC_DIR = os.getenv('PUBLIC_DIR', 'public')
SERVER_HOST = os.getenv('SERVER_HOST', 'localhost')
SERVER_PORT = int(os.getenv('SERVER_PORT', '3000'))
API_TOKEN = os.getenv('API_TOKEN') 

# Era data
era_data = {
    'prehistoric': {
        'message': 'You are in a prehistoric world. Respond creatively as if it is not code-related. Limit response to 4-5 sentences.',
        'story': {
            'title': 'The Prehistoric Challenge',
            'content': """Welcome to the prehistoric era! The cavemen need your help to build a firewood pyramid.
Your task is to describe how to arrange firewood in a pyramid shape.
When ready, click Start Challenge to begin!"""
        }
    },
    'medieval': {
        'message': 'You are a sage in medieval times responding to a fantasy problem. Limit response to 4-5 sentences.',
        'story': {
            'title': 'The Medieval Challenge',
            'content': """You've arrived in medieval times! The castle needs a better defense system.
Create a solution to protect against invading armies.
Click Start Challenge when you're ready to help the kingdom."""
        }
    },
    'modern': {
    'message': """You may respond at full length.  Evaluate ${userInput} and please provide a detailed, technical explanation including corrected code, reasoning, and best practices.
You are a friendly and supportive modern coding assistant helping users debug JavaScript robot control systems. Follow these rules:
        1. Highlight changes with comments
        Code to debug:
        function moveRobot(directions) {
        // Should move in square pattern
            for (let i = 0; i < directions.length; i++) {
            // Debug this loop
  }
}
          // Your improvements here
        }
        ```
       encourage user!""",

        'story': {
            'title': 'The Modern Challenge',
            'content': """Welcome to the modern era! A robot is malfunctioning in the factory.
Debug its control system to get production running again.
Press Start Challenge to begin your debugging task."""
        }
    },
    'future': {
        'message': """You may respond at full length. Evaluate ${userInput} and please provide a detailed, technical explanation including corrected code, reasoning, and best practices.
You are a futuristic AI expert guiding space-age code tasks. Follow these rules:
        1. Highlight performance improvements with comments
        2. Optimize the neural network training loop
        Code to optimize:
        function trainAI(data) {
          // Current slow implementation
          data.forEach(item => {
            // Optimize this
          });
        }
        ```
       encourage user!""",
        'story': {
            'title': 'The Future Challenge',
            'content': """You've reached the future! The AI systems need optimization.
Write code to improve their performance and efficiency.
Click Start Challenge to begin your optimization task."""
        }
    }
}

class QwenHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/era-stories':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            stories = {era: data['story'] for era, data in era_data.items()}
            self.wfile.write(json.dumps(stories).encode())
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/qwen':
            # Optional authentication
            if API_TOKEN and self.headers.get('Authorization') != API_TOKEN:
                self.send_response(401)
                self.end_headers()
                return

            length = int(self.headers.get('Content-Length'))
            body = self.rfile.read(length)
            data = json.loads(body)

            prompt = data.get('prompt')
            era = data.get('era', 'modern')

            if not prompt:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Prompt is required'}).encode())
                return

            try:
                system_prompt = era_data.get(era, {}).get('message', 'You are a helpful assistant.')

                messages = [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': prompt}
                ]
                
                response = Generation.call(
                    model='qwen-max',
                    messages=messages,
                    result_format='message'
                )

                answer = response.output.choices[0].message.content

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'answer': answer}).encode())

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def translate_path(self, path):
        if path == '/':
            path = '/index.html'
        return os.path.join(PUBLIC_DIR, path.lstrip('/'))

if __name__ == '__main__':
    if not dashscope.api_key:
        raise ValueError("DASHSCOPE_API_KEY is required in .env file")
    
    os.chdir('.')
    server = HTTPServer((SERVER_HOST, SERVER_PORT), QwenHandler)
    print(f"Server running at http://{SERVER_HOST}:{SERVER_PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        server.server_close()

        