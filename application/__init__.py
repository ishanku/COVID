from flask import Flask
from config import Config
#from flask_restplus import Api

#api = Api()

app = Flask(__name__)
app.config.from_object(Config)
app.config.from_pyfile('settings.py')

#db = MongoEngine()
#db.init_app(app)
#pi.init_app(app)

from application import routes
