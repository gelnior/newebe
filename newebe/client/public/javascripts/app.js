(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("collections/activity_collection", function(exports, require, module) {
var Activity, ActivityCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Activity = require('../models/activity');

module.exports = ActivityCollection = (function(_super) {
  __extends(ActivityCollection, _super);

  function ActivityCollection() {
    return ActivityCollection.__super__.constructor.apply(this, arguments);
  }

  ActivityCollection.prototype.model = Activity;

  ActivityCollection.prototype.url = '/activities/all/';

  ActivityCollection.prototype.baseUrl = '/activities/all/';

  ActivityCollection.prototype.comparator = function(activity, activity2) {
    return activity.get('date' < activity2.get('date'));
  };

  ActivityCollection.prototype.parse = function(response) {
    return response.rows;
  };

  return ActivityCollection;

})(Backbone.Collection);
});

;require.register("collections/commons", function(exports, require, module) {
var CommonsCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = CommonsCollection = (function(_super) {
  __extends(CommonsCollection, _super);

  function CommonsCollection() {
    return CommonsCollection.__super__.constructor.apply(this, arguments);
  }

  CommonsCollection.prototype.model = require('../models/common');

  CommonsCollection.prototype.url = 'commons/all/';

  CommonsCollection.prototype.parse = function(response) {
    return response.rows;
  };

  return CommonsCollection;

})(Backbone.Collection);
});

;require.register("collections/contacts", function(exports, require, module) {
var ContactsCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = ContactsCollection = (function(_super) {
  __extends(ContactsCollection, _super);

  function ContactsCollection() {
    return ContactsCollection.__super__.constructor.apply(this, arguments);
  }

  ContactsCollection.prototype.model = require('../models/contact');

  ContactsCollection.prototype.url = 'contacts/';

  ContactsCollection.prototype.parse = function(response) {
    return response.rows;
  };

  ContactsCollection.prototype.containsContact = function(contactUrl) {
    return this.find(function(contact) {
      return contactUrl === contact.get("url");
    });
  };

  return ContactsCollection;

})(Backbone.Collection);
});

;require.register("collections/micropost_collection", function(exports, require, module) {
var Micropost, MicropostCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Micropost = require('../models/micropost');

module.exports = MicropostCollection = (function(_super) {
  __extends(MicropostCollection, _super);

  function MicropostCollection() {
    return MicropostCollection.__super__.constructor.apply(this, arguments);
  }

  MicropostCollection.prototype.model = Micropost;

  MicropostCollection.prototype.url = '/microposts/all/';

  MicropostCollection.prototype.baseUrl = '/microposts/all/';

  MicropostCollection.prototype.comparator = function(micropost, micropost2) {
    return micropost.get('date' < micropost2.get('date'));
  };

  MicropostCollection.prototype.parse = function(response) {
    return response.rows;
  };

  return MicropostCollection;

})(Backbone.Collection);
});

;require.register("collections/notes", function(exports, require, module) {
var NotesCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = NotesCollection = (function(_super) {
  __extends(NotesCollection, _super);

  function NotesCollection() {
    return NotesCollection.__super__.constructor.apply(this, arguments);
  }

  NotesCollection.prototype.model = require('../models/note');

  NotesCollection.prototype.url = 'notes/all/';

  NotesCollection.prototype.parse = function(response) {
    return response.rows;
  };

  return NotesCollection;

})(Backbone.Collection);
});

;require.register("collections/pictures", function(exports, require, module) {
var PicturesCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = PicturesCollection = (function(_super) {
  __extends(PicturesCollection, _super);

  function PicturesCollection() {
    return PicturesCollection.__super__.constructor.apply(this, arguments);
  }

  PicturesCollection.prototype.model = require('../models/picture');

  PicturesCollection.prototype.url = 'pictures/all/';

  PicturesCollection.prototype.parse = function(response) {
    return response.rows;
  };

  return PicturesCollection;

})(Backbone.Collection);
});

;require.register("collections/tags", function(exports, require, module) {
var TagsCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = TagsCollection = (function(_super) {
  __extends(TagsCollection, _super);

  function TagsCollection() {
    return TagsCollection.__super__.constructor.apply(this, arguments);
  }

  TagsCollection.prototype.model = require('../models/tag');

  TagsCollection.prototype.url = 'contacts/tags/';

  TagsCollection.prototype.parse = function(response) {
    return response.rows;
  };

  TagsCollection.prototype.comparator = function(tag) {
    return tag.get('name');
  };

  return TagsCollection;

})(Backbone.Collection);
});

;require.register("initialize", function(exports, require, module) {
if (this.Newebe == null) {
  this.Newebe = {};
}

if (Newebe.routers == null) {
  Newebe.routers = {};
}

if (Newebe.views == null) {
  Newebe.views = {};
}

$(function() {
  var AppRouter, AppView, addJqueryHelpers;
  addJqueryHelpers = require('lib/jquery_helpers');
  addJqueryHelpers();
  require('../lib/app_helpers');
  AppRouter = require('routers/app_router');
  AppView = require('views/app_view');
  Newebe.views.appView = new AppView();
  Newebe.routers.appRouter = new AppRouter(Newebe.views.appView);
  etch.config["default"] = etch.config.all;
  Backbone.history.start();
  if (window.location.hash === '') {
    return Newebe.routers.appRouter.navigate('', {
      trigger: true
    });
  }
});
});

;require.register("lib/app_helpers", function(exports, require, module) {
(function() {
  return (function() {
    var console, dummy, method, methods, _results;
    console = window.console = window.console || {};
    method = void 0;
    dummy = function() {};
    methods = 'assert,count,debug,dir,dirxml,error,exception, group,groupCollapsed,groupEnd,info,log,markTimeline, profile,profileEnd,time,timeEnd,trace,warn'.split(',');
    _results = [];
    while (method = methods.pop()) {
      _results.push(console[method] = console[method] || dummy);
    }
    return _results;
  })();
})();
});

;require.register("lib/jquery_helpers", function(exports, require, module) {
module.exports = function() {
  window.alert = function(msg) {
    $('#alert-widget').html(msg);
    $('#alert-widget').show();
    return setTimeout((function(_this) {
      return function() {
        return $('#alert-widget').fadeOut(2000);
      };
    })(this), 500);
  };
  $.fn.disable = function() {
    return this.each(function() {
      $(this).prop('disabled', true);
      return $(this).addClass('disabled');
    });
  };
  $.fn.enable = function() {
    return this.each(function() {
      $(this).prop('disabled', false);
      return $(this).removeClass('disabled');
    });
  };
  $.fn.select = function() {
    return this.each(function() {
      return $(this).addClass('selected');
    });
  };
  $.fn.unselect = function() {
    return this.each(function() {
      return $(this).removeClass('selected');
    });
  };
  return $.fn.spin = function(opts, color) {
    var presets;
    presets = {
      tiny: {
        lines: 8,
        length: 2,
        width: 2,
        radius: 3
      },
      small: {
        lines: 8,
        length: 1,
        width: 2,
        radius: 5
      },
      large: {
        lines: 10,
        length: 8,
        width: 4,
        radius: 8
      }
    };
    if (Spinner) {
      return this.each(function() {
        var $this, spinner;
        $this = $(this);
        spinner = $this.data('spinner');
        if (spinner != null) {
          spinner.stop();
          $this.css('color', $this.data('color'));
          $this.data('spinner', null);
          return $this.data('color', null);
        } else if (opts !== false) {
          color = $this.css('color');
          $this.data('color', color);
          $this.css('color', 'transparent');
          if (typeof opts === 'string') {
            if (opts in presets) {
              opts = presets[opts];
            } else {
              opts = {};
            }
            if (color) {
              opts.color = color;
            }
          }
          spinner = new Spinner($.extend({
            color: $this.css('color')
          }, opts));
          spinner.spin(this);
          return $this.data('spinner', spinner);
        }
      });
    } else {
      return console.log('Spinner class is not available');
    }
  };
};
});

;require.register("lib/model", function(exports, require, module) {
var Model,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  Model.prototype.idAttribute = '_id';

  Model.prototype.bindField = function(attribute, field) {
    if (field == null) {
      return console.log("try to bind a non existing field with " + attribute);
    } else {
      field.keyup((function(_this) {
        return function() {
          _this.set(attribute, field.val(), {
            silent: true
          });
          return true;
        };
      })(this));
      return this.on("change:" + attribute, (function(_this) {
        return function() {
          return field.val(_this.get("attribute"));
        };
      })(this));
    }
  };

  return Model;

})(Backbone.Model);
});

;require.register("lib/renderer", function(exports, require, module) {
var Renderer, request;

request = require('./request');

module.exports = Renderer = (function() {
  function Renderer() {}

  Renderer.prototype.markdownConverter = new Showdown.converter();

  Renderer.prototype.renderDoc = function(doc) {
    var content, rawContent, _ref, _ref1, _ref2, _ref3;
    if (doc != null) {
      if (doc.get('doc_type') === 'MicroPost') {
        rawContent = doc.get('content');
        rawContent = sanitize(rawContent).escape();
        content = '<div class="mod left w40">';
        content = this.markdownConverter.makeHtml(rawContent);
        if (((_ref = doc.get('pictures')) != null ? _ref.length : void 0) > 0 || ((_ref1 = doc.get('pictures_to_download')) != null ? _ref1.length : void 0) > 0) {
          content += '<img src="static/images/attachment.png" />';
        }
        if (((_ref2 = doc.get('commons')) != null ? _ref2.length : void 0) > 0 || ((_ref3 = doc.get('commons_to_download')) != null ? _ref3.length : void 0) > 0) {
          content += '<img src="static/images/attachment.png" />';
        }
        content += '</div>';
        content += '<div class="mod right w40 micropost-attachments">';
        content += this.checkForPictures(doc.get('pictures'));
        content += this.checkForPicturesToDl(doc.get('pictures_to_download'));
        content += this.checkForCommons(doc.get('commons'));
        content += this.checkForCommonsToDl(doc.get('commons_to_download'));
        content += this.checkForImages(rawContent);
        content += this.checkForVideos(rawContent);
        content += '</div>';
        return content;
      }
    }
    return '';
  };

  Renderer.prototype.renderDate = function(dateString) {
    var date;
    date = moment(dateString, 'YYYY-MM-DDThh:mm:ssZ');
    return date.format('D MMM  YYYY, HH:mm');
  };

  Renderer.prototype.checkForPictures = function(pictures) {
    var picture, result, _i, _len;
    result = "";
    if ((pictures != null ? pictures.length : void 0) > 0) {
      for (_i = 0, _len = pictures.length; _i < _len; _i++) {
        picture = pictures[_i];
        result += "<a href=\"pictures/" + picture + "/" + picture + ".jpg\">\n<img class=\"post-picture\" src=\"pictures/" + picture + "/prev_" + picture + ".jpg\" />\n</a>";
      }
    }
    return result;
  };

  Renderer.prototype.checkForPicturesToDl = function(pictures) {
    var picture, result, _i, _len;
    result = "";
    if ((pictures != null ? pictures.length : void 0) > 0) {
      for (_i = 0, _len = pictures.length; _i < _len; _i++) {
        picture = pictures[_i];
        result += "<p>The image is not avalaible yet, you need to download it\nfirst.</p>\n<button class=\"download-picture-btn\">download</button>";
      }
    }
    return result;
  };

  Renderer.prototype.checkForCommons = function(commons) {
    var commonId, result, _i, _len;
    result = "";
    if ((commons != null ? commons.length : void 0) > 0) {
      for (_i = 0, _len = commons.length; _i < _len; _i++) {
        commonId = commons[_i];
        if (commonId != null) {
          result += "<a id=\"common-" + commonId + "\"></a>";
          request.get("/commons/" + commonId + "/", function(err, commonRows) {
            var common, link;
            common = commonRows.rows[0];
            link = "/commons/" + commonId + "/" + common.path;
            $("#common-" + commonId).attr('href', link);
            return $("#common-" + commonId).html(common.path);
          });
        }
      }
    }
    return result;
  };

  Renderer.prototype.checkForCommonsToDl = function(commons) {
    var common, result, _i, _len;
    result = "";
    if ((commons != null ? commons.length : void 0) > 0) {
      for (_i = 0, _len = commons.length; _i < _len; _i++) {
        common = commons[_i];
        result += "<p>The common is not avalaible yet, you need to download it\nfirst.</p>\n<button class=\"download-common-btn\">download</button>";
      }
    }
    return result;
  };

  Renderer.prototype.checkForImages = function(content) {
    var regexp, result, url, urls, _i, _len;
    regexp = /\[.+\]\((http|https):\/\/\S+\.(jpg|png|gif)\)/g;
    urls = content.match(regexp);
    result = "";
    if (urls) {
      for (_i = 0, _len = urls.length; _i < _len; _i++) {
        url = urls[_i];
        url = this.getUrlFromMarkdown(url);
        if (url) {
          result += "<p>\n<img style=\"max-width: 100%;\"\nsrc=\"" + url + "\"\nalt=\"Image " + url + "\" />\n</img>\n</p>";
        }
      }
    }
    return result;
  };

  Renderer.prototype.getUrlFromMarkdown = function(markdownLink) {
    var index;
    index = markdownLink.indexOf("(");
    return markdownLink.substring(index + 1, markdownLink.length - 1);
  };

  Renderer.prototype.checkForVideos = function(content) {
    var key, regexp, res, result, url, urls, _i, _len;
    regexp = /\[.+\]\((http|https):\/\/\S*youtube.com\/watch\?v=\S+\)/g;
    urls = content.match(regexp);
    result = "";
    if (urls) {
      for (_i = 0, _len = urls.length; _i < _len; _i++) {
        url = urls[_i];
        url = this.getUrlFromMarkdown(url);
        res = url.match(/v=\S+&/);
        if (res != null) {
          key = res[0];
        }
        if (!key) {
          res = url.match(/v=\S+/);
          if (res != null) {
            key = res[0];
          }
        }
        if (key) {
          if (key.indexOf("&") > 0) {
            key = key.substring(2, key.length - 1);
          } else {
            key = key.substring(2, key.length);
          }
          result += "<p>\n<iframe class=\"video\" style=\"max-width: 100%\" width=\"560\" height=\"315\"\nsrc=\"http://www.youtube.com/embed/" + key + "\"\nframeborder=\"0\" allowfullscreen>\n</iframe>\n</p>";
        }
      }
    }
    return result;
  };

  return Renderer;

})();
});

;require.register("lib/request", function(exports, require, module) {
exports.request = function(type, url, data, callback) {
  return $.ajax({
    type: type,
    url: url,
    data: data != null ? JSON.stringify(data) : null,
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      if (callback != null) {
        return callback(null, data);
      }
    },
    error: function(data) {
      if ((data != null) && (data.msg != null) && (callback != null)) {
        return callback(new Error(data.msg));
      } else if (callback != null) {
        return callback(new Error("Server error occured"));
      }
    }
  });
};

exports.get = function(url, callback) {
  return exports.request("GET", url, null, callback);
};

exports.post = function(url, data, callback) {
  return exports.request("POST", url, data, callback);
};

exports.put = function(url, data, callback) {
  return exports.request("PUT", url, data, callback);
};

exports.del = function(url, callback) {
  return exports.request("DELETE", url, null, callback);
};
});

;require.register("lib/string", function(exports, require, module) {
exports.isSpecialKey = function(key, event) {
  var keychar;
  keychar = String.fromCharCode(key).toLowerCase();
  if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27)) {
    return true;
  } else if ('abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(keychar) === -1) {
    event.preventDefault();
    return false;
  } else {
    return true;
  }
};
});

;require.register("lib/view", function(exports, require, module) {
var View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    return View.__super__.constructor.apply(this, arguments);
  }

  View.prototype.tagName = 'div';

  View.prototype.template = function() {};

  View.prototype.initialize = function() {
    return this.render();
  };

  View.prototype.getRenderData = function() {
    var _ref;
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  View.prototype.render = function() {
    this.beforeRender();
    this.$el.html(this.template()(this.getRenderData()));
    this.afterRender();
    return this;
  };

  View.prototype.publish = function(channel, data) {
    return Backbone.Mediator.pub(channel, data);
  };

  View.prototype.beforeRender = function() {};

  View.prototype.afterRender = function() {};

  View.prototype.destroy = function() {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);
  };

  View.prototype.hide = function() {
    return this.$el.hide();
  };

  View.prototype.show = function() {
    return this.$el.show();
  };

  View.prototype.fadeOut = function(callback) {
    return this.$el.fadeOut(callback);
  };

  View.prototype.fadeIn = function(callback) {
    return this.$el.fadeIn(callback);
  };

  return View;

})(Backbone.View);
});

;require.register("lib/view_collection", function(exports, require, module) {
var View, ViewCollection, methods,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./view');

ViewCollection = (function(_super) {
  __extends(ViewCollection, _super);

  ViewCollection.prototype.collection = null;

  ViewCollection.prototype.view = null;

  ViewCollection.prototype.length = function() {
    return this.views.length;
  };

  function ViewCollection(options) {
    this.renderAll = __bind(this.renderAll, this);
    this.renderOne = __bind(this.renderOne, this);
    ViewCollection.__super__.constructor.call(this, options);
    this.collection.on('add', this.renderOne);
    this.views = [];
  }

  ViewCollection.prototype.add = function(views, options) {
    var view, _i, _len;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    for (_i = 0, _len = views.length; _i < _len; _i++) {
      view = views[_i];
      if ((view != null) && !this.get(view.cid)) {
        this.views.push(view);
        if (!options.silent) {
          this.trigger('add', view, this);
        }
      }
    }
    return this;
  };

  ViewCollection.prototype.get = function(cid) {
    return this.find(function(view) {
      return view.cid === cid;
    }) || null;
  };

  ViewCollection.prototype.remove = function(views, options) {
    var view, _i, _len;
    if (options == null) {
      options = {};
    }
    if (views != null) {
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        this.destroy(view);
        if (!options.silent) {
          this.trigger('remove', view, this);
        }
      }
    } else {
      console.log("no view given in parameters of CollectionView.remove()");
    }
    return this;
  };

  ViewCollection.prototype.destroy = function(view, options) {
    var _views;
    if (view == null) {
      view = this;
    }
    if (options == null) {
      options = {};
    }
    _views = this.filter(function(_view) {
      return view.cid !== _view.cid;
    });
    view.undelegateEvents();
    view.$el.removeData().unbind();
    view.remove();
    Backbone.View.prototype.remove.call(view);
    if (!options.silent) {
      this.trigger('remove', view, this);
    }
    return this;
  };

  ViewCollection.prototype.reset = function(views, options) {
    var view, _i, _j, _len, _len1, _ref;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    _ref = this.views;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      this.destroy(view, options);
    }
    if (views.length !== 0) {
      for (_j = 0, _len1 = views.length; _j < _len1; _j++) {
        view = views[_j];
        this.add(view, options);
      }
      if (!options.silent) {
        this.trigger('reset', view, this);
      }
    }
    return this;
  };

  ViewCollection.prototype.renderOne = function(model, options) {
    var view;
    view = new this.view(model);
    if (options != null ? options.prepend : void 0) {
      this.$el.prepend(view.render().el);
    } else {
      this.$el.append(view.render().el);
    }
    this.add(view);
    return this;
  };

  ViewCollection.prototype.renderAll = function() {
    this.collection.each(this.renderOne);
    return this;
  };

  return ViewCollection;

})(View);

methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

_.each(methods, function(method) {
  return ViewCollection.prototype[method] = function() {
    return _[method].apply(_, [this.views].concat(_.toArray(arguments)));
  };
});

module.exports = ViewCollection;
});

;require.register("models/activity", function(exports, require, module) {
var Activity,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Activity = (function(_super) {
  __extends(Activity, _super);

  Activity.prototype.urlRoot = '/activities/all/';

  Activity.prototype.idAttribute = '_id';

  Activity.prototype.defaults = {
    "tags": ["all"]
  };

  function Activity(activity) {
    Activity.__super__.constructor.call(this, activity);
    if (activity.errors.length) {
      this.set('errorAmount', activity.errors.length);
    }
  }

  return Activity;

})(Backbone.Model);
});

;require.register("models/common", function(exports, require, module) {
var CommonModel, Model,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('../lib/model');

module.exports = CommonModel = (function(_super) {
  __extends(CommonModel, _super);

  CommonModel.prototype.urlRoot = "commons/all/";

  CommonModel.prototype.idAttribute = '_id';

  function CommonModel(common) {
    var path;
    CommonModel.__super__.constructor.call(this, common);
    if (this.get('path') != null) {
      path = this.get('path');
    } else {
      path = this.get('_id') + '.jpg';
    }
    this.set('url', "/commons/" + common._id + "/" + path);
    this.set('prevUrl', "/commons/" + common._id + "/prev_" + path);
  }

  return CommonModel;

})(Model);
});

;require.register("models/contact", function(exports, require, module) {
var ContactModel, Model, request,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('lib/model');

request = require('lib/request');

module.exports = ContactModel = (function(_super) {
  __extends(ContactModel, _super);

  function ContactModel() {
    return ContactModel.__super__.constructor.apply(this, arguments);
  }

  ContactModel.prototype.urlRoot = 'contacts/';

  ContactModel.prototype.idAttribute = 'slug';

  ContactModel.prototype.initialize = function() {
    if (this.get("name") == null) {
      return this.set("name", this.get('url'));
    }
  };

  ContactModel.prototype.retry = function(callback) {
    var data;
    data = {
      slug: this.get("slug")
    };
    return request.post("/contacts/" + (this.get("slug")) + "/retry/", data, (function(_this) {
      return function(err, contact) {
        if (!err) {
          _this.set('state', 'Pending');
        }
        if (contact.state === 'Error') {
          err = {
            error: true
          };
        }
        return callback(err);
      };
    })(this));
  };

  ContactModel.prototype.accept = function(callback) {
    return this.save({
      state: 'Trusted'
    }, {
      success: (function(_this) {
        return function() {
          _this.set('state', 'Trusted');
          return callback();
        };
      })(this),
      error: (function(_this) {
        return function() {
          _this.set('state', 'Error');
          return callback({
            error: true
          });
        };
      })(this)
    });
  };

  return ContactModel;

})(Model);
});

;require.register("models/micropost", function(exports, require, module) {
var Micropost, Model, request,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('lib/model');

request = require('lib/request');

module.exports = Micropost = (function(_super) {
  __extends(Micropost, _super);

  function Micropost() {
    return Micropost.__super__.constructor.apply(this, arguments);
  }

  Micropost.prototype.urlRoot = '/microposts/all/';

  Micropost.prototype.idAttribute = '_id';

  Micropost.prototype.defaults = {
    "tags": ["all"]
  };

  Micropost.prototype.downloadPicture = function(pictureId, callback) {
    return request.get("/pictures/" + pictureId + "/download/", callback);
  };

  Micropost.prototype.downloadCommon = function(commonId, callback) {
    return request.get("/commons/" + commonId + "/download/", callback);
  };

  return Micropost;

})(Model);
});

;require.register("models/note", function(exports, require, module) {
var Model, NoteModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('../lib/model');

module.exports = NoteModel = (function(_super) {
  __extends(NoteModel, _super);

  function NoteModel() {
    return NoteModel.__super__.constructor.apply(this, arguments);
  }

  NoteModel.prototype.urlRoot = "notes/all/";

  NoteModel.prototype.idAttribute = '_id';

  return NoteModel;

})(Model);
});

;require.register("models/owner_model", function(exports, require, module) {
var Model, Owner, request,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

request = require('lib/request');

Model = require('lib/model');

module.exports = Owner = (function(_super) {
  __extends(Owner, _super);

  function Owner() {
    return Owner.__super__.constructor.apply(this, arguments);
  }

  Owner.prototype.url = '/user/';

  Owner.prototype.isNew = function() {
    return false;
  };

  Owner.prototype.newSesame = function(sesame, callback) {
    return request.put("/user/password/", {
      password: sesame
    }, callback);
  };

  return Owner;

})(Model);
});

;require.register("models/picture", function(exports, require, module) {
var Model, PictureModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('../lib/model');

module.exports = PictureModel = (function(_super) {
  __extends(PictureModel, _super);

  PictureModel.prototype.urlRoot = "pictures/all/";

  PictureModel.prototype.idAttribute = '_id';

  function PictureModel(picture) {
    var path;
    PictureModel.__super__.constructor.call(this, picture);
    if (this.get('path') != null) {
      path = this.get('path');
    } else {
      path = this.get('_id') + '.jpg';
    }
    this.set('url', "/pictures/" + picture._id + "/" + path);
    this.set('prevUrl', "/pictures/" + picture._id + "/prev_" + path);
  }

  return PictureModel;

})(Model);
});

;require.register("models/tag", function(exports, require, module) {
var Model, TagModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('lib/model');

module.exports = TagModel = (function(_super) {
  __extends(TagModel, _super);

  function TagModel() {
    return TagModel.__super__.constructor.apply(this, arguments);
  }

  TagModel.prototype.urlRoot = 'contacts/tags/';

  TagModel.prototype.idAttribute = '_id';

  return TagModel;

})(Model);
});

;require.register("routers/app_router", function(exports, require, module) {
var AppRouter,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = AppRouter = (function(_super) {
  __extends(AppRouter, _super);

  AppRouter.prototype.routes = {
    '': 'start',
    'microposts': 'microposts',
    'pictures': 'pictures',
    'commons': 'commons',
    'notes': 'notes',
    'contacts': 'contacts',
    'profile': 'profile',
    'activities': 'activities'
  };

  function AppRouter(appView) {
    this.appView = appView;
    this.checkAppViewState = __bind(this.checkAppViewState, this);
    AppRouter.__super__.constructor.call(this);
  }

  AppRouter.prototype.start = function() {
    return this.appView.checkUserState();
  };

  AppRouter.prototype.microposts = function() {
    return this.checkAppViewState((function(_this) {
      return function() {
        return _this.appView.changeSubView(_this.appView.micropostsView);
      };
    })(this));
  };

  AppRouter.prototype.notes = function() {
    return this.checkAppViewState((function(_this) {
      return function() {
        return _this.appView.changeSubView(_this.appView.notesView);
      };
    })(this));
  };

  AppRouter.prototype.contacts = function() {
    return this.checkAppViewState((function(_this) {
      return function() {
        return _this.appView.changeSubView(_this.appView.contactsView);
      };
    })(this));
  };

  AppRouter.prototype.pictures = function() {
    return this.checkAppViewState((function(_this) {
      return function() {
        return _this.appView.changeSubView(_this.appView.picturesView);
      };
    })(this));
  };

  AppRouter.prototype.commons = function() {
    return this.checkAppViewState((function(_this) {
      return function() {
        return _this.appView.changeSubView(_this.appView.commonsView);
      };
    })(this));
  };

  AppRouter.prototype.profile = function() {
    return this.checkAppViewState((function(_this) {
      return function() {
        return _this.appView.changeSubView(_this.appView.profileView);
      };
    })(this));
  };

  AppRouter.prototype.activities = function() {
    return this.checkAppViewState((function(_this) {
      return function() {
        return _this.appView.changeSubView(_this.appView.activitiesView);
      };
    })(this));
  };

  AppRouter.prototype.checkAppViewState = function(callback) {
    if (this.appView.isLoaded) {
      return callback();
    } else {
      return this.appView.checkUserState((function(_this) {
        return function() {
          _this.appView.displayMenu();
          return callback();
        };
      })(this));
    }
  };

  return AppRouter;

})(Backbone.Router);
});

;require.register("views/activities_view", function(exports, require, module) {
var ActivitiesView, Activity, ActivityListView, View, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

Activity = require('../models/activity');

ActivityListView = require('../views/activity_list_view');

request = require('../lib/request');

module.exports = ActivitiesView = (function(_super) {
  __extends(ActivitiesView, _super);

  function ActivitiesView() {
    this.loadMoreActivities = __bind(this.loadMoreActivities, this);
    return ActivitiesView.__super__.constructor.apply(this, arguments);
  }

  ActivitiesView.prototype.id = 'activities-view';

  ActivitiesView.prototype.className = 'pa1';

  ActivitiesView.prototype.template = function() {
    return require('./templates/activities');
  };

  ActivitiesView.prototype.events = {
    "click #sync-activities-button": "onSyncClicked",
    "click #more-activities-button": "loadMoreActivities"
  };

  ActivitiesView.prototype.afterRender = function() {
    this.activityList = new ActivityListView({
      el: this.$("#activity-all")
    });
    return this.isLoaded = false;
  };

  ActivitiesView.prototype.fetch = function() {
    return this.activityList.collection.fetch({
      success: (function(_this) {
        return function() {};
      })(this),
      error: (function(_this) {
        return function() {
          return alert('A server error occured while retrieving news feed');
        };
      })(this)
    });
  };

  ActivitiesView.prototype.loadMoreActivities = function() {
    return this.activityList.loadMore();
  };

  ActivitiesView.prototype.onSyncClicked = function(event) {
    $("#sync-activities-button").spin();
    return request.get("/synchronize/", function(err) {
      $("#sync-activities-button").spin();
      if (err) {
        return alert("Synchronize process failed.");
      } else {
        return alert("Synchronization process started, check back your data in a few minutes.");
      }
    });
  };

  return ActivitiesView;

})(View);
});

;require.register("views/activity_list_view", function(exports, require, module) {
var Activity, ActivityCollection, ActivityListView, ActivityView, CollectionView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('../lib/view_collection');

ActivityCollection = require('../collections/activity_collection');

ActivityView = require('../views/activity_view');

Activity = require('../models/activity');

module.exports = ActivityListView = (function(_super) {
  __extends(ActivityListView, _super);

  function ActivityListView() {
    return ActivityListView.__super__.constructor.apply(this, arguments);
  }

  ActivityListView.prototype.collection = new ActivityCollection();

  ActivityListView.prototype.view = ActivityView;

  ActivityListView.prototype.template = function() {
    return require('./templates/activity_list');
  };

  ActivityListView.prototype.afterRender = function() {
    return this.$el.addClass('activity-list mod left w100');
  };

  ActivityListView.prototype.loadMore = function() {
    var collection;
    $("#more-activities-button").spin('small');
    collection = new ActivityCollection();
    collection.url = this.collection.baseUrl + this.getLastDate();
    return collection.fetch({
      success: (function(_this) {
        return function(activities) {
          var activity, _i, _len, _ref;
          activities.models.slice();
          _ref = activities.models;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            activity = _ref[_i];
            _this.renderOne(activity);
          }
          _this.setLastDate(collection);
          $("#more-activities-button").spin();
          if (activities.length < 30) {
            return $("#more-activities-button").hide();
          }
        };
      })(this),
      error: (function(_this) {
        return function() {
          return alert('server error occured');
        };
      })(this)
    });
  };

  ActivityListView.prototype.setLastDate = function(collection) {
    var activity, lastDate;
    activity = collection.last();
    if (activity != null) {
      lastDate = moment(activity.get('date'));
      return this.lastDate = lastDate.utc().format('YYYY-MM-DD-HH-mm-SS') + '/';
    } else {
      return this.lastDate = '';
    }
  };

  ActivityListView.prototype.getLastDate = function() {
    if (this.lastDate != null) {
      return this.lastDate;
    } else {
      this.setLastDate(this.collection);
      return this.getLastDate();
    }
  };

  return ActivityListView;

})(CollectionView);
});

;require.register("views/activity_view", function(exports, require, module) {
var ActivityView, MicroPost, Renderer, View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

Renderer = require('../lib/renderer');

MicroPost = require('../models/micropost');

module.exports = ActivityView = (function(_super) {
  __extends(ActivityView, _super);

  ActivityView.prototype.className = 'activity pl0';

  ActivityView.prototype.template = function() {
    return require('./templates/activity');
  };

  ActivityView.prototype.events = {
    'click': 'onClicked',
    "click .activity-error-number": "onErrorNumberClicked",
    "click .activity-error-resend": "onErrorResendClicked"
  };

  function ActivityView(model) {
    this.model = model;
    ActivityView.__super__.constructor.call(this);
  }

  ActivityView.prototype.getRenderData = function() {
    var renderer, _ref;
    renderer = new Renderer();
    this.model.set('displayDate', renderer.renderDate(this.model.get('date')));
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  ActivityView.prototype.onClicked = function() {
    $('.activity').removeClass('selected');
    return this.$el.addClass('selected');
  };

  ActivityView.prototype.onErrorNumberClicked = function(event) {
    return this.$(".activity-errors").show();
  };

  ActivityView.prototype.onErrorResendClicked = function(event) {
    var error, extra, _i, _len, _ref;
    extra = "";
    _ref = this.model.get('errors');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      error = _ref[_i];
      if (error.contactKey && error.contactKey === event.target.id) {
        extra = error.extra;
      }
    }
    switch (this.model.get('method')) {
      case "POST":
        return this.sendRetryRequest("POST", "/microposts/" + this.model.get('docId') + "/retry/", event);
      case "DELETE":
        return this.sendRetryRequest("PUT", "/microposts/" + this.model.get('docId') + "/retry/", event, extra);
    }
  };

  ActivityView.prototype.sendRetryRequest = function(type, path, event, extra) {
    $(event.target).html("resending...");
    return $.ajax({
      type: type,
      url: path,
      data: '{"contactId": "' + event.target.id + '", "activityId":"' + this.model.id + '", "extra":"' + extra + '"}',
      dataType: "json",
      success: (function(_this) {
        return function(data) {
          return $(event.target).html("resending succeeded.");
        };
      })(this),
      error: (function(_this) {
        return function(data) {
          alert("Sending data failed again.");
          return $(event.target).html("resend");
        };
      })(this)
    });
  };

  return ActivityView;

})(View);
});

;require.register("views/app_view", function(exports, require, module) {
var ActivitiesView, AppRouter, AppView, CommonsView, ContactsView, LoginView, MicropostsView, NotesView, PicturesView, ProfileView, RegisterNameView, RegisterPasswordView, View, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

AppRouter = require('../routers/app_router');

MicropostsView = require('./microposts_view');

ContactsView = require('./contacts_view');

NotesView = require('./notes_view');

PicturesView = require('./pictures_view');

CommonsView = require('./commons_view');

ProfileView = require('./profile_view');

ActivitiesView = require('./activities_view');

LoginView = require('./login_view');

RegisterNameView = require('./register_name_view');

RegisterPasswordView = require('./register_password_view');

request = require('lib/request');

module.exports = AppView = (function(_super) {
  __extends(AppView, _super);

  function AppView() {
    this.changeMenuState = __bind(this.changeMenuState, this);
    this._addView = __bind(this._addView, this);
    this.changeView = __bind(this.changeView, this);
    this.changeSubView = __bind(this.changeSubView, this);
    this.displayView = __bind(this.displayView, this);
    this.displayLogin = __bind(this.displayLogin, this);
    this.displayRegisterName = __bind(this.displayRegisterName, this);
    this.displayRegisterPassword = __bind(this.displayRegisterPassword, this);
    this.displayMenu = __bind(this.displayMenu, this);
    this.displayHome = __bind(this.displayHome, this);
    this.displayMicroposts = __bind(this.displayMicroposts, this);
    this.displayProfile = __bind(this.displayProfile, this);
    return AppView.__super__.constructor.apply(this, arguments);
  }

  AppView.prototype.el = 'body.application';

  AppView.prototype.template = function() {
    return require('./templates/home');
  };

  AppView.prototype.events = {
    'click #logout-button': 'onLogoutClicked',
    'click #responsive-menu': 'onResponsiveMenuClicked'
  };

  AppView.prototype.checkUserState = function(callback) {
    return request.get('user/state/', (function(_this) {
      return function(err, data) {
        if (err) {
          return alert("Something went wrong, can't load newebe data.");
        } else {
          return _this.start(data, callback);
        }
      };
    })(this));
  };

  AppView.prototype.onLogoutClicked = function(event) {
    return request.get('logout/', (function(_this) {
      return function(err, data) {
        if (err) {
          return alert("Something went wrong while logging out");
        } else {
          Newebe.routers.appRouter.navigate('');
          return _this.displayLogin();
        }
      };
    })(this));
  };

  AppView.prototype.onResponsiveMenuClicked = function() {
    return this.$('#navigation ul').slideToggle();
  };

  AppView.prototype.start = function(userState, callback) {
    this.home = this.$('#home');
    this.menu = this.$("#navigation");
    this.home.html(null);
    this.loginView = this._addView(LoginView);
    this.registerNameView = this._addView(RegisterNameView);
    this.registerPasswordView = this._addView(RegisterPasswordView);
    this.micropostsView = this._addView(MicropostsView);
    this.picturesView = this._addView(PicturesView);
    this.commonsView = this._addView(CommonsView);
    this.contactsView = this._addView(ContactsView);
    this.profileView = this._addView(ProfileView);
    this.notesView = this._addView(NotesView);
    this.activitiesView = this._addView(ActivitiesView);
    if (userState.authenticated && (callback != null)) {
      callback();
    } else if (userState.authenticated) {
      this.displayHome();
      this.micropostsView.fetch();
    } else if (userState.password) {
      this.displayLogin();
    } else if (userState.registered) {
      this.displayRegisterPassword();
    } else {
      this.displayRegisterName();
    }
    return this.isLoaded = true;
  };

  AppView.prototype.onMicropostsClicked = function() {
    return this.changeSubView(this.micropostsView);
  };

  AppView.prototype.onContactsClicked = function() {
    return this.changeSubView(this.contactsView);
  };

  AppView.prototype.onPicturesClicked = function() {
    return this.changeSubView(this.picturesView);
  };

  AppView.prototype.onCommonsClicked = function() {
    return this.changeSubView(this.commonsClicked);
  };

  AppView.prototype.onNotesClicked = function() {
    return this.changeSubView(this.notesView);
  };

  AppView.prototype.displayProfile = function() {
    return this.changeSubView(this.profileView);
  };

  AppView.prototype.displayMicroposts = function() {
    var _ref;
    this.changeSubView(this.micropostsView);
    return (_ref = this.micropostsView.tagList) != null ? _ref.fetch() : void 0;
  };

  AppView.prototype.displayHome = function() {
    var showHome;
    showHome = (function(_this) {
      return function() {
        _this.displayMenu();
        return _this.displayMicroposts();
      };
    })(this);
    if (this.currentView != null) {
      return this.currentView.fadeOut(showHome);
    } else {
      return showHome();
    }
  };

  AppView.prototype.displayMenu = function() {
    this.menu.removeClass('hidden');
    return this.menu.fadeIn();
  };

  AppView.prototype.displayRegisterPassword = function() {
    return this.changeView(this.registerPasswordView);
  };

  AppView.prototype.displayRegisterName = function() {
    return this.changeView(this.registerNameView);
  };

  AppView.prototype.displayLogin = function() {
    this.loginView.clearField();
    return this.changeView(this.loginView);
  };

  AppView.prototype.displayView = function(view) {
    var showView;
    showView = (function(_this) {
      return function() {
        if (view.fetch != null) {
          view.fetch();
        }
        return _this.changeView(view, function() {
          _this.menu.removeClass('hidden');
          return _this.menu.fadeIn();
        });
      };
    })(this);
    if (this.isLoaded) {
      return displayView();
    } else {
      return this.checkUserState(showView);
    }
  };

  AppView.prototype.changeSubView = function(subView, callback) {
    if ($(window).width() < 760) {
      this.$('#navigation ul').slideUp();
    }
    this.changeMenuState(subView);
    if (this.currentSubView != null) {
      return this.currentSubView.fadeOut((function(_this) {
        return function() {
          _this.currentSubView = null;
          return _this.changeSubView(subView, callback);
        };
      })(this));
    } else {
      subView.fadeIn();
      this.currentSubView = subView;
      if (!this.currentSubView.isLoaded && (this.currentSubView.fetch != null)) {
        this.currentSubView.fetch();
      }
      if (callback != null) {
        return callback();
      }
    }
  };

  AppView.prototype.changeView = function(view, callback) {
    this.currentView = view;
    this.menu.fadeOut();
    return this.home.children().fadeOut((function(_this) {
      return function() {
        _this.home.hide();
        view.$el.show();
        _this.home.fadeIn(function() {
          if (view.focusField != null) {
            return view.focusField();
          }
        });
        if (callback != null) {
          return callback();
        }
      };
    })(this));
  };

  AppView.prototype._addView = function(viewClass) {
    var view;
    view = new viewClass();
    view.hide();
    this.home.append(view.el);
    return view;
  };

  AppView.prototype.changeMenuState = function(view) {
    this.$("#navigation").find("a").removeClass("active");
    if (view === this.micropostsView) {
      this.$("#microposts-button").addClass("active");
      return this.$("#responsive-menu a").html('news');
    } else if (view === this.contactsView) {
      this.$("#contacts-button").addClass("active");
      return this.$("#responsive-menu a").html('contacts');
    } else if (view === this.profileView) {
      this.$("#profile-button").addClass("active");
      return this.$("#responsive-menu a").html('profile');
    } else if (view === this.notesView) {
      this.$("#notes-button").addClass("active");
      return this.$("#responsive-menu a").html('notes');
    } else if (view === this.picturesView) {
      this.$("#pictures-button").addClass("active");
      return this.$("#responsive-menu a").html('pictures');
    } else if (view === this.commonsView) {
      this.$("#commons-button").addClass("active");
      return this.$("#responsive-menu a").html('commons');
    }
  };

  return AppView;

})(View);
});

;require.register("views/common", function(exports, require, module) {
var CommonView, Renderer, View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

Renderer = require('../lib/renderer');

module.exports = CommonView = (function(_super) {
  __extends(CommonView, _super);

  CommonView.prototype.className = 'common pa1';

  CommonView.prototype.template = function() {
    return require('./templates/common');
  };

  CommonView.prototype.events = {
    'click': 'onClicked',
    'click .common-delete-button': 'onDeleteClicked'
  };

  CommonView.prototype.onClicked = function() {
    $('.common').unselect();
    $('.common-buttons').hide();
    this.$el.select();
    return this.buttons.show();
  };

  CommonView.prototype.onDeleteClicked = function() {
    this.model.urlRoot = 'commons/';
    return this.model.destroy({
      success: (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this),
      error: (function(_this) {
        return function() {
          return alert('server error occured');
        };
      })(this)
    });
  };

  function CommonView(model) {
    this.model = model;
    CommonView.__super__.constructor.call(this);
  }

  CommonView.prototype.afterRender = function() {
    this.buttons = this.$('.common-buttons');
    return this.buttons.hide();
  };

  CommonView.prototype.getRenderData = function() {
    var renderer, _ref;
    renderer = new Renderer();
    this.model.set('displayDate', renderer.renderDate(this.model.get('date')));
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  return CommonView;

})(View);
});

;require.register("views/commons", function(exports, require, module) {
var CollectionView, CommonView, CommonsCollection, CommonsView, NoteView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('../lib/view_collection');

CommonView = require('./common');

CommonsCollection = require('../collections/commons');

NoteView = require('./note');

module.exports = CommonsView = (function(_super) {
  __extends(CommonsView, _super);

  CommonsView.prototype.el = '#commons';

  CommonsView.prototype.collection = new CommonsCollection();

  CommonsView.prototype.view = CommonView;

  CommonsView.prototype.template = function() {
    return require('./templates/commons');
  };

  function CommonsView(collection) {
    CommonsView.__super__.constructor.apply(this, arguments);
    this.rendered = 0;
  }

  CommonsView.prototype.afterRender = function() {};

  CommonsView.prototype.fetch = function() {
    this.collection.off('add');
    return this.collection.fetch({
      success: (function(_this) {
        return function(commons) {
          return _this.renderAll(commons.models);
        };
      })(this)
    });
  };

  CommonsView.prototype.renderAll = function(models) {
    var model, _i, _len;
    for (_i = 0, _len = models.length; _i < _len; _i++) {
      model = models[_i];
      this.renderOne(model);
    }
    return this;
  };

  CommonsView.prototype.loadMore = function() {
    var collection;
    $("#more-commons").spin('small');
    collection = new CommonsCollection();
    collection.url = this.collection.url + this.getLastDate();
    return collection.fetch({
      success: (function(_this) {
        return function(commons) {
          console.log(commons);
          _this.renderAll(commons.models);
          _this.setLastDate(collection);
          $("#more-commons").spin();
          if (commons.length < 12) {
            return $("#more-commons").hide();
          }
        };
      })(this),
      error: (function(_this) {
        return function() {
          return alert('server error occured');
        };
      })(this)
    });
  };

  CommonsView.prototype.setLastDate = function(collection) {
    var common, lastDate;
    common = collection.last();
    if (common != null) {
      lastDate = moment(common.get('date'));
      return this.lastDate = lastDate.utc().format('YYYY-MM-DD-HH-mm-SS') + '/';
    } else {
      return this.lastDate = '';
    }
  };

  CommonsView.prototype.getLastDate = function() {
    if (this.lastDate != null) {
      return this.lastDate;
    } else {
      this.setLastDate(this.collection);
      return this.getLastDate();
    }
  };

  return CommonsView;

})(CollectionView);
});

;require.register("views/commons_view", function(exports, require, module) {
var Common, CommonsMainView, CommonsView, View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

CommonsView = require('./commons');

Common = require('../models/common');

module.exports = CommonsMainView = (function(_super) {
  __extends(CommonsMainView, _super);

  function CommonsMainView() {
    this.loadMoreCommons = __bind(this.loadMoreCommons, this);
    return CommonsMainView.__super__.constructor.apply(this, arguments);
  }

  CommonsMainView.prototype.id = 'commons-view';

  CommonsMainView.prototype.events = {
    "click #more-commons": "loadMoreCommons"
  };

  CommonsMainView.prototype.template = function() {
    return require('./templates/commons_view');
  };

  CommonsMainView.prototype.afterRender = function() {};

  CommonsMainView.prototype.fetch = function() {
    if (this.commonsView == null) {
      this.commonsView = new CommonsView();
    }
    this.commonsView.fetch();
    return this.isLoaded = true;
  };

  CommonsMainView.prototype.loadMoreCommons = function() {
    return this.commonsView.loadMore();
  };

  return CommonsMainView;

})(View);
});

;require.register("views/contact_view", function(exports, require, module) {
var ContactView, View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

View = require('lib/view');

module.exports = ContactView = (function(_super) {
  __extends(ContactView, _super);

  ContactView.prototype.className = 'contact-line clearfix';

  ContactView.prototype.rootUrl = 'contacts/';

  ContactView.prototype.events = {
    'click .contact-delete-button': 'onDeleteClicked',
    'click .contact-retry-button': 'onRetryClicked',
    'click .contact-accept-button': 'onAcceptClicked'
  };

  function ContactView(model) {
    this.model = model;
    ContactView.__super__.constructor.call(this);
  }

  ContactView.prototype.template = function() {
    return require('./templates/contact');
  };

  ContactView.prototype.getRenderData = function() {
    var _ref;
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  ContactView.prototype.afterRender = function() {
    if (this.model.get('state') !== 'Error') {
      this.$('.contact-retry-button').hide();
    }
    if (this.model.get('state') !== 'Wait for approval') {
      return this.$('.contact-accept-button').hide();
    }
  };

  ContactView.prototype.onDeleteClicked = function() {
    var button;
    button = this.$('.contact-delete-button');
    button.spin('small');
    return this.model.destroy({
      success: (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this),
      error: (function(_this) {
        return function() {
          button.spin();
          return alert('An error occured while deleting contact');
        };
      })(this)
    });
  };

  ContactView.prototype.onRetryClicked = function() {
    var button;
    button = this.$('.contact-retry-button');
    button.spin('small');
    return this.model.retry((function(_this) {
      return function(err) {
        button.spin();
        if (err) {
          return alert('Contact request failed again.');
        } else {
          return _this.$('.state').html('Pending');
        }
      };
    })(this));
  };

  ContactView.prototype.onAcceptClicked = function() {
    var button;
    button = this.$('.contact-accept-button');
    button.spin('small');
    return this.model.accept((function(_this) {
      return function(err) {
        button.spin();
        if (err) {
          alert('Contact approval failed.');
          _this.$('.state').html('Error');
          return _this.$('.contact-retry-button').show();
        } else {
          return _this.$('.state').html('Trusted');
        }
      };
    })(this));
  };

  ContactView.prototype.addTag = function(tag) {
    var name, tagView, _ref;
    name = tag.get('name');
    if (name !== "all") {
      this.$('.contact-tags').append("<button class=\"tag-" + name + " contact-tag toggle-button\">" + (tag.get("name")) + "</button>");
      tagView = this.$el.find(".contact-tag").last();
      if (_ref = tag.get("name"), __indexOf.call(this.model.get("tags"), _ref) >= 0) {
        tagView.addClass("selected");
        this.$el.addClass("filter-" + name);
      }
      return tagView.click((function(_this) {
        return function() {
          var tags, _ref1;
          tags = _this.model.get("tags");
          if (_ref1 = tag.get("name"), __indexOf.call(_this.model.get("tags"), _ref1) >= 0) {
            tagView.removeClass("selected");
            tags = _.without(tags, tag.get("name"));
            _this.model.set("tags", tags);
          } else {
            _this.model.get("tags").push(tag.get("name"));
            tagView.addClass("selected");
          }
          return _this.model.save();
        };
      })(this));
    }
  };

  return ContactView;

})(View);
});

;require.register("views/contacts_view", function(exports, require, module) {
var CollectionView, Contact, ContactView, Contacts, ContactsView, TagsView, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('../lib/view_collection');

Contacts = require('../collections/contacts');

Contact = require('../models/contact');

ContactView = require('./contact_view');

TagsView = require('./tags_view');

request = require('lib/request');

module.exports = ContactsView = (function(_super) {
  __extends(ContactsView, _super);

  function ContactsView() {
    this.onTagAdded = __bind(this.onTagAdded, this);
    this.renderOne = __bind(this.renderOne, this);
    this.onAddContactClicked = __bind(this.onAddContactClicked, this);
    return ContactsView.__super__.constructor.apply(this, arguments);
  }

  ContactsView.prototype.id = 'contacts-view';

  ContactsView.prototype.collection = new Contacts();

  ContactsView.prototype.view = ContactView;

  ContactsView.prototype.events = {
    'click #add-contact-button': 'onAddContactClicked'
  };

  ContactsView.prototype.subscriptions = {
    'tag:selected': 'onTagSelected'
  };

  ContactsView.prototype.template = function() {
    return require('./templates/contacts');
  };

  ContactsView.prototype.afterRender = function() {
    this.isLoaded = false;
    this.newContactInput = this.$('#new-contact-field');
    this.addContactButton = this.$('#add-contact-button');
    return this.configureRealTime();
  };

  ContactsView.prototype.configureRealTime = function() {
    var host, path, protocol;
    protocol = "";
    if (window.location.protocol === 'http:') {
      protocol = 'ws';
    } else if (window.location.protocol === 'https:') {
      protocol = 'wss';
    }
    host = window.location.host;
    path = "" + protocol + "://" + host + "/contacts/publisher/";
    this.ws = new WebSocket(path);
    return this.ws.onmessage = (function(_this) {
      return function(evt) {
        var contact, contactView, previousContact, view, _i, _len, _ref;
        contact = new Contact(JSON.parse(evt.data));
        previousContact = _this.collection.findWhere({
          '_id': contact.get('_id')
        });
        if (previousContact != null) {
          _ref = _this.views;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            view = _ref[_i];
            if (view.model.cid === previousContact.cid) {
              contactView = view;
            }
          }
          if (contactView != null) {
            _this.collection.remove(previousContact);
            _this.destroy(contactView);
            return _this.renderOne(contact, {
              prepend: true
            });
          }
        } else {
          return _this.renderOne(contact);
        }
      };
    })(this);
  };

  ContactsView.prototype.isValidUrl = function(string) {
    var isValid, regexp;
    regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g;
    isValid = string.match(regexp) !== null;
    return isValid;
  };

  ContactsView.prototype.checkUrl = function(contactUrl) {
    if (contactUrl.indexOf('/', contactUrl.length - 1) === -1) {
      contactUrl += '/';
    }
    if (this.collection.containsContact(contactUrl)) {
      this.$('.error').html('Contact is already in your list');
      return false;
    } else if (!this.isValidUrl(contactUrl)) {
      this.$('.error').html("Wrong URL, URL should look like https://newebe.mydomain.net/ or\nlike https://87.123.21.13:12000/.");
      return false;
    } else {
      return true;
    }
  };

  ContactsView.prototype.onAddContactClicked = function() {
    var button, contactUrl, data;
    contactUrl = this.newContactInput.val();
    data = {
      url: contactUrl
    };
    button = $("#add-contact-button");
    if (this.checkUrl(contactUrl)) {
      this.$('.error').html("");
      button.spin('small');
      return this.collection.create(data, {
        success: (function(_this) {
          return function(model) {
            button.spin();
            model.set('name', model.get('url'));
            _this.renderOne(model);
            _this.newContactInput.val(null);
            return _this.newContactInput.focus();
          };
        })(this),
        error: (function(_this) {
          return function() {
            button.spin();
            return alert('Something went wrong while adding contact');
          };
        })(this),
        silent: true
      });
    }
  };

  ContactsView.prototype.renderOne = function(model) {
    var tag, view, _i, _len, _ref;
    view = new this.view(model);
    this.$el.append(view.render().el);
    this.add(view);
    if (model.get("state") === "Trusted") {
      _ref = this.tagsView.collection.toArray();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        view.addTag(tag);
      }
    }
    return this;
  };

  ContactsView.prototype.fetch = function() {
    this.$('.contact').remove();
    if (this.tagsView == null) {
      this.tagsView = new TagsView({
        el: '#tag-list'
      });
      this.tagsView.contactsView = this;
    }
    this.tagsView.$el.spin('small');
    this.tagsView.fetch({
      success: (function(_this) {
        return function() {
          _this.tagsView.$el.spin();
          _this.$el.spin('small');
          return _this.collection.fetch({
            success: function() {
              return _this.$el.spin();
            },
            error: function() {
              return _this.$el.spin();
            }
          });
        };
      })(this),
      error: (function(_this) {
        return function() {
          return alert("an error occured");
        };
      })(this)
    });
    return this.isLoaded = true;
  };

  ContactsView.prototype.onTagSelected = function(name) {
    if (this.tagsView != null) {
      this.tagsView.select(name);
    }
    if (name === 'all') {
      return this.$('.contact-line').show();
    } else {
      this.$('.contact-line').hide();
      return this.$(".filter-" + name).show();
    }
  };

  ContactsView.prototype.onTagDeleted = function(name) {
    this.$(".contact-line").removeClass("tag-" + name);
    return this.$(".tag-" + name).remove();
  };

  ContactsView.prototype.onTagAdded = function(tag) {
    var view, _i, _len, _ref, _results;
    _ref = this.views;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      if (view.model.get('state') === 'Trusted') {
        _results.push(view.addTag(tag));
      }
    }
    return _results;
  };

  return ContactsView;

})(CollectionView);
});

;require.register("views/filter_tags_view", function(exports, require, module) {
var CollectionView, FilterTagsView, TagAllView, TagView, Tags, stringUtils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('../lib/view_collection');

TagView = require('./tag_view');

TagAllView = require('./tag_all_view');

Tags = require('../collections/tags');

stringUtils = require('../lib/string');

module.exports = FilterTagsView = (function(_super) {
  __extends(FilterTagsView, _super);

  function FilterTagsView() {
    return FilterTagsView.__super__.constructor.apply(this, arguments);
  }

  FilterTagsView.prototype.el = '.filter-tag-list';

  FilterTagsView.prototype.collection = new Tags();

  FilterTagsView.prototype.view = TagView;

  FilterTagsView.prototype.template = function() {
    return require('./templates/filter_tags');
  };

  FilterTagsView.prototype.fetch = function(callbacks) {
    if (this.views.length > 0) {
      this.remove(this.views);
    }
    return this.collection.fetch(callbacks);
  };

  return FilterTagsView;

})(CollectionView);
});

;require.register("views/login_view", function(exports, require, module) {
var LoginView, QuestionView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

QuestionView = require('./question_view');

module.exports = LoginView = (function(_super) {
  __extends(LoginView, _super);

  function LoginView() {
    this.onServerResponse = __bind(this.onServerResponse, this);
    return LoginView.__super__.constructor.apply(this, arguments);
  }

  LoginView.prototype.id = 'login-view';

  LoginView.prototype.initialize = function() {
    this.question = "What is your sesame ?";
    this.fieldId = "login-password";
    this.type = "password";
    this.fieldName = "password";
    this.submitPath = 'login/json/';
    return this.render();
  };

  LoginView.prototype.onServerResponse = function(err, data) {
    if (err) {
      return this.field.val(null);
    } else {
      return this.field.animate({
        boxShadow: '0'
      }, (function(_this) {
        return function() {
          return Newebe.views.appView.displayHome();
        };
      })(this));
    }
  };

  return LoginView;

})(QuestionView);
});

;require.register("views/micropost_list_view", function(exports, require, module) {
var CollectionView, Micropost, MicropostCollection, MicropostListView, MicropostView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('../lib/view_collection');

MicropostCollection = require('../collections/micropost_collection');

MicropostView = require('../views/micropost_view');

Micropost = require('../models/micropost');

module.exports = MicropostListView = (function(_super) {
  __extends(MicropostListView, _super);

  function MicropostListView() {
    this.prependMicropost = __bind(this.prependMicropost, this);
    return MicropostListView.__super__.constructor.apply(this, arguments);
  }

  MicropostListView.prototype.collection = new MicropostCollection();

  MicropostListView.prototype.view = MicropostView;

  MicropostListView.prototype.template = function() {
    return require('./templates/micropost_list');
  };

  MicropostListView.prototype.afterRender = function() {
    return this.$el.addClass('micropost-list mod left w100');
  };

  MicropostListView.prototype.prependMicropost = function(micropost) {
    return this.renderOne(micropost, {
      prepend: true
    });
  };

  MicropostListView.prototype.loadTag = function(tag) {
    var date, lastDate;
    this.tag = tag;
    lastDate = moment();
    date = lastDate.format('YYYY-MM-DD-HH-mm-ss/');
    this.remove(this.views, {
      silent: true
    });
    this.collection.reset();
    this.views = [];
    if (tag !== 'all') {
      this.collection.url = this.collection.baseUrl + date;
      this.collection.url += "tags/" + this.tag + "/";
    } else {
      this.collection.url = this.collection.baseUrl;
    }
    this.$el.spin('small');
    this.$el.css('height', '50px');
    return this.collection.fetch({
      success: (function(_this) {
        return function(microposts) {
          var micropost, _i, _len, _ref, _results;
          _this.$el.spin();
          _this.$el.css('height', 'auto');
          if (_this.views.length === 0) {
            _ref = microposts.models;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              micropost = _ref[_i];
              _results.push(_this.renderOne(micropost));
            }
            return _results;
          }
        };
      })(this),
      error: (function(_this) {
        return function() {
          _this.$el.$el.spin();
          return alert('A server error occured while retrieving news feed');
        };
      })(this)
    });
  };

  MicropostListView.prototype.loadMore = function(callback) {
    var collection;
    collection = new MicropostCollection();
    collection.url = this.collection.baseUrl + this.getLastDate();
    if (this.tag != null) {
      collection.url += "tags/" + this.tag + "/";
    }
    return collection.fetch({
      success: (function(_this) {
        return function(microposts) {
          var micropost, _i, _len, _ref;
          if (microposts.size() < 11) {
            Backbone.Mediator.publish('posts:no-more', true);
          }
          _ref = microposts.models;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            micropost = _ref[_i];
            _this.renderOne(micropost);
          }
          _this.setLastDate(collection);
          return callback();
        };
      })(this),
      error: (function(_this) {
        return function() {
          alert('server error occured');
          return callback();
        };
      })(this)
    });
  };

  MicropostListView.prototype.setLastDate = function(collection) {
    var activity, lastDate;
    activity = collection.last();
    if (activity != null) {
      lastDate = moment(activity.get('date'));
      return this.lastDate = lastDate.utc().format('YYYY-MM-DD-HH-mm-SS') + '/';
    } else {
      return this.lastDate = '';
    }
  };

  MicropostListView.prototype.getLastDate = function() {
    if (this.lastDate != null) {
      return this.lastDate;
    } else {
      this.setLastDate(this.collection);
      return this.getLastDate();
    }
  };

  MicropostListView.prototype.search = function(query, callback) {
    return $.ajax({
      url: "microposts/search/",
      type: 'POST',
      data: '{"query": "' + query + '"}',
      dataType: "json",
      success: (function(_this) {
        return function(data) {
          var micropost, _i, _len, _ref;
          _this.collection.reset(data.rows);
          _this.reset();
          _ref = _this.collection.models;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            micropost = _ref[_i];
            _this.renderOne(micropost);
          }
          return callback();
        };
      })(this),
      error: (function(_this) {
        return function(data) {
          alert('error occured while fetching search results');
          return callback();
        };
      })(this)
    });
  };

  return MicropostListView;

})(CollectionView);
});

;require.register("views/micropost_view", function(exports, require, module) {
var MicroPost, MicropostView, NoteSelector, Renderer, View, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

Renderer = require('../lib/renderer');

MicroPost = require('../models/micropost');

NoteSelector = require('./note_selector');

request = require('../lib/request');

module.exports = MicropostView = (function(_super) {
  __extends(MicropostView, _super);

  MicropostView.prototype.className = 'micropost pt1 pb1 pl1 line';

  MicropostView.prototype.template = function() {
    return require('./templates/micropost');
  };

  MicropostView.prototype.events = {
    'click': 'onClicked',
    'click .micropost-delete-button': 'onDeleteClicked',
    'click .micropost-save-to-note-button': 'onSaveToNoteClicked'
  };

  function MicropostView(model) {
    this.model = model;
    this.hideDlBtnAndDisplayCommon = __bind(this.hideDlBtnAndDisplayCommon, this);
    this.hideDlBtnAndDisplayPicture = __bind(this.hideDlBtnAndDisplayPicture, this);
    MicropostView.__super__.constructor.call(this);
  }

  MicropostView.prototype.afterRender = function() {
    var commonId, pictureId, _ref, _ref1;
    this.buttons = this.$('.micropost-buttons');
    this.downloadButton = this.$('.download-picture-btn');
    pictureId = (_ref = this.model.get('pictures_to_download')) != null ? _ref[0] : void 0;
    this.downloadRunning = false;
    this.downloadButton.click((function(_this) {
      return function() {
        if (!_this.downloadRunning) {
          _this.downloadRunning = true;
          return _this.model.downloadPicture(pictureId, function(err) {
            if (err) {
              return alert('Picture cannot be loaded');
            } else {
              return _this.hideDlBtnAndDisplayPicture(pictureId);
            }
          });
        }
      };
    })(this));
    this.downloadButton = this.$('.download-common-btn');
    commonId = (_ref1 = this.model.get('commons_to_download')) != null ? _ref1[0] : void 0;
    return this.downloadButton.click((function(_this) {
      return function() {
        if (!_this.downloadRunning) {
          _this.downloadRunning = true;
          return _this.model.downloadCommon(commonId, function(err) {
            if (err) {
              return alert('Common cannot be loaded');
            } else {
              return _this.hideDlBtnAndDisplayCommon(commonId);
            }
          });
        }
      };
    })(this));
  };

  MicropostView.prototype.hideDlBtnAndDisplayPicture = function(pictureId) {
    this.downloadButton = this.$('.download-picture-btn');
    this.downloadButton.prev().fadeOut();
    return this.downloadButton.fadeOut((function(_this) {
      return function() {
        _this.downloadButton.after("<a href=\"pictures/" + pictureId + "/" + pictureId + ".jpg\">\n<img class=\"post-picture\" src=\"pictures/" + pictureId + "/prev_" + pictureId + ".jpg\" />\n</a>");
        return _this.downloadRunning = false;
      };
    })(this));
  };

  MicropostView.prototype.hideDlBtnAndDisplayCommon = function(commonId) {
    this.downloadButton.prev().fadeOut();
    return this.downloadButton.fadeOut((function(_this) {
      return function() {
        _this.downloadRunning = false;
        return request.get("/commons/" + commonId + "/", function(err, commonRows) {
          var common;
          common = commonRows.rows[0];
          return _this.downloadButton.after("<a href=\"commons/" + commonId + "/" + common.path + "\">\n" + common.path + "\n</a>");
        });
      };
    })(this));
  };

  MicropostView.prototype.getRenderData = function() {
    var renderer, _ref;
    renderer = new Renderer();
    this.model.set('displayContent', renderer.renderDoc(this.model));
    this.model.set('displayDate', renderer.renderDate(this.model.get('date')));
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  MicropostView.prototype.onClicked = function() {
    var commons;
    $('.micropost').removeClass('selected');
    $('.micropost-buttons').hide();
    commons = this.model.get('commons');
    this.$el.select();
    return this.buttons.show();
  };

  MicropostView.prototype.onDeleteClicked = function() {
    var button;
    this.model.url = "microposts/" + this.model.id + "/";
    button = this.$(".micropost-delete-button");
    button.spin('small');
    return this.model.destroy({
      success: (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this),
      error: (function(_this) {
        return function() {
          button.spin();
          return alert('server error occured, the micropost cannot be deleted.');
        };
      })(this)
    });
  };

  MicropostView.prototype.onSaveToNoteClicked = function() {
    return NoteSelector.getDialog().show(this.model);
  };

  return MicropostView;

})(View);
});

;require.register("views/microposts_view", function(exports, require, module) {
var MicroPost, MicropostListView, MicropostsView, SimpleTagList, View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

MicroPost = require('../models/micropost');

MicropostListView = require('../views/micropost_list_view');

SimpleTagList = require('../views/simple_tag_list');

module.exports = MicropostsView = (function(_super) {
  __extends(MicropostsView, _super);

  function MicropostsView() {
    this.onSearchKeyUp = __bind(this.onSearchKeyUp, this);
    this.loadMoreMicroposts = __bind(this.loadMoreMicroposts, this);
    this.createNewPost = __bind(this.createNewPost, this);
    this.onMicropostFieldKeyup = __bind(this.onMicropostFieldKeyup, this);
    this.onMicropostFieldKeydown = __bind(this.onMicropostFieldKeydown, this);
    return MicropostsView.__super__.constructor.apply(this, arguments);
  }

  MicropostsView.prototype.id = 'microposts-view';

  MicropostsView.prototype.className = 'pa1';

  MicropostsView.prototype.template = function() {
    return require('./templates/microposts');
  };

  MicropostsView.prototype.events = {
    "keyup #micropost-field": "onMicropostFieldKeyup",
    "keydown #micropost-field": "onMicropostFieldKeydown",
    "click #micropost-post-button": "createNewPost",
    "click #more-microposts-button": "loadMoreMicroposts",
    "click #add-attachment": "onAddAttachmentClicked",
    "keyup #microposts-search": "onSearchKeyUp"
  };

  MicropostsView.prototype.subscriptions = {
    'tag:selected': 'onTagSelected',
    'posts:no-more': 'onNoMorePost'
  };

  MicropostsView.prototype.afterRender = function() {
    this.micropostList = new MicropostListView({
      el: this.$("#micropost-all")
    });
    this.isLoaded = false;
    this.micropostField = this.$("#micropost-field");
    this.micropostButton = this.$("#micropost-post-button");
    setTimeout((function(_this) {
      return function() {
        _this.tagList = new SimpleTagList('#micropost-tag-list');
        _this.tagList.fetch({
          success: function() {
            return _this.tagList.select('all');
          }
        });
        _this.configureUpload();
        return _this.$("#micropost-field").focus();
      };
    })(this), 200);
    this.configurePublisherSubscription();
    return this.isSearchRunning = false;
  };

  MicropostsView.prototype.configurePublisherSubscription = function() {
    var host, path, protocol;
    protocol = "";
    if (window.location.protocol === 'http:') {
      protocol = 'ws';
    } else if (window.location.protocol === 'https:') {
      protocol = 'wss';
    }
    host = window.location.host;
    path = "" + protocol + "://" + host + "/microposts/publisher/";
    this.ws = new WebSocket(path);
    return this.ws.onmessage = (function(_this) {
      return function(evt) {
        var micropost;
        micropost = new MicroPost(JSON.parse(evt.data));
        return _this.micropostList.prependMicropost(micropost);
      };
    })(this);
  };

  MicropostsView.prototype.configureUpload = function() {
    var input, previewNode;
    input = document.getElementById('attach-picture');
    previewNode = document.getElementById('preview-list');
    return FileAPI.event.on(input, 'change', (function(_this) {
      return function(evt) {
        var callback1, files;
        files = FileAPI.getFiles(evt);
        callback1 = function(file, info) {
          return true;
        };
        return FileAPI.filterFiles(files, callback1, function(fileList, ignor) {
          var imageList;
          if (!fileList.length) {
            alert('No file selected, no upload possible');
            return 0;
          }
          imageList = FileAPI.filter(fileList, function(file) {
            return /image/.test(file.type);
          });
          fileList = FileAPI.filter(fileList, function(file) {
            return !/image/.test(file.type);
          });
          _this.$(".js-fileapi-wrapper input").fadeOut();
          FileAPI.each(imageList, function(imageFile) {
            return FileAPI.Image(imageFile).preview(100, 120).get(function(err, image) {
              if (err) {
                return alert(err);
              } else {
                return previewNode.appendChild(image);
              }
            });
          });
          FileAPI.each(fileList, function(file) {
            return $(previewNode).append("<p>" + file.name + "</p>");
          });
          _this.attachedImages = imageList;
          return _this.attachedFiles = fileList;
        });
      };
    })(this));
  };

  MicropostsView.prototype.fetch = function() {
    this.$(".tag-all .tag-select-button").addClass('selected');
    return this.micropostList.loadTag('all');
  };

  MicropostsView.prototype.onAddAttachmentClicked = function(event) {
    return $(event.target).fadeOut((function(_this) {
      return function() {
        _this.$(".js-fileapi-wrapper input").show();
        return _this.$(".js-fileapi-wrapper").fadeIn();
      };
    })(this));
  };

  MicropostsView.prototype.onMicropostFieldKeydown = function(event) {
    if (event.keyCode === 17) {
      return this.isCtrl = true;
    }
  };

  MicropostsView.prototype.onMicropostFieldKeyup = function(event) {
    var keyCode;
    keyCode = event.which ? event.which : event.keyCode;
    if (event.keyCode === 17) {
      return this.isCtrl = false;
    } else if (keyCode === 13 && this.isCtrl) {
      return this.createNewPost();
    }
  };

  MicropostsView.prototype.createNewPost = function() {
    var attachmentButton, content, postMicropost, previewList, xhr, _ref, _ref1;
    content = this.micropostField.val();
    attachmentButton = this.$("#add-attachment");
    previewList = this.$('#preview-list');
    if ((content != null ? content.length : void 0) !== 0) {
      this.micropostButton.spin('small');
      this.micropostField.disable();
      postMicropost = (function(_this) {
        return function(pictureId, fileId) {
          var micropost;
          micropost = new MicroPost();
          if (pictureId != null) {
            micropost.set('pictures', [pictureId]);
          } else {
            micropost.set('pictures', []);
          }
          if (fileId != null) {
            micropost.set('commons', [fileId]);
          } else {
            micropost.set('commons', []);
          }
          content = _this.checkLink(content);
          micropost.set('tags', [_this.tagList.selectedTag]);
          return micropost.save('content', content, {
            success: function() {
              _this.micropostButton.spin();
              _this.micropostList.prependMicropost(micropost);
              return _this.micropostField.val(null);
            },
            error: function() {
              return _this.micropostButton.spin();
            },
            complete: function() {
              _this.micropostField.enable();
              attachmentButton.fadeIn();
              previewList.fadeOut();
              previewList.html(null);
              previewList.fadeIn();
              return $('#attach-picture').val(null);
            }
          });
        };
      })(this);
      if (((_ref = this.attachedImages) != null ? _ref.length : void 0) > 0) {
        return xhr = FileAPI.upload({
          url: '/pictures/all/',
          files: {
            picture: this.attachedImages[0]
          },
          complete: function(err, xhr) {
            var picture;
            if (err) {
              alert('upload failed');
            }
            picture = JSON.parse(xhr.response);
            this.attachedImages = null;
            return postMicropost(picture._id);
          }
        });
      } else if (((_ref1 = this.attachedFiles) != null ? _ref1.length : void 0) > 0) {
        return xhr = FileAPI.upload({
          url: '/commons/all/',
          files: {
            common: this.attachedFiles[0]
          },
          complete: function(err, xhr) {
            var file;
            if (err) {
              alert('upload failed');
            }
            file = JSON.parse(xhr.response);
            this.attachedFiles = null;
            return postMicropost(null, file._id);
          }
        });
      } else {
        return postMicropost();
      }
    }
  };

  MicropostsView.prototype.checkLink = function(content) {
    var previousChar, regexp, url, urlIndex, urls, _i, _len;
    regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g;
    urls = content.match(regexp);
    if (urls) {
      for (_i = 0, _len = urls.length; _i < _len; _i++) {
        url = urls[_i];
        urlIndex = content.indexOf(url);
        if (urlIndex === 0) {
          content = content.replace(url, "[" + url + "](" + url + ")");
        } else {
          previousChar = content.charAt(urlIndex - 1);
          if (previousChar !== '(' && previousChar !== "[") {
            content = content.replace(url, "[" + url + "](" + url + ")");
          }
        }
      }
    }
    return content;
  };

  MicropostsView.prototype.onTagSelected = function(name) {
    if (this.tagsView != null) {
      this.tagsView.$(".tag-select-button").unSelect();
    }
    this.tagList.select(name);
    this.$("#microposts-search").val(null);
    return this.micropostList.loadTag(name);
  };

  MicropostsView.prototype.loadMoreMicroposts = function() {
    var button;
    button = $("#more-microposts-button");
    button.spin('small');
    return this.micropostList.loadMore((function(_this) {
      return function() {
        return button.spin();
      };
    })(this));
  };

  MicropostsView.prototype.onNoMorePost = function() {
    return this.$("#more-microposts-button").hide();
  };

  MicropostsView.prototype.onSearchKeyUp = function(event) {
    var runSearch;
    $(".tag-select-button").removeClass('selected');
    runSearch = (function(_this) {
      return function() {
        var searchVal;
        _this.isSearchRunning = true;
        searchVal = $("#microposts-search").val();
        if (searchVal.length === 0) {
          _this.fetch();
        } else {
          _this.micropostList.search(searchVal, function() {
            _this.isSearchRunning = false;
            if (searchVal !== $("#microposts-search").val()) {
              return runSearch();
            }
          });
        }
        return setTimeout(function() {
          return _this.isSearchRunning = false;
        }, 2000);
      };
    })(this);
    if (this.isSearchRunning === false) {
      return runSearch();
    }
  };

  return MicropostsView;

})(View);
});

;require.register("views/note", function(exports, require, module) {
var NoteView, Renderer, View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

Renderer = require('../lib/renderer');

module.exports = NoteView = (function(_super) {
  __extends(NoteView, _super);

  NoteView.prototype.className = 'note simple-row line ml1 mr1 pt1 pb1';

  NoteView.prototype.events = {
    'click': 'onClicked',
    'click .note-delete-button': 'onDeleteClicked',
    'click .note-unselect-button': 'onUnselectClicked',
    'mousedown .editable': 'editableClick',
    "keyup .note-title": "onNoteChanged"
  };

  NoteView.prototype.onClicked = function(event) {
    if (!$(event.target).hasClass('note-unselect-button')) {
      $('.note').unselect();
      $('.note-buttons').hide();
      $('.content-note').hide();
      this.$el.select();
      this.buttons.show();
      return this.contentField.show();
    }
  };

  NoteView.prototype.onDeleteClicked = function() {
    var button;
    button = this.$('.note-delete-button');
    button.spin('small');
    return this.model.destroy({
      success: (function(_this) {
        return function() {
          button.spin();
          return _this.remove();
        };
      })(this),
      error: (function(_this) {
        return function() {
          button.spin();
          return alert('server error occured, note cannot be deleted');
        };
      })(this)
    });
  };

  NoteView.prototype.onNoteChanged = function() {
    return this.model.save();
  };

  NoteView.prototype.editableClick = etch.editableInit;

  NoteView.prototype.template = function() {
    return require('./templates/note');
  };

  function NoteView(model) {
    this.model = model;
    this.onUnselectClicked = __bind(this.onUnselectClicked, this);
    NoteView.__super__.constructor.call(this);
  }

  NoteView.prototype.afterRender = function() {
    this.buttons = this.$('.note-buttons');
    this.buttons.hide();
    this.contentField = this.$('.content-note');
    this.contentField.hide();
    this.renderTitle();
    this.renderNote();
    return this.bindFields();
  };

  NoteView.prototype.renderTitle = function() {
    var renderer;
    renderer = new Renderer();
    if (this.model.get('content').length === 0) {
      this.model.set('content', 'Empty note');
    }
    return this.model.set('displayDate', renderer.renderDate(this.model.get('lastModified')));
  };

  NoteView.prototype.renderNote = function() {
    this.converter = new Showdown.converter();
    if (this.model.get("content").length > 0) {
      return this.contentField.html(this.converter.makeHtml(this.model.get('content')));
    } else {
      return this.contentField.html("new note content");
    }
  };

  NoteView.prototype.bindFields = function() {
    this.model.bindField('title', this.$(".note-title"));
    this.contentField.keyup((function(_this) {
      return function() {
        _this.model.set("content", toMarkdown(_this.contentField.html()));
        return _this.onNoteChanged();
      };
    })(this));
    return this.model.bind('save', (function(_this) {
      return function() {
        _this.model.set("content", toMarkdown(_this.contentField.html()));
        return _this.model.save;
      };
    })(this));
  };

  NoteView.prototype.getRenderData = function() {
    var _ref;
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  NoteView.prototype.emptyTitle = function() {
    return this.$(".note-title").val('');
  };

  NoteView.prototype.focusTitle = function() {
    return this.$(".note-title").focus();
  };

  NoteView.prototype.onUnselectClicked = function() {
    this.$el.unselect();
    this.$('.note-buttons').hide();
    return this.$('.content-note').hide();
  };

  return NoteView;

})(View);
});

;require.register("views/note_selector", function(exports, require, module) {
var NoteCollection, NoteSelector, NoteSelectorLine, NoteSelectorList, NoteSelectorWidget, View, ViewCollection, request,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

request = require('../lib/request');

View = require('../lib/view');

ViewCollection = require('../lib/view_collection');

NoteCollection = require('../collections/notes');

NoteSelectorLine = (function(_super) {
  __extends(NoteSelectorLine, _super);

  NoteSelectorLine.prototype.tag = 'div';

  NoteSelectorLine.prototype.className = 'line note-selector-line';

  NoteSelectorLine.prototype.template = function() {
    return require('./templates/note_selector_line');
  };

  NoteSelectorLine.prototype.events = {
    'click': 'onClick'
  };

  NoteSelectorLine.prototype.onClick = function() {
    $(".note-selector-line").removeClass('selected');
    return this.$el.addClass('selected');
  };

  function NoteSelectorLine(model) {
    this.model = model;
    NoteSelectorLine.__super__.constructor.call(this);
  }

  return NoteSelectorLine;

})(View);

NoteSelectorList = (function(_super) {
  __extends(NoteSelectorList, _super);

  NoteSelectorList.prototype.id = "note-selector-list";

  NoteSelectorList.prototype.collection = new NoteCollection();

  NoteSelectorList.prototype.view = NoteSelectorLine;

  NoteSelectorList.prototype.template = function() {
    return require('./templates/note_selector_list');
  };

  function NoteSelectorList() {
    NoteSelectorList.__super__.constructor.call(this);
    this.$el = $("#" + this.id);
  }

  return NoteSelectorList;

})(ViewCollection);

NoteSelectorWidget = (function(_super) {
  __extends(NoteSelectorWidget, _super);

  NoteSelectorWidget.prototype.id = "note-selector-widget";

  NoteSelectorWidget.prototype.template = function() {
    return require('./templates/note_selector_widget');
  };

  NoteSelectorWidget.prototype.events = {
    'click .cancel': 'hide'
  };

  function NoteSelectorWidget() {
    this.hide = __bind(this.hide, this);
    this.pushPostToSelectedNote = __bind(this.pushPostToSelectedNote, this);
    NoteSelectorWidget.__super__.constructor.call(this);
    this.$el = $("#" + this.id);
  }

  NoteSelectorWidget.prototype.afterRender = function() {
    this.noteList = new NoteSelectorList;
    this.noteList.render();
    this.noteList.collection.fetch();
    this.$('.cancel').click(this.hide);
    return this.$('.confirm').click(this.pushPostToSelectedNote);
  };

  NoteSelectorWidget.prototype.pushPostToSelectedNote = function() {
    var view, _i, _len, _ref, _results;
    _ref = this.noteList.views;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      if (view.$el.hasClass('selected')) {
        _results.push(this.pushToNote(view.model.id));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  NoteSelectorWidget.prototype.pushToNote = function(noteId) {
    this.$('.confirm').spin('small');
    return request.get("/notes/all/" + noteId, (function(_this) {
      return function(err, note) {
        if (err) {
          return alert("cannot retrieve note");
        } else {
          note.content = "" + note.content + "\n\n" + (_this.micropost.get('content'));
          return request.put("/notes/all/" + noteId, note, function(err) {
            if (err) {
              return alert("note update failed");
            } else {
              alert("note successfully updated");
              _this.$('.confirm').spin();
              return _this.hide();
            }
          });
        }
      };
    })(this));
  };

  NoteSelectorWidget.prototype.show = function(micropost) {
    this.micropost = micropost;
    return this.$el.fadeIn();
  };

  NoteSelectorWidget.prototype.hide = function() {
    this.micropost = null;
    return this.$el.fadeOut();
  };

  return NoteSelectorWidget;

})(View);

module.exports = NoteSelector = NoteSelector = (function() {
  function NoteSelector() {}

  return NoteSelector;

})();

NoteSelector.getDialog = function() {
  if (this.dialog == null) {
    this.dialog = new NoteSelectorWidget();
    this.dialog.render();
  }
  return this.dialog;
};
});

;require.register("views/notes", function(exports, require, module) {
var CollectionView, NoteView, NotesCollection, NotesView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('../lib/view_collection');

NotesCollection = require('../collections/notes');

NoteView = require('./note');

module.exports = NotesView = (function(_super) {
  __extends(NotesView, _super);

  function NotesView() {
    return NotesView.__super__.constructor.apply(this, arguments);
  }

  NotesView.prototype.el = '#notes';

  NotesView.prototype.collection = new NotesCollection();

  NotesView.prototype.view = NoteView;

  NotesView.prototype.template = function() {
    return require('./templates/notes');
  };

  NotesView.prototype.afterRender = function() {};

  NotesView.prototype.fetch = function() {
    this.$el.spin('small');
    return this.collection.fetch({
      success: (function(_this) {
        return function() {
          return _this.$el.spin();
        };
      })(this),
      error: (function(_this) {
        return function() {
          return _this.$el.spin();
        };
      })(this)
    });
  };

  NotesView.prototype.addNote = function(note) {
    this.collection.url = "notes/all/";
    return this.collection.create(note, {
      silent: true,
      success: (function(_this) {
        return function(model) {
          var _ref, _ref1, _ref2;
          _this.renderOne(model, {
            prepend: true
          });
          if ((_ref = _this.last()) != null) {
            _ref.onClicked();
          }
          if ((_ref1 = _this.last()) != null) {
            _ref1.emptyTitle();
          }
          return (_ref2 = _this.last()) != null ? _ref2.focusTitle() : void 0;
        };
      })(this),
      error: function() {
        return alert('Note creation failed');
      }
    });
  };

  NotesView.prototype.sortByDate = function() {
    this.remove(this.views);
    this.collection.reset();
    this.collection.url = "notes/all/order-by-date/";
    return this.fetch();
  };

  NotesView.prototype.sortByTitle = function() {
    this.remove(this.views);
    this.collection.reset();
    this.collection.url = "notes/all/order-by-title/";
    return this.fetch();
  };

  return NotesView;

})(CollectionView);
});

;require.register("views/notes_view", function(exports, require, module) {
var Note, NotesMainView, NotesView, View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

NotesView = require('./notes');

Note = require('../models/note');

module.exports = NotesMainView = (function(_super) {
  __extends(NotesMainView, _super);

  function NotesMainView() {
    return NotesMainView.__super__.constructor.apply(this, arguments);
  }

  NotesMainView.prototype.id = 'notes-view';

  NotesMainView.prototype.events = {
    'click #add-note': 'onAddNoteClicked',
    'click #sort-date-note': 'onSortDateClicked',
    'click #sort-title-note': 'onSortTitleClicked'
  };

  NotesMainView.prototype.template = function() {
    return require('./templates/notes_view');
  };

  NotesMainView.prototype.afterRender = function() {};

  NotesMainView.prototype.onAddNoteClicked = function() {
    return this.notesView.addNote(new Note({
      title: 'New note',
      content: ''
    }));
  };

  NotesMainView.prototype.onSortDateClicked = function() {
    return this.notesView.sortByDate();
  };

  NotesMainView.prototype.onSortTitleClicked = function() {
    return this.notesView.sortByTitle();
  };

  NotesMainView.prototype.fetch = function() {
    if (this.notesView == null) {
      this.notesView = new NotesView();
    }
    this.notesView.fetch();
    return this.isLoaded = true;
  };

  return NotesMainView;

})(View);
});

;require.register("views/picture", function(exports, require, module) {
var PictureView, Renderer, View, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

Renderer = require('../lib/renderer');

request = require('../lib/request');

module.exports = PictureView = (function(_super) {
  __extends(PictureView, _super);

  PictureView.prototype.className = 'picture pa1 w33 col';

  PictureView.prototype.template = function() {
    return require('./templates/picture');
  };

  PictureView.prototype.events = {
    'click': 'onClicked',
    'click .picture-delete-button': 'onDeleteClicked',
    'click .picture-rotate-button': 'onRotateClicked'
  };

  PictureView.prototype.onClicked = function() {
    $('.picture').unselect();
    $('.picture-buttons').hide();
    this.$el.select();
    return this.buttons.show();
  };

  PictureView.prototype.onDeleteClicked = function() {
    this.model.urlRoot = 'pictures/';
    return this.model.destroy({
      success: (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this),
      error: (function(_this) {
        return function() {
          return alert('server error occured');
        };
      })(this)
    });
  };

  PictureView.prototype.onRotateClicked = function() {
    return request.get("pictures/" + this.model.id + "/rotate/", (function(_this) {
      return function(err) {
        var src;
        if (err) {
          return alert('An error occured while rotating picture.');
        } else {
          alert('Picture rotation succceeded.');
          src = _this.$('img').attr('src');
          return _this.$('img').attr('src', src + '?rotate');
        }
      };
    })(this));
  };

  function PictureView(model) {
    this.model = model;
    this.onRotateClicked = __bind(this.onRotateClicked, this);
    PictureView.__super__.constructor.call(this);
  }

  PictureView.prototype.afterRender = function() {
    this.buttons = this.$('.picture-buttons');
    return this.buttons.hide();
  };

  PictureView.prototype.getRenderData = function() {
    var renderer, _ref;
    renderer = new Renderer();
    this.model.set('displayDate', renderer.renderDate(this.model.get('date')));
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  return PictureView;

})(View);
});

;require.register("views/pictures", function(exports, require, module) {
var CollectionView, NoteView, PictureView, PicturesCollection, PicturesView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('../lib/view_collection');

PictureView = require('./picture');

PicturesCollection = require('../collections/pictures');

NoteView = require('./note');

module.exports = PicturesView = (function(_super) {
  __extends(PicturesView, _super);

  PicturesView.prototype.el = '#pictures';

  PicturesView.prototype.collection = new PicturesCollection();

  PicturesView.prototype.view = PictureView;

  PicturesView.prototype.template = function() {
    return require('./templates/pictures');
  };

  function PicturesView(collection) {
    this.renderAll = __bind(this.renderAll, this);
    this.renderOne = __bind(this.renderOne, this);
    PicturesView.__super__.constructor.apply(this, arguments);
    this.rendered = 0;
  }

  PicturesView.prototype.afterRender = function() {};

  PicturesView.prototype.fetch = function() {
    this.collection.off('add');
    return this.collection.fetch({
      success: (function(_this) {
        return function(pictures) {
          return _this.renderAll(pictures.models);
        };
      })(this)
    });
  };

  PicturesView.prototype.renderOne = function(model, options) {
    var view;
    view = new this.view(model);
    if (options != null ? options.prepend : void 0) {
      this.currentRow.prepend(view.render().el);
    } else {
      this.currentRow.append(view.render().el);
    }
    this.add(view);
    return this;
  };

  PicturesView.prototype.renderAll = function(models) {
    var model, rendered, _i, _len;
    rendered = 0;
    this.currentRow = $('<div class="row"></div>');
    for (_i = 0, _len = models.length; _i < _len; _i++) {
      model = models[_i];
      if (rendered % 3 === 0) {
        this.currentRow = $('<div class="row"></div>');
        this.$el.append(this.currentRow);
      }
      this.renderOne(model);
      rendered++;
    }
    return this;
  };

  PicturesView.prototype.loadMore = function() {
    var collection;
    $("#more-pictures").spin('small');
    collection = new PicturesCollection();
    collection.url = this.collection.url + this.getLastDate();
    return collection.fetch({
      success: (function(_this) {
        return function(pictures) {
          _this.renderAll(pictures.models);
          _this.setLastDate(collection);
          $("#more-pictures").spin();
          if (pictures.length < 12) {
            return $("#more-pictures").hide();
          }
        };
      })(this),
      error: (function(_this) {
        return function() {
          return alert('server error occured');
        };
      })(this)
    });
  };

  PicturesView.prototype.setLastDate = function(collection) {
    var lastDate, picture;
    picture = collection.last();
    if (picture != null) {
      lastDate = moment(picture.get('date'));
      return this.lastDate = lastDate.utc().format('YYYY-MM-DD-HH-mm-SS') + '/';
    } else {
      return this.lastDate = '';
    }
  };

  PicturesView.prototype.getLastDate = function() {
    if (this.lastDate != null) {
      return this.lastDate;
    } else {
      this.setLastDate(this.collection);
      return this.getLastDate();
    }
  };

  return PicturesView;

})(CollectionView);
});

;require.register("views/pictures_view", function(exports, require, module) {
var Picture, PicturesMainView, PicturesView, View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

PicturesView = require('./pictures');

Picture = require('../models/picture');

module.exports = PicturesMainView = (function(_super) {
  __extends(PicturesMainView, _super);

  function PicturesMainView() {
    this.loadMorePictures = __bind(this.loadMorePictures, this);
    return PicturesMainView.__super__.constructor.apply(this, arguments);
  }

  PicturesMainView.prototype.id = 'pictures-view';

  PicturesMainView.prototype.events = {
    "click #more-pictures": "loadMorePictures"
  };

  PicturesMainView.prototype.template = function() {
    return require('./templates/pictures_view');
  };

  PicturesMainView.prototype.afterRender = function() {};

  PicturesMainView.prototype.fetch = function() {
    if (this.picturesView == null) {
      this.picturesView = new PicturesView();
    }
    this.picturesView.fetch();
    return this.isLoaded = true;
  };

  PicturesMainView.prototype.loadMorePictures = function() {
    return this.picturesView.loadMore();
  };

  return PicturesMainView;

})(View);
});

;require.register("views/profile_view", function(exports, require, module) {
var Owner, ProfileController, ProfileView, View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

Owner = require('../models/owner_model');

ProfileController = (function() {
  function ProfileController(view, model) {
    this.view = view;
    this.model = model;
    this.setOwnerUrl = __bind(this.setOwnerUrl, this);
    this.getSesameFieldVal = __bind(this.getSesameFieldVal, this);
    this.model.isLoaded = false;
  }

  ProfileController.prototype.onProfileChanged = function() {
    return this.model.save();
  };

  ProfileController.prototype.onUploadComplete = function() {
    return this.view.reloadPicture();
  };

  ProfileController.prototype.onChangePasswordClicked = function() {
    return this.view.displaySesameForm();
  };

  ProfileController.prototype.onConfirmPasswordClicked = function() {
    var sesame;
    sesame = this.getSesameFieldVal();
    if (sesame != null) {
      return this.saveSesame(sesame);
    }
  };

  ProfileController.prototype.getSesameFieldVal = function() {
    var sesame;
    sesame = this.model.get("sesame");
    if (sesame.length > 4) {
      return sesame;
    } else {
      this.view.sesameForm.find('.error').html("New sesame is too short");
      this.view.sesameForm.find('.error').fadeIn();
      return null;
    }
  };

  ProfileController.prototype.saveSesame = function(sesame) {
    return this.model.newSesame(sesame, (function(_this) {
      return function(err) {
        console.log(err);
        if (err) {
          return _this.view.displaySesameError("A server error occured.");
        } else {
          _this.view.displaySesameSuccess();
          return setTimeout(function() {
            return _this.view.displayChangePasswordButton();
          }, 2000);
        }
      };
    })(this));
  };

  ProfileController.prototype.onDataLoaded = function() {
    if (this.model.get("url") == null) {
      this.setOwnerUrl();
    }
    this.model.isLoaded = true;
    return this.view.render();
  };

  ProfileController.prototype.setOwnerUrl = function() {
    var url;
    url = "" + window.location.protocol + "//" + window.location.host + "/";
    this.model.set('url', url);
    return this.model.save();
  };

  return ProfileController;

})();

module.exports = ProfileView = (function(_super) {
  __extends(ProfileView, _super);

  function ProfileView() {
    this.onNewSesameKeyUp = __bind(this.onNewSesameKeyUp, this);
    this.onConfirmPasswordClicked = __bind(this.onConfirmPasswordClicked, this);
    this.onChangePasswordClicked = __bind(this.onChangePasswordClicked, this);
    this.onUploadComplete = __bind(this.onUploadComplete, this);
    this.onProfileChanged = __bind(this.onProfileChanged, this);
    return ProfileView.__super__.constructor.apply(this, arguments);
  }

  ProfileView.prototype.id = 'profile-view';

  ProfileView.prototype.events = {
    "click #change-password-button": "onChangePasswordClicked",
    "click #confirm-password-button": "onConfirmPasswordClicked",
    "keyup #profile-name-field": "onProfileChanged",
    "keyup #profile-url-field": "onProfileChanged",
    "keyup #profile-sesame-field": "onNewSesameKeyUp",
    'mousedown .editable': 'editableClick'
  };

  ProfileView.prototype.template = function() {
    return require('./templates/profile');
  };

  ProfileView.prototype.getRenderData = function() {
    var _ref;
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  ProfileView.prototype.render = function() {
    var _ref;
    if ((_ref = this.model) != null ? _ref.isLoaded : void 0) {
      this.beforeRender();
      this.$el.html(this.template()(this.getRenderData()));
      return this.afterRender();
    } else {
      this.model = new Owner();
      return this.controller = new ProfileController(this, this.model);
    }
  };

  ProfileView.prototype.afterRender = function() {
    var _ref;
    this.sesameForm = this.$("#sesame-form");
    this.profileSesameField = this.$("#profile-sesame-field");
    this.profileNameField = this.$("#profile-name-field");
    this.profileUrlField = this.$("#profile-url-field");
    this.model.bindField("name", this.profileNameField);
    this.model.bindField("url", this.profileUrlField);
    this.model.bindField("sesame", this.profileSesameField);
    this.descriptionField = this.$("#profile-description");
    this.converter = new Showdown.converter();
    if (((_ref = this.model.get("description")) != null ? _ref.length : void 0) > 0) {
      this.descriptionField.html(this.converter.makeHtml(this.model.get('description')));
    } else {
      this.descriptionField.html("your description");
    }
    this.descriptionField.keyup((function(_this) {
      return function() {
        _this.model.set("description", toMarkdown(_this.descriptionField.html()));
        return _this.model.save();
      };
    })(this));
    this.model.bind('save', (function(_this) {
      return function() {
        _this.model.set("description", toMarkdown(_this.descriptionField.html()));
        return _this.model.save;
      };
    })(this));
    this.passwordButton = this.$("#change-password-button");
    this.confirmPasswordButton = this.$("#confirm-password-button");
    this.pictureButton = this.$("#change-thumbnail-button");
    this.profilePicture = this.$("#profile-picture");
    this.fileUploader = new qq.FileUploader({
      element: document.getElementById('change-picture-button'),
      action: '/user/picture',
      allowedExtensions: ['jpg', 'jpeg', 'png'],
      stylesheets: [""],
      debug: true,
      mutliple: false,
      onComplete: this.onUploadComplete
    });
    return this;
  };

  ProfileView.prototype.onProfileChanged = function() {
    return this.controller.onProfileChanged();
  };

  ProfileView.prototype.onUploadComplete = function() {
    return this.controller.onUploadComplete();
  };

  ProfileView.prototype.onChangePasswordClicked = function() {
    return this.controller.onChangePasswordClicked();
  };

  ProfileView.prototype.onConfirmPasswordClicked = function() {
    return this.controller.onConfirmPasswordClicked();
  };

  ProfileView.prototype.onNewSesameKeyUp = function(event) {
    var keyCode;
    keyCode = event.keyCode;
    if (keyCode == null) {
      keyCode = event.which;
    }
    if (keyCode === 13) {
      return this.controller.onConfirmPasswordClicked();
    }
  };

  ProfileView.prototype.editableClick = etch.editableInit;

  ProfileView.prototype.reloadPicture = function() {
    var now;
    now = new Date().getTime();
    this.profilePicture.attr("src", "user/picture.jpg?date=" + now);
    return true;
  };

  ProfileView.prototype.displaySesameForm = function() {
    return this.passwordButton.fadeOut((function(_this) {
      return function() {
        _this.sesameForm.find('.error').hide();
        _this.sesameForm.find('.success').hide();
        return _this.sesameForm.fadeIn(function() {
          return _this.profileSesameField.focus();
        });
      };
    })(this));
  };

  ProfileView.prototype.displayChangePasswordButton = function() {
    this.profileSesameField.val(null);
    return this.sesameForm.fadeOut((function(_this) {
      return function() {
        return _this.passwordButton.fadeIn();
      };
    })(this));
  };

  ProfileView.prototype.hideSesameInfos = function() {
    this.sesameForm.find('.error').hide();
    return this.sesameForm.find('.success').hide();
  };

  ProfileView.prototype.displaySesameError = function(msg) {
    this.sesameForm.find('.error').html(msg);
    return this.sesameForm.find('.error').fadeIn();
  };

  ProfileView.prototype.displaySesameSuccess = function() {
    return this.sesameForm.find('.success').fadeIn();
  };

  ProfileView.prototype.fetch = function() {
    if (!this.model.isLoaded) {
      return this.model.fetch({
        success: (function(_this) {
          return function() {
            _this.controller.onDataLoaded();
            return _this;
          };
        })(this),
        error: (function(_this) {
          return function() {
            return alert("something went wrong while retrieving profile.");
          };
        })(this)
      });
    }
  };

  return ProfileView;

})(View);
});

;require.register("views/question_view", function(exports, require, module) {
var QuestionView, View, request,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('../lib/view');

request = require('../lib/request');

module.exports = QuestionView = (function(_super) {
  __extends(QuestionView, _super);

  function QuestionView() {
    return QuestionView.__super__.constructor.apply(this, arguments);
  }

  QuestionView.prototype.getRenderData = function() {
    return {
      question: this.question,
      type: this.type,
      fieldId: this.fieldId
    };
  };

  QuestionView.prototype.template = function() {
    return require('./templates/question');
  };

  QuestionView.prototype.afterRender = function() {
    this.field = this.$("#" + this.fieldId);
    return this.field.keyup((function(_this) {
      return function(event) {
        if (event.which === 13) {
          return _this.onSubmit();
        }
      };
    })(this));
  };

  QuestionView.prototype.onSubmit = function() {
    var data, val;
    val = this.field.val();
    if (val.length > 0) {
      data = {};
      data[this.fieldName] = val;
      return request.post(this.submitPath, data, this.onServerResponse);
    }
  };

  QuestionView.prototype.onServerResponse = function(err, data) {};

  QuestionView.prototype.focusField = function() {
    this.field.animate({
      boxShadow: '4px 4px 10px #888'
    });
    return this.field.focus();
  };

  QuestionView.prototype.clearField = function() {
    return this.field.val('');
  };

  return QuestionView;

})(View);
});

;require.register("views/register_name_view", function(exports, require, module) {
var QuestionView, RegisterNameView, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

QuestionView = require('./question_view');

request = require('../lib/request');

module.exports = RegisterNameView = (function(_super) {
  __extends(RegisterNameView, _super);

  function RegisterNameView() {
    this.onServerResponse = __bind(this.onServerResponse, this);
    return RegisterNameView.__super__.constructor.apply(this, arguments);
  }

  RegisterNameView.prototype.id = 'register-name-view';

  RegisterNameView.prototype.initialize = function() {
    this.question = "What is your name ?";
    this.fieldId = "register-name";
    this.type = "text";
    this.fieldName = "name";
    this.submitPath = "register/";
    return this.render();
  };

  RegisterNameView.prototype.onServerResponse = function(err, data) {
    if (err) {
      return alert("Something went wrong while registering your name." + "Try it again.");
    } else {
      return this.field.animate({
        boxShadow: '0'
      }, (function(_this) {
        return function() {
          return Newebe.views.appView.displayRegisterPassword();
        };
      })(this));
    }
  };

  return RegisterNameView;

})(QuestionView);
});

;require.register("views/register_password_view", function(exports, require, module) {
var QuestionView, RegisterPasswordView, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

QuestionView = require('./question_view');

request = require('../lib/request');

module.exports = RegisterPasswordView = (function(_super) {
  __extends(RegisterPasswordView, _super);

  function RegisterPasswordView() {
    this.onServerResponse = __bind(this.onServerResponse, this);
    return RegisterPasswordView.__super__.constructor.apply(this, arguments);
  }

  RegisterPasswordView.prototype.id = 'register-password-view';

  RegisterPasswordView.prototype.initialize = function() {
    this.question = "Tell me your sesame";
    this.fieldId = "register-password";
    this.type = "password";
    this.fieldName = "password";
    this.submitPath = "register/password/";
    return this.render();
  };

  RegisterPasswordView.prototype.onServerResponse = function(err, data) {
    if (err) {
      return alert("Something went wrong while registering your sesame." + "Try it again.");
    } else {
      return this.field.animate({
        boxShadow: '0'
      }, (function(_this) {
        return function() {
          return Newebe.views.appView.displayHome();
        };
      })(this));
    }
  };

  return RegisterPasswordView;

})(QuestionView);
});

;require.register("views/simple_tag_list", function(exports, require, module) {
var CollectionView, SimpleTagListView, TagView, Tags, stringUtils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('../lib/view_collection');

TagView = require('./simple_tag_view');

Tags = require('../collections/tags');

stringUtils = require('../lib/string');

module.exports = SimpleTagListView = (function(_super) {
  __extends(SimpleTagListView, _super);

  SimpleTagListView.prototype.collection = new Tags();

  SimpleTagListView.prototype.view = TagView;

  function SimpleTagListView(el) {
    this.el = el;
    SimpleTagListView.__super__.constructor.call(this);
    this.selectedTag = 'all';
  }

  SimpleTagListView.prototype.template = function() {
    return require('./templates/simple_tags');
  };

  SimpleTagListView.prototype.fetch = function(callbacks) {
    if (this.views.length > 0) {
      this.remove(this.views);
    }
    return this.collection.fetch(callbacks);
  };

  SimpleTagListView.prototype.select = function(name) {
    this.selectedTag = name;
    this.$(".tag-selector button").unselect();
    return this.$(".tag-" + name + " button").select();
  };

  return SimpleTagListView;

})(CollectionView);
});

;require.register("views/simple_tag_view", function(exports, require, module) {
var TagView, View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('lib/view');

module.exports = TagView = (function(_super) {
  __extends(TagView, _super);

  TagView.prototype.className = 'tag-selector';

  TagView.prototype.events = {
    'click .tag-select-button': 'onSelectClicked'
  };

  function TagView(model, tagsView) {
    this.model = model;
    this.tagsView = tagsView;
    TagView.__super__.constructor.call(this);
  }

  TagView.prototype.template = function() {
    return require('./templates/simple_tag');
  };

  TagView.prototype.afterRender = function() {
    this.selectTagButton = this.$('.tag-select-button');
    return this.$el.addClass("tag-" + (this.model.get('name')));
  };

  TagView.prototype.getRenderData = function() {
    var _ref;
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  TagView.prototype.onSelectClicked = function() {
    this.publish('tag:selected', this.model.get('name'));
    return this.select();
  };

  TagView.prototype.select = function() {
    return this.selectTagButton.select();
  };

  return TagView;

})(View);
});

;require.register("views/tag_all_view", function(exports, require, module) {
var TagAllView, TagView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TagView = require('./tag_view');

module.exports = TagAllView = (function(_super) {
  __extends(TagAllView, _super);

  function TagAllView() {
    return TagAllView.__super__.constructor.apply(this, arguments);
  }

  TagAllView.prototype.className = 'tag-selector tag-all';

  TagAllView.prototype.events = {
    'click .tag-select-button': 'onSelectClicked',
    'click .tag-add-button': 'onAddClicked'
  };

  TagAllView.prototype.afterRender = function() {
    this.addTagButton = this.$('.tag-add-button');
    this.selectTagButton = this.$('.tag-select-button');
    if (this.tagsView.isFull()) {
      return this.addTagButton.hide();
    }
  };

  TagAllView.prototype.template = function() {
    return require('./templates/tag_all');
  };

  TagAllView.prototype.onSelectClicked = function() {
    this.publish('tag:selected', 'all');
    return this.selectTagButton.addClass('selected');
  };

  TagAllView.prototype.onAddClicked = function() {
    return this.addTagButton.fadeOut((function(_this) {
      return function() {
        return _this.tagsView.showNewTagForm();
      };
    })(this));
  };

  return TagAllView;

})(TagView);
});

;require.register("views/tag_view", function(exports, require, module) {
var TagView, View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('lib/view');

module.exports = TagView = (function(_super) {
  __extends(TagView, _super);

  TagView.prototype.className = 'tag-selector';

  TagView.prototype.events = {
    'click .tag-select-button': 'onSelectClicked',
    'click .tag-delete-button': 'onDeleteClicked'
  };

  function TagView(model, tagsView) {
    this.model = model;
    this.tagsView = tagsView;
    TagView.__super__.constructor.call(this);
  }

  TagView.prototype.template = function() {
    return require('./templates/tag');
  };

  TagView.prototype.afterRender = function() {
    this.selectTagButton = this.$('.tag-select-button');
    return this.$el.addClass("tag-" + (this.model.get('name')));
  };

  TagView.prototype.getRenderData = function() {
    var _ref;
    return {
      model: (_ref = this.model) != null ? _ref.toJSON() : void 0
    };
  };

  TagView.prototype.onSelectClicked = function() {
    this.publish('tag:selected', this.model.get('name'));
    return this.selectTagButton.select();
  };

  TagView.prototype.onDeleteClicked = function() {
    var button;
    button = $(".tag-delete-button");
    button.spin('tiny');
    return this.model.destroy({
      success: (function(_this) {
        return function() {
          _this.tagsView.onTagDeleted(_this.model.get('name'));
          return _this.remove();
        };
      })(this),
      error: (function(_this) {
        return function() {
          button.spin();
          return alert('An error occured while deleting tag');
        };
      })(this)
    });
  };

  return TagView;

})(View);
});

;require.register("views/tags_view", function(exports, require, module) {
var CollectionView, TagAllView, TagView, Tags, TagsView, stringUtils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('../lib/view_collection');

TagView = require('./tag_view');

TagAllView = require('./tag_all_view');

Tags = require('../collections/tags');

stringUtils = require('../lib/string');

module.exports = TagsView = (function(_super) {
  __extends(TagsView, _super);

  function TagsView() {
    this.onNewTagClicked = __bind(this.onNewTagClicked, this);
    this.onNewTagKeyup = __bind(this.onNewTagKeyup, this);
    this.onNewTagKeypress = __bind(this.onNewTagKeypress, this);
    this.renderOne = __bind(this.renderOne, this);
    return TagsView.__super__.constructor.apply(this, arguments);
  }

  TagsView.prototype.el = '#tag-list';

  TagsView.prototype.collection = new Tags();

  TagsView.prototype.view = TagView;

  TagsView.prototype.events = {
    'keyup #new-tag-field': 'onNewTagKeyup',
    'click #new-tag-button': 'onNewTagClicked'
  };

  TagsView.prototype.template = function() {
    return require('./templates/tags');
  };

  TagsView.prototype.afterRender = function() {
    this.newTagField = this.$('#new-tag-field');
    this.newTagButton = this.$('#new-tag-button');
    this.newTagField.keypress(this.onNewTagKeypress);
    this.newTagField.hide();
    return this.newTagButton.hide();
  };

  TagsView.prototype.renderOne = function(model) {
    var view;
    if (model.get('name') !== 'all') {
      view = new this.view(model, this);
    } else {
      view = new TagAllView(model, this);
    }
    this.$el.prepend(view.render().el);
    this.add(view);
    return this;
  };

  TagsView.prototype.showNewTagForm = function() {
    this.newTagField.show();
    this.newTagButton.show();
    return this.newTagField.focus();
  };

  TagsView.prototype.isFull = function() {
    return this.collection.length > 6;
  };

  TagsView.prototype.fetch = function(callbacks) {
    if (this.views.length > 0) {
      this.remove(this.views);
    }
    return this.collection.fetch(callbacks);
  };

  TagsView.prototype.onNewTagKeypress = function(event) {
    var key;
    key = event.which;
    return stringUtils.isSpecialKey(key, event);
  };

  TagsView.prototype.onNewTagKeyup = function(event) {
    if (event.which === 13) {
      return this.onNewTagClicked();
    }
  };

  TagsView.prototype.onNewTagClicked = function() {
    var button, _ref;
    button = $("#new-tag-button");
    if (((_ref = this.newTagField.val()) != null ? _ref.length : void 0) === 0) {
      return true;
    }
    if (!this.isFull()) {
      button.spin('small');
      return this.collection.create({
        name: this.newTagField.val()
      }, {
        success: (function(_this) {
          return function(tag) {
            button.spin();
            _this.newTagField.val('');
            return _this.newTagField.focus();
          };
        })(this)
      });
    } else {
      return alert("You can't add more tags");
    }
  };

  TagsView.prototype.onTagDeleted = function(name) {
    return this.contactsView.onTagDeleted(name);
  };

  TagsView.prototype.select = function(name) {
    this.$(".tag-selector button").unselect();
    return this.$(".tag-" + name + "  button").select();
  };

  return TagsView;

})(CollectionView);
});

;require.register("views/templates/activities", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"line\"><button id=\"sync-activities-button\">sync</button></div><div class=\"line\"><div id=\"activity-all\"></div></div><div class=\"line\"><button id=\"more-activities-button\">more</button></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/activity", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model,undefined = locals_.undefined;
buf.push("<div class=\"infos small\"><div class=\"date smaller w100p mr2\">" + (jade.escape((jade_interp = model.displayDate) == null ? '' : jade_interp)) + "&nbsp;</div><span class=\"author\">" + (jade.escape((jade_interp = model.author) == null ? '' : jade_interp)) + "&nbsp;</span><span class=\"verb\">" + (jade.escape((jade_interp = model.verb) == null ? '' : jade_interp)) + "&nbsp;</span><span>something&nbsp;</span>");
if ( model.errorAmount !== undefined)
{
buf.push("<span class=\"activity-error-number error\">(" + (jade.escape((jade_interp = model.errorAmount) == null ? '' : jade_interp)) + ")</span>");
}
buf.push("<div class=\"activity-errors\"><div>Errors</div>");
// iterate model.errors
;(function(){
  var $$obj = model.errors;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var error = $$obj[$index];

buf.push("<div class=\"activity-error\"><span>" + (jade.escape((jade_interp = error.contactName) == null ? '' : jade_interp)) + "</span><span class=\"activity-contactUrl hidden\">" + (jade.escape((jade_interp = error.contactUrl) == null ? '' : jade_interp)) + "</span><button" + (jade.attr("id", "" + (error.contactKey) + "", true, false)) + " class=\"smaller ml1 activity-error-resend\">resend</button></div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var error = $$obj[$index];

buf.push("<div class=\"activity-error\"><span>" + (jade.escape((jade_interp = error.contactName) == null ? '' : jade_interp)) + "</span><span class=\"activity-contactUrl hidden\">" + (jade.escape((jade_interp = error.contactUrl) == null ? '' : jade_interp)) + "</span><button" + (jade.attr("id", "" + (error.contactKey) + "", true, false)) + " class=\"smaller ml1 activity-error-resend\">resend</button></div>");
    }

  }
}).call(this);

buf.push("</div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/activity_list", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/common", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model;
buf.push("<div class=\"line\"><a" + (jade.attr("href", "" + (model.url) + "", true, false)) + " target=\"_blank\">" + (jade.escape((jade_interp = model.path) == null ? '' : jade_interp)) + "</a><span>&nbsp;| " + (jade.escape((jade_interp = model.author) == null ? '' : jade_interp)) + " - " + (jade.escape((jade_interp = model.displayDate) == null ? '' : jade_interp)) + "</span><span class=\"common-buttons\"><button class=\"common-delete-button\">delete</button></span></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/commons", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/commons_view", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div id=\"commons\"></div><div class=\"line\"><button id=\"more-commons\">more</button></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/contact", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model;
buf.push("<div class=\"contact-tags mod left\"></div><div class=\"name mod left\"><a" + (jade.attr("href", "" + (model.url) + "", true, false)) + ">" + (jade.escape((jade_interp = model.name) == null ? '' : jade_interp)) + "</a></div>");
if ( model.state != "Trusted")
{
buf.push("<div class=\"state mod left\">" + (jade.escape((jade_interp = model.state) == null ? '' : jade_interp)) + "</div>");
}
buf.push("<div class=\"contact-buttons mod left\"><button class=\"contact-accept-button\">accept</button><button class=\"contact-retry-button\">retry</button><button class=\"contact-delete-button\">X</button></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/contacts", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<input id=\"new-contact-field\" type=\"text\" class=\"field\"/><button id=\"add-contact-button\">add contact</button><p class=\"error\">&nbsp;</p><div id=\"tag-list\"></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/home", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<nav id=\"navigation\" class=\"hidden\"><li id=\"responsive-menu\"><a>menu</a></li><ul><li><a id=\"microposts-button\" href=\"#microposts\" class=\"active\">news</a></li><li><a id=\"pictures-button\" href=\"#pictures\" class=\"active\">pictures</a></li><li><a id=\"notes-button\" href=\"#commons\" class=\"active\">commons</a></li><li><a id=\"notes-button\" href=\"#notes\" class=\"active\">notes</a></li><li><a id=\"contacts-button\" href=\"#contacts\">contacts</a></li><li><a id=\"profile-button\" href=\"#profile\">profile</a></li><li class=\"right\"><a id=\"logout-button\">logout</a></li><li class=\"right\"><a id=\"infos-button\" href=\"http://newebe.org/#documentation\" target=\"_blank\">help</a></li><li class=\"right\"><a id=\"activities-button\" href=\"#activities\">logs</a></li></ul></nav><div id=\"home\"><p>loading...</p></div><div id=\"note-selector-widget\"></div><div id=\"alert-widget\"></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/micropost", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model;
buf.push("<div class=\"infos small\"><span class=\"author\">" + (jade.escape((jade_interp = model.author) == null ? '' : jade_interp)) + "</span><span class=\"verb\">" + (jade.escape((jade_interp = model.verb) == null ? '' : jade_interp)) + "</span><span class=\"tags smaller\">" + (jade.escape((jade_interp = model.tags) == null ? '' : jade_interp)) + "</span></div><div class=\"line pl0\"><div class=\"pt05 w40 mod left\">" + (((jade_interp = model.displayContent) == null ? '' : jade_interp)) + "</div></div><span class=\"date smaller\">" + (jade.escape((jade_interp = model.displayDate) == null ? '' : jade_interp)) + "</span><div class=\"micropost-buttons\"><button class=\"micropost-delete-button\">delete</button><button class=\"micropost-save-to-note-button\">save to note</button></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/micropost_list", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/microposts", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div><textarea id=\"micropost-field\"></textarea></div><div><button id=\"micropost-post-button\">send</button><button id=\"add-attachment\"><img src=\"static/images/attachment_white.png\" alt=\"attachement button\"/></button><div class=\"js-fileapi-wrapper\"><input id=\"attach-picture\" type=\"file\"/><div id=\"preview-list\" class=\"line\"></div></div></div><div class=\"line\"><input id=\"microposts-search\" placeholder=\"search...\"/></div><div class=\"line\"><div id=\"micropost-tag-list\" class=\"tag-list\"></div></div><div class=\"line\"><div id=\"micropost-all\"></div></div><div class=\"line\"><button id=\"more-microposts-button\">more</button></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/note", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model;
buf.push("<div class=\"mod w33 left\"><div class=\"line\"><input type=\"text\"" + (jade.attr("value", "" + (model.title) + "", true, false)) + " class=\"note-title\"/></div><div class=\"line\"><span class=\"date smaller\">" + (jade.escape((jade_interp = model.displayDate) == null ? '' : jade_interp)) + "</span></div><div class=\"line\"><div class=\"note-buttons\"><button class=\"note-delete-button\">delete</button><button class=\"note-unselect-button\">unselect</button></div></div></div><div data-button-class=\"all\" class=\"mod w66 left content-note editable\">" + (jade.escape((jade_interp = model.content) == null ? '' : jade_interp)) + "</div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/note_selector_line", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model;
buf.push("" + (jade.escape((jade_interp = model.title) == null ? '' : jade_interp)) + "");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/note_selector_list", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/note_selector_widget", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div id=\"note-selector-list\"></div><div class=\"line\"><button class=\"confirm right\">save to note</button><button class=\"cancel right\">cancel</button></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/notes", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/notes_view", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<button id=\"add-note\">add note</button><button id=\"sort-date-note\">sort by date</button><button id=\"sort-title-note\">sort by title</button><div id=\"notes\"></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/picture", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model;
buf.push("<div class=\"line\"><a" + (jade.attr("href", "" + (model.url) + "", true, false)) + " target=\"_blank\"><img" + (jade.attr("src", "" + (model.prevUrl) + "", true, false)) + "/></a></div><div class=\"line\">" + (jade.escape((jade_interp = model.author) == null ? '' : jade_interp)) + " - " + (jade.escape((jade_interp = model.displayDate) == null ? '' : jade_interp)) + "<span class=\"picture-buttons\"><button class=\"picture-delete-button\">delete</button><button class=\"picture-rotate-button\">rotate right</button></span></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/pictures", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/pictures_view", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div id=\"pictures\"></div><div class=\"line\"><button id=\"more-pictures\">more</button></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/profile", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model;
buf.push("<div class=\"line full-size\"><div class=\"w400p mod left main-section\"><div id=\"profile-picture-section\"><img id=\"profile-picture\" src=\"user/picture.jpg\"/><div id=\"change-picture-button\"></div></div><div id=\"profile-data-section\"><p><input id=\"profile-name-field\" type=\"text\"" + (jade.attr("value", "" + (model.name) + "", true, false)) + "/></p><p><input id=\"profile-url-field\" type=\"text\"" + (jade.attr("value", "" + (model.url) + "", true, false)) + "/></p><div id=\"sesame-stuff\"><p><button id=\"change-password-button\">change sesame</button></p><div id=\"sesame-form\"><input id=\"profile-sesame-field\" type=\"text\" value=\"\"/><button id=\"confirm-password-button\">confirm new sesame</button><div class=\"success\">Sesame changed successfully</div><div class=\"error\">An error occured</div></div></div></div></div><div class=\"mod full-height\"><div id=\"profile-description\" data-button-class=\"all\" class=\"editable\"></div></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/question", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),question = locals_.question,fieldId = locals_.fieldId,type = locals_.type;
buf.push("<div class=\"middle center question\"><p>" + (jade.escape((jade_interp = question) == null ? '' : jade_interp)) + "</p><input" + (jade.attr("id", "" + (fieldId) + "", true, false)) + (jade.attr("type", "" + (type) + "", true, false)) + " class=\"center\"/></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/simple_tag", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model;
buf.push("<button class=\"tag-select-button toggle-button\">" + (jade.escape((jade_interp = model.name) == null ? '' : jade_interp)) + "</button>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/simple_tags", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/tag", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model;
buf.push("<button class=\"tag-select-button toggle-button\">" + (jade.escape((jade_interp = model.name) == null ? '' : jade_interp)) + "</button><button class=\"tag-delete-button\">X</button>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/tag_all", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),model = locals_.model;
buf.push("<button class=\"tag-select-button toggle-button selected\">" + (jade.escape((jade_interp = model.name) == null ? '' : jade_interp)) + "</button><button class=\"tag-add-button\">+</button>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/tags", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<input id=\"new-tag-field\"/><button id=\"new-tag-button\">add tag</button>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;
//# sourceMappingURL=app.js.map