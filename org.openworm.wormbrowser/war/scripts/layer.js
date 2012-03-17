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
 * @fileoverview Generic opacity slider manager - allows for multiple clients
 *               to control the opacity of layers.
 */
o3v.LayerOpacityManager = function() {
  // If not null, an array of opacities sorted by outside-first.
  this.layerOpacities_ = null;

  // Functions to call on change.
  this.callbacks = [];
};

o3v.LayerOpacityManager.prototype.init = function(numLayers) {
  this.layerOpacities_ = [];
  for (var i = 0; i < numLayers; ++i) {
    this.layerOpacities_.push(1.0);
  }
};

o3v.LayerOpacityManager.prototype.getLayerOpacities = function () {
  return this.layerOpacities_;
};

o3v.LayerOpacityManager.prototype.setLayerOpacity =
    function (layer, value, from) {
  this.layerOpacities_[layer] = value;
  this.updateAllBut(from);
};

o3v.LayerOpacityManager.prototype.setLayerOpacities = function(values, from) {
  this.layerOpacities_ = values.slice(); // makes copy
  this.updateAllBut(from);
};

o3v.LayerOpacityManager.prototype.addView = function(callback) {
  var numViews = this.callbacks.length;
  for (var i = 0; i < numViews; ++i) {
    if (this.callbacks[i] == callback) {
      return;
    }
  }
  this.callbacks.push(callback);
};

o3v.LayerOpacityManager.prototype.updateAllBut = function (from) {
  var numViews = this.callbacks.length;
  for (var i = 0; i < numViews; ++i) {
    var callback = this.callbacks[i];
    if (callback != from) {
      callback();
    }
  }
};
