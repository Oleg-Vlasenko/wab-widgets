# -*- coding: utf-8 -*-
import datetime
import decimal
import json
import os
import sys

# stdlib

rootpath = os.path.dirname(__file__)
sys.path.append(rootpath)  #add to path local

# third-party
from flask import jsonify, render_template, request
import psycopg
from psycopg.rows import dict_row

# local imports
from appl import app
from config import Config

connstring = Config.connstring


def default(self, obj):
    if isinstance(obj, decimal.Decimal): return float(obj)


@app.route('/')
@app.route('/index')
def index():
    return "XOtgService"
    # return render_template("index.html", title='Home Page')

@app.route('/favicon.ico')
def favicon():
    return '', 204  # No Content - браузер не будет повторно запрашивать

@app.route('/testdb')
def testdb():

    con = psycopg.connect(connstring, row_factory=dict_row)
    cur = con.cursor()

    layers = [
        "червоні_лінії_діпроміста",
        "інші_розроблені_червоні_лінії",
        "зонінг",
        "Історичний ареал",
        "зони охорони памяток архітектури",
        "зони регулювання забудови в межах історичних ареалів_1",
        "Зони обєктів природно_заповідного фонду",
        "Прибережні_захисні смуги",
        "Водоохоронні зони",
        "Межі лісового господарства",
        "с_з_розрахункові",
        "Межі санітарно_захисних зон промислових",
        "Зони що не підлягають забудові",
        "зелене_господарство",
        "муо",
        "бп",
        "паспорт_прив_тимч_споруд",
        "містобудівна_рада",
        "висновки",
        "dozvol_zayava_region",
        "Проекти_інженерних_мереж",
        "xml"
    ]

    result = {}

    for layer in layers:

        cur.execute("""
            SELECT EXISTS (
                SELECT 1
                FROM pg_tables
                WHERE schemaname = 'public'
                  AND tablename = %s
            );
        """, (layer,))

        result[layer] = cur.fetchone()["exists"]

    con.close()

    return result


@app.route('/rlupload/<parcel_geom>', methods=['GET'])
def red_lines_upload(parcel_geom=None, con=None):

    result = {}
    if not parcel_geom:
        parcel_id = ""
        return "", 200 # 500

    environ = request.environ
    method = request.method

    con = psycopg.connect(connstring, row_factory=dict_row)
    cur = con.cursor()

    parceldata = {}

    sql = '''
    SELECT json_build_object(
        'type',       'FeatureCollection',
        'features',   json_agg(
            json_build_object(
                'type',       'Feature',
                'geometry',   ST_AsGeoJSON(n.geom)::json
            )
        )
    ) AS geojson
    FROM public."червоні_лінії_діпроміста" n
    WHERE ST_Intersects(
        n.geom,
        ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry, 0)
    );
    '''

    cur.execute(sql, (parcel_geom,))
    rl = cur.fetchone()[0]
    
    parceldata["rl"] = rl
    
    sql = '''
    SELECT json_build_object(
        'type',       'FeatureCollection',
        'features',   json_agg(
            json_build_object(
                'type',       'Feature',
                'geometry',   ST_AsGeoJSON(n.geom)::json
            )
        )
    ) AS geojson
    FROM public."інші_розроблені_червоні_лінії" n
    WHERE ST_Intersects(
        n.geom,
        ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry, 0)
    );
    '''

    cur.execute(sql, (parcel_geom,))
    rlo = cur.fetchone()[0]
    
    parceldata["rlo"] = rlo
    
    return render_template('rl_upload.html', parceldata=parceldata)


@app.route('/parcelgeom/<parcel_geom>', methods=['GET','POST'])
def __parcelgeom(parcel_geom=None, con=None):
    result = {}
    if not parcel_geom:
        parcel_id = ""
        return "", 200 # 500
        
    environ = request.environ
    method = request.method

    con = psycopg.connect(connstring, row_factory=dict_row)
    cur = con.cursor()

    parceldata = {}

    sql = '''
    SELECT id, ST_Area(ST_GeomFromGeoJSON(%s):: geometry) as area
    FROM public."червоні_лінії_діпроміста" n
    LIMIT 1
        '''

    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    parceldata['area'] = select['area']

    sql = '''
    SELECT *
    FROM public."червоні_лінії_діпроміста" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''

    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()

    rl = []
    for row in rows:
        rl.append(row)

    sql = '''
    SELECT *
    FROM public."інші_розроблені_червоні_лінії" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()

    rlo = []
    for row in rows:
        rlo.append(row)

    sql = '''
    SELECT *
    FROM public."зонінг" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()

    zng = []
    for row in rows:
        zng.append(row)

    sql = '''
    SELECT *
    FROM public."Історичний ареал" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    hist = [False, False, False, False]
    if select:
        hist[0] = True
        
    sql = '''
    SELECT *
    FROM public."зони охорони памяток архітектури" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    if select:
        hist[1] = True

    sql = '''
    SELECT *
    FROM public."зони регулювання забудови в межах історичних ареалів_1" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    if select:
        hist[2] = True
        
    sql = '''
    SELECT *
    FROM public."Зони обєктів природно_заповідного фонду" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    if select:
        hist[3] = True
        
    sql = '''
    SELECT *
    FROM public."Прибережні_захисні смуги" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''

    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()

    pzsvs = []
    pzsvs_type = [False, False]
    for row in rows:
        pzsvs.append('Прибережні захисні смуги, ріш. №|' + str(row.get('n_reshen', '')) + ' від ' + row.get('date_reshe', datetime.date.today()).strftime('%d.%m.%Y'))
        if not pzsvs_type[0]:
            pzsvs_type[0] = True
        
    sql = '''
    SELECT *
    FROM public."Водоохоронні зони" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''

    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()
    for row in rows:
        pzsvs.append('Водоохоронні зони, ріш. №|' + str(row.get('nom_reshen', '')) + ' від ' + row.get('data_reshe', datetime.date.today()).strftime('%d.%m.%Y'))
        if not pzsvs_type[1]:
            pzsvs_type[1] = True
        
    sql = '''
    SELECT *
    FROM public."Межі санітарно_захисних зон промислових" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''

    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    prot1 = False
    if select:
        prot1 = True

    sql = '''
    SELECT *
    FROM public."с_з_розрахункові" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''

    prot2 = []
    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()
    for row in rows:
        prot2.append(str(row.get('kadnom', '')) + '|' + str(row.get('datasgo', '')) + ' від ' + row.get('dataprod', datetime.date.today()).strftime('%d.%m.%Y'))

    sql = '''
    SELECT *
    FROM public."Межі лісового господарства" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    brd = [False, False, False]
    if select:
        brd[0] = True

    sql = '''
    SELECT *
    FROM public."Зони що не підлягають забудові" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    if select:
        brd[1] = True

    sql = '''
    SELECT *
    FROM public."зелене_господарство" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    if select:
        brd[2] = True

    other_docs = [False, False, False, False, False, False]

    sql = '''
    SELECT *
    FROM public."муо" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[0] = True

    sql = '''
    SELECT *
    FROM public."бп" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[1] = True

    sql = '''
    SELECT *
    FROM public."паспорт_прив_тимч_споруд" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[2] = True

    sql = '''
    SELECT *
    FROM public."містобудівна_рада" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[3] = True

    sql = '''
    SELECT *
    FROM public."висновки" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[4] = True

    sql = '''
    SELECT *
    FROM public."dozvol_zayava_region" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[5] = True


    zng_lst = []
    zng_grp = []
    zng_docs = [
        'В-2', 'В-3', 'В-4', 'В-5', 'В-6', 'Г-1', 'Г-2', 'Г-3-1', 'Г-3-2', 'Г-3-3',
        'Г-4-1', 'Г-4-2', 'Г-4-4', 'Г-5-1', 'Г-5-2', 'Г-6', 'Г-ТР -1-2', 'Ж-1', 'Ж-7',
        'ІК', 'ІН-1', 'ІН-2', 'ІН-3', 'КВТ', 'КЛ-2', 'КС-2', 'КС-3', 'КС-3-1', 'КС-4',
        'КС-4-1', 'КС-5', 'КС-5-1', 'КС-6', 'П-В-5', 'П-В-6', 'П-Г-2', 'П-Г-3-1', 'П-Г-6',
        'П-Ж-1', 'П-Ж-7', 'П-ІН-1', 'П-КС-3-1', 'П-КС-4', 'П-КС-5', 'П-КС-6', 'П-Р-2',
        'П-Р-3', 'П-Р-3-2', 'П-ТР-2-1', 'Р-1', 'Р-2', 'Р-3', 'Р-3-2', 'Р-3-4', 'Р-4',
        'С-2', 'С-3', 'С-4'
    ]

    for zng_r in zng:
        if len(zng_r.get('ZONONG1', '').strip()) > 0:
            zng_str = zng_r.get('ZONING', '') + '|' + zng_r.get('ZONONG1', '')
            zng_lst.append(zng_str)
    
    zng_lst = list(set(zng_lst))
    zng_lst.sort()
    for zng_str in zng_lst:
        zng_grp.append(zng_str.split('|'))
    zng_text = ''
    for zng_str in zng_grp:
        zng_text += zng_str[1] + '; '
    for idx, zng_str in enumerate(zng_grp):
        if zng_str[0] in zng_docs:
            zng_grp[idx].append(zng_str[0])
        else:
            zng_grp[idx].append('nolnk')

        zng_grp[idx].append(zng_str[0] + ' ' + zng_str[1])

    rl_str = []
    rl_grp = []
    rl_type = 10
    rl_text = ''
    for rlr in rl:
        rl_str.append('3|-|Червоні лінії Діпромісто')
        if rl_type > 3:
            rl_type = 3
        
    for rlor in rlo:
        if len(rlor.get('NOM_RESH', '').strip()) > 0:
            rl_str.append('1|Рішення міської ради №|' + rlor.get('NOM_RESH', '') + ' від ' + rlor.get('DATE_RESH', datetime.datetime.now()).strftime('%d.%m.%Y'))
            if rl_type > 1:
                rl_type = 1
        elif len(rlor.get('PRIMECH', '').strip()) > 0:
            rl_str.append('2|Протокол містобудівної ради №|' + rlor.get('PRIMECH', '').replace('от', 'від'))
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
        hist_text1 = 'Ділянка знаходиться в межах історичного ареалу'
        
    hist_text2 = ' - '
    hist_text21 = ''
    if hist[1] and hist[2]:
        hist_text2 = 'Ділянка знаходиться в зоні регулювання забудови об\'єкта культурної спадщини та в охоронній зоні об\'єкта культурної спадщини'
        hist_text21 = 'Зони охорони пам\'яток архітектури та регулювання забудови пам\'яток'
    elif hist[1]:
        hist_text2 = 'Ділянка знаходиться в охоронній зоні об\'єкта культурної спадщини'
        hist_text21 = 'Зони охорони пам\'яток архітектури'
    elif hist[2]:
        hist_text2 = 'Ділянка знаходиться в зоні регулювання забудови об\'єкта культурної спадщини'
        hist_text21 = 'Зони регулювання забудови пам\'яток'
        
    hist_text3 = ' - '
    if hist[3]:
        hist_text3 = 'Ділянка знаходиться в зоні об\'єктів природно-заповідного фонду'
        
    pzsvs_grp = []
    pzsvs = list(set(pzsvs))
    pzsvs.sort()
    for pzsvs_str in pzsvs:
        pzsvs_grp.append(pzsvs_str.split('|'))
    
    pzsvs_text = ' - '
    if pzsvs_type[0] and pzsvs_type[1]:
        pzsvs_text = 'Ділянка знаходиться в межах водоохоронної зони та в межах природно-захисної смуги затвердженою рішення міської ради: <br>'
    elif pzsvs_type[0]:
        pzsvs_text = 'Ділянка знаходиться в межах природно-захисної смуги затвердженою рішення міської ради: <br>'
    elif pzsvs_type[1]:
        pzsvs_text = 'Ділянка знаходиться в межах водоохоронної зони затвердженою рішення міської ради: <br>'

    prot_grp = []
    for protr in prot2:
        prot_grp.append(protr.split('|'))
        
    prot_text = ' - '
    if prot1 and len(prot2) > 0:
        prot_text = 'Відповідно до плану зонування території ділянка знаходиться в межах санітарно-захисної смуги та в межах розрахункової відстані: <br>'
    elif prot1:
        prot_text = 'Відповідно до плану зонування территории ділянка знаходиться в межах санітарно-захисної смуги'
    elif len(prot2) > 0:
        prot_text = 'Відповідно до плану зонування території ділянка знаходиться в межах розрахункової відстані: <br>'
        
    brd_text1 = ' - '
    if brd[0]:
        brd_text1 = 'Ділянка знаходиться в межах лісового господарства'
    
    brd_text2 = ' - '
    if brd[1]:
        brd_text2 = 'Ділянка знаходиться в межах території, яка не підлягає забудові'
    
    brd_text3 = ' - '
    if brd[2]:
        brd_text3 = 'Ділянка знаходиться в межах об\'єкта зеленого господарства'
        
    otdocs_text1 = ' - '
    if other_docs[0]:
        otdocs_text1 = 'Ділянка знаходиться в межах території на яку были надані містобудівні умови та обмеження'
    
    otdocs_text2 = ' - '
    if other_docs[1]:
        otdocs_text2 = 'Ділянка знаходиться в межах території на якій був надан будівельний паспорт'
    
    otdocs_text3 = ' - '
    if other_docs[2]:
        otdocs_text3 = 'Ділянка знаходиться в межах території  на яку було видано паспорт прив`язки'
    
    otdocs_text4 = ' - '
    if other_docs[3]:
        otdocs_text4 = 'Ділянка знаходиться в межах территории на якій розглядалась можливість розташування об\'єкта згідно протоколу містобудівної ради'
    
    otdocs_text5 = ' - '
    if other_docs[4]:
        otdocs_text5 = 'На території ділянки розглядались матеріали проекту землеустрою щодо відведення зазначеної земельної ділянки'
    
    otdocs_text6 = ' - '
    if other_docs[5]:
        otdocs_text6 = 'На території ділянки были надані дозволи'
    
    parceldata['zoning'] = zng_grp
    parceldata['zng_text'] = zng_text
    parceldata['red_lines'] = rl_grp
    parceldata['rl_text'] = rl_text
    parceldata['rl_type'] = rl_type
    parceldata['hist'] = hist
    parceldata['hist_text1'] = hist_text1
    parceldata['hist_text2'] = hist_text2
    parceldata['hist_text21'] = hist_text21
    parceldata['hist_text3'] = hist_text3
    parceldata['pzsvs'] = pzsvs_grp
    parceldata['pzsvs_text'] = pzsvs_text
    parceldata['prot'] = prot_grp
    parceldata['prot_text'] = prot_text
    parceldata['brd'] = brd
    parceldata['brd_text1'] = brd_text1
    parceldata['brd_text2'] = brd_text2
    parceldata['brd_text3'] = brd_text3
    parceldata['other_docs'] = other_docs
    parceldata['otdocs_text1'] = otdocs_text1
    parceldata['otdocs_text2'] = otdocs_text2
    parceldata['otdocs_text3'] = otdocs_text3
    parceldata['otdocs_text4'] = otdocs_text4
    parceldata['otdocs_text5'] = otdocs_text5
    parceldata['otdocs_text6'] = otdocs_text6
    
    return render_template('parcel_geom.html', parceldata=parceldata)


@app.route('/parcelgeoml/<parcel_geom>', methods=['GET','POST'])
def __parcelgeoml(parcel_geom=None, con=None):

    result = {}
    if not parcel_geom:
        parcel_id = ""
        return "", 200 # 500
        
    environ = request.environ
    method = request.method

    con = psycopg.connect(connstring, row_factory=dict_row)
    cur = con.cursor()

    parceldata = {}

    sql = '''
    SELECT id, ST_Area(ST_GeomFromGeoJSON(%s):: geometry) as area
    FROM public."червоні_лінії_діпроміста" n
    LIMIT 1
        '''

    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    parceldata['area'] = select['area']

    sql = '''
    SELECT
        *,
        ST_AsGeoJSON(geom) as geojson
    FROM public."червоні_лінії_діпроміста" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''

    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()

    rl = []
    for row in rows:
        rl.append(row)

    sql = '''
    SELECT
        *,
        ST_AsGeoJSON(geom) as geojson
    FROM public."інші_розроблені_червоні_лінії" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()

    rlo = []
    for row in rows:
        rlo.append(row)

    sql = '''
    SELECT 
        *,
        ST_AsGeoJSON(geom) as geojson
    FROM public."зонінг" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()

    zng = []
    for row in rows:
        zng.append(row)

    # zng_debug = zng.copy()

    # print('zng_debug')
    # print(zng_debug)
    # print('***zng_debug***')

    sql = '''
    SELECT *
    FROM public."Історичний ареал" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    hist = [False, False, False, False]
    if select:
        hist[0] = True
        
    sql = '''
    SELECT *
    FROM public."зони охорони памяток архітектури" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    if select:
        hist[1] = True

    sql = '''
    SELECT *
    FROM public."зони регулювання забудови в межах історичних ареалів_1" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    if select:
        hist[2] = True
        
    sql = '''
    SELECT *
    FROM public."Зони обєктів природно_заповідного фонду" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    if select:
        hist[3] = True
        
    sql = '''
    SELECT *
    FROM public."Прибережні_захисні смуги" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''

    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()

    pzsvs = []
    pzsvs_type = [False, False]
    for row in rows:
        pzsvs.append('Прибережні захисні смуги, ріш. №|' + str(row.get('n_reshen', '')) + ' від ' + row.get('date_reshe', datetime.date.today()).strftime('%d.%m.%Y'))
        if not pzsvs_type[0]:
            pzsvs_type[0] = True
        
    sql = '''
    SELECT *
    FROM public."Водоохоронні зони" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''

    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()
    for row in rows:
        pzsvs.append('Водоохоронні зони, ріш. №|' + str(row.get('nom_reshen', '')) + ' від ' + row.get('data_reshe', datetime.date.today()).strftime('%d.%m.%Y'))
        if not pzsvs_type[1]:
            pzsvs_type[1] = True
        
    sql = '''
    SELECT *
    FROM public."Межі санітарно_захисних зон промислових" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''

    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    prot1 = False
    if select:
        prot1 = True

    sql = '''
    SELECT *
    FROM public."с_з_розрахункові" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''

    prot2 = []
    cur.execute(sql, (parcel_geom,))
    rows = cur.fetchall()
    for row in rows:
        prot2.append(str(row.get('kadnom', '')) + '|' + str(row.get('datasgo', '')) + ' від ' + row.get('dataprod', datetime.date.today()).strftime('%d.%m.%Y'))

    sql = '''
    SELECT *
    FROM public."Межі лісового господарства" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    brd = [False, False, False]
    if select:
        brd[0] = True

    sql = '''
    SELECT *
    FROM public."Зони що не підлягають забудові" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    if select:
        brd[1] = True

    sql = '''
    SELECT *
    FROM public."зелене_господарство" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()

    if select:
        brd[2] = True

    other_docs = [False, False, False, False, False, False]

    sql = '''
    SELECT *
    FROM public."муо" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[0] = True

    sql = '''
    SELECT *
    FROM public."бп" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[1] = True

    sql = '''
    SELECT *
    FROM public."паспорт_прив_тимч_споруд" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[2] = True

    sql = '''
    SELECT *
    FROM public."містобудівна_рада" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[3] = True

    sql = '''
    SELECT *
    FROM public."висновки" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[4] = True

    sql = '''
    SELECT *
    FROM public."dozvol_zayava_region" n
    WHERE ST_Intersects(n.geom, ST_SetSRID(ST_GeomFromGeoJSON(%s)::geometry,0))
        '''
    
    cur.execute(sql, (parcel_geom,))
    select = cur.fetchone()
    if select:
        other_docs[5] = True


    zng_lst = []
    zng_grp = []
    zng_docs = [
        'В-2', 'В-3', 'В-4', 'В-5', 'В-6', 'Г-1', 'Г-2', 'Г-3-1', 'Г-3-2', 'Г-3-3',
        'Г-4-1', 'Г-4-2', 'Г-4-4', 'Г-5-1', 'Г-5-2', 'Г-6', 'Г-ТР -1-2', 'Ж-1', 'Ж-7',
        'ІК', 'ІН-1', 'ІН-2', 'ІН-3', 'КВТ', 'КЛ-2', 'КС-2', 'КС-3', 'КС-3-1', 'КС-4',
        'КС-4-1', 'КС-5', 'КС-5-1', 'КС-6', 'П-В-5', 'П-В-6', 'П-Г-2', 'П-Г-3-1', 'П-Г-6',
        'П-Ж-1', 'П-Ж-7', 'П-ІН-1', 'П-КС-3-1', 'П-КС-4', 'П-КС-5', 'П-КС-6', 'П-Р-2',
        'П-Р-3', 'П-Р-3-2', 'П-ТР-2-1', 'Р-1', 'Р-2', 'Р-3', 'Р-3-2', 'Р-3-4', 'Р-4',
        'С-2', 'С-3', 'С-4'
    ]

    for zng_r in zng:
        if len(zng_r.get('ZONONG1', '').strip()) > 0:
            zng_str = zng_r.get('ZONING', '') + '|' + zng_r.get('ZONONG1', '')
            zng_lst.append(zng_str)
    
    zng_lst = list(set(zng_lst))
    zng_lst.sort()
    for zng_str in zng_lst:
        zng_grp.append(zng_str.split('|'))
    zng_text = ''
    for zng_str in zng_grp:
        zng_text += zng_str[1] + '; '
    for idx, zng_str in enumerate(zng_grp):
        if zng_str[0] in zng_docs:
            zng_grp[idx].append(zng_str[0])
        else:
            zng_grp[idx].append('nolnk')

        zng_grp[idx].append(zng_str[0] + ' ' + zng_str[1])

    for zng_r in zng:
        for idx, zng_str in enumerate(zng_grp):
            if zng_str[0] == zng_r.get('ZONING', ''):
                zng_grp[idx].append(zng_r.get('geojson', 0))
        
    rl_grp = []
    rl_geom = []
    rl_type = 10
    rl_text = ''

    for rlr in rl:
        rl_geom.append({"str": '3|-|Червоні лінії Діпромісто', "geom": rlr.get('Shape_Length', 0)})
        if rl_type > 3:
            rl_type = 3

    for rlor in rlo:
        if len(rlor.get('NOM_RESH', '').strip()) > 0:
            rl_geom.append({"str": '1|Рішення міської ради №|' + rlor.get('NOM_RESH', '') + ' від ' + rlor.get('DATE_RESH', datetime.datetime.now()).strftime('%d.%m.%Y'), "geom": rlor.get('Shape_Length', 0)})
            if rl_type > 1:
                rl_type = 1
        elif len(rlor.get('PRIMECH', '').strip()) > 0:
            rl_geom.append({"str": '2|Протокол містобудівної ради №|' + rlor.get('PRIMECH', '').replace('от', 'від'), "geom": rlor.get('Shape_Length', 0)})
            if rl_type > 2:
                rl_type = 2

    unique_rl_geom = {}
    for item in rl_geom:
        if item['str'] not in unique_rl_geom:
            unique_rl_geom[item['str']] = item

    rl_geom = list(unique_rl_geom.values())
    rl_geom.sort(key=lambda x: x['str'])

    for item in rl_geom:
        split_str = item['str'].split('|')
        split_str.append(str(item['geom']))
        rl_grp.append(split_str)

    if rl_type == 1:
        rl_text = 'ЧЕРВОНІ ЛІНІЇ ЗАТВЕРДЖЕНІ РІШЕННЯМ МІСЬКОЇ РАДИ: <br>'
    elif rl_type == 2:
        rl_text = 'ЧЕРВОНІ ЛІНІЇ РОЗГЛЯНУТІ НА ЗАСІДАННІ АРХІТЕКТУРНО-МІСТОБУДІВНОЇ РАДИ: <br>'
    elif rl_type == 3:
        rl_text = 'ЧЕРВОНІ ЛІНІЇ ЗА МАТЕРІАЛАМИ ДП НАУКОВО-ДОСЛІДНОГО ІНСТИТУТА ПРОЕКТУВАННЯ МІСТ ІМ. Ю.М. БІЛОКОНЯ'
        
    hist_text1 = ' - '
    if hist[0]:
        hist_text1 = 'Ділянка знаходиться в межах історичного ареалу'
        
    hist_text2 = ' - '
    hist_text21 = ''
    if hist[1] and hist[2]:
        hist_text2 = 'Ділянка знаходиться в зоні регулювання забудови об\'єкта культурної спадщини та в охоронній зоні об\'єкта культурної спадщини'
        hist_text21 = 'Зони охорони пам\'яток архітектури та регулювання забудови пам\'яток'
    elif hist[1]:
        hist_text2 = 'Ділянка знаходиться в охоронній зоні об\'єкта культурної спадщини'
        hist_text21 = 'Зони охорони пам\'яток архітектури'
    elif hist[2]:
        hist_text2 = 'Ділянка знаходиться в зоні регулювання забудови об\'єкта культурної спадщини'
        hist_text21 = 'Зони регулювання забудови пам\'яток'
        
    hist_text3 = ' - '
    if hist[3]:
        hist_text3 = 'Ділянка знаходиться в зоні об\'єктів природно-заповідного фонду'
        
    pzsvs_grp = []
    pzsvs = list(set(pzsvs))
    pzsvs.sort()
    for pzsvs_str in pzsvs:
        pzsvs_grp.append(pzsvs_str.split('|'))
    
    pzsvs_text = ' - '
    if pzsvs_type[0] and pzsvs_type[1]:
        pzsvs_text = 'Ділянка знаходиться в межах водоохоронної зони та в межах природно-захисної смуги затвердженою рішення міської ради: <br>'
    elif pzsvs_type[0]:
        pzsvs_text = 'Ділянка знаходиться в межах природно-захисної смуги затвердженою рішення міської ради: <br>'
    elif pzsvs_type[1]:
        pzsvs_text = 'Ділянка знаходиться в межах водоохоронної зони затвердженою рішення міської ради: <br>'

    prot_grp = []
    for protr in prot2:
        prot_grp.append(protr.split('|'))
        
    prot_text = ' - '
    if prot1 and len(prot2) > 0:
        prot_text = 'Відповідно до плану зонування території ділянка знаходиться в межах санітарно-захисної смуги та в межах розрахункової відстані: <br>'
    elif prot1:
        prot_text = 'Відповідно до плану зонування території ділянка знаходиться в межах санітарно-захисної смуги'
    elif len(prot2) > 0:
        prot_text = 'Відповідно до плану зонування території ділянка знаходиться в межах розрахункової відстані: <br>'
        
    brd_text1 = ' - '
    if brd[0]:
        brd_text1 = 'Ділянка знаходиться в межах лісового господарства'
    
    brd_text2 = ' - '
    if brd[1]:
        brd_text2 = 'Ділянка знаходиться в межах території, яка не підлягає забудові'
    
    brd_text3 = ' - '
    if brd[2]:
        brd_text3 = 'Ділянка знаходиться в межах об\'єкта зеленого господарства'
        
    otdocs_text1 = ' - '
    if other_docs[0]:
        otdocs_text1 = 'Ділянка знаходиться в межах території на яку были надані містобудівні умови та обмеження'
    
    otdocs_text2 = ' - '
    if other_docs[1]:
        otdocs_text2 = 'Ділянка знаходиться в межах території на якій був надан будівельний паспорт'
    
    otdocs_text3 = ' - '
    if other_docs[2]:
        otdocs_text3 = 'Ділянка знаходиться в межах території  на яку було видано паспорт прив`язки'
    
    otdocs_text4 = ' - '
    if other_docs[3]:
        otdocs_text4 = 'Ділянка знаходиться в межах території на якій розглядалась возможность розташування об\'єкта згідно протоколу містобудівної ради'
    
    otdocs_text5 = ' - '
    if other_docs[4]:
        otdocs_text5 = 'На території ділянки розглядались матеріали проекту землеустрою щодо відведення зазначеної земельної ділянки'
    
    otdocs_text6 = ' - '
    if other_docs[5]:
        otdocs_text6 = 'На території ділянки были надані дозволи'

    # parceldata['zng_debug'] = zng_debug # отладка!
    
    parceldata['zoning'] = zng_grp
    parceldata['zng_text'] = zng_text
    parceldata['zng_textl'] = 'Зонінг'
    parceldata['red_lines'] = rl_grp
    parceldata['rl_text'] = rl_text
    parceldata['rl_type'] = rl_type
    parceldata['hist'] = hist
    parceldata['hist_text1'] = hist_text1
    parceldata['hist_text2'] = hist_text2
    parceldata['hist_text21'] = hist_text21
    parceldata['hist_text3'] = hist_text3
    parceldata['pzsvs'] = pzsvs_grp
    parceldata['pzsvs_text'] = pzsvs_text
    parceldata['prot'] = prot_grp
    parceldata['prot_text'] = prot_text
    parceldata['brd'] = brd
    parceldata['brd_text1'] = brd_text1
    parceldata['brd_text2'] = brd_text2
    parceldata['brd_text3'] = brd_text3
    parceldata['other_docs'] = other_docs
    parceldata['otdocs_text1'] = otdocs_text1
    parceldata['otdocs_text2'] = otdocs_text2
    parceldata['otdocs_text3'] = otdocs_text3
    parceldata['otdocs_text4'] = otdocs_text4
    parceldata['otdocs_text5'] = otdocs_text5
    parceldata['otdocs_text6'] = otdocs_text6
    
    return render_template('parcel_geom_l.html', parceldata=parceldata)


@app.route('/printform', methods=['GET','POST'])
def __printform():
    return render_template('printform.html', printdata=printdata)


@app.route('/find_geom/<find_addr>/<find_custmr>', methods=['GET'])
def __find_geom(find_addr, find_custmr):
    if (find_addr=='empt_param'):
        find_addr=''
    if (find_custmr=='empt_param'):
        find_custmr=''

    con = psycopg.connect(connstring, row_factory=dict_row)
    cur = con.cursor()

    sql = '''
        SELECT
            ST_AsGeoJSON(geom) as geojson,
            str,
            zak,
            kodokpo
        FROM
            public."xml" x
        WHERE
            lower(x.str) like %s AND
            lower(x.zak) like %s
        LIMIT 20
        '''
    
    cur.execute(sql, (f'%{find_addr.lower()}%', f'%{find_custmr.lower()}%'))
    rows = cur.fetchall()
    return jsonify(rows)


@app.route('/find_trs/<find_addr>/<find_custmr>', methods=['GET'])
def __find_trs(find_addr, find_custmr):
    if (find_addr=='empt_param'):
        find_addr=''
    if (find_custmr=='empt_param'):
        find_custmr=''
    
    con = psycopg.connect(connstring, row_factory=dict_row)
    cur = con.cursor()

    sql = '''
        SELECT
            ST_AsGeoJSON(geom) as geojson,
            *
        FROM
            public."Проекти_інженерних_мереж" tr
        WHERE
            lower(tr."шифр") like %s
        LIMIT 20
        '''
    
    cur.execute(sql, (f'%{find_addr.lower()}%',))
    rows = cur.fetchall()
    return jsonify(rows)


@app.route('/render_poly', methods=['POST'])
def __render_poly():
    req_data = request.get_json()
    file_path = Config.POLY_EXCHANGE_PATH
    if req_data.get('is_full') and isinstance(req_data.get('geoms'), list):
        proxy_data = {
            "res": "ok",
            "items": []
        }
        for item in req_data['geoms']:
            poly_type = item.get('poly_type', '')
            geom = item.get('geom', '')
            if poly_type and geom:
                proxy_data["items"].append({
                    "poly_type": poly_type,
                    "data": geom
                })
        if not proxy_data["items"]:
            proxy_data = {
                "res": "empty"
            }
    else:
        proxy_data = {
            "res": "empty"
        }
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(proxy_data, file, ensure_ascii=False, indent=4)
    return f"Файл будет записан по пути: {file_path}"


@app.route('/render_poly_old', methods=['POST'])
def __render_poly_old():
    req_data = request.get_json()
    if req_data.get('is_full'):
        proxy_data = {
            "res": "ok",
            "poly_type": req_data['poly_type'],
            "data": req_data['geom']
        }
    else:
        proxy_data = {
            "res": "empty"
        }
    file_path = Config.POLY_EXCHANGE_PATH
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(proxy_data, file, ensure_ascii=False, indent=4)
    return f"Файл будет записан по пути: {file_path}"


@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

def _routepatch(patch, data=None):
    try:
        template_name = patch + '.html'
        # Проверяем существование шаблона
        if not os.path.exists(os.path.join(app.template_folder, template_name)):
            return page_not_found(404)
        return render_template(template_name, data=data)
    except TemplateNotFound:
        return page_not_found(404)
    except Exception as e:
        return render_template('error.html', error=str(e)), 500

