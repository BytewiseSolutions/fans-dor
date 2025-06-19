import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Optional: list tables to confirm it works
print("DynamoDB Tables:")
for table in dynamodb.tables.all():
    print(table.name)
