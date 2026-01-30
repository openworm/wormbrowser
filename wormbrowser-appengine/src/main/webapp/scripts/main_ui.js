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
 * @fileoverview GUI elements of the page (buttons, slider, etc).
 */

o3v.MainUI = function(nextModelCallback) {
  var OPEN_WORM_URL = "http://openworm.org";
	
  // Canvas.
  $('<canvas>').appendTo('body').css({
      'position': 'absolute',
      'width': '100%',
      'height': '100%',
      'z-index': o3v.uiSettings.ZINDEX_VIEWER
    }).attr('id', 'viewer');
  this.canvas_ = $('#viewer')[0];
  this.canvas_.onselectstart = function() {return false;};
  this.canvas_.onmousedown = function() {return false;};

  // Logo.
  $('<img id="logo-img" src="img/logo.png">').appendTo('body').css({
      'position': 'absolute',
      'left': '8px',
      'top': '10px',
      'cursor': 'pointer',
      'z-index': o3v.uiSettings.ZINDEX_MAINUI
    }).click(function () {
    	window.open(OPEN_WORM_URL);
    });

  // Model selector.
  this.modelBtn_ = $('<div>').appendTo('body').css({
      'position': 'absolute',
      'left': '17px',
      'top': '230px',
      'width': '45px',
      'height': '50px',
      'border-left': '2px solid #466a15',
      'border-top-left-radius': '16px',
      'border-top-right-radius': '16px',
      'border-top': '2px solid #466a15',
      'border-right': '2px solid #466a15',
      'border-bottom': '1px solid #466a15',
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
      'background-color': '#fff',
      'z-index': o3v.uiSettings.ZINDEX_MAINUI
    }).click(nextModelCallback);
};

o3v.MainUI.prototype.setModelSelectorButton = function(iconFile) {
  this.modelBtn_.css({
    'background-image': 'url(' + iconFile + ')'
    });
};

o3v.MainUI.prototype.getCanvas = function() {
  return this.canvas_;
};

o3v.MainUI.prototype.showLoadingFeedback = function(show) {
  document.getElementById('loading-feedback').style.visibility =
    show ? 'visible' : 'hidden';
};

o3v.MainUI.prototype.getLastButton = function() {
  return this.modelBtn_.get(0);
};
