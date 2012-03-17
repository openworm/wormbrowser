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
 * @fileoverview Main object for open-3d-viewer.
 */

o3v.Viewer = function() {
  // Check WebGL and redirect to explanatory page if not supported.
  if (!this.checkWebGL()) {
    window.location.href = 'no_webgl.html';
    return;
  }

  // Tracks history.
  this.history_ = new o3v.History(window);

  // Keeps track of graphical elements on the page.
  this.ui_ = new o3v.MainUI(this.nextModelCallback.bind(this));

  // Navigation tracker takes input and passes it to the renderer.
  this.navigator_ = new o3v.Navigator(this.changeCallback.bind(this),
                                      this.ui_.getCanvas(),
                                      this.history_);

  // Keeps track of selection state.
  this.select_ = new o3v.SelectManager(this.changeCallback.bind(this),
                                       this.navigator_);

  // Keeps track of layer opacities.
  this.layerOpacityManager_ = new o3v.LayerOpacityManager();

  // UI for layers (slider).
  this.layersUI_ = new o3v.LayersUI(this.layerOpacityManager_);

  // Converts opacity inputs (layers & selection) into outputs for renderer.
  this.opacity_ = new o3v.OpacityManager(this.layerOpacityManager_,
                                         this.select_,
                                         this.changeCallback.bind(this));

  // ContentManager manages models.
  this.contentManager_ = new o3v.ContentManager();

  // Interfaces with the renderer.
  this.render_ = new o3v.RenderInterface(this.ui_.getCanvas(), this.opacity_,
                                         this.contentManager_);
  window.addEventListener('resize',
                          function() {
                            this.render_.handleResize();
                            this.changeCallback();
                          }.bind(this), false);

  // Searchbox.
  this.search_ = new o3v.Search(this.selectCallback.bind(this));

  // Input setup.
  var inputHandler = new o3v.InputHandler(window);
  this.setupInputHandlers_(inputHandler);

  // Navigation buttons.
  new o3v.navUI(this.navigator_.reset.bind(this.navigator_),
                this.navigator_.drag.bind(this.navigator_),
                this.navigator_.scroll.bind(this.navigator_));

  // Platform-specific gestures.
  this.gestures_ = new o3v.Gestures();

  // Labels. Requires input handler to track clicks on labels.
  this.label_ = new o3v.Label(inputHandler, this.select_, this.render_,
                              this.ui_.getCanvas(),
                              $('#labelcontainer')[0],
                              this.navigator_,
                              this.gestures_);

  this.loadedModel_ = false;
  this.loadedMetadata_ = false;

  // Load first model.
  this.ui_.showLoadingFeedback(true);
  this.contentManager_.nextModel(this.onModelInfoLoad_.bind(this),
                                 this.render_.onMeshLoad.bind(this.render_),
                                 this.onModelLoad_.bind(this),
                                 this.onMetadataLoad_.bind(this));

  // Restore any pending state and listen to further history changes.
  this.historyStarted_ = false;
};

o3v.Viewer.REFRESH_INTERVAL_ = 20;  // 1000/x Hz (this controls interpolants)

o3v.Viewer.prototype.checkWebGL = function() {
  if (!o3v.webGLUtil.browserSupportsWebGL(document.getElementById('gltest'))) {
    return false;
  } else {
    return true;
  }
};

o3v.Viewer.prototype.onModelInfoLoad_ = function(modelInfo) {
  // Update UI.
  this.ui_.setModelSelectorButton(modelInfo.modelPath + '/model_icon.png');
  this.layersUI_.buildAll(this.ui_.getLastButton(), modelInfo.numLayers,
                          modelInfo.modelPath + '/layer_icons.png');

  // Update slider.
  this.layerOpacityManager_.init(modelInfo.numLayers);
};

o3v.Viewer.prototype.onMetadataLoad_ = function() {
  var metadata = this.contentManager_.getMetadata();

  // Update modules that rely on metadata.
  this.search_.reset(
      this.contentManager_.getMetadata().getAutocompleteList());
  this.select_.reset(metadata);
  this.label_.reset(metadata);

  this.opacity_.reset(metadata);

  this.loadedMetadata_ = true;

  if (this.loadedModel_) {
    this.onModelAndMetadataLoad_();
  }
};

o3v.Viewer.prototype.onModelLoad_ = function() {
  this.loadedModel_ = true;
  this.render_.onModelLoad();

  if (this.loadedMetadata_) {
    this.onModelAndMetadataLoad_();
  }
};

// Called when both model and metadata are loaded.
o3v.Viewer.prototype.onModelAndMetadataLoad_ = function() {
  // This requires both meshes and metadata to be loaded.
  this.contentManager_.getMetadata().computeBboxes(this.render_.getBboxes());
  this.navigator_.resetModel(
      this.contentManager_.getMetadata().getRootEntity().bbox);

  this.ui_.showLoadingFeedback(false);

  if (this.historyStarted_) {
    // Reset view.
    this.navigator_.reset();
  } else {
    // Reset view initially.
    // TODO(dkogan): Handle model selection.
    this.history_.start();
    this.historyStarted_ = true;
  }

  // Refresh.
  this.changeCallback();
};

o3v.Viewer.prototype.nextModelCallback = function() {
  this.loadedModel_ = false;
  this.loadedMetadata_ = false;

  this.render_.reset();

  this.ui_.showLoadingFeedback(true);

  this.contentManager_.nextModel(this.onModelInfoLoad_.bind(this),
                                 this.render_.onMeshLoad.bind(this.render_),
                                 this.onModelLoad_.bind(this),
                                 this.onMetadataLoad_.bind(this));
};

// Callback that happens when something changes that requires a re-render.
// Because of interpolant use, we need to repeat changeCallback until
// all the changes are done processing.
o3v.Viewer.prototype.changeCallback = function(opt_checkBeforeProceeding) {
  if (!this.loadedMetadata_ || !this.loadedModel_) {
    window.setTimeout(this.changeCallback.bind(this),
                      o3v.Viewer.REFRESH_INTERVAL_);
    return;
  }

  if (opt_checkBeforeProceeding) {
    var needUpdate = false;
    needUpdate = this.select_.recalculate() || needUpdate;
    needUpdate = this.opacity_.recalculate() || needUpdate;
    needUpdate = this.navigator_.recalculate() || needUpdate;
    if (!needUpdate) {
      return;
    }
  }

  // Refresh view.
  this.render_.refresh(this.navigator_.camera);
  this.label_.refresh();

  window.setTimeout(function () {
      this.changeCallback(true);
    }.bind(this), o3v.Viewer.REFRESH_INTERVAL_);
};

o3v.Viewer.prototype.selectCallback = function(searchTerm) {
  if (!this.loadedMetadata_ || !this.loadedModel_) {
    return;
  }
  var entityIds = this.contentManager_.getMetadata().searchToEntityIds(
      searchTerm);

  this.select_.selectMultiple(entityIds);

  if (this.select_.haveSelected()) {
    this.opacity_.exposeSelected();
    var bbox = this.navigator_.focusOnEntities(this.select_.getSelected());
    this.navigator_.goToBBox(bbox);
  } else {
    this.navigator_.resetNavParameters();
  }

  // TODO(dkogan|arthurb): Reimplement.
  //this.select_.exposeSelected();
};

o3v.Viewer.prototype.handleClick = function(left, top, modifiers) {
  var externalId = this.render_.identify(left, top);

  if (!externalId) {
    this.select_.clearSelection();
    this.navigator_.resetNavParameters();
  } else {
    var entityId = this.contentManager_.getMetadata().externalIdToId(
        externalId);
    // Identify entity under click.
    var entity = this.contentManager_.getMetadata().getEntity(entityId);
    if (this.gestures_.isHideClick(
        modifiers[o3v.InputHandler.CONTROL],
        modifiers[o3v.InputHandler.META])) {
      // Impossible to click on a hidden entity, so no need for toggle.
      this.select_.hide(entityId);
    } else if (modifiers[o3v.InputHandler.SHIFT]) {
      this.select_.togglePin(entityId);
    } else {
      this.select_.pickMultiple([entityId]);

      var bbox = this.navigator_.focusOnEntities(this.select_.getSelected());
      this.navigator_.goToBBox(bbox, true);
    }
  }
};

o3v.Viewer.prototype.setupInputHandlers_ = function(inputHandler) {
  // Click to select.
  inputHandler.registerHandler(o3v.InputHandler.CLICK,
                               $('#viewer')[0],
                               this.handleClick.bind(this), true);

  // Mouse-based navigation.
  inputHandler.registerHandler(o3v.InputHandler.DRAG,
                               $('#viewer')[0],
                               this.navigator_.drag.bind(this.navigator_),
                               true);
  inputHandler.registerHandler(o3v.InputHandler.SCROLL,
                               $('#viewer')[0],
                               this.navigator_.scroll.bind(this.navigator_),
                               true);

  new o3v.NavKeyHandler(
      inputHandler,
      function(x, y, z) {
        // keyboard move
        this.navigator_.drag(x * 10, y * -10);
        this.navigator_.scroll(0, z * 30);
      }.bind(this),
      this.navigator_.reset.bind(this.navigator_));

  // Clicking on help toggles help.
  $('#help-hidden').click(this.toggleHelp_.bind(this));
  $('#help').click(this.toggleHelp_.bind(this));

  // Miscellaneous keys.
  inputHandler.registerHandler(
      o3v.InputHandler.KEYDOWN, null,
      function(keyCode) {
        if (keyCode == 191) {  // '?'
          this.toggleHelp_();
        } else if (keyCode == 67) {  // 'c'
          this.render_.toggleColored();
          this.changeCallback();
        } else if (keyCode == 66) {  // 'b'
          this.label_.toggleBoundingBox();
          this.changeCallback();
        }
      }.bind(this));
};

o3v.Viewer.prototype.toggleHelp_ = function() {
  if ($('#help')[0].style['display'] != 'block') {
    $('#help')[0].style['display'] = 'block';
    $('#help-hidden')[0].style['display'] = 'none';
  } else {
    $('#help')[0].style['display'] = 'none';
    $('#help-hidden')[0].style['display'] = 'block';
  }
};
