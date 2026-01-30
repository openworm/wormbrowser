// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview Description of this file.
 * @author dkogan@google.com (David Kogan)
 */
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

o3v.RenderInterface = function(canvas, opacityManager, contentManager) {
  this.renderer_ = new Renderer(canvas, this.textureFromMaterial_.bind(this));

  this.opacityManager_ = opacityManager;
  this.contentManager_ = contentManager;

  this.pendingRefresh_ = 0;  // If refresh is waiting, this is its timeout.
  this.REFRESH_WAIT_ = 10;  // Wait 10ms between refresh retries.

  this.reset();
};

o3v.RenderInterface.prototype.textureFromMaterial_ = function(
    gl, material, callback) {
  var modelInfo = this.contentManager_.getCurrentModelInfo();
  var texturePath = modelInfo.texturePath;
  // TODO(dkogan|wonchun): MODELS should probably not be a global variable.
  var materials = MODELS[modelInfo.name].materials;
  try {
    var url = materials[material].map_Kd;  // throw-y.
    if (url === undefined) {
      throw url;
    }
    return textureFromUrl(gl, texturePath + url, callback);
  } catch (e) {
    var color;
    try {
      color = new Uint8Array(materials[material].Kd);
    } catch (e) {
      color = new Uint8Array([255, 255, 255]);
    }
    var texture = textureFromArray(gl, 1, 1, color);
    callback(gl, texture);
    return texture;
  }
}


o3v.RenderInterface.prototype.handleResize = function() {
  this.renderer_.handleResize();
};

o3v.RenderInterface.prototype.onMeshLoad =
    function(attribArray, indexArray, bboxes, meshEntry) {

  this.renderer_.onMeshLoad(attribArray, indexArray, bboxes, meshEntry);

  // Update bbox info.
  for (var i = 0; i < meshEntry.names.length; i++) {
    var bbox = [bboxes[i*6 + 0], bboxes[i*6 + 1], bboxes[i*6 + 2],
                bboxes[i*6 + 3], bboxes[i*6 + 4], bboxes[i*6 + 5]];
    this.bboxes_[meshEntry.names[i]] = bbox;
  }
};

o3v.RenderInterface.prototype.onModelLoad = function() {
  this.renderer_.updateMeshInfo();
};

o3v.RenderInterface.prototype.reset = function() {
  this.renderer_.reset();
  this.bboxes_ = {};
  window.clearTimeout(this.pendingRefresh_);
};

o3v.RenderInterface.prototype.getBboxes = function() {
  return this.bboxes_;
};

o3v.RenderInterface.prototype.refresh = function(camera) {
  if (this.pendingRefresh_) {
    window.clearTimeout(this.pendingRefresh_);
    this.pendingRefresh_ = 0;
  }
  if (this.renderer_.ready()) {
    // Update opacity info.
    this.renderer_.updateOpacity(this.opacityManager_.getOpacityInfo());

    // Send refresh request.
    this.renderer_.postRedisplayWithCamera(camera);
  } else {
    this.pendingRefresh_ = window.setTimeout(
        function() {
          this.refresh(camera);
        }.bind(this), this.REFRESH_WAIT_);
  }
};

o3v.RenderInterface.prototype.getViewportCoords = function(renderCoords) {
  return this.renderer_.getViewportCoords(renderCoords);
};

o3v.RenderInterface.prototype.identify = function(left, top) {
  // Set to int-valued opacities.
  this.renderer_.updateOpacity(this.opacityManager_.getOpacityInfo(true));
  return this.renderer_.identify(left, top);
  this.renderer_.updateOpacity(this.opacityManager_.getOpacityInfo());
};

o3v.RenderInterface.prototype.toggleColored = function() {
  this.renderer_.toggleColored();
};
