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
 * @fileoverview JavaScript to for smooth interpolation.
 *
 */

/**
 * @param {number} value
 * @param {?Array} opt_registrar
 * @constructor
 */
o3v.Interpolant = function(value, opt_registrar, opt_constraint) {
  this.past_ = value;
  this.present_ = value;
  this.future_ = value;
  this.urgency_ = 0.25;
  this.constraint_ = opt_constraint;
  this.EPSILON = 0.001;

  if (opt_registrar) opt_registrar.push(this);
};

/**
 * @return {number}
 */
o3v.Interpolant.prototype.getPresent = function() {
  return this.present_;
};

/**
 * @return {number}
 */
o3v.Interpolant.prototype.getFuture = function() {
  return this.future_;
};

/**
 * @param {number} value
 * @param {?number} opt_urgency
 */
o3v.Interpolant.prototype.setFuture = function(value, opt_urgency) {
  this.future_ = value;
  if (opt_urgency) {
    this.urgency_ = opt_urgency;
  }
};


/**
 * @param {number} value
 */
o3v.Interpolant.prototype.reset = function(value) {
  this.past_ = value;
  this.present_ = value;
  this.future_ = value;
};

o3v.Interpolant.prototype.setFutureDelta = function(value, opt_urgency) {
  this.setFuture(this.future_ + value, opt_urgency);
}

/**
 * @return {boolean} needs update?
 */
o3v.Interpolant.prototype.tween = function() {
  var force_redraw = false;
  if (this.constraint_) {
    force_redraw = this.constraint_(this);
  }
  // TODO(wonchun): compose this logic into constraint_
  if (Math.abs(this.future_ - this.present_) < this.EPSILON) {
    this.past_ = this.future_;
    this.present_ = this.future_;
    return force_redraw;
  }
  var b = new goog.math.Bezier(this.past_, 0,
                               2*this.present_ - this.past_, 0,
                               2*this.future_ - this.present_, 0,
                               this.future_, 0);
  this.past_ = this.present_;
  this.present_ = b.getPoint(this.urgency_).x;
  return true;
};

/**
 * @return {boolean} needs update
 */
o3v.Interpolant.tweenAll = function(array) {
  var ret = false;
  array.forEach(function(i) { ret |= i.tween(); });
  return ret;
};
