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

  Activity = require('../models/activity_model');

  ActivityCollection = (function(_super) {

    __extends(ActivityCollection, _super);

    function ActivityCollection() {
      return ActivityCollection.__super__.constructor.apply(this, arguments);
    }

    ActivityCollection.prototype.model = Activity;

    ActivityCollection.prototype.url = '/activities/all/';

    ActivityCollection.prototype.comparator = function(activity) {
      return activity.get("date");
    };

    ActivityCollection.prototype.parse = function(response) {
      return response.rows;
    };

    return ActivityCollection;

  })(Backbone.Collection);

  module.exports = ActivityCollection;
  
});
window.require.register("initialize", function(exports, require, module) {
  var _ref, _ref1, _ref2, _ref3, _ref4;

  if ((_ref = this.Newebe) == null) {
    this.Newebe = {};
  }

  if ((_ref1 = Newebe.routers) == null) {
    Newebe.routers = {};
  }

  if ((_ref2 = Newebe.views) == null) {
    Newebe.views = {};
  }

  if ((_ref3 = Newebe.models) == null) {
    Newebe.models = {};
  }

  if ((_ref4 = Newebe.collections) == null) {
    Newebe.collections = {};
  }

  $(function() {
    var AppRouter, AppView;
    require('../lib/app_helpers');
    AppRouter = require('routers/app_router');
    AppView = require('views/app_view');
    Newebe.views.appView = new AppView();
    Newebe.routers.appRouter = new AppRouter(Newebe.views.appView);
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
window.require.register("lib/renderer", function(exports, require, module) {
  var Renderer;

  Renderer = (function() {

    function Renderer() {}

    Renderer.prototype.markdownConverter = new Showdown.converter();

    Renderer.prototype.renderDoc = function(doc) {
      if (doc != null) {
        if (doc.doc_type === 'MicroPost') {
          return this.markdownConverter.makeHtml(doc.content);
        } else if (doc.doc_type === 'Picture') {
          return '<img src="/pictures/' + doc._id + '/th_' + doc.path + '" />';
        } else if (doc.doc_type === 'Common') {
          return doc.path;
        }
      }
      return '';
    };

    Renderer.prototype.renderDate = function(dateString) {
      var date;
      date = moment(dateString, 'YYYY-MM-DDThh:mm:ssZ');
      return date.format('D MMM  YYYY, hh:mm');
    };

    return Renderer;

  })();

  module.exports = Renderer;
  
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
      error: function() {
        if ((data != null) && (data.msg != null) && (callback != null)) {
          return callback(new Error(data.msg));
        } else if (callback != null) {
          return callback(new Error("Server error occured"));
        }
      }
    });
  };

  exports.get = function(url, callbacks) {
    return exports.request("GET", url, null, callbacks);
  };

  exports.post = function(url, data, callbacks) {
    return exports.request("POST", url, data, callbacks);
  };

  exports.put = function(url, data, callbacks) {
    return exports.request("PUT", url, data, callbacks);
  };

  exports.del = function(url, callbacks) {
    return exports.request("DELETE", url, null, callbacks);
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
      this.collection.on("reset", this.renderAll);
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
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        this.destroy(view);
        if (!options.silent) {
          this.trigger('remove', view, this);
        }
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
      _views = this.filter(_view)(function() {
        return view.cid !== _view.cid;
      });
      this.views = _views;
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

    ViewCollection.prototype.renderOne = function(model) {
      var view;
      view = new this.view(model);
      this.$el.append(view.render().el);
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
window.require.register("models/activity_model", function(exports, require, module) {
  var Activity,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Activity = (function(_super) {

    __extends(Activity, _super);

    function Activity() {
      return Activity.__super__.constructor.apply(this, arguments);
    }

    Activity.prototype.url = '/activities/all/';

    return Activity;

  })(Backbone.Model);

  module.exports = Activity;
  
});
window.require.register("models/owner_model", function(exports, require, module) {
  var Owner,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Owner = (function(_super) {

    __extends(Owner, _super);

    function Owner() {
      return Owner.__super__.constructor.apply(this, arguments);
    }

    Owner.prototype.url = '/user/';

    Owner.prototype.isNew = function() {
      return false;
    };

    return Owner;

  })(Backbone.Model);
  
});
window.require.register("models/user_model", function(exports, require, module) {
  var Owner,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Owner = (function(_super) {

    __extends(Owner, _super);

    function Owner() {
      return Owner.__super__.constructor.apply(this, arguments);
    }

    Owner.prototype.url = '/user/';

    Owner.prototype.isNew = function() {
      return false;
    };

    return Owner;

  })(Backbone.Model);
  
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
      'microposts': 'microposts',
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

    AppRouter.prototype.microposts = function() {
      var _this = this;
      return this.loadSubView(function() {
        return _this.appView.changeSubView(_this.appView.micropostsView);
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
  var ActivitiesView, ActivityListView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  ActivityListView = require('../views/activity_list_view');

  module.exports = ActivitiesView = (function(_super) {

    __extends(ActivitiesView, _super);

    function ActivitiesView() {
      return ActivitiesView.__super__.constructor.apply(this, arguments);
    }

    ActivitiesView.prototype.id = 'activities-view';

    ActivitiesView.prototype.template = function() {
      return require('./templates/activities');
    };

    ActivitiesView.prototype.afterRender = function() {
      this.activityList = new ActivityListView({
        el: this.$("#activity-all")
      });
      return this.isLoaded = false;
    };

    ActivitiesView.prototype.fetch = function() {
      var _this = this;
      return this.activityList.collection.fetch({
        success: function() {
          return _this.isLoaded = true;
        }
      });
    };

    return ActivitiesView;

  })(View);
  
});
window.require.register("views/activity_list_view", function(exports, require, module) {
  var ActivityCollection, ActivityListView, ActivityView, CollectionView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CollectionView = require('../lib/view_collection');

  ActivityCollection = require('../collections/activity_collection');

  ActivityView = require('../views/activity_view');

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
      return this.$el.addClass('activity-list mod left w33');
    };

    return ActivityListView;

  })(CollectionView);
  
});
window.require.register("views/activity_view", function(exports, require, module) {
  var ActivityView, Renderer, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  Renderer = require('../lib/renderer');

  module.exports = ActivityView = (function(_super) {

    __extends(ActivityView, _super);

    ActivityView.prototype.className = 'activity pt1 pb1 pl2';

    ActivityView.prototype.template = function() {
      return require('./templates/activity');
    };

    function ActivityView(model) {
      this.model = model;
      ActivityView.__super__.constructor.call(this);
    }

    ActivityView.prototype.getRenderData = function() {
      var renderer, _ref;
      renderer = new Renderer();
      this.model.set('content', renderer.renderDoc(this.model.get('subdoc')));
      this.model.set('displayDate', renderer.renderDate(this.model.get('date')));
      return {
        model: (_ref = this.model) != null ? _ref.toJSON() : void 0
      };
    };

    return ActivityView;

  })(View);
  
});
window.require.register("views/app_view", function(exports, require, module) {
  var ActivitiesView, AppRouter, AppView, ContactsView, LoginView, MicropostsView, ProfileView, RegisterNameView, RegisterPasswordView, View, request,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  AppRouter = require('../routers/app_router');

  ActivitiesView = require('./activities_view');

  MicropostsView = require('./microposts_view');

  ContactsView = require('./contacts_view');

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
          return _this.displayLogin();
        }
      });
    };

    AppView.prototype.onMicropostsClicked = function() {
      return this.changeSubView(this.micropostsView);
    };

    AppView.prototype.onActivitiesClicked = function() {
      return this.changeSubView(this.activitiesView);
    };

    AppView.prototype.onContactsClicked = function() {
      return this.changeSubView(this.contactsView);
    };

    AppView.prototype.displayProfile = function() {
      return this.changeSubView(this.profileView);
    };

    AppView.prototype.displayActivities = function() {
      return this.changeSubView(this.activitiesView);
    };

    AppView.prototype.displayHome = function() {
      this.displayMenu();
      return this.displayActivities();
    };

    AppView.prototype.displayRegisterPassword = function() {
      return this.changeView(this.registerPasswordView);
    };

    AppView.prototype.displayRegisterName = function() {
      return this.changeView(this.registerNameView);
    };

    AppView.prototype.displayLogin = function() {
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
      this.micropostsView = this._addView(MicropostsView);
      if (userState.authenticated) {
        if (callback != null) {
          callback();
        } else {
          this.displayHome();
          this.activitiesView.load();
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
      var showView,
        _this = this;
      this.changeMenuState(subView);
      showView = function() {
        subView.fadeIn();
        _this.currentSubView = subView;
        if (!_this.currentSubView.isLoaded && (_this.currentSubView.fetch != null)) {
          _this.currentSubView.fetch();
        }
        if (callback != null) {
          return callback();
        }
      };
      if (this.currentSubView != null) {
        return this.currentSubView.fadeOut(showView);
      } else {
        return showView();
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
      } else if (view === this.micropostsView) {
        return this.$("#microposts-button").addClass("active");
      } else if (view === this.profileView) {
        return this.$("#profile-button").addClass("active");
      }
    };

    return AppView;

  })(View);
  
});
window.require.register("views/contacts_view", function(exports, require, module) {
  var ContactsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  module.exports = ContactsView = (function(_super) {

    __extends(ContactsView, _super);

    function ContactsView() {
      return ContactsView.__super__.constructor.apply(this, arguments);
    }

    ContactsView.prototype.id = 'contacts-view';

    ContactsView.prototype.template = function() {
      return require('./templates/contacts');
    };

    ContactsView.prototype.afterRender = function() {
      return this.isLoaded = true;
    };

    return ContactsView;

  })(View);
  
});
window.require.register("views/login_view", function(exports, require, module) {
  var LoginView, QuestionView, request,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  QuestionView = require('./question_view');

  request = require('../lib/request');

  module.exports = LoginView = (function(_super) {

    __extends(LoginView, _super);

    function LoginView() {
      return LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.id = 'login-view';

    LoginView.prototype.initialize = function() {
      this.question = "What is your sesame ?";
      this.fieldId = "login-password";
      this.type = "password";
      return this.render();
    };

    LoginView.prototype.onSubmit = function() {
      var password, req,
        _this = this;
      password = this.field.val();
      if (password.length > 0) {
        return req = request.post('login/json/', {
          password: password
        }, function(err, data) {
          if (err) {
            return _this.field.val(null);
          } else {
            return _this.field.animate({
              boxShadow: '0'
            }, function() {
              return Newebe.views.appView.displayHome();
            });
          }
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
window.require.register("views/profile_view", function(exports, require, module) {
  var Owner, ProfileView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  Owner = require('../models/owner_model');

  module.exports = ProfileView = (function(_super) {

    __extends(ProfileView, _super);

    function ProfileView() {
      this.setOwnerUrl = __bind(this.setOwnerUrl, this);
      return ProfileView.__super__.constructor.apply(this, arguments);
    }

    ProfileView.prototype.id = 'profile-view';

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
      this.model = new Owner();
      return this.isLoaded = false;
    };

    ProfileView.prototype.fetch = function() {
      var _this = this;
      if (!this.isLoaded) {
        return this.model.fetch({
          success: function() {
            if (_this.model.get("url") == null) {
              _this.setOwnerUrl();
            }
            _this.beforeRender();
            _this.$el.html(_this.template()(_this.getRenderData()));
            _this.afterRender();
            _this.isLoaded = true;
            return _this;
          },
          error: function() {
            return alert("something went wrong while retrieving profile.");
          }
        });
      }
    };

    ProfileView.prototype.setOwnerUrl = function() {
      this.model.set('url', "" + window.location.protocol + "//" + window.location.host + "/");
      return this.model.save();
    };

    return ProfileView;

  })(View);
  
});
window.require.register("views/question_view", function(exports, require, module) {
  var QuestionView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

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

    QuestionView.prototype.onSubmit = function() {};

    QuestionView.prototype.focusField = function() {
      this.field.animate({
        boxShadow: '4px 4px 10px #888'
      });
      return this.field.focus();
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
      return this.render();
    };

    RegisterNameView.prototype.onSubmit = function() {
      var name;
      name = this.field.val();
      if (name.length > 0) {
        return request.post('register/', {
          name: name
        }, function(err, data) {
          if (err) {
            return alert("Something went wrong while registering your name.");
          } else {
            return Newebe.views.appView.displayRegisterPassword();
          }
        });
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
      return this.render();
    };

    RegisterPasswordView.prototype.onSubmit = function() {
      var data, password;
      password = this.field.val();
      if (password.length > 0) {
        data = {
          password: password
        };
        return request.post('register/password/', data, function(err, data) {
          return Newebe.views.appView.displayHome();
        });
      }
    };

    return RegisterPasswordView;

  })(QuestionView);
  
});
window.require.register("views/templates/activities", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="line"> <div id="activity-all"></div><div id="activity-family" class="activity-list mod left w33"><h2 class="activity-list-title">family</h2><div class="activities"></div></div><div id="activity-geeks" class="activity-list mod left w33"><h2 class="activity-list-title">geeks</h2><div class="activities"></div></div></div>');
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
  buf.push('<div class="infos small"><span class="author">' + escape((interp = model.author) == null ? '' : interp) + '</span><span class="verb">' + escape((interp = model.verb) == null ? '' : interp) + '</span></div><div class="pt05">' + ((interp = model.content) == null ? '' : interp) + '</div><span class="date smaller">' + escape((interp = model.displayDate) == null ? '' : interp) + '</span>');
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
  buf.push('<h2 class="activity-title">all</h2>');
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
  buf.push('<h1>contacts</h1>');
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
  buf.push('<nav id="navigation" class="hidden"><ul><li><a id="activities-button" href="#activities" class="active">activities</a></li><li><a id="microposts-button" href="#microposts">microposts</a></li><li><a id="contacts-button" href="#contacts">contacts</a></li><li><a id="profile-button" href="#profile">profile</a></li><li class="right"><a id="logout-button">logout</a></li><li class="right"><a id="infos-button" href="http://newebe.org/#documentation" target="_blank">help</a></li></ul></nav><div id="home"><p>loading...</p></div>');
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
window.require.register("views/templates/profile", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="line"><div class="w33 mod left"><img id="profile-picture" src="static/images/owner_thumbnail.jpg"/><p><input');
  buf.push(attrs({ 'id':('profile-name-field'), 'type':("text"), 'value':("" + (model.name) + "") }, {"type":true,"value":true}));
  buf.push('/></p><p><input');
  buf.push(attrs({ 'id':('profile-url-field'), 'type':("text"), 'value':("" + (model.url) + "") }, {"type":true,"value":true}));
  buf.push('/></p><p><button>change thumbnail</button></p><p><button>change password</button></p></div><div class="w66 mod left"><p>' + escape((interp = model.description) == null ? '' : interp) + '</p></div></div>');
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
