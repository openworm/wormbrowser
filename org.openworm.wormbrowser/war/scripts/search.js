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
 * @fileoverview Search.
 */

o3v.Search = function(selectCallback) {
  this.selectCallback_ = selectCallback;

  this.searchbox_ = $('<input class="ui-widget">').appendTo('body').css({
      'position': 'absolute',
      'left': '100%',
      'top': '8px',
      'width': '200px',
      'margin-left': '-212px',
      'outline-style': 'none',
      'border': '2px solid #92e497',
      'border-radius': '12px',
      'padding': '2px 8px 2px 8px',
      'opacity': 0.8,
      'z-index': o3v.uiSettings.ZINDEX_MAINUI
    });
};

o3v.Search.prototype.reset = function(searchTokens) {
  this.searchbox_.autocomplete('destroy');
  this.terms_ = searchTokens;
  this.searchbox_.autocomplete(
      {
          source: this.find.bind(this),
          delay: 0,
          autoFocus: true,
          selectFirst: true,
          select: function(event, ui) {
            this.handleResult_.bind(event, ui);
            this.searchbox_[0].blur();
          }.bind(this),
          focus: this.handleResult_.bind(this)
      });
};

o3v.Search.prototype.find = function(query, callback) {
  var token = query.term;

  var matches = [];
  if (token != '') {
    var matcher = new RegExp('(^|\\W+)' + token, 'i');

    for (var i = 0; i < this.terms_.length; i++) {
      if (this.terms_[i].match(matcher)) {
        matches.push(this.terms_[i]);
        if (matches.length >= o3v.Search.MAX_MATCHES) {
          break;
        }
      }
    }
  }
  callback(matches);
};

o3v.Search.prototype.handleResult_ = function(event, ui) {
  this.selectCallback_(ui.item.value);
};

o3v.Search.MAX_MATCHES = 10;
