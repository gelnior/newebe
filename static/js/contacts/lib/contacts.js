(function() {
  /* Model for a single Contact
  */  var Contact, ContactCollection, ContactRow, ContactView, contactApp;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Contact = function() {
    __extends(Contact, Backbone.Model);
    Contact.prototype.url = '/platform/contacts/';
    function Contact(contact) {
      Contact.__super__.constructor.apply(this, arguments);
      this.set('url', contact.url);
      this.id = contact.slug + "/";
      if (contact.state) {
        this.set('state', contact.state);
      }
    }
    Contact.prototype.getUrl = function() {
      return this.get('url');
    };
    Contact.prototype.getState = function() {
      return this.get('state');
    };
    Contact.prototype["delete"] = function() {
      this.url = '/platform/contacts/' + this.id;
      this.destroy();
      return this.view.remove();
    };
    Contact.prototype.saveToDb = function() {
      this.url = '/platform/contacts/' + this.id;
      this.save();
      return this.url;
    };
    Contact.prototype.isNew = function() {
      return !this.getState();
    };
    return Contact;
  }();
  /* Model for a Micro Post collection
  */
  ContactCollection = function() {
    function ContactCollection() {
      ContactCollection.__super__.constructor.apply(this, arguments);
    }
    __extends(ContactCollection, Backbone.Collection);
    ContactCollection.prototype.model = Contact;
    ContactCollection.prototype.url = '/platform/contacts/';
    ContactCollection.prototype.comparator = function(contact) {
      return contact.getUrl();
    };
    ContactCollection.prototype.parse = function(response) {
      return response.rows;
    };
    return ContactCollection;
  }();
  /* ContactRow is the widget representation of a Contact instance.
  */
  ContactRow = function() {
    __extends(ContactRow, Backbone.View);
    ContactRow.prototype.tagName = "div";
    ContactRow.prototype.className = "platform-contact-row";
    ContactRow.prototype.template = _.template('<span class="platform-contact-row-buttons">\n<% if (state === "Wait for approval") { %>\n  <a class="platform-contact-wap">Confim</a>\n<% } else if (state !== "Trusted") { %>\n  <a class="platform-contact-resend">Resend</a>\n<% } %>\n<a class="platform-contact-delete">X</a>    \n</span>\n<p class="platform-contact-url">\n <%= url %> \n <span> (<%= state %>)</span>\n</p>');
    ContactRow.prototype.events = {
      "click .platform-contact-delete": "onDeleteClicked",
      "click .platform-contact-wap": "onConfirmClicked",
      "mouseover": "onMouseOver",
      "mouseout": "onMouseOut"
    };
    function ContactRow(model) {
      this.model = model;
      ContactRow.__super__.constructor.apply(this, arguments);
      this.model.view = this;
    }
    ContactRow.prototype.onMouseOver = function() {
      return this.$(".platform-contact-row-buttons").show();
    };
    ContactRow.prototype.onMouseOut = function() {
      return this.$(".platform-contact-row-buttons").hide();
    };
    ContactRow.prototype.onDeleteClicked = function() {
      return this.model["delete"]();
    };
    ContactRow.prototype.onConfirmClicked = function() {
      return this.model.saveToDb();
    };
    ContactRow.prototype.remove = function() {
      return $(this.el).remove();
    };
    ContactRow.prototype.render = function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.$(".platform-contact-delete").button();
      this.$(".platform-contact-resend").button();
      this.$(".platform-contact-wap").button();
      this.$(".platform-contact-row-buttons").hide();
      return this.el;
    };
    return ContactRow;
  }();
  /* Main view for contact application
  */
  ContactView = function() {
    __extends(ContactView, Backbone.View);
    ContactView.prototype.el = $("#news");
    ContactView.prototype.isCtrl = false;
    ContactView.prototype.events = {
      "click #contact-post-button": "onPostClicked",
      "submit #contact-post-button": "onPostClicked",
      "click #contact-alm-button": "onAllClicked",
      "click #contact-pending-button": "onPendingClicked",
      "click #contact-request-button": "onRequestClicked"
    };
    function ContactView() {
      ContactView.__super__.constructor.apply(this, arguments);
    }
    ContactView.prototype.initialize = function() {
      _.bindAll(this, 'postNewContact', 'appendOne', 'prependOne', 'addAll');
      _.bindAll(this, 'onPostClicked');
      this.contacts = new ContactCollection;
      this.contacts.bind('add', this.prependOne);
      return this.contacts.bind('refresh', this.addAll);
    };
    /* Events
    */
    ContactView.prototype.onKeyUp = function(event) {
      if (event.keyCode === 17) {
        this.isCtrl = false;
      }
      return event;
    };
    ContactView.prototype.onKeyDown = function(event) {
      if (event.keyCode === 17) {
        this.isCtrl = true;
      }
      if (event.keyCode === 13 && this.isCtrl) {
        this.isCtrl = false;
        this.postNewContact();
      }
      return event;
    };
    ContactView.prototype.onPostClicked = function(event) {
      event.preventDefault();
      this.postNewContact();
      return event;
    };
    ContactView.prototype.onAllClicked = function(event) {
      event.preventDefault();
      return this.reloadContacts("/platform/contacts/");
    };
    ContactView.prototype.onPendingClicked = function(event) {
      event.preventDefault();
      return this.reloadContacts("/platform/contacts/pending/");
    };
    ContactView.prototype.onRequestClicked = function(event) {
      event.preventDefault();
      return this.reloadContacts("/platform/contacts/requested/");
    };
    ContactView.prototype.reloadContacts = function(url) {
      this.clearContacts();
      this.contacts.url = url;
      this.contacts.fetch();
      return this.contacts;
    };
    /* Functions
    */
    ContactView.prototype.clearContacts = function() {
      return $("#contacts").empty();
    };
    ContactView.prototype.addAll = function() {
      this.contacts.each(this.appendOne);
      return this.contacts;
    };
    ContactView.prototype.appendOne = function(contact) {
      var el, row;
      row = new ContactRow(contact);
      el = row.render();
      $("#contacts").prepend(el);
      return row;
    };
    ContactView.prototype.prependOne = function(contact) {
      var el, row;
      row = new ContactRow(contact);
      el = row.render();
      $("#contacts").prepend(el);
      return row;
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
      this.contacts.create({
        url: $("#contact-url-field").val()
      });
      $("#contact-url-field").val(null);
      $("#contact-url-field").focus();
      return false;
    };
    /* UI Builders
    */
    ContactView.prototype.setListeners = function() {
      $("#contact-url-field").keyup(function(event) {
        return contactApp.onKeyUp(event);
      });
      $("#contact-url-field").keydown(function(event) {
        return contactApp.onKeyDown(event);
      });
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
        return contactApp.onRequestClicked(event);
      });
    };
    ContactView.prototype.setWidgets = function() {
      $("#contact-all-button").button();
      $("#contact-pending-button").button();
      $("#contact-request-button").button();
      $("input#contact-post-button").button();
      return $("#contact-a").addClass("disabled");
    };
    return ContactView;
  }();
  /* Contact application entry point
  */
  contactApp = new ContactView;
  contactApp.setWidgets();
  contactApp.setListeners();
  contactApp.clearPostField();
  contactApp.fetch();
}).call(this);
