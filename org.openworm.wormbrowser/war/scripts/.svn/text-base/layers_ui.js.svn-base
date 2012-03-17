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
 * @fileoverview Layer controls for main UI of open-3d-viewer.
 */
// TODO(arthurb): Objectify.
o3v.LayersUI = function(layerOpacityManager) {
  this.layerOpacityManager_ = layerOpacityManager;

  this.singleSlider_ = new o3v.LayersUI.SingleSlider(layerOpacityManager);
  this.multiSlider_ = new o3v.LayersUI.MultiSlider(layerOpacityManager);
  this.icons_ = new o3v.LayersUI.Icons(layerOpacityManager);
  this.sliderToggle_ = new o3v.LayersUI.SliderToggle(this.singleSlider_,
                                                     this.multiSlider_);
};

o3v.LayersUI.ICON_WIDTH = 45;
o3v.LayersUI.ICON_HEIGHT = 47;

/*
 * Builds all slider UI.
 */
o3v.LayersUI.prototype.buildAll = function(putBelow, numLayers, iconFile) {
  this.singleSlider_.build(putBelow, numLayers);
  this.multiSlider_.build(putBelow, numLayers);
  this.icons_.build(putBelow, numLayers, iconFile);
  this.sliderToggle_.build(this.icons_.getLastIcon());
};

/*
 * A slider with one handle. Moving the slider from one end to the other
 * transitions the model from 100% transparent (i.e., invisible) to 100%
 * opaque.
 */
o3v.LayersUI.SingleSlider = function(layerOpacityManager) {
  this.layerOpacityManager_ = layerOpacityManager;

  this.updateCallback_ = this.update.bind(this);

  this.slider = null;
  this.range = 10000;
  this.numLayers = 0;
  this.HANDLE_WIDTH = 51;
};

o3v.LayersUI.SingleSlider.prototype.build = function(putBelow, numLayers) {
  this.numLayers = numLayers;
  if (this.slider) {
    this.slider.remove();
  }

  this.slider = $('<div>').appendTo('body').slider({
   orientation: 'vertical',
   range: 'min',
   min: 0,
   max: this.range,
   value: this.range,
   slide: function (event, ui) {
        this.setOpacitiesFromFraction(ui.value / this.range);
      }.bind(this),
   stop: function() {
        document.activeElement.blur();  // take focus off slider handle
      }
    }).css({
        'position': 'absolute',
        'border': 'none',
        'border-left': '2px solid #92e497',
        'border-right': '2px solid #92e497',
        'border-radius': 0,
        'background': 'none',
        'width': o3v.LayersUI.ICON_WIDTH + 'px',
        'height': (this.numLayers * o3v.LayersUI.ICON_HEIGHT) + 'px',
        'z-index': o3v.uiSettings.ZINDEX_MAINUI
      }).position({
       my: 'top',
       at: 'bottom',
       of: putBelow,
       collision: 'none'
        });

  var sliderNodes = this.slider.get(0).childNodes;
  var sliderBgStyle = sliderNodes[0].style;
  sliderBgStyle.background = 'none';
  var sliderHandleStyle = sliderNodes[1].style;
  sliderHandleStyle.width = this.HANDLE_WIDTH + 'px';
  sliderHandleStyle.opacity = 0.7;
  sliderHandleStyle.outlineStyle = 'none';

  this.setOpacitiesFromFraction(1.0);

  this.layerOpacityManager_.addView(this.updateCallback_);
};

o3v.LayersUI.SingleSlider.prototype.setOpacitiesFromFraction =
    function (fraction) {
  var scaled = fraction * this.numLayers;
  var opacities = [];
  for (var i = 0; i < this.numLayers; ++i) {
    if (scaled <= i) {
      opacities.push(0.0);
    } else if (scaled >= i + 1) {
      opacities.push(1.0);
    } else {
      opacities.push(scaled - i);
    }
  }
  this.layerOpacityManager_.setLayerOpacities(opacities, this.updateCallback_);
};

o3v.LayersUI.SingleSlider.prototype.show = function(show) {
  this.slider.css({
      'visibility': show ? 'visible' : 'hidden'
          });
};

o3v.LayersUI.SingleSlider.prototype.update = function () {
  var opacities = this.layerOpacityManager_.getLayerOpacities();
  var numLayers = opacities.length;
  var fraction = 0;
  for (var i = numLayers - 1; i > -1; --i) {
    if (opacities[i] > 0) {
      fraction = (i + opacities[i]) / numLayers;
      break;
    }
  }
  this.slider.slider('value', fraction * this.range);
};

/*
 * A collection of sliders, one handle per layer. Moving each slider from one
 * end to the other transitions just that layer from 100% transparent (i.e.
 * invisible) to 100% opaque.
 */
o3v.LayersUI.MultiSlider = function(layerOpacityManager) {
  this.layerOpacityManager_ = layerOpacityManager;

  this.updateCallback_ = this.update.bind(this);

  this.sliders = null;
  this.range = 10000;
  this.numLayers = 0;
  this.HANDLE_HEIGHT = 43;
};

o3v.LayersUI.MultiSlider.prototype.build = function(putBelow, numLayers) {
  if (this.sliders) {
    for (var i = 0; i < this.numLayers; ++i) {
      this.sliders[i].remove();
    }
  }
  this.sliders = [];

  this.numLayers = numLayers;
  for (i = 0; i < this.numLayers; ++i) {
    var newSlider = $('<div>').appendTo('body').slider({
     orientation: 'horizontal',
     range: 'min',
     min: 0,
     max: this.range,
     value: this.range,
     slide: function (event, ui) {
          var layer = (this.sliders.length - 1) - $(event.target).data('id');
          this.layerOpacityManager_.setLayerOpacity(
              layer, ui.value / this.range, this.updateCallback_);
        }.bind(this),
     stop: function() {
          document.activeElement.blur();  // take focus off slider handle
        }
      }).css({
          'position': 'absolute',
          'border': 'none',
          'border-left': '2px solid #92e497',
          'border-right': '2px solid #92e497',
          'border-radius': 0,
          'background': 'none',
          'visibility': 'hidden',
          'width': o3v.LayersUI.ICON_WIDTH + 'px',
          'height': o3v.LayersUI.ICON_HEIGHT + 'px',
          'z-index': o3v.uiSettings.ZINDEX_MAINUI
        }).position({
         my: 'top',
         at: 'bottom',
         of: i === 0 ? putBelow : this.sliders[i - 1],
         collision: 'none'
          }).data('id', i);

    this.sliders.push(newSlider);
    var sliderNodes = newSlider.get(0).childNodes;
    var sliderBgStyle = sliderNodes[0].style;
    sliderBgStyle.background = 'none';
    var sliderHandleStyle = sliderNodes[1].style;
    sliderHandleStyle.height = this.HANDLE_HEIGHT + 'px';
    sliderHandleStyle.opacity = 0.7;
    sliderHandleStyle.outlineStyle = 'none';
  }

  this.layerOpacityManager_.addView(this.updateCallback_);
};

o3v.LayersUI.MultiSlider.prototype.show = function(show) {
  var numSliders = this.sliders.length;
  for (var i = 0; i < numSliders; ++i) {
    this.sliders[i].css({
        'visibility': show ? 'visible' : 'hidden'
            });
  }
};

o3v.LayersUI.MultiSlider.prototype.update = function() {
  var opacities = this.layerOpacityManager_.getLayerOpacities();
  var numSliders = this.sliders.length;
  for (var i = 0; i < numSliders; ++i) {
    var layer = (numSliders - 1) - i;
    this.sliders[i].slider('value', opacities[layer] * this.range);
  }
};

/*
 * A stack of decorative icons that sit under the layer sliders and change
 * opacity as the layers do.
 */
o3v.LayersUI.Icons = function(layerOpacityManager) {
  this.layerOpacityManager_ = layerOpacityManager;

  this.updateCallback_ = this.update.bind(this);

  this.activeIcons = [];
  this.inactiveIcons = [];
  this.lastIcon = null;
};

o3v.LayersUI.Icons.prototype.getLastIcon = function() {
  return this.lastIcon;
};

o3v.LayersUI.Icons.prototype.build = function(putBelow, numLayers, iconFile) {
  if (this.activeIcons) {
    var numIcons = this.activeIcons.length;
    for (var i = 0; i < numIcons; ++i) {
      this.activeIcons[i].remove();
      this.inactiveIcons[i].remove();
    }
    this.activeIcons = [];
    this.inactiveIcons = [];
  }

  for (i = 0; i < numLayers; ++i) {
    var offsetTop = i * o3v.LayersUI.ICON_HEIGHT;

    var inactiveIcon = $('<div>').appendTo('body').css({
        'position': 'absolute',
        'width': o3v.LayersUI.ICON_WIDTH + 'px',
        'height': o3v.LayersUI.ICON_HEIGHT + 'px',
        'background-image': 'url(' + iconFile + ')',
        'background-position': '0px -' + offsetTop + 'px',
        'z-index': o3v.uiSettings.ZINDEX_MAINUI_STATUS_LOWER
      });
    this.inactiveIcons.push(inactiveIcon);
    inactiveIcon.position({
     my: 'top',
            at: 'bottom',
            of: i === 0 ? putBelow : this.inactiveIcons[i - 1],
            collision: 'none'
            });

    var activeIcon = $('<div>').appendTo('body').css({
        'position': 'absolute',
        'width': o3v.LayersUI.ICON_WIDTH + 'px',
        'height': o3v.LayersUI.ICON_HEIGHT + 'px',
        'background-image': 'url(' + iconFile + ')',
        'background-position': '-' + o3v.LayersUI.ICON_WIDTH + 'px -' + offsetTop + 'px',
        'z-index': o3v.uiSettings.ZINDEX_MAINUI_STATUS_UPPER
      });
    this.activeIcons.push(activeIcon);
    activeIcon.position({
     my: 'top',
            at: 'bottom',
            of: i === 0 ? putBelow : this.activeIcons[i - 1],
            collision: 'none'
            });
  }

  this.lastIcon = this.activeIcons[this.activeIcons.length - 1];
  this.layerOpacityManager_.addView(this.updateCallback_);
};

/*
 * Updates icons based on layer opacities.
 */
 o3v.LayersUI.Icons.prototype.update = function() {
   var opacities = this.layerOpacityManager_.getLayerOpacities();
   var numIcons = this.activeIcons.length;
   for (var i = 0; i < numIcons; ++i) {
     var layer = (numIcons - 1) - i;
     this.activeIcons[i].get(0).style.opacity = opacities[layer];
   }
 };

/*
 * A button that switches between single- and multiple-slider modes.
 */
o3v.LayersUI.SliderToggle = function(singleSlider, multiSlider) {
  this.button = null;
  this.single = true;

  this.singleSlider_ = singleSlider;
  this.multiSlider_ = multiSlider;
};

o3v.LayersUI.SliderToggle.prototype.build = function (lastIcon) {
  if (this.button) {
    this.button.remove();
  }

  this.button = $('<div>').appendTo('body').css({
      'position': 'absolute',
      'width': '45px',
      'height': '50px',
      'border-left': '2px solid #92e497',
      'border-bottom-left-radius': '16px',
      'border-bottom-right-radius': '16px',
      'border-bottom': '2px solid #92e497',
      'border-right': '2px solid #92e497',
      'border-top': '1px solid #c2ffb7',
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
      'background-color': '#fff',
      'z-index': o3v.uiSettings.ZINDEX_MAINUI_STATUS_UPPER
    }).position({
     my: 'top',
     at: 'bottom',
     of: lastIcon,
     collision: 'none'
      }).click(this.toggleSliders.bind(this));

  this.setArt();
};

o3v.LayersUI.SliderToggle.prototype.setArt = function() {
  this.button.css({
      'background-image': this.single ? 'url(img/toggle_single_slider.png)' : 'url(img/toggle_multiple_sliders.png)'
    });
};

o3v.LayersUI.SliderToggle.prototype.toggleSliders = function() {
  this.single = !this.single;
  this.setArt();

  this.singleSlider_.show(this.single);
  this.multiSlider_.show(!this.single);
};
