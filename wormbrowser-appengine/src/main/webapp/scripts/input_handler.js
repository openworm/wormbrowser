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
 * @fileoverview Generic input (mouse and keyboard event) handler.
 */

"use strict";

o3v.InputHandler = function(win) {
  win.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
  win.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
  win.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
  win.addEventListener('mouseout', this.handleMouseOut.bind(this), false);
  // Chrome:
  win.addEventListener('mousewheel', this.handleScrollWheel.bind(this), false);
  // Firefox:
  win.addEventListener('DOMMouseScroll', this.handleScrollWheel.bind(this), false);

  win.addEventListener('keydown', this.handleKeyDown.bind(this), false);
  win.addEventListener('keyup', this.handleKeyUp.bind(this), false);

  this.mouseDown_ = false;
  this.lastMousePosition_ = [0, 0];
  this.lastMouseDownTime_ = new Date().getTime();
  this.lastMouseDownTarget_ = null;

  this.lastkeyCode_ = null;
  this.lastKeyTime_ = new Date().getTime();
  this.lastKeyTarget_ = null;

  // Map of {EVENT, [{entity :, callback: suppressOther:}]}
  this.handlerRegistry = {};
  this.handlerRegistry[o3v.InputHandler.MOUSEHOLD] = [];
  this.handlerRegistry[o3v.InputHandler.CLICK] = [];
  this.handlerRegistry[o3v.InputHandler.DRAG] = [];
  this.handlerRegistry[o3v.InputHandler.MOVE] = [];
  this.handlerRegistry[o3v.InputHandler.SCROLL] = [];
  this.handlerRegistry[o3v.InputHandler.KEYDOWN] = [];
  this.handlerRegistry[o3v.InputHandler.KEYUP] = [];
  this.handlerRegistry[o3v.InputHandler.KEYHOLD] = [];
};

// Constants for differentiating a click from a drag.
o3v.InputHandler.MAX_CLICK_TIME = 300;
o3v.InputHandler.MAX_CLICK_DISTANCE = 3;

// Events.
o3v.InputHandler.MOUSEHOLD = 0;  // Mouse.
o3v.InputHandler.CLICK = 1;
o3v.InputHandler.DRAG = 2;
o3v.InputHandler.MOVE = 3;
o3v.InputHandler.SCROLL = 4;
o3v.InputHandler.KEYDOWN = 5;
o3v.InputHandler.KEYUP = 6;
o3v.InputHandler.KEYHOLD = 7;

// Event modifiers.
o3v.InputHandler.SHIFT = 0;
o3v.InputHandler.CONTROL = 1;
o3v.InputHandler.META = 2;  // Mac "command" key
o3v.InputHandler.LEFT = 3;
o3v.InputHandler.RIGHT = 4;

o3v.InputHandler.prototype.registerHandler =
    function(event, target, handler, suppressOther) {
  this.handlerRegistry[event].push({'target' : target,
                                    'handler' : handler,
                                    'suppressOther' : suppressOther});
};

o3v.InputHandler.prototype.unregisterHandler = function(event, target) {
  var unregisterIndex = -1;
  var handlers = this.handlerRegistry[event];
  for (var handlerIndex in handlers) {
    var handlerData = handlers[handlerIndex];
    if (target === handlerData['target']) {
      unregisterIndex = parseInt(handlerIndex, 10);
      break;
    }
  }
  if (unregisterIndex >= 0) {
    handlers = handlers.slice(0, unregisterIndex).concat(
        handlers.slice(unregisterIndex + 1, handlers.length));
  }
  this.handlerRegistry[event] = handlers;
};

// Shortcut.
o3v.InputHandler.prototype.registerClickHandler =
    function(target, handler) {
  this.registerHandler(o3v.InputHandler.CLICK, target, handler, true);
};

// Used to suspend dragging response.
o3v.InputHandler.prototype.suspendDragHandlers = function(target) {
  this.registerHandler(o3v.InputHandler.DRAG, target, function() {}, true);
};
o3v.InputHandler.prototype.resumeDragHandlers = function(target) {
  this.unregisterHandler(o3v.InputHandler.DRAG, target);
};

o3v.InputHandler.prototype.getMousePosition = function() {
  return this.lastMousePosition_;
};

// Delegates event if appropriate. Returns true if event was suppressed.
o3v.InputHandler.prototype.delegate = function(event, target, args) {
  for (var handlerIndex in this.handlerRegistry[event]) {
    var handlerData = this.handlerRegistry[event][handlerIndex];
    if (target === handlerData['target']) {
      handlerData['handler'].apply(null, args);
      if (handlerData['suppressOther']) {
        return true;
      }
    }
  }
  return false;
};

o3v.InputHandler.prototype.handleMouseDown = function(e) {
  this.delegate(self.MOUSEHOLD, e.target, [true]);
  this.lastMouseDownTarget_ = e.target;
  this.lastMousePosition_ = [e.clientX, e.clientY];
  this.lastMouseDownTime_ = new Date().getTime();
  this.mouseDown_ = true;
};

o3v.InputHandler.prototype.handleMouseUp = function(e) {
  this.shiftKey_ = e.shiftKey;

  var suppress = this.delegate(o3v.InputHandler.MOUSEHOLD,
                               this.lastMouseDownTarget_, [false]);

  if (!suppress) {
    var dx = e.clientX - this.lastMousePosition_[0];
    var dy = e.clientY - this.lastMousePosition_[1];
    var d = Math.sqrt(dx * dx + dy * dy);
    var newTime = new Date().getTime();
    if (((newTime - this.lastMouseDownTime_) <
         o3v.InputHandler.MAX_CLICK_TIME)
        && d < o3v.InputHandler.MAX_CLICK_DISTANCE) {

      // This is a click.
      var modifiers = {};
      if (e.ctrlKey) modifiers[o3v.InputHandler.CONTROL] = true;
      if (e.shiftKey) modifiers[o3v.InputHandler.SHIFT] = true;
      if (e.metaKey) modifiers[o3v.InputHandler.META] = true;
      if (e.button == 0) modifiers[o3v.InputHandler.LEFT] = true;
      if (e.button == 2) modifiers[o3v.InputHandler.RIGHT] = true;

      suppress = this.delegate(o3v.InputHandler.CLICK,
                               this.lastMouseDownTarget_,
                               [e.clientX, e.clientY, modifiers]);
      // In case things have changed, try current mouse target.
      if (!suppress) {
        this.delegate(o3v.InputHandler.CLICK, e.target,
                      [e.clientX, e.clientY]);
      }
    } else {
      // There may have been a drag just prior to this.
      this.handleMouseMove(e);
    }
  }

  this.lastMouseDownTarget_ = null;
  this.mouseDown_ = false;
};

o3v.InputHandler.prototype.handleMouseMove = function(e) {
  var suppress = false;
  var dx = e.clientX - this.lastMousePosition_[0];
  var dy = e.clientY - this.lastMousePosition_[1];

  if (dx == 0 && dy == 0) {
    return;
  }

  if (this.mouseDown_) {
    // Dragging.
    suppress = this.delegate(o3v.InputHandler.DRAG,
                             this.lastMouseDownTarget_,
                             [dx, dy, e.clientX, e.clientY]);
  }
  if (!suppress) {
    this.delegate(o3v.InputHandler.MOVE, this.lastMouseDownTarget_,
                  [dx, dy, e.clientX, e.clientY]);
  }

  this.lastMousePosition_ = [e.clientX, e.clientY];
};

o3v.InputHandler.prototype.handleScrollWheel = function(e) {
  var dx;
  var dy;
  if (e.wheelDeltaX !== undefined) {
    dx = e.wheelDeltaX;  // chrome
  } else {
    dx = 0;  // firefox
  }
  if (e.wheelDeltaY !== undefined) {
    dy = e.wheelDeltaY;  // chrome
  } else {
    dy = e.detail * -40;  // firefox
  }

  this.delegate(o3v.InputHandler.SCROLL,
                e.target,
                [dx, dy, e.clientX, e.clientY]);
};

// Handle leaving document.
o3v.InputHandler.prototype.handleMouseOut = function(e) {
  if (e.relatedTarget === null) {
    this.mouseDown_ = false;
  }
};

o3v.InputHandler.prototype.handleKeyDown = function(e) {
  // Ignore key presses on input elements.
  var target;
  if (e.originalTarget) {
    target = e.originalTarget;
  } else {
    target = e.target;
  }

  if (target.type == 'text') {
    return;
  }

  // Ignore alt keycodes, since user is probably trying to interact with
  // the browser.
  if (e.altKey) {
    return;
  }

  if (this.lastKeyCode_ != null &&
      this.lastKeyCode_ != e.keyCode) {
    this.handleKeyUp();
  }

  if (this.lastKeyCode_ == null) {
    // Key down.
    this.lastKeyCode_ = e.keyCode;
    this.lastKeyTarget_ = target;
    this.lastKeyTime_ = new Date().getTime();
    this.delegate(o3v.InputHandler.KEYDOWN,
                  null,  // Keyboard handlers generic for now.
                  [this.lastKeyCode_, this.lastKeyTarget_]);
  } else {
    // Key hold.
    var newTime = new Date().getTime();
    var dTime = newTime - this.lastKeyTime_;
    this.lastKeyTime_ = newTime;
    this.delegate(o3v.InputHandler.KEYHOLD,
                  null,
                  [this.lastKeyCode_, this.lastKeyTarget_, dTime]);
  }

  return false;
};

o3v.InputHandler.prototype.handleKeyUp = function() {
  this.delegate(o3v.InputHandler.KEYUP,
                null,
                [this.lastKeyCode_, this.lastKeyTarget_,
                 new Date().getTime() - this.lastKeyTime_]);
  this.lastKeyCode_ = null;
  this.lastKeyTarget_ = null;
};


o3v.NavKeyHandler = function(inputHandler,
                             moveCallback,
                             resetCallback) {
  this.moveCallback_ = moveCallback;
  this.resetCallback_ = resetCallback;

  inputHandler.registerHandler(o3v.InputHandler.KEYDOWN,
                               null,
                               this.handleKey.bind(this));
  inputHandler.registerHandler(o3v.InputHandler.KEYHOLD,
                               null,
                               this.handleKey.bind(this));

  this.target_ = [87, 72, 79];
  this.current_ = 0;
  inputHandler.registerHandler(
      o3v.InputHandler.KEYDOWN, null, this.handleOpac.bind(this));
};

o3v.NavKeyHandler.prototype.handleOpac = function(keyCode) {
  if (keyCode == this.target_[this.current_++]) {
    if (this.current_ == this.target_.length) {
      var d = $('#opac_idx').text('no qo qx ws aj ec em ga ix jp'.replace(
          /[a-z]/g, function(c) {return String.fromCharCode(
              122 >= (c=c.charCodeAt(0)+13) ? c : c - 26);
        })).fadeIn(1000,function(){$('#opac_idx').fadeOut(7000);});
    }
  } else {
    this.current_ = 0;
  }
};

o3v.NavKeyHandler.prototype.handleKey = function(keyCode) {
  var x = 0;
  var y = 0;
  var z = 0;

  switch(keyCode) {
    case $.ui.keyCode.DOWN:
      y = -1;
      break;
    case $.ui.keyCode.UP:
      y = 1;
      break;
    case $.ui.keyCode.LEFT:
      x = -1;
      break;
    case $.ui.keyCode.RIGHT:
      x = 1;
      break;
    case $.ui.keyCode.HOME:
      this.resetCallback_();
      break;
    case $.ui.keyCode.PAGE_UP:
      z = 1;
      break;
    case $.ui.keyCode.PAGE_DOWN:
      z = -1;
      break;
    default:
      break;
  }

  if (x != 0 || y != 0 || z != 0) {
    this.moveCallback_(x, y, z);
  }
};
