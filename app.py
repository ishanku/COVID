from flask import Flask,render_template,json, url_for
from main.db import loadData,getData,getLatitudeLongitude
import requests
import pandas as pd
import json

app = Flask(__name__)


@app.route('/')
def home():
    sqldata()
    coviddata()
    return render_template("index.html")

@app.route('/data_country')
def sqldata():
    tables="country"
    data_country=getData(tables)
    return data_country

@app.route('/data_c19')
def coviddata():
    url="https://opendata.ecdc.europa.eu/covid19/casedistribution/json/"
    response = requests.get(url).json()
    data_c19=json.dumps(response, indent=4, sort_keys=True)
    return data_c19

@app.route('/data_fullC19')
def fullC19():
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

    df=  pd.DataFrame(
      {'dateRep': dateRep,
       'cases': cases,
       'deaths': deaths,
       'countriesAndTerritories': countriesAndTerritories,
       'popData2018': popData2018,
      })
    countrygroup=df.groupby("countriesAndTerritories")
    TotalCases=countrygroup['cases'].sum()
    TotalLosses=countrygroup['deaths'].sum()
    Date = countrygroup["dateRep"].first()
    Population=countrygroup["popData2018"].first()
    newdf=pd.DataFrame({"TotalCases":TotalCases,"TotalLosses": TotalLosses,"Date":Date,"Population":Population})
    alldf=pd.DataFrame()
    for index,row in newdf.iterrows():
        try:
            iCountry=index
            LatLon=pd.DataFrame(getLatitudeLongitude(iCountry))
            tmp=pd.DataFrame({"Country":[index],"Latitude":LatLon[0],"Longitude":LatLon[1],"TotalCases":[row['TotalCases']],"TotalLosses": [row['TotalLosses']],"Date":[row['Date']],"Population":[row['Population']]})
        except KeyError:
            tmp=pd.DataFrame({"Country":[index],"Latitude":"","Longitude":"","TotalCases":[row['TotalCases']],"TotalLosses": [row['TotalLosses']],"Date":[row['Date']],"Population":[row['Population']]})

    alldf=alldf.append(tmp)
    #alldf=alldf.loc[alldf.Latitude != ''].set_index("Date")
    data_fullC19=alldf.reset_index().drop(columns=['index']).to_json(orient="records")
    return data_fullC19

@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

@app.route('/sql')
def sqlname():
    return "I am using cloud sql"

@app.route('/loaddata')
def loadNewData():
    #LoadResult=loadData('static/data/covid.csv',"c19","csv")
    LoadResult=loadData('static/data/covidfulldata.csv',"fullc19","csv")
    return "DataLoaded"
# @app.route('/bigquery')
# def query_stackoverflow():
#     # [START bigquery_simple_app_client]
#     client = bigquery.Client()
#     # [END bigquery_simple_app_client]
#     # [START bigquery_simple_app_query]
#     query_job = client.query("""
#         SELECT
#           CONCAT(
#             'https://stackoverflow.com/questions/',
#             CAST(id as STRING)) as url,
#           view_count
#         FROM `bigquery-public-data.stackoverflow.posts_questions`
#         WHERE tags like '%google-bigquery%'
#         ORDER BY view_count DESC
#         LIMIT 10""")

#     results = query_job.result()  # Waits for job to complete.
#     # [END bigquery_simple_app_query]

#     # [START bigquery_simple_app_print]
#     resultsr = ""
#     for row in results:
#         #print("{} : {} views".format(row.url, row.view_count))
#         resultsr = resultsr + "br" + "{} : {} views".format(row.url, row.view_count)
#     return resultsr
    # [END bigquery_simple_app_print]

if __name__ == '__main__':
    app.run()
