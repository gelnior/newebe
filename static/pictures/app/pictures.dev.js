(function() {
  var ConfirmationDialog, InfoDialog, LoadingIndicator, Picture, PictureCollection, PictureRow, PicturesView, app, confirmationDialog, loadingIndicator;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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

  PicturesView = (function() {

    __extends(PicturesView, Backbone.View);

    PicturesView.prototype.el = $("#pictures");

    /* Events
    */

    PicturesView.prototype.events = {
      "click #pictures-post-button": "onPostClicked",
      "submit #pictures-post-button": "onPostClicked"
    };

    function PicturesView() {
      this.reloadMicroPosts = __bind(this.reloadMicroPosts, this);
      this.prependOne = __bind(this.prependOne, this);
      this.appendOne = __bind(this.appendOne, this);
      this.addAll = __bind(this.addAll, this);
      this.onRowClicked = __bind(this.onRowClicked, this);      PicturesView.__super__.constructor.call(this);
    }

    PicturesView.prototype.initialize = function() {
      this.pictures = new PictureCollection;
      this.pictures.bind('add', this.prependOne);
      this.pictures.bind('reset', this.addAll);
      return this.selectedRow = null;
    };

    /* Listeners
    */

    PicturesView.prototype.onPostClicked = function(event) {
      event.preventDefault();
      this.postNewPicture();
      return event;
    };

    PicturesView.prototype.onRowClicked = function(row) {
      if (row !== this.selectedRow) {
        if (this.selectedRow) this.selectedRow.deselect();
        row.select();
        return this.selectedRow = row;
      }
    };

    /* Functions
    */

    PicturesView.prototype.clearNews = function() {
      $("#pictures-list").empty();
      return $("#pictures-more").show();
    };

    PicturesView.prototype.addAll = function() {
      if (this.pictures.length > 0) {
        if (this.pictures.length < 30) $("#pictures-more").hide();
      } else {
        $("#pictures-more").hide();
      }
      this.pictures.each(this.prependOne);
      loadingIndicator.hide();
      return this.pictures.length;
    };

    PicturesView.prototype.appendOne = function(picture) {
      var el, row;
      row = new PictureRow(picture, this);
      el = row.render();
      $("#pictures-list").append(el);
      return row;
    };

    PicturesView.prototype.prependOne = function(picture) {
      var el, row;
      row = new PictureRow(picture, this);
      el = row.render();
      $("#pictures-list").prepend(el);
      loadingIndicator.hide();
      return row;
    };

    PicturesView.prototype.clearPostField = function() {
      return false;
    };

    PicturesView.prototype.reloadMicroPosts = function(date, path) {
      loadingIndicator.display();
      this.selectedRow = null;
      this.pictures.fetch();
      return this.pictures;
    };

    PicturesView.prototype.fetchData = function() {
      this.selectedRow = null;
      this.pictures.fetch();
      return this.pictures;
    };

    PicturesView.prototype.postNewPost = function() {
      return false;
    };

    /* UI Builders
    */

    PicturesView.prototype.setListeners = function() {
      return $("input#pictures-from-datepicker").datepicker({
        onSelect: this.onDatePicked
      });
    };

    PicturesView.prototype.setWidgets = function() {
      var uploader;
      $("input#pictures-post-button").button();
      $("#pictures-my-button").button();
      $("#pictures-all-button").button();
      $("#pictures-all-button").button("disable");
      $("#pictures-more").button();
      $("#pictures-from-datepicker").val(null);
      $("#pictures-a").addClass("disabled");
      return uploader = new qq.FileUploader({
        element: document.getElementById('pictures-file-uploader'),
        action: '/pictures/fileuploader/',
        debug: true,
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif']
      });
    };

    return PicturesView;

  })();

  PictureRow = (function() {

    __extends(PictureRow, Backbone.View);

    PictureRow.prototype.tagName = "div";

    PictureRow.prototype.className = "pictures-row";

    PictureRow.prototype.template = _.template('<a href="#" class="pictures-picture-author"><%= author %></a>\n<img src="<%= imgPath %>" alt="<%= title %>" />\n<p class="pictures-picture-date">\n <%= displayDate %>\n</p>');

    /* Events
    */

    PictureRow.prototype.events = {
      "mouseover": "onMouseOver",
      "mouseout": "onMouseOut",
      "click": "onClick"
    };

    function PictureRow(model, mainView) {
      this.model = model;
      this.mainView = mainView;
      PictureRow.__super__.constructor.call(this);
      this.id = this.model.id;
      this.model.view = this;
      this.selected = false;
    }

    /* Listeners
    */

    PictureRow.prototype.onMouseOver = function() {
      if (!this.selected) return $(this.el).addClass("mouseover");
    };

    PictureRow.prototype.onMouseOut = function() {
      return $(this.el).removeClass("mouseover");
    };

    PictureRow.prototype.onClick = function() {
      return this.mainView.onRowClicked(this);
    };

    /* Functions
    */

    PictureRow.prototype.remove = function() {
      return $(this.el).remove();
    };

    PictureRow.prototype.render = function() {
      if (!this.model.getDisplayDate()) this.model.setDisplayDate();
      $(this.el).html(this.template(this.model.toJSON()));
      return this.el;
    };

    PictureRow.prototype.select = function() {
      $(this.el).removeClass("mouseover");
      $(this.el).addClass("selected");
      return $("#news-preview").html(null);
    };

    PictureRow.prototype.deselect = function() {
      $(this.el).removeClass("selected");
      return $("#news-preview").html(null);
    };

    return PictureRow;

  })();

  Picture = (function() {

    __extends(Picture, Backbone.Model);

    Picture.prototype.url = '/pictures/last/';

    function Picture(picture) {
      Picture.__super__.constructor.apply(this, arguments);
      this.set('author', picture.author);
      this.set('authorKey', picture.authorKey);
      this.set('_id', picture._id);
      this.set('path', picture.path);
      this.id = picture._id;
      this.setImgPath();
      if (picture.date) this.setDisplayDateFromDbDate();
    }

    /* Getters / Setters
    */

    Picture.prototype.setImgPath = function() {
      this.set('imgPath', "/pictures/" + this.id + "/" + (this.get('path')));
      return this.attributes['imgPath'] = "/pictures/" + this.id + "/" + (this.get('path'));
    };

    Picture.prototype.getDisplayDate = function() {
      return this.attributes['displayDate'];
    };

    Picture.prototype.setDisplayDate = function() {
      var dateToSet;
      dateToSet = this.attributes["date"];
      return this.setDisplayDateFromDbDate(dateToSet);
    };

    Picture.prototype.setDisplayDateFromDbDate = function(date) {
      var postDate, stringDate;
      if (date) {
        postDate = Date.parseExact(date, "yyyy-MM-ddTHH:mm:ssZ");
        stringDate = postDate.toString("dd MMM yyyy, HH:mm");
        this.attributes['displayDate'] = stringDate;
        postDate;
      }
      return date;
    };

    Picture.prototype["delete"] = function() {
      this.url = "/pictures/" + this.id + "/";
      this.destroy();
      return this.view.remove();
    };

    Picture.prototype.isNew = function() {
      return !this.getAuthor();
    };

    return Picture;

  })();

  PictureCollection = (function() {

    __extends(PictureCollection, Backbone.Collection);

    function PictureCollection() {
      PictureCollection.__super__.constructor.apply(this, arguments);
    }

    PictureCollection.prototype.model = Picture;

    PictureCollection.prototype.url = '/pictures/last/';

    PictureCollection.prototype.comparator = function(picture) {
      var date;
      date = Date.parseExact(picture.date, "yyyy-MM-ddTHH:mm:ssZ");
      return date;
    };

    PictureCollection.prototype.parse = function(response) {
      return response.rows;
    };

    return PictureCollection;

  })();

  app = new PicturesView;

  loadingIndicator = new LoadingIndicator;

  confirmationDialog = new ConfirmationDialog;

  app.setWidgets();

  app.setListeners();

  app.fetchData();

}).call(this);
