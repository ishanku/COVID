import os

awskey = os.environ['AWS_S3_KEY']
awssecret= os.environ['AWS_S3_SECRET']
bucketname="gt-data-analytics-2020"
user = os.environ['pgdbuser']
password=os.environ['pgdbpass']
host=os.environ['pgdbhost']
port="5432"
database="covid"
cloud_sql_connection_name=os.environ.get("CLOUD_SQL_CONNECTION_NAME")
