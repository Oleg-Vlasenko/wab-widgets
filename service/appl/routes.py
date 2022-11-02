# -*- coding: utf-8 -*-
# -*- coding: utf-8 -*-
import os,sys
rootpath = os.path.dirname(__file__)
sys.path.append(rootpath)  #add to path local
#
from flask import render_template, flash, redirect, url_for, send_from_directory, make_response
from appl import app
from appl.forms import LoginForm
from appl.forms import RegistrationForm

from appl import db

from flask_login import current_user, login_user
from appl.models import Users
from flask_login import logout_user
from flask_login import login_required
from flask import request
from werkzeug.urls import url_parse

#from flask import url_for, request, Response, render_template, abort, redirect, send_from_directory, flash

#from flask_restful import Resource, Api

import datetime

import urllib3
http = urllib3.PoolManager()

import psycopg2
from psycopg2.extras import Json
from psycopg2.extensions import register_adapter
register_adapter(dict, Json)

import json, decimal
def default(self, obj):
    if isinstance(obj, decimal.Decimal): return float(obj)

import serversidetable as st
from config import Config
connstring = Config.connstring
#Config.SQLALCHEMY_DATABASE_URI
#Config.connstring

@app.route('/')
@app.route('/index')
#@login_required
def index():
    #user = {'username': 'miguel'}
    return render_template("index.html", title='Home Page')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = Users(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        user.status = 0
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)



def getLayersByGroup(groupname=None):
    data = {}
    if not groupname:
        datasetid = -1
        return data

    con = None
    try:
        con = psycopg2.connect(connstring)
        #cur = con.cursor()
        cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
        #sql = "SELECT keyvalue FROM {}	where keyname = '{}'".format(tablename, key )
        sql = '''select 
                id,
                dsname,
                datasetid,
                typelayer,
                layeroptions,
                extent,
                dsdata 
                from register.v_datasets_group
                where 1=1
        '''
        #              ' % (groupname)
        if groupname is not None:
            sql = "%s and groupdataset = '%s' " % (sql, groupname)
        cur.execute(sql)
        select = cur.fetchall()
        if len(select) > 0:
            cols = list(map(lambda x: x[0], cur.description)) #
            #select.insert(0, tuple(cols))  # insert elements by list.insert(index, new_item) method если нужно вставить заголовки в начало списка
            dcols = {}
            '''
            for i in range(len(cols)):
                #dcols[cols[i]] = i
                #data[cols[i]] = select[0][i]
                data[cols[i]] = select[i]
            '''

        rows = {}
        rows['layers'] = []
        # select.insert(0, tuple(cols))  # insert elements by list.insert(index, new_item) method если нужно вставить заголовки в начало списка
        # dcols = {}
        for row in select:
            datarow = {}
            for i in range(len(cols)):
                #dcols[cols[i]] = i
                #data[cols[i]] = select[0][i]
                datarow[cols[i]] = row[i]
            '''    
            for i in range(len(cols)):
                if cols[i] == 'geom':
                    pass
                else:
                    datarow.append(row[i])
            '''
            rows['layers'].append(datarow)
        #data['data'] = rows
        data = rows
    except Exception as e:
        pass
        #print(e)
    finally:
        if con:
            con.close()

    #	datasetid = 'test14_1613330564803'
    return data


def __get_kcp_code():
    pass
    sql = '''
    select 
    	kod,
    	"group", prizn,
    	kod ||' '|| "group" ||' '||  	prizn as  kod_prizn,
    	koeff
    from layers.kcp 
    
    '''.format(cadnum='')
    print(sql)
    try:
        con = psycopg2.connect(connstring)
        cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
        # cur = con.cursor()
        cur.execute(sql)
        select = cur.fetchone()
        data = {}
        if select:
            print(select)
            cols = list(map(lambda x: x[0], cur.description)) #
            for key in cols:
                data[key] = select.get(key)
        # con.commit()
    except Exception as e:
        status = 500
    finally:
        if con:
            con.close()


@app.route('/parcel/<parcel_id>', methods=['GET'])
def __parcel(parcel_id=None, con=None):
    result = {}
    if not parcel_id:
        parcel_id = ""
        return "", 200 # 500

    environ = request.environ
    method = request.method
    sql = '''
    select 
        *, public.st_asgeojson(public.st_transform(geom,4326)) as geomjson
    from layers.v_diljanky where cadnum = '{cadnum}'
    '''.format(cadnum=parcel_id)
    print(sql)
    result['status'] = False
    try:
        con = psycopg2.connect(connstring)
        cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)
        # cur = con.cursor()
        cur.execute(sql)
        select = cur.fetchone()
        data = {}
        if select:
            print(select)
            cols = list(map(lambda x: x[0], cur.description)) #
            #select.insert(0, tuple(cols))  # insert elements by list.insert(index, new_item) method если нужно вставить заголовки в начало списка
            for key in cols:
                data[key] = select.get(key)


        # con.commit()
        result['status'] = True
    except Exception as e:
        result["error"] = str(e.args[0])
        result['status'] = False
        status = 500
    finally:
        if con:
            con.close()
    parceldata = {}
    parceldata['wmsurl'] = Config.GEOSERVER + '/wms'
    parceldata['select']  = select
    parceldata['data'] = data
    # return render_template('parcel_edit.html')
    return render_template('parcel_edit.html', parceldata=parceldata)


@app.route('/parcelgeom/<parcel_geom>', methods=['GET','POST'])
def __parcelgeom(parcel_geom=None, con=None):
    # print('parcelgeom')
    # return 'parcelgeom'

    result = {}
    if not parcel_geom:
        parcel_id = ""
        return "", 200 # 500

    environ = request.environ
    method = request.method

    con = psycopg2.connect(connstring)
    cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)

    parceldata = {}

    sql = '''
    SELECT id, ST_Area(ST_GeomFromGeoJSON('{geom}'):: geometry)
    FROM arcgis.public."червоні_лінії_діпроміста" n
    LIMIT 1
        '''.format(geom=parcel_geom)

    cur.execute(sql)
    select = cur.fetchone()
    parceldata['area'] = select[1]

    sql = '''
    SELECT *
    FROM arcgis.public."червоні_лінії_діпроміста" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)

    cur.execute(sql)
    rows = cur.fetchall()

    rl = []
    for row in rows:
        rl.append(row)

    sql = '''
    SELECT *
    FROM arcgis.public."інші_розроблені_червоні_лінії" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)
    
    cur.execute(sql)
    rows = cur.fetchall()

    rlo = []
    for row in rows:
        rlo.append(row)

    sql = '''
    SELECT *
    FROM arcgis.public."зонінг" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)
    
    cur.execute(sql)
    rows = cur.fetchall()

    zng = []
    for row in rows:
        zng.append(row)

    sql = '''
    SELECT *
    FROM arcgis.public."Історичний ареал" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)
    
    cur.execute(sql)
    select = cur.fetchone()

    hist = [False, False, False, False]
    if select:
        hist[0] = True
        
    sql = '''
    SELECT *
    FROM arcgis.public."зони регулювання забудови в межах історичних ареалів" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)
    
    cur.execute(sql)
    select = cur.fetchone()

    if select:
        hist[1] = True
        
    sql = '''
    SELECT *
    FROM arcgis.public."зони охорони памяток архітектури" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)
    
    cur.execute(sql)
    select = cur.fetchone()

    if select:
        hist[2] = True
        
    sql = '''
    SELECT *
    FROM arcgis.public."Зони обєктів природно_заповідного фонду" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)
    
    cur.execute(sql)
    select = cur.fetchone()

    if select:
        hist[3] = True
        
    sql = '''
    SELECT *
    FROM arcgis.public."Прибережні_захисні смуги" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)

    cur.execute(sql)
    rows = cur.fetchall()

    pzsvs = []
    for row in rows:
        pzsvs.append('Прибережні захисні смуги, ріш. №|'+row[3]+' від '+row[4].strftime('%d.%m.%Y'))
        
    sql = '''
    SELECT *
    FROM arcgis.public."Водоохоронні зони" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)

    cur.execute(sql)
    rows = cur.fetchall()
    for row in rows:
        pzsvs.append('Водоохоронні зони, ріш. №|'+row[3]+' від '+row[4].strftime('%d.%m.%Y'))
        
    sql = '''
    SELECT *
    FROM arcgis.public."Межі санітарно_захисних зон промислових" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)

    cur.execute(sql)
    select = cur.fetchone()

    prot1 = False
    if select:
        prot1 = True

    sql = '''
    SELECT *
    FROM arcgis.public."с_з_розрахункові" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)

    prot2 = []
    cur.execute(sql)
    rows = cur.fetchall()
    for row in rows:
        prot2.append('градобоснов №|'+str(row[4]))

    sql = '''
    SELECT *
    FROM arcgis.public."Межі лісового господарства" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)
    
    cur.execute(sql)
    select = cur.fetchone()

    brd = [False, False, False]
    if select:
        brd[0] = True

    sql = '''
    SELECT *
    FROM arcgis.public."Зони що не підлягають забудові" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)
    
    cur.execute(sql)
    select = cur.fetchone()

    if select:
        brd[1] = True

    sql = '''
    SELECT *
    FROM arcgis.public."зелене_господарство" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON('{geom}')::geometry,0))
        '''.format(geom=parcel_geom)
    
    cur.execute(sql)
    select = cur.fetchone()

    if select:
        brd[2] = True


    zng_lst = []
    zng_grp = []
    zng_docs = [
        'В-2',
        'В-3',
        'В-4',
        'В-5',
        'В-6',
        'Г-1',
        'Г-2',
        'Г-3-1',
        'Г-3-2',
        'Г-3-3',
        'Г-4-1',
        'Г-4-2',
        'Г-4-4',
        'Г-5-1',
        'Г-5-2',
        'Г-6',
        'Г-ТР -1-2',
        'Ж-1',
        'Ж-7',
        'ІК',
        'ІН-1',
        'ІН-2',
        'ІН-3',
        'КВТ',
        'КЛ-2',
        'КС-2',
        'КС-3',
        'КС-3-1',
        'КС-4',
        'КС-4-1',
        'КС-5',
        'КС-5-1',
        'КС-6',
        'П-В-5',
        'П-В-6',
        'П-Г-2',
        'П-Г-3-1',
        'П-Г-6',
        'П-Ж-1',
        'П-Ж-7',
        'П-ІН-1',
        'П-КС-3-1',
        'П-КС-4',
        'П-КС-5',
        'П-КС-6',
        'П-Р-2',
        'П-Р-3',
        'П-Р-3-2',
        'П-ТР-2-1',
        'Р-1',
        'Р-2',
        'Р-3',
        'Р-3-2',
        'Р-3-4',
        'Р-4',
        'С-2',
        'С-3',
        'С-4'
    ]

    for zng_r in zng:
        if len(zng_r[10].strip()) > 0:
            # print(len(zng_r[9].strip()))
            zng_str = zng_r[9]+'|'+zng_r[10]
            zng_lst.append(zng_str)
    
    # group
    zng_lst = list(set(zng_lst))
    # sort
    zng_lst.sort()
    # grp and sorted to array
    for zng_str in zng_lst:
        zng_grp.append(zng_str.split('|'))
    # text for printform
    zng_text = ''
    for zng_str in zng_grp:
        zng_text += zng_str[1]+'; '
    # docx links
    for idx, zng_str in enumerate(zng_grp):
        if zng_str[0] in zng_docs:
            zng_grp[idx].append('docxlnk')
        else:
            zng_grp[idx].append('nolnk')

        zng_grp[idx].append(zng_str[0]+' '+zng_str[1])
        
    rl_str = []
    rl_grp = []
    rl_type = 10
    rl_text = ''
    for rlr in rl:
        rl_str.append('3|-|Червоні лінії Діпромісто')
        if rl_type > 3:
            rl_type = 3
        
    for rlor in rlo:
        if len(rlor[5].strip()) > 0:
            rl_str.append('1|Рішення міської ради №|'+rlor[5]+' від '+rlor[3].strftime('%d.%m.%Y'))
            if rl_type > 1:
                rl_type = 1
        elif len(rlor[8].strip()) > 0:
            rl_str.append('2|Протокол містобудівної ради №|'+rlor[8].replace('от', 'від'))
            if rl_type > 2:
                rl_type = 2

    rl_str = list(set(rl_str))
    rl_str.sort()

    for rlr in rl_str:
        rl_grp.append(rlr.split('|'))

    if rl_type == 1:
        rl_text = 'ЧЕРВОНІ ЛІНІЇ ЗАТВЕРДЖЕНІ РІШЕННЯМ МІСЬКОЇ РАДИ: <br>'
    elif rl_type == 2:
        rl_text = 'ЧЕРВОНІ ЛІНІЇ РОЗГЛЯНУТІ НА ЗАСІДАННІ АРХІТЕКТУРНО-МІСТОБУДІВНОЇ РАДИ: <br>'
    elif rl_type == 3:
        rl_text = 'ЧЕРВОНІ ЛІНІЇ ЗА МАТЕРІАЛАМИ ДП НАУКОВО-ДОСЛІДНОГО ІНСТИТУТА ПРОЕКТУВАННЯ МІСТ ІМ. Ю.М. БІЛОКОНЯ'
        
    hist_text1 = ' - '
    if hist[0]:
        hist_text1 = 'Ділянка знаходиться на території історичного ареалу'
        
    hist_text2 = ' - '
    if hist[1] and hist[2]:
        hist_text2 = 'Ділянка знаходиться в зоні регулювання забудови об’єкта культурної спадщини та в охоронній зоні об’єкта культурної спадщини'
    elif hist[1]:
        hist_text2 = 'Ділянка знаходиться в зоні регулювання забудови об’єкта культурної спадщини'
    elif hist[2]:
        hist_text2 = 'Ділянка знаходиться в охоронній зоні об’єкта культурної спадщини'
        
    hist_text3 = ' - '
    if hist[3]:
        hist_text3 = 'Ділянка знаходиться в зоні об’єктів природно-заповідного фонду'
        
    pzsvs_grp = []
    # group
    pzsvs = list(set(pzsvs))
    # sort
    pzsvs.sort()
    # grp and sorted to array
    for pzsvs_str in pzsvs:
        pzsvs_grp.append(pzsvs_str.split('|'))
    
    pzsvs_text = ' - '
    if len(pzsvs_grp) > 0:
        pzsvs_text = 'Ділянка знаходиться в межах водоохоронної зони або в межах природно-захисної смуги затвердженою рішення міської ради: <br>'

    prot_grp = []
    for protr in prot2:
        prot_grp.append(protr.split('|'))
        
    prot_text = ' - '
    # if prot1: если або растращ на 1и2/1/2, то как if rl_type == 1:
    if prot1 or len(prot2) > 0:
        prot_text = 'Відповідно до плану зонування території ділянка знаходиться в межах санітарно-захисної смуги або в межах розрахункової відстані'
        if len(prot2) > 0:
            prot_text += ': <br>'
        
    brd_text1 = ' - '
    if brd[0]:
        brd_text1 = 'Ділянка знаходиться в межах лісового господарства'
    
    brd_text2 = ' - '
    if brd[1]:
        brd_text2 = 'Ділянка знаходиться в межах території, яка не підлягає забудові'
    
    brd_text3 = ' - '
    if brd[2]:
        brd_text3 = 'Ділянка знаходиться в межах об’єкта зеленого господарства'
    

    # print(parceldata['zoning'])
    # print(parceldata['red_lines'][0])
    # print(parceldata['rl_others'][0])
    # return 'red_lines'
    
    parceldata['zoning'] = zng_grp
    parceldata['zng_text'] = zng_text
    parceldata['red_lines'] = rl_grp
    parceldata['rl_text'] = rl_text
    parceldata['rl_type'] = rl_type
    parceldata['hist'] = hist
    parceldata['hist_text1'] = hist_text1
    parceldata['hist_text2'] = hist_text2
    parceldata['hist_text3'] = hist_text3
    parceldata['pzsvs'] = pzsvs_grp
    parceldata['pzsvs_text'] = pzsvs_text
    parceldata['prot'] = prot_grp
    parceldata['prot_text'] = prot_text
    parceldata['brd'] = brd
    parceldata['brd_text1'] = brd_text1
    parceldata['brd_text2'] = brd_text2
    parceldata['brd_text3'] = brd_text3
    
    return render_template('parcel_geom.html', parceldata=parceldata)

@app.route('/printform', methods=['GET','POST'])
def __printform():
    print('printform:')
    print(request)
    print(request.form)
    return 'prnform'
    
    printdata = {'zng_text': request.form['zng_text'], 'rl_text': request.form['rl_text'], 'hist_text1': request.form['hist_text1'], 'hist_text2': request.form['hist_text2'], 'hist_text3': request.form['hist_text3']}
    return render_template('printform.html', printdata=printdata)

@app.route('/printform2', methods=['POST'])
def __printform2():
    return render_template('printform2.html')

@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404


#любые шаблоны для которых нет другого маршрута
@app.route('/<patch>')
#@login_required
def _routepatch(patch=None):
    try:
        data = {} #get_trdata()

        return render_template(patch + '.html', data = data)
    except Exception as e:
        return page_not_found(404)
