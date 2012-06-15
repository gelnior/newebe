(function() {
  var ConfirmationDialog, InfoDialog, LoadingIndicator, Note, NoteCollection, NoteRow, NotesController, NotesView, Row, confirmationDialog, convertUrlsToMarkdownLink, loadingIndicator, notesApp, notesController,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  convertUrlsToMarkdownLink = function(content) {
    var regexp, url, urlIndex, urls, _i, _len;
    regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g;
    urls = content.match(regexp);
    if (urls) {
      for (_i = 0, _len = urls.length; _i < _len; _i++) {
        url = urls[_i];
        urlIndex = content.indexOf(url);
        if (urlIndex === 0 || (content.charAt(urlIndex - 1) !== '(' && content.charAt(urlIndex - 1) !== "[")) {
          content = content.replace(url, "[" + url + "]" + "(" + url + ")");
        }
      }
    }
    return content;
  };

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

  Row = (function(_super) {

    __extends(Row, _super);

    function Row() {
      Row.__super__.constructor.apply(this, arguments);
    }

    Row.prototype.updatePreviewPosition = function() {
      var left, top;
      top = $("body").scrollTop();
      if (top > 50) {
        top = top + 20;
      } else {
        top = top + 60;
      }
      left = this.preview.offset().left;
      return this.preview.offset({
        left: left,
        top: top
      });
    };

    return Row;

  })(Backbone.View);

  $.putJson = function(options) {
    return $.ajax({
      type: "PUT",
      url: options.url,
      dataType: "json",
      data: JSON.stringify(options.body),
      success: options.success,
      error: options.error
    });
  };

  NotesController = (function(_super) {

    __extends(NotesController, _super);

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

  })(Backbone.Router);

  NoteRow = (function(_super) {

    __extends(NoteRow, _super);

    NoteRow.prototype.tagName = "div";

    NoteRow.prototype.className = "notes-note-row";

    NoteRow.prototype.template = _.template('<a class="notes-note-delete">X</a>\n<a class="notes-note-edit">edit</a>\n<input class="notes-note-title" type="text" value="<%= title %>" />\n<p class="news-micropost-date">\n <%= displayDate %> \n</p>\n<div class="spacer"></div>\n<textarea class="notes-note-content"><%= content%> </textarea>');

    /* Events
    */

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
      this.selected = false;
      this.preview = $("#notes-preview");
    }

    /* Listeners
    */

    NoteRow.prototype.onRowClicked = function(event) {
      return this.view.onRowClicked(this);
    };

    NoteRow.prototype.onMouseOver = function() {
      if (!this.selected) {
        this.titleField.addClass("mouseover");
        return $(this.el).addClass("mouseover");
      }
    };

    NoteRow.prototype.onMouseOut = function() {
      this.titleField.removeClass("mouseover");
      return $(this.el).removeClass("mouseover");
    };

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
      var _this = this;
      return confirmationDialog.display("Are you sure you want to delete this note ?", function() {
        confirmationDialog.hide();
        return _this.model["delete"]();
      });
    };

    /* Functions
    */

    NoteRow.prototype.select = function() {
      $(this.el).addClass("selected");
      this.titleField.addClass("selected");
      this.deleteButton.show();
      this.editButton.show();
      return this.selected = true;
    };

    NoteRow.prototype.unselect = function() {
      $(this.el).removeClass("selected");
      this.titleField.removeClass("selected");
      this.deleteButton.hide();
      this.editButton.hide();
      return this.selected = false;
    };

    NoteRow.prototype.focusTitle = function() {
      this.titleField.focus();
      return this.titleField.select();
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
      if (!this.model.getDisplayDate()) this.model.setDisplayDate();
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
      var _this = this;
      this.titleField.keyup(function(event) {
        return _this.onTitleKeyUp(event);
      });
      this.contentField.keyup(function(event) {
        return _this.onContentKeyUp(event);
      });
      this.$(".notes-note-row").click(function(event) {
        return _this.onRowClicked(event);
      });
      return this.el;
    };

    return NoteRow;

  })(Row);

  NotesView = (function(_super) {

    __extends(NotesView, _super);

    NotesView.prototype.el = $("#notes-list");

    /* Events
    */

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

    /* Listeners
    */

    NotesView.prototype.onNewNoteClicked = function(event) {
      var note, noteObject, now,
        _this = this;
      now = new Date().toString("yyyy-MM-ddTHH:mm:ssZ");
      noteObject = {
        "title": "New Note",
        "date": now,
        "lastModified": now,
        "content": ""
      };
      note = new Note(noteObject);
      loadingIndicator.display();
      return note.save("", {
        success: function(model, response) {
          var row;
          model.setId(response._id);
          row = _this.prependOne(note);
          _this.onRowClicked(row);
          row.focusTitle();
          return loadingIndicator.hide();
        }
      });
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

    /* Functions
    */

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
      var content, html;
      this.notePreviewer.html(null);
      content = convertUrlsToMarkdownLink(row.getContent());
      html = this.converter.makeHtml(content);
      this.notePreviewer.html(html);
      return row.updatePreviewPosition();
    };

    /* UI Builders
    */

    NotesView.prototype.setListeners = function() {
      var _this = this;
      $("#notes-new-button").click(function(event) {
        return notesApp.onNewNoteClicked(event);
      });
      $("#notes-sort-date-button").click(function(event) {
        return notesApp.onSortDateClicked(event);
      });
      $("#notes-sort-title-button").click(function(event) {
        return notesApp.onSortTitleClicked(event);
      });
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

  })(Backbone.View);

  Note = (function(_super) {

    __extends(Note, _super);

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

    /* Getters / Setters
    */

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

  })(Backbone.Model);

  NoteCollection = (function(_super) {

    __extends(NoteCollection, _super);

    function NoteCollection() {
      NoteCollection.__super__.constructor.apply(this, arguments);
    }

    NoteCollection.prototype.model = Note;

    NoteCollection.prototype.url = '/notes/all/';

    NoteCollection.prototype.parse = function(response) {
      return response.rows;
    };

    return NoteCollection;

  })(Backbone.Collection);

  notesController = new NotesController;

  notesApp = new NotesView(notesController);

  loadingIndicator = new LoadingIndicator;

  confirmationDialog = new ConfirmationDialog;

  notesApp.setWidgets();

  notesApp.setListeners();

  notesApp.reloadNotes();

  Backbone.history.start();

}).call(this);
