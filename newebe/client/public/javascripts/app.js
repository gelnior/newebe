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
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
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

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("collections/activity_collection", function(exports, require, module) {
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
window.require.register("collections/contacts", function(exports, require, module) {
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
window.require.register("collections/notes", function(exports, require, module) {
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
window.require.register("collections/tags", function(exports, require, module) {
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

    return TagsCollection;

  })(Backbone.Collection);
  
});
window.require.register("initialize", function(exports, require, module) {
  var _ref, _ref1, _ref2;

  if ((_ref = this.Newebe) == null) {
    this.Newebe = {};
  }

  if ((_ref1 = Newebe.routers) == null) {
    Newebe.routers = {};
  }

  if ((_ref2 = Newebe.views) == null) {
    Newebe.views = {};
  }

  $(function() {
    var AppRouter, AppView;
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
window.require.register("lib/app_helpers", function(exports, require, module) {
  
  (function() {
    return (function() {
      var console, dummy, method, methods, _results;
      console = window.console = window.console || {};
      method = void 0;
      dummy = function() {};
      methods = 'assert,count,debug,dir,dirxml,error,exception,\
                   group,groupCollapsed,groupEnd,info,log,markTimeline,\
                   profile,profileEnd,time,timeEnd,trace,warn'.split(',');
      _results = [];
      while (method = methods.pop()) {
        _results.push(console[method] = console[method] || dummy);
      }
      return _results;
    })();
  })();
  
});
window.require.register("lib/model", function(exports, require, module) {
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
      var _this = this;
      if (field == null) {
        return console.log("try to bind a non existing field with " + attribute);
      } else {
        field.keyup(function() {
          _this.set(attribute, field.val(), {
            silent: true
          });
          return true;
        });
        return this.on("change:" + attribute, function() {
          return field.val(_this.get("attribute"));
        });
      }
    };

    return Model;

  })(Backbone.Model);
  
});
window.require.register("lib/renderer", function(exports, require, module) {
  var Renderer;

  module.exports = Renderer = (function() {

    function Renderer() {}

    Renderer.prototype.markdownConverter = new Showdown.converter();

    Renderer.prototype.renderDoc = function(doc) {
      if (doc != null) {
        if (doc.doc_type === 'MicroPost') {
          return this.markdownConverter.makeHtml(doc.content);
        } else if (doc.doc_type === 'Picture') {
          return "<img src= \"/pictures/# doc._id}/th_" + doc.path + "\" />";
        } else if (doc.doc_type === 'Common') {
          return doc.path;
        }
      }
      return '';
    };

    Renderer.prototype.renderDate = function(dateString) {
      var date;
      date = moment(dateString, 'YYYY-MM-DDThh:mm:ssZ');
      return date.format('D MMM  YYYY, HH:mm');
    };

    return Renderer;

  })();
  
});
window.require.register("lib/request", function(exports, require, module) {
  
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
window.require.register("lib/view", function(exports, require, module) {
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
window.require.register("lib/view_collection", function(exports, require, module) {
  var View, ViewCollection, methods,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('./view');

  ViewCollection = (function(_super) {

    __extends(ViewCollection, _super);

    ViewCollection.prototype.collection = null;

    ViewCollection.prototype.view = null;

    ViewCollection.prototype.views = [];

    ViewCollection.prototype.length = function() {
      return this.views.length;
    };

    function ViewCollection(options) {
      this.renderAll = __bind(this.renderAll, this);

      this.renderOne = __bind(this.renderOne, this);
      ViewCollection.__super__.constructor.call(this, options);
      this.collection.on('reset', this.renderAll);
    }

    ViewCollection.prototype.add = function(views, options) {
      var view, _i, _len;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        if (!this.get(view.cid)) {
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
window.require.register("models/activity", function(exports, require, module) {
  var Activity,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Activity = (function(_super) {

    __extends(Activity, _super);

    function Activity() {
      return Activity.__super__.constructor.apply(this, arguments);
    }

    Activity.prototype.urlRoot = '/activities/all/';

    Activity.prototype.idAttribute = '_id';

    Activity.prototype.defaults = {
      "tags": ["all"]
    };

    Activity.prototype.setMicropost = function(micropost) {
      this.set('subdoc', micropost.attributes);
      this.set('docId', micropost.get('_id'));
      this.set('docType', 'Micropost');
      this.set('verb', 'writes');
      this.set('isMine', micropost.get('isMine'));
      this.set('author', micropost.get('author'));
      this.set('date', micropost.get('date'));
      return this.set('method', 'POST');
    };

    return Activity;

  })(Backbone.Model);
  
});
window.require.register("models/contact", function(exports, require, module) {
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
      var data,
        _this = this;
      data = {
        slug: this.get("slug")
      };
      return request.post("/contacts/" + (this.get("slug")) + "/retry/", data, function(err, contact) {
        if (!err) {
          _this.set('state', 'Pending');
        }
        if (contact.state === 'Error') {
          err = {
            error: true
          };
        }
        return callback(err);
      });
    };

    ContactModel.prototype.accept = function(callback) {
      var _this = this;
      return this.save({
        state: 'Trusted'
      }, {
        success: function() {
          _this.set('state', 'Trusted');
          return callback();
        },
        error: function() {
          _this.set('state', 'Error');
          return callback({
            error: true
          });
        }
      });
    };

    return ContactModel;

  })(Model);
  
});
window.require.register("models/micropost", function(exports, require, module) {
  var MicropostModel, Model, request,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('lib/model');

  request = require('lib/request');

  module.exports = MicropostModel = (function(_super) {

    __extends(MicropostModel, _super);

    function MicropostModel() {
      return MicropostModel.__super__.constructor.apply(this, arguments);
    }

    MicropostModel.prototype.urlRoot = 'microposts/all/';

    MicropostModel.prototype.idAttribute = '_id';

    MicropostModel.prototype.defaults = {
      "tags": ["all"]
    };

    return MicropostModel;

  })(Model);
  
});
window.require.register("models/note", function(exports, require, module) {
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
window.require.register("models/owner_model", function(exports, require, module) {
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
window.require.register("models/tag", function(exports, require, module) {
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
window.require.register("routers/app_router", function(exports, require, module) {
  var AppRouter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = AppRouter = (function(_super) {

    __extends(AppRouter, _super);

    AppRouter.prototype.routes = {
      '': 'start',
      'activities': 'activities',
      'notes': 'notes',
      'contacts': 'contacts',
      'profile': 'profile'
    };

    function AppRouter(appView) {
      this.appView = appView;
      AppRouter.__super__.constructor.call(this);
    }

    AppRouter.prototype.start = function() {
      return this.appView.checkUserState();
    };

    AppRouter.prototype.activities = function() {
      var _this = this;
      return this.loadSubView(function() {
        return _this.appView.changeSubView(_this.appView.activitiesView);
      });
    };

    AppRouter.prototype.notes = function() {
      var _this = this;
      return this.loadSubView(function() {
        return _this.appView.changeSubView(_this.appView.notesView);
      });
    };

    AppRouter.prototype.contacts = function() {
      var _this = this;
      return this.loadSubView(function() {
        return _this.appView.changeSubView(_this.appView.contactsView);
      });
    };

    AppRouter.prototype.profile = function() {
      var _this = this;
      return this.loadSubView(function() {
        return _this.appView.changeSubView(_this.appView.profileView);
      });
    };

    AppRouter.prototype.loadSubView = function(callback) {
      var _this = this;
      if (this.appView.isLoaded) {
        return callback();
      } else {
        return this.appView.checkUserState(function() {
          _this.appView.displayMenu();
          return callback();
        });
      }
    };

    return AppRouter;

  })(Backbone.Router);
  
});
window.require.register("views/activities_view", function(exports, require, module) {
  var ActivitiesView, ActivityListView, MicroPost, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  MicroPost = require('../models/micropost');

  ActivityListView = require('../views/activity_list_view');

  module.exports = ActivitiesView = (function(_super) {

    __extends(ActivitiesView, _super);

    function ActivitiesView() {
      this.loadMoreActivities = __bind(this.loadMoreActivities, this);

      this.createNewPost = __bind(this.createNewPost, this);

      this.onMicropostFieldKeyup = __bind(this.onMicropostFieldKeyup, this);

      this.onMicropostFieldKeydown = __bind(this.onMicropostFieldKeydown, this);
      return ActivitiesView.__super__.constructor.apply(this, arguments);
    }

    ActivitiesView.prototype.id = 'activities-view';

    ActivitiesView.prototype.className = 'pa1';

    ActivitiesView.prototype.template = function() {
      return require('./templates/activities');
    };

    ActivitiesView.prototype.events = {
      "keyup #micropost-field": "onMicropostFieldKeyup",
      "keydown #micropost-field": "onMicropostFieldKeydown",
      "click #micropost-post-button": "createNewPost",
      "click #more-activities-button": "loadMoreActivities"
    };

    ActivitiesView.prototype.afterRender = function() {
      this.activityList = new ActivityListView({
        el: this.$("#activity-all")
      });
      this.isLoaded = false;
      return this.micropostField = this.$("#micropost-field");
    };

    ActivitiesView.prototype.fetch = function() {
      var _this = this;
      return this.activityList.collection.fetch({
        success: function() {},
        error: function() {
          return alert('A server error occured while retrieving news feed');
        }
      });
    };

    ActivitiesView.prototype.onMicropostFieldKeydown = function(event) {
      if (event.keyCode === 17) {
        return this.isCtrl = true;
      }
    };

    ActivitiesView.prototype.onMicropostFieldKeyup = function(event) {
      var keyCode;
      keyCode = event.which ? event.which : event.keyCode;
      if (event.keyCode === 17) {
        return this.isCtrl = false;
      } else if (keyCode === 13 && this.isCtrl) {
        return this.createNewPost();
      }
    };

    ActivitiesView.prototype.createNewPost = function() {
      var content, micropost,
        _this = this;
      content = this.micropostField.val();
      if ((content != null ? content.length : void 0) !== 0) {
        this.micropostField.disable();
        micropost = new MicroPost();
        return micropost.save('content', content, {
          success: function() {
            _this.activityList.prependMicropostActivity(micropost);
            _this.micropostField.enable();
            return _this.micropostField.val(null);
          },
          error: function() {
            return _this.micropostField.enable();
          }
        });
      }
    };

    ActivitiesView.prototype.loadMoreActivities = function() {
      return this.activityList.loadMore();
    };

    return ActivitiesView;

  })(View);
  
});
window.require.register("views/activity_list_view", function(exports, require, module) {
  var Activity, ActivityCollection, ActivityListView, ActivityView, CollectionView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CollectionView = require('../lib/view_collection');

  ActivityCollection = require('../collections/activity_collection');

  ActivityView = require('../views/activity_view');

  Activity = require('../models/activity');

  module.exports = ActivityListView = (function(_super) {

    __extends(ActivityListView, _super);

    function ActivityListView() {
      this.prependMicropostActivity = __bind(this.prependMicropostActivity, this);
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

    ActivityListView.prototype.prependMicropostActivity = function(micropost) {
      var activity;
      activity = new Activity();
      activity.setMicropost(micropost);
      return this.renderOne(activity, {
        prepend: true
      });
    };

    ActivityListView.prototype.loadMore = function() {
      var _this = this;
      this.collection.url = this.collection.baseUrl + this.getLastDate();
      return this.collection.fetch({
        success: function(activities) {
          var activity, _i, _len, _ref, _results;
          activities.models.slice();
          _ref = activities.models;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            activity = _ref[_i];
            _results.push(_this.renderOne(activity));
          }
          return _results;
        },
        error: function() {
          return alert('server error occured');
        }
      });
    };

    ActivityListView.prototype.getLastDate = function() {
      var activity, lastDate;
      activity = this.collection.last();
      if (activity != null) {
        lastDate = moment(activity.get('date'));
        return lastDate.format('YYYY-MM-DD') + '-23-59-00/';
      } else {
        return '';
      }
    };

    return ActivityListView;

  })(CollectionView);
  
});
window.require.register("views/activity_view", function(exports, require, module) {
  var ActivityView, MicroPost, Renderer, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  Renderer = require('../lib/renderer');

  MicroPost = require('../models/micropost');

  module.exports = ActivityView = (function(_super) {

    __extends(ActivityView, _super);

    ActivityView.prototype.className = 'activity pt1 pb1 pl0';

    ActivityView.prototype.template = function() {
      return require('./templates/activity');
    };

    ActivityView.prototype.events = {
      'click': 'onClicked',
      'click .activity-delete-button': 'onDeleteClicked'
    };

    function ActivityView(model) {
      this.model = model;
      ActivityView.__super__.constructor.call(this);
    }

    ActivityView.prototype.afterRender = function() {
      return this.buttons = this.$('.activity-buttons');
    };

    ActivityView.prototype.getRenderData = function() {
      var content, renderer, _ref;
      renderer = new Renderer();
      if (this.model.get('subdoc') != null) {
        content = renderer.renderDoc(this.model.get('subdoc'));
      } else {
        content = '';
      }
      this.model.set('content', content);
      this.model.set('displayDate', renderer.renderDate(this.model.get('date')));
      return {
        model: (_ref = this.model) != null ? _ref.toJSON() : void 0
      };
    };

    ActivityView.prototype.onClicked = function() {
      $('.activity').removeClass('selected');
      $('.activity-buttons').hide();
      this.$el.addClass('selected');
      if (this.model.get('docType') === 'micropost') {
        return this.buttons.show();
      }
    };

    ActivityView.prototype.onDeleteClicked = function() {
      var micropost,
        _this = this;
      micropost = new MicroPost(this.model.get('subdoc'));
      micropost.url = "/microposts/" + (micropost.get('_id')) + "/";
      return micropost.destroy({
        success: function() {
          return _this.remove();
        },
        error: function() {
          return alert('server error occured');
        }
      });
    };

    return ActivityView;

  })(View);
  
});
window.require.register("views/app_view", function(exports, require, module) {
  var ActivitiesView, AppRouter, AppView, ContactsView, LoginView, NotesView, ProfileView, RegisterNameView, RegisterPasswordView, View, request,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  AppRouter = require('../routers/app_router');

  ActivitiesView = require('./activities_view');

  ContactsView = require('./contacts_view');

  NotesView = require('./notes_view');

  ProfileView = require('./profile_view');

  LoginView = require('./login_view');

  RegisterNameView = require('./register_name_view');

  RegisterPasswordView = require('./register_password_view');

  request = require('lib/request');

  module.exports = AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      this.changeMenuState = __bind(this.changeMenuState, this);

      this.changeView = __bind(this.changeView, this);

      this.changeSubView = __bind(this.changeSubView, this);

      this.displayView = __bind(this.displayView, this);

      this._addView = __bind(this._addView, this);

      this.displayMenu = __bind(this.displayMenu, this);

      this.displayLogin = __bind(this.displayLogin, this);

      this.displayRegisterName = __bind(this.displayRegisterName, this);

      this.displayRegisterPassword = __bind(this.displayRegisterPassword, this);

      this.displayHome = __bind(this.displayHome, this);

      this.displayActivities = __bind(this.displayActivities, this);

      this.displayProfile = __bind(this.displayProfile, this);
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = 'body.application';

    AppView.prototype.template = function() {
      return require('./templates/home');
    };

    AppView.prototype.events = {
      'click #logout-button': 'onLogoutClicked'
    };

    AppView.prototype.onLogoutClicked = function(event) {
      var _this = this;
      return request.get('logout/', function(err, data) {
        if (err) {
          return alert("Something went wrong while logging out");
        } else {
          Newebe.routers.appRouter.navigate('');
          return _this.displayLogin();
        }
      });
    };

    AppView.prototype.onActivitiesClicked = function() {
      return this.changeSubView(this.activitiesView);
    };

    AppView.prototype.onContactsClicked = function() {
      return this.changeSubView(this.contactsView);
    };

    AppView.prototype.onNotesClicked = function() {
      return this.changeSubView(this.notesView);
    };

    AppView.prototype.displayProfile = function() {
      return this.changeSubView(this.profileView);
    };

    AppView.prototype.displayActivities = function() {
      return this.changeSubView(this.activitiesView);
    };

    AppView.prototype.displayHome = function() {
      var showHome,
        _this = this;
      showHome = function() {
        _this.displayMenu();
        return _this.displayActivities();
      };
      if (this.currentView != null) {
        return this.currentView.fadeOut(showHome);
      } else {
        return showHome();
      }
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

    AppView.prototype.displayMenu = function() {
      this.menu.removeClass('hidden');
      return this.menu.fadeIn();
    };

    AppView.prototype.checkUserState = function(callback) {
      var _this = this;
      return request.get('user/state/', function(err, data) {
        if (err) {
          return alert("Something went wrong, can't load newebe data.");
        } else {
          return _this.start(data, callback);
        }
      });
    };

    AppView.prototype.start = function(userState, callback) {
      this.home = this.$('#home');
      this.menu = this.$("#navigation");
      this.home.html(null);
      this.loginView = this._addView(LoginView);
      this.registerNameView = this._addView(RegisterNameView);
      this.registerPasswordView = this._addView(RegisterPasswordView);
      this.activitiesView = this._addView(ActivitiesView);
      this.contactsView = this._addView(ContactsView);
      this.profileView = this._addView(ProfileView);
      this.notesView = this._addView(NotesView);
      if (userState.authenticated) {
        if (callback != null) {
          callback();
        } else {
          this.displayHome();
          this.activitiesView.fetch();
        }
      } else if (userState.password) {
        this.displayLogin();
      } else if (userState.registered) {
        this.displayRegisterPassword();
      } else {
        this.displayRegisterName();
      }
      return this.isLoaded = true;
    };

    AppView.prototype._addView = function(viewClass) {
      var view;
      view = new viewClass();
      view.hide();
      console.log(view.el);
      this.home.append(view.el);
      return view;
    };

    AppView.prototype.displayView = function(view) {
      var showView,
        _this = this;
      showView = function() {
        if (view.fetch != null) {
          view.fetch();
        }
        return _this.changeView(view, function() {
          _this.menu.removeClass('hidden');
          return _this.menu.fadeIn();
        });
      };
      if (this.isLoaded) {
        return displayView();
      } else {
        return this.checkUserState(showView);
      }
    };

    AppView.prototype.changeSubView = function(subView, callback) {
      var _this = this;
      this.changeMenuState(subView);
      if (this.currentSubView != null) {
        return this.currentSubView.fadeOut(function() {
          _this.currentSubView = null;
          return _this.changeSubView(subView, callback);
        });
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
      var _this = this;
      this.currentView = view;
      this.menu.fadeOut();
      return this.home.children().fadeOut(function() {
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
      });
    };

    AppView.prototype.changeMenuState = function(view) {
      this.$("#navigation").find("a").removeClass("active");
      if (view === this.activitiesView) {
        return this.$("#activities-button").addClass("active");
      } else if (view === this.contactsView) {
        return this.$("#contacts-button").addClass("active");
      } else if (view === this.profileView) {
        return this.$("#profile-button").addClass("active");
      }
    };

    return AppView;

  })(View);
  
});
window.require.register("views/contact_view", function(exports, require, module) {
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
      var _this = this;
      return this.model.destroy({
        succes: function() {
          return _this.remove();
        },
        error: function() {
          return alert('An error occured while deleting contact');
        }
      });
    };

    ContactView.prototype.onRetryClicked = function() {
      var _this = this;
      return this.model.retry(function(err) {
        if (err) {
          return alert('Contact request failed again.');
        } else {
          return _this.$('.state').html('Pending');
        }
      });
    };

    ContactView.prototype.onAcceptClicked = function() {
      var _this = this;
      return this.model.accept(function(err) {
        if (err) {
          alert('Contact approval failed.');
          _this.$('.state').html('Error');
          return _this.$('.contact-retry-button').show();
        } else {
          return _this.$('.state').html('Trusted');
        }
      });
    };

    ContactView.prototype.addTag = function(tag) {
      var name, tagView, _ref,
        _this = this;
      name = tag.get('name');
      if (name !== "all") {
        this.$('.contact-tags').append("<button class=\"tag-" + name + " contact-tag toggle-button\">" + (tag.get("name")) + "</button>");
        tagView = this.$el.find(".contact-tag").last();
        if (_ref = tag.get("name"), __indexOf.call(this.model.get("tags"), _ref) >= 0) {
          tagView.addClass("selected");
          this.$el.addClass("filter-" + name);
        }
        return tagView.click(function() {
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
        });
      }
    };

    return ContactView;

  })(View);
  
});
window.require.register("views/contacts_view", function(exports, require, module) {
  var CollectionView, ContactView, Contacts, ContactsView, TagsView, request,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CollectionView = require('../lib/view_collection');

  Contacts = require('../collections/contacts');

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
      this.tagsView = new TagsView(this);
      this.tagsView.$el = this.$("#tag-list");
      this.tagsView.el = this.$("#tag-list").el;
      this.tagsView.render();
      this.newContactInput = this.$('#new-contact-field');
      return this.addContactButton = this.$('#add-contact-button');
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
      var contactUrl, data,
        _this = this;
      contactUrl = this.newContactInput.val();
      data = {
        url: contactUrl
      };
      if (this.checkUrl(contactUrl)) {
        this.$('.error').html("");
        return this.collection.create(data, {
          success: function(model) {
            return _this.renderOne(model);
          },
          error: function() {
            return alert('Something went wrong while adding contact');
          }
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
      var _this = this;
      this.$('.contact').remove();
      return this.tagsView.fetch({
        success: function() {
          return _this.collection.fetch();
        },
        error: function() {
          return alert("an error occured");
        }
      });
    };

    ContactsView.prototype.onTagSelected = function(name) {
      this.tagsView.$(".tag-select-button").removeClass('selected');
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
window.require.register("views/login_view", function(exports, require, module) {
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
      var _this = this;
      if (err) {
        return this.field.val(null);
      } else {
        return this.field.animate({
          boxShadow: '0'
        }, function() {
          return Newebe.views.appView.displayHome();
        });
      }
    };

    return LoginView;

  })(QuestionView);
  
});
window.require.register("views/microposts_view", function(exports, require, module) {
  var MicropostsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  module.exports = MicropostsView = (function(_super) {

    __extends(MicropostsView, _super);

    function MicropostsView() {
      return MicropostsView.__super__.constructor.apply(this, arguments);
    }

    MicropostsView.prototype.id = 'microposts-view';

    MicropostsView.prototype.template = function() {
      return require('./templates/microposts');
    };

    MicropostsView.prototype.afterRender = function() {
      return this.isLoaded = true;
    };

    return MicropostsView;

  })(View);
  
});
window.require.register("views/note", function(exports, require, module) {
  var NoteView, Renderer, View,
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
      'mousedown .editable': 'editableClick',
      "keyup .note-title": "onNoteChanged"
    };

    NoteView.prototype.editableClick = etch.editableInit;

    NoteView.prototype.template = function() {
      return require('./templates/note');
    };

    function NoteView(model) {
      this.model = model;
      NoteView.__super__.constructor.call(this);
    }

    NoteView.prototype.afterRender = function() {
      var renderer,
        _this = this;
      this.buttons = this.$('.note-buttons');
      this.buttons.hide();
      this.contentField = this.$('.content-note');
      this.contentField.hide();
      this.model.bindField('title', this.$(".note-title"));
      renderer = new Renderer();
      if (this.model.get('content').length === 0) {
        this.model.set('content', 'Empty note');
      }
      this.model.set('displayDate', renderer.renderDate(this.model.get('lastModified')));
      this.converter = new Showdown.converter();
      if (this.model.get("content").length > 0) {
        this.contentField.html(this.converter.makeHtml(this.model.get('content')));
      } else {
        this.contentField.html("new note content");
      }
      this.contentField.keyup(function() {
        _this.model.set("content", toMarkdown(_this.contentField.html()));
        return _this.onNoteChanged();
      });
      return this.model.bind('save', function() {
        _this.model.set("content", toMarkdown(_this.contentField.html()));
        return _this.model.save;
      });
    };

    NoteView.prototype.getRenderData = function() {
      var _ref;
      return {
        model: (_ref = this.model) != null ? _ref.toJSON() : void 0
      };
    };

    NoteView.prototype.onNoteChanged = function() {
      return this.model.save();
    };

    NoteView.prototype.onClicked = function() {
      $('.note').removeClass('selected');
      $('.note-buttons').hide();
      $('.content-note').hide();
      this.$el.addClass('selected');
      this.buttons.show();
      return this.contentField.show();
    };

    NoteView.prototype.onDeleteClicked = function() {
      var _this = this;
      return this.model.destroy({
        success: function() {
          return _this.remove();
        },
        error: function() {
          return alert('server error occured');
        }
      });
    };

    NoteView.prototype.emptyTitle = function() {
      return this.$(".note-title").val('');
    };

    NoteView.prototype.focusTitle = function() {
      return this.$(".note-title").focus();
    };

    return NoteView;

  })(View);
  
});
window.require.register("views/notes", function(exports, require, module) {
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

    NotesView.prototype.afterRender = function() {
      var _this = this;
      this.$el = $("#notes");
      return this.collection.on('add', function(model) {
        _this.$el = $("#notes");
        return _this.renderOne(model, {
          prepend: false
        });
      });
    };

    NotesView.prototype.fetch = function() {
      return this.collection.fetch();
    };

    NotesView.prototype.addNote = function(note) {
      this.collection.url = "notes/all/";
      this.collection.create(note, {
        silent: true,
        success: function() {
          this.$el = $("#notes");
          return this.renderOne(model, {
            prepend: true
          });
        },
        error: function() {
          return alert('Note creation failed');
        }
      });
      this.last().onClicked();
      this.last().emptyTitle();
      return this.last().focusTitle();
    };

    NotesView.prototype.sortByDate = function() {
      this.remove(this.views);
      this.collection.reset();
      this.collection.url = "notes/all/order-by-date/";
      return this.collection.fetch();
    };

    NotesView.prototype.sortByTitle = function() {
      this.remove(this.views);
      this.collection.reset();
      this.collection.url = "notes/all/order-by-title/";
      return this.collection.fetch();
    };

    return NotesView;

  })(CollectionView);
  
});
window.require.register("views/notes_view", function(exports, require, module) {
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

    NotesMainView.prototype.afterRender = function() {
      this.notesView = new NotesView();
      return this.notesView.fetch();
    };

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

    return NotesMainView;

  })(View);
  
});
window.require.register("views/profile_view", function(exports, require, module) {
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
        this.sesameForm.find('.error').html("New sesame is too short");
        this.sesameForm.find('.error').fadeIn();
        return null;
      }
    };

    ProfileController.prototype.saveSesame = function(sesame) {
      var _this = this;
      return this.model.newSesame(sesame, function(err) {
        if (err) {
          return _this.view.displaySesameError("A server error occured.");
        } else {
          _this.view.displaySesameSuccess();
          return setTimeout(function() {
            return _this.view.displayChangePasswordButton();
          }, 5000);
        }
      });
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
      var _this = this;
      this.sesameForm = this.$("#sesame-form");
      this.profileSesameField = this.$("#profile-sesame-field");
      this.profileNameField = this.$("#profile-name-field");
      this.profileUrlField = this.$("#profile-url-field");
      this.model.bindField("name", this.profileNameField);
      this.model.bindField("url", this.profileUrlField);
      this.model.bindField("sesame", this.profileSesameField);
      this.descriptionField = this.$("#profile-description");
      this.converter = new Showdown.converter();
      if (this.model.get("description").length > 0) {
        this.descriptionField.html(this.converter.makeHtml(this.model.get('description')));
      } else {
        this.descriptionField.html("your description");
      }
      this.descriptionField.keyup(function() {
        return _this.model.set("description", toMarkdown(_this.descriptionField.html()));
      });
      this.model.bind('save', function() {
        _this.model.set("description", toMarkdown(_this.descriptionField.html()));
        return _this.model.save;
      });
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

    ProfileView.prototype.editableClick = etch.editableInit;

    ProfileView.prototype.reloadPicture = function() {
      var nw;
      nw = new Date().getTime();
      this.profilePicture.attr("src", "user/picture.jpg?date=" + now);
      return true;
    };

    ProfileView.prototype.displaySesameForm = function() {
      var _this = this;
      return this.passwordButton.fadeOut(function() {
        _this.sesameForm.find('.error').hide();
        _this.sesameForm.find('.success').hide();
        return _this.sesameForm.fadeIn(function() {
          return _this.profileSesameField.focus();
        });
      });
    };

    ProfileView.prototype.displayChangePasswordButton = function() {
      var _this = this;
      return this.sesameForm.fadeOut(function() {
        return _this.passwordButton.fadeIn();
      });
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
      var _this = this;
      if (!this.model.isLoaded) {
        return this.model.fetch({
          success: function() {
            _this.controller.onDataLoaded();
            return _this;
          },
          error: function() {
            return alert("something went wrong while retrieving profile.");
          }
        });
      }
    };

    return ProfileView;

  })(View);
  
});
window.require.register("views/question_view", function(exports, require, module) {
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
      var _this = this;
      this.field = this.$("#" + this.fieldId);
      return this.field.keyup(function(event) {
        if (event.which === 13) {
          return _this.onSubmit();
        }
      });
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
window.require.register("views/register_name_view", function(exports, require, module) {
  var QuestionView, RegisterNameView, request,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  QuestionView = require('./question_view');

  request = require('../lib/request');

  module.exports = RegisterNameView = (function(_super) {

    __extends(RegisterNameView, _super);

    function RegisterNameView() {
      return RegisterNameView.__super__.constructor.apply(this, arguments);
    }

    RegisterNameView.prototype.id = 'register-name-view';

    RegisterNameView.prototype.initialize = function() {
      this.question = "What is your name ?";
      this.fieldId = "register-name";
      this.type = "text";
      this.fieldName = "name";
      this.submitPath = "register";
      return this.render();
    };

    RegisterNameView.prototype.onServerResponse = function(err, data) {
      if (err) {
        return alert("Something went wrong while registering your name.");
      } else {
        return Newebe.views.appView.displayRegisterPassword();
      }
    };

    return RegisterNameView;

  })(QuestionView);
  
});
window.require.register("views/register_password_view", function(exports, require, module) {
  var QuestionView, RegisterPasswordView, request,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  QuestionView = require('./question_view');

  request = require('../lib/request');

  module.exports = RegisterPasswordView = (function(_super) {

    __extends(RegisterPasswordView, _super);

    function RegisterPasswordView() {
      return RegisterPasswordView.__super__.constructor.apply(this, arguments);
    }

    RegisterPasswordView.prototype.id = 'register-password-view';

    RegisterPasswordView.prototype.initialize = function() {
      this.question = "Tell me your sesame";
      this.fieldId = "register-password";
      this.type = "password";
      this.fieldName = "password";
      this.submitPath = "registerPassword";
      return this.render();
    };

    RegisterPasswordView.prototype.onServerResponse = function(err, data) {
      return Newebe.views.appView.displayHome();
    };

    return RegisterPasswordView;

  })(QuestionView);
  
});
window.require.register("views/tag_all_view", function(exports, require, module) {
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
      var _this = this;
      return this.$('.tag-add-button').fadeOut(function() {
        return _this.tagsView.showNewTagForm();
      });
    };

    return TagAllView;

  })(TagView);
  
});
window.require.register("views/tag_view", function(exports, require, module) {
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
      return this.selectTagButton = this.$('.tag-select-button');
    };

    TagView.prototype.getRenderData = function() {
      var _ref;
      return {
        model: (_ref = this.model) != null ? _ref.toJSON() : void 0
      };
    };

    TagView.prototype.onSelectClicked = function() {
      this.publish('tag:selected', this.model.get('name'));
      return this.selectTagButton.addClass('selected');
    };

    TagView.prototype.onDeleteClicked = function() {
      var _this = this;
      return this.model.destroy({
        success: function() {
          _this.tagsView.onTagDeleted(_this.model.get('name'));
          return _this.remove();
        },
        error: function() {
          return alert('An error occured while deleting tag');
        }
      });
    };

    return TagView;

  })(View);
  
});
window.require.register("views/tags_view", function(exports, require, module) {
  var CollectionView, TagAllView, TagView, Tags, TagsView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CollectionView = require('../lib/view_collection');

  TagView = require('./tag_view');

  TagAllView = require('./tag_all_view');

  Tags = require('../collections/tags');

  module.exports = TagsView = (function(_super) {

    __extends(TagsView, _super);

    TagsView.prototype.id = 'tag-list';

    TagsView.prototype.collection = new Tags();

    TagsView.prototype.view = TagView;

    function TagsView(contactsView) {
      this.contactsView = contactsView;
      this.onNewTagClicked = __bind(this.onNewTagClicked, this);

      this.onNewTagKeyup = __bind(this.onNewTagKeyup, this);

      this.onNewTagKeypress = __bind(this.onNewTagKeypress, this);

      this.renderOne = __bind(this.renderOne, this);

      TagsView.__super__.constructor.call(this);
    }

    TagsView.prototype.events = {
      'keyup #new-tag-field': 'onNewTagKeyup',
      'click #new-tag-button': 'onNewTagClicked'
    };

    TagsView.prototype.template = function() {
      this.$el = $("#" + this.id);
      return require('./templates/tags');
    };

    TagsView.prototype.afterRender = function() {
      this.newTagField = this.$('#new-tag-field');
      this.newTagButton = this.$('#new-tag-button');
      this.newTagButton.click(this.onNewTagClicked);
      this.newTagField.keyup(this.onNewTagKeyup);
      this.newTagField.keypress(this.onNewTagKeypress);
      this.newTagField.hide();
      this.newTagButton.hide();
      return this.tagList = this.$('#tag-list');
    };

    TagsView.prototype.renderOne = function(model) {
      var view;
      if (model.get('name') !== 'all') {
        view = new this.view(model, this);
      } else {
        view = new TagAllView(model, this);
      }
      this.tagList.append(view.render().el);
      this.add(view);
      return this;
    };

    TagsView.prototype.showNewTagForm = function() {
      if (this.collection.length < 6) {
        this.newTagField.show();
        this.newTagButton.show();
        return this.newTagField.focus();
      }
    };

    TagsView.prototype.isFull = function() {
      return this.collection.length > 6;
    };

    TagsView.prototype.fetch = function(callbacks) {
      this.$el = $("#" + this.id);
      this.afterRender();
      if (this.views.length > 0) {
        this.remove(this.views);
      }
      return this.collection.fetch(callbacks);
    };

    TagsView.prototype.onNewTagKeypress = function(event) {
      var key, keychar;
      key = event.which;
      keychar = String.fromCharCode(key).toLowerCase();
      if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27)) {
        return true;
      } else if ('abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(keychar) === -1) {
        event.preventDefault();
        return false;
      }
    };

    TagsView.prototype.onNewTagKeyup = function(event) {
      if (event.which === 13) {
        return this.onNewTagClicked();
      }
    };

    TagsView.prototype.onNewTagClicked = function() {
      var _this = this;
      if (!this.isFull()) {
        return this.collection.create({
          name: this.newTagField.val()
        }, {
          success: function(tag) {
            _this.renderOne(tag);
            _this.contactsView.onTagAdded(tag);
            return _this.newTagField.val('');
          }
        });
      }
    };

    TagsView.prototype.onTagDeleted = function(name) {
      return this.contactsView.onTagDeleted(name);
    };

    return TagsView;

  })(CollectionView);
  
});
window.require.register("views/templates/activities", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div><textarea id="micropost-field"></textarea></div><div><button id="micropost-post-button">send</button></div><div class="line"><div id="activity-all"></div></div><div class="line"><button id="more-activities-button">more</button></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/activity", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="infos small"><span class="author">' + escape((interp = model.author) == null ? '' : interp) + '</span><span class="verb">' + escape((interp = model.verb) == null ? '' : interp) + '</span></div><div class="pt05">' + ((interp = model.content) == null ? '' : interp) + '</div><span class="date smaller">' + escape((interp = model.displayDate) == null ? '' : interp) + '</span><div class="activity-buttons"><button class="activity-delete-button">delete</button></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/activity_list", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  }
  return buf.join("");
  };
});
window.require.register("views/templates/contact", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="contact-tags mod left"></div><div class="name mod left"> <a');
  buf.push(attrs({ 'href':(model.url) }, {"href":true}));
  buf.push('>' + escape((interp = model.name) == null ? '' : interp) + '</a></div>');
  if ( model.state != "Trusted")
  {
  buf.push('<div class="state mod left">' + escape((interp = model.state) == null ? '' : interp) + '</div>');
  }
  buf.push('<div class="contact-buttons mod left"><button class="contact-accept-button">accept</button><button class="contact-retry-button">retry</button><button class="contact-delete-button">X</button></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/contacts", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<input id="new-contact-field" type="text" class="field"/><button id="add-contact-button">add contact</button><p class="error">&nbsp;</p><div id="tag-list"></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<nav id="navigation" class="hidden"><ul><li><a id="activities-button" href="#activities" class="active">news feed</a></li><li><a id="activities-button" href="#notes" class="active">notes</a></li><li><a id="contacts-button" href="#contacts">contacts</a></li><li><a id="profile-button" href="#profile">profile</a></li><li class="right"><a id="logout-button">logout</a></li><li class="right"><a id="infos-button" href="http://newebe.org/#documentation" target="_blank">help</a></li></ul></nav><div id="home"><p>loading...</p></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/microposts", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="pa1"><textarea id="micropost-field"></textarea></div><div class="pa1"><button id="micropost-post-button">send</button></div><h1>all</h1><div id="microposts-all"></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/note", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="mod w33 left"><div class="line"> <input');
  buf.push(attrs({ 'type':("text"), 'value':("" + (model.title) + ""), "class": ('note-title') }, {"type":true,"value":true}));
  buf.push('/></div><div class="line"><span class="date smaller">' + escape((interp = model.displayDate) == null ? '' : interp) + '</span></div><div class="line"><div class="note-buttons"><button class="note-delete-button">delete</button></div></div></div><div data-button-class="all" class="mod w66 left content-note editable">' + escape((interp = model.content) == null ? '' : interp) + '</div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/notes", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  }
  return buf.join("");
  };
});
window.require.register("views/templates/notes_view", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<button id="add-note">add note</button><button id="sort-date-note">sort by date</button><button id="sort-title-note">sort by title</button><div id="notes"></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/profile", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="line full-size"><div class="w400p mod left full-size main-section"><div id="profile-picture-section"><img id="profile-picture" src="user/picture.jpg"/><div id="change-picture-button"></div></div><div id="profile-data-section"><p><input');
  buf.push(attrs({ 'id':('profile-name-field'), 'type':("text"), 'value':("" + (model.name) + "") }, {"type":true,"value":true}));
  buf.push('/></p><p><input');
  buf.push(attrs({ 'id':('profile-url-field'), 'type':("text"), 'value':("" + (model.url) + "") }, {"type":true,"value":true}));
  buf.push('/></p><div id="sesame-stuff"><p><button id="change-password-button">change sesame</button></p><div id="sesame-form"><input id="profile-sesame-field" type="text" value=""/><button id="confirm-password-button">confirm new sesame</button><div class="success">Sesame changed successfully</div><div class="error">An error occured</div></div></div></div></div><div class="mod full-height"><div id="profile-description" data-button-class="all" class="editable"></div></div></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/question", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="middle center question"> <p>' + escape((interp = question) == null ? '' : interp) + '</p><input');
  buf.push(attrs({ 'id':("" + (fieldId) + ""), 'type':("" + (type) + ""), "class": ('center') }, {"id":true,"type":true}));
  buf.push('/></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/tag", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<button class="tag-select-button toggle-button">' + escape((interp = model.name) == null ? '' : interp) + '</button><button class="tag-delete-button">X</button>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/tag_all", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<button class="tag-select-button toggle-button selected">' + escape((interp = model.name) == null ? '' : interp) + '</button><button class="tag-add-button">+</button>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/tags", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="tag-list"></div><div id="add-tag"><input id="new-tag-field"/><button id="new-tag-button">add tag</button></div>');
  }
  return buf.join("");
  };
});
