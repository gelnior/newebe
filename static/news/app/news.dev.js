(function() {
  var ConfirmationDialog, InfoDialog, LoadingIndicator, MicroPost, MicroPostCollection, MicroPostRow, NewsView, confirmationDialog, loadingIndicator, newsApp, updater;
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
  MicroPostRow = (function() {
    __extends(MicroPostRow, Backbone.View);
    MicroPostRow.prototype.tagName = "div";
    MicroPostRow.prototype.className = "news-micropost-row";
    MicroPostRow.prototype.template = _.template('<a class="news-micropost-delete">X</a>\n<a href="#" class="news-micropost-author"><%= author %></a>\n<%= contentHtml %>\n<p class="news-micropost-date">\n <%= displayDate %>     \n</p>');
    /* Events */
    MicroPostRow.prototype.events = {
      "click .news-micropost-delete": "onDeleteClicked",
      "mouseover": "onMouseOver",
      "mouseout": "onMouseOut",
      "click": "onClick",
      "click .news-micropost-author": "onAuthorClicked"
    };
    function MicroPostRow(model, mainView) {
      this.model = model;
      this.mainView = mainView;
      MicroPostRow.__super__.constructor.call(this);
      this.id = this.model.id;
      this.model.view = this;
      this.selected = false;
    }
    /* Listeners */
    MicroPostRow.prototype.onMouseOver = function() {
      if (!this.selected) {
        return $(this.el).addClass("mouseover");
      }
    };
    MicroPostRow.prototype.onMouseOut = function() {
      return $(this.el).removeClass("mouseover");
    };
    MicroPostRow.prototype.onClick = function() {
      return this.mainView.onRowClicked(this);
    };
    MicroPostRow.prototype.onDeleteClicked = function() {
      var model;
      model = this.model;
      return confirmationDialog.display("Are you sure you want to delete this post ?", __bind(function() {
        confirmationDialog.hide();
        model["delete"]();
        this.mainView.selectedRow = null;
        return $("#news-preview").html(null);
      }, this));
    };
    MicroPostRow.prototype.onAuthorClicked = function(event) {
      $.get("/contacts/render/" + this.model.getAuthorKey() + "/", function(data) {
        return $("#news-preview").html(data);
      });
      if (event) {
        event.preventDefault();
      }
      return false;
    };
    /* Functions */
    MicroPostRow.prototype.remove = function() {
      return $(this.el).remove();
    };
    MicroPostRow.prototype.render = function() {
      if (!this.model.getDisplayDate()) {
        this.model.setDisplayDate();
      }
      $(this.el).html(this.template(this.model.toJSON()));
      this.$(".news-micropost-delete").button();
      this.$(".news-micropost-delete").hide();
      return this.el;
    };
    MicroPostRow.prototype.select = function() {
      this.$(".news-micropost-delete").show();
      $(this.el).removeClass("mouseover");
      $(this.el).addClass("selected");
      return this.onAuthorClicked(null);
    };
    MicroPostRow.prototype.deselect = function() {
      this.$(".news-micropost-delete").hide();
      $(this.el).removeClass("selected");
      return $("#news-preview").html(null);
    };
    return MicroPostRow;
  })();
  NewsView = (function() {
    __extends(NewsView, Backbone.View);
    NewsView.prototype.el = $("#news");
    NewsView.prototype.isCtrl = false;
    /* Events */
    NewsView.prototype.events = {
      "click #news-post-button": "onPostClicked",
      "submit #news-post-button": "onPostClicked",
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
      this.currentPath = '/news/microposts/all/';
      return this.selectedRow = null;
    };
    /* Listeners  */
    NewsView.prototype.onKeyUp = function(event) {
      if (event.keyCode === 17) {
        this.isCtrl = false;
      }
      return event;
    };
    NewsView.prototype.onKeyDown = function(event) {
      if (event.keyCode === 17) {
        this.isCtrl = true;
      }
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
    NewsView.prototype.onMineClicked = function(event) {
      $("#news-my-button").button("disable");
      $("#news-all-button").button("enable");
      this.clearNews(null);
      $("#news-from-datepicker").val(null);
      this.currentPath = '/news/microposts/mine/';
      this.reloadMicroPosts(null);
      return event;
    };
    NewsView.prototype.onAllClicked = function(event) {
      $("#news-all-button").button("disable");
      $("#news-my-button").button("enable");
      this.clearNews(null);
      $("#news-from-datepicker").val(null);
      this.currentPath = '/news/microposts/all/';
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
        if (this.selectedRow) {
          this.selectedRow.deselect();
        }
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
    /* Functions  */
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
      if (microPostsArray.length < 10) {
        $("#news-more").hide();
      }
      loadingIndicator.hide();
      return this.lastDate;
    };
    NewsView.prototype.addAll = function() {
      if (this.microposts.length > 0) {
        this.tutorialOn = false;
        this.lastDate = this.microposts.first().getUrlDate();
        if (this.microposts.length < 10) {
          $("#news-more").hide();
        }
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
      return $.get("/news/tutorial/" + index + "/", function(data) {
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
      if (date) {
        this.microposts.url = this.currentPath + date + '-23-59-00/';
      }
      this.microposts.fetch();
      return this.microposts;
    };
    NewsView.prototype.fetch = function() {
      this.selectedRow = null;
      this.microposts.fetch();
      return this.microposts;
    };
    NewsView.prototype.postNewPost = function() {
      var content, regexp, url, urlIndex, urls;
      loadingIndicator.display();
      content = $("#id_content").val();
      regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      urls = content.match(regexp);
      if (urls) {
        url = urls[0];
        urlIndex = content.indexOf(url);
        if (urlIndex === 0 || content.charAt(urlIndex - 1) !== '(') {
          content = content.replace(regexp, "[" + url + "]" + "(" + url + ")");
        }
      }
      this.microposts.create({
        content: content
      }, {
        success: function(nextModel, resp) {
          loadingIndicator.hide();
          nextModel.view.el.id = resp._id;
          return nextModel.id = resp._id;
        }
      });
      $("#id_content").val(null);
      $("#id_content").focus();
      return false;
    };
    /* UI Builders  */
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
      $("input#news-post-button").button();
      $("#news-my-button").button();
      $("#news-all-button").button();
      $("#news-all-button").button("disable");
      $("#news-more").button();
      $("#news-from-datepicker").val(null);
      return $("#news-a").addClass("disabled");
    };
    return NewsView;
  })();
  MicroPost = (function() {
    __extends(MicroPost, Backbone.Model);
    MicroPost.prototype.url = '/news/microposts/';
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
    /* Getters / Setters */
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
      this.url = "/news/micropost/" + this.id + "/";
      this.destroy();
      return this.view.remove();
    };
    MicroPost.prototype.isNew = function() {
      return !this.getAuthor();
    };
    return MicroPost;
  })();
  MicroPostCollection = (function() {
    function MicroPostCollection() {
      MicroPostCollection.__super__.constructor.apply(this, arguments);
    }
    __extends(MicroPostCollection, Backbone.Collection);
    MicroPostCollection.prototype.model = MicroPost;
    MicroPostCollection.prototype.url = '/news/microposts/all/';
    MicroPostCollection.prototype.comparator = function(microPost) {
      return microPost.getDate();
    };
    MicroPostCollection.prototype.parse = function(response) {
      return response.rows;
    };
    return MicroPostCollection;
  })();
  newsApp = new NewsView;
  loadingIndicator = new LoadingIndicator;
  confirmationDialog = new ConfirmationDialog;
  newsApp.setWidgets();
  newsApp.setListeners();
  newsApp.clearPostField();
  newsApp.fetch();
  updater = {
    errorSleepTime: 500,
    cursor: null,
    poll: function() {
      return $.ajax({
        url: "/news/suscribe/",
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
      return window.setTimeout(updater.poll, 0);
    },
    onError: function(response) {
      updater.errorSleepTime *= 2;
      return window.setTimeout(updater.poll, updater.errorSleepTime);
    }
  };
  updater.poll();
}).call(this);
