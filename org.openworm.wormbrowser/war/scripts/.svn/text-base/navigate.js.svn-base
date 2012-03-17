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
 * @fileoverview JavaScript to navigate.
 */

// TODO(dkogan): Replace this with generic functions in the mat4 namespace.
o3v.math = {};
/**
 * Subtracts two vectors.
 * @param {!tdl.math.Vector} a Operand vector.
 * @param {!tdl.math.Vector | Float32Array} b Operand vector.
 * @return {!tdl.math.Vector} The difference of a and b.
 */
o3v.math.subVector = function(a, b) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = a[i] - b[i];
  return r;
};
/**
 * Converts degrees to radians.
 * @param {number} degrees A value in degrees.
 * @return {number} the value in radians.
 */
o3v.math.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
};

/**
 * Computes the dot product of two vectors; assumes that a and b have
 * the same dimension.
 * @param {!tdl.math.Vector} a Operand vector.
 * @param {!tdl.math.Vector} b Operand vector.
 * @return {number} The dot product of a and b.
 */
o3v.math.dot = function(a, b) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r += a[i] * b[i];
  return r;
};
/**
 * Computes the cross product of two vectors; assumes both vectors have
 * three entries.
 * @param {!tdl.math.Vector} a Operand vector.
 * @param {!tdl.math.Vector} b Operand vector.
 * @return {!tdl.math.Vector} The vector a cross b.
 */
o3v.math.cross = function(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
};
/**
 * Divides a vector by its Euclidean length and returns the quotient.
 * @param {!tdl.math.Vector} a The vector.
 * @return {!tdl.math.Vector} The normalized vector.
 */
o3v.math.normalize = function(a) {
  var r = [];
  var n = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    n += a[i] * a[i];
  n = Math.sqrt(n);
  if (n > 0.00001) {
    for (var i = 0; i < aLength; ++i)
      r[i] = a[i] / n;
  } else {
    r = [0,0,0];
  }
  return r;
};

o3v.Navigator = function(changeCallback, canvas, history) {
  this.changeCallback_ = changeCallback;
  this.canvas_ = canvas;
  this.rootBbox_ = null;

  this.camera = {};
  this.originCamera = {};

  // When to start doing capsule top rotation
  this.rotationStartPercent = 0.01;
  this.entityCapsule = false;

  this.interpolants = [];
  this.dolly = {};
  this.theta = {};
  this.phi = 0;

  // Constants for reducing the deltas for movement
  this.rotationReduction = 0.01;
  this.zoomReduction = 0.05;
  this.verticalReduction = 0.1;

  // Constants for limits on movement
  this.verticalAdjustmentPercent = 0.9;
  this.verticalAdjustment = 100;   // set in setNavParameters
  this.vertMaxLimit = {};          // set in setNavParameters, init 150
  this.vertMinLimit = {};          // set in setNavParameters, init 0
  this.zoomNearLimit = -10; //0.1;        // set in setNavParameters
  this.zoomFarLimit = 250;         // set in setNavParameters
  this.startPan = 0.1;
  this.center = [0, 0, 0];         // set in setNavParameters, init 0,0,0
  this.cameraTargetX = {};
  this.cameraTargetY = {};
  this.cameraTargetZ = {};
  this.z_dist = 0;

  // variables for making default views look good
  this.sagittalPlane = 0;
  this.coronalPlane = -1;
  this.artisticOffset = .2;
  this.lengthRatioComparison = .75;

  // variables for dealing with varying sized entities
  this.minimumCapsuleHeight = 3;
  this.minZoomValue = 10.0;
  this.maxZoomValue = 100.0;
  this.zoomAmplificationFactor = 1.5;
  this.zoomPercent = 0.75;

  // Math constants
  // TODO(dkogan): Pull these out into the class instead of per-object.
  this.M_PI = Math.PI;
  this.M_2PI = 2 * Math.PI;

  // Initialize.
  this.theta = new o3v.Interpolant(Math.PI / 2, this.interpolants);
  this.dolly.x = new o3v.Interpolant(0.0, this.interpolants);
  this.dolly.y = new o3v.Interpolant(120.0, this.interpolants);
  this.dolly.z = new o3v.Interpolant(160.0, this.interpolants);

  this.initializeCamera();

  // Register with history.
  this.state_ = '';
  this.history = history;
  this.history.register('nav',
                        this.getState.bind(this), this.restoreState.bind(this));
};

o3v.Navigator.prototype.getCamera = function() {
  return this.camera;
};

o3v.Navigator.prototype.setOriginCameraAndModelRoot = function(rootBbox) {
  // Save the original camera for reset and for offsets with calculations
  var cx = 0.5 * (rootBbox[3] + rootBbox[0]);
  var cy = 0.5 * (rootBbox[4] + rootBbox[1]);
  var cz = 0.5 * (rootBbox[5] + rootBbox[2]);
  // A reasonable z value for eye because we need a default.
  this.camera = { eye: new Float32Array([cx, cy, 160]),
                        target: new Float32Array([cx, cy, cz]),
                        up: new Float32Array([0, 1, 0]),
                        fov: 40};
  this.resetModel(rootBbox);
};

o3v.Navigator.prototype.resetModel = function(rootBbox) {
  this.rootBbox_ = rootBbox;
  this.resetNavParameters();
};

// Resets the camera to the original position
o3v.Navigator.prototype.reset = function(addToHistory) {
  var nav_vals = this.calculateNavigateValues(this.rootBbox_);
  this.doNavigate(nav_vals.x, nav_vals.y, nav_vals.z, addToHistory);
  this.resetNavParameters();
};

o3v.Navigator.prototype.initializeCamera = function() {
  this.vertMaxLimit = new o3v.Interpolant(150.0, this.interpolants);
  this.vertMinLimit = new o3v.Interpolant(0.0, this.interpolants);
  this.cameraTargetX = new o3v.Interpolant(0.0, this.interpolants);
  this.cameraTargetY = new o3v.Interpolant(0.0, this.interpolants);
  this.cameraTargetZ = new o3v.Interpolant(0.0, this.interpolants);
  this.setOriginCameraAndModelRoot([-200,-200,-200,-200,-200,-200]);
};

o3v.Navigator.prototype.setNavParametersToBbox = function(bbox) {
  var center = new Float32Array(3);
  center[0] = 0.5 * (bbox[0] + bbox[3]);
  center[1] = 0.5 * (bbox[1] + bbox[4]);
  center[2] = 0.5 * (bbox[2] + bbox[5]);
  this.setNavParameters(bbox[4],
                        bbox[1],
                        this.zoomNearLimit,
                        this.zoomFarLimit,
                        center,
                        0);
};

// Puts in the camera default parameters for the full body
o3v.Navigator.prototype.resetNavParameters = function() {
  var bbox = this.rootBbox_;
  if (!bbox) {
    return;
  }
  this.setNavParametersToBbox(bbox);
  this.changeCallback_(true);
};

o3v.Navigator.prototype.setNavParameters = function(verticalMaxLimit_input,
                                                    verticalMinLimit_input,
                                                    zoomNearLimit_input,
                                                    zoomFarLimit_input,
                                                    center_input,
                                                    z_dist_input) {
  var vMaxLimit = verticalMaxLimit_input;
  var vMinLimit = verticalMinLimit_input;
  var span = verticalMaxLimit_input - verticalMinLimit_input;
  if (span < this.minimumCapsuleHeight) {
    var difference = (this.minimumCapsuleHeight - span) / 2;
    vMaxLimit = vMaxLimit + difference;
    vMinLimit = vMinLimit - difference;
  }
  this.vertMaxLimit.setFuture(vMaxLimit);
  this.vertMinLimit.setFuture(vMinLimit);
  this.verticalAdjustment = (this.verticalAdjustmentPercent *
                             (verticalMaxLimit_input - verticalMinLimit_input));
  this.zoomNearLimit = zoomNearLimit_input;
  this.zoomFarLimit = zoomFarLimit_input;
  var cx = center_input[0];
  var cy = center_input[1];
  var cz = center_input[2];
  this.cameraTargetX.setFuture(cx);
  this.cameraTargetY.setFuture(cy);
  this.cameraTargetZ.setFuture(cz);
  this.center = center_input;
  this.z_dist = z_dist_input;
};

// Returns string representing current state.
o3v.Navigator.prototype.getState = function() {
    return this.state_;
};

// Restores state.
o3v.Navigator.prototype.restoreState = function(state) {
  if (state) {
    var tuple = state.split(',');
    this.doNavigate(parseFloat(tuple[0]),
                    parseFloat(tuple[1]),
                    parseFloat(tuple[2]), false);
  } else {
    this.reset(false);
  }
};

o3v.Navigator.prototype.projectedMinMax = function(bbox, projectionVector) {
  var verts = [[bbox[0], bbox[1], bbox[2]],
               [bbox[0], bbox[4], bbox[2]],
               [bbox[0], bbox[1], bbox[5]],
               [bbox[0], bbox[4], bbox[5]],
               [bbox[3], bbox[1], bbox[2]],
               [bbox[3], bbox[4], bbox[2]],
               [bbox[3], bbox[1], bbox[5]],
               [bbox[3], bbox[4], bbox[5]]];

  var proj = [];
  for (var v = 0; v < 8; v++) {
    var vertVector = o3v.math.subVector(verts[v], this.camera.eye);
    proj[v] = o3v.math.dot(projectionVector, vertVector);
  }

  var maxVal = -Number.MAX_VALUE;
  var minVal = Number.MAX_VALUE;
  for (var v = 0; v < 8; v++) {
    maxVal = Math.max(maxVal, proj[v]);
    minVal = Math.min(minVal, proj[v]);
  }

  return maxVal - minVal;
};

o3v.Navigator.prototype.unifyBoundingBoxes = function(entityIdToEntity) {
  var bbox;
  o3v.log.info('focusing on entities', entityIdToEntity);
  o3v.util.forEach(entityIdToEntity, function(entity) {
      bbox = o3v.growBBox(bbox, entity.bbox);
    });
  return bbox;
};

o3v.Navigator.prototype.focusOnEntities = function(entityIdToEntity) {
  var bbox;
  if (o3v.util.isEmpty(entityIdToEntity)) {
    o3v.log.info('focusOnEntities empty; resetting view');
    this.resetNavParameters();
  } else {
    o3v.log.info('focusing on entities', entityIdToEntity);

    bbox = this.unifyBoundingBoxes(entityIdToEntity);
    this.setNavParametersToBbox(bbox);
  }
  return bbox;
};

o3v.Navigator.prototype.goToBBox = function(bbox, opt_verticalOnly) {
  var nav_vals = this.calculateNavigateValues(bbox, opt_verticalOnly);
  this.doNavigate(nav_vals.x, nav_vals.y, nav_vals.z, false);
};

o3v.Navigator.prototype.calculateNavigateValues = function(bbox, opt_verticalOnly) {
  // lengths
  var dx = bbox[0] - bbox[3];
  var dy = bbox[1] - bbox[4];
  var dz = bbox[2] - bbox[5];

  // centers
  o3v.log.info('center', this.center);
  var cx = 0.5 * (bbox[0] + bbox[3]);
  var cy = 0.5 * (bbox[1] + bbox[4]);
  var cz = 0.5 * (bbox[2] + bbox[5]);

  var dYAxis = Math.sqrt(cx * cx + cz * cz);

  // axes: x goes right
  //       y goes up
  //       z toward viewer

  // x = angle around the y axis
  // y = height
  // z = zoom
  var x = Math.atan2(dx, dz);
  var lengthRatio = dx / dz;
  o3v.log.info('ratio: ', lengthRatio);
  o3v.log.info('cz: ', cz);
  if (lengthRatio > this.lengthRatioComparison) {
    // We are greater in the x direction so look head on
    x = Math.PI / 2;
    // if we're behind, look from behind
    if (cz < this.coronalPlane) {
      x = -Math.PI / 2;
    }
  }
  else {
    x = 0;
    if (cx < this.sagittalPlane) {
      x = Math.PI;
    }
  }
  //determine the artistic offset
  if ((lengthRatio > 1 && cx > this.sagittalPlane) ||
      (lengthRatio < 1 && cx < this.sagittalPlane)) {
    x -= this.artisticOffset;
  }
  else {
    x += this.artisticOffset;
  }

  // ideal Y
  var projectedHeight = this.projectedMinMax(bbox, this.camera.up);
  var y_angle = this.zoomPercent * o3v.math.degToRad(this.camera.fov);
  var zy_dist = projectedHeight / Math.tan(y_angle);

  // ideal X
  var sideVector = o3v.math.cross(this.camera.up,
                                  o3v.math.subVector(this.camera.eye,
                                                     this.camera.target));
  sideVector = o3v.math.normalize(sideVector);
  var projectedWidth = this.projectedMinMax(bbox, sideVector);
  var x_angle = this.zoomPercent * o3v.math.degToRad(
      this.camera.fov *
      this.canvas_['clientWidth'] / this.canvas_['clientHeight']);

  var zx_dist = projectedWidth / Math.tan(x_angle);

  var z_dist = Math.max(zy_dist, zx_dist);

  // Normalize between 0 and 1
  var normalizedZoom = ((z_dist - this.minZoomValue) /
                        (this.maxZoomValue - this.minZoomValue));
  normalizedZoom = Math.max(0, Math.min(1, normalizedZoom));

  // Renormalize to account for the disired zoom factor for small entities
  var reNormalizedZoom = ((normalizedZoom *
                           (1 - 1 / this.zoomAmplificationFactor)) +
                          1 / this.zoomAmplificationFactor);

  // Divide by the renormalized value to take into account small entities
  var clampedZoom = Math.max(this.minZoomValue, z_dist);
  var finalZoom = clampedZoom / reNormalizedZoom;

  var y_value = cy;
  var zoom_radius = dYAxis + finalZoom;

  // TODO(dkogan|rlp): Make this hack cleaner.
  if (opt_verticalOnly) {
    x = this.theta.getFuture();
    zoom_radius = this.dolly.z.getFuture();
  }

  return {x: x, y: y_value, z: zoom_radius};
};

// Clamps a value between -absLimit and absLimit. Useful for clamping rotation
// in two different directions
o3v.Navigator.prototype.absClamp = function(value, absLimit) {
  var val = value;
  if (val > absLimit)
    val = absLimit;
  else if (val < -absLimit)
    val = -absLimit;
  return val;
};

// The opposite of absClamp: if the current value is between -absLimit and
// absLimit then it returns the newValue. Useful for ignoring a value until
// it reaches a certain threshold.
o3v.Navigator.prototype.absLimit = function(value, absLimit, newValue) {
  if (value < absLimit && value > -absLimit)
    return newValue;
  return value;
};

o3v.Navigator.prototype.recalculate = function() {
  var anyUpdates = o3v.Interpolant.tweenAll(this.interpolants);
  // Camera rotates and translates around the body. Body always considered
  // to be at the origin.
  var angle = this.theta.getPresent();
  var z_val = this.dolly.z.getPresent();
  var y_val = this.dolly.y.getPresent();
  var verticalMaxLimit = this.vertMaxLimit.getPresent();
  var verticalMinLimit = this.vertMinLimit.getPresent();

  // this.center[0] = this.center[2] = 0 for normal position
  var cx = z_val * Math.cos(angle) + this.cameraTargetX.getPresent();
  var cy = y_val;
  var cz = z_val * Math.sin(angle) + this.cameraTargetZ.getPresent();
  var ty = y_val;
  var verticalPanLimit = verticalMaxLimit - verticalMinLimit;
  var rotLimit = this.rotationStartPercent * verticalPanLimit;

  var phi_multiplier = 0;
  var vertDist = cy;
  var topStartRotation = verticalMaxLimit - rotLimit;
  var bottomStartRotation = verticalMinLimit + rotLimit;

  // Determine if we're in the top hemisphere or lower hemisphere
  if (cy < bottomStartRotation) {
    phi_multiplier = -1;
    ty = bottomStartRotation;
    vertDist = this.absClamp(rotLimit + (verticalMinLimit - cy),
                             this.verticalAdjustment + rotLimit);
  } else if (cy > topStartRotation) {
    phi_multiplier = 1;
    ty = topStartRotation;
    vertDist = this.absClamp(rotLimit - (verticalMaxLimit - cy),
                             this.verticalAdjustment + rotLimit);
  }
  // If we are in a hemisphere, adjust our camera accordingly
  // TODO(rlp): This kills off capsule mode, but capsule mode is killing us
  //            during transitions, and I don't know how to make it not happen
  //            during those. Please fix and reinstate.
  if (phi_multiplier) {
    var phi = (phi_multiplier * Math.PI / 2 *
               (vertDist / (this.verticalAdjustment + rotLimit)));
    // Fix camera position to account for rotation
    cx *= Math.cos(phi);
    cy = ty + z_val * Math.sin(phi);
    cz *= Math.cos(phi);

    var up_phi = Math.PI / 2 - phi;
    this.camera.up = [-Math.cos(angle) * Math.cos(up_phi),
                      Math.sin(up_phi),
                      -Math.sin(angle) * Math.cos(up_phi)];
  }
  else {
    this.camera.up = [0, 1, 0];
  }
  // TODO(rlp): If arcball do something different -- different target
  this.camera.eye = [cx, cy, cz];
  this.camera.target = [this.center[0], ty, this.center[2]];

  return anyUpdates;
};

// Navigates to a location.
// This function is ultimately always called if we change something so we call
// recalculate and tell the renderer to update
o3v.Navigator.prototype.doNavigate = function(angle, y, zoom, addToHistory,
                                              opt_camera_scale) {
  this.theta.setFuture(angle);

  var camera_scale = (opt_camera_scale) ? opt_camera_scale : 1;

  var verticalLowerLimit = (this.vertMinLimit.getFuture() -
                            this.verticalAdjustment);
  var verticalUpperLimit = (this.vertMaxLimit.getFuture() +
                            this.verticalAdjustment);

  if (y < verticalLowerLimit) {
    y = verticalLowerLimit;
  }
  if (y > verticalUpperLimit) {
    y = verticalUpperLimit;
  }
  this.dolly.y.setFuture(y);

  if (zoom < this.zoomNearLimit) {
    zoom = this.zoomNearLimit;
  }
  if (zoom > this.zoomFarLimit) {
    zoom = this.zoomFarLimit;
  }
  this.dolly.z.setFuture(zoom);

  this.changeCallback_();

  // Set up with history.
  this.state_ = [Math.round(angle * 100) / 100,
                 Math.round(y * 100) / 100,
                 Math.round(zoom * 100) / 100].join(',');
  if (addToHistory) {
    this.history.update();
  }
};

// Navigates to an offset from the current location.
o3v.Navigator.prototype.doNavigateDelta = function(dx, dy, dz, addToHistory) {
  var camera_scale = this.dolly.z.getPresent() / 80;
  this.doNavigate(
      this.theta.getFuture() + camera_scale * dx,
      this.dolly.y.getFuture() + camera_scale * dy,
      this.dolly.z.getFuture() + camera_scale * dz,
      addToHistory,
      camera_scale);
};

// The primary drag function. It is split into two parts, one for arcball and
// one for schwarma.
// TODO(rlp): There seems to be some lag here: triage/diagnose.
o3v.Navigator.prototype.drag = function(dx, dy, dz) {
  // We modulate the deltas by constants to make the movement less jumpy
  var deltaRotate = this.rotationReduction * dx;
  var deltaPan = this.verticalReduction * dy;
  // We limit the delta for panning so that it only occurs if the user
  // really intends it to. This eliminates the sort of "bouncy" motion
  // while rotating.
  deltaPan = this.absLimit(deltaPan, this.startPan, 0);
  this.doNavigateDelta(deltaRotate, deltaPan, 0, true);
};

// Takes care of the scrolling by changing the z component of our camera
o3v.Navigator.prototype.scroll = function(dx, dy) {
  this.doNavigateDelta(0, 0, -dy * this.zoomReduction, true);
};

// Angle constraint for rotation angle interpolants
o3v.Navigator.prototype.interpolantAngleConstraint = function(i) {
  if (i.present_ > this.M_PI) {
    i.present_ -= this.M_2PI;
    i.future_ -= this.M_2PI;
  } else if (i.present_ < -this.M_PI) {
    i.present_ += this.M_2PI;
    i.future_ += this.M_2PI;
  }
  return false;
};

// Over constraint for rotation angle interpolants
o3v.Navigator.prototype.interpolantOverConstraint = function(soft, hard) {
  var scale = 0.75 / (soft - hard);
  return function(i) {
    if (i.future_ < hard) {
      i.future_ = hard;
    }
    if (i.future_ < soft) {
      if (i.future_ >= (soft - o3v.Interpolant['EPSILON'])) {
        i.future_ = soft;
        return false;
      }
      var hard_factor = (1 - hard + i.future_);
      i.future_ += scale * hard_factor * (soft - i.future_);
      return true;
    }
    return false;
  };
};
