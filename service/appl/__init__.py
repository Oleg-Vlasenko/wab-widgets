# -*- coding: utf-8 -*-
from flask import Flask
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

@app.context_processor
def inject_docs_url():
    return dict(docs_base_url=app.config['DOCS_BASE_URL'])

from appl import routes