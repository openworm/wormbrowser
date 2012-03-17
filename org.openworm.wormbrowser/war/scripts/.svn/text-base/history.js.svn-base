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
 * @fileoverview Code to make and keep track of hash changes.
 */

/**
 * History object. Tracks history using the url hash tag, enables restoring
 * deep links into the application, and navigating using back/forward.
 * @param {Window!} win Window object. Passed in so it can be mocked out in
 *                     test.
 * @constructor
 */
o3v.History = function(win) {
  /**
   * Window object. Used for timeouts, and to set the hash.
   * @type {Window}
   * @private
   */
  this.window_ = win;

  /**
   * Registry of callabacks to save and restore state.
   * { '<component>' : [ <getStateCallback>, <restoreStateCallback> ] }
   * @type {Object.<string,Array.<Function>>}
   * @private
   */
  this.registry_ = {};
};

/**
 * Index of function to get state in the callback registry.
 * @type {number}
 * @const
 * @private
 */
o3v.History.GET_STATE_ = 0;

/**
 * Index of function to restore state in the callback registry.
 * @type {number}
 * @const
 * @private
 */
o3v.History.RESTORE_STATE_ = 1;

/**
 * Time for which the state needs to remain static prior to being recorded.
 * @type {number}
 * @const
 * @private
 */
o3v.History.UPDATE_DELAY_MS_ = 1 * 1000;

/**
 * Timeout used to buffer sequences of state changes.
 * @type {number|undefined}
 * @private
 */
o3v.History.prototype.timeout_;

/**
 * This is set to indicate that the next navigation event is to be ignored.
 * Used when this object itself is the one setting the history.
 * @type {boolean}
 * @private
 */
o3v.History.prototype.suppressed_ = false;

/**
 * Begins history tracking. In most cases, this should be called after all
 * calls to register(). Exception is if you want to temporarily register a
 * component.
 */
o3v.History.prototype.start = function() {
  $(this.window_).bind('hashchange', function(a) {
      this.restoreState_(this.window_.location.hash);
    }.bind(this));

  // Initial restore.
  this.restoreState_(this.window_.location.hash);
};

/**
 * Clears the hash, thus completely resetting the view to initial state.
 */
o3v.History.prototype.reset = function() {
  // Clear any pending updates to the URL.
  if (this.timeout_) {
    this.window_.clearTimeout(this.timeout_);
  }
  this.window_.location.hash = '';
};

/**
 * Registers a component for history storage.
 * @param {string} id A unique id for your component. Shorter is better.
 * @param {function() : string } getStateCallback A function that returns a
 *                               string that represents the component's state.
 * @param {function(string) : * } restoreStateCallback A function that takes
 *                                a string representing state and restores the
 *                                component's state.
 */
o3v.History.prototype.register = function(
    id, getStateCallback, restoreStateCallback) {
  if (this.registry_[id] !== undefined) {
    o3v.log.error('id ', id, ' already registered in history');
  }
  this.registry_[id] = [getStateCallback, restoreStateCallback];
};

/**
 * Removes a component from history storage.
 * @param {string} id Id of the component to unregister.
 */
o3v.History.prototype.unregister = function(id) {
  delete this.registry_[id];
};

/**
 * Call this to indicate a state change. If opt_immediate is not set, this
 * starts a timeout which waits for the state to become stable. This prevents
 * a sequence of updates from creating a large number of history updates.
 * @param {boolean=} opt_immediate If true, force the state to update
 *                   immediately.
 */
o3v.History.prototype.update = function(opt_immediate) {
  if (this.timeout_) {
    this.window_.clearTimeout(this.timeout_);
  }
  var state = this.generateState_();

  var updateFunction = function() {
      var newState = this.generateState_();
      if (newState == state) {
        // State has stabilized, so record it in the history.
        if (this.window_.location.hash != state) {
          this.suppressed_ = true;
          o3v.log.info('history saving state: ' + state);
          this.window_.location.hash = state;
        }
      } else {
        // State has not stabilized, try waiting again.
        this.update();
      }
    }.bind(this);
  if (opt_immediate) {
    this.timeout_ = undefined;
    updateFunction();
  } else {
    this.timeout_ = this.window_.setTimeout(updateFunction,
                                            o3v.History.UPDATE_DELAY_MS_);
  }
};

/**
 * Encodes a string for url inclusion. This is basically encodeURIComponent
 * with some changes to make the kinds of urls we generate more readable.
 * Specifically, it does not encode plus, colon, comma and semicolon.
 * @param {string} decoded String to be encoded.
 * @return {string} The encoded string.
 * @private
 */
o3v.History.prototype.encode_ = function(decoded) {
  var encoded = encodeURIComponent(decoded);
  // Undo confusing and unnecessary encoding.
  encoded = encoded.replace(/%2B/g, '+');
  encoded = encoded.replace(/%3A/g, ':');
  encoded = encoded.replace(/%2C/g, ',');
  encoded = encoded.replace(/%3B/g, ';');
  return encoded;
};

/**
 * Decodes a string from url inclusion. This is the reverse of encode_
 * and obeys the same exceptions.
 * @param {string} encoded String to be decoded.
 * @return {string} The decoded string.
 * @private
 */
o3v.History.prototype.decode_ = function(encoded) {
  // Any future additions - note that this is done in reverse order from
  // encode_.
  encoded = encoded.replace(/;/g, '%3B');
  encoded = encoded.replace(/,/g, '%2C');
  encoded = encoded.replace(/:/g, '%3A');
  encoded = encoded.replace(/\+/g, '%2B');
  var decoded = decodeURIComponent(encoded);
  return decoded;
};

/**
 * Generates the current state by querying each registered component.
 * @return {string} The current state, properly encoded for a url.
 * @private
 */
o3v.History.prototype.generateState_ = function() {
  var state = [];
  for (var id in this.registry_) {
    var componentState = this.registry_[id][o3v.History.GET_STATE_]();
    state.push(id + '=' + this.encode_(componentState));
  }
  return state.join('&');
};

/**
 * Restores the current state by calling each registered component.
 * Note: This first calls restoreState on each component with ''
 *       to reset to baseline. The components need to properly handle
 *       the double call this can incur.
 * @param {string} state The current state, url-encoded.
 * @private
 */
o3v.History.prototype.restoreState_ = function(state) {
  try {
    if (this.suppressed_) {
      this.suppressed_ = false;
      return;
    }
    o3v.log.info('history restoring state: ' + state);
    // Reset the states.
    for (var id in this.registry_) {
      this.registry_[id][o3v.History.RESTORE_STATE_]('');
    }
    // Restore any component that has a state.
    state = state.replace(/^#/, '');
    var tokens = state.split('&');
    for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
      var tuple = tokens[tokenIndex].split('=');
      if (tuple.length == 2) {
        var id = tuple[0];
        if (this.registry_[id]) {
          var componentState = this.decode_(tuple[1]);
          this.registry_[id][o3v.History.RESTORE_STATE_](componentState);
        }
      }
    }
  } catch (err) {
    // Ignore all errors - these might be caused by
    // legacy urls.
    o3v.log_.warning('history restoring state', err);
  }
};
