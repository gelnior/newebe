(function() {
  var ConfirmationDialog, DocumentSelector, InfoDialog, LoadingIndicator, MicroPost, MicroPostCollection, MicroPostRow, NewsView, Row, confirmationDialog, infoDialog, loadingIndicator, newsApp, selectorDialog, updater,
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

  DocumentSelector = (function() {

    function DocumentSelector() {
      this.onDatePicked = __bind(this.onDatePicked, this);      if ($("#document-selector") === void 0 || $("#document-selector").length === 0) {
        this.createWidget();
        this.setListeners();
      } else {
        this.element = $("#document-selector");
      }
      this.docList = $("#document-selector-list");
      this.element.hide();
    }

    DocumentSelector.prototype.createWidget = function() {
      var div;
      div = document.createElement('div');
      div.id = "document-selector";
      div.className = "dialog";
      $("body").prepend(div);
      this.element = $("#document-selector");
      return this.element.html('<div id="document-selector-buttons" class="dialog-buttons">\n  <span id="document-selector-select">Select</span>\n  <span id="document-selector-cancel">Cancel</span>\n</div>\n<div id="document-selector-toolbar">\n<div class="document-selector-select-wrapper">\n<select id="document-selector-type">\n    <option label="Note" value="1">Note</option>\n    <option label="Picture" value="1">Picture</option>\n</select>\n</div>\n<span id="document-selector-datepicker-label">until </span>\n<input type="text" id="document-selector-datepicker" />\n</div>\n<div id="document-selector-list">\n</div>');
    };

    DocumentSelector.prototype.setListeners = function() {
      var _this = this;
      $("#document-selector-datepicker").datepicker({
        onSelect: this.onDatePicked
      });
      $("#document-selector-datepicker").hide();
      $("#document-selector-datepicker-label").hide();
      $("#document-selector-cancel").click(function() {
        return _this.element.fadeOut(400);
      });
      return $("#document-selector-type").change(function(event) {
        var type;
        type = $("#document-selector-type :selected").text();
        if (type === "Picture") {
          $("#document-selector-datepicker").show();
          $("#document-selector-datepicker-label").show();
          return _this.loadPictures();
        } else if (type === "Note") {
          $("#document-selector-datepicker").hide();
          $("#document-selector-datepicker-label").hide();
          return _this.loadNotes();
        }
      });
    };

    DocumentSelector.prototype.display = function(callback) {
      this.setSelectDocListener(callback);
      $("#document-selector-type").val("Note");
      this.loadNotes();
      return this.element.fadeIn(400);
    };

    DocumentSelector.prototype.setSelectDocListener = function(callback) {
      var _this = this;
      if (this.fun !== void 0) {
        $("#document-selector-select").unbind("click", this.fun);
      }
      this.fun = function(event) {
        if ($("#document-selector-list .selected")) {
          callback({
            id: $("#document-selector-list .selected")[0].id,
            type: $("#document-selector-type :selected").text()
          });
        }
        return _this.element.fadeOut(400);
      };
      return $("#document-selector-select").click(this.fun);
    };

    DocumentSelector.prototype.onDatePicked = function(dateText, event) {
      var d, sinceDate,
        _this = this;
      d = Date.parse(dateText);
      sinceDate = d.toString("yyyy-MM-dd");
      return $.get("/pictures/all/" + sinceDate + "-00-00-00/html/", function(data) {
        _this.docList.html(data);
        _this.setupList("picture-row");
        if (typeof callback !== "undefined" && callback !== null) {
          return callback();
        }
      });
    };

    DocumentSelector.prototype.loadNotes = function() {
      var _this = this;
      return $.get("/notes/all/html/", function(data) {
        _this.docList.html(data);
        _this.setupList("note-row");
        return _this.element.fadeIn(400);
      });
    };

    DocumentSelector.prototype.loadPictures = function() {
      var _this = this;
      return $.get("/pictures/all/html/", function(data) {
        _this.docList.html(data);
        return _this.setupList("picture-row");
      });
    };

    DocumentSelector.prototype.setupList = function(className) {
      var selected;
      $("." + className).mouseenter(function(event) {
        return $(this).addClass("mouseover mouseover-dialog");
      });
      $("." + className).mouseleave(function(event) {
        return $(this).removeClass("mouseover mouseover-dialog");
      });
      selected = null;
      return $("." + className).click(function(event) {
        if (selected) selected.removeClass("selected selected-dialog");
        $(this).addClass("selected selected-dialog");
        return selected = $(this);
      });
    };

    return DocumentSelector;

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

  MicroPostRow = (function(_super) {

    __extends(MicroPostRow, _super);

    MicroPostRow.prototype.tagName = "div";

    MicroPostRow.prototype.className = "news-micropost-row";

    MicroPostRow.prototype.template = _.template('<a href="#" class="news-micropost-author"><%= author %></a>\n<%= contentHtml %>\n<p class="news-micropost-date">\n <%= displayDate %>     \n</p>\n<p></p>\n<% if (isNoteAttached) { %>\n    <img src="/static/images/note.png" alt="A note is attached" />\n<% } %>\n<% if (isPictureAttached) { %>\n    <img src="/static/images/picture.png" alt="A picture is attached" />\n<% } %>');

    /* Events
    */

    MicroPostRow.prototype.events = {
      "mouseover": "onMouseOver",
      "mouseout": "onMouseOut",
      "click": "onClick"
    };

    function MicroPostRow(model, mainView) {
      this.model = model;
      this.mainView = mainView;
      this.appendPicture = __bind(this.appendPicture, this);
      this.renderMicropost = __bind(this.renderMicropost, this);
      this.onPushNoteClicked = __bind(this.onPushNoteClicked, this);
      this.onDeleteClicked = __bind(this.onDeleteClicked, this);
      MicroPostRow.__super__.constructor.call(this);
      this.id = this.model.id;
      this.model.view = this;
      this.selected = false;
      this.preview = $("#news-preview");
    }

    /* Listeners
    */

    MicroPostRow.prototype.onMouseOver = function() {
      if (!this.selected) return $(this.el).addClass("mouseover");
    };

    MicroPostRow.prototype.onMouseOut = function() {
      return $(this.el).removeClass("mouseover");
    };

    MicroPostRow.prototype.onClick = function() {
      return this.mainView.onRowClicked(this);
    };

    MicroPostRow.prototype.onDeleteClicked = function() {
      var _this = this;
      return confirmationDialog.display("Are you sure you want to delete this post ?", function() {
        confirmationDialog.hide();
        _this.model["delete"]();
        _this.mainView.selectedRow = null;
        return _this.clearPreview();
      });
    };

    MicroPostRow.prototype.onPushNoteClicked = function() {
      var _this = this;
      return selectorDialog.display(function(noteData) {
        loadingIndicator.display();
        return $.get("/notes/" + noteData.id + "/", function(note) {
          note.content = note.content + "\n\n" + _this.model.getContent();
          return $.putJson({
            url: "/notes/" + noteData.id + "/",
            body: note,
            success: function() {
              infoDialog.display("note successfully updated");
              return loadingIndicator.hide();
            },
            error: function() {
              infoDialog.display("note update failed");
              return loadingIndicator.hide();
            }
          });
        });
      });
    };

    /* Functions
    */

    MicroPostRow.prototype.remove = function() {
      return $(this.el).remove();
    };

    MicroPostRow.prototype.render = function() {
      if (!this.model.getDisplayDate()) this.model.setDisplayDate();
      $(this.el).html(this.template(this.model.toJSON()));
      return this.el;
    };

    MicroPostRow.prototype.clearPreview = function() {
      return $("#news-preview").html(null);
    };

    MicroPostRow.prototype.select = function() {
      var _this = this;
      $(this.el).removeClass("mouseover");
      $(this.el).addClass("selected");
      $("#news-preview").html(null);
      return this.renderMicropost(function() {
        _this.checkForAttachments();
        _this.checkForVideo();
        _this.checkForImage();
        return _this.updatePreviewPosition();
      });
    };

    MicroPostRow.prototype.deselect = function() {
      this.$(".news-micropost-delete").hide();
      $(this.el).removeClass("selected");
      return this.clearPreview();
    };

    MicroPostRow.prototype.renderMicropost = function(callback) {
      var _this = this;
      return $.get("/microposts/" + this.model.id + "/html/", function(data) {
        _this.preview.append(data);
        $("#news-preview").append('<p class="micropost-buttons button-bar">\n  <a class="micropost-note-button">push to note</a>\n  <a class="micropost-delete-button">delete</a>\n</p>');
        $(".micropost-buttons a").button();
        $(".micropost-note-button").click(_this.onPushNoteClicked);
        $(".micropost-delete-button").click(_this.onDeleteClicked);
        return callback();
      });
    };

    MicroPostRow.prototype.checkForAttachments = function() {
      var doc, docs, _i, _len, _ref, _results;
      docs = this.model.attachments;
      if ((this.model.attachments != null) && this.model.attachments.length > 0) {
        this.preview.append("<p class=\"attach-title\">attachments</p>");
      }
      _ref = this.model.attachments;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        doc = _ref[_i];
        if (doc.doc_type === "Note") {
          _results.push(this.appendNote(doc));
        } else if (doc.doc_type === "Picture") {
          _results.push(this.appendPicture(doc));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    MicroPostRow.prototype.appendNote = function(doc) {
      var converter;
      converter = new Showdown.converter();
      this.preview.append("<p class=\"note-title\"><strong>note: " + doc.title + "</strong></p>");
      this.preview.append(converter.makeHtml(doc.content));
      return this.preview.append("<hr />");
    };

    MicroPostRow.prototype.appendPicture = function(doc) {
      var picture, slugDate,
        _this = this;
      this.preview.append("<p class=\"image-name\"><strong>picture: " + doc.path + "</strong></p>");
      slugDate = doc.date.replace(/:/g, "-");
      this.preview.append("<img id=\"attach-picture-" + slugDate + "\"  />");
      picture = $("#attach-picture-" + slugDate);
      picture.load().error(function() {
        var downloadButton;
        picture.hide();
        _this.preview.append("<a id=\"attach-picture-button-" + slugDate + "\">Download</a>");
        downloadButton = $("#attach-picture-button-" + slugDate);
        downloadButton.button();
        return downloadButton.click(function() {
          loadingIndicator.display();
          return _this.model.downloadFile(doc, {
            success: function(data) {
              if (data.success != null) {
                picture.attr("src", "/microposts/" + _this.model.id + "/attach/" + doc.path);
                downloadButton.hide();
                picture.show();
              }
              return loadingIndicator.hide();
            },
            error: function() {
              loadingIndicator.hide();
              return alert("A server error occured.");
            }
          });
        });
      });
      picture.attr("src", "/microposts/" + this.model.id + "/attach/" + doc.path);
      return this.preview.append("<hr />");
    };

    MicroPostRow.prototype.checkForVideo = function() {
      var content, key, regexp, res, url, urls, _i, _len, _results;
      regexp = /\[.+\]\((http|https):\/\/\S*youtube.com\/watch\?v=\S+\)/g;
      content = this.model.get("content");
      urls = content.match(regexp);
      if (urls) {
        $("#news-preview").append("<p>Embedded videos: </p>");
        _results = [];
        for (_i = 0, _len = urls.length; _i < _len; _i++) {
          url = urls[_i];
          url = this.getUrlFromMarkdown(url);
          res = url.match(/v=\S+&/);
          if (res != null) key = res[0];
          if (!key) {
            res = url.match(/v=\S+/);
            if (res != null) key = res[0];
          }
          if (key) {
            if (key.indexOf("&") > 0) {
              key = key.substring(2, key.length - 1);
            } else {
              key = key.substring(2, key.length);
            }
            this.preview.append("<p>\n  <iframe width=\"100%\" height=\"315\" \n    src=\"http://www.youtube.com/embed/" + key + "\" \n    frameborder=\"0\" allowfullscreen>\n  </iframe>\n</p>");
            _results.push(this.preview.append("<hr />"));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    MicroPostRow.prototype.checkForImage = function() {
      var content, regexp, url, urls, _i, _len, _results;
      regexp = /\[.+\]\((http|https):\/\/\S+\.(jpg|png|gif)\)/g;
      content = this.model.get("content");
      urls = content.match(regexp);
      if (urls) {
        $("#news-preview").append("<p>Embedded pictures: </p>");
        _results = [];
        for (_i = 0, _len = urls.length; _i < _len; _i++) {
          url = urls[_i];
          url = this.getUrlFromMarkdown(url);
          if (url) {
            this.preview.append("<p>\n<img style=\"max-width: 100%;\"\n     src=\"" + url + "\"\n     alt=\"Image " + url + "\" />\n</img>\n</p>");
            _results.push(this.preview.append("<hr />"));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    MicroPostRow.prototype.getUrlFromMarkdown = function(markdownLink) {
      var index;
      index = markdownLink.indexOf("(");
      return markdownLink.substring(index + 1, markdownLink.length - 1);
    };

    return MicroPostRow;

  })(Row);

  NewsView = (function(_super) {

    __extends(NewsView, _super);

    NewsView.prototype.el = $("#news");

    NewsView.prototype.isCtrl = false;

    /* Events
    */

    NewsView.prototype.events = {
      "click #news-post-button": "onPostClicked",
      "click #news-attach-button": "onAttachClicked",
      "click #news-my-button": "onMineClicked",
      "click #news-all-button": "onAllClicked",
      "click #news-more": "onMoreNewsClicked"
    };

    function NewsView() {
      NewsView.__super__.constructor.call(this);
    }

    NewsView.prototype.initialize = function() {
      _.bindAll(this, 'postNewPost', 'appendOne', 'prependOne', 'addAll');
      _.bindAll(this, 'displayMyNews', 'onMoreNewsClicked', 'addAllMore');
      _.bindAll(this, 'onDatePicked');
      this.tutorialOn = true;
      this.microposts = new MicroPostCollection;
      this.microposts.bind('add', this.prependOne);
      this.microposts.bind('reset', this.addAll);
      this.moreMicroposts = new MicroPostCollection;
      this.moreMicroposts.bind('reset', this.addAllMore);
      this.currentPath = '/microposts/all/';
      this.selectedRow = null;
      return this.attachments = [];
    };

    /* Listeners
    */

    NewsView.prototype.onKeyUp = function(event) {
      if (event.keyCode === 17) this.isCtrl = false;
      return event;
    };

    NewsView.prototype.onKeyDown = function(event) {
      if (event.keyCode === 17) this.isCtrl = true;
      if (event.keyCode === 13 && this.isCtrl) {
        this.isCtrl = false;
        this.postNewPost();
      }
      return event;
    };

    NewsView.prototype.onPostClicked = function(event) {
      event.preventDefault();
      this.postNewPost();
      return event;
    };

    NewsView.prototype.onAttachClicked = function(event) {
      var _this = this;
      return selectorDialog.display(function(attachment) {
        _this.attachments.push(attachment);
        if (attachment.type === "Note") {
          return $("#news-attach-note-image").show();
        } else {
          return $("#news-attach-picture-image").show();
        }
      });
    };

    NewsView.prototype.onMineClicked = function(event) {
      $("#news-my-button").button("disable");
      $("#news-all-button").button("enable");
      this.clearNews(null);
      $("#news-from-datepicker").val(null);
      this.currentPath = '/microposts/mine/';
      this.reloadMicroPosts(null);
      return event;
    };

    NewsView.prototype.onAllClicked = function(event) {
      $("#news-all-button").button("disable");
      $("#news-my-button").button("enable");
      this.clearNews(null);
      $("#news-from-datepicker").val(null);
      this.currentPath = '/microposts/all/';
      this.reloadMicroPosts(null);
      return event;
    };

    NewsView.prototype.onDatePicked = function(dateText, event) {
      var d, sinceDate;
      d = Date.parse(dateText);
      sinceDate = d.toString("yyyy-MM-dd");
      this.clearNews();
      return this.reloadMicroPosts(sinceDate);
    };

    NewsView.prototype.onRowClicked = function(row) {
      if (row !== this.selectedRow) {
        if (this.selectedRow) this.selectedRow.deselect();
        row.select();
        return this.selectedRow = row;
      }
    };

    NewsView.prototype.onMoreNewsClicked = function() {
      loadingIndicator.display();
      if (this.lastDate) {
        this.moreMicroposts.url = this.currentPath + this.lastDate;
      } else {
        this.moreMicroposts.url = this.currentPath;
      }
      this.moreMicroposts.fetch();
      return this.moreMicroposts;
    };

    /* Functions
    */

    NewsView.prototype.clearNews = function() {
      $("#micro-posts").empty();
      return $("#news-more").show();
    };

    NewsView.prototype.addAllMore = function() {
      var microPostsArray;
      microPostsArray = this.moreMicroposts.toArray().reverse();
      microPostsArray = _.rest(microPostsArray);
      _.each(microPostsArray, this.appendOne);
      this.lastDate = this.moreMicroposts.last().getUrlDate();
      if (microPostsArray.length < 10) $("#news-more").hide();
      loadingIndicator.hide();
      return this.lastDate;
    };

    NewsView.prototype.addAll = function() {
      if (this.microposts.length > 0) {
        this.tutorialOn = false;
        this.lastDate = this.microposts.first().getUrlDate();
        if (this.microposts.length < 10) $("#news-more").hide();
      } else {
        if (this.tutorialOn) {
          this.displayTutorial(1);
        } else {
          $("#tutorial").html(null);
        }
        $("#news-more").hide();
      }
      this.microposts.each(this.prependOne);
      loadingIndicator.hide();
      return this.microposts.length;
    };

    NewsView.prototype.appendOne = function(micropost) {
      var el, row;
      row = new MicroPostRow(micropost, this);
      el = row.render();
      $("#micro-posts").append(el);
      return row;
    };

    NewsView.prototype.prependOne = function(micropost) {
      var el, row;
      row = new MicroPostRow(micropost, this);
      el = row.render();
      $("#micro-posts").prepend(el);
      loadingIndicator.hide();
      if (this.tutorialOn) {
        this.displayTutorial(2);
        this.tutorialOn = false;
      }
      return row;
    };

    NewsView.prototype.displayTutorial = function(index) {
      return $.get("/microposts/tutorial/" + index + "/", function(data) {
        return $("#tutorial-news").html(data);
      });
    };

    NewsView.prototype.clearPostField = function() {
      $("#id_content").val(null);
      $("#id_content").focus();
      return $("#id_content");
    };

    NewsView.prototype.reloadMicroPosts = function(date, path) {
      loadingIndicator.display();
      this.selectedRow = null;
      this.microposts.url = this.currentPath;
      if (date) this.microposts.url = this.currentPath + date + '-23-59-00/';
      this.microposts.fetch();
      return this.microposts;
    };

    NewsView.prototype.fetch = function() {
      this.selectedRow = null;
      this.microposts.fetch();
      return this.microposts;
    };

    NewsView.prototype.postNewPost = function() {
      var content,
        _this = this;
      content = $("#id_content").val();
      if (content) {
        loadingIndicator.display();
        content = this.convertUrlToMarkdownLink(content);
        this.microposts.create({
          content: content,
          attachments: this.attachments
        }, {
          success: function(nextModel, resp) {
            loadingIndicator.hide();
            nextModel.view.el.id = resp._id;
            nextModel.id = resp._id;
            nextModel.attachments = resp.attachments;
            $("#news-attach-note-image").hide();
            $("#news-attach-picture-image").hide();
            return _this.attachments = [];
          },
          error: function() {
            infoDialog.display("An error occured micropost was not posted.");
            return loadingIndicator.hide();
          }
        });
        $("#id_content").val(null);
        return $("#id_content").focus();
      }
    };

    NewsView.prototype.convertUrlToMarkdownLink = function(content) {
      var regexp, url, urlIndex, urls, _i, _len;
      regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g;
      urls = content.match(regexp);
      if (urls) {
        for (_i = 0, _len = urls.length; _i < _len; _i++) {
          url = urls[_i];
          urlIndex = content.indexOf(url);
          if (urlIndex === 0 || content.charAt(urlIndex - 1) !== '(') {
            content = content.replace(url, "[" + url + "]" + "(" + url + ")");
          }
        }
      }
      return content;
    };

    NewsView.prototype.onMoreNewsClicked = function() {
      loadingIndicator.display();
      if (this.lastDate) {
        this.moreMicroposts.url = this.currentPath + this.lastDate;
      } else {
        this.moreMicroposts.url = this.currentPath;
      }
      this.moreMicroposts.fetch();
      return this.moreMicroposts;
    };

    /* UI Builders
    */

    NewsView.prototype.setListeners = function() {
      $("#id_content").keyup(function(event) {
        return newsApp.onKeyUp(event);
      });
      $("#id_content").keydown(function(event) {
        return newsApp.onKeyDown(event);
      });
      return $("input#news-from-datepicker").datepicker({
        onSelect: this.onDatePicked
      });
    };

    NewsView.prototype.setWidgets = function() {
      $("#news-post-button").button();
      $("#news-attach-button").button();
      $("#news-my-button").button();
      $("#news-all-button").button();
      $("#news-all-button").button("disable");
      $("#news-more").button();
      $("#news-from-datepicker").val(null);
      $("#news-a").addClass("disabled");
      $("#news-attach-note-image").hide();
      return $("#news-attach-picture-image").hide();
    };

    return NewsView;

  })(Backbone.View);

  MicroPost = (function(_super) {

    __extends(MicroPost, _super);

    MicroPost.prototype.url = '/microposts/all/';

    function MicroPost(microPost) {
      var content, converter, doc, html, postDate, urlDate, _i, _len, _ref;
      MicroPost.__super__.constructor.apply(this, arguments);
      this.set('author', microPost.author);
      this.set('authorKey', microPost.authorKey);
      this.set('micropostId', microPost._id);
      this.set('content', microPost.content);
      this.attachments = microPost.attachments;
      this.id = microPost._id;
      content = microPost.content.replace(/<(?:.|\s)*?>/g, "");
      converter = new Showdown.converter();
      html = converter.makeHtml(content);
      this.set('contentHtml', html);
      this.attributes['contentHtml'] = html;
      if (microPost.date) {
        postDate = Date.parseExact(microPost.date, "yyyy-MM-ddTHH:mm:ssZ");
        urlDate = postDate.toString("yyyy-MM-dd-HH-mm-ss/");
        this.attributes['urlDate'] = urlDate;
      }
      this.attributes["isNoteAttached"] = false;
      this.attributes["isPictureAttached"] = false;
      _ref = this.attachments;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        doc = _ref[_i];
        if (doc.doc_type === "Note") {
          this.attributes["isNoteAttached"] = true;
        } else {
          this.attributes["isPictureAttached"] = true;
        }
      }
    }

    /* Getters / Setters
    */

    MicroPost.prototype.getDisplayDate = function() {
      return this.attributes['displayDate'];
    };

    MicroPost.prototype.setDisplayDate = function() {
      var dateToSet;
      dateToSet = this.attributes["date"];
      return this.setDisplayDateFromDbDate(dateToSet);
    };

    MicroPost.prototype.setDisplayDateFromDbDate = function(date) {
      var postDate, stringDate;
      if (date) {
        postDate = Date.parseExact(date, "yyyy-MM-ddTHH:mm:ssZ");
        stringDate = postDate.toString("dd MMM yyyy, HH:mm");
        this.attributes['displayDate'] = stringDate;
        postDate;
      }
      return date;
    };

    MicroPost.prototype.getUrlDate = function() {
      return this.attributes['urlDate'];
    };

    MicroPost.prototype.getAuthor = function() {
      return this.get('author');
    };

    MicroPost.prototype.getAuthorKey = function() {
      return this.get('authorKey');
    };

    MicroPost.prototype.getDate = function() {
      return this.get('date');
    };

    MicroPost.prototype.getContent = function() {
      return this.get('content');
    };

    MicroPost.prototype["delete"] = function() {
      this.url = "/microposts/" + this.id + "/";
      this.destroy();
      return this.view.remove();
    };

    MicroPost.prototype.isNew = function() {
      return !this.getAuthor();
    };

    MicroPost.prototype.downloadFile = function(doc, callbacks) {
      return $.ajax({
        type: "POST",
        url: "/microposts/" + this.id + "/attach/download/",
        contentType: "application/json",
        data: JSON.stringify(doc),
        success: callbacks.success,
        error: callbacks.error
      });
    };

    return MicroPost;

  })(Backbone.Model);

  MicroPostCollection = (function(_super) {

    __extends(MicroPostCollection, _super);

    function MicroPostCollection() {
      MicroPostCollection.__super__.constructor.apply(this, arguments);
    }

    MicroPostCollection.prototype.model = MicroPost;

    MicroPostCollection.prototype.url = '/microposts/all/';

    MicroPostCollection.prototype.comparator = function(microPost) {
      return microPost.getDate();
    };

    MicroPostCollection.prototype.parse = function(response) {
      return response.rows;
    };

    return MicroPostCollection;

  })(Backbone.Collection);

  newsApp = new NewsView;

  infoDialog = new InfoDialog;

  loadingIndicator = new LoadingIndicator;

  confirmationDialog = new ConfirmationDialog;

  selectorDialog = new DocumentSelector;

  newsApp.setWidgets();

  newsApp.setListeners();

  newsApp.clearPostField();

  newsApp.fetch();

  updater = {
    errorSleepTime: 500,
    cursor: null,
    poll: function() {
      return $.ajax({
        url: "/microposts/suscribe/",
        type: "GET",
        dataType: "text",
        success: updater.onSuccess,
        error: updater.onError
      });
    },
    onSuccess: function(response) {
      var micropost;
      try {
        if (response) {
          micropost = new MicroPost(eval('(' + response + ')'));
          newsApp.prependOne(micropost);
        }
      } catch (e) {
        updater.onError();
        return;
      }
      updater.errorSleepTime = 500;
      return window.setTimeout(updater.poll, updater.errorSleepTime);
    },
    onError: function(response) {
      updater.errorSleepTime *= 2;
      return window.setTimeout(updater.poll, updater.errorSleepTime);
    }
  };

  updater.poll();

}).call(this);
