import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import psycopg2
import sys
from flask import jsonify,request,json
#from werkzeug.utils import secure_filename
import pandas as pd
from sqlalchemy.types import Integer, Text, String, DateTime
from datetime import datetime
import numpy as np
import os



#################################################
# Database Setup
#################################################
# Create database connection
user="gtuser"
password="rpython2020"
host="104.197.208.53"
port="5432"
database="covid"
connection_string = f"{user}:{password}@{host}:{port}/{database}"
engine = create_engine(f'postgresql://{connection_string}')


def getData(tables):

    # Base = automap_base()
    # Base.prepare(engine, reflect=True)
    # session = Session(engine)

    conn = psycopg2.connect(host=host, port = port, database=database, user=user, password=password)
    cur = conn.cursor()
    cur.execute(f"""SELECT * FROM {tables}""")
    results = cur.fetchall()
    conn.close()

    #filepath=os.path.join(path +'/static/','generated',table+'.json')

    df=pd.DataFrame()
    for r in results:
        tmp_df=pd.DataFrame({"name":[r[0]],"country":[r[1]],"latitude":[r[2]],"longitude":[r[3]]})
        df=df.append(tmp_df)
    data=df.reset_index().drop(columns=['index']).to_json(orient="records")

    return data

def loadData(data,table,format):
    if (format=="csv"):
        df=pd.read_csv(data)
        #df["dateRep"]
    try:
        # Create our session (link) from Python to the DB
        #session = Session(engine)
        df.to_sql(name=table,con=engine,schema='public',chunksize=500,if_exists='append',
                  index=False,
                  dtype={
                        "dateRep": String(50),
                        "day": Integer,
                        "month": Integer,
                        "year": Integer,
                        "cases": Integer,
                        "deaths": Integer,
                        "countriesAndTerritories": String(255),
                        "geoId": String(255),
                        "countryterritoryCode": String(255),
                        "popData2018": Integer})
    except Exception as e:
        return e
    return df
    # return "Data Loaded to Table: " + table
