import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import psycopg2
from flask import jsonify,request,json
#from werkzeug.utils import secure_filename
import pandas as pd
from sqlalchemy.types import Integer, Text, String, DateTime
import numpy as np




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
    # countrygroup=df.groupby("countriesAndTerritories")
    # TotalCases=countrygroup['cases'].sum()
    # TotalLosses=countrygroup['deaths'].sum()
    # Date = countrygroup["dateRep"].first()
    # Population=countrygroup["popData2018"].first()
    # newdf=pd.DataFrame({"TotalCases":TotalCases,"TotalLosses": TotalLosses,"Date":Date,"Population":Population})
    # alldf=pd.DataFrame()
    # for index,row in newdf.iterrows():
    #     try:
    #         iCountry=index
    #         LatLon=pd.DataFrame(getLatitudeLongitude(iCountry))
    #         tmp=pd.DataFrame({"Country":[index],"Latitude":LatLon[0],"Longitude":LatLon[1],"TotalCases":[row['TotalCases']],"TotalLosses": [row['TotalLosses']],"Date":[row['Date']],"Population":[row['Population']]})
    #     except KeyError:
    #         tmp=pd.DataFrame({"Country":[index],"Latitude":"","Longitude":"","TotalCases":[row['TotalCases']],"TotalLosses": [row['TotalLosses']],"Date":[row['Date']],"Population":[row['Population']]})
    #
    # alldf=alldf.append(tmp)
    #alldf=alldf.loc[alldf.Latitude != ''].set_index("Date")
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
