from flask import Flask
app = Flask(__name__)


@app.route('/')
def hello():
    return "Hello World!"


@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

@app.route('/sql')
def sql_name(name):
    return "I am using cloud sql"

if __name__ == '__main__':
    app.run()