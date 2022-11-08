// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://@sbaseurl@/jsapi/jsapi/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
    cache: {
        "esri/dijit/Search": function() {
            define("require dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Evented dojo/Deferred dojo/keys dojo/on dojo/query dojo/uacss dojo/regexp dojo/dom dojo/dom-attr dojo/dom-class dojo/dom-style dojo/dom-construct dojo/date/locale dojo/i18n!../nls/jsapi dojo/text!./Search/templates/Search.html dijit/_WidgetBase dijit/_TemplatedMixin dijit/_FocusMixin dijit/a11yclick dijit/focus ../lang ../InfoTemplate ../kernel ../SpatialReference ../graphic ../promiseList ../symbols/PictureMarkerSymbol ../symbols/SimpleMarkerSymbol ../symbols/SimpleLineSymbol ../symbols/SimpleFillSymbol ../symbols/TextSymbol ../symbols/Font ../geometry/Point ../geometry/Extent ../geometry/normalizeUtils ../geometry/scaleUtils ../tasks/locator ../tasks/query ../Color ../styles/basic".split(" "),
                function(z, p, k, q, A, x, u, w, h, B, r, c, v, m, I, y, J, t, D, N, E, g, e, n, C, F, G, U, H, K, V, W, O, X, Y, L, P, R, Q, S, Z, T, aa, ba) {
                    function M(a, b) {
                        a && b && (a._layer = b, a._sourceLayer = b)
                    }
                    p = p([N, E, g, A], {
                        declaredClass: "esri.dijit.Search",
                        templateString: D,
                        reHostedFS: /https?:\/\/services.*\.arcgis\.com/i,
                        constructor: function(a, b) {
                            this.css = {
                                searchGroup: "searchGroup",
                                searchInput: "searchInput",
                                searchInputGroup: "searchInputGroup",
                                searchBtn: "searchBtn",
                                searchSubmit: "searchSubmit",
                                searchIcon: "searchIcon esri-icon-search",
                                searchButtonText: "searchButtonText",
                                searchToggle: "searchToggle",
                                searchToggleIcon: "searchIcon esri-icon-down-arrow",
                                searchMenu: "searchMenu",
                                searchMenuHeader: "menuHeader",
                                searchClear: "searchClear",
                                searchClearIcon: "searchIcon esri-icon-close searchClose",
                                searchSpinner: "searchIcon esri-icon-loading-indicator searchSpinner",
                                searchSourceName: "sourceName",
                                suggestionsMenu: "suggestionsMenu",
                                sourcesMenu: "sourcesMenu",
                                activeSource: "active",
                                hasValue: "hasValue",
                                hasButtonMode: "hasButtonMode",
                                hasMultipleSources: "hasMultipleSources",
                                showSuggestions: "showSuggestions",
                                showSources: "showSources",
                                showNoResults: "showNoResults",
                                searchLoading: "searchLoading",
                                latLonHeader: "searchLatLongHeader",
                                searchMoreResults: "moreResults",
                                searchMoreResultsList: "resultsList",
                                searchMoreResultsHeader: "moreHeader",
                                searchMoreResultsItem: "moreItem",
                                searchMoreResultsListHeader: "popupHeader",
                                searchShowMoreResults: "showMoreResults",
                                searchNoResultsMenu: "noResultsMenu",
                                searchNoResultsBody: "noResultsBody",
                                searchNoResultsHeader: "noResultsHeader",
                                searchNoValueIcon: "noValueIcon esri-icon-notice-triangle",
                                searchNoValueText: "noValueText",
                                searchNoResultsText: "noResultsText",
                                searchExpandContainer: "searchExpandContainer",
                                searchAnimateContainer: "searchAnimate",
                                searchExpanded: "searchExpanded",
                                searchCollapsed: "searchCollapsed",
                                searchClearFloat: "searchClearFloat"
                            };
                            this._allIndex = "all";
                            this._objectIdIdentifier = "_objectId";
                            this._deferreds = [];
                            this._sourceNames = [];
                            this.defaultSource = {
                                locator: new Z("//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"),
                                singleLineFieldName: "SingleLine",
                                outFields: ["Addr_type",
                                    "Match_addr", "StAddr", "City"
                                ],
                                name: t.widgets.Search.main.esriLocatorName,
                                localSearchOptions: {
                                    minScale: 3E5,
                                    distance: 5E4
                                },
                                placeholder: t.widgets.Search.main.placeholder,
                                highlightSymbol: (new V(z.toUrl("./Search/images/search-pointer.png"), 36, 36)).setOffset(9, 18)
                            };
                            this.options = {
                                map: null,
                                theme: "arcgisSearch",
                                visible: !0,
                                value: "",
                                allPlaceholder: "",
                                sources: [this.defaultSource],
                                activeSourceIndex: 0,
                                suggestionDelay: 150,
                                enableSourcesMenu: !0,
                                enableSuggestionsMenu: !0,
                                enableInfoWindow: !0,
                                showInfoWindowOnSelect: !0,
                                enableSuggestions: !0,
                                enableButtonMode: !1,
                                autoNavigate: !0,
                                autoSelect: !0,
                                addLayersFromMap: !1,
                                zoomScale: 1E3,
                                graphicsLayer: null,
                                enableHighlight: !0,
                                highlightGraphic: null,
                                enableLabel: !1,
                                labelSymbol: (new Y).setColor(new aa([181, 56, 46, .9])).setFont(new L("14px", L.STYLE_NORMAL, L.VARIANT_NORMAL, L.WEIGHT_BOLD, "Arial")),
                                labelGraphic: null,
                                infoTemplate: new F(t.widgets.Search.main.searchResult, '\x3cdiv class\x3d"${searchTheme}"\x3e\x3cdiv id\x3d"${searchMoreResultsId}" class\x3d"${searchMoreResults}"\x3e\x3cdiv class\x3d"${searchMoreResultsItem}"\x3e${searchResult}\x3c/div\x3e\x3cdiv\x3e${searchMoreResultsHtml}\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e'),
                                searchResults: null,
                                suggestResults: null,
                                selectedResult: null,
                                magicKey: null,
                                selectedFeatureId: null,
                                expanded: !1,
                                maxLength: 128,
                                maxResults: 6,
                                maxSuggestions: 6,
                                locationToAddressDistance: 1500,
                                minCharacters: 1,
                                enableSearchingAll: !0
                            };
                            a = k.mixin({}, this.options, a);
                            this.set(a);
                            this._updateActiveSource();
                            this._i18n = t;
                            this._defaultSR = new U(4326);
                            this.domNode = b
                        },
                        startup: function() {
                            this.inherited(arguments);
                            this.sources || (this.sources = []);
                            this._mapLoaded().then(k.hitch(this, this._init))
                        },
                        postCreate: function() {
                            var a =
                                this;
                            this.inherited(arguments);
                            this._moreResultsId = this.id + "_more_results";
                            this.own(w(this.submitNode, e, k.hitch(this, this._searchButton)));
                            this.own(w(this.sourcesBtnNode, e, k.hitch(this, this._toggleSourcesMenu)));
                            this.own(w(this.inputNode, e, k.hitch(this, this._inputClick)));
                            this.own(w(this.clearNode, e, k.hitch(this, this._clearButton)));
                            this.own(w(this.formNode, "submit", k.hitch(this, function(a) {
                                a.preventDefault();
                                this._cancelSuggest();
                                this.search()
                            })));
                            this.own(w(this.inputNode, "keyup", k.hitch(this, function(a) {
                                this._inputKey(a)
                            })));
                            this.own(w(this.sourcesBtnNode, "keyup", k.hitch(this, function(a) {
                                this._sourceBtnKey(a)
                            })));
                            this.own(w(this.suggestionsNode, "li:click, li:keyup", function(b) {
                                a._suggestionsEvent(b, this)
                            }));
                            this.own(w(this.sourcesNode, "li:click, li:keyup", function(b) {
                                a._sourcesEvent(b, this)
                            }));
                            this.own(w(this.inputNode, "input, paste", k.hitch(this, function() {
                                this._suggestDelay()
                            })));
                            this.map && this.map.infoWindow && this.map.infoWindow.domNode && this.enableInfoWindow && (this.own(w(this.map.infoWindow.domNode, "#" + this._moreResultsId +
                                "_show:click", k.hitch(this, function(a) {
                                    this._showMoreResultsClick(a)
                                }))), this.own(w(this.map.infoWindow.domNode, "#" + this._moreResultsId + "_list li a:click", k.hitch(this, function(a) {
                                this._moreResultsClick(a)
                            }))), this.own(w(this.map.infoWindow.domNode, "#" + this._moreResultsId + " [data-switch-coordinates]:click", k.hitch(this, function(a) {
                                this._switchCoordinatesClick(a)
                            }))));
                            this.value && this._checkStatus();
                            this._hideMenus();
                            this._updateVisible();
                            this._insertSources(this.sources);
                            this._setPlaceholder(this.activeSourceIndex);
                            this._updateButtonMode(this.enableButtonMode);
                            this.toggle(this.expanded)
                        },
                        destroy: function() {
                            this.clear();
                            y.empty(this.domNode);
                            this.inherited(arguments)
                        },
                        clear: function() {
                            this.clearGraphics();
                            v.get(this.inputNode, "value") && v.set(this.inputNode, "value", "");
                            this._changeAttrValue("value", "");
                            this.set("searchResults", null);
                            this.set("suggestResults", null);
                            this.set("selectedResult", null);
                            this.set("magicKey", null);
                            this.set("selectedFeatureId", null);
                            m.remove(this.containerNode, this.css.hasValue);
                            v.set(this.clearNode,
                                "title", "");
                            this._hideMenus();
                            this._closePopup();
                            this._hideLoading();
                            this.emit("clear-search")
                        },
                        show: function() {
                            I.set(this.domNode, "display", "block")
                        },
                        hide: function() {
                            I.set(this.domNode, "display", "none")
                        },
                        expand: function() {
                            this.enableButtonMode && (m.add(this.containerNode, this.css.searchExpanded), m.remove(this.containerNode, this.css.searchCollapsed), this._hideMenus(), this.set("expanded", !0))
                        },
                        collapse: function() {
                            this.enableButtonMode && (m.remove(this.containerNode, this.css.searchExpanded), m.add(this.containerNode,
                                this.css.searchCollapsed), this._hideMenus(), this.set("expanded", !1))
                        },
                        toggle: function(a) {
                            this.enableButtonMode && ("undefined" === typeof a && (a = !this.expanded), a ? this.expand() : this.collapse())
                        },
                        search: function(a) {
                            var b = new x;
                            this._mapLoaded().then(k.hitch(this, function() {
                                this._searchDeferred(a).then(k.hitch(this, function(a) {
                                    var d = a.results;
                                    this.set("searchResults", d);
                                    0 === a.numResults && (this._noResults(a.value), this._showNoResultsMenu());
                                    this._hideLoading();
                                    this.emit("search-results", a);
                                    this._selectFirstResult(d,
                                        a.activeSourceIndex);
                                    b.resolve(d)
                                }), k.hitch(this, function(a) {
                                    b.reject(a)
                                }))
                            }));
                            return b.promise
                        },
                        suggest: function(a) {
                            var b = new x;
                            this._mapLoaded().then(k.hitch(this, function() {
                                this._suggestDeferred(a).then(k.hitch(this, function(a) {
                                    if (a) {
                                        var d = a.results;
                                        this.set("suggestResults", d);
                                        this._insertSuggestions(d, a.value);
                                        this.emit("suggest-results", a);
                                        b.resolve(d)
                                    }
                                }), k.hitch(this, function(a) {
                                    b.reject(a)
                                }))
                            }));
                            return b.promise
                        },
                        select: function(a) {
                            var b = this._getDefaultSymbol(a),
                                f = this.labelSymbol,
                                d, l = this.sources,
                                e = this.activeSourceIndex,
                                g = this.enableHighlight,
                                c = this.enableLabel,
                                n = this.autoNavigate,
                                m = this.showInfoWindowOnSelect,
                                h = this.enableInfoWindow,
                                r = this.infoTemplate,
                                v = a.feature ? new H(a.feature.toJson()) : null,
                                p = v ? a.feature._sourceLayer : null;
                            M(v, p);
                            if (e === this._allIndex) {
                                var t = this._getSourceIndexOfResult(a);
                                null !== t && (d = l[t], e = t)
                            } else d = l[e];
                            d && (d.hasOwnProperty("highlightSymbol") && (b = d.highlightSymbol), d.hasOwnProperty("labelSymbol") && (f = d.labelSymbol), d.hasOwnProperty("enableHighlight") && (g = d.enableHighlight),
                                d.hasOwnProperty("enableLabel") && (c = d.enableLabel), d.hasOwnProperty("autoNavigate") && (n = d.autoNavigate), d.hasOwnProperty("showInfoWindowOnSelect") && (m = d.showInfoWindowOnSelect), d.hasOwnProperty("enableInfoWindow") && (h = d.enableInfoWindow), d.hasOwnProperty("infoTemplate") ? r = d.infoTemplate : d.featureLayer && d.featureLayer.infoTemplate && (r = d.featureLayer.infoTemplate));
                            this._hideMenus();
                            this._hideLoading();
                            if (v) {
                                var l = this.highlightGraphic,
                                    C = this.graphicsLayer,
                                    t = this.labelGraphic,
                                    q = k.mixin({}, v.attributes, {
                                        searchTheme: this.theme,
                                        searchResult: this._searchResultHTML(a),
                                        searchMoreResults: this.css.searchMoreResults,
                                        searchMoreResultsItem: this.css.searchMoreResultsItem,
                                        searchMoreResultsId: this._moreResultsId,
                                        searchMoreResultsHtml: this._moreResultsHTML(a)
                                    }),
                                    F = null;
                                h && (F = r);
                                t ? (t.setGeometry(v.geometry), t.setAttributes(q), t.setSymbol(f), f && "textsymbol" === f.type && t.symbol.setText(a.name)) : (t = new H(v.geometry, f, q), M(t, p), f && "textsymbol" === f.type && t.symbol.setText(a.name), c && (C ? C.add(t) : this.map && this.map.graphics &&
                                    this.map.graphics.add(t)));
                                l ? (l.setGeometry(v.geometry), l.setAttributes(q), l.setInfoTemplate(F), l.setSymbol(b)) : (l = new H(v.geometry, b, q, F), M(l, p), g && (C ? C.add(l) : this.map && this.map.graphics && this.map.graphics.add(l)));
                                l && l.symbol && "textsymbol" === l.symbol.type && l.symbol.setText(a.name);
                                this.map && this.map.infoWindow && h && m && (this.map.infoWindow.setFeatures([l]), b = this._getPointFromGeometry(l.geometry), this.map.infoWindow.show(b));
                                this.map && n && a && a.hasOwnProperty("extent") && "function" === typeof this.map.setExtent &&
                                    this.map.setExtent(a.extent, !0);
                                this.set("highlightGraphic", l);
                                this.set("labelGraphic", t)
                            }
                            this.set("selectedResult", a);
                            this.emit("select-result", {
                                result: a,
                                source: d,
                                sourceIndex: e
                            })
                        },
                        focus: function() {
                            n.focus(this.inputNode)
                        },
                        blur: function() {
                            this.inputNode.blur();
                            n.curNode && n.curNode.blur()
                        },
                        clearGraphics: function() {
                            var a = this.highlightGraphic,
                                b = this.graphicsLayer,
                                f = this.labelGraphic;
                            a && (b ? b.remove(a) : this.map && this.map.graphics && this.map.graphics.remove(a));
                            f && (b ? b.remove(f) : this.map && this.map.graphics &&
                                this.map.graphics.remove(f));
                            this.set("labelGraphic", null);
                            this.set("highlightGraphic", null)
                        },
                        _mapLoaded: function() {
                            var a = new x;
                            if (this.map)
                                if (this.map.loaded) a.resolve();
                                else w.once(this.map, "load", k.hitch(this, function() {
                                    a.resolve()
                                }));
                            else a.resolve();
                            return a.promise
                        },
                        _init: function() {
                            this._getMapLayers().then(k.hitch(this, function() {
                                this.set("loaded", !0);
                                this.emit("load")
                            }))
                        },
                        _clearButton: function() {
                            this.clear();
                            n.focus(this.inputNode)
                        },
                        _error: function(a) {
                            return Error(this.declaredClass + " " +
                                a)
                        },
                        _searchDeferred: function(a) {
                            var b = new x,
                                f = this.value,
                                d = this.activeSourceIndex;
                            a && a.hasOwnProperty("index") && (d = a.index);
                            this._showLoading();
                            this._hideMenus();
                            this._closePopup();
                            this.clearGraphics();
                            var l = {
                                magicKey: this.magicKey,
                                text: f
                            };
                            a ? "string" === typeof a ? (l.text = a, a = this._searchQueries(l)) : a = "object" === typeof a && a.hasOwnProperty("magicKey") ? this._searchQueries(a) : "object" === typeof a && a.hasOwnProperty("geometry") ? this._searchQueries({
                                    geometry: a
                                }) : "object" === typeof a && a.hasOwnProperty(this._objectIdIdentifier) ?
                                this._searchQueries(a) : "object" === typeof a && "point" === a.type ? this._searchQueries({
                                    point: a
                                }) : a instanceof Array && 2 === a.length ? this._searchQueries({
                                    latlon: a
                                }) : this._searchQueries(l) : a = this._searchQueries(l);
                            a.always(k.hitch(this, function(a) {
                                a = this._formatResults(a, d, f);
                                b.resolve(a)
                            }));
                            return b.promise
                        },
                        _suggestDeferred: function(a) {
                            var b = new x;
                            this._deferreds.push(b);
                            a || (a = this.value);
                            var f = this.activeSourceIndex;
                            this._suggestQueries({
                                text: a
                            }).always(k.hitch(this, function(d) {
                                var l;
                                if (d)
                                    for (var e = 0; e <
                                        d.length; e++) d[e] && (l = !0);
                                l ? (d = this._formatResults(d, f, a), b.resolve(d)) : b.resolve()
                            }));
                            return b.promise
                        },
                        _getDefaultSymbol: function(a) {
                            var b, f, d, l;
                            this.map && (l = this.map.getBasemap());
                            l || (l = "topo");
                            a && a.feature && a.feature.geometry && (d = a.feature.geometry.type);
                            "polyline" === d ? d = "line" : "circle" === d || "extent" === d ? d = "polygon" : "multipoint" === d && (d = "point");
                            if (d) {
                                if (a = ba.getSchemes({
                                        theme: "default",
                                        basemap: l,
                                        geometryType: d
                                    })) f = a.primaryScheme;
                                if (f) {
                                    f.color && f.hasOwnProperty("opacity") && (f.color.a = f.opacity);
                                    b = f;
                                    a = f.color;
                                    f = f.size;
                                    var e;
                                    switch (d) {
                                        case "point":
                                            e = new W;
                                            e.setColor(a);
                                            e.setSize(null !== f ? f : b.size);
                                            d = new O;
                                            d.setColor(b.outline.color);
                                            d.setWidth(b.outline.width);
                                            e.setOutline(d);
                                            break;
                                        case "line":
                                            e = new O;
                                            e.setColor(a);
                                            e.setWidth(null !== f ? f : b.width);
                                            break;
                                        case "polygon":
                                            e = new X, e.setColor(a), d = new O, d.setColor(b.outline.color), d.setWidth(b.outline.width), e.setOutline(d)
                                    }
                                    b = e
                                }
                            }
                            return b
                        },
                        _selectFirstResult: function(a, b) {
                            if (this.autoSelect && a) {
                                var f;
                                b === this._allIndex ? f = this._getFirstResult(a) : a[b] &&
                                    a[b][0] && (f = a[b][0]);
                                f && this.select(f)
                            }
                        },
                        _getSourceIndexOfResult: function(a) {
                            var b = this.searchResults;
                            if (b)
                                for (var f in b)
                                    if (b[f] && b[f].length)
                                        for (var d = 0; d < b[f].length; d++)
                                            if (b[f][d] === a) return parseInt(f, 10);
                            return null
                        },
                        _getFirstResult: function(a) {
                            if (a)
                                for (var b in a)
                                    if (a[b] && a[b][0]) return a[b][0];
                            return !1
                        },
                        _onFocus: function() {
                            this.map && "function" === typeof this.map.disableKeyboardNavigation && this.map.disableKeyboardNavigation();
                            this.emit("focus");
                            this.inherited(arguments)
                        },
                        _onBlur: function() {
                            this._hideMenus();
                            this.map && "function" === typeof this.map.enableKeyboardNavigation && this.map.enableKeyboardNavigation();
                            this.enableButtonMode && this.loaded && this.collapse();
                            this.emit("blur");
                            this.inherited(arguments)
                        },
                        _getMapLayers: function() {
                            var a = new x;
                            if (this.addLayersFromMap && this.map) {
                                var b = [],
                                    f = this.map.graphicsLayerIds;
                                if (f && f.length) {
                                    for (var d = 0; d < f.length; d++) {
                                        var l = this.map.getLayer(f[d]);
                                        l && b.push(this._featureLayerLoaded(l))
                                    }
                                    K(b).always(k.hitch(this, function(b) {
                                        for (var d, f = this.sources, l = 0; l < b.length; l++) b[l] &&
                                            b[l].loaded && "Feature Layer" === b[l].type && (f.push({
                                                featureLayer: b[l],
                                                enableSuggestions: !0
                                            }), d = !0);
                                        d && this.set("sources", f);
                                        a.resolve()
                                    }))
                                } else a.resolve()
                            } else a.resolve();
                            return a.promise
                        },
                        _switchCoordinatesClick: function(a) {
                            a.preventDefault();
                            if (a = v.get(a.target, "data-switch-coordinates")) this._cancelSuggest(), this.set("value", a), this.search()
                        },
                        _moreResultsClick: function(a) {
                            a.preventDefault();
                            var b = a.target;
                            a = parseInt(v.get(b, "data-source-index"), 10);
                            var b = parseInt(v.get(b, "data-index"), 10),
                                f = this.searchResults;
                            f && f[a] && (a = f[a][b]) && this.select(a)
                        },
                        _showMoreResultsClick: function(a) {
                            a.preventDefault();
                            if (a = c.byId(this._moreResultsId)) {
                                m.toggle(a, this.css.searchShowMoreResults);
                                var b = c.byId(this._moreResultsId + "_show");
                                b && (m.contains(a, this.css.searchShowMoreResults) ? v.set(b, "textContent", t.widgets.Search.main.hideMoreResults) : v.set(b, "textContent", t.widgets.Search.main.showMoreResults))
                            }
                        },
                        _featureLayerLoaded: function(a) {
                            var b = new x;
                            if (a.loaded) b.resolve(a);
                            else if (a.loadError) b.reject(this._error("Layer failed to load."));
                            else {
                                var f, d;
                                f = w.once(a, "load", k.hitch(this, function() {
                                    d.remove();
                                    b.resolve(a)
                                }));
                                d = w.once(a, "error", k.hitch(this, function() {
                                    f.remove();
                                    b.reject(this._error("Layer could not be loaded."))
                                }))
                            }
                            return b.promise
                        },
                        _getObjectSize: function(a) {
                            var b = 0,
                                f;
                            for (f in a) a.hasOwnProperty(f) && b++;
                            return b
                        },
                        _sourcesEvent: function(a, b) {
                            var f = v.get(b, "data-index"),
                                d = h("li", this.sourcesNode);
                            b = q.indexOf(d, b);
                            f !== this._allIndex && (f = parseInt(f, 10));
                            "click" === a.type || a.keyCode === u.ENTER ? (this.set("activeSourceIndex", f),
                                n.focus(this.inputNode), this._hideSourcesMenu()) : a.keyCode === u.UP_ARROW ? (a.stopPropagation(), a.preventDefault(), a = b - 1, 0 > a ? n.focus(this.sourcesBtnNode) : n.focus(d[a])) : a.keyCode === u.DOWN_ARROW ? (a.stopPropagation(), a.preventDefault(), a = b + 1, a >= d.length ? n.focus(this.sourcesBtnNode) : n.focus(d[a])) : a.keyCode === u.ESCAPE && (this._hideSourcesMenu(), n.focus(this.inputNode))
                        },
                        _suggestionsEvent: function(a, b) {
                            var f = v.get(b, "data-source-index"),
                                d = parseInt(v.get(b, "data-index"), 10),
                                l = h("li", this.suggestionsNode),
                                e = this.sources;
                            b = q.indexOf(l, b);
                            f !== this._allIndex && (f = parseInt(f, 10));
                            var g;
                            this._clearQueryTimeout();
                            "click" === a.type || a.keyCode === u.ENTER ? ((l = this.suggestResults) && l[f] && l[f][d] && (g = l[f][d]), g && (g.index = f, e[f].featureLayer ? (f = e[f].featureLayer.objectIdField, g[this._objectIdIdentifier] = g.feature.attributes[f], this.set("value", this._getSuggestionName(g)), this.set("selectedFeatureId", g.feature.attributes[f])) : g.magicKey && g.text && (this.set("value", g.text), this.set("magicKey", g.magicKey)), this.search(g),
                                n.focus(this.inputNode))) : a.keyCode === u.BACKSPACE || a.keyCode === u.DELETE ? n.focus(this.inputNode) : a.keyCode === u.UP_ARROW ? (a.stopPropagation(), a.preventDefault(), g = b - 1, 0 > g ? n.focus(this.inputNode) : n.focus(l[g])) : a.keyCode === u.DOWN_ARROW ? (a.stopPropagation(), a.preventDefault(), g = b + 1, g >= l.length ? n.focus(this.inputNode) : n.focus(l[g])) : a.keyCode === u.ESCAPE && (this._hideMenus(), n.focus(this.inputNode))
                        },
                        _getResultName: function(a) {
                            var b;
                            a.hasOwnProperty("name") && null !== a.name && (b = a.name.toString());
                            b || (b = t.widgets.Search.main.untitledResult);
                            return b
                        },
                        _getSuggestionName: function(a) {
                            var b;
                            a.hasOwnProperty("name") && null !== a.name && (b = a.name.toString());
                            a = a.text || b;
                            a || (a = t.widgets.Search.main.untitledResult);
                            return a
                        },
                        _searchResultHTML: function(a) {
                            var b = "";
                            if (a.feature && a.feature.attributes && a.feature.attributes.Addr_type && "LatLong" === a.feature.attributes.Addr_type) {
                                var f = a.name.split(" "),
                                    d, l;
                                2 === f.length && (d = f[0], l = f[1]);
                                l && d ? (a = parseFloat(d), l = parseFloat(l), f = l + ", " + a, b += '\x3cdiv class\x3d"' + this.css.searchMoreResultsItem + '"\x3e', b += '\x3cdiv class\x3d"' +
                                    this.css.latLonHeader + '"\x3e' + t.widgets.Search.main.lonlat + "\x3c/div\x3e", b = b + (a + ", " + l) + "\x3c/div\x3e" + ('\x3cdiv class\x3d"' + this.css.searchMoreResultsItem + '"\x3e'), a === l || 90 < a || -90 > a || 180 < l || -180 > l || (b += '\x3cdiv class\x3d"' + this.css.latLonHeader + '"\x3e' + t.widgets.Search.main.reverseLonLatHeader + "\x3c/div\x3e", b = b + ('\x3ca data-switch-coordinates\x3d"' + f + '" tabindex\x3d"0" href\x3d"#"\x3e' + f + "\x3c/a\x3e") + "\x3c/div\x3e")) : b = a.name
                            } else b = a.name;
                            return b
                        },
                        _moreResultsHTML: function(a) {
                            var b = "",
                                f = "",
                                d = this.searchResults,
                                l = this.sources,
                                e = 0;
                            if (d) {
                                var f = f + ('\x3cdiv class\x3d"' + this.css.searchMoreResultsItem + '"\x3e'),
                                    f = f + ('\x3ca href\x3d"#" id\x3d"' + this._moreResultsId + '_show"\x3e' + t.widgets.Search.main.showMoreResults + "\x3c/a\x3e"),
                                    f = f + "\x3c/div\x3e" + ('\x3cdiv class\x3d"' + this.css.searchMoreResultsList + '"\x3e'),
                                    f = f + ('\x3cdiv id\x3d"' + this._moreResultsId + '_list"\x3e'),
                                    g;
                                for (g in d)
                                    if (d[g]) {
                                        var c = d[g].length;
                                        if (c) {
                                            var n = 1 === c && d[g][0] === a;
                                            if (1 < this._getObjectSize(d) && !n) var m = this._getSourceName(g),
                                                f = f + ('\x3cdiv class\x3d"' + this.css.searchMoreResultsListHeader + '"\x3e' + m + "\x3c/div\x3e");
                                            if (c && !n) {
                                                f += "\x3cul\x3e";
                                                m = l[g].maxResults || this.maxResults;
                                                for (n = 0; n < c && n < m; ++n)
                                                    if (d[g][n] !== a) {
                                                        var h = this._getResultName(d[g][n]),
                                                            f = f + ('\x3cli\x3e\x3ca tabindex\x3d"0" data-index\x3d"' + n + '" data-source-index\x3d"' + g + '" href\x3d"#"\x3e' + h + "\x3c/a\x3e\x3c/li\x3e");
                                                        e++
                                                    } f += "\x3c/ul\x3e"
                                            }
                                        }
                                    } f += "\x3c/div\x3e\x3c/div\x3e"
                            }
                            e && (b += f);
                            return b
                        },
                        _validField: function(a, b) {
                            return a.getField(b)
                        },
                        _validFields: function(a, b) {
                            if (a &&
                                b && b.length) {
                                for (var f = 0; f < b.length; f++)
                                    if (!this._validField(a, b[f])) return !1;
                                return !0
                            }
                            return !1
                        },
                        _getCodedName: function(a, b) {
                            if (a && a.length)
                                for (var f = 0, d = a.length; f < d; f++) {
                                    var l = a[f];
                                    if (l.code === b) return l.name
                                }
                        },
                        _getCodedValue: function(a, b, f) {
                            if (a && a.length)
                                for (var d = 0, l = a.length; d < l; d++) {
                                    var e = a[d],
                                        g = e.name,
                                        c = b;
                                    f || (g = g.toLowerCase(), c = c.toLowerCase());
                                    if (g === c) return e.code
                                }
                            return !1
                        },
                        _whereClause: function(a, b, f, d) {
                            var l = null;
                            if (a) {
                                var e = "";
                                this.reHostedFS.test(b.url) && this._containsNonLatinCharacter(a) &&
                                    (e = "N");
                                if (f && f.length)
                                    for (var g = 0, c = f.length; g < c; g++) {
                                        var n = "",
                                            m = a.replace(/\'/g, "''"),
                                            n = f[g],
                                            h = b.getField(n),
                                            r = b.getDomain(n);
                                        r && "codedValue" === r.type && (m = this._getCodedValue(r.codedValues, m, d));
                                        !1 !== m && (h = h.type, "esriFieldTypeString" === h || "esriFieldTypeDate" === h ? n = d ? n + " \x3d " + e + "'" + m + "'" : "UPPER(" + n + ") LIKE " + e + "'%" + m.toUpperCase() + "%'" : "esriFieldTypeOID" === h || "esriFieldTypeSmallInteger" === h || "esriFieldTypeInteger" === h || "esriFieldTypeSingle" === h || "esriFieldTypeDouble" === h ? (m = parseFloat(m), n = isNaN(m) ?
                                            !1 : n + " \x3d " + m) : n = n + " \x3d " + m, n && (l = l ? l + " or " : "", l += n))
                                    }
                            }
                            return l
                        },
                        _suggest: function(a) {
                            a || (a = {
                                index: this.activeSourceIndex,
                                text: this.value
                            });
                            var b = new x,
                                f = a.index,
                                d = this.sources[f],
                                l = this.enableSuggestions;
                            d.hasOwnProperty("enableSuggestions") && (l = d.enableSuggestions);
                            var e = 0,
                                g;
                            a.hasOwnProperty("text") && a.text && (g = k.trim(a.text), e = a.text.length);
                            a = d.minCharacters || this.minCharacters;
                            if (l && g && e >= a && this._supportsPagination(d)) {
                                var c = "";
                                d.prefix && (c += d.prefix);
                                c += g;
                                d.suffix && (c += d.suffix);
                                var n =
                                    this._defaultSR;
                                this.map && (n = this.map.spatialReference);
                                l = {};
                                d.locator ? (d.categories && (l.categories = d.categories), d.locator.outSpatialReference = n, this.map && d.localSearchOptions && d.localSearchOptions.hasOwnProperty("distance") && d.localSearchOptions.hasOwnProperty("minScale") && (e = this._getScale(), !d.localSearchOptions.minScale || e && e <= parseFloat(d.localSearchOptions.minScale)) && (l.location = this.map.extent.getCenter(), l.distance = d.localSearchOptions.distance), l.text = c, d.useMapExtent && this.map && this.map.extent &&
                                        (l.searchExtent = this.map.extent), d.searchExtent && (l.searchExtent = d.searchExtent), l.maxSuggestions = d.maxSuggestions || this.maxSuggestions, d.sourceCountry && (l.countryCode = d.sourceCountry), d.countryCode && (l.countryCode = d.countryCode), d.locator.suggestLocations(l).then(k.hitch(this, function(a) {
                                            b.resolve(a)
                                        }), k.hitch(this, function(a) {
                                            a || (a = this._error("Locator suggestLocations could not be performed."));
                                            b.reject(a)
                                        }))) : d.featureLayer ? this._featureLayerLoaded(d.featureLayer).then(k.hitch(this, function() {
                                        var a =
                                            this._getDisplayField(d),
                                            l = d.searchFields || [a],
                                            e = [];
                                        d.suggestionTemplate ? d.suggestionTemplate.replace(/(?:\$\{([^}]+)\})/g, function(a, b) {
                                            e.push(b)
                                        }) : e = [a]; - 1 === q.indexOf(e, d.featureLayer.objectIdField) && e.push(d.featureLayer.objectIdField);
                                        var a = this._validField(d.featureLayer, a),
                                            g = this._validFields(d.featureLayer, e),
                                            m = this._validFields(d.featureLayer, l);
                                        if (a && g && m) {
                                            a = new T;
                                            d.hasOwnProperty("suggestQueryParams") && k.mixin(a, d.suggestQueryParams);
                                            a.outSpatialReference = n;
                                            a.returnGeometry = !1;
                                            a.num = d.maxSuggestions ||
                                                this.maxSuggestions;
                                            a.outFields = e;
                                            d.useMapExtent && this.map && this.map.extent && (a.geometry = this.map.extent);
                                            d.searchExtent && (a.geometry = d.searchExtent);
                                            var h;
                                            if (l = this._whereClause(c, d.featureLayer, l, !1)) a.where = l, h = !0;
                                            h ? d.featureLayer.queryFeatures(a, k.hitch(this, function(a) {
                                                var d;
                                                (a = a.features) && (d = this._hydrateResults(a, f, !0));
                                                b.resolve(d)
                                            }), k.hitch(this, function(a) {
                                                a || (a = this._error("FeatureLayer queryFeatures errored with suggestions"));
                                                b.reject(a)
                                            })) : b.resolve()
                                        } else b.reject(this._error("Invalid FeatureLayer field"))
                                    })) :
                                    b.reject(this._error("Invalid source"))
                            } else b.resolve();
                            return b.promise
                        },
                        _supportsPagination: function(a) {
                            var b;
                            a.locator ? b = !0 : a.featureLayer && a.featureLayer.advancedQueryCapabilities && a.featureLayer.advancedQueryCapabilities.supportsPagination && (b = !0);
                            return b
                        },
                        _suggestQueries: function(a) {
                            var b = this.sources,
                                f = this.activeSourceIndex,
                                d = [],
                                l;
                            if (f === this._allIndex)
                                for (f = 0; f < b.length; f++) l = a, l.index = f, l = this._suggest(l), d.push(l);
                            else a.index = f, l = this._suggest(a), d.push(l);
                            return K(d)
                        },
                        _getPointFromGeometry: function(a) {
                            var b;
                            switch (a.type) {
                                case "extent":
                                    b = a.getCenter();
                                    break;
                                case "multipoint":
                                    b = a.getPoint(0);
                                    break;
                                case "point":
                                    b = a;
                                    break;
                                case "polygon":
                                    b = a.getCentroid();
                                    break;
                                case "polyline":
                                    b = a.getPoint(0, 0)
                            }
                            return b
                        },
                        _searchQueries: function(a) {
                            a.hasOwnProperty("index") || (a.index = this.activeSourceIndex);
                            var b = [],
                                f;
                            if (a.index === this._allIndex)
                                for (var d = this.sources, l = 0; l < d.length; l++) f = a, f.index = l, f = this._search(f), b.push(f);
                            else a = this._search(a), b.push(a);
                            return K(b)
                        },
                        _searchButton: function() {
                            this.enableButtonMode &&
                                !this.expanded ? (this.expand(), n.focus(this.inputNode)) : (this._cancelSuggest(), this.search())
                        },
                        _search: function(a) {
                            a || (a = {
                                text: this.value,
                                magicKey: null,
                                geometry: null,
                                point: null,
                                index: this.activeSourceIndex,
                                latlon: null
                            });
                            this.selectedFeatureId && (a.text = null, a[this._objectIdIdentifier] = this.selectedFeatureId);
                            var b, f = new x,
                                d = a.index,
                                l = this.sources[d],
                                e;
                            a.hasOwnProperty("text") && a.text && (e = k.trim(a.text));
                            if (l) {
                                var g = "";
                                l.prefix && !a.magicKey && (g += l.prefix);
                                g += e;
                                l.suffix && !a.magicKey && (g += l.suffix);
                                var c =
                                    this._defaultSR;
                                this.map && (c = this.map.spatialReference);
                                if (l.locator)
                                    if (a.hasOwnProperty("text") && e) {
                                        var n = {};
                                        l.categories && (n.categories = l.categories);
                                        c && (l.locator.outSpatialReference = c);
                                        if (this.map && l.localSearchOptions && l.localSearchOptions.hasOwnProperty("distance") && l.localSearchOptions.hasOwnProperty("minScale")) {
                                            var m = this._getScale();
                                            if (!l.localSearchOptions.minScale || m && m <= parseFloat(l.localSearchOptions.minScale)) n.location = this.map.extent.getCenter(), n.distance = l.localSearchOptions.distance
                                        }
                                        n.address = {};
                                        n.maxLocations = l.maxResults || this.maxResults;
                                        l.useMapExtent && this.map && this.map.extent && (n.searchExtent = this.map.extent);
                                        l.searchExtent && (n.searchExtent = l.searchExtent);
                                        l.sourceCountry && (n.countryCode = l.sourceCountry);
                                        l.countryCode && (n.countryCode = l.countryCode);
                                        a.magicKey && (n.magicKey = a.magicKey);
                                        l.singleLineFieldName ? n.address[l.singleLineFieldName] = g : n.address["Single Line Input"] = g;
                                        l.outFields && (n.outFields = l.outFields);
                                        l.locator.addressToLocations(n).then(k.hitch(this, function(a) {
                                            a = this._hydrateResults(a,
                                                d, !1);
                                            f.resolve(a)
                                        }), k.hitch(this, function(a) {
                                            a || (a = this._error("Locator addressToLocations could not be performed"));
                                            f.reject(a)
                                        }))
                                    } else a.geometry ? (b = this._getPointFromGeometry(a.geometry.geometry)) ? this._reverseGeocodePoint(d, b).then(function(a) {
                                        f.resolve(a)
                                    }, function(a) {
                                        f.reject(a)
                                    }) : f.reject(this._error("Invalid point to reverse geocode")) : a.point ? this._reverseGeocodePoint(d, a.point).then(function(a) {
                                        f.resolve(a)
                                    }, function(a) {
                                        f.reject(a)
                                    }) : a.latlon ? (n = new P(a.latlon, this._defaultSR), this._reverseGeocodePoint(d,
                                        n).then(function(a) {
                                        f.resolve(a)
                                    }, function(a) {
                                        f.reject(a)
                                    })) : a.hasOwnProperty("text") && !e ? f.resolve([]) : f.reject(this._error("Invalid query type for Locator"));
                                else l.featureLayer ? this._featureLayerLoaded(l.featureLayer).then(k.hitch(this, function() {
                                    var n = this._getDisplayField(l),
                                        m = l.searchFields || [n],
                                        n = this._validField(l.featureLayer, n),
                                        h = this._validFields(l.featureLayer, m);
                                    if (n && h) {
                                        n = new T;
                                        l.hasOwnProperty("searchQueryParams") && k.mixin(n, l.searchQueryParams);
                                        c && (n.outSpatialReference = c, h = this.map &&
                                            this.map.getMaxResolution() || 1 / S.getUnitValueForSR(c)) && (n.maxAllowableOffset = h);
                                        n.returnGeometry = !0;
                                        l.outFields && (n.outFields = l.outFields);
                                        var r;
                                        a.hasOwnProperty(this._objectIdIdentifier) || (this._supportsPagination(l) && (n.num = l.maxResults || this.maxResults), l.useMapExtent && this.map && this.map.extent && (n.geometry = this.map.extent), l.searchExtent && (n.geometry = l.searchExtent), r = l.exactMatch);
                                        a.hasOwnProperty("text") && e ? (m = this._whereClause(g, l.featureLayer, m, r)) ? (n.where = m, m = !0) : m = !1 : a.hasOwnProperty(this._objectIdIdentifier) ?
                                            (n.objectIds = [a[this._objectIdIdentifier]], m = !0) : a.geometry ? (n.geometry = a.geometry, m = !0) : a.point ? (n.geometry = a.point, m = !0) : a.latlon ? (b = new P(a.latlon, this._defaultSR), n.geometry = b, m = !0) : (a.hasOwnProperty("text") && !e ? f.resolve([]) : f.reject(this._error("Invalid query type for FeatureLayer")), m = !1);
                                        m ? l.featureLayer.queryFeatures(n, k.hitch(this, function(a) {
                                            a = a.features;
                                            var b;
                                            a && (b = this._hydrateResults(a, d, !1));
                                            f.resolve(b)
                                        }), k.hitch(this, function(a) {
                                            a || (a = this._error("FeatureLayer queryFeatures could not be performed"));
                                            f.reject(a)
                                        })) : f.resolve()
                                    } else f.reject(this._error("Invalid FeatureLayer field"))
                                })) : f.reject(this._error("Invalid source"))
                            } else f.reject(this._error("Source is undefined"));
                            return f.promise
                        },
                        _clearQueryTimeout: function() {
                            this._queryTimer && clearTimeout(this._queryTimer)
                        },
                        _formatResults: function(a, b, f) {
                            f = {
                                activeSourceIndex: b,
                                value: f,
                                numResults: 0,
                                numErrors: 0,
                                errors: null,
                                results: null
                            };
                            var d = {},
                                l = {};
                            if (a)
                                if (b === this._allIndex)
                                    for (b = 0; b < a.length; b++) a[b] && (a[b] instanceof Error ? (d[b] = a[b], f.numErrors++) :
                                        (l[b] = a[b], f.numResults += a[b].length));
                                else a[0] && (a[0] instanceof Error ? (d[b] = a[0], f.numErrors++) : (l[b] = a[0], f.numResults += a[0].length));
                            f.numErrors && (f.errors = d);
                            f.numResults && (f.results = l);
                            return f
                        },
                        _reverseGeocodePoint: function(a, b) {
                            var f = new x,
                                d = this.sources[a];
                            if (b && d) {
                                var l = d.locationToAddressDistance || this.locationToAddressDistance;
                                d.locator.outSpatialReference = this._defaultSR;
                                this.map && (d.locator.outSpatialReference = this.map.spatialReference);
                                d.locator.locationToAddress(b, l, k.hitch(this, function(b) {
                                    b =
                                        this._hydrateResults([b], a, !1);
                                    f.resolve(b)
                                }), k.hitch(this, function(a) {
                                    a || (a = this._error("Locator locationToAddress could not be performed"));
                                    f.reject(a)
                                }))
                            } else f.reject(this._error("No point or source defined for reverse geocoding"));
                            return f.promise
                        },
                        _cancelDeferreds: function() {
                            if (this._deferreds && this._deferreds.length)
                                for (var a = 0; a < this._deferreds.length; a++) this._deferreds[a].cancel(this.declaredClass + " cancelling request");
                            this._deferreds = []
                        },
                        _sourceBtnKey: function(a) {
                            if (a) {
                                var b = h("li", this.sourcesNode);
                                a.keyCode === u.UP_ARROW ? (a.stopPropagation(), a.preventDefault(), this._showSourcesMenu(), (a = b.length) && n.focus(b[a - 1])) : a.keyCode === u.DOWN_ARROW && (a.stopPropagation(), a.preventDefault(), this._showSourcesMenu(), b[0] && n.focus(b[0]))
                            }
                        },
                        _inputKey: function(a) {
                            if (a) {
                                var b = h("li", this.suggestionsNode),
                                    f = this.suggestResults;
                                if (a.keyCode === u.TAB || a.keyCode === u.ESCAPE) this._cancelSuggest(), this._hideMenus();
                                else if (a.keyCode === u.UP_ARROW) a.stopPropagation(), a.preventDefault(), this._cancelSuggest(), f && this._showSuggestionsMenu(),
                                    (a = b.length) && n.focus(b[a - 1]);
                                else if (a.keyCode === u.DOWN_ARROW) a.stopPropagation(), a.preventDefault(), this._cancelSuggest(), f && this._showSuggestionsMenu(), b[0] && n.focus(b[0]);
                                else {
                                    if (a.ctrlKey || a.metaKey || a.keyCode === u.copyKey || a.keyCode === u.LEFT_ARROW || a.keyCode === u.RIGHT_ARROW || a.keyCode === u.ENTER) return a;
                                    this._suggestDelay()
                                }
                            }
                        },
                        _cancelSuggest: function() {
                            this._cancelDeferreds();
                            this._clearQueryTimeout()
                        },
                        _suggestDelay: function() {
                            this._cancelSuggest();
                            this._changeValue();
                            this._queryTimer = setTimeout(k.hitch(this,
                                function() {
                                    this.suggest()
                                }), this.suggestionDelay)
                        },
                        _changeValue: function() {
                            this.set("magicKey", null);
                            this.set("selectedFeatureId", null);
                            this._changeAttrValue("value", this.inputNode.value);
                            this._checkStatus()
                        },
                        _inputClick: function() {
                            this._hideSourcesMenu();
                            this._hideNoResultsMenu()
                        },
                        _getSourceName: function(a) {
                            return this._sourceNames[a]
                        },
                        _loadSources: function(a) {
                            a = q.filter(a, function(a) {
                                return !!a.featureLayer
                            });
                            a = q.map(a, function(a) {
                                return this._featureLayerLoaded(a.featureLayer)
                            }, this);
                            return K(a)
                        },
                        _createSourceNameMap: function(a) {
                            return this._loadSources(a).then(k.hitch(this, function() {
                                var b = q.map(a, function(a) {
                                    return a.name || a.featureLayer && a.featureLayer.name || t.widgets.Search.main.untitledSource
                                });
                                this._preventDuplicateSourceNames(a, b);
                                return b
                            }))
                        },
                        _getDuplicateSourceNameIndexes: function(a) {
                            var b = {},
                                f = [];
                            q.forEach(a, function(d, l) {
                                b.hasOwnProperty(d) ? (-1 === f.indexOf(b[d]) && f.push(b[d]), f.push(l)) : a.lastIndexOf(d) !== l && (b[d] = l)
                            });
                            return f
                        },
                        _preventDuplicateSourceNames: function(a, b) {
                            if (b &&
                                1 < b.length) {
                                var f = this._getDuplicateSourceNameIndexes(b);
                                q.forEach(f, function(d) {
                                    b[d] += this._getFieldsString(a[d])
                                }, this)
                            }
                        },
                        _getFieldsString: function(a) {
                            var b = "",
                                f = a.featureLayer;
                            if (f) {
                                a = a.searchFields || [this._getDisplayField(a)];
                                for (var d = 0; d < a.length; d++) var b = 0 === d ? b + ": " : b + ", ",
                                    l = a[d],
                                    e = f.getFieldLabel(l),
                                    b = b + (e || l)
                            }
                            return b
                        },
                        _splitResult: function(a, b) {
                            b = r.escapeString(b);
                            return a.replace(new RegExp("(^|)(" + b + ")(|$)", "ig"), "$1|$2|$3").split("|")
                        },
                        _insertSuggestions: function(a, b) {
                            if (this.enableSuggestionsMenu &&
                                this.suggestionsNode) {
                                this._hideSourcesMenu();
                                this._hideNoResultsMenu();
                                var f, d = this.sources;
                                if (a) {
                                    f = y.create("div");
                                    for (var l in a)
                                        if (a[l] && a[l].length) {
                                            var e = this._getSourceName(l);
                                            1 < d.length && this.activeSourceIndex === this._allIndex && y.create("div", {
                                                className: this.css.searchMenuHeader,
                                                textContent: e
                                            }, f);
                                            for (var e = y.create("ul", {
                                                    role: "menu"
                                                }, f), g = d[l].maxSuggestions || this.maxSuggestions, n = 0; n < a[l].length && n < g; ++n)
                                                for (var c = y.create("li", {
                                                            "data-index": n,
                                                            "data-source-index": l,
                                                            role: "menuitem",
                                                            tabindex: 0
                                                        },
                                                        e), m = this._getSuggestionName(a[l][n]), m = this._splitResult(m, b), h = m.length, r = 0; r < h; r++) {
                                                    var v = m[r];
                                                    v.toLowerCase() === b.toLowerCase() ? y.create("strong", {
                                                        textContent: v
                                                    }, c) : (v = document.createTextNode(v), y.place(v, c))
                                                }
                                        }
                                }
                                f ? (y.place(f, this.suggestionsNode, "only"), this._showSuggestionsMenu()) : (y.empty(this.suggestionsNode), this._hideSuggestionsMenu())
                            }
                        },
                        _insertSources: function(a) {
                            if (this.enableSourcesMenu && a && 1 < a.length) {
                                var b, f, d = this.activeSourceIndex,
                                    e = y.create("ul", {
                                        role: "menu"
                                    });
                                this.enableSearchingAll &&
                                    (b = "", d === this._allIndex && (b = "active"), y.create("li", {
                                        "data-index": this._allIndex,
                                        role: "menuitem",
                                        className: b,
                                        tabIndex: 0,
                                        textContent: t.widgets.Search.main.all
                                    }, e));
                                for (f = 0; f < a.length; f++) {
                                    b = "";
                                    f === d && (b = this.css.activeSource);
                                    var g = this._getSourceName(f);
                                    y.create("li", {
                                        "data-index": f,
                                        role: "menuitem",
                                        className: b,
                                        tabIndex: 0,
                                        textContent: g
                                    }, e)
                                }
                                m.add(this.containerNode, this.css.hasMultipleSources);
                                y.place(e, this.sourcesNode, "only")
                            } else m.remove(this.containerNode, this.css.hasMultipleSources), y.empty(this.sourcesNode)
                        },
                        _showLoading: function() {
                            m.add(this.containerNode, this.css.searchLoading)
                        },
                        _hideLoading: function() {
                            m.remove(this.containerNode, this.css.searchLoading)
                        },
                        _checkStatus: function() {
                            this.value ? (m.add(this.containerNode, this.css.hasValue), v.set(this.clearNode, "title", t.widgets.Search.main.clearButtonTitle)) : this.clear()
                        },
                        _closePopup: function() {
                            this.enableInfoWindow && this.map && this.map.infoWindow && this.map.infoWindow.hide()
                        },
                        _noResults: function(a) {
                            var b;
                            a && (b = k.trim(a));
                            var f = y.create("div", {
                                className: this.css.searchNoResultsBody
                            });
                            a && b ? (y.create("div", {
                                className: this.css.searchNoResultsHeader,
                                textContent: t.widgets.Search.main.noResults
                            }, f), y.create("div", {
                                className: this.css.searchNoResultsText,
                                textContent: C.substitute({
                                    value: '"' + a + '"'
                                }, t.widgets.Search.main.noResultsFound)
                            }, f)) : (a = y.create("div", {}, f), y.create("span", {
                                "aria-hidden": "true",
                                className: this.css.searchNoValueIcon
                            }, a), y.create("span", {
                                className: this.css.searchNoValueText,
                                textContent: t.widgets.Search.main.emptyValue
                            }, a));
                            y.place(f, this.noResultsMenuNode, "only")
                        },
                        _hideMenus: function() {
                            this._hideSourcesMenu();
                            this._hideSuggestionsMenu();
                            this._hideNoResultsMenu()
                        },
                        _hideNoResultsMenu: function() {
                            m.remove(this.containerNode, this.css.showNoResults)
                        },
                        _showNoResultsMenu: function() {
                            this._hideSourcesMenu();
                            this._hideSuggestionsMenu();
                            m.add(this.containerNode, this.css.showNoResults)
                        },
                        _hideSourcesMenu: function() {
                            m.remove(this.containerNode, this.css.showSources)
                        },
                        _hideSuggestionsMenu: function() {
                            m.remove(this.containerNode, this.css.showSuggestions)
                        },
                        _showSourcesMenu: function() {
                            this._hideSuggestionsMenu();
                            this._hideNoResultsMenu();
                            m.add(this.containerNode, this.css.showSources)
                        },
                        _showSuggestionsMenu: function() {
                            this._hideSourcesMenu();
                            this._hideNoResultsMenu();
                            m.add(this.containerNode, this.css.showSuggestions)
                        },
                        _toggleSourcesMenu: function() {
                            this._hideSuggestionsMenu();
                            this._hideNoResultsMenu();
                            m.toggle(this.containerNode, this.css.showSources)
                        },
                        _getFirstStringField: function(a) {
                            if (a && (a = a.fields) && a.length)
                                for (var b = 0; b < a.length; b++) {
                                    var f = a[b];
                                    if ("esriFieldTypeString" === f.type) return f.name
                                }
                            return ""
                        },
                        _getDisplayField: function(a) {
                            return a.displayField || a.featureLayer.displayField || this._getFirstStringField(a.featureLayer)
                        },
                        _validLocation: function(a) {
                            return a && a.x && "NaN" !== a.x && a.y && "NaN" !== a.y
                        },
                        _validExtent: function(a) {
                            return a && a.xmin && "NaN" !== a.xmin && a.ymin && "NaN" !== a.ymin && a.xmax && "NaN" !== a.xmax && a.ymax && "NaN" !== a.ymax
                        },
                        _hydrateResult: function(a, b, f) {
                            var d = {},
                                e = this._defaultSR,
                                g;
                            b = this.sources[b];
                            this.map && (e = this.map.spatialReference);
                            if (a.hasOwnProperty("text") && a.hasOwnProperty("magicKey")) return a;
                            if (a.hasOwnProperty("geometry")) g = new H(a.toJson()), d.feature = g, (g = d.feature.geometry) && g.setSpatialReference(e);
                            else if (a.hasOwnProperty("location") && this._validLocation(a.location)) {
                                var n = new P(a.location.x, a.location.y, e);
                                g = {};
                                a.hasOwnProperty("attributes") && (g = a.attributes);
                                a.hasOwnProperty("score") && (g.score = a.score);
                                d.feature = new H(n, null, g, null)
                            }!d.feature && f && (g = {}, a.hasOwnProperty("attributes") && (g = a.attributes), a.hasOwnProperty("score") && (g.score = a.score), d.feature = new H(null, null, g, null));
                            if (d.feature) {
                                if (a.hasOwnProperty("extent") && this._validExtent(a.extent)) d.extent = new R(a.extent), d.extent.setSpatialReference(e);
                                else if (d.feature && d.feature.geometry) switch (d.feature.geometry.type) {
                                    case "extent":
                                        d.extent = d.feature.geometry;
                                        break;
                                    case "multipoint":
                                        d.extent = Q.getDenormalizedExtent(d.feature.geometry);
                                        break;
                                    case "polygon":
                                        d.extent = Q.getDenormalizedExtent(d.feature.geometry);
                                        break;
                                    case "polyline":
                                        d.extent = Q.getDenormalizedExtent(d.feature.geometry);
                                        break;
                                    case "point":
                                        this.map ? (e = this.zoomScale,
                                            b && b.zoomScale && (e = b.zoomScale), this._getScale() > e ? d.extent = S.getExtentForScale(this.map, e).centerAt(d.feature.geometry) : d.extent = this.map.extent.centerAt(d.feature.geometry)) : d.extent = new R({
                                            xmin: d.feature.geometry.x - .25,
                                            ymin: d.feature.geometry.y - .25,
                                            xmax: d.feature.geometry.x + .25,
                                            ymax: d.feature.geometry.y + .25,
                                            spatialReference: this._defaultSR
                                        })
                                } else d.extent = null;
                                d.name = "";
                                b.featureLayer ? b.suggestionTemplate && f ? d.name = C.substitute(a.attributes, b.suggestionTemplate) : b.searchTemplate ? d.name = C.substitute(a.attributes,
                                        b.searchTemplate) : (g = this._getDisplayField(b), f = b.featureLayer.getField(g), e = b.featureLayer.getDomain(g), g && a.hasOwnProperty("attributes") && a.attributes.hasOwnProperty(g) && (a = a.attributes[g], e && "codedValue" === e.type ? d.name = this._getCodedName(e.codedValues, a) : f && "esriFieldTypeDate" === f.type && !isNaN(a) ? d.name = J.format(new Date(a)) : d.name = a)) : a.address && b.searchTemplate ? d.name = C.substitute(a.address, b.searchTemplate) : a.hasOwnProperty("name") ? d.name = a.name : a.hasOwnProperty("attributes") && "object" === typeof a.attributes &&
                                    a.attributes.Match_addr ? (d.name = a.attributes.Match_addr, a.attributes.Addr_type && "POI" === a.attributes.Addr_type && a.attributes.StAddr && a.attributes.City && (d.name += " - " + a.attributes.StAddr + ", " + a.attributes.City)) : a.hasOwnProperty("address") && "string" === typeof a.address ? d.name = a.address : a.hasOwnProperty("address") && "object" === typeof a.address && a.address.hasOwnProperty("Address") ? a.address.hasOwnProperty("Match_addr") ? d.name = a.address.Match_addr : a.address.hasOwnProperty("Address") && (d.name = a.address.Address) :
                                    d.feature && d.feature.geometry && (d.name = d.feature.geometry.x + "," + d.feature.geometry.y);
                                b.featureLayer && d.feature && M(d.feature, b.featureLayer);
                                return d
                            }
                        },
                        _getScale: function() {
                            var a;
                            this.map && "function" === typeof this.map.getScale && (a = this.map.getScale());
                            return a
                        },
                        _hydrateResults: function(a, b, f, d) {
                            d = [];
                            var e = 0;
                            if (a && a.length)
                                for (e; e < a.length; e++) {
                                    var g = this._hydrateResult(a[e], b, f);
                                    g && d.push(g)
                                }
                            return d
                        },
                        _containsNonLatinCharacter: function(a) {
                            for (var b = 0; b < a.length; b++)
                                if (255 < a.charCodeAt(b)) return !0;
                            return !1
                        },
                        _setPlaceholder: function(a) {
                            var b = "",
                                f = this.sources[a];
                            a === this._allIndex ? b = this.allPlaceholder || t.widgets.Search.main.allPlaceholder : f && f.placeholder && (b = f.placeholder);
                            var d = t.widgets.Search.main.all;
                            f && (d = this._getSourceName(a));
                            v.set(this.sourceNameNode, "textContent", d);
                            v.set(this.inputNode, "placeholder", b);
                            v.set(this.inputNode, "title", b)
                        },
                        _updateActiveSource: function() {
                            var a = this.sources,
                                b = this.activeSourceIndex,
                                f;
                            a && a[b] && (f = a[b]);
                            f ? this.set("activeSource", f) : this.set("activeSource",
                                null)
                        },
                        _updateVisible: function() {
                            this.visible ? this.show() : this.hide()
                        },
                        _updateButtonMode: function(a) {
                            a ? (m.toggle(this.containerNode, this.css.searchExpanded, this.expanded), m.toggle(this.containerNode, this.css.searchCollapsed, !this.expanded), m.add(this.containerNode, this.css.hasButtonMode)) : (m.remove(this.containerNode, this.css.searchExpanded), m.remove(this.containerNode, this.css.searchCollapsed), m.remove(this.containerNode, this.css.hasButtonMode))
                        },
                        _setDefaultActiveSourceIndex: function(a) {
                            a && 1 === a.length ||
                                !this.enableSearchingAll ? this.set("activeSourceIndex", 0) : this.set("activeSourceIndex", this._allIndex)
                        },
                        _setEnableSourcesMenuAttr: function(a) {
                            this._set("enableSourcesMenu", a);
                            this._created && this._insertSources(this.sources)
                        },
                        _setEnableSearchingAllAttr: function(a) {
                            this._set("enableSearchingAll", a);
                            this._created && (this._setDefaultActiveSourceIndex(this.sources), this._hideMenus(), this._insertSources(this.sources))
                        },
                        _setSourcesAttr: function(a) {
                            this._createSourceNameMap(a).then(k.hitch(this, function(b) {
                                this._sourceNames =
                                    b;
                                this._created && (this._setDefaultActiveSourceIndex(a), this._hideMenus(), this._insertSources(a))
                            }));
                            this._set("sources", a)
                        },
                        _setAllPlaceholderAttr: function(a) {
                            this._set("allPlaceholder", a);
                            this._created && this._setPlaceholder(this.activeSourceIndex)
                        },
                        _setActiveSourceIndexAttr: function(a) {
                            this._set("activeSourceIndex", a);
                            this._updateActiveSource();
                            this._created && (this._setPlaceholder(a), this._hideMenus(), this._insertSources(this.sources))
                        },
                        _setMaxLengthAttr: function(a) {
                            this._set("maxLength", a);
                            this._created &&
                                v.set(this.inputNode, "maxLength", a)
                        },
                        _setValueAttr: function(a) {
                            this.set("magicKey", null);
                            this.set("selectedFeatureId", null);
                            this._set("value", a);
                            this._created && (v.set(this.inputNode, "value", a), this._checkStatus())
                        },
                        _setVisibleAttr: function(a) {
                            this._set("visible", a);
                            this._created && this._updateVisible()
                        },
                        _setEnableButtonModeAttr: function(a) {
                            this._set("enableButtonMode", a);
                            this._created && this._updateButtonMode(a)
                        },
                        _setThemeAttr: function(a) {
                            this._created && (m.remove(this.domNode, this.theme), m.add(this.domNode,
                                a));
                            this._set("theme", a)
                        }
                    });
                    B("extend-esri") && k.setObject("dijit.Search", p, G);
                    return p
                })
        },
        "esri/tasks/locator": function() {
            define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/_base/json dojo/has ../kernel ../request ../deferredUtils ./Task ./AddressCandidate".split(" "), function(z, p, k, q, A, x, u, w, h, B, r) {
                z = z(B, {
                    declaredClass: "esri.tasks.Locator",
                    _eventMap: {
                        "address-to-locations-complete": ["addresses"],
                        "addresses-to-locations-complete": ["addresses"],
                        "location-to-address-complete": ["address"],
                        "suggest-locations-complete": ["suggestions"]
                    },
                    constructor: function(c) {
                        this._geocodeHandler = p.hitch(this, this._geocodeHandler);
                        this._geocodeAddressesHandler = p.hitch(this, this._geocodeAddressesHandler);
                        this._reverseGeocodeHandler = p.hitch(this, this._reverseGeocodeHandler);
                        this.registerConnectEvents()
                    },
                    outSpatialReference: null,
                    setOutSpatialReference: function(c) {
                        this.outSpatialReference = c
                    },
                    _geocodeHandler: function(c, h, m, k, p) {
                        try {
                            var v = c.candidates,
                                t;
                            h = [];
                            var q, y = v.length,
                                w = c.spatialReference,
                                g;
                            for (q = 0; q <
                                y; q++) {
                                t = v[q];
                                if (g = t.location) g.spatialReference = w;
                                h[q] = new r(t)
                            }
                            this._successHandler([h], "onAddressToLocationsComplete", m, p)
                        } catch (e) {
                            this._errorHandler(e, k, p)
                        }
                    },
                    _geocodeAddressesHandler: function(c, h, m, k, p) {
                        try {
                            var v = c.locations;
                            h = [];
                            var t, q = v.length,
                                y = c.spatialReference,
                                w;
                            for (t = 0; t < q; t++) {
                                if (w = v[t].location) w.spatialReference = y;
                                h[t] = new r(v[t])
                            }
                            this._successHandler([h], "onAddressesToLocationsComplete", m, p)
                        } catch (g) {
                            this._errorHandler(g, k, p)
                        }
                    },
                    addressToLocations: function(c, r, m, k, y) {
                        var v, t, x, u, B,
                            g, e;
                        c.address && (k = m, m = r, r = c.outFields, y = c.searchExtent, e = c.countryCode, v = c.magicKey, t = c.distance, g = c.categories, c.location && this.normalization && (x = c.location.normalize()), u = c.maxLocations, B = c.forStorage, c = c.address);
                        y && (y = y.shiftCentralMeridian());
                        var n = this.outSpatialReference;
                        c = this._encode(p.mixin({}, this._url.query, c, {
                            f: "json",
                            outSR: n && A.toJson(n.toJson()),
                            outFields: r && r.join(",") || null,
                            searchExtent: y && A.toJson(y.toJson()),
                            category: g && g.join(",") || null,
                            countryCode: e || null,
                            magicKey: v || null,
                            distance: t ||
                                null,
                            location: x || null,
                            maxLocations: u || null,
                            forStorage: B || null
                        }));
                        var C = this._geocodeHandler,
                            F = this._errorHandler,
                            G = new q(h._dfdCanceller);
                        G._pendingDfd = w({
                            url: this._url.path + "/findAddressCandidates",
                            content: c,
                            callbackParamName: "callback",
                            load: function(e, g) {
                                C(e, g, m, k, G)
                            },
                            error: function(e) {
                                F(e, k, G)
                            }
                        });
                        return G
                    },
                    suggestLocations: function(c) {
                        var r;
                        r = new q(h._dfdCanceller);
                        c.hasOwnProperty("location") && this.normalization && (c.location = c.location.normalize());
                        c.searchExtent && (c.searchExtent = c.searchExtent.shiftCentralMeridian());
                        c = this._encode(p.mixin({}, this._url.query, {
                            f: "json",
                            text: c.text,
                            maxSuggestions: c.maxSuggestions,
                            searchExtent: c.searchExtent && A.toJson(c.searchExtent.toJson()),
                            category: c.categories && c.categories.join(",") || null,
                            countryCode: c.countryCode || null,
                            location: c.location || null,
                            distance: c.distance || null
                        }, {
                            f: "json"
                        }));
                        c = w({
                            url: this._url.path + "/suggest",
                            content: c,
                            callbackParamName: "callback"
                        });
                        r._pendingDfd = c;
                        c.then(p.hitch(this, function(c) {
                                c = c.suggestions || [];
                                this.onSuggestLocationsComplete(c);
                                r.resolve(c)
                            }),
                            p.hitch(this, function(c) {
                                this._errorHandler(c);
                                r.reject(c)
                            }));
                        return r
                    },
                    addressesToLocations: function(c, r, m) {
                        var v = this.outSpatialReference,
                            y = [],
                            x = c.categories,
                            t = c.countryCode;
                        k.forEach(c.addresses, function(g, e) {
                            y.push({
                                attributes: g
                            })
                        });
                        c = this._encode(p.mixin({}, this._url.query, {
                            category: x && x.join(",") || null,
                            sourceCountry: t || null
                        }, {
                            addresses: A.toJson({
                                records: y
                            })
                        }, {
                            f: "json",
                            outSR: v && A.toJson(v.toJson())
                        }));
                        var u = this._geocodeAddressesHandler,
                            B = this._errorHandler,
                            z = new q(h._dfdCanceller);
                        z._pendingDfd =
                            w({
                                url: this._url.path + "/geocodeAddresses",
                                content: c,
                                callbackParamName: "callback",
                                load: function(g, e) {
                                    u(g, e, r, m, z)
                                },
                                error: function(g) {
                                    B(g, m, z)
                                }
                            });
                        return z
                    },
                    _reverseGeocodeHandler: function(c, h, m, k, p) {
                        try {
                            var v = new r({
                                address: c.address,
                                location: c.location,
                                score: 100
                            });
                            this._successHandler([v], "onLocationToAddressComplete", m, p)
                        } catch (t) {
                            this._errorHandler(t, k, p)
                        }
                    },
                    locationToAddress: function(c, r, m, k) {
                        c && this.normalization && (c = c.normalize());
                        var v = this.outSpatialReference;
                        c = this._encode(p.mixin({}, this._url.query, {
                            outSR: v && A.toJson(v.toJson()),
                            location: c && A.toJson(c.toJson()),
                            distance: r,
                            f: "json"
                        }));
                        var x = this._reverseGeocodeHandler,
                            t = this._errorHandler,
                            u = new q(h._dfdCanceller);
                        u._pendingDfd = w({
                            url: this._url.path + "/reverseGeocode",
                            content: c,
                            callbackParamName: "callback",
                            load: function(c, h) {
                                x(c, h, m, k, u)
                            },
                            error: function(c) {
                                t(c, k, u)
                            }
                        });
                        return u
                    },
                    onSuggestLocationsComplete: function() {},
                    onAddressToLocationsComplete: function() {},
                    onAddressesToLocationsComplete: function() {},
                    onLocationToAddressComplete: function() {}
                });
                x("extend-esri") && p.setObject("tasks.Locator", z, u);
                return z
            })
        },
        "esri/tasks/AddressCandidate": function() {
            define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../geometry/Point"], function(z, p, k, q, A) {
                z = z(null, {
                    declaredClass: "esri.tasks.AddressCandidate",
                    constructor: function(k) {
                        p.mixin(this, k);
                        this.location = new A(this.location)
                    }
                });
                k("extend-esri") && p.setObject("tasks.AddressCandidate", z, q);
                return z
            })
        },
        "esri/styles/basic": function() {
            define(["dojo/_base/array", "dojo/_base/lang", "dojo/has",
                "../kernel", "../Color"
            ], function(z, p, k, q, A) {
                function x(h, c) {
                    var r;
                    if (h) switch (r = {}, r.color = new A(h.color), r.opacity = h.opacity || 1, c) {
                        case "point":
                            r.outline = {
                                color: new A(h.outline.color),
                                width: h.outline.width
                            };
                            r.size = h.size;
                            break;
                        case "line":
                            r.width = h.width;
                            break;
                        case "polygon":
                            r.outline = {
                                color: new A(h.outline.color),
                                width: h.outline.width
                            }
                    }
                    return r
                }

                function u(h) {
                    if ("esriGeometryPoint" === h || "esriGeometryMultipoint" === h) h = "point";
                    else if ("esriGeometryPolyline" === h) h = "line";
                    else if ("esriGeometryPolygon" ===
                        h || "esriGeometryMultiPatch" === h) h = "polygon";
                    return h
                }
                var w = {
                        "default": {
                            name: "default",
                            label: "Default",
                            description: "Default theme for basic visualization of features.",
                            basemapGroups: {
                                light: "streets gray topo terrain national-geographic oceans osm gray-vector streets-vector topo-vector streets-relief-vector streets-navigation-vector".split(" "),
                                dark: ["satellite", "hybrid", "dark-gray", "dark-gray-vector", "streets-night-vector"]
                            },
                            pointSchemes: {
                                light: {
                                    primary: {
                                        color: [77, 77, 77, 1],
                                        outline: {
                                            color: [255, 255,
                                                255, 1
                                            ],
                                            width: 1
                                        },
                                        size: 8
                                    },
                                    secondary: [{
                                        color: [226, 119, 40, 1],
                                        outline: {
                                            color: [255, 255, 255, 1],
                                            width: 1
                                        },
                                        size: 8
                                    }, {
                                        color: [255, 255, 255, 1],
                                        outline: {
                                            color: [51, 51, 51, 1],
                                            width: 1
                                        },
                                        size: 8
                                    }]
                                },
                                dark: {
                                    primary: {
                                        color: [255, 255, 255, 1],
                                        outline: {
                                            color: [26, 26, 26, 1],
                                            width: 1
                                        },
                                        size: 8
                                    },
                                    secondary: [{
                                        color: [226, 119, 40, 1],
                                        outline: {
                                            color: [255, 255, 255, 1],
                                            width: 1
                                        },
                                        size: 8
                                    }, {
                                        color: [26, 26, 26, 1],
                                        outline: {
                                            color: [178, 178, 178, 1],
                                            width: 1
                                        },
                                        size: 8
                                    }]
                                }
                            },
                            lineSchemes: {
                                light: {
                                    primary: {
                                        color: [77, 77, 77, 1],
                                        width: 2
                                    },
                                    secondary: [{
                                            color: [226, 119, 40, 1],
                                            width: 2
                                        },
                                        {
                                            color: [255, 255, 255, 1],
                                            width: 2
                                        }
                                    ]
                                },
                                dark: {
                                    primary: {
                                        color: [255, 255, 255, 1],
                                        width: 2
                                    },
                                    secondary: [{
                                        color: [226, 119, 40, 1],
                                        width: 2
                                    }, {
                                        color: [26, 26, 26, 1],
                                        width: 2
                                    }]
                                }
                            },
                            polygonSchemes: {
                                light: {
                                    primary: {
                                        color: [227, 139, 79, 1],
                                        outline: {
                                            color: [255, 255, 255, 1],
                                            width: 1
                                        },
                                        opacity: .8
                                    },
                                    secondary: [{
                                        color: [128, 128, 128, 1],
                                        outline: {
                                            color: [255, 255, 255, 1],
                                            width: 1
                                        },
                                        opacity: .8
                                    }, {
                                        color: [255, 255, 255, 1],
                                        outline: {
                                            color: [128, 128, 128, 1],
                                            width: 1
                                        },
                                        opacity: .8
                                    }]
                                },
                                dark: {
                                    primary: {
                                        color: [227, 139, 79, 1],
                                        outline: {
                                            color: [51, 51, 51, 1],
                                            width: 1
                                        },
                                        opacity: .8
                                    },
                                    secondary: [{
                                        color: [178, 178, 178, 1],
                                        outline: {
                                            color: [51, 51, 51, 1],
                                            width: 1
                                        },
                                        opacity: .8
                                    }, {
                                        color: [26, 26, 26, 1],
                                        outline: {
                                            color: [128, 128, 128, 1],
                                            width: 1
                                        },
                                        opacity: .8
                                    }]
                                }
                            }
                        }
                    },
                    h = {};
                (function() {
                    var r, c, k, m, p, q, u, t;
                    for (r in w)
                        for (m in c = w[r], k = c.basemapGroups, p = h[r] = {
                                basemaps: [].concat(k.light).concat(k.dark),
                                point: {},
                                line: {},
                                polygon: {}
                            }, k)
                            for (q = k[m], u = 0; u < q.length; u++) t = q[u], c.pointSchemes && (p.point[t] = c.pointSchemes[m]), c.lineSchemes && (p.line[t] = c.lineSchemes[m]), c.polygonSchemes && (p.polygon[t] = c.polygonSchemes[m])
                })();
                var B = {
                    getAvailableThemes: function(r) {
                        var c = [],
                            k, m, p;
                        for (k in w) m = w[k], p = h[k], r && -1 === z.indexOf(p.basemaps, r) || c.push({
                            name: m.name,
                            label: m.label,
                            description: m.description,
                            basemaps: p.basemaps.slice(0)
                        });
                        return c
                    },
                    getSchemes: function(r) {
                        var c = r.theme,
                            k = r.basemap,
                            m = u(r.geometryType);
                        r = h[c];
                        var p;
                        (r = (r = r && r[m]) && r[k]) && (p = {
                            primaryScheme: x(r.primary, m),
                            secondarySchemes: z.map(r.secondary, function(c) {
                                return x(c, m)
                            })
                        });
                        return p
                    },
                    cloneScheme: function(h) {
                        var c;
                        h && (c = p.mixin({}, h), c.color && (c.color = new A(c.color)),
                            c.outline && (c.outline = {
                                color: c.outline.color && new A(c.outline.color),
                                width: c.outline.width
                            }));
                        return c
                    }
                };
                k("extend-esri") && p.setObject("styles.basic", B, q);
                return B
            })
        },
        "widgets/Search/utils": function() {
            define("dojo/_base/lang dojo/_base/array dojo/Deferred dojo/when dojo/promise/all jimu/portalUtils esri/lang esri/request".split(" "), function(z, p, k, q, A, x, u, w) {
                return {
                    map: null,
                    layerInfosObj: null,
                    appConfig: null,
                    _esriLocatorRegExp: /geocode(.){0,3}\.arcgis.com\/arcgis\/rest\/services\/World\/GeocodeServer/g,
                    setMap: function(h) {
                        this.map = h
                    },
                    setLayerInfosObj: function(h) {
                        this.layerInfosObj = h
                    },
                    setAppConfig: function(h) {
                        this.appConfig = h
                    },
                    getConfigInfo: function(h) {
                        if (h && h.sources && 0 < h.sources.length) {
                            var k = null;
                            return this.searchLayer(this.map) && h.upgradeFromGeocoder ? (k = this.map.itemInfo.itemData.applicationProperties.viewing.search, k = p.map(k.layers, z.hitch(this, function(h, c) {
                                c.hintText = h;
                                return this._getQueryTypeGeocoder(c)
                            }, k.hintText)), A(k).then(z.hitch(this, function(k) {
                                h.sources = [].concat(k).concat(h.sources);
                                return h
                            }))) : h
                        }
                        return q(this._getSoucesFromPortalAndWebmap()).then(z.hitch(this, function(h) {
                            return {
                                allPlaceholder: "",
                                showInfoWindowOnSelect: !0,
                                sources: h
                            }
                        }))
                    },
                    _getSoucesFromPortalAndWebmap: function() {
                        var h = [],
                            k = null;
                        this.searchLayer(this.map) && (k = this.map.itemInfo.itemData.applicationProperties.viewing.search, p.forEach(k.layers, z.hitch(this, function(k, c) {
                            c.hintText = k;
                            h.push(this._getQueryTypeGeocoder(c))
                        }, k.hintText)));
                        return x.getPortalSelfInfo(this.appConfig.portalUrl).then(z.hitch(this, function(k) {
                            if ((k =
                                    k.helperServices && k.helperServices.geocode) && 0 < k.length)
                                for (var c = 0, p = k.length; c < p; c++) {
                                    var m = k[c];
                                    m && h.push(this._processSingleLine(m))
                                }
                            return A(h).then(z.hitch(this, function(c) {
                                for (var h = [], m = 0; m < c.length; m++) {
                                    var k = c[m];
                                    k && (k && "query" === k.type || (k = {
                                            name: k.name || this._getGeocodeName(k.url),
                                            url: k.url,
                                            singleLineFieldName: k.singleLineFieldName,
                                            placeholder: "Find address or place",
                                            maxResults: 6,
                                            searchInCurrentMapExtent: !1,
                                            type: "locator"
                                        }, k.enableLocalSearch = this._isEsriLocator(k.url), k.localSearchMinScale =
                                        3E5, k.localSearchDistance = 5E4), h.push(k))
                                }
                                return h
                            }))
                        }))
                    },
                    _getQueryTypeGeocoder: function(h) {
                        var k = this.map.getLayer(h.id),
                            p = null,
                            c = null,
                            q = null,
                            q = u.isDefined(h.subLayer) ? h.id + "_" + h.subLayer : h.id,
                            p = this.layerInfosObj.traversal(function(h) {
                                return h.id === q ? (c = h, !0) : !1
                            });
                        return k && p && c ? (p = u.isDefined(h.subLayer) ? c.url || k.url + "/" + h.subLayer : c.url || k.url, {
                            name: c.title,
                            layerId: q,
                            url: p,
                            placeholder: h.hintText,
                            searchFields: [h.field.name],
                            displayField: h.field.name,
                            exactMatch: h.field.exactMatch || !1,
                            maxResults: 6,
                            searchInCurrentMapExtent: !1,
                            type: "query"
                        }) : null
                    },
                    _isEsriLocator: function(h) {
                        this._esriLocatorRegExp.lastIndex = 0;
                        return this._esriLocatorRegExp.test(h)
                    },
                    _processSingleLine: function(h) {
                        if (h.singleLineFieldName) return h;
                        if (this._isEsriLocator(h.url)) return h.singleLineFieldName = "SingleLine", h;
                        var p = new k;
                        w({
                            url: h.url,
                            content: {
                                f: "json"
                            },
                            handleAs: "json",
                            callbackParamName: "callback"
                        }).then(z.hitch(this, function(k) {
                            k.singleLineAddressField && k.singleLineAddressField.name ? (h.singleLineFieldName = k.singleLineAddressField.name,
                                p.resolve(h)) : (console.warn(h.url + "has no singleLineFieldName"), p.resolve(null))
                        }), z.hitch(this, function(h) {
                            console.error(h);
                            p.resolve(null)
                        }));
                        return p.promise
                    },
                    _getGeocodeName: function(h) {
                        if ("string" !== typeof h) return "geocoder";
                        h = h.split("/");
                        return h[h.length - 2] || "geocoder"
                    },
                    getGeocoderName: function(h) {
                        return this._getGeocodeName(h)
                    },
                    hasAppSearchInfo: function(h) {
                        return h.itemInfo && h.itemInfo.itemData && h.itemInfo.itemData.applicationProperties && h.itemInfo.itemData.applicationProperties.viewing &&
                            h.itemInfo.itemData.applicationProperties.viewing.search
                    },
                    searchLayer: function(h) {
                        if (!this.hasAppSearchInfo(h)) return !1;
                        h = h.itemInfo.itemData.applicationProperties.viewing.search;
                        return h.enabled && 0 !== h.layers.length ? !0 : !1
                    }
                }
            })
        },
        "widgets/Search/_build-generate_module": function() {
            define(["dojo/text!./Widget.html", "dojo/text!./css/style.css", "dojo/i18n!./nls/strings"], function() {})
        },
        "url:esri/dijit/Search/templates/Search.html": '\x3cdiv role\x3d"presentation" class\x3d"${theme}"\x3e\r\n  \x3cdiv role\x3d"presentation" class\x3d"${css.searchGroup}" data-dojo-attach-point\x3d"containerNode"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"expandNode" class\x3d"${css.searchExpandContainer}"\x3e\r\n      \x3cdiv class\x3d"${css.searchAnimateContainer}"\x3e\r\n        \x3cdiv role\x3d"button" title\x3d"${_i18n.widgets.Search.main.searchIn}" id\x3d"${id}_menu_button" class\x3d"${css.searchBtn} ${css.searchToggle}" tabindex\x3d"0" data-dojo-attach-point\x3d"sourcesBtnNode"\x3e\r\n          \x3cspan aria-hidden\x3d"true" role\x3d"presentation" class\x3d"${css.searchToggleIcon}"\x3e\x3c/span\x3e\x3cspan class\x3d"${css.searchSourceName}" data-dojo-attach-point\x3d"sourceNameNode"\x3e\x3c/span\x3e\r\n        \x3c/div\x3e\r\n        \x3cdiv class\x3d"${css.searchInputGroup}"\x3e\r\n          \x3cform data-dojo-attach-point\x3d"formNode"\x3e\r\n            \x3cinput maxlength\x3d"${maxLength}" autocomplete\x3d"off" type\x3d"text" tabindex\x3d"0" class\x3d"${css.searchInput}" value\x3d"${value}" aria-haspopup\x3d"true" id\x3d"${id}_input" data-dojo-attach-point\x3d"inputNode" role\x3d"textbox"\x3e\r\n          \x3c/form\x3e\r\n          \x3cdiv role\x3d"button" class\x3d"${css.searchClear}" tabindex\x3d"0" data-dojo-attach-point\x3d"clearNode"\x3e\x3cspan aria-hidden\x3d"true" class\x3d"${css.searchClearIcon}"\x3e\x3c/span\x3e\x3cspan aria-hidden\x3d"true" class\x3d"${css.searchSpinner}"\x3e\x3c/span\x3e\r\n          \x3c/div\x3e\r\n          \x3cdiv data-dojo-attach-point\x3d"suggestionsNode" class\x3d"${css.searchMenu} ${css.suggestionsMenu}"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv role\x3d"button" title\x3d"${_i18n.widgets.Search.main.searchButtonTitle}" class\x3d"${css.searchBtn} ${css.searchSubmit}" tabindex\x3d"0" data-dojo-attach-point\x3d"submitNode"\x3e\r\n      \x3cspan aria-hidden\x3d"true" role\x3d"presentation" class\x3d"${css.searchIcon}"\x3e\x3c/span\x3e\r\n      \x3cspan class\x3d"${css.searchButtonText}"\x3e${_i18n.widgets.Search.main.searchButtonTitle}\x3c/span\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"sourcesNode" class\x3d"${css.searchMenu} ${css.sourcesMenu}"\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"noResultsMenuNode" class\x3d"${css.searchMenu} ${css.searchNoResultsMenu}"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"${css.searchClearFloat}"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e',
        "url:widgets/Search/Widget.html": '\x3cdiv\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"searchNode" class\x3d"search-node"\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"searchResultsNode" class\x3d"searchResults arcgisSearch"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
        "url:widgets/Search/css/style.css": ".jimu-widget-search{min-height: 32px;}.jimu-widget-search .search-node.default-width-for-openAtStart{width: 274px;}.jimu-widget-search .result-item-selected{background: #eee;}.jimu-widget-search .arcgisSearch .searchBtn{padding: 6px;}.jimu-widget-search .arcgisSearch .searchBtn:hover,.jimu-widget-search .arcgisSearch .searchBtn:focus {background-color: #485566; color: white;}.jimu-widget-search .arcgisSearch .searchGroup .searchInputGroup .searchInput{width: auto;}.jimu-widget-search.use-absolute .arcgisSearch .searchToggle{float: left;}.jimu-rtl .jimu-widget-search.use-absolute .arcgisSearch .searchToggle{float: right;}.jimu-widget-search.use-absolute .arcgisSearch .searchInputGroup{position: absolute; top: 0; width: auto; left: 34px; right: 34px;}.jimu-widget-search.use-absolute .arcgisSearch .searchInputGroup form{overflow: hidden; z-index: 0; position: relative;}.jimu-widget-search.use-absolute .arcgisSearch .searchInputGroup .searchClear{z-index: 0;}.jimu-widget-search.use-absolute .arcgisSearch .searchExpandContainer{float: none;}.jimu-widget-search.use-absolute .arcgisSearch .searchSubmit{float: right;}.jimu-rtl .jimu-widget-search.use-absolute .arcgisSearch .searchSubmit{float: left;}.jimu-widget-search .arcgisSearch .show-all-results{position: absolute; height: 25px; color: #686868; line-height: 25px; display: none; width: 237px; margin: auto; background-color: #fff; padding: 0 12px; cursor: pointer;}.jimu-widget-search .arcgisSearch .searchMenu{border-radius: 0; color: #686868; font-size: 12px; padding: 0; top: 33px;}.jimu-widget-search .arcgisSearch .searchMenu li.active{background-color: #d9dde0; color: #686868; font-size: 14px;}.jimu-widget-search .arcgisSearch .searchMenu li{padding: 0 12px; line-height: 25px;}.jimu-widget-search .arcgisSearch .searchMenu li:hover,.jimu-widget-search .arcgisSearch .searchMenu li:focus {background-color: #eee;}.jimu-widget-search .arcgisSearch .searchMenu .menuHeader{background-color: #d9dde0; color: #686868; font-size: 14px; min-height: 30px; padding: 0 12px; line-height: 30px;}",
        "*now": function(z) {
            z(['dojo/i18n!*preload*widgets/Search/nls/Widget*["ar","bs","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","vi","zh-hk","zh-tw","ROOT"]'])
        },
        "*noref": 1
    }
});
define("dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/html dojo/when dojo/on dojo/aspect dojo/query dojo/keys dojo/Deferred dojo/promise/all jimu/BaseWidget jimu/LayerInfos/LayerInfos jimu/utils esri/dijit/Search esri/tasks/locator esri/layers/FeatureLayer esri/InfoTemplate esri/lang esri/tasks/query ./utils dojo/NodeList-dom".split(" "), function(z, p, k, q, A, x, u, w, h, B, r, c, v, m, I, y, J, t, D, N, E) {
    return z([c], {
        name: "Search",
        baseClass: "jimu-widget-search",
        searchDijit: null,
        searchResults: null,
        _startWidth: null,
        postCreate: function() {
            !this.closeable && this.isOnScreen || q.addClass(this.searchNode, "default-width-for-openAtStart");
            this.listenWidgetIds.push("framework")
        },
        startup: function() {
            this.inherited(arguments);
            this.config && this.config.sources || (this.config.sources = []);
            v.getInstance(this.map, this.map.itemInfo).then(p.hitch(this, function(g) {
                this.layerInfosObj = g;
                this.own(this.layerInfosObj.on("layerInfosFilterChanged", p.hitch(this, this.onLayerInfosFilterChanged)));
                E.setMap(this.map);
                E.setLayerInfosObj(this.layerInfosObj);
                E.setAppConfig(this.appConfig);
                A(E.getConfigInfo(this.config)).then(p.hitch(this, function(e) {
                    return r(this._convertConfig(e)).then(function(e) {
                        return k.filter(e, function(e) {
                            return e
                        })
                    })
                })).then(p.hitch(this, function(e) {
                    this.domNode && (this.searchDijit = new I({
                        activeSourceIndex: 1 === e.length ? 0 : "all",
                        allPlaceholder: m.stripHTML(D.isDefined(this.config.allPlaceholder) ? this.config.allPlaceholder : ""),
                        autoSelect: !0,
                        enableButtonMode: !1,
                        enableLabel: !1,
                        enableInfoWindow: !0,
                        enableHighlight: D.isDefined(this.config.showInfoWindowOnSelect) ?
                            !!this.config.showInfoWindowOnSelect : !0,
                        showInfoWindowOnSelect: D.isDefined(this.config.showInfoWindowOnSelect) ? !!this.config.showInfoWindowOnSelect : !0,
                        map: this.map,
                        sources: e,
                        theme: "arcgisSearch"
                    }), q.place(this.searchDijit.domNode, this.searchNode), this.searchDijit.startup(), this._resetSearchDijitStyle(), this.own(this.searchDijit.watch("activeSourceIndex", p.hitch(this, "_onSourceIndexChange"))), this.own(x(this.searchDijit.domNode, "click", p.hitch(this, "_onSearchDijitClick"))), this.own(x(this.searchDijit.inputNode,
                        "keyup", p.hitch(this, function(e) {
                            e.keyCode !== h.ENTER && this._onClearSearch()
                        }))), this.own(u.before(this.searchDijit, "select", p.hitch(this, "_captureSelect"))), this.own(x(this.searchDijit, "search-results", p.hitch(this, "_onSearchResults"))), this.own(x(this.searchDijit, "suggest-results", p.hitch(this, "_onSuggestResults"))), this.own(x(this.searchDijit, "select-result", p.hitch(this, "_onSelectResult"))), this.own(x(this.searchResultsNode, "li:click", p.hitch(this, "_onSelectSearchResult"))), this.own(x(this.searchResultsNode,
                        ".show-all-results:click", p.hitch(this, "_showResultMenu"))), this.own(x(window.document, "click", p.hitch(this, function(e) {
                        q.isDescendant(e.target, this.searchResultsNode) || (this._hideResultMenu(), this._resetSelectorPosition(".show-all-results"))
                    }))), this.own(x(this.searchDijit, "clear-search", p.hitch(this, "_onClearSearch"))), this.fetchData("framework"))
                }))
            }))
        },
        onReceiveData: function(g, e, n) {
            "framework" === g && "framework" === e && n && n.searchString && (this.searchDijit.set("value", n.searchString), this.searchDijit.search())
        },
        setPosition: function(g) {
            this._resetSearchDijitStyle(g);
            this.inherited(arguments)
        },
        resize: function() {
            this._resetSearchDijitStyle()
        },
        onLayerInfosFilterChanged: function(g) {
            k.some(g, p.hitch(this, function(e) {
                this.searchDijit && this.searchDijit.sources && 0 < this.searchDijit.sources.length && k.forEach(this.searchDijit.sources, function(g) {
                    g._featureLayerId === e.id && g.featureLayer.setDefinitionExpression(e.getFilter())
                })
            }))
        },
        _resetSearchDijitStyle: function() {
            q.removeClass(this.domNode, "use-absolute");
            this.searchDijit &&
                this.searchDijit.domNode && q.setStyle(this.searchDijit.domNode, "width", "auto");
            setTimeout(p.hitch(this, function() {
                if (this.searchDijit && this.searchDijit.domNode) {
                    var g = window.appInfo.isRunInMobile ? parseInt(q.getComputedStyle(this.domNode).width, 10) : 274,
                        e = q.getMarginBox(this.searchDijit.sourcesBtnNode),
                        n = q.getMarginBox(this.searchDijit.submitNode),
                        c = null;
                    g && (q.setStyle(this.searchDijit.domNode, "width", g + "px"), q.addClass(this.domNode, "use-absolute"), isFinite(e.w) && isFinite(n.w) && (c = window.isRTL ? {
                        left: n.w +
                            "px",
                        right: e.w + "px"
                    } : {
                        left: e.w + "px",
                        right: n.w + "px"
                    }, g = w(".searchInputGroup", this.searchDijit.domNode)[0])) && (q.setStyle(g, c), c = q.getMarginBox(g), g = q.getPadBorderExtents(this.searchDijit.inputNode), q.setStyle(this.searchDijit.inputNode, "width", c.w - g.w + "px"))
                }
            }), 50)
        },
        _convertConfig: function(g) {
            return k.map(g.sources, p.hitch(this, function(e) {
                var g = new B;
                if (e && e.url && "locator" === e.type) {
                    var c = {
                        locator: new y(e.url || ""),
                        outFields: ["*"],
                        singleLineFieldName: e.singleLineFieldName || "",
                        name: m.stripHTML(e.name ||
                            ""),
                        placeholder: m.stripHTML(e.placeholder || ""),
                        countryCode: e.countryCode || "",
                        maxSuggestions: e.maxSuggestions,
                        maxResults: e.maxResults || 6,
                        zoomScale: e.zoomScale || 5E4,
                        useMapExtent: !!e.searchInCurrentMapExtent
                    };
                    e.enableLocalSearch && (c.localSearchOptions = {
                        minScale: e.localSearchMinScale,
                        distance: e.localSearchDistance
                    });
                    g.resolve(c)
                } else e && e.url && "query" === e.type ? (c = new J(e.url || null, {
                        outFields: ["*"]
                    }), this.own(x(c, "load", p.hitch(this, function(c) {
                        var n = c.layer;
                        c = this.map.getLayer(e.layerId);
                        var h = this.layerInfosObj.getLayerInfoById(e.layerId);
                        c ? h = c = !1 : h ? h = c = !1 : (c = D.isDefined(this.config.showInfoWindowOnSelect) ? !!this.config.showInfoWindowOnSelect : !0, h = !0);
                        var q = null;
                        e.searchFields && 0 < e.searchFields.length ? q = e.searchFields : (q = [], k.forEach(n.fields, function(e) {
                            "esriFieldTypeOID" !== e.type && e.name !== n.objectIdField && "esriFieldTypeGeometry" !== e.type && q.push(e.name)
                        }));
                        var r = {
                            featureLayer: n,
                            outFields: ["*"],
                            searchFields: q,
                            autoNavigate: !1,
                            displayField: e.displayField || "",
                            exactMatch: !!e.exactMatch,
                            name: m.stripHTML(e.name || ""),
                            placeholder: m.stripHTML(e.placeholder ||
                                ""),
                            maxSuggestions: e.maxSuggestions || 6,
                            maxResults: e.maxResults || 6,
                            zoomScale: e.zoomScale || 5E4,
                            useMapExtent: !!e.searchInCurrentMapExtent,
                            showInfoWindowOnSelect: c,
                            enableInfoWindow: h,
                            _featureLayerId: e.layerId
                        };
                        r._featureLayerId && (c = this.layerInfosObj.getLayerInfoById(r._featureLayerId)) && n.setDefinitionExpression(c.getFilter());
                        this._getInfoTemplate(n, e).then(p.hitch(this, function(e) {
                            r.infoTemplate = p.clone(e);
                            g.resolve(r)
                        }), p.hitch(this, function() {
                            g.resolve(r)
                        }))
                    }))), this.own(x(c, "error", function() {
                        g.resolve(null)
                    }))) :
                    g.resolve(null);
                return g
            }))
        },
        _getInfoTemplate: function(g, e) {
            var c = new B,
                h = this.layerInfosObj.getLayerInfoById(e.layerId);
            h ? c = h.loadInfoTemplate() : (h = new t, h.setTitle("\x26nbsp;"), h.setContent(p.hitch(this, "_formatContent", e.name, g, e.displayField)), c.resolve(h));
            return c
        },
        _getSourcePopupInfo: function(g) {
            return g._featureLayerId && (g = this.layerInfosObj.getLayerInfoById(g._featureLayerId)) ? g.getPopupInfo() : null
        },
        _captureSelect: function(g) {
            var e = this.searchDijit.activeSourceIndex;
            "all" === e && (e = this._getSourceIndexOfResult(g));
            if (isFinite(e) && D.isDefined(e) && (e = this.searchDijit.sources[e]) && "featureLayer" in e) {
                var c = this._getSourcePopupInfo(e),
                    h = c && c.showAttachments || c && c.description && c.description.match(/http(s)?:\/\//) || c && c.mediaInfos && 0 < c.mediaInfos.length;
                g.feature.__attributes || (g.feature.__attributes = g.feature.attributes);
                h || (e = this._getFormatedAttrs(p.clone(g.feature.attributes), e.featureLayer.fields, e.featureLayer.typeIdField, e.featureLayer.types, c), g.feature.attributes = e)
            }
            return [g]
        },
        _getSourceIndexOfResult: function(g) {
            if (this.searchResults)
                for (var e in this.searchResults)
                    if (-1 <
                        k.indexOf(this.searchResults[e], g)) return parseInt(e, 10);
            return null
        },
        _formatContent: function(g, e, c, h) {
            var n = "";
            if (h && h.attributes && e && e.url) {
                var m = {};
                k.forEach(e.fields, p.hitch(this, function(e) {
                    e.name in h.attributes && (m[e.alias || e.name] = h.attributes[e.name])
                }));
                e = h.attributes[c];
                var n = n + ('\x3cdiv class\x3d"esriViewPopup"\x3e\x3cdiv class\x3d"mainSection"\x3e' + (D.isDefined(e) ? '\x3cdiv class\x3d"header"\x3e' + g + ": " + e + "\x3c/div\x3e" : "") + '\x3cdiv class\x3d"hzLine"\x3e\x3c/div\x3e\x3cdiv\x3e\x3ctable class\x3d"attrTable" cellpading\x3d"0" cellspacing\x3d"0"\x3e\x3ctbody\x3e'),
                    q;
                for (q in m) m.hasOwnProperty(q) && (n += '\x3ctr valign\x3d"top"\x3e\x3ctd class\x3d"attrName"\x3e' + q + '\x3c/td\x3e\x3ctd class\x3d"attrValue"\x3e' + m[q] + "\x3c/td\x3e\x3c/tr\x3e");
                n += '\x3c/tbody\x3e\x3c/table\x3e\x3c/div\x3e\x3cdiv class\x3d"break"\x3e\x3c/div\x3e\x3c/div\x3e'
            }
            return n
        },
        _getFormatedAttrs: function(g, e, c, h, q) {
            function n(e) {
                if (q && D.isDefined(q.fieldInfos))
                    for (var g = 0, c = q.fieldInfos.length; g < c; g++) {
                        var h = q.fieldInfos[g];
                        if (h.fieldName === e) return h.format
                    }
                return null
            }
            var r = {};
            k.forEach(e, p.hitch(this,
                function(k, p) {
                    if (g[k.name]) {
                        var q = !(!k.domain || "codedValue" !== k.domain.type),
                            t = "esriFieldTypeDate" === k.type,
                            v = c && k.name === c,
                            u = k.name;
                        if ("esriFieldTypeDate" === e[p].type) r[u] = m.fieldFormatter.getFormattedDate(g[k.name], n(k.name));
                        else if ("esriFieldTypeDouble" === e[p].type || "esriFieldTypeSingle" === e[p].type || "esriFieldTypeInteger" === e[p].type || "esriFieldTypeSmallInteger" === e[p].type) r[u] = m.fieldFormatter.getFormattedNumber(g[k.name], n(k.name));
                        q ? r[u] = m.fieldFormatter.getCodedValue(k.domain, g[k.name]) :
                            v ? r[u] = m.fieldFormatter.getTypeName(g[k.name], h) : q || t || v || (r[u] = u in r ? r[u] : g[k.name], r[u] = this.getCodeValueFromTypes(k, c, h, g, r))
                    }
                }));
            return r
        },
        getCodeValueFromTypes: function(g, e, c, h, q) {
            var n = null;
            e && c && 0 < c.length && (c = (c = k.filter(c, p.hitch(this, function(g) {
                return g.name === h[e]
            }))) && c[0] || null) && c.domains && c.domains[g.name] && c.domains[g.name].codedValues && (n = m.fieldFormatter.getCodedValue(c.domains[g.name], h[g.name]));
            g = g.name;
            return (q = null !== n ? n : q[g]) || isFinite(q) ? q : ""
        },
        _resetSelectorPosition: function(g) {
            var e =
                q.getMarginBox(window.jimuConfig.layoutId);
            w(g, this.domNode).forEach(p.hitch(this, function(g) {
                var c = q.position(g);
                if ("none" !== q.getStyle(g, "display")) {
                    var h = q.position(this.searchDijit.domNode),
                        k = h.y - 2,
                        n = e.h - h.y - h.h;
                    n > c.y + c.h || k > c.h ? q.setStyle(g, "top", (n > c.y + c.h ? h.h : -c.h - 2) + "px") : (q.setStyle(g, "height", Math.max(n, k) + "px"), q.setStyle(g, "top", (n > k ? h.h : -k - 2) + "px"))
                }
            }))
        },
        _onSourceIndexChange: function() {
            this.searchDijit.value && this.searchDijit.search(this.searchDijit.value)
        },
        _onSearchDijitClick: function() {
            this._resetSelectorPosition(".searchMenu")
        },
        _onSearchResults: function(g) {
            var e = this.searchDijit.get("sources"),
                c = this.searchDijit.get("activeSourceIndex"),
                h = this.searchDijit.get("value"),
                k = "",
                m = g.results;
            if (m && 0 < g.numResults) {
                q.removeClass(this.searchDijit.containerNode, "showSuggestions");
                this.searchResults = m;
                var k = k + ('\x3cdiv class\x3d"show-all-results jimu-ellipsis" title\x3d"' + this.nls.showAll + '"\x3e' + this.nls.showAllResults + "\x3cstrong \x3e" + h + "\x3c/strong\x3e\x3c/div\x3e"),
                    k = k + '\x3cdiv class\x3d"searchMenu" role\x3d"menu"\x3e',
                    p;
                for (p in m)
                    if (m[p] &&
                        m[p].length) {
                        var r = e[parseInt(p, 10)].name;
                        1 < e.length && "all" === c && (k += '\x3cdiv title\x3d"' + r + '" class\x3d"menuHeader"\x3e' + r + "\x3c/div\x3e");
                        for (var k = k + "\x3cul\x3e", r = new RegExp("(" + h + ")", "gi"), t = e[p].maxResults, u = 0, v = m[p].length; u < v && u < t; u++) var w = D.isDefined(m[p][u].name) ? m[p][u].name : this.nls.untitled,
                            k = k + ('\x3cli title\x3d"' + w + '" data-index\x3d"' + u + '" data-source-index\x3d"' + p + '" role\x3d"menuitem" tabindex\x3d"0"\x3e' + w.toString().replace(r, "\x3cstrong \x3e$1\x3c/strong\x3e") + "\x3c/li\x3e");
                        k += "\x3c/url\x3e"
                    } this.searchResultsNode.innerHTML = k + "\x3c/div\x3e";
                this._showResultMenu();
                this._resetSelectorPosition(".searchMenu")
            } else this._onClearSearch();
            this.publishData({
                searchResults: g
            })
        },
        _onSuggestResults: function(g) {
            this._resetSelectorPosition(".searchMenu");
            this._hideResultMenu();
            this.publishData({
                suggestResults: g
            })
        },
        _onSelectSearchResult: function(g) {
            for (g = g.target; !q.hasAttr(g, "data-source-index") || !q.getAttr(g, "data-index");) g = g.parentNode;
            var e = null,
                e = q.getAttr(g, "data-source-index");
            g = parseInt(q.getAttr(g, "data-index"), 10);
            "all" !== e && (e = parseInt(e, 10));
            this.searchResults && this.searchResults[e] && this.searchResults[e][g] && (e = this.searchResults[e][g], this.searchDijit.select(e))
        },
        _showPopupByFeatures: function(g, e, c) {
            var h = null,
                k = !1;
            this.map.infoWindow.setFeatures(e);
            "point" === e[0].geometry.type ? (h = e[0].geometry, k = !0) : h = e[0].geometry.getExtent().getCenter();
            this.map.infoWindow.show(h, {
                closetFirst: !0
            });
            k ? m.zoomToExtent(this.map, c.result.extent, g.id) : (g = m.toFeatureSet(e), m.zoomToFeatureSet(this.map,
                g))
        },
        _loadInfoTemplateAndShowPopup: function(c, e, h) {
            if (c) {
                this.searchDijit.clearGraphics();
                var g = this.map.getLayer(c.id);
                c.isPopupEnabled() && g ? this._showPopupByFeatures(c, [e], h) : c.loadInfoTemplate().then(p.hitch(this, function(g) {
                    e.setInfoTemplate(p.clone(g));
                    this._showPopupByFeatures(c, [e], h);
                    var k = u.before(this.map, "onClick", p.hitch(this, function() {
                        e.setInfoTemplate(null);
                        k.remove()
                    }))
                }))
            }
        },
        _onSelectResult: function(c) {
            for (var e = c.result, g = c.sourceIndex, h = this.searchResults[g], r = 0, t = c.result.feature,
                    u = c.source._featureLayerId, v = function(e, c) {
                        return k.filter(e.graphics, function(g) {
                            return g.attributes[e.objectIdField] === c
                        })
                    }, x = 0, y = h.length; x < y; x++)
                if (m.isEqual(h[x], e)) {
                    r = x;
                    break
                } w("li", this.searchResultsNode).forEach(p.hitch(this, function(c) {
                q.removeClass(c, "result-item-selected");
                var h = q.getAttr(c, "title"),
                    k = q.getAttr(c, "data-index"),
                    m = q.getAttr(c, "data-source-index");
                e && e.name && h === e.name.toString() && k === r.toString() && m === g.toString() && q.addClass(c, "result-item-selected")
            }));
            var z = this.layerInfosObj.getLayerInfoById(u);
            z && this.config.showInfoWindowOnSelect ? z.getLayerObject().then(p.hitch(this, function(e) {
                var g = v(e, t.__attributes[e.objectIdField]);
                g && 0 < g.length ? this._loadInfoTemplateAndShowPopup(z, g[0], c) : (g = new N, g.where = e.objectIdField + " \x3d " + t.__attributes[e.objectIdField], g.outSpatialReference = this.map.spatialReference, e.selectFeatures(g, J.SELECTION_NEW, p.hitch(this, function(g) {
                    var h = null;
                    g && 0 < g.length && (h = g[0], e.add(h), this._loadInfoTemplateAndShowPopup(z, h, c))
                }), p.hitch(this, function() {
                    this._loadInfoTemplateAndShowPopup(z,
                        t, c)
                })))
            })) : c.source.featureLayer && !c.source.locator && m.zoomToExtent(this.map, c.result.extent);
            this.publishData({
                selectResult: c
            })
        },
        _onClearSearch: function() {
            q.setStyle(this.searchResultsNode, "display", "none");
            this.searchResultsNode.innerHTML = "";
            this.searchResults = null
        },
        _hideResultMenu: function() {
            w(".show-all-results", this.searchResultsNode).style("display", "block");
            w(".searchMenu", this.searchResultsNode).style("display", "none")
        },
        _showResultMenu: function() {
            q.setStyle(this.searchResultsNode, "display",
                "block");
            w(".show-all-results", this.searchResultsNode).style("display", "none");
            w(".searchMenu", this.searchResultsNode).style("display", "block");
            var c = w(".searchInputGroup", this.searchDijit.domNode)[0];
            if (c) {
                var c = q.getMarginBox(c),
                    e = {
                        width: c.w + "px"
                    };
                if (window.isRTL) {
                    var h = q.getMarginBox(this.searchDijit.domNode);
                    e.right = h.w - c.l - c.w + "px"
                } else e.left = c.l + "px";
                w(".show-all-results", this.searchResultsNode).style(e);
                w(".searchMenu", this.searchResultsNode).style(e)
            }
        },
        destroy: function() {
            E.setMap(null);
            E.setLayerInfosObj(null);
            E.setAppConfig(null);
            this.searchDijit && this.searchDijit.clear();
            this.inherited(arguments)
        },
        _hidePopup: function() {
            this.map.infoWindow.isShowing && this.map.infoWindow.hide()
        },
        onActive: function() {
            this._mapClickHandle = u.before(this.map, "onClick", p.hitch(this, function() {
                this._hidePopup();
                return arguments
            }))
        },
        onDeActive: function() {
            this._mapClickHandle && this._mapClickHandle.remove && this._mapClickHandle.remove();
            this._hidePopup()
        }
    })
});