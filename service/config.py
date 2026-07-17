# -*- coding: utf-8 -*-
import os

class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'pst_secret'

    # Настройки прямого подключения к PostgreSQL/PostGIS для psycopg
    DB_NAME = 'arcgis'
    DB_USER = 'postgres'
    DB_PASSWORD = 'cbcntvrflfcnh'
    DB_HOST = '192.168.17.46'
    DB_PORT = 5432

    # Формирование единой строки подключения для routes.py
    connstring = f"dbname={DB_NAME} user={DB_USER} password={DB_PASSWORD} host={DB_HOST} port={DB_PORT}"

    # Геосерверная инфраструктура
    GEOSERVER = "http://localhost:8080/geoserver"
    GEOSERVERREST = "http://localhost:8080/geoserver/rest"
    WORKSPACE = 'otg'
    GSUSER = 'admin'
    GSPWD = 'geoserver'

    # Путь обмена для ГИС-модуля экспорта полигонов
    POLY_EXCHANGE_PATH = r"C:\geom.txt"

class ProductionConfig(Config):
    DEBUG = False


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True