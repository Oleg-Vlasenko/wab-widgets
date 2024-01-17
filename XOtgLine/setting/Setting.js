///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////


define(["dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/query",
  "dojo/dom-class",
  "dojo/dom-construct",
  "jimu/BaseWidgetSetting",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/form/Form",
  "jimu/dijit/CheckBox",
  "dijit/form/NumberTextBox",
  "dijit/form/ValidationTextBox"
],
  function (declare, lang, query, domClass, domConstruct,
    BaseWidgetSetting, _WidgetsInTemplateMixin) {

    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-xotgline-setting',


      defaultDeltaXMercator: 0,
      defaultDeltaYMercator: 0,
      defaultDeltaX: 0,
      defaultDeltaY: 0,
      postCreate: function () {
        //the config object is passed in

        //this.defaultDeltaY = this.config.defaultDeltaY;
        this.setConfig(this.config);
        //The jimu/dijit/CheckBox does not have an onClick event. 
        this.isBaseMercator.onChange = lang.hitch(this, this._onIsBaseMercatorChange);
      },


      setConfig: function (config) {
        //console.log(config.UrlServiceGP);
        //this.textNode.value = config.configText;
        this.defaultDeltaXMercator = config.defaultDeltaXMercator;
        this.defaultDeltaYMercator = config.defaultDeltaYMercator;
        this.defaultDeltaX = config.defaultDeltaX;
        this.defaultDeltaY = config.defaultDeltaY;

        this.UrlServiceGP.value = config.UrlServiceGP;
        this.fileUploadUrl.value = config.fileUploadUrl;
        this.deltaX.value = config.deltaX;
        this.deltaY.value = config.deltaY;
          this.isBaseMercator.setValue(config.isBaseMercator);

          
        //alert(this.isBaseMercator.checked)
      },

      getConfig: function () {
        //WAB will get config object through this method
        console.log("getconf");
        //alert(this.isBaseMercator.checked)
        return {
          //configText: this.textNode.value
          UrlServiceGP: this.UrlServiceGP.value
          , fileUploadUrl: this.fileUploadUrl.value
          , deltaX: this.deltaX.value
          , deltaY: this.deltaY.value
          , isBaseMercator: this.isBaseMercator.getValue()
          , defaultDeltaXMercator: this.defaultDeltaXMercator
          , defaultDeltaYMercator: this.defaultDeltaYMercator
          , defaultDeltaX: this.defaultDeltaX
          , defaultDeltaY: this.defaultDeltaY

        };
        },

      _onIsBaseMercatorChange: function () {
        console.log("change isbasemercator");

        if (this.isBaseMercator.checked) {
          this.deltaX.value = this.defaultDeltaXMercator;
          this.deltaY.value = this.defaultDeltaYMercator;
        } else {
          this.deltaX.value = this.defaultDeltaX;
          this.deltaY.value = this.defaultDeltaY;
        }
        //isBaseMercator = false;
        //deltaX = 122.4, deltaY = 20.0; 
      },

      _onBtnValidateClick: function () {
        //console.log("validate");
      }
    });
  });