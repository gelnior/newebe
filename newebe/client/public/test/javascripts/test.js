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
require.register("test/auth_test", function(exports, require, module) {
var AppView;

AppView = require('views/app_view');

describe("Register", function() {
  before(function() {
    window.Newebe = {};
    window.Newebe.routers = {};
    window.Newebe.views = {};
    window.Newebe.views.appView = new AppView();
    this.mainView = window.Newebe.views.appView;
    return this.mainView.render();
  });
  it('When I connect and no user is registered', function(done) {
    var data;
    data = {
      authenticated: false,
      user: false,
      password: false
    };
    this.mainView.start(data);
    return setTimeout(done, 1000);
  });
  it('Then it displays name page', function() {
    return expect(this.mainView.$("#register-name-view").is(":visible")).to.be.ok;
  });
  it('When I submit my name', function(done) {
    this.mainView.registerNameView.field.val("Jhon Doe");
    $.ajax = function(options) {
      return options.success({});
    };
    this.mainView.registerNameView.onSubmit();
    return setTimeout(done, 1000);
  });
  it('Then it displays password page', function() {
    console.log(this.mainView.home.html());
    return expect(this.mainView.$("#register-password-view").is(":visible")).to.be.ok;
  });
  it('When I submit my password', function() {
    this.mainView.registerView.passwordField.val("Jhon Doe");
    return this.mainView.registerView.onSubmitPassword();
  });
  return it('Then it displays activity page', function() {
    return expect($("#acitivity-list").is(":visible")).to.be.ok;
  });
});

describe("Login", function() {
  it('When I connect and an user is registered', function() {
    var data;
    data = {
      authenticated: false,
      user: true,
      password: true
    };
    return mainView.start(data);
  });
  it('Then it displays login page', function() {
    return expect($("#login-password").is(":visible")).to.be.ok;
  });
  it('When I submit wrong password', function() {
    this.mainView.loginView.passwordField.val("wrong");
    return this.mainView.loginView.onPasswordSubmit();
  });
  it('Then it displays an error', function() {
    return expect($("#login-error").is(":visible")).to.be.ok;
  });
  it('When I submit right password', function() {
    this.mainView.loginView.passwordField.val("right");
    return this.mainView.loginView.onPasswordSubmit();
  });
  return it('Then it displays activity page', function() {
    return expect($("#acitivity-list").is(":visible")).to.be.ok;
  });
});
});

;require.register("test/collections/contacts_test", function(exports, require, module) {

});

;require.register("test/models/contact", function(exports, require, module) {
var ContactModel;

ContactModel = require('models/contact');

describe('ContactModel', function() {
  return beforeEach(function() {
    return this.model = new ContactModel();
  });
});
});

;require.register("test/test-helpers", function(exports, require, module) {
module.exports = {
  expect: require('chai').expect,
  $: require('jquery')
};
});

;
//# sourceMappingURL=test.js.map