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
 * @fileoverview Javascript to render labels for selected objects.
 */

o3v.Label = function(inputHandler, selectManager, renderInterface,
                     canvas, labelContainer, navigator, gestures) {
  // Map of entityId -> { type -> <id>,
  //                      dom -> <dom element> }
  this.currentLabels_ = {};

  this.navigator_ = navigator;
  this.gestures_ = gestures;

  // Label types
  this.types_ = {};
  this.types_[o3v.Label.TYPE_SELECT_] = { className : 'label_select' };
  this.types_[o3v.Label.TYPE_SELECT_EXPANDABLE_] =
    { className : 'label_select_expandable' };
  this.types_[o3v.Label.TYPE_PIN_] = { className : 'label_pin' };
  this.types_[o3v.Label.TYPE_PIN_EXPANDABLE_] = { className :
                                                  'label_pin_expandable' };

  this.inputHandler_ = inputHandler;  // For creating label click handlers.
  this.selectManager_ = selectManager;  // For calculating what to label.
  this.renderInterface_ = renderInterface;  // For calculating label coords.
  this.canvas_ = canvas;  // For adjusting labels into the visible area.

  this.labelContainer_ = labelContainer;  // Div that contains the labels.

  this.showBoundingBox_ = false;
};

o3v.Label.TYPE_SELECT_ = 0;
o3v.Label.TYPE_SELECT_EXPANDABLE_ = 1;
o3v.Label.TYPE_PIN_ = 2;
o3v.Label.TYPE_PIN_EXPANDABLE_ = 3;

// Width of icons in px.
o3v.Label.EXPAND_ICON_WIDTH_ = 18;
o3v.Label.PIN_ICON_WIDTH_ = 18;
o3v.Label.CLOSE_ICON_WIDTH_ = 18;

// Toggle bounding box disaly.
o3v.Label.prototype.toggleBoundingBox = function() {
  this.showBoundingBox_ = !this.showBoundingBox_;

  var corner = 0;
  for (var corner = 0; corner < 8; corner++) {
    $('#r' + corner)[0].style.left = '-100px';
    $('#r' + corner)[0].style.top = '-100px';
  }
};

// Reset entity store.
o3v.Label.prototype.reset = function(entityStore) {
  this.entityStore_ = entityStore;
};

// Helper to unregister click handler.
o3v.Label.prototype.unregisterLabel_ = function(labelInfo) {
  this.inputHandler_.unregisterHandler(this.inputHandler_.CLICK, labelInfo.dom);
  $(labelInfo.dom).remove();
};

// Remove all labels.
o3v.Label.prototype.clearLabels = function() {
  o3v.util.forEach(this.currentLabels_,
                      this.inputHandler.unregisterLabel_.bind(this));
  this.currentLabels_ = {};
};

// Update label display.
o3v.Label.prototype.refresh = function() {
  // Get new labels.
  var newLabels = {};

  // Selected style overrides pinned style for the duration of selection.
  for (var entityId in this.selectManager_.getPinned()) {
    newLabels[entityId] = (
        this.entityStore_.isSplittable(entityId) ?
        { type : o3v.Label.TYPE_PIN_EXPANDABLE_ } :
        { type : o3v.Label.TYPE_PIN_ });
  }
  for (var entityId in this.selectManager_.getSelected()) {
    newLabels[entityId] = (
        this.entityStore_.isSplittable(entityId) ?
        { type : o3v.Label.TYPE_SELECT_EXPANDABLE_ } :
        { type : o3v.Label.TYPE_SELECT_ });
  }

  // Find labels that need to be deleted and delete them.
  var labelsToDelete = [];
  o3v.util.forEach(this.currentLabels_, function(labelInfo, entityId) {
      if (!newLabels[entityId] ||
          newLabels[entityId].type != labelInfo.type) {
        labelsToDelete.push(entityId);
      }
    }, this);
  labelsToDelete.forEach(function(entityId) {
      this.unregisterLabel_(this.currentLabels_[entityId]);
      delete this.currentLabels_[entityId];
    }, this);

  // Adjust position of labels that need to be adjusted.
  o3v.util.forEach(this.currentLabels_, function(labelInfo, entityId) {
      var coords = this.getCoords_(entityId);
      var label = labelInfo.dom;
      // Set position, taking into account size.
      label.style.left = (
          '' + Math.round(coords[0] - label.offsetWidth / 2) + 'px');
      label.style.top = (
          '' + Math.round(coords[1] - label.offsetHeight / 2) + 'px');
    }, this);

  // Find labels that need to be added and add them.
  o3v.util.forEach(newLabels, function(labelInfo, entityId) {
      if (!this.currentLabels_[entityId]) {
        var coords = this.getCoords_(entityId);
        var text = this.entityStore_.getEntity(entityId).name;
        var className = this.types_[labelInfo.type].className;

        var label = $('<div>').addClass(className).text(text)
            .appendTo(this.labelContainer_).get(0);

        // Set position, taking into account size.
        label.style.left = (
            '' + Math.round(coords[0] - label.offsetWidth / 2) + 'px');
        label.style.top = (
            '' + Math.round(coords[1] - label.offsetHeight / 2) + 'px');

        // Register click handler.
        this.inputHandler_.registerHandler(
            o3v.InputHandler.CLICK, label,
            this.makeHandler_(entityId, label, labelInfo.type).bind(this),
            true);

        // Save this entity in the list of labeled entities.
        this.currentLabels_[entityId] = { type: labelInfo.type,
                                          dom: label };
      }
    }, this);
};

// The handler is somewhat complicated by the fact that there are potentially
// three areas to click (label, "+" expander, "x" closer) and the label can be
// clicked with modifiers.
o3v.Label.prototype.makeHandler_ = function(entityId, label, type) {
  if (type == o3v.Label.TYPE_SELECT_ ||
      type == o3v.Label.TYPE_SELECT_EXPANDABLE_) {
    return function(clientX, clientY, modifiers) {
      var labelRect = label.getBoundingClientRect();
      if ((type == o3v.Label.TYPE_SELECT_EXPANDABLE_ ) &&
          (clientX - labelRect.left < o3v.Label.EXPAND_ICON_WIDTH_)) {
        this.selectManager_.expandSelected(entityId);
      } else if (clientX > (labelRect.right - o3v.Label.CLOSE_ICON_WIDTH_)) {
        this.selectManager_.unselect(entityId);
      } else if (clientX > (labelRect.right -
                            (o3v.Label.PIN_ICON_WIDTH_ +
                             o3v.Label.CLOSE_ICON_WIDTH_))) {
        this.selectManager_.pin(entityId);
      } else if (modifiers[o3v.InputHandler.SHIFT]) {
        this.selectManager_.pin(entityId);
      } else if (this.gestures_.isHideClick(
          modifiers[o3v.InputHandler.CONTROL],
          modifiers[o3v.InputHandler.META])) {
        this.selectManager_.hide(entityId);
      } else if (o3v.util.getObjectCount(this.selectManager_.getSelected()) > 1) {
        this.selectManager_.select(entityId);
      } else {
        this.selectManager_.clearSelected();
      }
      if (this.selectManager_.haveSelected()) {
        this.navigator_.goToBBox(
            this.navigator_.unifyBoundingBoxes(
                this.selectManager_.getSelected()),
            true);
      } else {
        this.navigator_.resetNavParameters();
      }
    };
  } else {
    // PIN
    return function(clientX, clientY, modifiers) {
      var labelRect = label.getBoundingClientRect();
      if ((type == o3v.Label.TYPE_PIN_EXPANDABLE_ ) &&
          (clientX - labelRect.left < o3v.Label.EXPAND_ICON_WIDTH_)) {
        this.selectManager_.expandPinned(entityId);
      } else if (this.gestures_.isHideClick(
          modifiers[o3v.InputHandler.CONTROL],
          modifiers[o3v.InputHandler.META])) {
        this.selectManager_.hide(entityId);
      } else if (modifiers[o3v.InputHandler.SHIFT]) {
        this.selectManager_.unpin(entityId);
      } else {
        if (clientX > (labelRect.right - o3v.Label.CLOSE_ICON_WIDTH_)) {
          this.selectManager_.unpin(entityId);
        } else {
          this.selectManager_.select(entityId);
          if (this.selectManager_.haveSelected()) {
            this.navigator_.goToBBox(
                this.navigator_.unifyBoundingBoxes(
                    this.selectManager_.getSelected()),
                true);
          } else {
            this.navigator_.resetNavParameters();
          }
        }
      }
    };
  }
};

o3v.Label.prototype.getCoords_ = function(entityId) {
  var entity = this.selectManager_.entityStore_.getEntity(entityId);
  var coords = this.renderInterface_.getViewportCoords(entity.ctr);

  // Move to avoid obscuring.
  var xs = [entity.bbox[0], entity.bbox[3]];
  var ys = [entity.bbox[1], entity.bbox[4]];
  var zs = [entity.bbox[2], entity.bbox[5]];

  var corner = 0;
  for (var xIndex in xs) {
    for (var yIndex in ys) {
      for (var zIndex in zs) {
        var corner3d = [xs[xIndex], ys[yIndex], zs[zIndex]];
        var corner2d = this.renderInterface_.getViewportCoords(corner3d);
        coords[1] = Math.max(coords[1], corner2d[1]);

        if (this.showBoundingBox_) {
          $('#r' + corner)[0].style.left = Math.round(corner2d[0]) + 'px';
          $('#r' + corner)[0].style.top = Math.round(corner2d[1]) + 'px';
          corner++;
        }
      }
    }
  }
  // Push the label down completely out of the bounding box.
  // (close enough).
  coords[1] += 20;
  // Bring it back into view if it's too far down.
  var maxHeight = this.canvas_['clientHeight'] - 75;
  if (coords[1] > maxHeight) {
    coords[1] = maxHeight;
  }
  // And if it's too far left or right.
  // TODO(arthurb): This should be based on the actual label width.
  coords[0] = Math.max(75, coords[0]);
  coords[0] = Math.min(this.canvas_['clientWidth'] - 75,
                       coords[0]);

  return coords;
};
