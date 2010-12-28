(function() {
  /* Main view for applications navigation
  */  var InfoDialog, PlatformView, RegisterView, infoDialog, platformView, registerView;
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
      "click #profile-a": "onProfileClicked",
      "click #contact-a": "onContactClicked"
    };
    function PlatformView() {
      PlatformView.__super__.constructor.apply(this, arguments);
    }
    PlatformView.prototype.initialize = function() {
      _.bindAll(this, 'onNewsClicked', 'onProfileClicked', 'switchTo', 'onContactClicked');
      if ($("#news").length !== 0) {
        this.lastPage = "#news";
      } else if ($("#contact").length !== 0) {
        this.lastPage = "#contact";
      } else {
        this.lastPage = "#profile";
      }
      $("#platform-user-text-field").val(null);
      return $("#platform-user-text-field").focus();
    };
    PlatformView.prototype.onNewsClicked = function(ev) {
      ev.preventDefault();
      document.title = "Newebe | News";
      this.switchTo("#news", '/news/content/');
      return false;
    };
    PlatformView.prototype.onProfileClicked = function(ev) {
      ev.preventDefault();
      document.title = "Newebe | Profile";
      this.switchTo("#profile", '/platform/profile/content/');
      return false;
    };
    PlatformView.prototype.onContactClicked = function(ev) {
      ev.preventDefault();
      document.title = "Newebe | Contact";
      this.switchTo("#contact", '/platform/contact/content/');
      return false;
    };
    PlatformView.prototype.switchTo = function(page, url) {
      $(this.lastPage + "-a").removeClass("disabled");
      $(page + "-a").addClass("disabled");
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
  InfoDialog = function() {
    function InfoDialog() {
      var div;
      div = document.createElement('div');
      div.id = "info-dialog";
      div.innerHTML = "Test";
      $("body").prepend(div);
      this.element = $("#info-dialog");
      this.element.hide();
    }
    InfoDialog.prototype.display = function(text) {
      this.element.empty();
      this.element.append(text);
      this.element.show();
      return this.element.fadeOut(4000);
    };
    return InfoDialog;
  }();
  infoDialog = new InfoDialog;
  platformView = new PlatformView;
  registerView = new RegisterView;
}).call(this);
