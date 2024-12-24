///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
var showPopUp = function (url, parameters) {
    popUpObj = window.open(url,
        "ModalPopUp",
        "popup=yes," +
        "toolbar=no," +
        "scrollbars=no," +
        "location=no," +
        "statusbar=no," +
        "menubar=no," +
        "resizable=0," +
        "width=700," +
        "height=500," +
        "left = 490," +
        "top=100");
};

define(['dojo/_base/declare', 'jimu/BaseWidget'
    , "esri/request", "esri/tasks/Geoprocessor", "esri/tasks/DataFile",
    "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/Color",

    "esri/InfoTemplate",

    "esri/geometry/Polygon",
    "esri/geometry/Polyline",
    "esri/graphic",
    "esri/graphicsUtils",

    "esri/SpatialReference",
    "esri/geometry/projection",

    "esri/toolbars/draw",
    'jimu/dijit/DrawBox',
    "esri/symbols/SimpleFillSymbol",
    'esri/layers/GraphicsLayer',
    'esri/layers/FeatureLayer',
    // 'dojo/number',
    'dojo/i18n',
    'dojo/i18n!esri/nls/jsapi',
    'dojo/_base/html',
    'dojo/_base/lang',

    "dojo/on",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/domReady!"
],
    function (declare, BaseWidget
        , esriRequest, Geoprocessor, DataFile,
        SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer, Color,
        InfoTemplate,

        Polygon,
        Polyline,
        Graphic,
        graphicsUtils,
        SpatialReference, projection,

        Draw, DrawBox,
        SimpleFillSymbol,
        GraphicsLayer, FeatureLayer,
        dojoI18n, esriNlsBundle,
        html, lang,


        on, array, dom
    ) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            // Custom widget code goes here
            baseClass: 'jimu-widget-xotgline',
            _defaultGsUrl:
                '//tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer',
            // TODO: own GeometryServer from config
            _undoManager: null,
            _graphicsLayer: null,
            _objectIdCounter: 1,
            _objectIdName: 'OBJECTID',
            _objectIdType: 'esriFieldTypeOID',
            _polygonLayer: null,
            _labelLayer: null,
            drawtoolbar: null,
            //_drawtoolbar: new Draw(this.map),
            _dt: null,
            _symPoly: null,
            urlParcelService: 'http://192.168.0.115:5020/parcelgeom/',
            _gs: 'http://192.168.0.115:6080/arcgis/rest/services/Geometry/GeometryServer',
            //null, // own geometry service
            dtbox: '',


            //this property is set by the framework when widget is loaded.
            name: 'XOtgLine',
            //methods to communication with app container:


            postMixInProperties: function () {
                this.inherited(arguments);
                this.jimuNls = window.jimuNls;
                //this.config.isOperationalLayer = !!this.config.isOperationalLayer;
                //point locale decimal
                //this.numberDecimal = dojoI18n.getLocalization("dojo.cldr", "number", window.dojoConfig.locale).decimal;
                console.log(esriConfig.defaults.geometryService)
                if (esriConfig.defaults.geometryService) {
                    this._gs = esriConfig.defaults.geometryService;
                } else {
                    this._gs = new GeometryService(this._defaultGsUrl);
                }

            },

            postCreate: function () {
                this.inherited(arguments);
                console.log('postCreate');
                //this._initGraphicsLayers();
            },


            _initGraphicsLayers: function () {
                this._graphicsLayer = new GraphicsLayer();

                // if (!this.config.isOperationalLayer) {
                //this._polygonLayer = new GraphicsLayer();
                //this.map.addLayer(this._polygonLayer);
                //this.map.addLayer(this._labelLayer);
                // }
            },

            _removeEmptyLayers: function () {
                //if (this._polygonLayer && this._polygonLayer.graphics.length === 0) {
                //    this.map.removeLayer(this._polygonLayer);
                //    this._polygonLayer = null;
                //}
            },
            startDraw: function () {
                this.map.graphics.clear();
            },



            _onBtnPolygonClick: function () {
                var draw_mode = 'polygon';

                this.map.graphics.clear();

                //this.drawtoolbar = new Draw(this.map)
                //this.drawtoolbar.on("draw-end", this._addToMap)

                window.__mg_drawtoolbar = this.drawtoolbar;
                this.map.setInfoWindowOnClick(false);
                this.drawtoolbar.activate(draw_mode);  //'polygon' Draw['POLYGON']
                window.__mg_draw_mode = draw_mode;
                this.map.hideZoomSlider();

                //console.log('polygon');
            },

            _onBtnPolyLineClick: function () {
                var draw_mode = 'polyline';

                this.map.graphics.clear();

                window.__mg_drawtoolbar = this.drawtoolbar;
                this.map.setInfoWindowOnClick(false);
                this.drawtoolbar.activate(draw_mode);
                window.__mg_draw_mode = draw_mode;
                this.map.hideZoomSlider();
            },


            _onBtnClearClick: function () {
                this.map.graphics.clear();
                dom.byId('message').innerHTML = "";

            },

            _onBtnSelectedClick: function () {
                // alert('_onBtnJsonClick');

                var __mg_map = this.map;
                // selected by user feature on map
                var feat = __mg_map.infoWindow.getSelectedFeature();

                console.log(feat._layer.name);

                var layer_name = feat._layer.name;
                if (layer_name.substring(0, 24) != 'Проекти інженерних мереж') {
                    alert('Не вибрано об\'єкт інженерних мереж!');
                    return;
                }

                // for polygones only
                // __mg_map.setExtent(feat.geometry.getExtent().expand(2.5));
                // __mg_map.centerAt(feat.geometry.getCentroid());

                console.log(feat);

                // for polylines
                var extent = feat.geometry.getExtent();
                var center = extent.getCenter();
                __mg_map.setExtent(extent.expand(2.5));
                __mg_map.centerAt(center);

                geojson0 = '{"type": "LineString", "coordinates":' + JSON.stringify(feat.geometry.paths) + '}'
                geojson1 = geojson0.replace("[[[", "[[");
                geojson2 = geojson1.replace("]]]", "]]");

                showPopUp('http://192.168.17.45:5024/parcelgeoml/' + geojson2);

            },

            _onTest1Click: function () {
                let __mg_map = this.map;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://gisserver.gapu.local/flask_proxy/broker.php');
                xhr.send();

                xhr.onload = function () {
                    try {
                        var res = JSON.parse(xhr.response);
                        if (res.res == 'empty') {
                            alert('Нет выбранного объекта!');
                        }
                        else {
                            let poly_type = res.poly_type.trim();
                            let coords_str = JSON.parse(res.data);
                            let obj_coords = JSON.parse(coords_str);
                            let coords = obj_coords.coordinates[0];
                            window.__test1 = obj_coords;
                            
                            __mg_map.graphics.clear();
                            let srMap = __mg_map.extent.spatialReference;
                            
                            if (poly_type === 'zoning') {
                                // Отрисовка полигона
                                let myPolygon = {
                                    'geometry': {
                                        'rings': coords, // Для полигона используем 'rings'
                                        'spatialReference': srMap
                                    },
                                    'symbol': {
                                        'color': [0, 0, 255, 64], // Полупрозрачный синий (RGBA: R=0, G=0, B=255, A=64)
                                        'outline': {
                                            'color': [0, 0, 255, 255], // Синий цвет границы (RGBA: R=0, G=0, B=255, A=255)
                                            'width': 3, // Толщина границы: 3 пикселя
                                            'type': 'esriSLS',
                                            'style': 'esriSLSSolid' // Сплошная линия
                                        },
                                        'type': 'esriSFS',
                                        'style': 'esriSFSSolid' // Сплошная заливка
                                    }
                                };
                            
                                let gra = new Graphic(myPolygon);
                                __mg_map.graphics.add(gra);
                            
                                try {
                                    let extent = graphicsUtils.graphicsExtent([gra]).expand(1.2);
                                    __mg_map.setExtent(extent);
                                } catch (err) {
                                    console.log(err);
                                }
                            
                            } else if (poly_type === 'redlines') {
                                // Отрисовка мультилинии
                                let myPolyline = {
                                    'geometry': {
                                        'paths': [coords],
                                        'spatialReference': srMap
                                    },
                                    'symbol': {
                                        'color': [158, 0, 22, 255], // Ярко-малиновый цвет линии
                                        'width': 5, // Толщина линии
                                        'type': 'esriSLS',
                                        'style': 'esriSLSSolid' // Сплошная линия
                                    }
                                };
                            
                                let gra = new Graphic(myPolyline);
                                __mg_map.graphics.add(gra);
                            
                                try {
                                    let extent = graphicsUtils.graphicsExtent([gra]).expand(1.2);
                                    __mg_map.setExtent(extent);
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                            
                        };

                    }
                    catch (err) {
                        console.log('JSON parse error');
                        console.log(err);
                        return;
                    }

                }
                return;

                let test1_gs_str = '[[[59798.2277,25907.100500001],[59799.0801,25905.8993],[59797.7681,25907.0189],[59797.9085,25894.6099],[59797.9863,25887.7151],[59798.0045,25887.2739],[59799.9853,25861.7455],[59799.8487,25861.547499999],[59801.8787,25832.5283],[59803.2451,25832.5053],[59808.7211,25832.412900001],[59808.8475,25832.217499999],[59836.8177,25831.8003],[59836.8177,25817.2059],[59848.4507,25814.8791],[59848.0277,25807.6877],[59844.2203,25795.8431],[59831.0759,25797.1741],[59829.1743,25765.4867],[59835.9059,25764.839299999],[59835.7763,25761.8619],[59835.0349,25756.5857],[59830.0787,25757.296499999],[59826.7097,25731.5791],[59820.9949,25687.9583],[59855.5125,25683.027100001],[59873.3453,25680.479499999],[59873.3463,25680.3923],[59873.3567,25679.4903],[59873.3933,25676.3335],[59873.1221,25674.543299999],[59873.1221,25661.0831],[59873.6327,25657.1117],[59863.2313,25657.1117],[59863.2313,25631.485099999],[59867.6719,25625.1939],[59868.9259,25623.417300001],[59874.8241,25624.0383],[59876.1351,25624.1763],[59877.9315,25591.4803],[59865.0375,25591.4803],[59861.8881,25615.0997],[59841.4181,25614.3123],[59839.8435,25674.9355],[59829.6083,25674.9355],[59797.3287,25670.9989],[59798.9031,25660.763699999],[59780.7951,25661.551100001],[59775.2839,25731.6219],[59781.5823,25733.1965],[59781.5823,25745.793500001],[59773.7093,25746.580700001],[59772.9219,25774.9241],[59761.1123,25773.3495],[59761.1123,25785.1591],[59771.3473,25827.673900001],[59780.0077,25827.673900001],[59780.0077,25844.2075],[59775.2839,25870.188899999],[59768.1981,25891.4463],[59774.4965,25920.5769],[59784.7315,25918.2149],[59786.7997,25916.511700001],[59797.4301,25907.757300001],[59798.2277,25907.100500001]]]';

                var template = document.getElementById('mg-lines-template-trs');
                var container = document.getElementById('mg-srch-results-trs');
                // var __mg_map = this.map;

                __mg_map.graphics.clear();
                var srMap = __mg_map.extent.spatialReference;
                // var coord_idx = this.getAttribute('mg-coord-idx');

                var myPolygon = {
                    'geometry': {
                        'paths': JSON.parse(test1_gs_str),
                        'spatialReference': srMap
                    },
                    'symbol': {
                        'color': [0, 0, 255, 64], // Полупрозрачный синий (RGBA: R=0, G=0, B=255, A=64)
                        'outline': {
                            'color': [0, 0, 255, 255], // Синий цвет границы (RGBA: R=0, G=0, B=255, A=255)
                            'width': 3, // Толщина границы: 3 пикселя
                            'type': 'esriSLS',
                            'style': 'esriSLSSolid' // Сплошная линия
                        },
                        'type': 'esriSFS',
                        'style': 'esriSFSSolid' // Сплошная заливка
                    }
                };

                var gra = new Graphic(myPolygon);

                __mg_map.graphics.add(gra);
                try {
                    var extent = graphicsUtils.graphicsExtent([gra]).expand(1.2);
                    __mg_map.setExtent(extent);
                }
                catch (err) {
                    console.log(err);
                }
            },

            _onBtnSearchClick: function () {
                var template = document.getElementById('mg-lines-template-trs');
                var container = document.getElementById('mg-srch-results-trs');
                var __mg_map = this.map;
                var __mg_search_res = [];

                var highlightResStr = function (elt) {
                    var html_collect = document.getElementsByClassName('mg-search-block-selected-trs');
                    var selected_blocks = [];
                    for (i1 = 0; i1 < html_collect.length; i1++) {
                        selected_blocks.push(html_collect[i1]);
                    }
                    for (i1 = 0; i1 < selected_blocks.length; i1++) {
                        selected_blocks[i1].classList.remove('mg-search-block-selected-trs');
                    }

                    var html_collect = document.getElementsByClassName('mg-separator-selected');
                    var selected_separators = [];
                    for (i1 = 0; i1 < html_collect.length; i1++) {
                        selected_separators.push(html_collect[i1]);
                    }
                    for (i1 = 0; i1 < selected_separators.length; i1++) {
                        selected_separators[i1].classList.remove('mg-separator-selected');
                    }

                    var block = elt.closest('.mg-search-block-trs');
                    // console.log(block);
                    block.classList.add('mg-search-block-selected-trs');

                    var row = elt.closest('.mg-search-row');
                    var separator_1 = row.querySelector('.mg-separator');

                    separator_1.classList.add('mg-separator-selected');

                    // не последний элемент
                    if (row.nextSibling) {
                        var separator_2 = row.nextSibling.querySelector('.mg-separator');
                        separator_2.classList.add('mg-separator-selected');
                    }

                    // + набить стили
                    // + повесить на поиск и открытие 
                };

                var onCoordsClick = function () {
                    highlightResStr(this);

                    __mg_map.graphics.clear();
                    var srMap = __mg_map.extent.spatialReference;
                    var coord_idx = this.getAttribute('mg-coord-idx');

                    console.log(__mg_search_res[coord_idx].coords);
                    console.log(__mg_search_res);

                    var myPolygon = {
                        'geometry': {
                            'paths': __mg_search_res[coord_idx].coords,
                            'spatialReference': srMap
                        },
                        'symbol': {
                            'color': [0, 0, 0, 0], 'outline': {
                                'color': [255, 0, 0, 255],
                                'width': 2, 'type': 'esriSLS', 'style': 'esriSLSSolid'
                            },
                            'type': 'esriSFS', 'style': 'esriSFSSolid'
                        }
                    };

                    var gra = new Graphic(myPolygon);

                    __mg_map.graphics.add(gra);
                    try {
                        var extent = graphicsUtils.graphicsExtent([gra]).expand(1.2);
                        __mg_map.setExtent(extent);
                    }
                    catch (err) {
                        console.log(err);
                    }

                };

                var onRunProtClick = function () {
                    highlightResStr(this);

                    var coord_idx = this.getAttribute('mg-coord-idx');
                    geojson0 = '{"type": "LineString", "coordinates":' + JSON.stringify(__mg_search_res[coord_idx].coords) + '}';
                    geojson1 = geojson0.replace("[[[", "[[");
                    geojson2 = geojson1.replace("]]]", "]]");

                    showPopUp('http://192.168.17.45:5024/parcelgeoml/' + geojson2);
                };

                var onResNameClick = function () {
                    highlightResStr(this);
                };

                var req_track = document.getElementById('mg-req-track').value;
                if (!req_track.length) {
                    alert('Порожній запит!');
                    return;
                }

                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://gisserver.gapu.local/flask_proxy/index.php?req_addr_trs=' + req_track);
                xhr.send();

                xhr.onload = function () {
                    try {
                        var res = JSON.parse(xhr.response);
                        console.log('JSON :');
                        console.log(res);
                    }
                    catch (err) {
                        container.innerHTML = '';
                        console.log('JSON parse error');
                        console.log(err);
                        return;
                    }

                    for (i1 = 0; i1 < res.length; i1++) {
                        try {
                            coords = JSON.parse(res[i1][0]);
                        }
                        catch (err) {
                            continue;
                        }
                        sr_res = {
                            'txt': res[i1][10] + ', ' + res[i1][5] + ', ' + res[i1][6],
                            // 'coords' : coords.coordinates[0]
                            'coords': coords.coordinates
                        };
                        __mg_search_res.push(sr_res);
                    }

                    container.innerHTML = '';
                    var tmpl_block = template.querySelector('span');
                    for (i1 = 0; i1 < __mg_search_res.length; i1++) {
                        clone = tmpl_block.cloneNode(true);
                        res_name = clone.querySelector('.mg-search-txt');
                        res_name.innerText = __mg_search_res[i1].txt;
                        res_name.addEventListener('click', onResNameClick);
                        res_coords = clone.querySelector('.mg-search-coords');
                        res_coords.setAttribute('mg-coord-idx', i1.toString());
                        res_coords.addEventListener('click', onCoordsClick);
                        res_run_prot = clone.querySelector('.mg-run-prot');
                        res_run_prot.setAttribute('mg-coord-idx', i1.toString());
                        res_run_prot.addEventListener('click', onRunProtClick);
                        container.appendChild(clone);
                    };
                    // console.log(__mg_search_res);
                };

                xhr.onerror = function () { };

            },

            /*
            _onDrawEnd: function (graphic, geotype, commontype) {
            //jshint unused: false
            this.drawBox.clear();
            if (!graphic.symbol) { //not draw and save graphic that has null symbol.
                return;
            }

            var geometry = graphic.geometry;
            console.log(geometry);

             },
            */

            addToMap: function (evt) {
                var symbol;
                symbol = new SimpleFillSymbol();

                this.map.showZoomSlider();

                if (window.__mg_draw_mode == 'polyline') {

                    this._symPoly = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([75, 190, 242]), 3);

                    //var graphic = new Graphic(evt.geometry, symbol);
                    var graphic = new Graphic(evt.geometry, this._symPoly);
                    this.map.graphics.add(graphic);

                    geojson0 = '{"type": "LineString", "coordinates":' + JSON.stringify(graphic.geometry.paths) + '}'
                    geojson1 = geojson0.replace("[[[", "[[");
                    geojson2 = geojson1.replace("]]]", "]]");

                    dom.byId('message').innerHTML = geojson2;
                    showPopUp('http://192.168.17.45:5024/parcelgeoml/' + geojson2);

                    window.__mg_drawtoolbar.deactivate();
                    this.map.setInfoWindowOnClick(true);
                }

                else {

                    this._symPoly = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                            new Color([255, 0, 0]), 3), new Color([255, 255, 0, 0.1]));

                    //var graphic = new Graphic(evt.geometry, symbol);
                    var graphic = new Graphic(evt.geometry, this._symPoly);
                    this.map.graphics.add(graphic);

                    geojson0 = '{"type": "POLYGON", "coordinates":' + JSON.stringify(graphic.geometry.rings) + '}'
                    //geojson = '{"type": "POLYGON", "coordinates":' + JSON.stringify(graphic.geometry.rings) +
                    //    ',"crs":{"type":"name","properties":{"name":"ESRI:' + graphic.geometry.spatialReference.wkid + '"}'
                    //geojson3857 = '{"type": "POLYGON", "coordinates":' + JSON.stringify(graphic.geometry.rings) +
                    //    ',"crs":{"type":"name","properties":{"name":"EPSG:3857"}'

                    // console.log(geojson0);
                    // select st_geomfromgeojson(geojson) 
                    dom.byId('message').innerHTML = geojson0;
                    showPopUp('http://192.168.17.45:5024/parcelgeom/' + geojson0);
                    //showPopUp(this._urlParcelService + geojson0);
                    //showPopUp('http://192.168.0.115:5020/parcel/2323981500010010105');

                    window.__mg_drawtoolbar.deactivate();
                    this.map.setInfoWindowOnClick(true);
                }
            },
            /*
            _showPopUp: function (url, parameters) {
                popUpObj = window.open(url,
                    "ModalPopUp",
                    "popup=yes," +
                    "toolbar=no," +
                    "scrollbars=no," +
                    "location=no," +
                    "statusbar=no," +
                    "menubar=no," +
                    "resizable=0," +
                    "width=800," +
                    "height=600," +
                    "left = 490," +
                    "top=100");

                popUpObj.focus();

            },
            */

            startup: function () {

                this.inherited(arguments);
                //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
                var map = this.map;
                var srMap = map.extent.spatialReference;
                //console.log(map.extent.spatialReference);
                console.log('startup');


                // coordinateFormatter spatial reference 
                const geoSpatialReference = new SpatialReference({
                    wkid: 4326
                });

                var redSpatialReference = new SpatialReference({
                    wkid: 3395 //spatial reference of 500K rasters
                });

                var message = document.getElementById("message");
                //var messagestatus = document.getElementById("messagestatus");
                //var messageaddstatus = document.getElementById("messageaddstatus");

                // This style does not allow us to color our polylines
                /*
                var styleTags = document.getElementsByTagName("style");
                // Loop through all <style> tags
                for (var i = 0; i < styleTags.length; i++) {
                    // Get the text of the content of the <style> tag
                    var styleContent = styleTags[i].innerHTML;
    
                    // Check if the text contains the search string
                    if (styleContent.indexOf("svg path {stroke: #000 !important;}") !== -1) {
                        // If it contains, remove the <style> tag
                        styleTags[i].parentNode.removeChild(styleTags[i]);
                        break; // If you need to remove only the first occurrence
                    }
                }
                */

                //var redsym = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.5]), 3);
                //var redsymdd = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0, 0.5]), 3);
                var sfsPoly = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255, 0, 0]), 3), new Color([255, 255, 0, 0.1]));

                this.drawtoolbar = new Draw(this.map)
                this.drawtoolbar.on("draw-end", this.addToMap)
                //this.drawtoolbar.on("draw-start", this.startDraw)

            },


            // onOpen: function(){
            //   console.log('onOpen');
            // },

            // onClose: function(){
            //   console.log('onClose');
            // },

            // onMinimize: function(){
            //   console.log('onMinimize');
            // },

            // onMaximize: function(){
            //   console.log('onMaximize');
            // },

            // onSignIn: function(credential){
            //   /* jshint unused:false*/
            //   console.log('onSignIn');
            // },

            // onSignOut: function(){
            //   console.log('onSignOut');
            // }

            // onPositionChange: function(){
            //   console.log('onPositionChange');
            // },

            // resize: function(){
            //   console.log('resize');
            // }


            //methods to communication between widgets:

        });
    });///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
var showPopUp = function (url, parameters) {
    popUpObj = window.open(url,
        "ModalPopUp",
        "popup=yes," +
        "toolbar=no," +
        "scrollbars=no," +
        "location=no," +
        "statusbar=no," +
        "menubar=no," +
        "resizable=0," +
        "width=700," +
        "height=500," +
        "left = 490," +
        "top=100");
};

define(['dojo/_base/declare', 'jimu/BaseWidget'
    , "esri/request", "esri/tasks/Geoprocessor", "esri/tasks/DataFile",
    "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/Color",

    "esri/InfoTemplate",

    "esri/geometry/Polygon",
    "esri/geometry/Polyline",
    "esri/graphic",
    "esri/graphicsUtils",

    "esri/SpatialReference",
    "esri/geometry/projection",

    "esri/toolbars/draw",
    'jimu/dijit/DrawBox',
    "esri/symbols/SimpleFillSymbol",
    'esri/layers/GraphicsLayer',
    'esri/layers/FeatureLayer',
    // 'dojo/number',
    'dojo/i18n',
    'dojo/i18n!esri/nls/jsapi',
    'dojo/_base/html',
    'dojo/_base/lang',

    "dojo/on",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/domReady!"
],
    function (declare, BaseWidget
        , esriRequest, Geoprocessor, DataFile,
        SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer, Color,
        InfoTemplate,

        Polygon,
        Polyline,
        Graphic,
        graphicsUtils,
        SpatialReference, projection,

        Draw, DrawBox,
        SimpleFillSymbol,
        GraphicsLayer, FeatureLayer,
        dojoI18n, esriNlsBundle,
        html, lang,


        on, array, dom
    ) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            // Custom widget code goes here
            baseClass: 'jimu-widget-xotgline',
            _defaultGsUrl:
                '//tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer',
            // TODO: own GeometryServer from config
            _undoManager: null,
            _graphicsLayer: null,
            _objectIdCounter: 1,
            _objectIdName: 'OBJECTID',
            _objectIdType: 'esriFieldTypeOID',
            _polygonLayer: null,
            _labelLayer: null,
            drawtoolbar: null,
            //_drawtoolbar: new Draw(this.map),
            _dt: null,
            _symPoly: null,
            urlParcelService: 'http://192.168.0.115:5020/parcelgeom/',
            _gs: 'http://192.168.0.115:6080/arcgis/rest/services/Geometry/GeometryServer',
            //null, // own geometry service
            dtbox: '',


            //this property is set by the framework when widget is loaded.
            name: 'XOtgLine',
            //methods to communication with app container:


            postMixInProperties: function () {
                this.inherited(arguments);
                this.jimuNls = window.jimuNls;
                //this.config.isOperationalLayer = !!this.config.isOperationalLayer;
                //point locale decimal
                //this.numberDecimal = dojoI18n.getLocalization("dojo.cldr", "number", window.dojoConfig.locale).decimal;
                console.log(esriConfig.defaults.geometryService)
                if (esriConfig.defaults.geometryService) {
                    this._gs = esriConfig.defaults.geometryService;
                } else {
                    this._gs = new GeometryService(this._defaultGsUrl);
                }

            },

            postCreate: function () {
                this.inherited(arguments);
                console.log('postCreate');
                //this._initGraphicsLayers();
            },


            _initGraphicsLayers: function () {
                this._graphicsLayer = new GraphicsLayer();

                // if (!this.config.isOperationalLayer) {
                //this._polygonLayer = new GraphicsLayer();
                //this.map.addLayer(this._polygonLayer);
                //this.map.addLayer(this._labelLayer);
                // }
            },

            _removeEmptyLayers: function () {
                //if (this._polygonLayer && this._polygonLayer.graphics.length === 0) {
                //    this.map.removeLayer(this._polygonLayer);
                //    this._polygonLayer = null;
                //}
            },
            startDraw: function () {
                this.map.graphics.clear();
            },



            _onBtnPolygonClick: function () {
                var draw_mode = 'polygon';

                this.map.graphics.clear();

                //this.drawtoolbar = new Draw(this.map)
                //this.drawtoolbar.on("draw-end", this._addToMap)

                window.__mg_drawtoolbar = this.drawtoolbar;
                this.map.setInfoWindowOnClick(false);
                this.drawtoolbar.activate(draw_mode);  //'polygon' Draw['POLYGON']
                window.__mg_draw_mode = draw_mode;
                this.map.hideZoomSlider();

                //console.log('polygon');
            },

            _onBtnPolyLineClick: function () {
                var draw_mode = 'polyline';

                this.map.graphics.clear();

                window.__mg_drawtoolbar = this.drawtoolbar;
                this.map.setInfoWindowOnClick(false);
                this.drawtoolbar.activate(draw_mode);
                window.__mg_draw_mode = draw_mode;
                this.map.hideZoomSlider();
            },


            _onBtnClearClick: function () {
                this.map.graphics.clear();
                dom.byId('message').innerHTML = "";

            },

            _onBtnSelectedClick: function () {
                // alert('_onBtnJsonClick');

                var __mg_map = this.map;
                // selected by user feature on map
                var feat = __mg_map.infoWindow.getSelectedFeature();

                console.log(feat._layer.name);

                var layer_name = feat._layer.name;
                if (layer_name.substring(0, 24) != 'Проекти інженерних мереж') {
                    alert('Не вибрано об\'єкт інженерних мереж!');
                    return;
                }

                // for polygones only
                // __mg_map.setExtent(feat.geometry.getExtent().expand(2.5));
                // __mg_map.centerAt(feat.geometry.getCentroid());

                console.log(feat);

                // for polylines
                var extent = feat.geometry.getExtent();
                var center = extent.getCenter();
                __mg_map.setExtent(extent.expand(2.5));
                __mg_map.centerAt(center);

                geojson0 = '{"type": "LineString", "coordinates":' + JSON.stringify(feat.geometry.paths) + '}'
                geojson1 = geojson0.replace("[[[", "[[");
                geojson2 = geojson1.replace("]]]", "]]");

                showPopUp('http://192.168.17.45:5024/parcelgeoml/' + geojson2);

            },

            _onTest1Click: function () {
                let __mg_map = this.map;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://gisserver.gapu.local/flask_proxy/broker.php');
                xhr.send();

                xhr.onload = function () {
                    try {
                        var res = JSON.parse(xhr.response);
                        if (res.res == 'empty') {
                            alert('Нет выбранного объекта!');
                        }
                        else {
                            let poly_type = JSON.parse(res.poly_type);
                            let coords_str = JSON.parse(res.data);
                            let obj_coords = JSON.parse(coords_str);
                            let coords = obj_coords.coordinates[0]
                            window.__test1 = obj_coords;

                            __mg_map.graphics.clear();
                            let srMap = __mg_map.extent.spatialReference; 

                            let myPolygon = {
                                'geometry': {
                                    'paths': coords,
                                    'spatialReference': srMap
                                },
                                'symbol': {
                                    'color': [0, 0, 255, 64], // Полупрозрачный синий (RGBA: R=0, G=0, B=255, A=64)
                                    'outline': {
                                        'color': [0, 0, 255, 255], // Синий цвет границы (RGBA: R=0, G=0, B=255, A=255)
                                        'width': 3, // Толщина границы: 3 пикселя
                                        'type': 'esriSLS',
                                        'style': 'esriSLSSolid' // Сплошная линия
                                    },
                                    'type': 'esriSFS',
                                    'style': 'esriSFSSolid' // Сплошная заливка
                                }
                            };

                            let gra = new Graphic(myPolygon);

                            __mg_map.graphics.add(gra);
                            try {
                                let extent = graphicsUtils.graphicsExtent([gra]).expand(1.2);
                                __mg_map.setExtent(extent);
                            }
                            catch (err) {
                                console.log(err);
                            }
                        }

                        // alert(res.res);
                    }
                    catch (err) {
                        container.innerHTML = '';
                        console.log('JSON parse error');
                        console.log(err);
                        return;
                    }

                }
                return;

                let test1_gs_str = '[[[59798.2277,25907.100500001],[59799.0801,25905.8993],[59797.7681,25907.0189],[59797.9085,25894.6099],[59797.9863,25887.7151],[59798.0045,25887.2739],[59799.9853,25861.7455],[59799.8487,25861.547499999],[59801.8787,25832.5283],[59803.2451,25832.5053],[59808.7211,25832.412900001],[59808.8475,25832.217499999],[59836.8177,25831.8003],[59836.8177,25817.2059],[59848.4507,25814.8791],[59848.0277,25807.6877],[59844.2203,25795.8431],[59831.0759,25797.1741],[59829.1743,25765.4867],[59835.9059,25764.839299999],[59835.7763,25761.8619],[59835.0349,25756.5857],[59830.0787,25757.296499999],[59826.7097,25731.5791],[59820.9949,25687.9583],[59855.5125,25683.027100001],[59873.3453,25680.479499999],[59873.3463,25680.3923],[59873.3567,25679.4903],[59873.3933,25676.3335],[59873.1221,25674.543299999],[59873.1221,25661.0831],[59873.6327,25657.1117],[59863.2313,25657.1117],[59863.2313,25631.485099999],[59867.6719,25625.1939],[59868.9259,25623.417300001],[59874.8241,25624.0383],[59876.1351,25624.1763],[59877.9315,25591.4803],[59865.0375,25591.4803],[59861.8881,25615.0997],[59841.4181,25614.3123],[59839.8435,25674.9355],[59829.6083,25674.9355],[59797.3287,25670.9989],[59798.9031,25660.763699999],[59780.7951,25661.551100001],[59775.2839,25731.6219],[59781.5823,25733.1965],[59781.5823,25745.793500001],[59773.7093,25746.580700001],[59772.9219,25774.9241],[59761.1123,25773.3495],[59761.1123,25785.1591],[59771.3473,25827.673900001],[59780.0077,25827.673900001],[59780.0077,25844.2075],[59775.2839,25870.188899999],[59768.1981,25891.4463],[59774.4965,25920.5769],[59784.7315,25918.2149],[59786.7997,25916.511700001],[59797.4301,25907.757300001],[59798.2277,25907.100500001]]]';

                var template = document.getElementById('mg-lines-template-trs');
                var container = document.getElementById('mg-srch-results-trs');
                // var __mg_map = this.map;

                __mg_map.graphics.clear();
                var srMap = __mg_map.extent.spatialReference;
                // var coord_idx = this.getAttribute('mg-coord-idx');

                var myPolygon = {
                    'geometry': {
                        'paths': JSON.parse(test1_gs_str),
                        'spatialReference': srMap
                    },
                    'symbol': {
                        'color': [0, 0, 255, 64], // Полупрозрачный синий (RGBA: R=0, G=0, B=255, A=64)
                        'outline': {
                            'color': [0, 0, 255, 255], // Синий цвет границы (RGBA: R=0, G=0, B=255, A=255)
                            'width': 3, // Толщина границы: 3 пикселя
                            'type': 'esriSLS',
                            'style': 'esriSLSSolid' // Сплошная линия
                        },
                        'type': 'esriSFS',
                        'style': 'esriSFSSolid' // Сплошная заливка
                    }
                };

                var gra = new Graphic(myPolygon);

                __mg_map.graphics.add(gra);
                try {
                    var extent = graphicsUtils.graphicsExtent([gra]).expand(1.2);
                    __mg_map.setExtent(extent);
                }
                catch (err) {
                    console.log(err);
                }
            },

            _onBtnSearchClick: function () {
                var template = document.getElementById('mg-lines-template-trs');
                var container = document.getElementById('mg-srch-results-trs');
                var __mg_map = this.map;
                var __mg_search_res = [];

                var highlightResStr = function (elt) {
                    var html_collect = document.getElementsByClassName('mg-search-block-selected-trs');
                    var selected_blocks = [];
                    for (i1 = 0; i1 < html_collect.length; i1++) {
                        selected_blocks.push(html_collect[i1]);
                    }
                    for (i1 = 0; i1 < selected_blocks.length; i1++) {
                        selected_blocks[i1].classList.remove('mg-search-block-selected-trs');
                    }

                    var html_collect = document.getElementsByClassName('mg-separator-selected');
                    var selected_separators = [];
                    for (i1 = 0; i1 < html_collect.length; i1++) {
                        selected_separators.push(html_collect[i1]);
                    }
                    for (i1 = 0; i1 < selected_separators.length; i1++) {
                        selected_separators[i1].classList.remove('mg-separator-selected');
                    }

                    var block = elt.closest('.mg-search-block-trs');
                    // console.log(block);
                    block.classList.add('mg-search-block-selected-trs');

                    var row = elt.closest('.mg-search-row');
                    var separator_1 = row.querySelector('.mg-separator');

                    separator_1.classList.add('mg-separator-selected');

                    // не последний элемент
                    if (row.nextSibling) {
                        var separator_2 = row.nextSibling.querySelector('.mg-separator');
                        separator_2.classList.add('mg-separator-selected');
                    }

                    // + набить стили
                    // + повесить на поиск и открытие 
                };

                var onCoordsClick = function () {
                    highlightResStr(this);

                    __mg_map.graphics.clear();
                    var srMap = __mg_map.extent.spatialReference;
                    var coord_idx = this.getAttribute('mg-coord-idx');

                    console.log(__mg_search_res[coord_idx].coords);
                    console.log(__mg_search_res);

                    var myPolygon = {
                        'geometry': {
                            'paths': __mg_search_res[coord_idx].coords,
                            'spatialReference': srMap
                        },
                        'symbol': {
                            'color': [0, 0, 0, 0], 'outline': {
                                'color': [255, 0, 0, 255],
                                'width': 2, 'type': 'esriSLS', 'style': 'esriSLSSolid'
                            },
                            'type': 'esriSFS', 'style': 'esriSFSSolid'
                        }
                    };

                    var gra = new Graphic(myPolygon);

                    __mg_map.graphics.add(gra);
                    try {
                        var extent = graphicsUtils.graphicsExtent([gra]).expand(1.2);
                        __mg_map.setExtent(extent);
                    }
                    catch (err) {
                        console.log(err);
                    }

                };

                var onRunProtClick = function () {
                    highlightResStr(this);

                    var coord_idx = this.getAttribute('mg-coord-idx');
                    geojson0 = '{"type": "LineString", "coordinates":' + JSON.stringify(__mg_search_res[coord_idx].coords) + '}';
                    geojson1 = geojson0.replace("[[[", "[[");
                    geojson2 = geojson1.replace("]]]", "]]");

                    showPopUp('http://192.168.17.45:5024/parcelgeoml/' + geojson2);
                };

                var onResNameClick = function () {
                    highlightResStr(this);
                };

                var req_track = document.getElementById('mg-req-track').value;
                if (!req_track.length) {
                    alert('Порожній запит!');
                    return;
                }

                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://gisserver.gapu.local/flask_proxy/index.php?req_addr_trs=' + req_track);
                xhr.send();

                xhr.onload = function () {
                    try {
                        var res = JSON.parse(xhr.response);
                        console.log('JSON :');
                        console.log(res);
                    }
                    catch (err) {
                        container.innerHTML = '';
                        console.log('JSON parse error');
                        console.log(err);
                        return;
                    }

                    for (i1 = 0; i1 < res.length; i1++) {
                        try {
                            coords = JSON.parse(res[i1][0]);
                        }
                        catch (err) {
                            continue;
                        }
                        sr_res = {
                            'txt': res[i1][10] + ', ' + res[i1][5] + ', ' + res[i1][6],
                            // 'coords' : coords.coordinates[0]
                            'coords': coords.coordinates
                        };
                        __mg_search_res.push(sr_res);
                    }

                    container.innerHTML = '';
                    var tmpl_block = template.querySelector('span');
                    for (i1 = 0; i1 < __mg_search_res.length; i1++) {
                        clone = tmpl_block.cloneNode(true);
                        res_name = clone.querySelector('.mg-search-txt');
                        res_name.innerText = __mg_search_res[i1].txt;
                        res_name.addEventListener('click', onResNameClick);
                        res_coords = clone.querySelector('.mg-search-coords');
                        res_coords.setAttribute('mg-coord-idx', i1.toString());
                        res_coords.addEventListener('click', onCoordsClick);
                        res_run_prot = clone.querySelector('.mg-run-prot');
                        res_run_prot.setAttribute('mg-coord-idx', i1.toString());
                        res_run_prot.addEventListener('click', onRunProtClick);
                        container.appendChild(clone);
                    };
                    // console.log(__mg_search_res);
                };

                xhr.onerror = function () { };

            },

            /*
            _onDrawEnd: function (graphic, geotype, commontype) {
            //jshint unused: false
            this.drawBox.clear();
            if (!graphic.symbol) { //not draw and save graphic that has null symbol.
                return;
            }

            var geometry = graphic.geometry;
            console.log(geometry);

             },
            */

            addToMap: function (evt) {
                var symbol;
                symbol = new SimpleFillSymbol();

                this.map.showZoomSlider();

                if (window.__mg_draw_mode == 'polyline') {

                    this._symPoly = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([75, 190, 242]), 3);

                    //var graphic = new Graphic(evt.geometry, symbol);
                    var graphic = new Graphic(evt.geometry, this._symPoly);
                    this.map.graphics.add(graphic);

                    geojson0 = '{"type": "LineString", "coordinates":' + JSON.stringify(graphic.geometry.paths) + '}'
                    geojson1 = geojson0.replace("[[[", "[[");
                    geojson2 = geojson1.replace("]]]", "]]");

                    dom.byId('message').innerHTML = geojson2;
                    showPopUp('http://192.168.17.45:5024/parcelgeoml/' + geojson2);

                    window.__mg_drawtoolbar.deactivate();
                    this.map.setInfoWindowOnClick(true);
                }

                else {

                    this._symPoly = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                            new Color([255, 0, 0]), 3), new Color([255, 255, 0, 0.1]));

                    //var graphic = new Graphic(evt.geometry, symbol);
                    var graphic = new Graphic(evt.geometry, this._symPoly);
                    this.map.graphics.add(graphic);

                    geojson0 = '{"type": "POLYGON", "coordinates":' + JSON.stringify(graphic.geometry.rings) + '}'
                    //geojson = '{"type": "POLYGON", "coordinates":' + JSON.stringify(graphic.geometry.rings) +
                    //    ',"crs":{"type":"name","properties":{"name":"ESRI:' + graphic.geometry.spatialReference.wkid + '"}'
                    //geojson3857 = '{"type": "POLYGON", "coordinates":' + JSON.stringify(graphic.geometry.rings) +
                    //    ',"crs":{"type":"name","properties":{"name":"EPSG:3857"}'

                    // console.log(geojson0);
                    // select st_geomfromgeojson(geojson) 
                    dom.byId('message').innerHTML = geojson0;
                    showPopUp('http://192.168.17.45:5024/parcelgeom/' + geojson0);
                    //showPopUp(this._urlParcelService + geojson0);
                    //showPopUp('http://192.168.0.115:5020/parcel/2323981500010010105');

                    window.__mg_drawtoolbar.deactivate();
                    this.map.setInfoWindowOnClick(true);
                }
            },
            /*
            _showPopUp: function (url, parameters) {
                popUpObj = window.open(url,
                    "ModalPopUp",
                    "popup=yes," +
                    "toolbar=no," +
                    "scrollbars=no," +
                    "location=no," +
                    "statusbar=no," +
                    "menubar=no," +
                    "resizable=0," +
                    "width=800," +
                    "height=600," +
                    "left = 490," +
                    "top=100");

                popUpObj.focus();

            },
            */

            startup: function () {

                this.inherited(arguments);
                //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
                var map = this.map;
                var srMap = map.extent.spatialReference;
                //console.log(map.extent.spatialReference);
                console.log('startup');


                // coordinateFormatter spatial reference 
                const geoSpatialReference = new SpatialReference({
                    wkid: 4326
                });

                var redSpatialReference = new SpatialReference({
                    wkid: 3395 //spatial reference of 500K rasters
                });

                var message = document.getElementById("message");
                //var messagestatus = document.getElementById("messagestatus");
                //var messageaddstatus = document.getElementById("messageaddstatus");

                // This style does not allow us to color our polylines
                /*
                var styleTags = document.getElementsByTagName("style");
                // Loop through all <style> tags
                for (var i = 0; i < styleTags.length; i++) {
                    // Get the text of the content of the <style> tag
                    var styleContent = styleTags[i].innerHTML;
    
                    // Check if the text contains the search string
                    if (styleContent.indexOf("svg path {stroke: #000 !important;}") !== -1) {
                        // If it contains, remove the <style> tag
                        styleTags[i].parentNode.removeChild(styleTags[i]);
                        break; // If you need to remove only the first occurrence
                    }
                }
                */

                //var redsym = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.5]), 3);
                //var redsymdd = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0, 0.5]), 3);
                var sfsPoly = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255, 0, 0]), 3), new Color([255, 255, 0, 0.1]));

                this.drawtoolbar = new Draw(this.map)
                this.drawtoolbar.on("draw-end", this.addToMap)
                //this.drawtoolbar.on("draw-start", this.startDraw)

            },


            // onOpen: function(){
            //   console.log('onOpen');
            // },

            // onClose: function(){
            //   console.log('onClose');
            // },

            // onMinimize: function(){
            //   console.log('onMinimize');
            // },

            // onMaximize: function(){
            //   console.log('onMaximize');
            // },

            // onSignIn: function(credential){
            //   /* jshint unused:false*/
            //   console.log('onSignIn');
            // },

            // onSignOut: function(){
            //   console.log('onSignOut');
            // }

            // onPositionChange: function(){
            //   console.log('onPositionChange');
            // },

            // resize: function(){
            //   console.log('resize');
            // }


            //methods to communication between widgets:

        });
    });