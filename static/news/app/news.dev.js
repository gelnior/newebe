(function() {
  var ConfirmationDialog, DocumentSelector, InfoDialog, LoadingIndicator, MicroPost, MicroPostCollection, MicroPostRow, NewsView, Row, confirmationDialog, infoDialog, loadingIndicator, newsApp, selectorDialog, updater,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
      var div,
        _this = this;
      if ($("#document-selector") === void 0 || $("#document-selector").length === 0) {
        div = document.createElement('div');
        div.id = "document-selector";
        div.className = "dialog";
        $("body").prepend(div);
        this.element = $("#document-selector");
        this.element.html('<div id="document-selector-buttons" class="dialog-buttons">\n  <span id="document-selector-select">Select</span>\n  <span id="document-selector-cancel">Cancel</span>\n</div>\n<div id="document-selector-list">\n</div>');
        this.docList = $("#document-selector-list");
        $("#document-selector-cancel").click(function() {
          return _this.element.fadeOut(400);
        });
      } else {
        this.element = $("#document-selector");
        this.docList = $("#document-selector-list");
      }
      this.element.hide();
    }

    DocumentSelector.prototype.display = function(callback) {
      var _this = this;
      if (this.fun !== void 0) {
        $("#document-selector-select").unbind("click", this.fun);
      }
      this.fun = function(event) {
        if ($("#document-selector-list .selected")) {
          callback($("#document-selector-list .selected")[0].id);
        }
        return _this.element.fadeOut(400);
      };
      $("#document-selector-select").click(this.fun);
      this.docList.empty();
      return $.get("/notes/all/html/", function(data) {
        var selected;
        _this.docList.html(data);
        $(".note-row").mouseenter(function(event) {
          return $(this).addClass("mouseover mouseover-dialog");
        });
        $(".note-row").mouseleave(function(event) {
          return $(this).removeClass("mouseover mouseover-dialog");
        });
        selected = null;
        $(".note-row").click(function(event) {
          if (selected) selected.removeClass("selected selected-dialog");
          $(this).addClass("selected selected-dialog");
          return selected = $(this);
        });
        return _this.element.fadeIn(400);
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

    MicroPostRow.prototype.template = _.template('<a href="#" class="news-micropost-author"><%= author %></a>\n<%= contentHtml %>\n<p class="news-micropost-date">\n <%= displayDate %>     \n</p>');

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
      return selectorDialog.display(function(noteId) {
        loadingIndicator.display();
        return $.get("/notes/" + noteId + "/", function(note) {
          note.content = note.content + "\n\n" + _this.model.getContent();
          return $.putJson({
            url: "/notes/" + noteId + "/",
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
            _results.push($("#news-preview").append("<p>\n  <iframe width=\"100%\" height=\"315\" \n    src=\"http://www.youtube.com/embed/" + key + "\" \n    frameborder=\"0\" allowfullscreen>\n  </iframe>\n</p>"));
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
            _results.push($("#news-preview").append("<p>\n<img style=\"max-width: 100%;\"\n     src=\"" + url + "\"\n     alt=\"Micropost preview\" />\n</img>\n</p>"));
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
      return selectorDialog.display(function(noteId) {
        _this.attachments.push({
          type: "note",
          id: noteId
        });
        return $("#news-attach-note-button").show();
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
            $("#news-attach-note-button").hide();
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
      return $("#news-attach-note-button").hide();
    };

    return NewsView;

  })(Backbone.View);

  MicroPost = (function(_super) {

    __extends(MicroPost, _super);

    MicroPost.prototype.url = '/microposts/all/';

    function MicroPost(microPost) {
      var content, converter, html, postDate, urlDate;
      MicroPost.__super__.constructor.apply(this, arguments);
      this.set('author', microPost.author);
      this.set('authorKey', microPost.authorKey);
      this.set('micropostId', microPost._id);
      this.set('content', microPost.content);
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
