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
 * @fileoverview Interface between code that sets opacity (opacity slider,
 *               selection), and the renderer.
 */

o3v.OpacityManager = function(layerOpacityManager, selectionManager,
                              changeCallback) {
  // Accessor for layer opacity information.
  this.layerOpacityManager_ = layerOpacityManager;
  this.layerOpacityManager_.addView(this.handleLayerOpacityUpdate.bind(this));

  // Accessor for selection information.
  this.selectionManager_ = selectionManager;

  // Function to call when something changes.
  this.changeCallback_ = changeCallback;
};

o3v.OpacityManager.prototype.reset = function(entityMetadata) {
  this.entityMetadata_ = entityMetadata;

  // Map of <layer name> : <opacity interpolant>
  // Interpolant is a number from 0 to 1 indicating overall layer opacity.
  // Note that since a layer may be sectioned into outside/inside parts,
  // this number is not the same as base layer opacity returned by
  // getLayerOpacityInfo.
  this.layerOpacities_ = {};

  this.layerOpacityInterpolants_ = [];

  var layerNames = this.entityMetadata_.getLayerNames();
  for (var i = 0; i < layerNames.length; ++i) {
    this.initLayer_(layerNames[i]);
  }
};

// Set up layer.
o3v.OpacityManager.prototype.initLayer_ = function(layerName) {
  var layerId = this.entityMetadata_.layerNameToId(layerName);
  if (!this.layerOpacities_[layerId]) {
    this.layerOpacities_[layerId] = new o3v.Interpolant(
        1, this.layerOpacityInterpolants_);
  }
};

// Gets layer base opacity.
// If a layer is sectioned, base is the opacity of the *most opaque* section.
o3v.OpacityManager.prototype.getLayerBaseOpacity_ = function(layerId) {
  var rawOpacity = this.layerOpacities_[layerId].getPresent();
  var sublayers = this.entityMetadata_.getSublayers()[layerId];
  if (sublayers && rawOpacity > 0 && rawOpacity < 1) {
    var numSublayers = sublayers.length;

    if ((rawOpacity * numSublayers) < 1.0) {
      return rawOpacity * numSublayers;
    } else {
      return 1.0;
    }
  } else {
    return rawOpacity;
  }
};

/**
 * Gets entity opacities based on layer opacity.
 * @param {nubber} layerId Id of the layer.
 * @return {Object.<number, number>} Map of entityId to opacity.
 * @private
 */
o3v.OpacityManager.prototype.getOpacityFromLayering_ =
    function(layerId) {
  var entityToOpacity = {};

  var rawOpacity = this.layerOpacities_[layerId].getPresent();

  // The sublayers are in order from the OUTER to the INNER.
  var sublayers = this.entityMetadata_.getSublayers()[layerId];

  // Potentially three sets of entities; any may be empty.
  // 1) Opaque
  // 2) Transluscent
  // 3) Transparent
  var numSublayers = sublayers.length;
  var opacity = rawOpacity * numSublayers;

  // This is the 'transluscent' sublayer. Every layer below it
  // is transparent, every layer above it is opaque. It may be semi-transparent
  // or opaque.
  var transluscentLayer = Math.floor(numSublayers - opacity);

  // Transparent.
  for (var sublayer = 0; sublayer < transluscentLayer; sublayer++) {
    sublayers[sublayer].forEach(function(entityId) {
        entityToOpacity[entityId] = 0;
      });
  }

  // Transluscent or opaque.
  if (transluscentLayer < sublayers.length) {
    var sublayerOpacity = opacity - (sublayers.length - transluscentLayer - 1);
    sublayers[transluscentLayer].forEach(function(entityId) {
        entityToOpacity[entityId] = sublayerOpacity;
      });
  }

  // Opaque.
  for (var sublayer = transluscentLayer + 1; sublayer < sublayers.length;
       sublayer++) {
    if (sublayers[sublayer]) {
      sublayers[sublayer].forEach(function(entityId) {
          entityToOpacity[entityId] = 1;
        });
    }
  }

  return entityToOpacity;
};

// Helper function that applies an opacity modifier to a transparency.
o3v.OpacityManager.prototype.getOpacityWithModifier_ =
    function(base, modifier) {
  if (modifier == 0) {
    return base;
  } else if (modifier > 0) {
    return (base * (1 - modifier)) + (modifier);
  } else {
    return (base * (1 + modifier));
  }
};

// Helper function to modify opacity for a bunch of entities at once.
o3v.OpacityManager.prototype.modifyOpacityForEntities_ =
    function(entityToOpacity, modifier) {
  o3v.util.forEach(entityToOpacity, function(opacity, entityId) {
      entityToOpacity[entityId] = this.getOpacityWithModifier_(opacity,
                                                               modifier);
    }, this);
};

// If there is a selection, make other layers very transparent and the layer
// with the selection somewhat transparent.
o3v.OpacityManager.prototype.adjustLayersFromSelection_ =
    function(layerToEntityOpacities) {
  if (this.selectionManager_.haveSelected()) {
    var layersWithSelection = this.selectionManager_.getLayersWithSelected();
    var selectedModifier =
        this.selectionManager_.getSelectedLayerOpacityModifier();
    var otherModifier = this.selectionManager_.getOtherLayerOpacityModifier();
    o3v.util.forEach(
        layerToEntityOpacities,
        function(entityOpacities, layerId) {
          if (layersWithSelection[layerId]) {
            this.modifyOpacityForEntities_(entityOpacities, selectedModifier);
          } else {
            this.modifyOpacityForEntities_(entityOpacities, otherModifier);
          }
        }, this);
  }
};

// Adjust entities based on their modified opacities from select / etc.
// TODO(dkogan): Selecting two nodes that end up with the same leaves may
// break this (e.g. select heart, and circulatory at once.)
o3v.OpacityManager.prototype.adjustEntitiesFromSelection_ =
    function(layerToEntityOpacities, entities) {

  o3v.util.forEach(
      entities,
      function(entity, entityId) {
        var opacityModifier =
        this.selectionManager_.getEntityOpacityModifier(entityId);

        var leafEntityIds = this.entityMetadata_.getLeafIds(entityId);
        Object.keys(leafEntityIds).forEach(
            function(leafId) {
              var leaf = this.entityMetadata_.getEntity(leafId);
              var layerId = leaf.layers[0];  // Guaranteed only one.
              var layerOpacities = layerToEntityOpacities[layerId];
              var leafOpacity = layerOpacities[leafId];
              leafOpacity = this.getOpacityWithModifier_(
                  leafOpacity, opacityModifier);
              layerOpacities[leafId] = leafOpacity;
            }, this);
      }, this);
};

// This pushes opacities back into the layer opacity manager, forcing
// all the layers at or below any selected layers to opacity 1, and all
// other layers to opacity zero.
o3v.OpacityManager.prototype.exposeSelected = function() {
  if (this.selectionManager_.haveSelected()) {
    var layersToExpose = this.selectionManager_.getLayersWithSelected();
    var layerNames = this.entityMetadata_.getLayerNames();

    var exposed = false;
    var newOpacities = [];

    for (var i = 0; i < layerNames.length; i++) {
      var layerId = this.entityMetadata_.layerNameToId(layerNames[i]);
      if (layersToExpose[layerId] !== undefined) {
        exposed = true;
      }
      if (exposed) {
        newOpacities[layerNames.length - 1 - i] = 1;
      } else {
        newOpacities[layerNames.length - 1 - i] = 0;
      }
    }

    this.layerOpacityManager_.setLayerOpacities(newOpacities);
  }
};

o3v.OpacityManager.prototype.handleLayerOpacityUpdate = function() {
  if (!this.entityMetadata_) {
    // Not yet set up, return.
    return;
  }

  // TODO(dkogan|arthurb): Switch layerOpacityManager entity ids.
  var newOpacities = this.layerOpacityManager_.getLayerOpacities();
  var layerNames = this.entityMetadata_.getLayerNames();

  if (newOpacities.length != layerNames.length) {
    o3v.log.error("New opacities don't match expected count, unable to update",
                  newOpacities.length, layerNames.length);
    return;
  }

  for (var i = 0; i < layerNames.length; i++) {
    var layerId = this.entityMetadata_.layerNameToId(layerNames[i]);
    var layer = this.entityMetadata_.getEntity(layerId);
    if (layer) {
      // Note: The input is in reverse order here; kind of a nuisance.
      this.layerOpacities_[layerId].setFuture(
          newOpacities[layerNames.length - 1 - i]);
    }
  }

  this.changeCallback_();
};

// Remove exceptions and use external ids.
o3v.OpacityManager.prototype.convertToExternalIds_ =
    function(opacityToEntities) {

  var opacityToExternalEntities = {};

  o3v.util.forEach(
      opacityToEntities,
      function(entities, opacity) {
        opacityToExternalEntities[opacity] = {};
        o3v.util.forEach(
            entities,
            function(opt_true, entityId) {
              var entity = this.entityMetadata_.getEntity(entityId);
              var externalId = entity.externalId;
              opacityToExternalEntities[opacity][externalId] = true;
            }, this);
      }, this);
  return opacityToExternalEntities;
};

// INPUT:
// { <layer id> : { entityId : <opacity> }}
// OUTPUT:
// { <opacity> : { <entity id>: true }}
o3v.OpacityManager.prototype.convertLayerToEntityOpacities_ =
    function(layerToEntityOpacities) {

  var opacityToEntities = {};

  o3v.util.forEach(
      layerToEntityOpacities,
      function(entityOpacities) {
        o3v.util.forEach(
            entityOpacities,
            function(opacity, entityId) {
              if (opacityToEntities[opacity] === undefined) {
                opacityToEntities[opacity] = {};
              }
              opacityToEntities[opacity][entityId] = true;
            });
      });

  return opacityToEntities;

};

// Gets layer opacity info.
// Returns:
// { <opacity> : { <entityId> : true }
// Or null if everything is opaque.
o3v.OpacityManager.prototype.getOpacityInfo = function(opt_forSelection) {
  // opt_forSelection = true;

  // Most of the initial processing is done per-layer because much of
  // the opacity information is relevant per-layer.

  // This is an Object.<number,Object<number,number>> of
  // (layerId -> { entityId -> opacity }}
  var layerToEntityOpacities = {};

  // Layer-level opacities.
  o3v.util.forEach(
      this.layerOpacities_,
      function(unused_layerOpacityInfo, layerId) {
        layerToEntityOpacities[layerId] =
            this.getOpacityFromLayering_(layerId);
      }, this);

  // Adjust opacity of layers to account for any selection.
  // Note the difference between for and from here.
  if (!opt_forSelection) {
    this.adjustLayersFromSelection_(layerToEntityOpacities);
  }

  // Hidden entities are hidden both for selection and otherwise.
  this.adjustEntitiesFromSelection_(layerToEntityOpacities,
                                    this.selectionManager_.getHidden());
  // Adjust for selected entities.
  this.adjustEntitiesFromSelection_(layerToEntityOpacities,
                                    this.selectionManager_.getSelected());
  // Adjust for pinned entities.
  this.adjustEntitiesFromSelection_(layerToEntityOpacities,
                                    this.selectionManager_.getPinned());

  // Create list of opacities -> list of entities.
  // Empty set means everything is opaque.
  var opacityToEntities = this.convertLayerToEntityOpacities_(
      layerToEntityOpacities);

  if (opt_forSelection) {
    // For selection, make all opacities integer values.
    var newOpacityToEntities = {};
    newOpacityToEntities[0] = {};
    newOpacityToEntities[1] = {};
    o3v.util.forEach(
        opacityToEntities,
        function(entities, opacity) {
          if (opacity >= 0.5) {
            o3v.util.forEach(
                entities,
                function(usused_true, entityId) {
                  newOpacityToEntities[1][entityId] = true;
                });
          } else {
            o3v.util.forEach(
                entities,
                function(usused_true, entityId) {
                  newOpacityToEntities[0][entityId] = true;
                });
          }
        });
    opacityToEntities = newOpacityToEntities;
  }

  // Use external ids.
  opacityToEntities = this.convertToExternalIds_(opacityToEntities);

  return opacityToEntities;
};


o3v.OpacityManager.prototype.recalculate = function() {
  var updates = false;

  updates |= o3v.Interpolant.tweenAll(
      this.layerOpacityInterpolants_);
  return updates;
};
