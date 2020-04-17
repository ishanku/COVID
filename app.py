from flask import Flask,render_template,json, url_for
from main.db import loadData,getData
import requests
import json
import os.path

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

@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

@app.route('/sql')
def sqlname():
    return "I am using cloud sql"

@app.route('/loaddata/<filename>')
def loadNewData():
    LoadResult=loadData('static/data/covid.csv',"c19","csv")
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
