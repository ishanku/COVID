
from application import app,db
import requests
import pandas as pd
import json
import os
#from application import app, db, api
from flask import render_template, request, json, jsonify, Response, redirect, flash, url_for, session
#from flask_restplus import Resource

rapidapikey = os.environ['rapidapikey']

@app.route("/")
@app.route("/index")
@app.route("/home")
def index():
    #sqldata()
    coviddata()
    covidall()
    covid19()
    return render_template("index.html")

@app.route("/covidtotal")
def covidtotal():
    url="https://covid-19-statistics.p.rapidapi.com/reports/total"
    
    headers = {
    'x-rapidapi-key': rapidapikey
    }
    response = requests.request("GET", url, headers=headers).json()
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

@app.route("/oilprices")
def oilprices():
    return render_template("oilprices.html")

@app.route("/forexmap")
def forexmap():
    return render_template("forexmap.html")
  
@app.route("/covidnumbersusa")
def covidnumbersusa():
    return render_template("covidnumbersusa.html")

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

@app.route('/route/<route1>')
def masterroute(route1):
    html_render="index.html"
    leftbar="/covidnumbers"
    child1="/"+route1
    if (route1 == 'usamap'):
        leftbar="/covidnumbersusa"
    if (route1 == 'gamap'):
        leftbar="/covidnumbersga"
    return render_template(html_render,child1=child1,leftbar=leftbar)
    
@app.route('/sroute/<route1>/<route2>')
def mastersubroute(route1,route2):
    html_render="index.html"
    leftbar="/covidnumbers"
    child1="/"+route1
    child2=route2
    if (route1 == 'usamap'):
        leftbar="/covidnumbersusa" 
    return render_template(html_render,child1=child1,child2=child2,leftbar=leftbar)

@app.route('/regional/<region>')
def regional(region):
    url="https://covid19-data.p.rapidapi.com/geojson-"+region;
    headers = {
    'x-rapidapi-host': "covid19-data.p.rapidapi.com",
    'x-rapidapi-key': rapidapikey
    }
    response = requests.request("GET", url, headers=headers).json()
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
    data_country=db.getData(tables)
    return data_country

@app.route('/data_forex')
def forexdata():
    tables="forex"
    data=db.getData(tables)
    return data

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
    'x-rapidapi-key': rapidapikey
    }
    response = requests.request("GET", url, headers=headers).json()
    covidall=json.dumps(response, indent=4, sort_keys=True)
    return covidall


@app.route('/covid19')
def covid19():
    url="https://covid-19-tracking.p.rapidapi.com/v1";
    headers = {
    'x-rapidapi-key': rapidapikey
    }
    response = requests.request("GET", url, headers=headers).json()
    covid19=json.dumps(response, indent=4, sort_keys=True)
    return covid19

@app.route('/covid19LL')
def covid19LL():
    covid19data=covid19()
    countrydata=sqldata()
    return countrydata

@app.route('/data_fullC19')
def fullC19():

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
            LatLon=pd.DataFrame(db.getLatitudeLongitude(iCountry))
            tmp=pd.DataFrame({"Country":[index],"Latitude":LatLon[0],"Longitude":LatLon[1],"TotalCases":[row['TotalCases']],"TotalLosses": [row['TotalLosses']],"Date":[row['Date']],"Population":[row['Population']]})
        except KeyError:
            tmp=pd.DataFrame({"Country":[index],"Latitude":"","Longitude":"","TotalCases":[row['TotalCases']],"TotalLosses": [row['TotalLosses']],"Date":[row['Date']],"Population":[row['Population']]})

    alldf=alldf.append(tmp)
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
    LoadResult=db.loadData('static/data/covidfulldata.csv',"fullc19","csv")
    return "DataLoaded"

