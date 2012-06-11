(function() {
  var ConfirmationDialog, Contact, ContactCollection, ContactRow, ContactView, InfoDialog, LoadingIndicator, confirmationDialog, contactApp, infoDialog, loadingIndicator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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

    function ConfirmationDialog() {
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
      var left, top;
      $("#confirmation-text").empty();
      $("#confirmation-text").append('<span>' + text + '</span>');
      $("#confirmation-yes").click(callback);
      this.element.show();
      top = $("body").scrollTop() + 200;
      left = this.element.offset().left;
      return this.element.offset({
        left: left,
        top: top
      });
    };

    ConfirmationDialog.prototype.hide = function() {
      return this.element.fadeOut();
    };

    return ConfirmationDialog;

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

  ContactRow = (function(_super) {

    __extends(ContactRow, _super);

    ContactRow.prototype.tagName = "div";

    ContactRow.prototype.className = "platform-contact-row";

    ContactRow.prototype.template = _.template('<span class="platform-contact-row-buttons">\n<% if (state === "Wait for approval") { %>\n  <a class="platform-contact-wap">Confirm</a>\n<% } %>\n<a class="platform-contact-retry">Retry</a>\n<a class="platform-contact-delete">X</a>    \n</span>\n<p class="platform-contact-url">\n <a class="contact-name" href=""><%= name %></a> | \n <%= url %>\n <span class="platform-contact-state"> (<%= state %>)</span>\n</p>');

    ContactRow.prototype.events = {
      "click .platform-contact-delete": "onDeleteClicked",
      "click .platform-contact-wap": "onConfirmClicked",
      "click .platform-contact-retry": "onRetryClicked",
      "click .contact-name": "onNameClicked",
      "click": "onClick",
      "mouseover": "onMouseOver",
      "mouseout": "onMouseOut"
    };

    function ContactRow(model, mainView) {
      this.model = model;
      this.mainView = mainView;
      this.onTagFieldKeyUp = __bind(this.onTagFieldKeyUp, this);
      this.onTagFieldKeyPress = __bind(this.onTagFieldKeyPress, this);
      this.onDeleteTagButtonClicked = __bind(this.onDeleteTagButtonClicked, this);
      ContactRow.__super__.constructor.call(this);
      this.model.view = this;
    }

    ContactRow.prototype.onMouseOver = function() {
      if (!this.selected) return $(this.el).addClass("mouseover");
    };

    ContactRow.prototype.onMouseOut = function() {
      return $(this.el).removeClass("mouseover");
    };

    ContactRow.prototype.onClick = function() {
      return this.mainView.onRowClicked(this);
    };

    ContactRow.prototype.onDeleteClicked = function() {
      var model,
        _this = this;
      model = this.model;
      return confirmationDialog.display("Are you sure you want to delete this contact ?", function() {
        confirmationDialog.hide();
        model["delete"]();
        _this.mainView.selectedRow = null;
        return $("#contact-preview").html(null);
      });
    };

    ContactRow.prototype.onRetryClicked = function() {
      var _this = this;
      return $.ajax({
        type: "POST",
        url: "/contacts/" + this.model.id + "retry/",
        data: '{"slug":"' + this.model.slug + '"}',
        dataType: "json",
        success: function(data) {
          _this.model.state = "PENDING";
          return _this.$(".platform-contact-state").html("(Pending)");
        },
        error: function(data) {
          return infoDialog.display("Contact request failed.");
        }
      });
    };

    ContactRow.prototype.onConfirmClicked = function() {
      return this.model.saveToDb();
    };

    ContactRow.prototype.onNameClicked = function(event) {
      var _this = this;
      $.get("/contacts/" + (this.model.get("key")) + "/html/", function(data) {
        $("#contact-preview").html(data);
        $("#contact-preview input").keypress(_this.onTagFieldKeyPress);
        $("#contact-preview input").keyup(_this.onTagFieldKeyUp);
        _this.isTagFieldHidden = true;
        _this.isRemoveTagButtonsHidden = true;
        $("#contact-preview input").hide();
        $("#profile-tag-list button").hide();
        $("#profile-add-tag-button").click(_this.onAddTagButtonClicked);
        $("#profile-remove-tag-button").click(_this.onRemoveTagButtonClicked);
        return $("#profile-tag-list button").click(_this.onDeleteTagButtonClicked);
      });
      if (event) event.preventDefault();
      return false;
    };

    ContactRow.prototype.onAddTagButtonClicked = function(event) {
      return $("#contact-preview input").toggle(this.isTagFieldHidden);
    };

    ContactRow.prototype.onRemoveTagButtonClicked = function(event) {
      return $("#profile-tag-list button").toggle(this.isRemoveTagButtonsHidden);
    };

    ContactRow.prototype.onDeleteTagButtonClicked = function(event) {
      var tag;
      tag = $($(event.target).parent().children()[0]).text().trim();
      return this.model.removeTag(tag, {
        success: function() {
          return $(event.target).parent().remove();
        },
        error: function() {
          return infoDialog.display("Removing tag to contact failed.");
        }
      });
    };

    ContactRow.prototype.onTagFieldKeyPress = function(event) {
      var key, keychar;
      key = event.which;
      keychar = String.fromCharCode(key).toLowerCase();
      if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27)) {
        return true;
      }
      if ("abcdefghijklmnopqrstuvwxyz0123456789".indexOf(keychar) === -1) {
        event.preventDefault();
        return false;
      }
    };

    ContactRow.prototype.onTagFieldKeyUp = function(event) {
      var value;
      value = $("#contact-preview input").val();
      $("#contact-preview input").val(value.replace(/[^a-z0-9]/g, ''));
      if (event.which === 13) {
        if (this.model.isTagged(value)) {
          return infoDialog.display("Tag already set");
        } else {
          this.model.tags.push(value);
          return this.model.updateTags({
            success: function() {
              $("#contact-preview input").val(null);
              return $("#profile-tag-list").append(" " + value);
            },
            error: function() {
              return infoDialog.display("Adding tag to contact failed.");
            }
          });
        }
      }
    };

    ContactRow.prototype.remove = function() {
      return $(this.el).remove();
    };

    ContactRow.prototype.refresh = function(state) {
      return this.$(".platform-contact-state").text("(" + state + ")");
    };

    ContactRow.prototype.render = function() {
      var state;
      $(this.el).html(this.template(this.model.toJSON()));
      this.$(".platform-contact-delete").button();
      this.$(".platform-contact-retry").button();
      this.$(".platform-contact-wap").button();
      this.$(".platform-contact-row-buttons").hide();
      state = this.model.getState();
      if (state !== "Error" && state !== "pending") {
        this.$(".platform-contact-retry").hide();
      }
      return this.el;
    };

    ContactRow.prototype.select = function() {
      this.$(".platform-contact-row-buttons").show();
      $(this.el).removeClass("mouseover");
      $(this.el).addClass("selected");
      return this.onNameClicked(null);
    };

    ContactRow.prototype.deselect = function() {
      this.$(".platform-contact-row-buttons").hide();
      $(this.el).removeClass("selected");
      return $("#contact-preview").html(null);
    };

    return ContactRow;

  })(Backbone.View);

  /* Main view for contact application
  */

  String.prototype.isNewebeUrl = function() {
    var regexp;
    regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g;
    return this.match(regexp) !== null;
  };

  ContactView = (function(_super) {

    __extends(ContactView, _super);

    ContactView.prototype.el = $("#news");

    ContactView.prototype.events = {
      "click #contact-post-button": "onPostClicked",
      "submit #contact-post-button": "onPostClicked",
      "click #contact-alm-button": "onAllClicked",
      "click #contact-pending-button": "onPendingClicked",
      "click #contact-request-button": "onRequestedClicked"
    };

    function ContactView() {
      this.onAddContactFieldKeyUp = __bind(this.onAddContactFieldKeyUp, this);      ContactView.__super__.constructor.call(this);
    }

    ContactView.prototype.initialize = function() {
      _.bindAll(this, 'postNewContact', 'appendOne', 'prependOne', 'addAll');
      _.bindAll(this, 'onPostClicked');
      this.contacts = new ContactCollection;
      this.tutorialOn = true;
      this.contacts.bind('add', this.prependOne);
      this.contacts.bind('reset', this.addAll);
      return this.selectedRow = null;
    };

    ContactView.prototype.onPostClicked = function(event) {
      event.preventDefault();
      this.postNewContact();
      return event;
    };

    ContactView.prototype.onAllClicked = function(event) {
      event.preventDefault();
      return this.onFilterClicked("#contact-all-button", "/contacts/all/");
    };

    ContactView.prototype.onPendingClicked = function(event) {
      event.preventDefault();
      return this.onFilterClicked("#contact-pending-button", "/contacts/pending/");
    };

    ContactView.prototype.onRequestedClicked = function(event) {
      event.preventDefault();
      return this.onFilterClicked("#contact-request-button", "/contacts/requested/");
    };

    ContactView.prototype.onFilterClicked = function(filterClicked, path) {
      if (this.lastFilterClicked !== filterClicked) {
        this.selectedRow = null;
        $(filterClicked).button("option", "disabled", true);
        $(this.lastFilterClicked).button("option", "disabled", false);
        this.lastFilterClicked = filterClicked;
        return this.reloadContacts(path);
      }
    };

    ContactView.prototype.onRowClicked = function(row) {
      if (row !== this.selectedRow) {
        if (this.selectedRow) this.selectedRow.deselect();
        row.select();
        return this.selectedRow = row;
      }
    };

    ContactView.prototype.onAddContactFieldKeyUp = function() {
      var contactUrl;
      contactUrl = $.trim(this.addContactField.val());
      if (!contactUrl.isNewebeUrl()) {
        return this.contactFieldError.show();
      } else {
        return this.contactFieldError.hide();
      }
    };

    /* Functions
    */

    ContactView.prototype.reloadContacts = function(url) {
      loadingIndicator.hide();
      this.clearContacts();
      this.contacts.url = url;
      this.contacts.fetch();
      return this.contacts;
    };

    ContactView.prototype.clearContacts = function() {
      return $("#contacts").empty();
    };

    ContactView.prototype.addAll = function() {
      if (this.contacts.length > 0) {
        this.tutorialOn = false;
      } else {
        if (this.tutorialOn && this.lastFilterClicked === "#contact-all-button") {
          this.displayTutorial(1);
        } else {
          $("#tutorial-contact").html(null);
        }
      }
      this.contacts.each(this.appendOne);
      loadingIndicator.hide();
      return this.contacts;
    };

    ContactView.prototype.appendOne = function(contact) {
      var el, row;
      row = new ContactRow(contact, this);
      el = row.render();
      $("#contacts").append(el);
      if (this.tutorialOn) {
        this.displayTutorial(2);
        this.tutorialOn = false;
      }
      return row;
    };

    ContactView.prototype.prependOne = function(contact) {
      var el, row;
      row = new ContactRow(contact, this);
      el = row.render();
      $("#contacts").prepend(el);
      loadingIndicator.hide();
      if (this.tutorialOn) {
        this.displayTutorial(2);
        return this.tutorialOn = false;
      }
    };

    ContactView.prototype.clearContacts = function() {
      return $("#contacts").empty();
    };

    ContactView.prototype.clearPostField = function() {
      $("#contact-url-field").val(null);
      $("#contact-url-field").focus();
      return $("#contact-url-field");
    };

    ContactView.prototype.clearPostField = function() {
      $("#contact-url-field").val(null);
      $("#contact-url-field").focus();
      return $("#contact-url-field");
    };

    ContactView.prototype.fetch = function() {
      this.contacts.fetch();
      return this.contacts;
    };

    ContactView.prototype.postNewContact = function() {
      var contactUrl;
      contactUrl = $.trim($("#contact-url-field").val());
      if (contactUrl.isNewebeUrl()) {
        if (this.contacts.find(function(contact) {
          return contactUrl === contact.getUrl();
        })) {
          infoDialog.display("Contact is already in your list");
        } else {
          loadingIndicator.display();
          this.contacts.create({
            url: contactUrl,
            success: function(model, response) {
              return loadingIndicator.hide();
            },
            error: function(model, response) {
              loadingIndicator.hide();
              return infoDialog.display("An error occured on server." + "Please refresh the contact list.");
            }
          });
        }
        $("#contact-url-field").val(null);
        $("#contact-url-field").focus();
      } else {
        infoDialog.display("Given URL is not a valid URL.");
      }
      return false;
    };

    ContactView.prototype.displayTutorial = function(index) {
      return $.get("/contacts/tutorial/" + index + "/", function(data) {
        return $("#tutorial-contact").html(data);
      });
    };

    /* UI Builders
    */

    ContactView.prototype.setListeners = function() {
      $("#contact-post-button").submit(function(event) {
        return contactApp.onPostClicked(event);
      });
      $("#contact-post-button").click(function(event) {
        return contactApp.onPostClicked(event);
      });
      $("#contact-all-button").click(function(event) {
        return contactApp.onAllClicked(event);
      });
      $("#contact-pending-button").click(function(event) {
        return contactApp.onPendingClicked(event);
      });
      $("#contact-request-button").click(function(event) {
        return contactApp.onRequestedClicked(event);
      });
      return this.addContactField.keyup(this.onAddContactFieldKeyUp);
    };

    ContactView.prototype.setWidgets = function() {
      $("#contact-all-button").button();
      $("#contact-pending-button").button();
      $("#contact-request-button").button();
      $("input#contact-post-button").button();
      $("#contact-a").addClass("disabled");
      $("#contact-all-button").button("option", "disabled", true);
      this.lastFilterClicked = "#contact-all-button";
      this.addContactField = $("#contact-url-field");
      this.contactFieldError = $("#contact-url-error");
      return this.contactFieldError.hide();
    };

    return ContactView;

  })(Backbone.View);

  Contact = (function(_super) {

    __extends(Contact, _super);

    Contact.prototype.url = '/contacts/all/';

    function Contact(contact) {
      Contact.__super__.constructor.call(this, contact);
      this.set('url', contact.url);
      this.set('name', contact.name);
      this.set('key', contact.key);
      this.id = contact.slug + "/";
      this.tags = contact.tags;
      if (contact.state) this.set('state', contact.state);
    }

    /* Accessors / Editors
    */

    Contact.prototype.getUrl = function() {
      return this.get('url');
    };

    Contact.prototype.getState = function() {
      return this.get('state');
    };

    Contact.prototype.setState = function(state) {
      return this.set('state', state);
    };

    Contact.prototype["delete"] = function() {
      this.url = '/contacts/' + this.id;
      this.destroy();
      return this.view.remove();
    };

    Contact.prototype.saveToDb = function() {
      this.url = '/contacts/' + this.id;
      this.save(null, {
        success: function(model, response) {
          model.setState("Trusted");
          model.view.refresh("Trusted");
          return true;
        },
        error: function(model, response) {
          model.setState("Error");
          model.view.refresh("Error");
          return true;
        }
      });
      return this.url;
    };

    Contact.prototype.isTagged = function(tag) {
      var currentTag, _i, _len, _ref;
      _ref = this.tags;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        currentTag = _ref[_i];
        if (currentTag === tag) return true;
      }
      return false;
    };

    Contact.prototype.removeTag = function(tag, callbacks) {
      var currentTag, i, _i, _len, _ref;
      i = 0;
      _ref = this.tags;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        currentTag = _ref[_i];
        if (currentTag === tag) {
          break;
        } else {
          i++;
        }
      }
      this.tags.splice(i, 1);
      return this.updateTags(callbacks);
    };

    Contact.prototype.updateTags = function(callbacks) {
      return $.ajax({
        type: "PUT",
        url: "/contacts/" + this.id + "tags/",
        data: '{"tags":["' + this.tags.join("\", \"") + '"]}',
        success: callbacks.success,
        error: callbacks.success
      });
    };

    Contact.prototype.isNew = function() {
      return !this.getState();
    };

    return Contact;

  })(Backbone.Model);

  /* Model for a Micro Post collection
  */

  ContactCollection = (function(_super) {

    __extends(ContactCollection, _super);

    function ContactCollection() {
      ContactCollection.__super__.constructor.apply(this, arguments);
    }

    ContactCollection.prototype.model = Contact;

    ContactCollection.prototype.url = '/contacts/all/';

    ContactCollection.prototype.comparator = function(contact) {
      return contact.getUrl();
    };

    ContactCollection.prototype.parse = function(response) {
      return response.rows;
    };

    return ContactCollection;

  })(Backbone.Collection);

  infoDialog = new InfoDialog;

  confirmationDialog = new ConfirmationDialog;

  loadingIndicator = new LoadingIndicator;

  contactApp = new ContactView;

  contactApp.setWidgets();

  contactApp.setListeners();

  contactApp.clearPostField();

  contactApp.fetch();

}).call(this);
