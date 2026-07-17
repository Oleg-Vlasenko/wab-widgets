///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
define(['dojo/_base/declare', 'jimu/BaseWidget'
  , "esri/request", "esri/tasks/Geoprocessor", "esri/tasks/DataFile",
    "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/Color",

    "esri/InfoTemplate",

    "esri/geometry/Polygon",
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
            baseClass: 'jimu-widget-xotgparcel',
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
            name: 'XOtgParcel',

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
                this.map.graphics.clear();
                window.__mg_drawtoolbar = this.drawtoolbar;
                this.map.setInfoWindowOnClick(false);
                this.drawtoolbar.activate('polygon');
                this.map.hideZoomSlider();
            },

            _onBtnClearClick: function () {
                this.map.graphics.clear();
                dom.byId('message').innerHTML = "";
            },

            _onBtnJsonClick: function () {
                var self = this;
                var template = document.getElementById('mg-lines-template');
                var container = document.getElementById('mg-srch-results');
                var __mg_map = self.map;
                var __mg_search_res = [];
                var flaskUrl = window.__mg_widgetConfig && window.__mg_widgetConfig.flaskUrl || '/';

                var highlightResStr = function (elt) {
                    var html_collect = document.getElementsByClassName('mg-search-block-selected');
                    var selected_blocks = [];
                    for (var i1 = 0; i1 < html_collect.length; i1++) {
                        selected_blocks.push(html_collect[i1]);
                    }
                    for (var i1 = 0; i1 < selected_blocks.length; i1++) {
                        selected_blocks[i1].classList.remove('mg-search-block-selected');
                    }

                    var html_collect = document.getElementsByClassName('mg-separator-selected');
                    var selected_separators = [];
                    for (var i1 = 0; i1 < html_collect.length; i1++) {
                        selected_separators.push(html_collect[i1]);
                    }
                    for (var i1 = 0; i1 < selected_separators.length; i1++) {
                        selected_separators[i1].classList.remove('mg-separator-selected');
                    }

                    var block = elt.closest('.mg-search-block');
                    block.classList.add('mg-search-block-selected');

                    var row = elt.closest('.mg-search-row');
                    var separator_1 = row.querySelector('.mg-separator');
                    var separator_2 = row.nextSibling.querySelector('.mg-separator');

                    separator_1.classList.add('mg-separator-selected');
                    separator_2.classList.add('mg-separator-selected');
                };

                var onCoordsClick = function () {
                    highlightResStr(this);
                    __mg_map.graphics.clear();
                    var srMap = __mg_map.extent.spatialReference;
                    var coord_idx = this.getAttribute('mg-coord-idx');

                    var myPolygon = {
                        'geometry': {
                            'rings': __mg_search_res[coord_idx].coords,
                            'spatialReference': srMap
                        },
                        'symbol': {
                            'color': [0, 0, 0, 64],
                            'outline': {
                                'color': [0, 0, 0, 255],
                                'width': 1,
                                'type': 'esriSLS',
                                'style': 'esriSLSSolid'
                            },
                            'type': 'esriSFS',
                            'style': 'esriSFSSolid'
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
                    var geojson0 = '{"type": "POLYGON", "coordinates":' + JSON.stringify(__mg_search_res[coord_idx].coords) + '}';

                    var popUpObj = window.open(flaskUrl + '/parcelgeom/' + geojson0,
                        "ModalPopUp",
                        "popup=yes,toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=700,height=500,left=490,top=100");
                };

                var onResNameClick = function () {
                    highlightResStr(this);
                };

                var req_addr = document.getElementById('mg-req-addr').value;
                var req_custmr = document.getElementById('mg-req-custmr').value;
                if ((!req_addr.length) && (!req_custmr.length)) {
                    alert('Порожній запит!');
                    return;
                }

                var xhrReq = new XMLHttpRequest();
                xhrReq.open('GET', '/flask_proxy/index.php?req_addr=' + req_addr + '&req_custmr=' + req_custmr);
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
                            'txt': res[i1].str + ', ' + res[i1].zak,
                            'coords': coords.coordinates[0]
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