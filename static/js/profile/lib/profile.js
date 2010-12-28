(function() {
  /* Model for current User
  */  var ProfileView, User, UserCollection, profileApp;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  User = function() {
    __extends(User, Backbone.Model);
    User.prototype.url = '/platform/user/';
    function User(user) {
      User.__super__.constructor.apply(this, arguments);
      this.id = "";
      this.set("url", user.url);
      this.set("name", user.name);
      this.set("city", user.city);
    }
    User.prototype.getName = function() {
      return this.get("name");
    };
    User.prototype.setName = function(name) {
      alert(name);
      this.set("name", name);
      return alert(this.getName());
    };
    User.prototype.setUrl = function(url) {
      return this.set("url", url);
    };
    User.prototype.setCity = function(city) {
      return this.set("city", city);
    };
    User.prototype.getUrl = function() {
      return this.get("userUrl");
    };
    User.prototype.getCity = function() {
      return this.get("city");
    };
    User.prototype.isNew = function() {
      return false;
    };
    return User;
  }();
  /* Model for a User collection
  */
  UserCollection = function() {
    function UserCollection() {
      UserCollection.__super__.constructor.apply(this, arguments);
    }
    __extends(UserCollection, Backbone.Collection);
    UserCollection.prototype.model = User;
    UserCollection.prototype.url = '/platform/user/';
    UserCollection.prototype.parse = function(response) {
      return response.rows;
    };
    return UserCollection;
  }();
  /* Main view for contact application
  */
  ProfileView = function() {
    __extends(ProfileView, Backbone.View);
    ProfileView.prototype.el = $("#profile");
    function ProfileView() {
      ProfileView.__super__.constructor.apply(this, arguments);
    }
    ProfileView.prototype.initialize = function() {
      _.bindAll(this, 'onKeyUp', 'postUserInfo', 'fetch', 'addAll');
      this.users = new UserCollection;
      return this.users.bind('refresh', this.addAll);
    };
    /* Events
    */
    ProfileView.prototype.onKeyUp = function(event) {
      return this.postUserInfo();
    };
    /* Functions
    */
    ProfileView.prototype.addAll = function() {
      this.users;
      this.user = this.users.first();
      $("#platform-profile-name").val(this.user.getName());
      $("#platform-profile-city").val(this.user.getCity());
      $("#platform-profile-url").val(this.user.get("url"));
      return this.users;
    };
    ProfileView.prototype.fetch = function() {
      this.users.fetch();
      return this.users;
    };
    ProfileView.prototype.postUserInfo = function() {
      this.user.save({
        name: $("#platform-profile-name").val(),
        url: $("#platform-profile-url").val(),
        city: $("#platform-profile-city").val()
      });
      return false;
    };
    /* UI Builders
    */
    ProfileView.prototype.setListeners = function() {
      $("#platform-profile-name").keyup(function(event) {
        return profileApp.onKeyUp(event);
      });
      $("#platform-profile-url").keyup(function(event) {
        return profileApp.onKeyUp(event);
      });
      return $("#platform-profile-city").keyup(function(event) {
        return profileApp.onKeyUp(event);
      });
    };
    ProfileView.prototype.setWidgets = function() {
      return $("#profile input").val(null);
    };
    return ProfileView;
  }();
  /* Profile application entry point
  */
  profileApp = new ProfileView;
  profileApp.setWidgets();
  profileApp.setListeners();
  profileApp.fetch();
}).call(this);
