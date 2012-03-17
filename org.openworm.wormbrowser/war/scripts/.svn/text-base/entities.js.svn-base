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
 * @fileoverview Entity database.
 */
/**
 * Temporary storage for information about entities and their relationships.
 * @param {Object} json Json data from server.
 * @constructor
 */
o3v.EntityMetadata = function (json) {
  /**
   * Logger.
   * @type {Object.<string, Function>}
   * @private
   */
  this.log_ = o3v.log;

  /**
   * Map of entity id to entity metadata.
   * @type {Object.<number, Object>}
   * @private
   */
  this.entities_ = {};

  /**
   * Map of external id to id.
   * @type {Object.<string, number>}
   * @private
   */
  this.externalIdToId_ = {};

  /**
   * Set of layer ids.
   * @type {Object.<number, boolean>}
   * @private
   */
  this.layers_ = {};

  /**
   * Map of layer name to entity id.
   * @type {Object.<string, number>}
   * @private
   */
  this.layerNameToId_ = {};

  /**
   * Sublayers: indexed by layer entity id, array of arrays of entity ids.
   * @type {Object.<number, Array.<Array.<number>>>}
   * @private
   */
  this.sublayers_ = {};

  /**
   * Symmetry information - pair id to symmetry info.
   * @type {Object.<number, Object>}
   * @private
   */
  this.symmetries_ = {};

  /**
   * Set of entity ids that are hidden from search and selection.
   * @type {Object.<number, boolean>}
   * @private
   */
  this.hidden_ = {};

  this.loadEntities_(json);
  this.loadDag_(json);
  this.loadLayers_(json);

  this.log_.info('loaded entity metadata: ', json);
};


/**
 * Generates a readable name from an external id.
 * This badly needs to be moved to the pipeline.
 * @param {string} stringId Id (e.g. 'r_lower_subclavian_artery').
 * @return {string} Name (e.g. 'lower subclavian artery').
 * @private
 */
o3v.makeName = function (stringId) {
  return stringId.replace(/_/g, ' ').replace(/^r /, '').replace(/^l /, '');
};

/**
 * Loads entity data from json.
 * @param {Object} json Json data from server.
 * @private
 */
o3v.EntityMetadata.prototype.loadEntities_ = function (json) {
  // Load leafs.
  json['leafs'].forEach(
      function (entityInfo) {
        this.loadEntity_(entityInfo, true);
      }, this);

  // Load non-leafs.
  json['nodes'].forEach(
      function (entityInfo) {
        this.loadEntity_(entityInfo, false);
      }, this);

  // Load hidden.
  json['hidden'].forEach(
      function (entityId) {
        this.hidden_[entityId] = true;
      }, this);

  // Load symmetries.
  json['symmetries'].forEach(this.computeSymmetryObject_, this);

  // Load names.
  /**
   * Set of entities with overridden names.
   * @type {Object.<number, boolean>}
   * @private
   */
  this.entitiesWithOverriddenNames_ = {};
  json['names'].forEach(this.computeName_, this);
};

/**
 * Loads one entity.
 * @param {Array.<number|string>} entityInfo Data about entity from json.
 * @param {boolean} isLeaf True if this is a leaf entity.
 * @private
 */
o3v.EntityMetadata.prototype.loadEntity_ = function (entityInfo, isLeaf) {
  var entityId = +entityInfo[0];
  var externalId = '' + entityInfo[1];
  // TODO(dkogan): This logic needs to move into the data pipeline.
  var entityNames = [o3v.makeName(externalId)];
  var entity = {};
  entity.externalId = externalId;
  entity.names = entityNames;
  entity.parentIds = {};

  this.entities_[entityId] = entity;
  if (isLeaf) { // We don't want the externalid -> id map for nonleafs
    this.externalIdToId_[externalId] = entityId;
  }
};

/**
 * Loads the dag of parent/child relationships between entities.
 * @param {Object} json Json data from server.
 * @private
 */
o3v.EntityMetadata.prototype.loadDag_ = function (json) {
  json['dag'].forEach(
      function (groupInfo) {
        var parentId = groupInfo[0];
        var childIds = groupInfo[1];
        // All children are under one parent id.
        this.entities_[parentId].childIds = o3v.util.createSet(childIds);
        childIds.forEach(
            function (childId) {
              this.entities_[childId].parentIds[parentId] = true;
            }, this);
      }, this);
};

/**
 * Loads layer and sublayer data.
 * @param {Object} json Json data from server.
 * @private
 */
o3v.EntityMetadata.prototype.loadLayers_ = function (json) {
  // Load layers.
  json['layers'].forEach(
      function (layerId) {
        this.layers_[layerId] = true;
        this.layerNameToId_[this.getEntity(layerId).name] = layerId;
      }, this);

  var entitiesAccountedFor = {};

  // Load sublayers.
  // this.subLayers = Object.<number, Array.<Array.<number>>>
  //   layerId -> [ [entityId, entityId], [entityId, entityId] ...]
  //   The sublayers are sorted from innermost to outermost.
  json['sublayers'].forEach(
      function (layer) {
        var layerId = layer[0];
        var sublayers = layer[1];
        var sublayerArray = [];
        sublayers.forEach(
            function (sublayer) {
              var depth = sublayer[0];
              var entityIds = sublayer[1];
              sublayerArray[depth] = [];
              entityIds.forEach(
                  function (entityId) {
                      sublayerArray[depth].push(entityId);
                      entitiesAccountedFor[entityId] = true;
                    }, this);
                  }, this);
        this.sublayers_[layerId] = sublayerArray;
      }, this);

  // If, for some reason, there are sublayers with gaps, fill in those
  // gaps with empty sets.
  o3v.util.forEach(this.sublayers_, function (sublayerArray) {
      for (var i = 0; i < sublayerArray.length; i++) {
        if (sublayerArray[i] === undefined) {
          sublayerArray[i] = [];
        }
      }
    }, this);

  // Complete sublayers by calculating any leftover entities
  // and putting them in the default (top) layer.
  o3v.util.forEach(this.layers_, function (unused_true, layerId) {
      if (this.sublayers_[layerId] === undefined) {
        this.sublayers_[layerId] = [];
      }
      var sublayerArray = this.sublayers_[layerId];
      sublayerArray[sublayerArray.length] = [];
    }, this);
  o3v.util.forEach(
      this.entities_,
      function(entity, entityId) {
        // If this a new leaf entity, it needs to be assigned to a layer.
        if (entitiesAccountedFor[entityId] === undefined &&
            entity.childIds === undefined) {
          var layerId = this.getLayerId(entityId);
          if (!layerId) {
            this.log_.warning('Failed to find layer for leaf entity ',
                              entityId, ' ', entity.names[0]);
          } else {
            var sublayerArray = this.sublayers_[layerId];
            sublayerArray[sublayerArray.length - 1].push(
                parseInt(entityId));
          }
        }
      }, this);
};

/**
 * Gets the layer id of an entity.
 * @param {number} The entity id.
 * @return {number} The layer id or 0 if none.
 */
o3v.EntityMetadata.prototype.getLayerId = function(entityId) {
  var entity = this.entities_[entityId];
  var layerId = 0;
  // Inefficient (because no short-circuiting) but easy.
  o3v.util.forEach(
      entity.parentIds,
      function(true_unused, parentId) {
        if (this.layers_[parentId] !== undefined) {
          layerId = parentId;
        } else {
          var parentLayerId = this.getLayerId(parentId);
          if (parentLayerId != 0) {
            layerId = parentLayerId;
          }
        }
      }, this);
  return layerId;
};

/**
 * Maps an external id to an internal id.
 * @param {string} externalId External id.
 * @return {number} The internal id.
 */
o3v.EntityMetadata.prototype.externalIdToId = function (externalId) {
  // TODO(dkogan): This lower case should not be necessary once the pipeline
  // does the right thing.
  return this.externalIdToId_[externalId.toLowerCase()];
};

/**
 * Gets an entity object by id.
 * @param {number} entityId The id of the entity.
 * @return {Object} The entity.
 */
o3v.EntityMetadata.prototype.getEntity = function (entityId) {
  return this.entities_[entityId];
};

/**
 * Gets the layers.
 * @return {Object.<number, boolean>} Set of layer entity ids.
 */
o3v.EntityMetadata.prototype.getLayers = function () {
  return this.layers_;
};

/**
 * Gets the sublayers. See definition of EntityMetadata.sublayers_ for
 * structure explanation.
 * @return {Object.<number, Array.<Array.<number>>>} Sublayer object.
 */
o3v.EntityMetadata.prototype.getSublayers = function () {
  return this.sublayers_;
};

/**
 * Gets symmetry information.
 * @return {Object.<number, Object>} Map of pair id to symmetry info.
 */
o3v.EntityMetadata.prototype.getSymmetries = function () {
  return this.symmetries_;
};

/**
 * Gets the hidden entities.
 * @return {Object.<number, boolean>} Set of hidden entity ids.
 */
o3v.EntityMetadata.prototype.getHidden = function () {
  return this.hidden_;
};

/**
 * Computes and stores a single symmetry object.
 * This sets this.symmetries_.
 * @param {Array.<number|string>} symmetryJson Json data for the symmetry.
 *        Structure: [<pairId>, <leftId>, <rightId>, <singularName>].
 * @private
 */
o3v.EntityMetadata.prototype.computeSymmetryObject_ = function (symmetryJson) {
  var pairId = symmetryJson[0];
  var symmetryObj = {};
  symmetryObj.childIds = [];
  symmetryObj.childIds[HANDEDNESS_.LEFT] = symmetryJson[1];
  symmetryObj.childIds[HANDEDNESS_.RIGHT] = symmetryJson[2];
  symmetryObj.singularName = o3v.makeName('' + symmetryJson[3]);

  this.symmetries_[pairId] = symmetryObj;
};

/**
 * Stores a name associated with an entity.
 * @param {Array.<number|string>} nameTuple Tuple of (entityId, name).
 * @private
 */
o3v.EntityMetadata.prototype.computeName_ = function (nameTuple) {
  var entityId = +nameTuple[0];
  var name = nameTuple[1];
  if (!this.entitiesWithOverriddenNames_[entityId]) {
    // First override clobbers existing name.
    this.entities_[entityId].names = [name];
    this.entitiesWithOverriddenNames_[entityId] = true;
  } else {
    this.entities_[entityId].names.push(name);
  }
};


/**
 * Storage for entity information associated with a particular model.
 * @param {Object} json Json data from server for this model.
 * @param {o3v.EntityMetadata} metadata Global metadata.
 * @constructor
 */
o3v.EntityModel = function (json, metadata) {
  // TODO(wonchun): This should be constructed out of models, not out of json.
  // TODO(dkogan): Much of this code needs to be pushed back earlier into the
  //               data pipeline. The symmetry code is especially bad.
  this.log_ = o3v.log;

  /**
   * Map of entity id to entity metadata.
   * @type {Object.<number, Object>}
   * @private
   */
  this.entities_ = {};

  /**
   * Map of external id to id.
   * @type {Object.<string, number>}
   * @private
   */
  this.externalIdToId_ = {};

  /**
   * Map of search term to array of entity ids.
   * @type {Object.<string, Array.<number>>}
   * @private
   */
  this.searchToEntityIds_ = {};

  /**
   * Matcher for search.
   * @type {Object}
   * @private
   */
  this.searchMatcher_ = null;

  /**
   * Root of the entity DAG (there must only be one).
   * @type {number}
   * @private
   */
  this.rootId_;

  /**
   * Array of layer names.
   * @type Array.<String>
   * @private
   */
  this.layerNames_ = [];

  /**
   * Map of layer name to entity id.
   * @type {Object.<string, number>}
   * @private
   */
  this.layerNameToId_ = {};

  /**
   * Set of entity ids that are unselectable.
   * @type {Object.<number, boolean>}
   * @private
   */
  this.unselectable_ = o3v.util.cloneObject(metadata.getHidden());

  this.loadLeafEntities_(json, metadata);
  this.nonSearchableEntityIds_ = o3v.util.cloneObject(metadata.getHidden());
  this.computeDagAndSymmetries_(metadata);
  this.computeRoot_();
  this.computeSplits_();
  this.computeLayers_(metadata);
  this.computeSearches_(metadata);

  /**
   * Sublayers: indexed by layer entity id, array of arrays of entity ids.
   * @type {Object.<number, Array.<Array.<number>>>}view
   * @private
   */
  this.sublayers_ = this.loadSublayers_(metadata.getSublayers());
};

/**
 * Maximum number of entities into which a group entity is allowed to split. If
 * it's not possible to split under this number, entity is considered
 * unsplittable.
 * @type {number}
 * @const
 * @private
 */
o3v.EntityModel.MAX_SPLIT_COUNT_ = 25;

/**
 * Loads sublayers from metadata.
 * This is just postprocessing to remove any entities not in this model.
 * @param {Object.<number, Array.<Array.<number>>>} sublayers
 * @return {Object.<number, Array.<Array.<number>>>} sublayers
 */
o3v.EntityModel.prototype.loadSublayers_ = function(sublayers) {

  var newSublayers = {};

  o3v.util.forEach(
      sublayers,
      function(sublayer, layerId) {
        newSublayers[layerId] = [];
        sublayer.forEach(
            function(sublayerArray) {
              newSublayers[layerId][newSublayers[layerId].length] = [];
              sublayerArray.forEach(
                  function(entityId) {
                    if (this.entities_[entityId] !== undefined) {
                      newSublayers[layerId][newSublayers[layerId].length - 1]
                          .push(entityId);
                    }
                  }, this);
            }, this);
      }, this);

  return newSublayers;
};

/**
 * Loads leaf entities from json and metadata.
 * This sets this.entities_ and this.externalIdToId_ for leaf entities.
 * @param {Object} json Json data for this model.
 * @param {o3v.EntityMetadata} metadata Overall metadata.
 * @private
 */
o3v.EntityModel.prototype.loadLeafEntities_ = function (json, metadata) {
  // Generate list of initial entities.
  for (var url in json.urls) {
    var urlItems = json.urls[url].length;
    for (var i = 0; i < urlItems; ++i) {
      json.urls[url][i].names.forEach(
        function(externalId) {
          var entityId = metadata.externalIdToId(externalId);
          var entityMetadata = metadata.getEntity(entityId);
          if (!entityId) {
            this.log_.error('Missing leaf geometry ', externalId,
                            ' in metadata.');
          } else {
            var entity = {};
            entity.name = entityMetadata.names[0];
            // TODO(dkogan): This field only used for symmetry calculation -
            // really should move that to the data pipeline somewhere as a
            // boolean.
            entity.externalId = externalId;

            // TODO(dkogan): Make parents & children just pointers.
            entity.parentIds = entityMetadata.parentIds;

            this.entities_[entityId] = entity;
            this.externalIdToId_[externalId] = entityId;
          }
      }, this);
    }
  }
};

/**
 * Computes the entity hierarchy DAG and fills in any symmetries. The DAG
 * represents how entities and groups of entities relate to one another: e.g.
 * 'cervical vertebrae' belong to the groups 'spine' and 'skeleton'.
 * This sets this.entities_ for groups, and sets parentIds and childIds on the
 * entities.
 * @param {o3v.EntityMetadata} metadata Overall metadata.
 * @private
 */
o3v.EntityModel.prototype.computeDagAndSymmetries_ = function (metadata) {
  var symmetries = metadata.getSymmetries();

  // Generate a lookup table for group entities which known to be symmetric.
  // The left and right children of group entities are generated in the
  // pipeline.
  var entityIdToHandedness = {};
  o3v.util.forEach(symmetries, function (pair, pairId) {
    o3v.util.forEach(HANDEDNESS_, function (handedness) {
      var childId = pair.childIds[handedness];
      this.nonSearchableEntityIds_[childId] = true;
      entityIdToHandedness[childId] = handedness;
    }, this);
  }, this);

  // Function to get handedness given an entity. Group entity handedness is
  // known from metadata (entityIdToHandedness); leaf entity handedness in
  // determined by the prefix of the external id.
  var getHandedness = function (entityId, entity) {
      if (o3v.util.objectContains(entityIdToHandedness, entityId)) {
        return entityIdToHandedness[entityId];
      } else if (entity.externalId && entity.externalId.match(/^l_/i)) {
        return HANDEDNESS_.LEFT;
      } else if (entity.externalId && entity.externalId.match(/^r_/i)) {
        return HANDEDNESS_.RIGHT;
      } else {
        this.log_.error('paired entity of unknown handedness ', entityId,
                        ' ', entity.name);
      }
    };

  // Queue of entities to process. Every entity is processed to set the parent
  // child connections.
  // Any entity created in the process of dag generation or symmetry
  // generation gets added to the queue and processed in turn.
  var queue = Object.keys(this.entities_).map(
      function (entityId) {
        return +entityId;
      });
  while (queue.length) {
    var childId = queue.shift();
    var child = this.entities_[childId];
    var modifiedParentIds = {}; // Updated parent ids for this child.
    for (var parentId in child.parentIds) {
      parentId = +parentId;
      // If no entity for parentId exists, create an entity. This is how the
      // DAG is grown (from the bottom up).
      if (!this.entities_[parentId]) {
        var parentMetadata = metadata.getEntity(parentId);
        var parent = {};
        parent.name = parentMetadata.names[0];
        parent.parentIds = parentMetadata.parentIds;
        parent.childIds = o3v.util.createSet();
        this.entities_[parentId] = parent;
        if (symmetries[parentId]) {
          // If parent is symmetric, create its left and right children along
          // with it. One of these children becomes the parent of the child
          // entity. For example 'left thumb' becomes the child of 'hand' and
          // 'left hand', and 'left hand' is the child of 'hand'.
          var symmetry = symmetries[parentId];
          o3v.util.forEach(HANDEDNESS_, function (handedness) {
            var subParentId = symmetry.childIds[handedness];
            var subParent = {};
            subParent.name = symmetry.singularName;
            subParent.parentIds = o3v.util.createSet();
            subParent.parentIds[parentId] = true;
            subParent.childIds = o3v.util.createSet();

            parent.childIds[subParentId] = true;

            this.entities_[subParentId] = subParent;

            // New subParent needs to be processed.
            queue.push(subParentId);
          }, this);
        }
        // New parent needs to be processed.
        queue.push(parentId);
      }
      // Now that the parent is guaranteed to exist, hook up the child to it.
      var parent = this.entities_[parentId];
      if (symmetries[parentId] && !parent.childIds[childId]) {
        // This is the child of a symmetric entity.
        if (symmetries[childId]) {
          // This entity itself is symmetric, so the following connections
          // need to be made:
          // a -> b
          // a -> left_a          * done prior to this code executing
          // a -> right_a         * done prior to this code executing
          // b -> left_b          * done prior to this code executing
          // b -> right_b         * done prior to this code executing
          // left_a -> left_b
          // right_a -> right_b
          var parentSymmetry = symmetries[parentId];
          var childSymmetry = symmetries[childId];

          // a -> b
          modifiedParentIds[parentId] = true;
          parent.childIds[childId] = true;

          // left_a -> left_b && right_a -> right_b
          o3v.util.forEach(HANDEDNESS_, function (handedness) {
            var subParentId = parentSymmetry.childIds[handedness];
            var subChildId = childSymmetry.childIds[handedness];
            var subParent = this.entities_[subParentId];
            var subChild = this.entities_[subChildId];
            subParent.childIds[subChildId] = true;
            subChild.parentIds[subParentId] = true;
          }, this);
        } else {
          // This entity is not symmetric, which means it
          // belongs under either the left or right child of its parent.
          var handedness = getHandedness(childId, child);
          var symmetry = symmetries[parentId];
          var subParentId = symmetry.childIds[handedness];
          var subParent = this.entities_[subParentId];

          if (subParent) {
            subParent.childIds[childId] = true;
            modifiedParentIds[subParentId] = true;
          } else {
            this.log_.error('no subparent for ', parent.name,
                            ' -> ', child.name);
          }
        }
      } else {
        // Regular parent->child; not symmetric.
        parent.childIds[childId] = true;
        modifiedParentIds[parentId] = true;
      }
    }
    // Incorporate changes due to symmetries.
    child.parentIds = modifiedParentIds;
  }
};

/**
 * Computes the root entity and verifies there is only one.
 * This sets this.rootId_.
 * @private
 */
o3v.EntityModel.prototype.computeRoot_ = function () {
  // Compute root node.
  o3v.util.forEach(
  this.entities_, function (entity, entityId) {
    if (o3v.util.isEmpty(entity.parentIds)) {
      if (!this.rootId_) {
        this.rootId_ = entityId;
      } else {
        this.log_.error('MULTIPLE ROOTS', this.rootId_, ' ', entityId,
                        ' ', this.entities_[this.rootId_].name,
                        ' ', this.entities_[entityId].name);
      }
    }
  }, this);
};

/**
 * Computes bounding boxes and their centers for all entities.
 * This sets bbox and ctr on all the entities.
 * This must get called before bboxes are read.
 * @param {Object.<string, Array.<number>> leafBboxesByExternalId
 * @private
 */
o3v.EntityModel.prototype.computeBboxes = function (leafBboxesByExternalId) {
  var leafIds = this.getLeafIds(this.rootId_);
  o3v.util.forEach(
      leafIds,
      function(unused_true, entityId) {
        var entity = this.entities_[entityId];
        entity.bbox = leafBboxesByExternalId[entity.externalId];
      }, this);

  var dirty = leafIds; // dirty = need to propagate change up
  var queue = Object.keys(leafIds);
  while (queue.length) {
    var nodeId = queue.shift();
    if (dirty[nodeId]) {
      delete dirty[nodeId];
      var node = this.entities_[nodeId];
      o3v.util.forEach(
          node.parentIds,
          function (unused_true, parentId) {
            var parent = this.entities_[parentId];
            if (node.bbox !== undefined) {
              parent.bbox = o3v.growBBox(parent.bbox, node.bbox);
              dirty[parentId] = true;
              queue.push(parentId);
            } else {
              o3v.log.error('error adding ', node.name, ' to ', parent.name);
            }
          }, this);
    }
  }

  // Compute bbox centers.
  o3v.util.forEach(
      this.entities_,
      function (entity) {
        if (entity.bbox !== undefined) {
          entity.ctr = [];
          entity.ctr[0] = 0.5 * (entity.bbox[0] + entity.bbox[3]);
          entity.ctr[1] = 0.5 * (entity.bbox[1] + entity.bbox[4]);
          entity.ctr[2] = 0.5 * (entity.bbox[2] + entity.bbox[5]);
        } else {
          o3v.log.error('no bbox or center for entity', entity);
        }
      });
};

/**
 * Computes the set of entityIds that best splits this group entity. It returns
 * null if the entity is unsplittable, or if it's impossible to split it into
 * fewer than MAX_SPLIT_COUNT_ subentities.
 * Note: Both the entity and entity id are passed in to simplify the recursion.
 * @param {Object} entity Entity.
 * @param {number} entityId Entity id.
 * @return {Object.<number, boolean>?} Set of entity ids.
 * @private
 */
o3v.EntityModel.prototype.computeOneSplit_ = function (entity, entityId) {
  if (!entity.childIds) {
    return null;
  }

  var split = {};

  // If this is a synonym, delegate.
  if (o3v.util.getObjectCount(entity.childIds) == 1) {
    var childId = +(Object.keys(entity.childIds)[0]);
    return this.computeOneSplit_(this.getEntity(childId), childId);
  }

  var leafIds = this.getLeafIds(entityId);

  // Generate child groups.
  var childGroupIdToGroupLeafIds = {};
  for (var childId in entity.childIds) {
    if (!this.unselectable_[childId]) {
      var childLeafIds = this.getLeafIds(+childId);
      if (childLeafIds && o3v.util.getObjectCount(childLeafIds) > 1) {
        childGroupIdToGroupLeafIds[childId] = childLeafIds;
      }
    }
  }

  // Sort child groups by number of subelements.
  var childGroupIds = Object.keys(childGroupIdToGroupLeafIds);
  childGroupIds.sort(function (a, b) {
    return (o3v.util.getObjectCount(childGroupIdToGroupLeafIds[b]) - o3v.util.getObjectCount(childGroupIdToGroupLeafIds[a]));
  });

  // Add useful child groups to split.
  childGroupIds.forEach(
      function (childGroupId) {
        var useful = false;
        var childLeafIds = childGroupIdToGroupLeafIds[childGroupId];
        for (var childLeafId in childLeafIds) {
          if (leafIds[childLeafId]) {
            useful = true;
            break;
          }
        }
        if (useful) {
          split[childGroupId] = true;
          for (var childLeafId in childLeafIds) {
            delete leafIds[childLeafId];
          }
        }
      });

  // Add any individual leafs unaccounted for.
  for (var leafId in leafIds) {
    if (!this.unselectable_[leafId]) {
      split[leafId] = true;
    }
  }

  if (o3v.util.getObjectCount(split) <= 1) {
    // Leaf entity or group - unsplittable.
    return null;
  } else if (o3v.util.getObjectCount(split) <= o3v.EntityModel.MAX_SPLIT_COUNT_) {
    return split;
  } else {
    this.log_.warning('entity ', entity.name,' splits into too many: ',
                      o3v.util.getObjectCount(split), ' ', split);
    if (o3v.debug) {
      return split;
    } else {
      return null;
    }
  }
};

/**
 * Computes the best split (where possible) for group entities.
 * This sets split_ on this.entities_.
 * @private
 */
o3v.EntityModel.prototype.computeSplits_ = function () {
  // TODO(dkogan): This needs to go into the pipeline, but requires that
  // the pipeline be model-specific.
  o3v.util.forEach(this.entities_, function (entity, entityId) {
    if (!this.unselectable_[entityId]) {
      var split = this.computeOneSplit_(entity, entityId);
      if (split) {
        entity.split_ = split;
      }
    }
  }, this);
};

/**
 * Propagates layer information down to leaf entities. If entityId is leaf, the
 * layer is set on that leaf. Otherwise, the function is called recursively on
 * all the entity's children.
 * @param {number} layerId Entity id of the layer to propagate.
 * @param {number} entityId Entity id to propagate through.
 * @private
 */
o3v.EntityModel.prototype.propagateLayerDown_ = function (layerId, entityId) {
  var entity = this.entities_[entityId];
  if (!entity.layers) {
    entity.layers = {};
  }
  if (!entity.childIds) {
    entity.layers[layerId] = true;
  } else {
    // TODO(dkogan): Implement without recursion. Should be okay for now.
    for (var childId in entity.childIds) {
      this.propagateLayerDown_(layerId, +childId);
    }
  }
};

/**
 * Propagates layer information up through the tree. The layer is set on both
 * the current entity, and all its ancestors (recursively).
 * @param {number} layerId Entity id of the layer to propagate.
 * @param {number} entityId Entity id to propagate through.
 * @private
 */
o3v.EntityModel.prototype.propagateLayerUp_ = function (layerId, entityId) {
  var entity = this.entities_[entityId];
  if (!entity.layers) {
    entity.layers = {};
  }
  entity.layers[layerId] = true;
  // TODO(dkogan): Implement without recursion. Should be okay for now.
  for (var parentId in entity.parentIds) {
    this.propagateLayerUp_(layerId, +parentId);
  }
};

/**
 * Computes layer information on all entities. Leaf entities are analogous
 * to render groups, and must be in exactly one layer. All other entities are
 * considered to be in every layer in which one of their children is. Thus,
 * the root entity is in every layer, and 'elbow' may be in 'muscle' and
 * 'skeleton' layers.
 * This sets layers on this.entities_.
 * @param {o3v.EntityMetadata} metadata Metadata.
 * @private
 */
o3v.EntityModel.prototype.computeLayers_ = function (metadata) {
  // Compute initial layers.
  Object.keys(metadata.getLayers()).forEach(
      function (layerId) {
        // Use external ids for layers, not names.
        // TODO(dkogan): We should split up layers and groups
        // to avoid this kind of hack.
        if (this.entities_[layerId]) {
          var layerName = metadata.getEntity(layerId).externalId;
          this.layerNames_.push(layerName);
          this.entities_[layerId].externalId = layerName;
          this.layerNameToId_[layerName] = layerId;
        }
      }, this);

  // Pass layer info to the child nodes.
  Object.keys(metadata.getLayers()).forEach(
      function (layerId) {
        if (this.entities_[layerId]) {
          this.propagateLayerDown_(layerId, layerId);
        }
      }, this);

  // Sanity check - any leaf entity must be in exactly one layer.
  o3v.util.forEach(this.entities_, function (entity) {
    if (!entity.childIds && (!entity.layers || o3v.util.getObjectCount(entity.layers) != 1)) {
      this.log_.error('leaf entity not in one layer: ', entity.name);
    }
  }, this);

  // Propagate layer info up through the tree.
  o3v.util.forEach(this.entities_, function (entity, entityId) {
    if (!entity.childIds) {
      this.propagateLayerUp_(
      Object.keys(entity.layers)[0], entityId);
    }
  }, this);

  // Turn layers into arrays for easier processing.
  o3v.util.forEach(
  this.entities_, function (entity) {
    if (!o3v.util.isEmpty(entity.layers)) {
      entity.layers = Object.keys(entity.layers);
    }
  });
};

/**
 * Computes layer information on all entities. Leaf entities are analogous
 * to render groups, and must be in exactly one layer. All other entities are
 * considered to be in every layer in which one of their children is. Thus,
 * the root entity is in every layer, and 'elbow' may be in 'muscle' and
 * 'skeleton' layers.
 * This sets this.searchMatcher_ and this.searchToEntityIds_.
 * @param {o3v.EntityMetadata} metadata Metadata.
 * @private
 */
o3v.EntityModel.prototype.computeSearches_ = function (metadata) {
  var symmetries = metadata.getSymmetries();

  // Compute search table.
  for (var entityId in this.entities_) {
    entityId = +entityId;
    if (!this.nonSearchableEntityIds_[entityId]) {
      var names = metadata.getEntity(entityId).names.slice(0);
      // Use singular form as the primarywhen searching, for aesthetics.
      if (symmetries[entityId]) {
        names[0] = symmetries[entityId].singularName;
      }
      // TODO(dkogan): Expand this to be able to handle 'left lung'.
      names.forEach(
          function (name) {
            o3v.util.setIfUndefined(this.searchToEntityIds_, name, []);
            this.searchToEntityIds_[name].push(entityId);
          }, this);
    }
  }

  var searches = Object.keys(this.searchToEntityIds_);
  searches.sort(function (a, b) {
    return a.length - b.length;
  });

  this.autocompleteList_ = searches;
};

/**
 * Get a selectable entity by traversing the DAG up. This function tries to find
 * the smallest group of entities that includes the current entity, and is
 * selectable. In many cases, this is just the current entity. Note that no
 * guarantee is made about whether this is actually the smallst group - this
 * function is heuristical.
 * @param {number} entityId Entity id to start from.
 * @return {number} Entity id of the group.
 * @private
 */
// TODO(dkogan): Extend this function to generically unexplode entities.
// TODO(dkogan): Move this calculation into the pipeline.
o3v.EntityModel.prototype.getSelectable_ = function (entityId) {
  if (!this.unselectable_[entityId]) {
    return entityId;
  } else {
    // Recurse on parent id with fewest children.
    var parentIds = Object.keys(this.entities_[entityId].parentIds);

    var minCount = o3v.util.getObjectCount(this.getRootEntity().childIds) + 1;
    var minParentId = -1;
    parentIds.forEach(
        function (parentId) {
          var parent = this.entities_[parentId];
          var count = o3v.util.getObjectCount(parent.childIds);
          if (count < minCount) {
            minCount = count;
            minParentId = parentId;
          }
        }, this);
    if (minParentId == -1) {
      this.log_.error('Unable to find entity id under click.');
      return this.rootId_;
    } else {
      return this.getSelectable_(minParentId);
    }
  }
};

/**
 * Maps an external id to an internal id.
 * @param {string} externalId External id.
 * @return {number} The internal id.
 */
o3v.EntityModel.prototype.externalIdToId = function (externalId) {
  return this.getSelectable_(this.externalIdToId_[externalId]);
};

/**
 * Gets an entity object by id.
 * @param {number} entityId The id of the entity.
 * @return {Object} The entity.
 */
o3v.EntityModel.prototype.getEntity = function (entityId) {
  return this.entities_[entityId];
};

/**
 * Gets the root entity. (Entity, not just entity id.)
 * @return {Object} The root entity.
 */
o3v.EntityModel.prototype.getRootEntity = function () {
  return this.entities_[this.rootId_];
};

/**
 * Gets the set of leaf entities in any subtree.
 * @param {number} entityId The root of the subtree.
 * @return {Object.<number, boolean>} Set of leaf entity ids.
 */
o3v.EntityModel.prototype.getLeafIds = function (entityId) {
  var leafIds = {};
  var entity = this.entities_[entityId];
  if (!entity.childIds) {
    leafIds[entityId] = true;
    return leafIds;
  } else {
    for (var childId in entity.childIds) {
      o3v.util.extendObject(leafIds, this.getLeafIds(+childId));
    }
    return leafIds;
  }
};

/**
 * Checks to see if entity is splittable.
 * @param {number} entityId The entity to try to split.
 * @return {boolean} True if entity is splittable.
 */
o3v.EntityModel.prototype.isSplittable = function (entityId) {
  return !!this.getEntity(entityId).split_;
};

/**
 * Gets the minimal split of the entity. Returns undefined if no split is
 * possible.
 * @param {number} entityId The entity id to split.
 * @return {Object.<number, boolean>?} Entity ids into which to split.
 */
o3v.EntityModel.prototype.getSplit = function (entityId) {
  return this.getEntity(entityId).split_;
};

/** Gets layer names.
 * @return Array.<string> Layer names
 */
o3v.EntityModel.prototype.getLayerNames = function() {
  return this.layerNames_;
};

/**
 * Maps a layer name to id.
 * @param {string} layerName Name of the layer.
 * @return {number} Entity id of the layer.
 */
o3v.EntityModel.prototype.layerNameToId = function (layerName) {
  return this.layerNameToId_[layerName];
};

/**
 * Maps a search term to a set of matching entity ids.
 * @param {string} search The search term.
 * @return {Object.<number, boolean>?} Matching entity ids.
 */
o3v.EntityModel.prototype.searchToEntityIds = function (search) {
  return this.searchToEntityIds_[search];
};

/**
 * Gets the search matcher for this model.
 * @return {Array.<string>} Array of search strings.
 */
o3v.EntityModel.prototype.getAutocompleteList = function () {
  return this.autocompleteList_;
};

/**
 * Gets sublayer information. For explanation of datastructure, see
 * sublayers_ member in EntityMetadata.
 * @return {Object.<number, Array.<Array.<number>>>} Sublayers.
 */
o3v.EntityModel.prototype.getSublayers = function () {
  return this.sublayers_;
};
