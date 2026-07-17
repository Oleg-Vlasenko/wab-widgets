# -*- coding: utf-8 -*-
from flask import Flask
from config import Config
import decimal
import flask.json

class DecimalEncoder(flask.json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

app = Flask(__name__)
app.config.from_object(Config)
app.json_encoder = DecimalEncoder

# Импортируем маршруты после создания app
from appl import routes