import boto3
import bcrypt
from botocore.exceptions import ClientError

# --- Configuration ---
TABLE_NAME = 'Users'  
REGION = 'us-east-1'
fullName = 'Lebohang Monamane'  
email = 'monamane.lebohang45@gmail.com'
phone = '59181664'
plain_password = 'Lebo@123'  
role = 'admin'

# --- Hash the password ---
hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt()).decode()

# --- Connect to DynamoDB ---
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(TABLE_NAME)

# --- Insert admin user ---
try:
    response = table.put_item(
        Item={
            'fullName': fullName,
            'email': email,
            'phone': phone,
            'password': hashed_password,
            'role': role
        },
        ConditionExpression='attribute_not_exists(email)'  # avoid overwriting
    )
    print(f"Admin user '{email}' added successfully.")
except ClientError as e:
    if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
        print(f"User with email '{email}' already exists.")
    else:
        print(f"Error adding user: {e}")
