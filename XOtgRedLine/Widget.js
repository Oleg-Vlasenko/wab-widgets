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
    'esri/tasks/query',
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

        on, array, dom,
        Query, xhr
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-xotgredline',
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
            name: 'XOtgRedLine',

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

                if (this.layersInfoNode) {
                    window.__mg_layersInfoNode = this.layersInfoNode;
                }
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
            },

            addToMap: function (evt) {
                var self = this;
                var flaskUrl = window.__mg_widgetConfig && window.__mg_widgetConfig.flaskUrl || '/';

                self.map.showZoomSlider();

                self._symPoly = new SimpleFillSymbol(
                    SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([0, 0, 255]),
                        3
                    ),
                    new Color([255, 255, 0, 0.1])
                );

                var graphic = new Graphic(evt.geometry, self._symPoly);
                self.map.graphics.add(graphic);

                var geojson0 = '{"type": "POLYGON", "coordinates":' + JSON.stringify(graphic.geometry.rings) + '}';

                var popUpObj = window.open(flaskUrl + '/rlupload/' + geojson0,
                    "ModalPopUp",
                    "popup=yes,toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=700,height=680,left=490,top=100");

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

                self.drawtoolbar = new Draw(self.map);
                self.drawtoolbar.on("draw-end", lang.hitch(self, self.addToMap));
            }
        });
    });