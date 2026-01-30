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
 * @fileoverview Utility functions and miscellaneous items.
 */

/**
 * Debug mode
 */
o3v.LOG_NONE = 0;
o3v.LOG_ERROR = 1;
o3v.LOG_WARNING = 2;
o3v.LOG_INFO = 3;

o3v.LOG_LEVEL = o3v.LOG_INFO;

/**
 * Basic logging
 */
o3v.log = {
  info: function () {
    if (o3v.LOG_LEVEL >= o3v.LOG_INFO && window['console'] !== undefined) {
      var newArgs = ['INFO: '];
      for (var i = 0; i < arguments.length; i++) {
        newArgs[i+1] = arguments[i];
      }
      window['console'].log.apply(window['console'], newArgs);
    }
  },
  warning: function () {
    if (o3v.LOG_LEVEL >= o3v.LOG_WARNING && window['console'] !== undefined) {
      var newArgs = ['WARNING: '];
      for (var i = 0; i < arguments.length; i++) {
        newArgs[i+1] = arguments[i];
      }
      window['console'].log.apply(window['console'], newArgs);
    }
  },
  error: function () {
    if (o3v.LOG_LEVEL >= o3v.LOG_ERROR && window['console'] !== undefined) {
      var newArgs = ['ERROR: '];
      for (var i = 0; i < arguments.length; i++) {
        newArgs[i+1] = arguments[i];
      }
      window['console'].log.apply(window['console'], newArgs);
    }
  }
};

/**
 * UI settings
 */
o3v.uiSettings = {
  ZINDEX_VIEWER: 0,
  ZINDEX_MAINUI_STATUS_LOWER: 1,
  ZINDEX_MAINUI_STATUS_UPPER: 2,
  ZINDEX_MAINUI: 3
};

/**
 * Enum for handedness
 * @enum {number}
 * @private
 */
var HANDEDNESS_ = {
  LEFT: 0,
  RIGHT: 1
};

/**
 * Grows a bounding box to encompass another bounding box. If
 * original is undefined, it is created as a copy of addition.
 * If original is defined, it's modified in place.
 * @param {Array|Float32Array} original Original bounding box.
 * @param {Array|Float32Array} addition Bounding box to add to original.
 * @return {Array|Float32Array} original (modified in place as well).
 */
o3v.growBBox = function (original, addition) {
  if (original === undefined) {
    return addition.slice(0);
  } else {
    if (original[0] > addition[0]) {
      original[0] = addition[0];
    }
    if (original[1] > addition[1]) {
      original[1] = addition[1];
    }
    if (original[2] > addition[2]) {
      original[2] = addition[2];
    }
    if (original[3] < addition[3]) {
      original[3] = addition[3];
    }
    if (original[4] < addition[4]) {
      original[4] = addition[4];
    }
    if (original[5] < addition[5]) {
      original[5] = addition[5];
    }
    return original;
  }
};

// General utilities.
o3v.util = {};

o3v.util.isEmpty = function(obj) {
  return (Object.keys(obj).length === 0);
};

o3v.util.isArray = function(val) {
  return (Object.prototype.toString.call(val) === '[object Array]');
};

o3v.util.cloneObject = function(obj) {
  // Shallow copy. For deep, change to $.extend(true, {}, obj).
  return $.extend({}, obj);
};

o3v.util.extendObject = function(target, var_args) {
  return $.extend(target, var_args);
};

o3v.util.objectContains = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true;
    }
  }
  return false;
};

o3v.util.getObjectCount = function(obj) {
  return Object.keys(obj).length;
};

o3v.util.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};

o3v.util.createSet = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && o3v.util.isArray(arguments[0])) {
    return o3v.util.createSet.apply(null, arguments[0]);
  }

  var rv = {};
  for (var i = 0; i < argLength; i++) {
    rv[arguments[i]] = true;
  }
  return rv;
};

o3v.util.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : (obj[key] = value);
};

o3v.util.isDef = function(val) {
  return typeof val != 'undefined';
};

////////////////////////////////////////////////////////////////////////////////
// goog.math.Bezier, imported from Google Closure.

goog = {};
goog.math = {};

/**
 * Object representing a cubic bezier curve.
 * @param {number} x0 X coordinate of the start point.
 * @param {number} y0 Y coordinate of the start point.
 * @param {number} x1 X coordinate of the first control point.
 * @param {number} y1 Y coordinate of the first control point.
 * @param {number} x2 X coordinate of the second control point.
 * @param {number} y2 Y coordinate of the second control point.
 * @param {number} x3 X coordinate of the end point.
 * @param {number} y3 Y coordinate of the end point.
 * @constructor
 */
goog.math.Bezier = function(x0, y0, x1, y1, x2, y2, x3, y3) {
  /**
   * X coordinate of the first point.
   * @type {number}
   */
  this.x0 = x0;

  /**
   * Y coordinate of the first point.
   * @type {number}
   */
  this.y0 = y0;

  /**
   * X coordinate of the first control point.
   * @type {number}
   */
  this.x1 = x1;

  /**
   * Y coordinate of the first control point.
   * @type {number}
   */
  this.y1 = y1;

  /**
   * X coordinate of the second control point.
   * @type {number}
   */
  this.x2 = x2;

  /**
   * Y coordinate of the second control point.
   * @type {number}
   */
  this.y2 = y2;

  /**
   * X coordinate of the end point.
   * @type {number}
   */
  this.x3 = x3;

  /**
   * Y coordinate of the end point.
   * @type {number}
   */
  this.y3 = y3;
};


/**
 * Constant used to approximate ellipses.
 * See: http://canvaspaint.org/blog/2006/12/ellipse/
 * @type {number}
 */
goog.math.Bezier.KAPPA = 4 * (Math.sqrt(2) - 1) / 3;


/**
 * @return {!goog.math.Bezier} A copy of this curve.
 */
goog.math.Bezier.prototype.clone = function() {
  return new goog.math.Bezier(this.x0, this.y0, this.x1, this.y1, this.x2,
      this.y2, this.x3, this.y3);
};


/**
 * Test if the given curve is exactly the same as this one.
 * @param {goog.math.Bezier} other The other curve.
 * @return {boolean} Whether the given curve is the same as this one.
 */
goog.math.Bezier.prototype.equals = function(other) {
  return this.x0 == other.x0 && this.y0 == other.y0 && this.x1 == other.x1 &&
         this.y1 == other.y1 && this.x2 == other.x2 && this.y2 == other.y2 &&
         this.x3 == other.x3 && this.y3 == other.y3;
};


/**
 * Modifies the curve in place to progress in the opposite direction.
 */
goog.math.Bezier.prototype.flip = function() {
  var temp = this.x0;
  this.x0 = this.x3;
  this.x3 = temp;
  temp = this.y0;
  this.y0 = this.y3;
  this.y3 = temp;

  temp = this.x1;
  this.x1 = this.x2;
  this.x2 = temp;
  temp = this.y1;
  this.y1 = this.y2;
  this.y2 = temp;
};


/**
 * Computes the curve at a point between 0 and 1.
 * @param {number} t The point on the curve to find.
 * @return {!goog.math.Coordinate} The computed coordinate.
 */
goog.math.Bezier.prototype.getPoint = function(t) {
  // Special case start and end
  if (t == 0) {
    return new goog.math.Coordinate(this.x0, this.y0);
  } else if (t == 1) {
    return new goog.math.Coordinate(this.x3, this.y3);
  }

  // Step one - from 4 points to 3
  var ix0 = goog.math.lerp(this.x0, this.x1, t);
  var iy0 = goog.math.lerp(this.y0, this.y1, t);

  var ix1 = goog.math.lerp(this.x1, this.x2, t);
  var iy1 = goog.math.lerp(this.y1, this.y2, t);

  var ix2 = goog.math.lerp(this.x2, this.x3, t);
  var iy2 = goog.math.lerp(this.y2, this.y3, t);

  // Step two - from 3 points to 2
  ix0 = goog.math.lerp(ix0, ix1, t);
  iy0 = goog.math.lerp(iy0, iy1, t);

  ix1 = goog.math.lerp(ix1, ix2, t);
  iy1 = goog.math.lerp(iy1, iy2, t);

  // Final step - last point
  return new goog.math.Coordinate(goog.math.lerp(ix0, ix1, t),
      goog.math.lerp(iy0, iy1, t));
};


/**
 * Changes this curve in place to be the portion of itself from [t, 1].
 * @param {number} t The start of the desired portion of the curve.
 */
goog.math.Bezier.prototype.subdivideLeft = function(t) {
  if (t == 1) {
    return;
  }

  // Step one - from 4 points to 3
  var ix0 = goog.math.lerp(this.x0, this.x1, t);
  var iy0 = goog.math.lerp(this.y0, this.y1, t);

  var ix1 = goog.math.lerp(this.x1, this.x2, t);
  var iy1 = goog.math.lerp(this.y1, this.y2, t);

  var ix2 = goog.math.lerp(this.x2, this.x3, t);
  var iy2 = goog.math.lerp(this.y2, this.y3, t);

  // Collect our new x1 and y1
  this.x1 = ix0;
  this.y1 = iy0;

  // Step two - from 3 points to 2
  ix0 = goog.math.lerp(ix0, ix1, t);
  iy0 = goog.math.lerp(iy0, iy1, t);

  ix1 = goog.math.lerp(ix1, ix2, t);
  iy1 = goog.math.lerp(iy1, iy2, t);

  // Collect our new x2 and y2
  this.x2 = ix0;
  this.y2 = iy0;

  // Final step - last point
  this.x3 = goog.math.lerp(ix0, ix1, t);
  this.y3 = goog.math.lerp(iy0, iy1, t);
};


/**
 * Changes this curve in place to be the portion of itself from [0, t].
 * @param {number} t The end of the desired portion of the curve.
 */
goog.math.Bezier.prototype.subdivideRight = function(t) {
  this.flip();
  this.subdivideLeft(1 - t);
  this.flip();
};


/**
 * Changes this curve in place to be the portion of itself from [s, t].
 * @param {number} s The start of the desired portion of the curve.
 * @param {number} t The end of the desired portion of the curve.
 */
goog.math.Bezier.prototype.subdivide = function(s, t) {
  this.subdivideRight(s);
  this.subdivideLeft((t - s) / (1 - s));
};


/**
 * Computes the position t of a point on the curve given its x coordinate.
 * That is, for an input xVal, finds t s.t. getPoint(t).x = xVal.
 * As such, the following should always be true up to some small epsilon:
 * t ~ solvePositionFromXValue(getPoint(t).x) for t in [0, 1].
 * @param {number} xVal The x coordinate of the point to find on the curve.
 * @return {number} The position t.
 */
goog.math.Bezier.prototype.solvePositionFromXValue = function(xVal) {
  // Desired precision on the computation.
  var epsilon = 1e-6;

  // Initial estimate of t using linear interpolation.
  var t = (xVal - this.x0) / (this.x3 - this.x0);
  if (t <= 0) {
    return 0;
  } else if (t >= 1) {
    return 1;
  }

  // Try gradient descent to solve for t. If it works, it is very fast.
  var tMin = 0;
  var tMax = 1;
  for (var i = 0; i < 8; i++) {
    var value = this.getPoint(t).x;
    var derivative = (this.getPoint(t + epsilon).x - value) / epsilon;
    if (Math.abs(value - xVal) < epsilon) {
      return t;
    } else if (Math.abs(derivative) < epsilon) {
      break;
    } else {
      if (value < xVal) {
        tMin = t;
      } else {
        tMax = t;
      }
      t -= (value - xVal) / derivative;
    }
  }

  // If the gradient descent got stuck in a local minimum, e.g. because
  // the derivative was close to 0, use a Dichotomy refinement instead.
  // We limit the number of interations to 8.
  for (var i = 0; Math.abs(value - xVal) > epsilon && i < 8; i++) {
    if (value < xVal) {
      tMin = t;
      t = (t + tMax) / 2;
    } else {
      tMax = t;
      t = (t + tMin) / 2;
    }
    value = this.getPoint(t).x;
  }
  return t;
};

/**
 * Computes the y coordinate of a point on the curve given its x coordinate.
 * @param {number} xVal The x coordinate of the point on the curve.
 * @return {number} The y coordinate of the point on the curve.
 */
goog.math.Bezier.prototype.solveYValueFromXValue = function(xVal) {
  return this.getPoint(this.solvePositionFromXValue(xVal)).y;
};

/**
 * Class for representing coordinates and positions.
 * @param {number=} opt_x Left, defaults to 0.
 * @param {number=} opt_y Top, defaults to 0.
 * @constructor
 */
goog.math.Coordinate = function(opt_x, opt_y) {
  /**
   * X-value
   * @type {number}
   */
  this.x = o3v.util.isDef(opt_x) ? opt_x : 0;

  /**
   * Y-value
   * @type {number}
   */
  this.y = o3v.util.isDef(opt_y) ? opt_y : 0;
};


/**
 * Returns a new copy of the coordinate.
 * @return {!goog.math.Coordinate} A clone of this coordinate.
 */
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y);
};


if (goog.DEBUG) {
  /**
   * Returns a nice string representing the coordinate.
   * @return {string} In the form (50, 73).
   */
  goog.math.Coordinate.prototype.toString = function() {
    return '(' + this.x + ', ' + this.y + ')';
  };
}


/**
 * Compares coordinates for equality.
 * @param {goog.math.Coordinate} a A Coordinate.
 * @param {goog.math.Coordinate} b A Coordinate.
 * @return {boolean} True iff the coordinates are equal, or if both are null.
 */
goog.math.Coordinate.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.x == b.x && a.y == b.y;
};


/**
 * Returns the distance between two coordinates.
 * @param {!goog.math.Coordinate} a A Coordinate.
 * @param {!goog.math.Coordinate} b A Coordinate.
 * @return {number} The distance between {@code a} and {@code b}.
 */
goog.math.Coordinate.distance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};


/**
 * Returns the squared distance between two coordinates. Squared distances can
 * be used for comparisons when the actual value is not required.
 *
 * Performance note: eliminating the square root is an optimization often used
 * in lower-level languages, but the speed difference is not nearly as
 * pronounced in JavaScript (only a few percent.)
 *
 * @param {!goog.math.Coordinate} a A Coordinate.
 * @param {!goog.math.Coordinate} b A Coordinate.
 * @return {number} The squared distance between {@code a} and {@code b}.
 */
goog.math.Coordinate.squaredDistance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return dx * dx + dy * dy;
};


/**
 * Returns the difference between two coordinates as a new
 * goog.math.Coordinate.
 * @param {!goog.math.Coordinate} a A Coordinate.
 * @param {!goog.math.Coordinate} b A Coordinate.
 * @return {!goog.math.Coordinate} A Coordinate representing the difference
 *     between {@code a} and {@code b}.
 */
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};


/**
 * Returns the sum of two coordinates as a new goog.math.Coordinate.
 * @param {!goog.math.Coordinate} a A Coordinate.
 * @param {!goog.math.Coordinate} b A Coordinate.
 * @return {!goog.math.Coordinate} A Coordinate representing the sum of the two
 *     coordinates.
 */
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y);
};

/**
 * Performs linear interpolation between values a and b. Returns the value
 * between a and b proportional to x (when x is between 0 and 1. When x is
 * outside this range, the return value is a linear extrapolation).
 * @param {number} a
 * @param {number} b
 * @param {number} x The proportion between a and b
 * @return {number} The interpolated value between a and b
 */
goog.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};

// Shim layer with setTimeout fallback, adapted from:
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback, unused_dom) {
    window.setTimeout(callback, 16);  // 16ms ~ 60Hz
  };

// XMLHttpRequest stuff for loader.js.
function getHttpRequest(url, onload, opt_onprogress) {
  var req = new XMLHttpRequest();
  req.onload = function(e) { onload(req, e); };
  if (opt_onprogress) {
    req.onprogress = function(e) {
      opt_onprogress(req, e);
    };
  }
  req.open('GET', url, true);
  req.send(null);
}
