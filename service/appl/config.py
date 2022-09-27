# -*- coding: utf-8 -*-
import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):

    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'pst_secret'
    #SECRET_KEY = os.environ.get('SECRET_KEY') or 'tradematesecret'
    #SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    #SQLALCHEMY_DATABASE_URI = 'postgresql://vin:vN020213@vingis.com.ua:5433/trademate'
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:root@localhost:5432/otg'
    #SQLALCHEMY_DATABASE_URI = 'postgresql://vin:vN020213@localhost:5433/trade'
    #mysql: // username: password @ server / db
    #SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ... add more variables here as needed
    '''
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 25)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS') is not None
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    '''
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = 1
    MAIL_USERNAME = ''
    MAIL_PASSWORD = ''

    ADMINS = ['mail@gmail.com']

    DATABASE = {
     'name': 'arcgis',  # укажите свою БД
     'engine': 'peewee.PostgresqlDatabase',
     'user': 'postgres',  # тут юзера своего
     'password': 'cbcntvrflfcnh',  # а тут пароль для подключения к БД
     'host': '192.168.17.46',
     'port': 5432,
     'sslmode':'false'
    }

    connstring = "dbname=%s user=%s password=%s host=%s port=%s" % (
    DATABASE['name'], DATABASE['user'], DATABASE['password'], DATABASE['host'], DATABASE['port'])

    GEOSERVER = "http://localhost:8080/geoserver"
    GEOSERVERREST = "http://localhost:8080/geoserver/rest"
    WORKSPACE = 'otg'
    GSUSER = 'admin'
    GSPWD = 'geoserver'


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
