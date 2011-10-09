(function() {
  var ConfirmationDialog, Contact, ContactCollection, ContactRow, ContactView, InfoDialog, LoadingIndicator, confirmationDialog, contactApp, infoDialog, loadingIndicator;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  InfoDialog = (function() {
    function InfoDialog() {
      var div;
      if ($("#info-dialog").length === 0) {
        div = document.createElement('div');
        div.id = "info-dialog";
        div.className = "dialog";
        div.innerHTML = "Test";
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
  Contact = (function() {
    __extends(Contact, Backbone.Model);
    Contact.prototype.url = '/contacts/';
    function Contact(contact) {
      Contact.__super__.constructor.apply(this, arguments);
      this.set('url', contact.url);
      this.set('name', contact.name);
      this.set('key', contact.key);
      this.id = contact.slug + "/";
      if (contact.state) {
        this.set('state', contact.state);
      }
    }
    /* Accessors / Editors */
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
    Contact.prototype.isNew = function() {
      return !this.getState();
    };
    return Contact;
  })();
  /* Model for a Micro Post collection */
  ContactCollection = (function() {
    function ContactCollection() {
      ContactCollection.__super__.constructor.apply(this, arguments);
    }
    __extends(ContactCollection, Backbone.Collection);
    ContactCollection.prototype.model = Contact;
    ContactCollection.prototype.url = '/contacts/';
    ContactCollection.prototype.comparator = function(contact) {
      return contact.getUrl();
    };
    ContactCollection.prototype.parse = function(response) {
      return response.rows;
    };
    return ContactCollection;
  })();
  ContactRow = (function() {
    __extends(ContactRow, Backbone.View);
    ContactRow.prototype.tagName = "div";
    ContactRow.prototype.className = "platform-contact-row";
    ContactRow.prototype.template = _.template('<span class="platform-contact-row-buttons">\n<% if (state === "Wait for approval") { %>\n  <a class="platform-contact-wap">Confim</a>\n<% } %>\n<a class="platform-contact-retry">Retry</a>\n<a class="platform-contact-delete">X</a>    \n</span>\n<p class="platform-contact-url">\n <a class="contact-name" href=""><%= name %></a> | \n <%= url %>\n <span class="platform-contact-state"> (<%= state %>)</span>\n</p>');
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
      ContactRow.__super__.constructor.call(this);
      this.model.view = this;
    }
    ContactRow.prototype.onMouseOver = function() {
      if (!this.selected) {
        return $(this.el).addClass("mouseover");
      }
    };
    ContactRow.prototype.onMouseOut = function() {
      return $(this.el).removeClass("mouseover");
    };
    ContactRow.prototype.onClick = function() {
      return this.mainView.onRowClicked(this);
    };
    ContactRow.prototype.onDeleteClicked = function() {
      var model;
      model = this.model;
      return confirmationDialog.display("Are you sure you want to delete this contact ?", __bind(function() {
        confirmationDialog.hide();
        model["delete"]();
        this.mainView.selectedRow = null;
        return $("#contact-preview").html(null);
      }, this));
    };
    ContactRow.prototype.onRetryClicked = function() {
      return $.ajax({
        type: "POST",
        url: "/contacts/" + this.model.id + "retry/",
        data: '{"slug":"' + this.model.slug + '"}',
        dataType: "json",
        success: __bind(function(data) {
          this.model.state = "PENDING";
          return this.$(".platform-contact-state").html("(Pending)");
        }, this),
        error: function(data) {
          return infoDialog.display("Contact request failed.");
        }
      });
    };
    ContactRow.prototype.onConfirmClicked = function() {
      return this.model.saveToDb();
    };
    ContactRow.prototype.onNameClicked = function(event) {
      $.get("/contacts/render/" + (this.model.get("key")) + "/", function(data) {
        return $("#contact-preview").html(data);
      });
      if (event) {
        event.preventDefault();
      }
      return false;
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
  })();
  /* Main view for contact application */
  ContactView = (function() {
    __extends(ContactView, Backbone.View);
    ContactView.prototype.el = $("#news");
    ContactView.prototype.events = {
      "click #contact-post-button": "onPostClicked",
      "submit #contact-post-button": "onPostClicked",
      "click #contact-alm-button": "onAllClicked",
      "click #contact-pending-button": "onPendingClicked",
      "click #contact-request-button": "onRequestedClicked"
    };
    function ContactView() {
      ContactView.__super__.constructor.call(this);
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
      return this.onFilterClicked("#contact-all-button", "/contacts/");
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
        if (this.selectedRow) {
          this.selectedRow.deselect();
        }
        row.select();
        return this.selectedRow = row;
      }
    };
    /* Functions */
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
      contactUrl = $("#contact-url-field").val();
      if (this.contacts.find(function(contact) {
        return contactUrl === contact.getUrl();
      })) {
        infoDialog.display("Contact is already in your list");
      } else {
        loadingIndicator.display();
        this.contacts.create({
          url: contactUrl
        }, {
          success: function(model, response) {
            return loadingIndicator.hide();
          },
          error: function(model, response) {
            loadingIndicator.hide();
            return infoDialog.display("An error occured on server." + "Please refresh the contact list.");
          }
        });
        $("#contact-url-field").val(null);
        $("#contact-url-field").focus();
      }
      return false;
    };
    ContactView.prototype.displayTutorial = function(index) {
      return $.get("/contact/tutorial/" + index + "/", function(data) {
        return $("#tutorial-contact").html(data);
      });
    };
    /* UI Builders */
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
      return $("#contact-request-button").click(function(event) {
        return contactApp.onRequestedClicked(event);
      });
    };
    ContactView.prototype.setWidgets = function() {
      $("#contact-all-button").button();
      $("#contact-pending-button").button();
      $("#contact-request-button").button();
      $("input#contact-post-button").button();
      $("#contact-a").addClass("disabled");
      $("#contact-all-button").button("option", "disabled", true);
      return this.lastFilterClicked = "#contact-all-button";
    };
    return ContactView;
  })();
  infoDialog = new InfoDialog;
  confirmationDialog = new ConfirmationDialog;
  loadingIndicator = new LoadingIndicator;
  contactApp = new ContactView;
  contactApp.setWidgets();
  contactApp.setListeners();
  contactApp.clearPostField();
  contactApp.fetch();
}).call(this);
