import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import psycopg2
from flask import jsonify,request,json
#from werkzeug.utils import secure_filename
import pandas as pd
import os
from sqlalchemy.types import Integer, Text, String, DateTime
import numpy as np
#################################################
# Database Setup
#################################################
# Create database connection
user = os.environ['pgdbuser']
password=os.environ['pgdbpass']
host=os.environ['pgdbhost']
#host='localhost'
port="5432"
database="covid"
connection_string = f"{user}:{password}@{host}:{port}/{database}"
engine = create_engine(f'postgresql://{connection_string}')
cloud_sql_connection_name=os.environ['mydomainurl']+os.environ["CLOUD_SQL_CONNECTION_NAME"]

enginec = sqlalchemy.create_engine(
    # Equivalent URL:
    # postgres+pg8000://<db_user>:<db_pass>@/<db_name>?unix_sock=/cloudsql/<cloud_sql_instance_name>/.s.PGSQL.5432
    sqlalchemy.engine.url.URL(
        drivername='postgres+pg8000',
        username=user,
        password=password,
        database=database,
        query={
            'unix_sock': '/cloudsql/{}/.s.PGSQL.5432'.format(
                cloud_sql_connection_name)
        }        
    ),
    pool_size=5,
    max_overflow=2,
    pool_timeout=30,  # 30 seconds
    pool_recycle=1800,  # 30 minutes
    # [END cloud_sql_postgres_sqlalchemy_lifetime]

    # [END_EXCLUDE]
)
# [END cloud_sql_postgres_sqlalchemy_create]

def getData(tables):

    # Base = automap_base()
    # Base.prepare(engine, reflect=True)
    # session = Session(engine)
    query=(f"""SELECT * FROM {tables}""")
    # with engine.connect() as conn:
    #     cur = conn.cursor()
    #     cur.execute(query)
    #     results = cur.fetchall()
    #     conn.close()
        
    conn = psycopg2.connect(host=host, port = port, database=database, user=user, password=password)
    cur = conn.cursor()
    cur.execute(query)
    results = cur.fetchall()
    conn.close()

    #filepath=os.path.join(path +'/static/','generated',table+'.json')
    if (tables=="country"):
        df=pd.DataFrame()
        for r in results:
            tmp_df=pd.DataFrame({"name":[r[0]],"country":[r[1]],"latitude":[r[2]],"longitude":[r[3]]})
            df=df.append(tmp_df)
        data=df.reset_index().drop(columns=['index']).to_json(orient="records")
    if (tables=="forex"):
        df=pd.DataFrame()
        for r in results:
            tmp_df=pd.DataFrame({"date":[r[0]],"country":[r[1]],"latitude":[r[2]],"longitude":[r[3]],"currency":[r[4]],"rate":[r[5]]})
            df=df.append(tmp_df)
        data=df.reset_index().drop(columns=['index']).to_json(orient="records")

    return data


def getLatitudeLongitude(iCountry):
    conn = psycopg2.connect(host=host, port = port, database=database, user=user, password=password)
    cur = conn.cursor()
    query="SELECT latitude,longitude FROM country where name="+"'"+iCountry+"'"
    cur.execute(query)
    results = cur.fetchall()
    conn.close()
    return results

def fullC19df():
    # url="https://opendata.ecdc.europa.eu/covid19/casedistribution/json/"
    # response = requests.get(url).json()
    # data_c19=json.dumps(response, indent=4, sort_keys=True)

    url="https://opendata.ecdc.europa.eu/covid19/casedistribution/json/"
    response = requests.get(url).json()
    data=response["records"]

    dateRep = [item['dateRep'].replace("/","-") for item in data]
    cases = [pd.to_numeric(item['cases']) for item in data]
    deaths = [pd.to_numeric(item['deaths']) for item in data]
    countriesAndTerritories = [item['countriesAndTerritories'] for item in data]
    popData2018 = [pd.to_numeric(item['popData2018']) for item in data]

    df=  pd.DataFrame({'dateRep': dateRep,'cases': cases,'deaths': deaths,'country': countriesAndTerritories,'popData2018': popData2018})
    cdata=getData(country)
    country = [item['name'] for item in cdata]
    latitude=[item['latitude'] for item in cdata]
    longitude=[item['longitude'] for item in cdata]
    cdf=  pd.DataFrame(
       {'country': countriesAndTerritories,
        'latitude': latitude,
        'longitude': longitude,
       })
    fulldata=pd.merge(df, cdf, how="left", on=["country", "country"])
    data_fullC19=fulldata.to_json(orient="records")
    return data_fullC19

def loadData(data,table,format):
    if (format=="csv"):
        df=pd.read_csv(data)
        #df["dateRep"]
    try:
        # Create our session (link) from Python to the DB
        #session = Session(engine)
        if (table=="fullc19"):
            df.to_sql(name=table,con=engine,schema='public',chunksize=500,if_exists='append',
                      index=False,
                      dtype={
                            "dateRep": String(50),
                            "cases": Integer,
                            "deaths": Integer,
                            "country": String(255),
                            "latitude": String(100),
                            "longitude": String(100)})
        if (table=="c19"):
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
