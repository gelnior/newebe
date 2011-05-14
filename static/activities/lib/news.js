(function() {
  var NewsView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
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
      NewsView.__super__.constructor.apply(this, arguments);
    }
    NewsView.prototype.initialize = function() {
      _.bindAll(this, 'postNewPost', 'appendOne', 'prependOne', 'addAll');
      _.bindAll(this, 'displayMyNews', 'onMoreNewsClicked', 'addAllMore');
      _.bindAll(this, 'onDatePicked');
      this.tutorialOn = true;
      this.microposts = new MicroPostCollection;
      this.microposts.bind('add', this.prependOne);
      this.microposts.bind('refresh', this.addAll);
      this.moreMicroposts = new MicroPostCollection;
      this.moreMicroposts.bind('refresh', this.addAllMore);
      return this.currentPath = '/news/microposts/all/';
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
      this.microposts.url = this.currentPath;
      if (date) {
        this.microposts.url = this.currentPath + date + '-23-59-00/';
      }
      this.microposts.fetch();
      return this.microposts;
    };
    NewsView.prototype.fetch = function() {
      this.microposts.fetch();
      return this.microposts;
    };
    NewsView.prototype.postNewPost = function() {
      loadingIndicator.display();
      this.microposts.create({
        content: $("#id_content").val()
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
}).call(this);
