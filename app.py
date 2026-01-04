from flask import Flask, render_template, jsonify, request
import os
import json
from datetime import datetime
import random

app = Flask(__name__)

# In-memory storage for demo
visits = 0
messages = []

@app.route('/')
def home():
    global visits
    visits += 1
    
    server_info = {
        'hostname': os.getenv('RENDER_SERVICE_ID', 'local'),
        'instance_id': os.getenv('RENDER_INSTANCE_ID', 'dev'),
        'region': os.getenv('RENDER_REGION', 'local'),
        'memory': os.getenv('RENDER_MEMORY', 'unknown'),
        'python_version': os.getenv('PYTHON_VERSION', '3.11'),
        'visits': visits,
        'timestamp': datetime.now().isoformat()
    }
    
    return render_template('index.html', server_info=server_info)

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'Render Test App',
        'timestamp': datetime.now().isoformat(),
        'environment': os.getenv('RENDER_ENVIRONMENT', 'development'),
        'region': os.getenv('RENDER_REGION', 'unknown')
    })

@app.route('/api/echo', methods=['POST'])
def echo():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    response = {
        'echo': data.get('message', ''),
        'received_at': datetime.now().isoformat(),
        'processed_by': os.getenv('RENDER_INSTANCE_ID', 'local'),
        'random_id': random.randint(1000, 9999)
    }
    
    # Store message
    messages.append({
        'message': data.get('message', ''),
        'timestamp': datetime.now().isoformat(),
        'id': response['random_id']
    })
    
    # Keep only last 10 messages
    global messages
    messages = messages[-10:]
    
    return jsonify(response)

@app.route('/api/messages')
def get_messages():
    return jsonify({
        'count': len(messages),
        'messages': messages,
        'server': os.getenv('RENDER_SERVICE_ID', 'local')
    })

@app.route('/api/server-info')
def server_info():
    return jsonify({
        'platform': 'Render.com',
        'service_type': 'Web Service',
        'environment_variables': {
            key: value for key, value in os.environ.items() 
            if key.startswith('RENDER_') or key in ['PYTHON_VERSION', 'PORT']
        },
        'system': {
            'python_version': os.sys.version,
            'platform': os.sys.platform,
            'pid': os.getpid()
        }
    })

@app.route('/api/generate-data')
def generate_data():
    """Generate dummy data for testing"""
    data = []
    for i in range(10):
        data.append({
            'id': i + 1,
            'name': f'Item {i + 1}',
            'value': random.randint(1, 100),
            'timestamp': datetime.now().isoformat(),
            'category': random.choice(['A', 'B', 'C', 'D'])
        })
    
    return jsonify({
        'data': data,
        'generated_at': datetime.now().isoformat(),
        'count': len(data)
    })

@app.route('/api/calculate', methods=['POST'])
def calculate():
    """Simple calculation API"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    a = data.get('a', 0)
    b = data.get('b', 0)
    operation = data.get('operation', 'add')
    
    operations = {
        'add': lambda x, y: x + y,
        'subtract': lambda x, y: x - y,
        'multiply': lambda x, y: x * y,
        'divide': lambda x, y: x / y if y != 0 else 'undefined'
    }
    
    if operation not in operations:
        return jsonify({'error': 'Invalid operation'}), 400
    
    try:
        result = operations[operation](float(a), float(b))
        
        return jsonify({
            'operation': operation,
            'a': a,
            'b': b,
            'result': result,
            'calculated_at': datetime.now().isoformat(),
            'server_instance': os.getenv('RENDER_INSTANCE_ID', 'local')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'path': request.path}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting Render Test App on port {port}")
    print(f"📡 Environment: {os.environ.get('RENDER_ENVIRONMENT', 'development')}")
    print(f"🐍 Python: {os.sys.version}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
