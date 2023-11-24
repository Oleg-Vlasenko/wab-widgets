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


        on, array, dom
    ) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            // Custom widget code goes here
            baseClass: 'jimu-widget-xotgparcel',
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
            name: 'XOtgParcel',
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
                console.log('polyline');
				// return;
				
                this.map.graphics.clear();

                //this.drawtoolbar = new Draw(this.map)
                //this.drawtoolbar.on("draw-end", this._addToMap)
                
                window.__mg_drawtoolbar = this.drawtoolbar;
                this.map.setInfoWindowOnClick(false);
                this.drawtoolbar.activate('polyline');
                this.map.hideZoomSlider();
                
            },


            _onBtnClearClick: function () {
                this.map.graphics.clear();
                dom.byId('message').innerHTML = "";
                
                // var map = this.map;
                // var srMap = map.extent.spatialReference;
                
                  // var myPolygon = {"geometry":{"rings":[[[59536.878738427935,27053.246601985968],[59565.98296330305,27041.075744310918],[59555.002733009256,27020.570494967087],[59531.58706117791,27030.360097879624],[59536.878738427935,27053.246601985968]]],
                    // "spatialReference":srMap},
                    // "symbol":{"color":[0,0,0,64],"outline":{"color":[0,0,0,255],
                    // "width":1,"type":"esriSLS","style":"esriSLSSolid"},
                    // "type":"esriSFS","style":"esriSFSSolid"}};
                  
                  // var gra = new Graphic(myPolygon);
                
                    // map.graphics.add(gra);
                    // try {
                      // var extent = graphicsUtils.graphicsExtent([gra]).expand(1.2);
                      // map.setExtent(extent);
                    // } catch (err) {
                      // console.log(err)
                    // }
                
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
                        "height=500," +
                        "left = 490," +
                        "top=100");

                }

                this.map.showZoomSlider();

                // this._symPoly = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([0, 0, 255]));
				this._symPoly = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255]), 3);

                var graphic = new Graphic(evt.geometry, this._symPoly);
                this.map.graphics.add(graphic);

                geojson0 = '{"type": "POLYLINE", "coordinates":' + JSON.stringify(graphic.geometry.paths) + '}'

                console.log(geojson0);
                // dom.byId('message').innerHTML = geojson0;
                // showPopUp('http://192.168.17.45:5024/parcelgeom/' + geojson0);
                
                window.__mg_drawtoolbar.deactivate();
                this.map.setInfoWindowOnClick(true);
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

			var sfsPoly = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([0, 0, 255]));

            this.drawtoolbar = new Draw(this.map)
            this.drawtoolbar.on("draw-end", this.addToMap)

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