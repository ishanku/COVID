from flask import Flask
from google.cloud import bigquery

app = Flask(__name__)


@app.route('/')
def hello():
    return "Hello World!"


@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

@app.route('/sql')
def sqlname():
    return "I am using cloud sql"

@app.route('/bigquery')
def query_stackoverflow():
    # [START bigquery_simple_app_client]
    client = bigquery.Client()
    # [END bigquery_simple_app_client]
    # [START bigquery_simple_app_query]
    query_job = client.query("""
        SELECT
          CONCAT(
            'https://stackoverflow.com/questions/',
            CAST(id as STRING)) as url,
          view_count
        FROM `bigquery-public-data.stackoverflow.posts_questions`
        WHERE tags like '%google-bigquery%'
        ORDER BY view_count DESC
        LIMIT 10""")

    results = query_job.result()  # Waits for job to complete.
    # [END bigquery_simple_app_query]

    # [START bigquery_simple_app_print]
    resultsr = ""
    for row in results:
        #print("{} : {} views".format(row.url, row.view_count))
        resultsr = resultsr + "br" + "{} : {} views".format(row.url, row.view_count)
    return resultsr
    # [END bigquery_simple_app_print]

if __name__ == '__main__':
    app.run()