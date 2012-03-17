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
 * @fileoverview Code to make and keep track of selections.
 */

// changeCallback: function to call when anything has changed.
//                 after this is called, should repeatedly call
//                 recalculate until it stops returning true.
o3v.SelectManager = function(changeCallback) {
  this.changeCallback_ = changeCallback;

  // map of selected layer name -> refcount of entities in layer
  this.layerSelectionRefcount_ = {};

  // Includes pending.
  // Map of entityId -> entity
  // TODO(dkogan): Generalize to arbitrary number of groups and
  // behaviors.
  this.selectedEntities_ = {};
  this.pinnedEntities_ = {};
  this.hiddenEntities_ = {};

  // Map of entity -> opacity interpolant
  // If an entity is in this map, then it is being changed
  // (being hidden/selected/pinned/unhidden/unselected)
  this.interpolants_ = {};
  // Predefined storage for current and other layer interpolants.
  this.CURRENT_LAYER_INTERPOLANT = -1;
  this.OTHER_LAYER_INTERPOLANT = -2;

  // The interpolants behave as follows:
  // 0 = same opacity as would be otherwise.
  // 1 = completely visibile
  // -1 = completely hidden
  // TODO(wonchun): work out some math/libraries to combine these. Figure
  // out associativity properties.

  // Layer with selection behavior varies depending on how many layers have
  // selections in them.
  this.CURRENT_LAYER_OPACITY_MAX_MODIFIER = -0.8;  // 20% opaque.
  this.CURRENT_LAYER_OPACITY_MODIFIER_STEP = 0.1;
  this.CURRENT_LAYER_OPACITY_MIN_MODIFIER = -0.9;  // 10% opaque.
  this.OTHER_LAYER_OPACITY_DEMOTION = 0.15;

  this.PINNED_ENTITY_OPACITY_MODIFIER = 1.0;
  this.SELECTED_ENTITY_OPACITY_MODIFIER = 1.0;
  this.HIDDEN_ENTITY_OPACITY_MODIFIER = -1.0;
  this.NEUTRAL_OPACITY_MODIFIER = 0;

  // Modes for explicit UI of selecting multiple / hiding / etc.
  this.mode_ = 0;
  this.MODE_NORMAL = 0;
  this.MODE_PIN = 1;
  this.MODE_HIDE = 2;
};

//////////////////////////////////////////////////////////////////////
// INITIALIZATION METHODS
//////////////////////////////////////////////////////////////////////

o3v.SelectManager.prototype.reset = function(entityStore) {
  this.reset_();
  this.mode_ = this.MODE_NORMAL;
  // TODO(dkogan): Reinstate history.
  //this.history = history;
  //this.history.register('sel', this.getState, this.restoreState);

  this.entityStore_ = entityStore;
};

o3v.SelectManager.prototype.getState = function() {
  // Note that selection is stored last intentionally, because otherwise,
  // it would get clobbered by pinning / hiding.
  return ('p:' + Object.keys(this.pinnedEntities_).join(',') +
          ';h:' + Object.keys(this.hiddenEntities_).join(',') +
          ';s:' + Object.keys(this.selectedEntities_).join(',') +
          ';c:' + this.getSelectedLayerOpacityModifier() +
          ';o:' + this.getOtherLayerOpacityModifier());
};

o3v.SelectManager.prototype.restoreState = function(state) {
  this.reset_();
  if (state) {
    var tuples = state.split(';');
    for (var tupleIndex in tuples) {
      var tuple = tuples[tupleIndex].split(':');
      if (tuple[0] == 's') {
        this.selectMultiple(tuple[1].split(','), true);
      } else if (tuple[0] == 'p') {
        this.pinMultiple(tuple[1].split(','), true);
      } else if (tuple[0] == 'h') {
        this.hideMultiple(tuple[1].split(','), true);
      } else if (tuple[0] == 'c') {
        this.setFuture_(this.CURRENT_LAYER_INTERPOLANT,
                        parseFloat(tuple[1]), 1);
      } else if (tuple[0] == 'o') {
        this.setFuture_(this.OTHER_LAYER_INTERPOLANT,
                        parseFloat(tuple[1]), 1);
      }
    }
  }
  this.signalChange_(true);
};

///////////////////////////////////////////////////////////////////////////
// Helper methods.
///////////////////////////////////////////////////////////////////////////

// Resets without generating a history event.
o3v.SelectManager.prototype.reset_ = function() {
  this.clearHidden(true);
  this.clearPinned(true);
  this.clearSelected(true);
  this.interpolants_[this.CURRENT_LAYER_INTERPOLANT] =
  new o3v.Interpolant(this.NEUTRAL_OPACITY_MODIFIER);
  this.interpolants_[this.OTHER_LAYER_INTERPOLANT] =
  new o3v.Interpolant(this.NEUTRAL_OPACITY_MODIFIER);
};

// Returns true if this is a selectable entity.
o3v.SelectManager.prototype.entityAllowed_ = function(entityId) {
  if (!entityId || !this.entityStore_.getEntity(entityId)) {
    return false;
  } else {
    return true;
  }
};

o3v.SelectManager.prototype.calculateSelectedLayerOpacityModifier_ =
    function() {
  // Demote selected layer opacity by number of selected layers.
  var mod = (this.CURRENT_LAYER_OPACITY_MAX_MODIFIER +
             this.CURRENT_LAYER_OPACITY_MODIFIER_STEP);
  for (var layer in this.layerSelectionRefcount_) {
    if (this.layerSelectionRefcount_[layer])
      mod -= this.CURRENT_LAYER_OPACITY_MODIFIER_STEP;
  }
  if (mod < this.CURRENT_LAYER_OPACITY_MIN_MODIFIER) {
    mod = this.CURRENT_LAYER_OPACITY_MIN_MODIFIER;
  }
  return mod;
};

// Update opacities to reflect a change in the selection
// mode of an entity.
// Selected trumps Pinned trumps Hidden.
o3v.SelectManager.prototype.setFutureOpacities_ =
    function(entityId, priorOpacityModifier) {
  if (this.selectedEntities_[entityId]) {
    this.setFuture_(entityId, this.SELECTED_ENTITY_OPACITY_MODIFIER,
                    priorOpacityModifier);
  } else if (this.pinnedEntities_[entityId]) {
    this.setFuture_(entityId, this.PINNED_ENTITY_OPACITY_MODIFIER,
                    priorOpacityModifier);
  } else if (this.hiddenEntities_[entityId]) {
    this.setFuture_(entityId, this.HIDDEN_ENTITY_OPACITY_MODIFIER,
                    priorOpacityModifier);
  } else {
    this.setFuture_(entityId, this.NEUTRAL_OPACITY_MODIFIER,
                    priorOpacityModifier);
  }
  this.setFutureLayerOpacities_();
};

// Set future layer opacities based on existence of selection.
o3v.SelectManager.prototype.setFutureLayerOpacities_ = function() {
  if (this.haveSelected()) {
    var selectedLayerOpacityModifier =
        this.calculateSelectedLayerOpacityModifier_();
    var hiddenLayerOpacityModifier =
        Math.max(selectedLayerOpacityModifier -
                 this.OTHER_LAYER_OPACITY_DEMOTION, -1);

    this.setFuture_(this.CURRENT_LAYER_INTERPOLANT,
                    selectedLayerOpacityModifier,
                    this.getEntityOpacityModifier(
                        this.CURRENT_LAYER_INTERPOLANT));
    this.setFuture_(this.OTHER_LAYER_INTERPOLANT,
                    hiddenLayerOpacityModifier,
                    this.getEntityOpacityModifier(
                        this.OTHER_LAYER_INTERPOLANT));

  } else {
    this.setFuture_(this.CURRENT_LAYER_INTERPOLANT,
                    this.NEUTRAL_OPACITY_MODIFIER,
                    this.getEntityOpacityModifier(
                        this.CURRENT_LAYER_INTERPOLANT));
    this.setFuture_(this.OTHER_LAYER_INTERPOLANT,
                    this.NEUTRAL_OPACITY_MODIFIER,
                    this.getEntityOpacityModifier(
                        this.OTHER_LAYER_INTERPOLANT));
  }
};

// Sets the future opacity modifier for an entity.
o3v.SelectManager.prototype.setFuture_ =
    function(entityId, futureValue, priorOpacityModifier) {
  if (!this.interpolants_[entityId]) {
    this.interpolants_[entityId] = new o3v.Interpolant(
        priorOpacityModifier);
  }
  this.interpolants_[entityId].setFuture(futureValue);
};

// Indicate to the outside world (renderer and history manager)
// that something has changed inside select.js.
o3v.SelectManager.prototype.signalChange_ = function(opt_skipHistory) {
  this.changeCallback_();
  if (!opt_skipHistory) {
    // TODO(dkogan): Reinstate history.
    //this.history.update();
  }
};

o3v.SelectManager.prototype.selectEntity_ = function(entityId) {
  var entity = this.entityStore_.getEntity(entityId);
  if (entity && !this.selectedEntities_[entityId]) {
    var priorOpacityModifier = this.getEntityOpacityModifier(entityId);

    // Bump refcount in associated layer.
    entity.layers.forEach(
        function(layer) {
         o3v.util.setIfUndefined(
             this.layerSelectionRefcount_, layer, 0);
         this.layerSelectionRefcount_[layer]++;
        }, this);

    // Select entity
    this.selectedEntities_[entityId] = entity;

    // Set opacities.
    this.setFutureOpacities_(entityId, priorOpacityModifier);
  }
};

o3v.SelectManager.prototype.unselectEntity_ = function(entityId) {
  var entity = this.selectedEntities_[entityId];
  if (entity) {
    var priorOpacityModifier = this.getEntityOpacityModifier(entityId);

    entity.layers.forEach(
        function(layer) {
         this.layerSelectionRefcount_[layer]--;
        }, this);
    delete this.selectedEntities_[entityId];
    this.setFutureOpacities_(entityId, priorOpacityModifier);
  }
};

o3v.SelectManager.prototype.hideEntity_ = function(entityId) {
  var entity = this.entityStore_.getEntity(entityId);
  if (entity && !this.hiddenEntities_[entityId]) {
    var priorOpacityModifier = this.getEntityOpacityModifier(entityId);
    this.hiddenEntities_[entityId] = entity;
    this.setFutureOpacities_(entityId, priorOpacityModifier);
  }
};

o3v.SelectManager.prototype.unhideEntity_ = function(entityId) {
  var entity = this.hiddenEntities_[entityId];
  if (entity) {
    var priorOpacityModifier = this.getEntityOpacityModifier(entityId);
    delete this.hiddenEntities_[entityId];
    this.setFutureOpacities_(entityId, priorOpacityModifier);
  }
};

o3v.SelectManager.prototype.pinEntity_ = function(entityId) {
  var entity = this.entityStore_.getEntity(entityId);
  if (entity && !this.pinnedEntities_[entityId]) {
    var priorOpacityModifier = this.getEntityOpacityModifier(entityId);
    this.pinnedEntities_[entityId] = entity;
    this.setFutureOpacities_(entityId, priorOpacityModifier);
  }
};

o3v.SelectManager.prototype.unpinEntity_ = function(entityId) {
  var entity = this.pinnedEntities_[entityId];
  if (entity) {
    var priorOpacityModifier = this.getEntityOpacityModifier(entityId);
    delete this.pinnedEntities_[entityId];
    this.setFutureOpacities_(entityId, priorOpacityModifier);
  }
};

//////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
//////////////////////////////////////////////////////////////////////

// Returns -1 for hidden, 0 for default, 1 for visible, and values in between
// for transitional states.
o3v.SelectManager.prototype.getEntityOpacityModifier = function(entityId) {
  if (this.interpolants_[entityId]) {
    return this.interpolants_[entityId].getPresent();
  } else if (this.hiddenEntities_[entityId]) {
    return this.HIDDEN_ENTITY_OPACITY_MODIFIER;
  } else if (this.selectedEntities_[entityId]) {
    return this.SELECTED_ENTITY_OPACITY_MODIFIER;
  } else if (this.pinnedEntities_[entityId]) {
    return this.PINNED_ENTITY_OPACITY_MODIFIER;
  } else {
    return this.NEUTRAL_OPACITY_MODIFIER;
  }
};

o3v.SelectManager.prototype.getSelectedLayerOpacityModifier = function() {
  return this.getEntityOpacityModifier(this.CURRENT_LAYER_INTERPOLANT);
};

o3v.SelectManager.prototype.getOtherLayerOpacityModifier = function() {
  return this.getEntityOpacityModifier(this.OTHER_LAYER_INTERPOLANT);
};

o3v.SelectManager.prototype.haveSelected = function() {
  return !o3v.util.isEmpty(this.selectedEntities_);
};

o3v.SelectManager.prototype.havePinned = function() {
  return !o3v.util.isEmpty(this.pinnedEntities_);
};

o3v.SelectManager.prototype.haveHidden = function() {
  return !o3v.util.isEmpty(this.hiddenEntities_);
};

o3v.SelectManager.prototype.getLayersWithSelected = function() {
  var layers = {};
  o3v.util.forEach(this.layerSelectionRefcount_, function(count, layer) {
      if (count > 0) {
        layers[layer] = true;
      }
    });
  return layers;
};

o3v.SelectManager.prototype.getLayersWithPinned = function() {
  var layers = {};
  var pinned = this.getPinned();
  o3v.util.forEach(this.getPinned(), function(entity, entityId) {
      entity.layers.forEach(
          function(layer) {
           layers[layer] = true;
          });
    });
  return layers;
};

o3v.SelectManager.prototype.getPinned = function() {
  return this.pinnedEntities_;
};

o3v.SelectManager.prototype.getSelected = function() {
  return this.selectedEntities_;
};

o3v.SelectManager.prototype.getHidden = function() {
  return this.hiddenEntities_;
};

//////////////////////////////////////////////////////////////////////
// HIDE
//////////////////////////////////////////////////////////////////////
o3v.SelectManager.prototype.hide = function(entityId, opt_skipHistory) {
  this.hideMultiple([entityId], opt_skipHistory);
};
o3v.SelectManager.prototype.hideMultiple =
    function(entityIds, opt_skipHistory) {
  entityIds.forEach(
      function(entityId) {
       if (this.entityAllowed_(entityId)) {
         // Hidden is not allowed to be selected or pinned.
         this.unselect(entityId, opt_skipHistory);
         this.unpin(entityId, opt_skipHistory);
         this.hideEntity_(entityId);
       }
      }, this);
  this.signalChange_(opt_skipHistory);
};
o3v.SelectManager.prototype.unhide = function(entityId, opt_skipHistory) {
  this.unhideEntity_(entityId);
  this.signalChange_(opt_skipHistory);
};
o3v.SelectManager.prototype.clearHidden = function(opt_skipHistory) {
  if (!opt_skipHistory) {
    o3v.Analytics.trackPage('/ui/clear-hidden');
  }
  for (var entityId in this.hiddenEntities_) {
    this.unhideEntity_(entityId);
  }
  this.signalChange_(opt_skipHistory);
};

//////////////////////////////////////////////////////////////////////
// SELECT
//////////////////////////////////////////////////////////////////////
o3v.SelectManager.prototype.select = function(entityId, opt_skipHistory) {
  this.selectMultiple([entityId], opt_skipHistory);
};
o3v.SelectManager.prototype.selectMultiple =
    function(entityIds, opt_skipHistory) {
  this.clearSelected(false, true);  // Only allowing a single selection.
  entityIds.forEach(
      function(entityId) {
       if (this.entityAllowed_(entityId)) {
         this.selectEntity_(entityId);
       }
      }, this);
  this.signalChange_(opt_skipHistory);
};
o3v.SelectManager.prototype.unselect = function(entityId, opt_skipHistory) {
  this.unselectEntity_(entityId);
  this.signalChange_(opt_skipHistory);
};
o3v.SelectManager.prototype.clearSelected = function(opt_skipHistory,
                                                     opt_noSignal) {
  for (var entity in this.selectedEntities_) {
    this.unselectEntity_(entity);
  }
  if (!opt_noSignal) {
    this.signalChange_(opt_skipHistory);
  }
};

//////////////////////////////////////////////////////////////////////
// PIN
//////////////////////////////////////////////////////////////////////
o3v.SelectManager.prototype.pin = function(entityId, opt_skipHistory) {
  this.pinMultiple([entityId], opt_skipHistory);
};
o3v.SelectManager.prototype.pinMultiple = function(entityIds, opt_skipHistory) {
  entityIds.forEach(
      function(entityId) {
       if (this.entityAllowed_(entityId)) {
         // Pinned is not allowed to be selected or hidden.
         this.unhide(entityId, opt_skipHistory);
         this.unselect(entityId, opt_skipHistory);
         this.pinEntity_(entityId, opt_skipHistory);
       }
      }, this);
  this.signalChange_(opt_skipHistory);
};
o3v.SelectManager.prototype.unpin = function(entityId, opt_skipHistory) {
  this.unpinEntity_(entityId);
  this.signalChange_(opt_skipHistory);
};
o3v.SelectManager.prototype.togglePin = function(entityId) {
  if (this.pinnedEntities_[entityId]) {
    this.unpin(entityId);
  } else {
    this.pin(entityId);
  }
};
o3v.SelectManager.prototype.togglePinMultiple = function(entityIds) {
  entityIds.forEach(
      function(entityId) {
       this.togglePin(entityId);
      }, this);
};
o3v.SelectManager.prototype.clearPinned = function(opt_skipHistory) {
  if (!opt_skipHistory) {
    o3v.Analytics.trackPage('/ui/clear-pinned');
  }
  for (var entity in this.pinnedEntities_) {
    this.unpinEntity_(entity);
  }
  this.signalChange_(opt_skipHistory);
};

///////////////////////////////////////////////////////////////////////////
// Undifferentiated Selection.
///////////////////////////////////////////////////////////////////////////
o3v.SelectManager.prototype.pickMultiple = function(entityIds) {
  if (this.mode_ == this.MODE_PIN) {
    this.togglePinMultiple(entityIds);
  } else if (this.mode_ == this.MODE_HIDE) {
    this.hideMultiple(entityIds);
  } else {
    if (entityIds.length == 1 && this.selectedEntities_[entityIds] &&
        o3v.util.getObjectCount(this.selectedEntities_) == 1) {
      // This is a pick of the currently selected entity, so deselect it.
      this.clearSelected();
    } else {
      this.selectMultiple(entityIds);
    }
  }
};

//////////////////////////////////////////////////////////////////////
// Expand
//////////////////////////////////////////////////////////////////////
o3v.SelectManager.prototype.expandSelected = function(entityId) {
  var newSelected = {};
  // NOTE(dkogan): These are two different types of maps, but that's okay
  // because we're just using their keys.
  o3v.util.extendObject(newSelected,
                        this.entityStore_.getSplit(entityId));
  o3v.util.extendObject(newSelected, this.getSelected());
  delete newSelected[entityId];
  this.selectMultiple(
      Object.keys(newSelected));
};

o3v.SelectManager.prototype.expandPinned = function(entityId) {
  this.unpin(entityId);
  this.pinMultiple(
      Object.keys(this.entityStore_.getSplit(entityId)));
};

///////////////////////////////////////////////////////////////////////////
// Mode control.
///////////////////////////////////////////////////////////////////////////
o3v.SelectManager.prototype.setMode = function(mode) {
  this.mode_ = mode;
};

///////////////////////////////////////////////////////////////////////////
// Render interface.
///////////////////////////////////////////////////////////////////////////

// Callback from rendering. Returns true if something has changed.
o3v.SelectManager.prototype.recalculate = function() {
  var updates = false;
  var garbage = [];
  // TODO(wonchun): use Interpolant registration to handle stuff
  // like this. Dynamic interoplant insert/remove require a bit
  // more logic (like that below). Also consider using a "freelist" of
  // interpolators to avoid GC churn.
  // Updates interpolant state, and marks defunct interpolators.
  for (var entityId in this.interpolants_) {
    var interpolant = this.interpolants_[entityId];
    var more_updates = interpolant.tween();
    updates |= more_updates;
    // Is this an interpolant we can reclaim?
    if (entityId != this.CURRENT_LAYER_INTERPOLANT &&
        entityId != this.OTHER_LAYER_INTERPOLANT &&
        !more_updates) {
      // TODO(wonchun): is it possible to simply delete this here?
      garbage.push(entityId);
    }
  }

  // Sweeps defunct interpolators.
  garbage.forEach(function(entityId) {
      delete this.interpolants_[entityId];
    }, this);

  return updates;
};

o3v.SelectManager.prototype.clearSelection = function() {
  this.clearHidden(true);
  this.clearPinned(true);
  this.clearSelected(true);
};
