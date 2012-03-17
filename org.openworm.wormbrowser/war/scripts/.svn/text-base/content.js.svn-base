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
 * @fileoverview This object keeps track of the model currently loaded.
 *               On initialization, loads model 0 in o3v.MODELS.
 */
o3v.ContentManager = function() {
  this.models_ = o3v.MODELS;
  this.metadata_ = null;
  this.currentModel_ = -1;  // Force it to cycle to the first model.

  // metadata caches.
  this.scriptsLoaded_ = {};  // e.g. adult_female.js
  this.metadataLoaded_ = {};  // e.g. entity_metadata.json
};

o3v.ContentManager.prototype.nextModel = function(loadModelInfoCallback,
                                                  loadMeshCallback,
                                                  loadModelCallback,
                                                  loadMetadataCallback) {
  this.currentModel_ = (this.currentModel_ + 1) % this.models_.length;

  loadModelInfoCallback(this.models_[this.currentModel_]);

  this.loadModel_(this.models_[this.currentModel_],
                  loadMeshCallback, loadModelCallback, loadMetadataCallback);
};

o3v.ContentManager.prototype.getCurrentModelInfo = function() {
  return this.models_[this.currentModel_];
};

o3v.ContentManager.prototype.loadModel_ =
    function(modelInfo,
             loadMeshCallback,  // After each mesh
             loadModelCallback,  // After all meshes
             loadMetadataCallback  // After metadata
             ) {
  // First, load javascript.
  var scriptPath = modelInfo.modelPath + modelInfo.scriptName;
  if (this.scriptsLoaded_[scriptPath]) {
    this.loadModelAfterScript_(modelInfo, loadMeshCallback, loadModelCallback,
                               loadMetadataCallback);
  } else {
    $.getScript(scriptPath, function() {
        this.scriptsLoaded_[scriptPath] = true;
        this.loadModelAfterScript_(modelInfo, loadMeshCallback,
                                   loadModelCallback,
                                   loadMetadataCallback);
      }.bind(this));
  }
};

o3v.ContentManager.prototype.loadModelAfterScript_ =
    function(modelInfo,
             loadMeshCallback,  // After each mesh
             loadModelCallback,  // After all meshes
             loadMetadataCallback  // After metadata
             ) {
  // Call out to webgl loader.
  downloadModel(modelInfo.modelPath, modelInfo.name, loadMeshCallback,
                loadModelCallback);

  // Load metadata.
  this.loadMetadata_(modelInfo.modelPath + modelInfo.metadataFile,
                     MODELS[modelInfo.name],
                     loadMetadataCallback);
};

o3v.ContentManager.prototype.loadMetadata_ = function(metadataPath,
                                                      modelMetadata,
                                                      callback) {
  var cached_metadata = this.metadataLoaded_[metadataPath];
  if (cached_metadata) {
    this.metadata_ = cached_metadata;
    callback();
  } else {
    var self = this;

    function onload(req) {
      // TODO: error handling.
      var metadata = new o3v.EntityMetadata(JSON.parse(req.responseText));
      self.metadata_ = new o3v.EntityModel(modelMetadata, metadata);
      self.metadataLoaded_[metadataPath] = this.metadata_;
      callback();
    };

    getHttpRequest(metadataPath, onload);
  }
};

o3v.ContentManager.prototype.getMetadata = function() {
  return this.metadata_;
};
