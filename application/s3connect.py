
import boto3
import json
from pandas.io.json import json_normalize
import requests
from boto3 import session
import io
import logging
from config import awskey
from config import secret
from config import bucketname
import pandas as pd

class DataLoader():
    	def LoadFile(file):
		s3 = boto3.client('s3',aws_access_key_id=awskey,aws_secret_access_key=secret)
		# Call S3 to list current buckets
		response = s3.list_buckets()
		Object_Read=s3.get_object(Bucket=bucketname,Key=file)
		output_data= pd.read_csv(Object_Read['Body'])
		return output_data