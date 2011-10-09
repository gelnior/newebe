(function() {
  var ConfirmationDialog, InfoDialog, LoadingIndicator, Note, NoteCollection, NoteRow, NotesController, NotesView, confirmationDialog, loadingIndicator, notesApp, notesController;
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
  NoteRow = (function() {
    __extends(NoteRow, Backbone.View);
    NoteRow.prototype.tagName = "div";
    NoteRow.prototype.className = "notes-note-row";
    NoteRow.prototype.template = _.template('<a class="notes-note-delete">X</a>\n<a class="notes-note-edit">edit</a>\n<input class="notes-note-title" type="text" value="<%= title %>" />\n<p class="news-micropost-date">\n <%= displayDate %> \n</p>\n<div class="spacer"></div>\n<textarea class="notes-note-content"><%= content%> </textarea>');
    /* Events */
    NoteRow.prototype.events = {
      "click .notes-note-delete": "onDeleteClicked",
      "click .notes-note-edit": "onEditClicked",
      "keyUp .notes-note-title": "onTitleKeyUp",
      "mouseover": "onMouseOver",
      "mouseout": "onMouseOut",
      "click": "onRowClicked"
    };
    function NoteRow(model) {
      this.model = model;
      NoteRow.__super__.constructor.call(this);
      this.id = this.model.id;
      this.model.view = this;
    }
    /* Listeners */
    NoteRow.prototype.onRowClicked = function(event) {
      return this.view.onRowClicked(this);
    };
    NoteRow.prototype.onMouseOver = function() {};
    NoteRow.prototype.onMouseOut = function() {};
    NoteRow.prototype.onTitleKeyUp = function(event) {
      this.model.setTitle(this.titleField.val());
      return this.model.save();
    };
    NoteRow.prototype.onContentKeyUp = function(event) {
      this.model.setContent(this.contentField.val());
      this.view.displayText(this);
      return this.model.save();
    };
    NoteRow.prototype.onEditClicked = function(event) {
      if (this.contentField.is(":hidden")) {
        this.contentField.slideDown();
        return this.contentField.focus();
      } else {
        return this.contentField.slideUp();
      }
    };
    NoteRow.prototype.onDeleteClicked = function() {
      return confirmationDialog.display("Are you sure you want to delete this note ?", __bind(function() {
        confirmationDialog.hide();
        return this.model["delete"]();
      }, this));
    };
    /* Functions */
    NoteRow.prototype.select = function() {
      $(this.el).addClass("selected");
      this.titleField.addClass("selected");
      this.deleteButton.show();
      return this.editButton.show();
    };
    NoteRow.prototype.unselect = function() {
      $(this.el).removeClass("selected");
      this.titleField.removeClass("selected");
      this.deleteButton.hide();
      return this.editButton.hide();
    };
    NoteRow.prototype.focusTitle = function() {
      return this.titleField.focus();
    };
    NoteRow.prototype.registerView = function(view) {
      return this.view = view;
    };
    NoteRow.prototype.getContent = function() {
      return this.contentField.val();
    };
    NoteRow.prototype.remove = function() {
      return $(this.el).remove();
    };
    NoteRow.prototype.render = function() {
      if (!this.model.getDisplayDate()) {
        this.model.setDisplayDate();
      }
      $(this.el).html(this.template(this.model.toJSON()));
      this.deleteButton = this.$(".notes-note-delete");
      this.editButton = this.$(".notes-note-edit");
      this.titleField = this.$(".notes-note-title");
      this.contentField = this.$(".notes-note-content");
      this.deleteButton.button();
      this.editButton.button();
      this.deleteButton.hide();
      this.editButton.hide();
      this.contentField.hide();
      return this.setListeners();
    };
    NoteRow.prototype.setListeners = function() {
      this.titleField.keyup(__bind(function(event) {
        return this.onTitleKeyUp(event);
      }, this));
      this.contentField.keyup(__bind(function(event) {
        return this.onContentKeyUp(event);
      }, this));
      this.$(".notes-note-row").click(__bind(function(event) {
        return this.onRowClicked(event);
      }, this));
      return this.el;
    };
    return NoteRow;
  })();
  NotesView = (function() {
    __extends(NotesView, Backbone.View);
    NotesView.prototype.el = $("#notes-list");
    /* Events */
    NotesView.prototype.events = {
      "click #notes-new-button": "onNewNoteClicked",
      "click #notes-sort-date-button": "onSortDateClicked",
      "click #notes-sort-title-button": "onSortTitleClicked"
    };
    function NotesView(controller) {
      this.onSortDateClicked = __bind(this.onSortDateClicked, this);      NotesView.__super__.constructor.call(this);
      this.controller = controller;
      controller.registerView(this);
    }
    NotesView.prototype.initialize = function() {
      _.bindAll(this, 'onNewNoteClicked');
      _.bindAll(this, 'onRowClicked');
      _.bindAll(this, 'onSortDateClicked');
      _.bindAll(this, 'onSortTitleClicked');
      _.bindAll(this, 'addAll');
      _.bindAll(this, 'appendOne');
      _.bindAll(this, 'prependOne');
      _.bindAll(this, 'reloadNotes');
      this.notes = new NoteCollection;
      this.converter = new Showdown.converter();
      this.notes.bind('add', this.prependOne);
      return this.notes.bind('reset', this.addAll);
    };
    /* Listeners  */
    NotesView.prototype.onNewNoteClicked = function(event) {
      var note, noteObject, now, row;
      now = new Date().toString("yyyy-MM-ddTHH:mm:ssZ");
      noteObject = {
        "title": "New Note",
        "date": now,
        "lastModified": now,
        "content": ""
      };
      note = new Note(noteObject);
      note.save("", {
        success: function(model, response) {
          return model.setId(response._id);
        }
      });
      row = this.prependOne(note);
      this.onRowClicked(row);
      row.focusTitle();
      return event;
    };
    NotesView.prototype.onRowClicked = function(row) {
      if (this.selection !== void 0 && this.selection !== row) {
        this.selection.unselect();
        row.select();
        this.selection = row;
      } else if (this.selection === void 0) {
        row.select();
        this.selection = row;
      }
      return this.displayText(this.selection);
    };
    NotesView.prototype.onSortDateClicked = function(event) {
      this.controller.navigate("notes/sort-date");
      this.sortNotesByDate();
      return false;
    };
    NotesView.prototype.onSortTitleClicked = function() {
      this.controller.navigate("notes/sort-title/");
      this.sortNotesByTitle();
      return false;
    };
    /* Functions  */
    NotesView.prototype.addAll = function() {
      this.notes.each(this.appendOne);
      return loadingIndicator.hide();
    };
    NotesView.prototype.appendOne = function(note) {
      var el, row;
      row = new NoteRow(note);
      row.registerView(this);
      el = row.render();
      $("#notes-list").append(el);
      return row;
    };
    NotesView.prototype.prependOne = function(note) {
      var el, row;
      row = new NoteRow(note);
      row.registerView(this);
      el = row.render();
      $("#notes-list").prepend(el);
      return row;
    };
    NotesView.prototype.displayTutorial = function(index) {
      return $.get("/notes/tutorial/" + index + "/", function(data) {
        return $("#tutorial-news").html(data);
      });
    };
    NotesView.prototype.sortNotesByDate = function() {
      if (!(this.dateButton.button("option", "disabled") === true)) {
        this.dateButton.button("disable");
        this.titleButton.button("enable");
        this.notePreviewer.html(null);
        this.notes.url = "/notes/all/order-by-date/";
        return this.reloadNotes();
      }
    };
    NotesView.prototype.sortNotesByTitle = function() {
      if (!(this.titleButton.button("option", "disabled") === true)) {
        this.titleButton.button("disable");
        this.dateButton.button("enable");
        this.notePreviewer.html(null);
        this.notes.url = "/notes/all/order-by-title/";
        return this.reloadNotes();
      }
    };
    NotesView.prototype.reloadNotes = function() {
      loadingIndicator.display();
      this.el.html(null);
      this.notes.fetch();
      return this.notes;
    };
    NotesView.prototype.displayText = function(row) {
      var html;
      this.notePreviewer.html(null);
      html = this.converter.makeHtml(row.getContent());
      return this.notePreviewer.html(html);
    };
    /* UI Builders  */
    NotesView.prototype.setListeners = function() {
      $("#notes-new-button").click(__bind(function(event) {
        return notesApp.onNewNoteClicked(event);
      }, this));
      $("#notes-sort-date-button").click(__bind(function(event) {
        return notesApp.onSortDateClicked(event);
      }, this));
      $("#notes-sort-title-button").click(__bind(function(event) {
        return notesApp.onSortTitleClicked(event);
      }, this));
      return this;
    };
    NotesView.prototype.setWidgets = function() {
      this.titleButton = $("#notes-sort-title-button");
      this.dateButton = $("#notes-sort-date-button");
      this.newButton = $("#notes-new-button");
      this.notePreviewer = $("#notes-preview");
      this.titleButton.button();
      this.dateButton.button();
      this.titleButton.button("disable");
      this.newButton.button();
      return $("#notes-a").addClass("disabled");
    };
    return NotesView;
  })();
  Note = (function() {
    __extends(Note, Backbone.Model);
    Note.prototype.url = '/notes/all/';
    function Note(note) {
      var content;
      Note.__super__.constructor.apply(this, arguments);
      this.id = note._id;
      this.set('noteId', note._id);
      this.set('author', note.author);
      this.set('title', note.title);
      this.set('date', note.date);
      this.set('content', note.content);
      this.set('lastModified', note.lastModified);
      content = note.content.replace(/<(?:.|\s)*?>/g, "");
      this.attributes['content'] = content;
      this.attributes['lastModified'] = note.lastModified;
      this.setDisplayDate();
      if (this.id) {
        this.url = "/notes/" + this.id + "/";
      } else {
        this.url = "/notes/all/";
      }
    }
    /* Getters / Setters */
    Note.prototype.setId = function(id) {
      this.id = id;
      return this.url = "/notes/" + this.id + "/";
    };
    Note.prototype.getDisplayDate = function() {
      return this.attributes['displayDate'];
    };
    Note.prototype.setDisplayDate = function() {
      var dateToSet;
      dateToSet = this.attributes["lastModified"];
      return this.setDisplayDateFromDbDate(dateToSet);
    };
    Note.prototype.setDisplayDateFromDbDate = function(date) {
      var displayDate, stringDate;
      displayDate = Date.parseExact(date, "yyyy-MM-ddTHH:mm:ssZ");
      stringDate = displayDate.toString("dd MMM yyyy, HH:mm");
      this.attributes['displayDate'] = stringDate;
      return stringDate;
    };
    Note.prototype.getAuthor = function() {
      return this.get('author');
    };
    Note.prototype.getTitle = function() {
      return this.get('title');
    };
    Note.prototype.setTitle = function(title) {
      this.attributes['title'] = title;
      return this.set('title', title);
    };
    Note.prototype.getDate = function() {
      return this.get('date');
    };
    Note.prototype.setDate = function(date) {
      return this.set('title', date);
    };
    Note.prototype.getContent = function() {
      return this.get('content');
    };
    Note.prototype.setContent = function(content) {
      this.attributes['content'] = content;
      return this.set('content', content);
    };
    Note.prototype["delete"] = function() {
      this.url = "/notes/" + this.id + "/";
      this.destroy();
      return this.view.remove();
    };
    Note.prototype.isNew = function() {
      return !this.id;
    };
    return Note;
  })();
  NoteCollection = (function() {
    __extends(NoteCollection, Backbone.Collection);
    function NoteCollection() {
      NoteCollection.__super__.constructor.apply(this, arguments);
    }
    NoteCollection.prototype.model = Note;
    NoteCollection.prototype.url = '/notes/all/';
    NoteCollection.prototype.parse = function(response) {
      return response.rows;
    };
    return NoteCollection;
  })();
  NotesController = (function() {
    __extends(NotesController, Backbone.Router);
    function NotesController() {
      NotesController.__super__.constructor.apply(this, arguments);
    }
    NotesController.prototype.routes = {
      "notes/sort-date/": "sortByDate",
      "notes/sort-title/": "sortByTitle",
      "notes/sort-date/:slug": "sortByDateAndDisplayNote",
      "notes/sort-title/:slug": "sortByTitleAndDisplayNote"
    };
    NotesController.prototype.registerView = function(view) {
      return this.view = view;
    };
    NotesController.prototype.sortByDate = function() {
      alert("ok");
      return this.view.sortNotesByDate();
    };
    NotesController.prototype.sortByTitle = function() {
      return this.view.sortNotesByTitle();
    };
    NotesController.prototype.sortByDateAndDisplayNote = function(slug) {
      return this.view.sortNotesByDate();
    };
    NotesController.prototype.sortByTitleAndDisplayNote = function(slug) {
      return this.view.sortNotesByTitle();
    };
    return NotesController;
  })();
  notesController = new NotesController;
  notesApp = new NotesView(notesController);
  loadingIndicator = new LoadingIndicator;
  confirmationDialog = new ConfirmationDialog;
  notesApp.setWidgets();
  notesApp.setListeners();
  notesApp.reloadNotes();
  Backbone.history.start();
}).call(this);
