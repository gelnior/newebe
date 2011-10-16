(function() {
  var ConfirmationDialog, FormDialog, InfoDialog, LoadingIndicator, LoginView, PlatformController, PlatformView, RegisterPasswordView, RegisterView, infoDialog, loadingIndicator, loginView, platformController, platformView, registerPasswordView, registerView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  PlatformController = (function() {
    __extends(PlatformController, Backbone.Router);
    function PlatformController() {
      PlatformController.__super__.constructor.apply(this, arguments);
    }
    PlatformController.prototype.routes = {
      "contact": "displayContact",
      "news": "displayNews",
      "activities": "displayActivities",
      "profile": "displayProfile",
      "notes": "displayNotes"
    };
    PlatformController.prototype.displayContact = function() {
      return this.view.onContactClicked();
    };
    PlatformController.prototype.displayNews = function() {
      return this.view.onNewsClicked();
    };
    PlatformController.prototype.displayProfile = function() {
      return this.view.onProfileClicked();
    };
    PlatformController.prototype.displayActivities = function() {
      return this.view.onActivitiesClicked();
    };
    PlatformController.prototype.displayNotes = function() {
      return this.view.onNotesClicked();
    };
    PlatformController.prototype.registerView = function(view) {
      return this.view = view;
    };
    return PlatformController;
  })();
  FormDialog = (function() {
    function FormDialog() {
      var div;
      if ($("#form-dialog").length === 0) {
        div = document.createElement('div');
        div.id = "form-dialog";
        div.className = "dialog";
        $("body").prepend(div);
        this.element = $("#form-dialog");
        this.element.html('<div id="form-dialog-text"></div>\n<div id="form-dialog-fields">\n</div>\n<div id="form-dialog-buttons">\n  <span id="form-dialog-yes">ok</span>\n  <span id="form-dialog-no">cancel</span>\n</div>');
      }
      this.element = $("#form-dialog");
      this.setNoButton;
      this.element.hide();
      this.fields = [];
    }
    FormDialog.prototype.addField = function(field) {
      this.fields.push(field);
      if (field.label) {
        $("#form-dialog-fields").append("<label for=\"" + field.name + "\"></label>");
      }
      return $("#form-dialog-fields").append("<input class=\"form-dialog-field\"                 id=\"form-dialog-field-" + field.name + "\"                type=\"text\"                 name=\"" + field.name + "\" />");
    };
    FormDialog.prototype.clearFields = function() {
      this.fields = [];
      return $("#form-dialog-fields").html(null);
    };
    FormDialog.prototype.setNoButton = function() {
      return $("#form-dialog-no").click(__bind(function() {
        return this.element.fadeOut();
      }, this), false);
    };
    FormDialog.prototype.display = function(text, callback) {
      var field, _i, _len, _ref, _results;
      $("#form-dialog-text").empty();
      $("#form-dialog-text").append('<span>' + text + '</span>');
      $("#form-dialog-yes").click(callback);
      $("#form-dialog-no").click(__bind(function() {
        return this.element.hide();
      }, this));
      this.element.show();
      if (this.fields) {
        document.getElementById("form-dialog-field-" + this.fields[0].name).focus();
        _ref = this.fields;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          _results.push($("#form-dialog-field-" + field.name).keyup(function(event) {
            if (event.keyCode === 13) {
              return callback();
            }
          }));
        }
        return _results;
      }
    };
    FormDialog.prototype.getVal = function(fieldIndex) {
      return $("#form-dialog-field-" + this.fields[fieldIndex].name).val();
    };
    FormDialog.prototype.hide = function() {
      return this.element.fadeOut();
    };
    return FormDialog;
  })();
  RegisterView = (function() {
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
        url = "/register/";
        return $.post(url, dataPost, function(data) {
          return $("#register").fadeOut(1600, function() {
            $("body").hide();
            return $.get("/register/password/content/", function(data) {
              var registerPasswordView;
              $("body").prepend(data);
              $("#menu").hide();
              $("#apps").hide();
              $("body").show();
              $("#menu").fadeIn();
              $("#apps").fadeIn();
              return registerPasswordView = new RegisterPasswordView;
            });
          });
        }, "json");
      }
    };
    return RegisterView;
  })();
  RegisterPasswordView = (function() {
    __extends(RegisterPasswordView, Backbone.View);
    RegisterPasswordView.prototype.el = $("body");
    function RegisterPasswordView() {
      RegisterPasswordView.__super__.constructor.apply(this, arguments);
    }
    RegisterPasswordView.prototype.initialize = function() {
      _.bindAll(this, 'onUserFieldKeyUp');
      this.isPosting = false;
      $("#platform-password-text-field").val(null);
      $("#platform-password-text-field").focus();
      return $("#platform-password-text-field").keyup(this.onUserFieldKeyUp);
    };
    RegisterPasswordView.prototype.onUserFieldKeyUp = function(event) {
      var dataPost, url;
      if ((event.keyCode === 13 || e.which === 13) && !this.isPosting) {
        dataPost = '{ "password":"' + $("#platform-password-text-field").val() + '"}';
        this.isPosting = true;
        url = "/register/password/";
        return $.post(url, dataPost, function(data) {
          return $("#register").fadeOut(1600, function() {
            $("body").hide();
            return $.get("/profile/menu-content/", function(data) {
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
    return RegisterPasswordView;
  })();
  LoginView = (function() {
    __extends(LoginView, Backbone.View);
    LoginView.prototype.el = $("body");
    function LoginView() {
      LoginView.__super__.constructor.apply(this, arguments);
    }
    LoginView.prototype.initialize = function() {
      _.bindAll(this, 'onPasswordFieldKeyUp');
      this.isPosting = false;
      $("#login-password-text-field").val(null);
      $("#login-password-text-field").focus();
      return $("#login-password-text-field").keyup(this.onPasswordFieldKeyUp);
    };
    LoginView.prototype.onPasswordFieldKeyUp = function(event) {
      var dataPost, url;
      if (event.keyCode === 13 && !this.isPosting) {
        this.isPosting = true;
        url = "/login/json/";
        dataPost = '{ "password":"' + $("#login-password-text-field").val() + '"}';
        return $.ajax({
          type: "POST",
          url: url,
          data: dataPost,
          datatype: "json",
          success: __bind(function(data) {
            return $("#login-form").fadeOut(1600, __bind(function() {
              $("body").hide();
              return $.get("/profile/menu-content/", __bind(function(data) {
                $("body").prepend(data);
                $("#menu").hide();
                $("#apps").hide();
                $("body").show();
                $("#menu").fadeIn();
                $("#apps").fadeIn();
                return this.isPosting = false;
              }, this));
            }, this));
          }, this),
          error: __bind(function() {
            $("#login-password-text-field").val(null);
            return this.isPosting = false;
          }, this)
        });
      }
    };
    return LoginView;
  })();
  LoadingIndicator = (function() {
    function LoadingIndicator() {
      var div;
      if ($("#loading-indicator").length === 0) {
        div = document.createElement('div');
        div.id = "loading-indicator";
        div.innerHTML = '<img src="/static/images/clock_32.png" />';
        $("body").prepend(div);
      }
      this.element = $("#loading-indicator");
      this.element.hide();
    }
    LoadingIndicator.prototype.display = function() {
      return this.element.show();
    };
    LoadingIndicator.prototype.hide = function() {
      return this.element.hide();
    };
    return LoadingIndicator;
  })();
  InfoDialog = (function() {
    function InfoDialog() {
      var div;
      if ($("#info-dialog").length === 0) {
        div = document.createElement('div');
        div.id = "info-dialog";
        div.className = "dialog";
        $("body").prepend(div);
      }
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
  })();
  ConfirmationDialog = (function() {
    function ConfirmationDialog(callback) {
      var div;
      if ($("#confirmation-dialog").length === 0) {
        div = document.createElement('div');
        div.id = "confirmation-dialog";
        div.className = "dialog";
        div.innerHTML = '<div id="confirmation-text"></div>';
        div.innerHTML += '<div id="confirmation-buttons">' + '<span href="" id="confirmation-yes">Yes</span>' + '<span href="" id="confirmation-no">No</span>' + '</div>';
        $("body").prepend(div);
      }
      this.element = $("#confirmation-dialog");
      this.element.hide();
      this.setNoButton();
    }
    ConfirmationDialog.prototype.setNoButton = function() {
      var divElement;
      divElement = this.element;
      return $("#confirmation-no").click(function() {
        divElement.fadeOut();
        return false;
      });
    };
    ConfirmationDialog.prototype.display = function(text, callback) {
      $("#confirmation-text").empty();
      $("#confirmation-text").append('<span>' + text + '</span>');
      $("#confirmation-yes").click(callback);
      return this.element.show();
    };
    ConfirmationDialog.prototype.hide = function() {
      return this.element.fadeOut();
    };
    return ConfirmationDialog;
  })();
  PlatformView = (function() {
    __extends(PlatformView, Backbone.View);
    PlatformView.prototype.el = $("body");
    PlatformView.prototype.events = {
      "click #news-a": "onNewsClicked",
      "click #profile-a": "onProfileClicked",
      "click #contact-a": "onContactClicked",
      "click #activities-a": "onActivitiesClicked",
      "click #notes-a": "onNotesClicked"
    };
    function PlatformView(controller) {
      this.controller = controller;
      controller.registerView(this);
      this.isChangingPage = false;
      PlatformView.__super__.constructor.apply(this, arguments);
    }
    PlatformView.prototype.initialize = function() {
      _.bindAll(this, 'onNewsClicked', 'onProfileClicked', 'switchTo', 'onContactClicked', 'onActivitiesClicked', 'onLogoutClicked');
      if ($("#news").length !== 0) {
        this.lastPage = "#news";
      } else if ($("#contact").length !== 0) {
        this.lastPage = "#contact";
      } else if ($("#activities").length !== 0) {
        this.lastPage = "#activities";
      } else if ($("#notes").length !== 0) {
        this.lastPage = "#notes";
      } else {
        this.lastPage = "#profile";
      }
      $("#platform-user-text-field").val(null);
      return $("#platform-user-text-field").focus();
    };
    PlatformView.prototype.onNewsClicked = function(ev) {
      if (ev) {
        ev.preventDefault();
      }
      this.switchTo("#news", '/news/content/', "News");
      return false;
    };
    PlatformView.prototype.onProfileClicked = function(ev) {
      if (ev) {
        ev.preventDefault();
      }
      this.switchTo("#profile", '/profile/content/', "Profile");
      return false;
    };
    PlatformView.prototype.onContactClicked = function(ev) {
      if (ev) {
        ev.preventDefault();
      }
      this.switchTo("#contact", '/contact/content/', "Contact");
      return false;
    };
    PlatformView.prototype.onActivitiesClicked = function(ev) {
      if (ev) {
        ev.preventDefault();
      }
      this.switchTo("#activities", '/activities/content/', "Activities");
      return false;
    };
    PlatformView.prototype.onNotesClicked = function(ev) {
      if (ev) {
        ev.preventDefault();
      }
      this.switchTo("#notes", '/notes/content/', "Notes");
      return false;
    };
    PlatformView.prototype.switchTo = function(page, url, title) {
      if (!this.isChangingPage) {
        this.isChangingPage = true;
        document.title = "Newebe | " + title;
        $(this.lastPage + "-a").removeClass("disabled");
        $(page + "-a").addClass("disabled");
        this.controller.navigate(page);
        if (this.lastPage !== page) {
          $(this.lastPage).fadeOut(this.onLastPageFadeOut(page, url));
        } else {
          this.isChangingPage = false;
        }
        return this.lastPage;
      }
    };
    PlatformView.prototype.onLastPageFadeOut = function(page, url) {
      $(this.lastPage).hide();
      this.lastPage = page;
      if ($(page).length === 0) {
        $.get(url, __bind(function(data) {
          $("#apps").prepend(data);
          $(page).fadeIn();
          return this.isChangingPage = false;
        }, this));
      } else {
        $(page).fadeIn();
        this.isChangingPage = false;
      }
      return false;
    };
    return PlatformView;
  })();
  infoDialog = new InfoDialog;
  platformController = new PlatformController;
  platformView = new PlatformView(platformController);
  loadingIndicator = new LoadingIndicator;
  registerView = new RegisterView;
  registerPasswordView = new RegisterPasswordView;
  loginView = new LoginView;
  Backbone.history.start();
}).call(this);
