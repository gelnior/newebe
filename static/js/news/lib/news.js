(function() {
  /* Model for a single Micro Post
  */  var MicroPost, MicroPostCollection, MicroPostRow, NewsView, newsApp;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  MicroPost = function() {
    __extends(MicroPost, Backbone.Model);
    MicroPost.prototype.url = '/news/microposts/';
    function MicroPost(microPost) {
      var idDate;
      MicroPost.__super__.constructor.apply(this, arguments);
      this.set('author', microPost.author);
      this.set('content', microPost.content);
      this.set('date', microPost.date);
      if (microPost.date) {
        idDate = microPost.date.replace(" ", "-").replace(":", "-");
        idDate = idDate.replace(":", "-");
        this.id = idDate + "/";
      }
    }
    MicroPost.prototype.getAuthor = function() {
      return this.get('author');
    };
    MicroPost.prototype.getDate = function() {
      return this.get('date');
    };
    MicroPost.prototype.getContent = function() {
      return this.get('content');
    };
    MicroPost.prototype["delete"] = function() {
      this.url += this.id;
      this.destroy();
      return this.view.remove();
    };
    MicroPost.prototype.isNew = function() {
      return !this.getAuthor();
    };
    return MicroPost;
  }();
  /* Model for a Micro Post collection
  */
  MicroPostCollection = function() {
    function MicroPostCollection() {
      MicroPostCollection.__super__.constructor.apply(this, arguments);
    }
    __extends(MicroPostCollection, Backbone.Collection);
    MicroPostCollection.prototype.model = MicroPost;
    MicroPostCollection.prototype.url = '/news/microposts/';
    MicroPostCollection.prototype.comparator = function(microPost) {
      return microPost.getDate();
    };
    MicroPostCollection.prototype.parse = function(response) {
      return response.rows;
    };
    return MicroPostCollection;
  }();
  /* MicroPostRow is the widget representation of a MicroPost
  */
  MicroPostRow = function() {
    __extends(MicroPostRow, Backbone.View);
    MicroPostRow.prototype.tagName = "div";
    MicroPostRow.prototype.className = "news-micropost-row";
    MicroPostRow.prototype.template = _.template('<a class="news-micropost-delete">X</a>\n<p class="news-micropost-content">\n <span><%= author %></span>\n <%= content %>\n</p>\n<p class="news-micropost-date">\n <%= date%>\n</p>');
    MicroPostRow.prototype.events = {
      "click .news-micropost-delete": "onDeleteClicked",
      "mouseover": "onMouseOver",
      "mouseout": "onMouseOut"
    };
    function MicroPostRow(model) {
      this.model = model;
      MicroPostRow.__super__.constructor.apply(this, arguments);
      this.id = "micropost-" + this.model.id;
      this.model.view = this;
    }
    MicroPostRow.prototype.onMouseOver = function() {
      return this.$(".news-micropost-delete").show();
    };
    MicroPostRow.prototype.onMouseOut = function() {
      return this.$(".news-micropost-delete").hide();
    };
    MicroPostRow.prototype.onDeleteClicked = function() {
      return this.model["delete"]();
    };
    MicroPostRow.prototype.remove = function() {
      return $(this.el).remove();
    };
    MicroPostRow.prototype.render = function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.$(".news-micropost-delete").button();
      this.$(".news-micropost-delete").hide();
      return this.el;
    };
    return MicroPostRow;
  }();
  /* Main view for news application
  */
  NewsView = function() {
    __extends(NewsView, Backbone.View);
    NewsView.prototype.el = $("#news");
    NewsView.prototype.isCtrl = false;
    NewsView.prototype.events = {
      "click #news-post-button": "onPostClicked",
      "submit #news-post-button": "onPostClicked",
      "click #news-my-button": "onMineClicked",
      "click #news-more": "onMoreNewsClicked"
    };
    function NewsView() {
      NewsView.__super__.constructor.apply(this, arguments);
    }
    NewsView.prototype.initialize = function() {
      _.bindAll(this, 'postNewPost', 'appendOne', 'prependOne', 'addAll');
      _.bindAll(this, 'displayMyNews', 'onMoreNewsClicked', 'addAllMore');
      _.bindAll(this, 'onDatePicked');
      this.microposts = new MicroPostCollection;
      this.microposts.bind('add', this.prependOne);
      this.microposts.bind('refresh', this.addAll);
      this.moreMicroposts = new MicroPostCollection;
      return this.moreMicroposts.bind('refresh', this.addAllMore);
    };
    /* Events
    */
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
      this.clearNews(null);
      this.reloadMicroPosts();
      this.displayMyNews();
      return event;
    };
    NewsView.prototype.onDatePicked = function(dateText, event) {
      var d, sinceDate;
      d = Date.parse(dateText);
      sinceDate = d.toString("yyyy-MM-dd");
      this.clearNews();
      return this.reloadMicroPosts(sinceDate);
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
      this.lastDate = this.moreMicroposts.last().id;
      if (microPostsArray.length < 10) {
        $("#news-more").hide();
      }
      return this.lastDate;
    };
    NewsView.prototype.addAll = function() {
      this.microposts.each(this.prependOne);
      this.lastDate = this.microposts.first().id;
      if (this.microposts.length < 10) {
        $("#news-more").hide();
      }
      return this.lastDate;
    };
    NewsView.prototype.appendOne = function(micropost) {
      var el, row;
      row = new MicroPostRow(micropost);
      el = row.render();
      $("#micro-posts").append(el);
      return row;
    };
    NewsView.prototype.prependOne = function(micropost) {
      var el, row;
      row = new MicroPostRow(micropost);
      el = row.render();
      $("#micro-posts").prepend(el);
      return row;
    };
    NewsView.prototype.clearPostField = function() {
      $("#id_content").val(null);
      $("#id_content").focus();
      return $("#id_content");
    };
    NewsView.prototype.reloadMicroPosts = function(date) {
      this.microposts.url = '/news/microposts/';
      if (date) {
        this.microposts.url = '/news/microposts/' + date + '-23-59-00/';
      }
      this.microposts.fetch();
      return this.microposts;
    };
    NewsView.prototype.fetch = function() {
      this.microposts.fetch();
      return this.microposts;
    };
    NewsView.prototype.postNewPost = function() {
      this.microposts.create({
        content: $("#id_content").val()
      });
      $("#id_content").val(null);
      $("#id_content").focus();
      return false;
    };
    NewsView.prototype.onMoreNewsClicked = function() {
      if (this.lastDate) {
        this.moreMicroposts.url = '/news/microposts/' + this.lastDate;
      } else {
        this.moreMicroposts.url = '/news/microposts/';
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
      $("input#news-post-button").button();
      $("#news-my-button").button();
      $("#news-all-button").button();
      $("#news-all-button").button("disable");
      $("#news-more").button();
      return $("#news-from-datepicker").val(null);
    };
    return NewsView;
  }();
  /* News application entry point
  */
  newsApp = new NewsView;
  newsApp.setWidgets();
  newsApp.setListeners();
  newsApp.clearPostField();
  newsApp.fetch();
}).call(this);
