(function() {
  var ProfileView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ProfileView = (function() {
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
    /* Events */
    ProfileView.prototype.onKeyUp = function(event) {
      return this.postUserInfo();
    };
    /* Functions */
    ProfileView.prototype.addAll = function() {
      this.users;
      this.user = this.users.first();
      $("#platform-profile-name").val(this.user.getName());
      $("#platform-profile-city").val(this.user.getCity());
      $("#platform-profile-url").val(this.user.get("url"));
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
      return this.user.save({
        name: $("#platform-profile-name").val(),
        url: $("#platform-profile-url").val(),
        city: $("#platform-profile-city").val()
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
    /* UI Builders */
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
      $("#profile input").val(null);
      return $("#profile-a").addClass("disabled");
    };
    return ProfileView;
  })();
}).call(this);
