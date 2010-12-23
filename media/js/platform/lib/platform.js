(function() {
  /* Main view for applications navigation
  */  var PlatformView, RegisterView, platformView, registerView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  PlatformView = function() {
    __extends(PlatformView, Backbone.View);
    PlatformView.prototype.el = $("body");
    PlatformView.prototype.events = {
      "click #news-a": "onNewsClicked",
      "click #profile-a": "onProfileClicked"
    };
    function PlatformView() {
      PlatformView.__super__.constructor.apply(this, arguments);
    }
    PlatformView.prototype.initialize = function() {
      _.bindAll(this, 'onNewsClicked', 'onProfileClicked', 'switchTo');
      if ($("#news").length === 0) {
        this.lastPage = "#profile";
      } else {
        this.lastPage = "#news";
      }
      $("#platform-user-text-field").val(null);
      return $("#platform-user-text-field").focus();
    };
    PlatformView.prototype.onNewsClicked = function(ev) {
      ev.preventDefault();
      this.switchTo("#news", '/news/wall/content/');
      return false;
    };
    PlatformView.prototype.onProfileClicked = function(ev) {
      ev.preventDefault();
      this.switchTo("#profile", '/platform/profile/content/');
      return false;
    };
    PlatformView.prototype.switchTo = function(page, url) {
      if (this.lastPage !== page) {
        $(this.lastPage).fadeOut(this.onLastPageFadeOut(page, url));
      }
      return this.lastPage;
    };
    PlatformView.prototype.onLastPageFadeOut = function(page, url) {
      $(this.lastPage).hide();
      this.lastPage = page;
      if ($(page).length === 0) {
        $.get(url, function(data) {
          $("#apps").prepend(data);
          return $(page).fadeIn();
        });
      } else {
        $(page).fadeIn();
      }
      return false;
    };
    return PlatformView;
  }();
  RegisterView = function() {
    __extends(RegisterView, Backbone.View);
    RegisterView.prototype.el = $("body");
    function RegisterView() {
      RegisterView.__super__.constructor.apply(this, arguments);
    }
    RegisterView.prototype.initialize = function() {
      _.bindAll(this, 'onUserFieldKeyUp');
      this.isPosting = false;
      $("#platform-user-text-field").val(null);
      $("#platform-user-text-field").focus();
      return $("#platform-user-text-field").keyup(this.onUserFieldKeyUp);
    };
    RegisterView.prototype.onUserFieldKeyUp = function(event) {
      var dataPost, url;
      if (event.keyCode === 13 && !this.isPosting) {
        dataPost = '{ "name":"' + $("#platform-user-text-field").val() + '"}';
        this.isPosting = true;
        url = "/platform/user/";
        return $.post(url, dataPost, function(data) {
          return $("#register").fadeOut(1600, function() {
            $("body").hide();
            return $.get("/platform/profile/menu-content/", function(data) {
              $("body").prepend(data);
              $("#menu").hide();
              $("#apps").hide();
              $("body").show();
              $("#menu").fadeIn();
              return $("#apps").fadeIn();
            });
          });
        }, "json");
      }
    };
    return RegisterView;
  }();
  platformView = new PlatformView;
  registerView = new RegisterView;
}).call(this);
