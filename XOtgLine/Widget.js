///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
define(['dojo/_base/declare', 'jimu/BaseWidget'
    , "esri/request", "esri/tasks/Geoprocessor", "esri/tasks/DataFile",
    "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/Color",

    "esri/InfoTemplate",

    "esri/geometry/Polygon",
    "esri/geometry/Polyline",
    "esri/geometry/Point",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",

    "esri/graphic",
    "esri/graphicsUtils",

    "esri/SpatialReference",
    "esri/geometry/projection",

    "esri/toolbars/draw",
    'jimu/dijit/DrawBox',
    "esri/symbols/SimpleFillSymbol",
    'esri/layers/GraphicsLayer',
    'esri/layers/FeatureLayer',
    'dojo/i18n',
    'dojo/i18n!esri/nls/jsapi',
    'dojo/_base/html',
    'dojo/_base/lang',

    "dojo/on",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/request/xhr",
    "dojo/domReady!"
],
    function (declare, BaseWidget
        , esriRequest, Geoprocessor, DataFile,
        SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer, Color,
        InfoTemplate,

        Polygon,
        Polyline,
        Point,

        SimpleMarkerSymbol,
        TextSymbol,
        Font,


        Graphic,
        graphicsUtils,
        SpatialReference, projection,

        Draw, DrawBox,
        SimpleFillSymbol,
        GraphicsLayer, FeatureLayer,
        dojoI18n, esriNlsBundle,
        html, lang,


        on, array, dom, xhr
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-xotgline',
            _defaultGsUrl: '//tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer',
            _undoManager: null,
            _graphicsLayer: null,
            _objectIdCounter: 1,
            _objectIdName: 'OBJECTID',
            _objectIdType: 'esriFieldTypeOID',
            _polygonLayer: null,
            _labelLayer: null,
            drawtoolbar: null,
            _dt: null,
            _symPoly: null,
            urlParcelService: 'http://192.168.0.115:5020/parcelgeom/',
            _gs: 'http://192.168.0.115:6080/arcgis/rest/services/Geometry/GeometryServer',
            dtbox: '',
            name: 'XOtgLine',

            postMixInProperties: function () {
                this.inherited(arguments);
                this.jimuNls = window.jimuNls;
                if (esriConfig.defaults.geometryService) {
                    this._gs = esriConfig.defaults.geometryService;
                } else {
                    this._gs = new GeometryService(this._defaultGsUrl);
                }
            },



            postCreate: function () {
                this.inherited(arguments);
                var self = this;
                xhr('/flask_proxy/get_config.php', {
                    handleAs: 'json'
                }).then(function (cfg) {
                    window.__mg_widgetConfig = cfg;
                }, function (error) {
                    console.error('Failed to load config:', error);
                });

                var style = document.createElement('style');

                style.innerHTML = '.mg-tab-bar { display: flex; margin-bottom: 15px; border-bottom: 2px solid #2E8B57; } ' +
                    '.mg-tab-btn { padding: 8px 16px; cursor: pointer; background: #F0FFFF; color: #2E8B57; border: 1px solid #daf8f8; border-bottom: none; margin-right: 4px; border-radius: 4px 4px 0 0; font-weight: 400; } ' +
                    '.mg-tab-btn:hover { background:  #E0F8F8; } ' +
                    '.mg-tab-btn.mg-active { background: #5F9EA0; color: #FFFFFF; border-color: #507a60; border-bottom: none; font-weight: 600; } ' +
                    '.mg-tab-content { display: none; padding: 10px 0; } ' +
                    '.mg-tab-content.mg-active { display: block; } ' +
                    '.mg-bottom-block { margin-top: 20px; border-top: 2px solid #ddd; padding-top: 15px; }';



                document.head.appendChild(style);

                setTimeout(function () {
                    var tabBtns = document.querySelectorAll('.mg-tab-btn');
                    var tabContents = document.querySelectorAll('.mg-tab-content');
                    tabBtns.forEach(function (btn) {
                        btn.addEventListener('click', function () {
                            tabBtns.forEach(function (b) { b.classList.remove('mg-active'); });
                            tabContents.forEach(function (c) { c.classList.remove('mg-active'); });
                            this.classList.add('mg-active');
                            var target = document.getElementById(this.getAttribute('data-tab'));
                            if (target) {
                                target.classList.add('mg-active');
                            }
                        });
                    });
                }, 100);
            },



            _initGraphicsLayers: function () {
                this._graphicsLayer = new GraphicsLayer();
            },

            _removeEmptyLayers: function () {
            },

            startDraw: function () {
                this.map.graphics.clear();
            },

            _onBtnPolygonClick: function () {
                var draw_mode = 'polygon';
                this.map.graphics.clear();
                window.__mg_drawtoolbar = this.drawtoolbar;
                this.map.setInfoWindowOnClick(false);
                this.drawtoolbar.activate(draw_mode);
                window.__mg_draw_mode = draw_mode;
                this.map.hideZoomSlider();
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
                var container = dom.byId('mg-srch-results-trs');
                container.innerHTML = '';
                dom.byId('mg-req-track').value = '';
                window.__mg_test2 = null;
            },



            _onBtnSelectedClick: function () {
                var self = this;
                var __mg_map = self.map;
                var feat = __mg_map.infoWindow.getSelectedFeature();

                if (!feat) {
                    alert('Не вибрано жодного об\'єкту!');
                    return;
                }

                var layer_name = feat._layer.name;
                if (layer_name != 'Проектні мережі' && layer_name != 'Проекти інженерних мереж надані на розгляд технічної ради') {
                    alert('Не вибрано об\'єкт інженерних мереж!');
                    return;
                }

                var extent = feat.geometry.getExtent();
                var center = extent.getCenter();
                __mg_map.setExtent(extent.expand(2.5));
                __mg_map.centerAt(center);

                var flaskUrl = window.__mg_widgetConfig && window.__mg_widgetConfig.flaskUrl || '/';

                var geojson0 = '{"type": "LineString", "coordinates":' + JSON.stringify(feat.geometry.paths) + '}';
                var geojson1 = geojson0.replace("[[[", "[[");
                var geojson2 = geojson1.replace("]]]", "]]");

                var popUpObj = window.open(flaskUrl + '/parcelgeoml/' + geojson2,
                    "ModalPopUp",
                    "popup=yes,toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=700,height=500,left=490,top=100");
            },



            _onTest1Click: function () {
                var self = this;
                var __mg_map = self.map;
                var xhrReq = new XMLHttpRequest();
                xhrReq.open('GET', '/flask_proxy/broker.php');
                xhrReq.send();

                xhrReq.onload = function () {
                    try {
                        var res = JSON.parse(xhrReq.response);

                        if (res.res === 'empty' || !Array.isArray(res.items) || res.items.length === 0) {
                            alert('Нет выбранного объекта!');
                            return;
                        }

                        __mg_map.graphics.clear();
                        var srMap = __mg_map.extent.spatialReference;
                        var graphics = [];

                        res.items.forEach(function (item) {
                            var poly_type = (item.poly_type || '').trim();
                            if (!poly_type || !item.data) return;

                            try {
                                var coords_str = JSON.parse(item.data);
                                var obj_coords = JSON.parse(coords_str);
                                var coords = obj_coords.coordinates[0];
                                var labelCoord = coords[0];
                                var labelPoint = new Point(labelCoord[0], labelCoord[1], srMap);

                                if (poly_type === 'zoning') {
                                    var myPolygon = {
                                        geometry: {
                                            rings: coords,
                                            spatialReference: srMap
                                        },
                                        symbol: {
                                            color: [0, 255, 255, 180],
                                            outline: {
                                                color: [0, 100, 255, 255],
                                                width: 3,
                                                type: 'esriSLS',
                                                style: 'esriSLSSolid'
                                            },
                                            type: 'esriSFS',
                                            style: 'esriSFSSolid'
                                        }
                                    };

                                    var gra = new Graphic(myPolygon);
                                    __mg_map.graphics.add(gra);
                                    graphics.push(gra);

                                    var bgSymbol = new SimpleMarkerSymbol("square", 40, null, new Color([255, 255, 255, 255]));
                                    bgSymbol.setOutline(null);
                                    var bgGraphic = new Graphic(labelPoint, bgSymbol);
                                    __mg_map.graphics.add(bgGraphic);

                                    var textSymbol = new TextSymbol("Зонінг")
                                        .setColor(new Color([0, 0, 0]))
                                        .setFont(new Font("14pt").setWeight(Font.WEIGHT_BOLD))
                                        .setOffset(0, -120);

                                    var textGraphic = new Graphic(labelPoint, textSymbol);
                                    __mg_map.graphics.add(textGraphic);

                                } else if (poly_type === 'redlines') {
                                    var myPolyline = {
                                        geometry: {
                                            paths: [coords],
                                            spatialReference: srMap
                                        },
                                        symbol: {
                                            color: [200, 20, 60, 255],
                                            width: 5,
                                            type: 'esriSLS',
                                            style: 'esriSLSSolid'
                                        }
                                    };

                                    var gra = new Graphic(myPolyline);
                                    __mg_map.graphics.add(gra);
                                    graphics.push(gra);

                                    var textSymbol = new TextSymbol("Червона лінія")
                                        .setColor(new Color([200, 20, 60, 255]))
                                        .setFont(new Font("14pt").setWeight(Font.WEIGHT_BOLD))
                                        .setOffset(0, 20);

                                    var textGraphic = new Graphic(labelPoint, textSymbol);
                                    __mg_map.graphics.add(textGraphic);

                                    if (window.__mg_test2) {
                                        var tcr = JSON.parse(window.__mg_test2);
                                        var myPolyline2 = {
                                            geometry: {
                                                paths: [tcr.coordinates],
                                                spatialReference: srMap
                                            },
                                            symbol: {
                                                color: [0, 180, 120, 255],
                                                width: 5,
                                                type: 'esriSLS',
                                                style: 'esriSLSSolid'
                                            }
                                        };

                                        var gra2 = new Graphic(myPolyline2);
                                        __mg_map.graphics.add(gra2);
                                        graphics.push(gra2);

                                        var tcrFirst = tcr.coordinates[0];
                                        var labelPoint2 = new Point(tcrFirst[0], tcrFirst[1], srMap);

                                        var textSymbol2 = new TextSymbol("Обрана траса")
                                            .setColor(new Color([0, 80, 32, 255]))
                                            .setFont(new Font("14pt").setWeight(Font.WEIGHT_BOLD))
                                            .setOffset(0, 20);

                                        var textGraphic2 = new Graphic(labelPoint2, textSymbol2);
                                        __mg_map.graphics.add(textGraphic2);
                                    }
                                }

                            } catch (err) {
                                // ignore individual errors
                            }
                        });

                        try {
                            if (graphics.length > 0) {
                                var extent = graphicsUtils.graphicsExtent(graphics).expand(1.2);
                                __mg_map.setExtent(extent);
                            }
                        } catch (err) {
                            // ignore
                        }

                    } catch (err) {
                        // ignore
                    }
                };
            },

            _onBtnSearchClick: function () {
                var self = this;
                var template = document.getElementById('mg-lines-template-trs');
                var container = document.getElementById('mg-srch-results-trs');
                var __mg_map = self.map;
                var __mg_search_res = [];
                var flaskUrl = window.__mg_widgetConfig && window.__mg_widgetConfig.flaskUrl || '/';

                var highlightResStr = function (elt) {
                    var html_collect = document.getElementsByClassName('mg-search-block-selected-trs');
                    var selected_blocks = [];
                    for (var i1 = 0; i1 < html_collect.length; i1++) {
                        selected_blocks.push(html_collect[i1]);
                    }
                    for (var i1 = 0; i1 < selected_blocks.length; i1++) {
                        selected_blocks[i1].classList.remove('mg-search-block-selected-trs');
                    }

                    var html_collect = document.getElementsByClassName('mg-separator-selected');
                    var selected_separators = [];
                    for (var i1 = 0; i1 < html_collect.length; i1++) {
                        selected_separators.push(html_collect[i1]);
                    }
                    for (var i1 = 0; i1 < selected_separators.length; i1++) {
                        selected_separators[i1].classList.remove('mg-separator-selected');
                    }

                    var block = elt.closest('.mg-search-block-trs');
                    block.classList.add('mg-search-block-selected-trs');

                    var row = elt.closest('.mg-search-row');
                    var separator_1 = row.querySelector('.mg-separator');
                    separator_1.classList.add('mg-separator-selected');

                    if (row.nextSibling) {
                        var separator_2 = row.nextSibling.querySelector('.mg-separator');
                        separator_2.classList.add('mg-separator-selected');
                    }
                };

                var onCoordsClick = function () {
                    highlightResStr(this);
                    __mg_map.graphics.clear();
                    var srMap = __mg_map.extent.spatialReference;
                    var coord_idx = this.getAttribute('mg-coord-idx');

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
                    } catch (err) {
                        // ignore
                    }
                };

                var onRunProtClick = function () {
                    highlightResStr(this);
                    var coord_idx = this.getAttribute('mg-coord-idx');
                    var geojson0 = '{"type": "LineString", "coordinates":' + JSON.stringify(__mg_search_res[coord_idx].coords) + '}';
                    var geojson1 = geojson0.replace("[[[", "[[");
                    var geojson2 = geojson1.replace("]]]", "]]");

                    var popUpObj = window.open(flaskUrl + '/parcelgeoml/' + geojson2,
                        "ModalPopUp",
                        "popup=yes,toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=700,height=500,left=490,top=100");
                };

                var onResNameClick = function () {
                    highlightResStr(this);
                };

                var req_track = document.getElementById('mg-req-track').value;
                req_track = encodeURIComponent(req_track);
                if (!req_track.length) {
                    alert('Порожній запит!');
                    return;
                }

                var xhrReq = new XMLHttpRequest();
                xhrReq.open('GET', '/flask_proxy/index.php?req_addr_trs=' + req_track);
                xhrReq.send();

                xhrReq.onload = function () {
                    try {
                        var res = JSON.parse(xhrReq.response);
                    } catch (err) {
                        container.innerHTML = '';
                        return;
                    }

                    for (var i1 = 0; i1 < res.length; i1++) {
                        try {
                            var coords = JSON.parse(res[i1].geojson);
                        } catch (err) {
                            continue;
                        }
                        var sr_res = {
                            'txt': res[i1].name + ', ' + res[i1].name_kom + ', ' + res[i1]['шифр'],
                            'coords': coords.coordinates
                        };
                        __mg_search_res.push(sr_res);
                    }

                    container.innerHTML = '';
                    var tmpl_block = template.querySelector('span');
                    for (var i1 = 0; i1 < __mg_search_res.length; i1++) {
                        var clone = tmpl_block.cloneNode(true);
                        var res_name = clone.querySelector('.mg-search-txt');
                        res_name.innerText = __mg_search_res[i1].txt;
                        res_name.addEventListener('click', onResNameClick);
                        var res_coords = clone.querySelector('.mg-search-coords');
                        res_coords.setAttribute('mg-coord-idx', i1.toString());
                        res_coords.addEventListener('click', onCoordsClick);
                        var res_run_prot = clone.querySelector('.mg-run-prot');
                        res_run_prot.setAttribute('mg-coord-idx', i1.toString());
                        res_run_prot.addEventListener('click', onRunProtClick);
                        container.appendChild(clone);
                    }
                };

                xhrReq.onerror = function () { };
            },

            addToMap: function (evt) {
                var self = this;
                var flaskUrl = window.__mg_widgetConfig && window.__mg_widgetConfig.flaskUrl || '/';

                self.map.showZoomSlider();

                if (window.__mg_draw_mode == 'polyline') {
                    self._symPoly = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([75, 190, 242]), 3);
                    var graphic = new Graphic(evt.geometry, self._symPoly);
                    self.map.graphics.add(graphic);

                    var geojson0 = '{"type": "LineString", "coordinates":' + JSON.stringify(graphic.geometry.paths) + '}';
                    var geojson1 = geojson0.replace("[[[", "[[");
                    var geojson2 = geojson1.replace("]]]", "]]");

                    dom.byId('message').innerHTML = geojson2;

                    if (graphic && graphic.geometry && graphic.geometry.paths) {
                        var geojson = {
                            type: "LineString",
                            coordinates: graphic.geometry.paths[0]
                        };
                        window.__mg_test2 = JSON.stringify(geojson);
                    }

                    var popUpObj = window.open(flaskUrl + '/parcelgeoml/' + geojson2,
                        "ModalPopUp",
                        "popup=yes,toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=700,height=500,left=490,top=100");

                    window.__mg_drawtoolbar.deactivate();
                    self.map.setInfoWindowOnClick(true);
                } else {
                    self._symPoly = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                            new Color([255, 0, 0]), 3), new Color([255, 255, 0, 0.1]));

                    var graphic = new Graphic(evt.geometry, self._symPoly);
                    self.map.graphics.add(graphic);

                    var geojson0 = '{"type": "POLYGON", "coordinates":' + JSON.stringify(graphic.geometry.rings) + '}';
                    dom.byId('message').innerHTML = geojson0;

                    var popUpObj = window.open(flaskUrl + '/parcelgeom/' + geojson0,
                        "ModalPopUp",
                        "popup=yes,toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=700,height=500,left=490,top=100");

                    window.__mg_drawtoolbar.deactivate();
                    self.map.setInfoWindowOnClick(true);
                }
            },

            startup: function () {
                this.inherited(arguments);
                var self = this;
                var map = self.map;
                var srMap = map.extent.spatialReference;

                var geoSpatialReference = new SpatialReference({
                    wkid: 4326
                });

                var redSpatialReference = new SpatialReference({
                    wkid: 3395
                });

                var message = document.getElementById("message");

                var sfsPoly = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255, 0, 0]), 3), new Color([255, 255, 0, 0.1]));

                self.drawtoolbar = new Draw(self.map);
                self.drawtoolbar.on("draw-end", lang.hitch(self, self.addToMap));
            }
        });
    });