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
    // 'dojo/number',
    'dojo/i18n',
    'dojo/i18n!esri/nls/jsapi',
    'dojo/_base/html',
    'dojo/_base/lang',

    "dojo/on",
    "dojo/_base/array",
    "dojo/dom",
    'esri/tasks/query',

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

        Query
    ) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            // Custom widget code goes here
            baseClass: 'jimu-widget-xotgredline',
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
            name: 'XOtgRedLine',
            //methods to communication with app container:

            postCreate: function () {
                this.inherited(arguments);

                // теперь attach-point точно существует
                if (this.layersInfoNode) {
                    window.__mg_layersInfoNode = this.layersInfoNode;
                } else {
                    console.error("layersInfoNode не найден!");
                }
            },

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
                var layersInfo = {};

                this.map.graphics.clear();
                dom.byId('message').innerHTML = "";
            },

            addToMap: function (evt, Query) {
                function showPopUp(url, parameters) {
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
                        "height=680," +
                        "left = 490," +
                        "top=100");
                }

                var symbol;
                symbol = new SimpleFillSymbol();

                this.map.showZoomSlider();

                this._symPoly = new SimpleFillSymbol(
                    SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([0, 0, 255]),
                        3
                    ),
                    new Color([255, 255, 0, 0.1])
                );

                var graphic = new Graphic(evt.geometry, this._symPoly);
                this.map.graphics.add(graphic);

                geojson0 = '{"type": "POLYGON", "coordinates":' + JSON.stringify(graphic.geometry.rings) + '}'

                // dom.byId('message').innerHTML = geojson2;
                
                showPopUp('http://192.168.17.45:5024/rlupload/' + geojson0);

                window.__mg_drawtoolbar.deactivate();
                this.map.setInfoWindowOnClick(true);
            },

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

                this.drawtoolbar = new Draw(this.map)
                this.drawtoolbar.on("draw-end", this.addToMap)

            },

        });
    }); 