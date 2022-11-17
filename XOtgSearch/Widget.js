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
                this.map.graphics.clear();


                //this.drawtoolbar = new Draw(this.map)
                //this.drawtoolbar.on("draw-end", this._addToMap)
                
                window.__mg_drawtoolbar = this.drawtoolbar;
                this.map.setInfoWindowOnClick(false);
                this.drawtoolbar.activate('polygon');  //'polygon' Draw['POLYGON']
                this.map.hideZoomSlider();
                
                //console.log('polygon');
            },


            _onBtnClearClick: function () {
                this.map.graphics.clear();
                dom.byId('message').innerHTML = "";
                
            },
            
            _onBtnFindClick: function() {
                console.log('find parcel');
                
                var template = document.getElementById('mg-lines-template');
                var container = document.getElementById('mg-srch-results');
                var __mg_map = this.map;
                var __mg_tst_data = [
                    {
                        'txt': 'Бульвари вул.Чкалова,  Вознесенська(ХХІІ партз`їзду), вул. Бородинської.(№41/22 від 08.12.04)',
                        'coords': [[[59034.47754263218,26213.62434716835],[59050.85873135619,26232.896410425023],[59150.10951547489,26147.458867687656],[59135.334315897315,26128.18680443098],[59034.47754263218,26213.62434716835]]]
                    },
                    {
                        'txt': 'Бульвар по вул. Новоорловській.(№41/22 від 08.12.04)',
                        'coords': [[[54576.41033215127,26277.420703490327],[54726.41576310941,26392.208502629877],[54748.590485549306,26367.425399023454],[54598.58503744799,26250.028834574798],[54576.41033215127,26277.420703490327]]]
                    },
                    {
                        'txt': 'Бульвари вул. Чкалова, ХХІІ партз`їзду), вул. Бородинської.  (№41/22 від 08.12.04)',
                        'coords': [[[59404.12498263973,25899.081432196876],[59420.45338754865,25922.089673769176],[59570.3777313209,25795.175996649134],[59565.18233988903,25787.011777114014],[59634.94912034327,25729.8635502933],[59623.07392768244,25714.277307381806],[59404.12498263973,25899.081432196876]]]

                    },
                    {
                        'txt': 'Зелена зона в районі вул. Шолом-Алейхема (перед лікарнею №10). (№41/22 від 08.12.04)',
                        'coords': [[[60053.71653752333,26687.390254720896],[60071.93298812618,26690.33722786684],[60082.112790018065,26632.74151332398],[60065.23576943826,26630.0624445808],[60053.71653752333,26687.390254720896]]]
                    },
                    {
                        'txt': 'Сквер по Успенській площі(Дем`яна Бєдного). (№41/22 від 08.12.04)',
                        'coords': [[[60230.79128832283,26709.359083067666],[60397.75323273204,26737.02037639341],[60409.406404220645,26689.33653157908],[60238.49311381437,26662.81369911889],[60230.79128832283,26709.359083067666]]]
                    }
                ];
                
                var onCoordsClick =  function() {
                    __mg_map.graphics.clear();
                    var srMap = __mg_map.extent.spatialReference;
                    var coord_idx = this.getAttribute('mg-coord-idx');
                    console.log('coords');
                    
                    var myPolygon = {'geometry':{'rings': __mg_tst_data[coord_idx].coords,
                        'spatialReference':srMap},
                        'symbol':{'color':[0,0,0,64],'outline':{'color':[0,0,0,255],
                        'width':1,'type':'esriSLS','style':'esriSLSSolid'},
                        'type':'esriSFS','style':'esriSFSSolid'}};
                      
                      var gra = new Graphic(myPolygon);
                    
                        __mg_map.graphics.add(gra);
                        try {
                          var extent = graphicsUtils.graphicsExtent([gra]).expand(1.2);
                          __mg_map.setExtent(extent);
                        } catch (err) {
                          console.log(err)
                        }
                    
                };

                var onCoords2Click =  function() {
                    function showPopUp2(url, parameters) {
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

                        // popUpObj.focus();
                    }

                    var coord_idx = this.getAttribute('mg-coord-idx');
                    geojson0 = '{"type": "POLYGON", "coordinates":' + JSON.stringify(__mg_tst_data[coord_idx].coords) + '}';
                    showPopUp2('http://192.168.17.45:5024/parcelgeom/' + geojson0);
                };

                container.innerHTML = '';
                var tmpl_block = template.querySelector('span');
                for (var i1=0; i1 < __mg_tst_data.length; i1++) {
                    clone = tmpl_block.cloneNode(true);
                    res_name = clone.querySelector('.mg-search-txt');
                    res_name.innerText = __mg_tst_data[i1].txt; 
                    res_coords = clone.querySelector('.mg-search-coords');
                    res_coords.setAttribute('mg-coord-idx', i1.toString());
                    res_coords.addEventListener('click', onCoordsClick);
                    res_coords2 = clone.querySelector('.mg-search-coords2');
                    res_coords2.setAttribute('mg-coord-idx', i1.toString());
                    res_coords2.addEventListener('click', onCoords2Click);
                    container.appendChild(clone);
                }
                // container.innerHTML = '';
            },
            
            _onBtnJsonClick: function() {
                var req_val = document.getElementById('mg-req-val').value;
                if (!req_val.length) {
                    alert('Пустой запрос!');
                    return;
                }
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://gisserver.gapu.local/flask_proxy/');
                form_data = new FormData();
                form_data.append('req_val', req_val);
                xhr.send(form_data);

                xhr.onload = function() {
                };

                xhr.onerror = function() {};                
            },

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

                    // popUpObj.focus();

                }

                var symbol;
                this.map.showZoomSlider();

                //this.drawtoolbar.deactivate(); //  null ? 

                symbol = new SimpleFillSymbol();

                this._symPoly = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255, 0, 0]), 3), new Color([255, 255, 0, 0.1]));

                //var graphic = new Graphic(evt.geometry, symbol);
                var graphic = new Graphic(evt.geometry, this._symPoly);
                this.map.graphics.add(graphic);

                geojson0 = '{"type": "POLYGON", "coordinates":' + JSON.stringify(graphic.geometry.rings) + '}'

                console.log(geojson0)
                // select st_geomfromgeojson(geojson) 
                dom.byId('message').innerHTML = geojson0;
                showPopUp('http://192.168.17.45:5024/parcelgeom/' + geojson0);
                
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

            var message = document.getElementById("message");

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
  
function Test1() {
// MULTIPOLYGON (((54576.41033215127 26277.420703490327, 54726.41576310941 26392.208502629877, 54748.590485549306 26367.425399023454, 54598.58503744799 26250.028834574798, 54576.41033215127 26277.420703490327)))
// MULTIPOLYGON (((59404.12498263973 25899.081432196876, 59420.45338754865 25922.089673769176, 59570.3777313209 25795.175996649134, 59565.18233988903 25787.011777114014, 59634.94912034327 25729.8635502933, 59623.07392768244 25714.277307381806, 59404.12498263973 25899.081432196876)))
// MULTIPOLYGON (((60053.71653752333 26687.390254720896, 60071.93298812618 26690.33722786684, 60082.112790018065 26632.74151332398, 60065.23576943826 26630.0624445808, 60053.71653752333 26687.390254720896)))
// MULTIPOLYGON (((60230.79128832283 26709.359083067666, 60397.75323273204 26737.02037639341, 60409.406404220645 26689.33653157908, 60238.49311381437 26662.81369911889, 60230.79128832283 26709.359083067666)))

    str1 = 'MULTIPOLYGON (((60230.79128832283 26709.359083067666, 60397.75323273204 26737.02037639341, 60409.406404220645 26689.33653157908, 60238.49311381437 26662.81369911889, 60230.79128832283 26709.359083067666)))';
    str1 =  str1.replace('MULTIPOLYGON (((', '');
    str1 =  str1.replace(')))', '');

    str1 =  str1.split(', ');
    for (var i1=0; i1 < str1.length; i1++) {
        console.log(str1[i1].replace(' ', ','));
    }
}   
 