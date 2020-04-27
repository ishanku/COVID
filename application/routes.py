from db import loadData,getData,getLatitudeLongitude
import requests
import pandas as pd
import json
#from application import app, db, api
from flask import render_template, request, json, jsonify, Response, redirect, flash, url_for, session
from flask_restplus import Resource

@app.route('/')
def home():
    #sqldata()
    coviddata()
    covidall()
    covid19()
    return render_template("index.html")

@app.route("/covidtotal")
def covidtotal():
    url="https://covid-19-statistics.p.rapidapi.com/reports/total"
    
    headers = {
    #'x-rapidapi-host': "covid19-data.p.rapidapi.com",
    'x-rapidapi-key': "69a2a479b7msheb974da9ba512eep14ac07jsn1360d4b1636c"
    }
    response = requests.request("GET", url, headers=headers).json()
    #response = requests.get(url).json()
    if response == None or response == '':
      data="{}"
      print('I got a null or empty string value for data in a file')
    else:
        data=json.dumps(response, indent=4, sort_keys=True)
    return data
  

@app.route("/worldmap")
def worldmap():
    return render_template("worldmap.html")

@app.route("/covidnumbers")
def covidnumbers():
    return render_template("covidnumbers.html")
  
@app.route("/covidnumbersusa")
def covidnumbersusa():
    return render_template("covidnumbersusa.html")
@app.route("/usamap")
def usamap():
    return render_template("usamap.html")
@app.route("/covidnumbersga")
def covidnumbersga():
    return render_template("covidnumbersga.html")
@app.route("/gamap")
def gamap():
    return render_template("gamap.html")

@app.route("/regionalmap/<region>")
def regionalmap(region):
    regional(region)
    return render_template("regionalmap.html",region=region)

@app.route('/regional/<region>')
def regional(region):
    url="https://covid19-data.p.rapidapi.com/geojson-"+region;
    headers = {
    'x-rapidapi-host': "covid19-data.p.rapidapi.com",
    'x-rapidapi-key': "69a2a479b7msheb974da9ba512eep14ac07jsn1360d4b1636c"
    }
    response = requests.request("GET", url, headers=headers).json()
    #response = requests.get(url).json()
    if response == None or response == '':
      data="{}"
      print('I got a null or empty string value for data in a file')
    else:
        data=json.dumps(response, indent=4, sort_keys=True)
    return data

@app.route("/usamap")
def usamap():
    return render_template("usamap.html")

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

@app.route('/covidall')
def covidall():
    url="https://covid-19-statistics.p.rapidapi.com/reports";
    headers = {
    #'x-rapidapi-host': "covid19-monitor-pro.p.rapidapi.com",
    'x-rapidapi-key': "69a2a479b7msheb974da9ba512eep14ac07jsn1360d4b1636c"
    }
    response = requests.request("GET", url, headers=headers).json()
    #response = requests.get(url).json()
    covidall=json.dumps(response, indent=4, sort_keys=True)
    return covidall


@app.route('/covid19')
def covid19():
    url="https://covid-19-tracking.p.rapidapi.com/v1";
    headers = {
    #'x-rapidapi-host': "covid19-monitor-pro.p.rapidapi.com",
    'x-rapidapi-key': "69a2a479b7msheb974da9ba512eep14ac07jsn1360d4b1636c"
    }
    response = requests.request("GET", url, headers=headers).json()
    #response = requests.get(url).json()
    covid19=json.dumps(response, indent=4, sort_keys=True)
    return covid19

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

