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

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"test/auth_test": function(exports, require, module) {
  
  describe("Register", function() {
    before(function() {
      return this.mainView = new MainView();
    });
    it('When I connect and no user is registered', function() {
      var data;
      data = {
        authenticated: false,
        user: false,
        password: false
      };
      return mainView.start(data);
    });
    it('Then it displays name page', function() {
      return expect($("#register-name").is(":visible")).to.be.ok;
    });
    it('When I submit my name', function() {
      this.mainView.registerView.nameField.val("Jhon Doe");
      return this.mainView.registerView.onSubmitName();
    });
    it('Then it displays password page', function() {
      return expect($("#register-password").is(":visible")).to.be.ok;
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
  
}});

window.require.define({"test/test-helpers": function(exports, require, module) {
  
  module.exports = {
    expect: require('chai').expect
  };
  
}});

window.require('test/auth_test');
