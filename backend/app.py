import boto3
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import stripe
from botocore.exceptions import ClientError
from flask_mail import Mail, Message
from dotenv import load_dotenv
import uuid
import unicodedata
import botocore.exceptions
from collections import defaultdict


load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})
VOTES_FILE = 'votes.json'

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
votes_table = dynamodb.Table('Votes')
nominees_table = dynamodb.Table('Nominees')

stripe.api_key = os.getenv('STRIPE_SECRET_KEY') # Secret key

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

mail = Mail(app)

# Function to send Email
def send_confirmation_email(email, nominee_name):
    try:
        msg = Message(
            subject='Vote Confirmation',
            recipients=[email],
            body=f'Thank you for voting for {nominee_name}! Your vote has been recorded.'
        )
        mail.send(msg)
        print(f"📧 Confirmation email sent to {email}")
    except Exception as e:
        print(f"❌ Error sending confirmation email: {e}")

# Function for adding a vote
@app.route('/api/vote', methods=['POST'])
def submit_vote():
    data = request.get_json()
    nomineeId = data.get('nomineeId')
    email = data.get('email')
    club = data.get('club')

    if not nomineeId or not email or not club:
        return jsonify({'error': 'Missing nomineeId, email or club'}), 400

    # Just acknowledge - do NOT save yet
    return jsonify({'message': 'Vote initiation successful'}), 200


# Payment gateway/function
@app.route('/api/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.get_json()
    email = data.get('email')
    nomineeId = data.get('nomineeId')
    club = data.get('club')

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            mode='payment',
            customer_email=email,
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f"Vote for {nomineeId}"
                    },
                    'unit_amount': 500,  # $5
                },
                'quantity': 1
            }],
           success_url=f'http://localhost:4200/vote-success?email={email}&nominee={nomineeId}&club={club}',
            cancel_url='http://localhost:4200/vote-cancelled',
            metadata={
                'nomineeId': nomineeId,
                'club': club
            }
        )
        return jsonify({'url': session.url})
    except Exception as e:
     print("❌ Error creating Stripe session:", e)
    return jsonify({'error': str(e)}), 500


# Helper function to load votes
def load_votes():
    if not os.path.exists(VOTES_FILE):
        with open(VOTES_FILE, 'w') as f:
            json.dump([], f)
    with open(VOTES_FILE) as f:
        return json.load(f)

# Count the votes for each nominee
@app.route('/api/vote-counts/', methods=['GET'])
def get_vote_counts():
    try:
        # table = dynamodb.Table('Nominees')
        response = nominees_table.scan()
        items = response.get('Items', [])

        vote_counts = {item['nomineeId']: item.get('votes', 0) for item in items}

        return jsonify(vote_counts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Count nominee with the highest votes
@app.route('/api/highest-votes/', methods=['GET'])
def get_highest_votes():
    try:
        # table = dynamodb.Table('Nominees')
        response = nominees_table.scan()
        items = response.get('Items', [])

        if not items:
            return jsonify({'highestVotes': 0, 'topNominees': [], 'clubs': []}), 200

        highest_votes = max([item.get('votes', 0) for item in items])
        top_nominees = [item['nomineeId'] for item in items if item.get('votes', 0) == highest_votes]
        clubs = [item.get('clubName') for item in items if item.get('votes', 0) == highest_votes]

        return jsonify({
            'highestVotes': highest_votes,
            'topNominees': top_nominees,
            'clubs': clubs
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/categories/', methods=['GET'])
def get_categories():
    with open('categories.json') as f:
        categories = json.load(f)
    return jsonify(categories)

# Payment code & saving vote
@app.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('stripe-signature')
    WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            email = session.get('customer_email')
            nominee_id = session['metadata'].get('nomineeId')
            club = session['metadata'].get('club')

            # ✅ DEBUG PRINTS (put them here)
            print("Stripe Event:", event)
            print("Nominee ID:", nominee_id)
            print("Email:", email)
            print("Club:", club)
            print("Saving to Votes table...")

            if not email or not nominee_id or not club:
                return jsonify({'error': 'Missing vote details'}), 400

            try:
                votes_table.put_item(
                    Item={
                        'email': email,
                        'nomineeId': nominee_id,
                        'club': club
                    },
                   ConditionExpression='attribute_not_exists(email) AND attribute_not_exists(nomineeId)'
                )

                nominees_table.update_item(
                    Key={'nomineeId': nominee_id},
                    UpdateExpression="SET votes = if_not_exists(votes, :start) + :inc",
                    ExpressionAttributeValues={
                        ':inc': 1,
                        ':start': 0
                    }
                )
                print(f"✅ Vote recorded for {nominee_id} by {email}")

            except botocore.exceptions.ClientError as e:
                if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
                    print(f"⚠️ Duplicate vote detected for nominee {nominee_id} by {email}")
                    return jsonify({'message': 'Duplicate vote ignored'}), 200
                else:
                    print("❌ DynamoDB Error:", e)
                    return jsonify({'error': 'Database error'}), 500

            # Email sending...
            try:
                response = nominees_table.get_item(Key={'nomineeId': nominee_id})
                nominee_name = response.get('Item', {}).get('playerName', nominee_id)
            except Exception:
                nominee_name = nominee_id

            send_confirmation_email(email, nominee_name)

        return jsonify({'status': 'success'}), 200

    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return jsonify({'error': str(e)}), 400

# Adding nominee in dynamodb
@app.route('/api/add-nominee', methods=['POST'])
def add_nominee():
    try:
        data = request.get_json()
        nominee_id = str(uuid.uuid4())   # Used as nomineeId in DynamoDB
        if not nominee_id:
            return jsonify({'error': 'Nominee name (playerName) is required'}), 400

        nominee_item = {
            'nomineeId': nominee_id,
            'playerName': data.get('playerName'),
            'clubName': data.get('clubName'),
            'category': data.get('category'),
            'description': data.get('description'),
            'status': data.get('status', 'pending'),
            'votes': int(data.get('votes', 0))
        }

        if 'photo' in data:
            nominee_item['photo'] = data['photo']  # optional: base64 string or URL

        # nominees_table = dynamodb.Table('Nominees')
        nominees_table.put_item(Item=nominee_item)

        return jsonify({'message': f'Nominee {nominee_id} added successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Load Nominees from dynamodb
@app.route('/api/nominees', methods=['GET'])
def get_nominees():
    try:
        table = boto3.resource('dynamodb').Table('Nominees')
        response = table.scan()
        nominees = response.get('Items', [])
        return jsonify(nominees), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Edit nominee
@app.route('/api/nominee/<nomineeId>', methods=['PUT'])
def update_nominee(nomineeId):
    try:
        data = request.get_json()
        print(f"Update request for {nomineeId}: {data}")

        required_fields = ['playerName', 'clubName', 'category', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing field: {field}'}), 400

        response = dynamodb.Table('Nominees').update_item(
            Key={'nomineeId': nomineeId},
            UpdateExpression="""
                SET playerName = :playerName,
                    clubName = :clubName,
                    category = :category,
                    description = :description,
                    #status = :status,
                    photo = :photo
            """,
            ExpressionAttributeNames={
                '#status': 'status'  # alias the reserved keyword
            },
            ExpressionAttributeValues={
                ':playerName': data['playerName'],
                ':clubName': data['clubName'],
                ':category': data['category'],
                ':description': data['description'],
                ':status': data.get('status', 'active'),
                ':photo': data.get('photo') or ''
            },
            ReturnValues='UPDATED_NEW'
        )
        return jsonify({
            'message': 'Nominee updated successfully!',
            'updated': response.get('Attributes')
        }), 200

    except Exception as e:
        print(f"Update Error: {e}")
        return jsonify({'error': str(e)}), 500

# Delete nominee
@app.route('/api/nominee/<nomineeId>', methods=['DELETE'])
def delete_nominee(nomineeId):
    try:
        dynamodb.Table('Nominees').delete_item(
            Key={'nomineeId': nomineeId},
            ConditionExpression='attribute_exists(nomineeId)'
        )
        return jsonify({'message': f'Nominee {nomineeId} deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Display nominees by categories
@app.route('/api/nominees/category/<short_id>', methods=['GET'])
def get_nominees_by_category(short_id):
    try:
        # Map short keys to full category names
        category_map = {
            'feminin': "Fans d'Or Féminine",
            'masculin': "Fans d'Or Masculin",
            'podcast': "Fans d'Or Podcast",
            'publication': "Fans d'Or Publication",
            'vicente-del-bosque': "Fans d'Or Vicente del Bosque",
            'presenter': "Fans d'Or Presenter",
            'youtube': "Fans d'Or Chaine YouTube",
            'journalist': "Fans d'Or Journalist",
            'broadcaster': "Fans d'Or Broadcaster",
            'fan-loyal': "Fans d'Or Fan Loyal",
            'equipe-feminine': "Fans d'Or Équipe Féminine",
            'equipe-masculine': "Fans d'Or Équipe Masculine"
        }

        # Look up the full name from the route param
        category_name = category_map.get(short_id.lower())
        if not category_name:
            return jsonify({'error': 'Invalid category'}), 400

        # table = dynamodb.Table('Nominees')
        response = nominees_table.scan()
        items = response.get('Items', [])

        def normalize(text):
             return unicodedata.normalize('NFKD', text or '').replace("’", "'").lower().strip()
        # Filter nominees by the exact category name
        nominees = [item for item in items if normalize(item.get('category')) == normalize(category_name)]

        return jsonify({
            'name': category_name,
            'nominees': nominees
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def normalize_category(text):
    return unicodedata.normalize('NFKD', text or '').replace("’", "'").strip()

# Load Featured Categories
@app.route('/api/featured-categories', methods=['GET'])
def get_featured_categories():
    try:
        response = nominees_table.scan()
        items = response.get('Items', [])

        categories_map = defaultdict(list)

        for nominee in items:
            category = normalize_category(nominee.get('category')) 
            categories_map[category].append({
                'nomineeId': nominee.get('nomineeId'),
                'playerName': nominee.get('playerName'),
                'clubName': nominee.get('clubName'),
                'description': nominee.get('description'),
                'photo': nominee.get('photo') 
            })

        featured = []
        for category, nominees in categories_map.items():
            featured.append({
                'title': category,
                'nominees': nominees
            })

        return jsonify(featured), 200

    except Exception as e:
        print(f"❌ Error fetching featured categories: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)