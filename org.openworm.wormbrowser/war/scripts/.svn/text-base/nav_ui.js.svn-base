// Copyright 2011 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Navigational controls for main UI of open-3d-viewer.
 */
o3v.navUI = function(reset, move, zoom) {
  homeBtn = null;
  upBtn = null;
  leftBtn = null;
  rightBtn = null;
  downBtn = null;
  zoomIn = null;
  zoomOut = null;

  this.reset_ = reset;
  this.move_ = move;
  this.zoom_ = zoom;

  var navBtnStyles = {
    'position': 'absolute',
    'width': '20px',
    'height': '20px',
    'z-index': o3v.uiSettings.ZINDEX_MAINUI
  };

  this.navHome = $('<div>').appendTo('body').css(navBtnStyles).css({
      'left': '30px',
      'top': '84px'
    }).button({
     icons: {
       primary: 'ui-icon-home'
     },
     text: false
      }).click(function () {
          this.reset_();
        }.bind(this));
  var homeEl = this.navHome.get(0);
  this.navUp = $('<div>').appendTo('body').css(navBtnStyles).button({
   icons: {
     primary: 'ui-icon-triangle-1-n'
   },
   text: false
    }).position({
     my: 'bottom',
     at: 'top',
     of: homeEl,
     collision: 'none'
      }).click(function () {
          this.move_(0, -o3v.navUI.MOVE_FACTOR);
        }.bind(this));
  this.navLeft = $('<div>').appendTo('body').css(navBtnStyles).button({
   icons: {
     primary: 'ui-icon-triangle-1-w'
   },
   text: false
    }).position({
     my: 'right',
     at: 'left',
     of: homeEl,
     collision: 'none'
      }).click(function () {
          this.move_(-o3v.navUI.MOVE_FACTOR, 0);
        }.bind(this));
  this.navRight = $('<div>').appendTo('body').css(navBtnStyles).button({
   icons: {
     primary: 'ui-icon-triangle-1-e'
   },
   text: false
    }).position({
     my: 'left',
     at: 'right',
     of: homeEl,
     collision: 'none'
      }).click(function () {
          this.move_(o3v.navUI.MOVE_FACTOR, 0);
        }.bind(this));
  this.navDown = $('<div>').appendTo('body').css(navBtnStyles).button({
   icons: {
     primary: 'ui-icon-triangle-1-s'
   },
   text: false
    }).position({
     my: 'top',
     at: 'bottom',
     of: homeEl,
     collision: 'none'
      }).click(function () {
          this.move_(0, o3v.navUI.MOVE_FACTOR);
        }.bind(this));
  this.navZoomIn = $('<div>').appendTo('body').css(navBtnStyles).button({
   icons: {
     primary: 'ui-icon-plus'
   },
   text: false
    }).position({
     my: 'top',
     at: 'bottom',
     of: this.navDown.get(0),
     offset: '0 16',
     collision: 'none'
      }).click(function () {
          this.zoom_(0, o3v.navUI.ZOOM_FACTOR);
        }.bind(this));
  this.navZoomOut = $('<div>').appendTo('body').css(navBtnStyles).button({
   icons: {
     primary: 'ui-icon-minus'
   },
   text: false
    }).position({
     my: 'top',
     at: 'bottom',
     of: this.navZoomIn.get(0),
     collision: 'none'
      }).click(function () {
          this.zoom_(0, -o3v.navUI.ZOOM_FACTOR);
        }.bind(this));
};

o3v.navUI.MOVE_FACTOR = 10;
o3v.navUI.ZOOM_FACTOR = 50;
