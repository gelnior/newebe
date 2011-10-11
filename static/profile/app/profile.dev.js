(function() {
<<<<<<< HEAD
  var FormDialog, ProfileView, User, UserCollection, profileApp;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
=======
  var ProfileView, User, UserCollection, profileApp;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
>>>>>>> 5f3d1060a7e5a7bd622367cdccf5b21b7eb94af2
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
<<<<<<< HEAD
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  FormDialog = (function() {
    function FormDialog() {
      var div;
      if ($("#form-dialog").length === 0) {
        div = document.createElement('div');
        div.id = "form-dialog";
        div.className = "dialog";
        $("body").prepend(div);
        this.element = $("#form-dialog");
        this.element.html('<div id="form-dialog-text"></div>\n<div id="form-dialog-buttons">\'\n  <span id="form-dialog-yes">Yes</span>\n  <span id="form-dialog-no">No</span>\n</div>');
      }
      this.element = $("#form-dialog");
      this.element.hide();
      this.fields = [];
    }
    FormDialog.prototype.addField = function(field) {
      return this.fields.append(field);
    };
    FormDialog.prototype.clearFields = function() {
      return this.fields = [];
    };
    FormDialog.prototype.setNoButton = function() {
      var divElement;
      divElement = this.element;
      return $("#confirmation-no").click(function() {
        divElement.fadeOut();
        return false;
      });
    };
    FormDialog.prototype.display = function(text, callback) {
      $("#confirmation-text").empty();
      $("#confirmation-text").append('<span>' + text + '</span>');
      $("#confirmation-yes").click(callback);
      return this.element.show();
    };
    FormDialog.prototype.hide = function() {
      return this.element.fadeOut();
    };
    return FormDialog;
  })();
  User = (function() {
    __extends(User, Backbone.Model);
    User.prototype.url = '/user/';
    function User(user) {
      User.__super__.constructor.apply(this, arguments);
      this.id = "";
      this.set("url", user.url);
      this.set("name", user.name);
      this.set("description", user.description);
    }
    /* Setters / Accessors */
    User.prototype.getName = function() {
      return this.get("name");
    };
    User.prototype.setName = function(name) {
      alert(name);
      this.set("name", name);
      return alert(this.getName());
    };
    User.prototype.getUrl = function() {
      return this.get("userUrl");
    };
    User.prototype.setUrl = function(url) {
      return this.set("url", url);
    };
    User.prototype.getDescription = function() {
      return this.get("description");
    };
    User.prototype.setDescription = function(description) {
      return this.set("description", description);
    };
    User.prototype.isNew = function() {
      return false;
    };
    return User;
  })();
  /* Model for a User collection */
  UserCollection = (function() {
    function UserCollection() {
      UserCollection.__super__.constructor.apply(this, arguments);
    }
    __extends(UserCollection, Backbone.Collection);
    UserCollection.prototype.model = User;
    UserCollection.prototype.url = '/user/';
    UserCollection.prototype.parse = function(response) {
      return response.rows;
    };
    return UserCollection;
  })();
=======
  };
>>>>>>> 5f3d1060a7e5a7bd622367cdccf5b21b7eb94af2
  ProfileView = (function() {
    __extends(ProfileView, Backbone.View);
    ProfileView.prototype.el = $("#profile");
    function ProfileView() {
      this.onDescriptionEditClicked = __bind(this.onDescriptionEditClicked, this);
      this.onMouseOut = __bind(this.onMouseOut, this);
      this.onMouseOver = __bind(this.onMouseOver, this);      ProfileView.__super__.constructor.call(this);
    }
    ProfileView.prototype.initialize = function() {
      _.bindAll(this, 'onKeyUp', 'postUserInfo', 'fetch', 'addAll');
      this.users = new UserCollection;
      this.isEditing = false;
      return this.users.bind('reset', this.addAll);
    };
    /* Events */
    ProfileView.prototype.events = {
      "click #profile-description-edit": "onDescriptionEditClicked",
      "mouseover #profile div.app": "onMouseOver",
      "mouseout #profile div.app": "onMouseOut"
    };
    ProfileView.prototype.onKeyUp = function(event) {
      this.postUserInfo();
      return event;
    };
    ProfileView.prototype.onMouseOver = function(event) {
      $("#profile-description-edit").show();
      return $("#profile-change-password").show();
    };
    ProfileView.prototype.onMouseOut = function(event) {
      $("#profile-description-edit").hide();
      return $("#profile-change-password").hide();
    };
    ProfileView.prototype.onDescriptionEditClicked = function(event) {
      if (!this.isEditing) {
        this.isEditing = true;
        $("#profile-description-display").fadeOut(function() {
          $("#profile-description-display").hide();
          return $("#profile-description").slideDown(function() {
            return $("#profile-preview").fadeIn();
          });
        });
      } else {
        this.isEditing = false;
        $("#profile-preview").fadeOut(function() {
          return $("#profile-description").slideUp(function() {
            return $("#profile-description-display").fadeIn();
          });
        });
      }
      return false;
    };
    /* Functions */
    ProfileView.prototype.addAll = function() {
      this.users;
      this.user = this.users.first();
      $("#platform-profile-name").val(this.user.getName());
      $("#profile-description").val(this.user.getDescription());
      $("#platform-profile-url").val(this.user.get("url"));
      this.renderProfile();
      if (!this.user.get("url")) {
        this.tutorialOn = true;
        this.displayTutorial(1);
      }
      return this.users;
    };
    ProfileView.prototype.fetch = function() {
      this.users.fetch();
      return this.users;
    };
    ProfileView.prototype.postUserInfo = function() {
      var tutorialOn;
      $("#profile").addClass("modified");
      tutorialOn = this.tutorialOn;
      this.user.save({
        name: $("#platform-profile-name").val(),
        url: $("#platform-profile-url").val(),
        description: $("#profile-description").val()
      }, {
        success: function() {
          if (tutorialOn) {
            $.get("/profile/tutorial/2/", function(data) {
              return $("#tutorial-profile").html(data);
            });
          }
          return $("#profile").removeClass("modified");
        }
      });
      return this.renderProfile();
    };
    ProfileView.prototype.testTutorial = function() {
      if (this.tutorialOn) {
        this.displayTutorial(2);
        this.tutorialOn = false;
      }
      return false;
    };
    ProfileView.prototype.displayTutorial = function(index) {
      return $.get("/profile/tutorial/" + index + "/", function(data) {
        return $("#tutorial-profile").html(data);
      });
    };
    ProfileView.prototype.renderProfile = function() {
      var converter, desc, renderer;
      renderer = _.template('<h1 class="profile-name"><%= name %></h1>\n<p class="profile-url"><%= url %></p>\n<p class="profile-description"><%= description %></p>');
      desc = $("#profile-description").val();
      converter = new Showdown.converter();
      desc = converter.makeHtml(desc);
      $("#profile-description-display").html(desc);
      $("#profile-render").html(renderer({
        name: $("#platform-profile-name").val(),
        url: $("#platform-profile-url").val(),
        description: desc
      }));
      return this.user;
    };
    /* UI Builders */
    ProfileView.prototype.setListeners = function() {
      $("#platform-profile-name").keyup(function(event) {
        return profileApp.onKeyUp(event);
      });
      $("#platform-profile-url").keyup(function(event) {
        return profileApp.onKeyUp(event);
      });
      return $("#profile-description").keyup(function(event) {
        return profileApp.onKeyUp(event);
      });
    };
    ProfileView.prototype.setWidgets = function() {
      $("#profile input").val(null);
      $("#profile-a").addClass("disabled");
      $("#profile-description").hide();
      $("#profile-preview").hide();
      $("#profile-description-edit").button();
      $("#profile-description-edit").hide();
      $("#profile-change-password").button();
      return $("#profile-change-password").hide();
    };
    return ProfileView;
  })();
  User = (function() {
    __extends(User, Backbone.Model);
    User.prototype.url = '/user/';
    function User(user) {
      User.__super__.constructor.apply(this, arguments);
      this.id = "";
      this.set("url", user.url);
      this.set("name", user.name);
      this.set("description", user.description);
    }
    /* Setters / Accessors */
    User.prototype.getName = function() {
      return this.get("name");
    };
    User.prototype.setName = function(name) {
      alert(name);
      this.set("name", name);
      return alert(this.getName());
    };
    User.prototype.getUrl = function() {
      return this.get("userUrl");
    };
    User.prototype.setUrl = function(url) {
      return this.set("url", url);
    };
    User.prototype.getDescription = function() {
      return this.get("description");
    };
    User.prototype.setDescription = function(description) {
      return this.set("description", description);
    };
    User.prototype.isNew = function() {
      return false;
    };
    return User;
  })();
  /* Model for a User collection */
  UserCollection = (function() {
    __extends(UserCollection, Backbone.Collection);
    function UserCollection() {
      UserCollection.__super__.constructor.apply(this, arguments);
    }
    UserCollection.prototype.model = User;
    UserCollection.prototype.url = '/user/';
    UserCollection.prototype.parse = function(response) {
      return response.rows;
    };
    return UserCollection;
  })();
  profileApp = new ProfileView;
  profileApp.setWidgets();
  profileApp.setListeners();
  profileApp.fetch();
}).call(this);
