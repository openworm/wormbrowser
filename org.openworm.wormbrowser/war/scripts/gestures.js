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
 * @fileoverview Platform-specific gestures for open-3d-viewer.
 */

o3v.Gestures = function() {
  this.isMac_ = navigator.platform &&
                (navigator.platform.indexOf('Mac') == 0);
};

// Reports whether a click should be treated as a "hide" gesture.
// On Windows and other non-Mac platforms, we use ctrl-click for hide. On Mac,
// we use command-click, because ctrl-click brings up a context menu.
o3v.Gestures.prototype.isHideClick = function(controlKeyDown, metaKeyDown) {
  if (controlKeyDown && !this.isMac_) return true;
  if (metaKeyDown && this.isMac_) return true;
  return false;
};