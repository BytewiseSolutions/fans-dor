from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import bcrypt

app = Flask(__name__)

# 🛠️ Enable CORS for Angular frontend and allow credentials
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}}, supports_credentials=True)

# 🔌 Connect to DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('Users')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    response = table.get_item(Key={'email': email})
    user = response.get('Item')

    if user and bcrypt.checkpw(password.encode(), user['password'].encode()):
        return jsonify({"message": "Login successful", "role": user.get("role")}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/test-cors', methods=['GET'])
def test_cors():
    return jsonify({"message": "CORS is working!"})

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)
