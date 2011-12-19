(function() {
  var ConfirmationDialog, InfoDialog, LoadingIndicator, Picture, PictureCollection, PictureRow, PicturesRouter, PicturesView, Row, app, confirmationDialog, infoDialog, loadingIndicator, pictureRouter;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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

  Row = (function() {

    __extends(Row, Backbone.View);

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

  })();

  PicturesRouter = (function() {

    __extends(PicturesRouter, Backbone.Router);

    PicturesRouter.prototype.routes = {
      "": "all",
      "pictures": "all",
      "pictures/all/": "all",
      "pictures/all/until/:date/": "all",
      "pictures/mine/": "mine",
      "pictures/mine/until/:date/": "mine",
      "pictures/mine/:id/": "mineWithSelection"
    };

    function PicturesRouter(view) {
      PicturesRouter.__super__.constructor.apply(this, arguments);
      this.view = view;
    }

    PicturesRouter.prototype.all = function(date) {
      return this.view.displayAllPictures(date);
    };

    PicturesRouter.prototype.mine = function(date) {
      return this.view.displayMyPictures(date);
    };

    PicturesRouter.prototype.mineWithSelection = function(id) {
      this.view.lastSelectedId = id;
      return this.view.displayMyPictures(null);
    };

    return PicturesRouter;

  })();

  PicturesView = (function() {

    __extends(PicturesView, Backbone.View);

    PicturesView.prototype.el = $("#pictures");

    /* Events
    */

    PicturesView.prototype.events = {
      "click #pictures-more-button": "onMoreClicked"
    };

    function PicturesView() {
      this.displayAllPictures = __bind(this.displayAllPictures, this);
      this.displayMyPictures = __bind(this.displayMyPictures, this);
      this.fetchData = __bind(this.fetchData, this);
      this.reloadPictures = __bind(this.reloadPictures, this);
      this.prependOne = __bind(this.prependOne, this);
      this.appendOne = __bind(this.appendOne, this);
      this.addAllMore = __bind(this.addAllMore, this);
      this.addAll = __bind(this.addAll, this);
      this.displayAllPictures = __bind(this.displayAllPictures, this);
      this.displayMyPictures = __bind(this.displayMyPictures, this);
      this.onFileUploadComplete = __bind(this.onFileUploadComplete, this);
      this.onFileSubmitted = __bind(this.onFileSubmitted, this);
      this.onDatePicked = __bind(this.onDatePicked, this);
      this.onRowClicked = __bind(this.onRowClicked, this);
      this.onMoreClicked = __bind(this.onMoreClicked, this);      PicturesView.__super__.constructor.call(this);
    }

    PicturesView.prototype.initialize = function() {
      this.pictures = new PictureCollection;
      this.morePictures = new PictureCollection;
      this.pictures.bind('add', this.prependOne);
      this.pictures.bind('reset', this.addAll);
      this.morePictures.bind('reset', this.addAllMore);
      this.currentPath = "/pictures/last/";
      return this.selectedRow = null;
    };

    /* Listeners
    */

    PicturesView.prototype.onMoreClicked = function() {
      this.morePictures.url = this.currentPath + this.lastDate + "/";
      return this.morePictures.fetch();
    };

    PicturesView.prototype.onRowClicked = function(row) {
      if (row !== this.selectedRow) {
        if (this.selectedRow) this.selectedRow.deselect();
        row.select();
        return this.selectedRow = row;
      }
    };

    PicturesView.prototype.onDatePicked = function(dateText, event) {
      var date, datePicked;
      datePicked = Date.parse(dateText);
      date = datePicked.toString("yyyy-MM-dd");
      if (this.currentPath === "/pictures/last/my/") {
        return Backbone.history.navigate("pictures/mine/until/" + date + "/", true);
      } else {
        return Backbone.history.navigate("pictures/all/until/" + date + "/", true);
      }
    };

    PicturesView.prototype.onFileSubmitted = function(id, fileName) {
      return loadingIndicator.display();
    };

    PicturesView.prototype.onFileUploadComplete = function(id, fileName, responseJSON) {
      var picture, row, rowEl;
      loadingIndicator.hide();
      picture = new Picture(responseJSON);
      row = new PictureRow(picture, this);
      rowEl = row.render();
      $(rowEl).hide();
      $(row.render()).prependTo(this.pictureList).slideDown();
      return this.onRowClicked(row);
    };

    PicturesView.prototype.displayMyPictures = function(date) {
      this.myButton.button("disable");
      this.allButton.button("enable");
      this.currentPath = "/pictures/last/my/";
      this.datepicker.val(date);
      return this.reloadPictures(date);
    };

    PicturesView.prototype.displayAllPictures = function(date) {
      this.myButton.button("enable");
      this.allButton.button("disable");
      this.currentPath = "/pictures/last/";
      this.datepicker.val(date);
      return this.reloadPictures(date);
    };

    /* Functions
    */

    PicturesView.prototype.addAll = function() {
      var picture;
      if (this.pictures.length >= 0 && this.pictures.length < 10) {
        this.moreButton.hide();
      } else {
        picture = this.pictures.first();
        this.lastDate = picture.getUrlDate();
        this.moreButton.show();
      }
      this.pictures.each(this.prependOne);
      loadingIndicator.hide();
      return this.pictures.length;
    };

    PicturesView.prototype.addAllMore = function() {
      var picture, pictures;
      pictures = this.morePictures.toArray().reverse();
      pictures = _.rest(pictures);
      if (this.morePictures.length >= 0 && this.morePictures.length < 10) {
        this.moreButton.hide();
      } else {
        picture = pictures[0];
        this.lastDate = picture.getUrlDate();
        this.moreButton.show();
      }
      _.each(pictures, this.appendOne);
      loadingIndicator.hide();
      return this.morePictures.length;
    };

    PicturesView.prototype.appendOne = function(picture) {
      var el, row;
      row = new PictureRow(picture, this);
      el = row.render();
      this.pictureList.append(el);
      return row;
    };

    PicturesView.prototype.prependOne = function(picture) {
      var el, row;
      row = new PictureRow(picture, this);
      el = row.render();
      this.pictureList.prepend(el);
      return row;
    };

    PicturesView.prototype.reloadPictures = function(date) {
      this.pictureList.empty();
      this.selectedRow = null;
      loadingIndicator.display();
      if (date) {
        this.pictures.url = this.currentPath + date + '-23-59-00/';
      } else {
        this.pictures.url = this.currentPath;
      }
      return this.fetchData();
    };

    PicturesView.prototype.fetchData = function() {
      this.pictures.fetch({
        error: function() {
          infoDialog.display("Error occured while retrieving data.");
          return loadingIndicator.hide();
        }
      });
      return this.pictures;
    };

    PicturesView.prototype.displayMyPictures = function(date) {
      this.myButton.button("disable");
      this.allButton.button("enable");
      this.currentPath = "/pictures/last/my/";
      this.datepicker.val(date);
      return this.reloadPictures(date);
    };

    PicturesView.prototype.displayAllPictures = function(date) {
      this.myButton.button("enable");
      this.allButton.button("disable");
      this.currentPath = "/pictures/last/";
      this.datepicker.val(date);
      return this.reloadPictures(date);
    };

    /* UI Builders
    */

    PicturesView.prototype.setListeners = function() {
      return this.datepicker.datepicker({
        onSelect: this.onDatePicked
      });
    };

    PicturesView.prototype.setWidgets = function() {
      var uploader;
      this.myButton = $("#pictures-my-button");
      this.allButton = $("#pictures-all-button");
      this.moreButton = $("#pictures-more-button");
      this.datepicker = $("#pictures-from-datepicker");
      this.myButton.button();
      this.allButton.button();
      this.allButton.button("disable");
      this.moreButton.button();
      this.datepicker.val(null);
      this.pictureList = $("#pictures-list");
      return uploader = new qq.FileUploader({
        element: document.getElementById('pictures-file-uploader'),
        action: '/pictures/fileuploader/',
        debug: true,
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
        onSubmit: this.onFileSubmitted,
        onComplete: this.onFileUploadComplete
      });
    };

    return PicturesView;

  })();

  PictureRow = (function() {

    __extends(PictureRow, Row);

    PictureRow.prototype.tagName = "div";

    PictureRow.prototype.className = "pictures-row";

    PictureRow.prototype.template = _.template('<a href="#" class="pictures-picture-author"><%= author %></a>\n<img src="<%= thumbnailPath %>" alt="<%= title %>" />\n<p class="pictures-picture-date">\n <%= displayDate %>\n</p>\n<div class="spacer"></div>');

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
      this.onDownloadClicked = __bind(this.onDownloadClicked, this);
      this.onDeleteClicked = __bind(this.onDeleteClicked, this);
      PictureRow.__super__.constructor.call(this);
      this.id = this.model.id;
      this.model.view = this;
      this.selected = false;
      this.preview = $("#pictures-preview");
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

    PictureRow.prototype.onDeleteClicked = function(event) {
      var _this = this;
      if (event) event.preventDefault();
      return confirmationDialog.display("Are you sure you want to delete this picture ?", function() {
        confirmationDialog.hide();
        _this.model["delete"]();
        _this.mainView.selectedRow = null;
        return _this.preview.fadeOut(function() {
          return _this.preview.html(null);
        });
      });
    };

    PictureRow.prototype.onDownloadClicked = function(event) {
      var _this = this;
      if (event) event.preventDefault();
      loadingIndicator.display();
      return $.get(this.model.getDownloadPath(), function(data) {
        if (data.success) {
          _this.displayPreview();
        } else {
          loadingIndicator.hide();
        }
        return confirmationDialog.display("An error occured while downloading image file.");
      });
    };

    /* Functions
    */

    PictureRow.prototype.remove = function() {
      return $(this.el).remove();
    };

    PictureRow.prototype.render = function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this.el;
    };

    PictureRow.prototype.select = function() {
      $(this.el).removeClass("mouseover");
      $(this.el).addClass("selected");
      return this.displayPreview();
    };

    PictureRow.prototype.deselect = function() {
      return $(this.el).removeClass("selected");
    };

    PictureRow.prototype.displayPreview = function() {
      var _this = this;
      return this.preview.fadeOut(function() {
        _this.preview.html(null);
        return $.get(_this.model.getPath(), function(data) {
          loadingIndicator.hide();
          _this.preview.append(data);
          $("#pictures-delete-button").button();
          $("#pictures-delete-button").click(_this.onDeleteClicked);
          $("#pictures-download-button").button();
          $("#pictures-download-button").click(_this.onDownloadClicked);
          $("#pictures-full-size-button").button();
          _this.preview.fadeIn();
          return _this.updatePreviewPosition();
        });
      });
    };

    return PictureRow;

  })();

  Picture = (function() {

    __extends(Picture, Backbone.Model);

    Picture.prototype.url = '/pictures/last/';

    function Picture(picture) {
      var date;
      Picture.__super__.constructor.apply(this, arguments);
      this.set('author', picture.author);
      this.set('authorKey', picture.authorKey);
      this.set('_id', picture._id);
      this.set('path', picture.path);
      this.id = picture._id;
      this.setImgPath();
      this.setThumbnailPath();
      if (picture.date) {
        date = Date.parseExact(picture.date, "yyyy-MM-ddTHH:mm:ssZ");
        this.attributes['urlDate'] = date.toString("yyyy-MM-dd-HH-mm-ss");
        this.attributes['displayDate'] = date.toString("dd MMM yyyy, HH:mm");
      }
    }

    /* Getters / Setters
    */

    Picture.prototype.getUrlDate = function() {
      return this.attributes['urlDate'];
    };

    Picture.prototype.getDisplayDate = function() {
      return this.attributes['displayDate'];
    };

    Picture.prototype.setImgPath = function() {
      this.set('imgPath', "/pictures/" + this.id + "/" + (this.get('path')));
      return this.attributes['imgPath'] = "/pictures/" + this.id + "/" + (this.get('path'));
    };

    Picture.prototype.setThumbnailPath = function() {
      this.set('thumnbailPath', "/pictures/" + this.id + "/th_" + (this.get('path')));
      return this.attributes['thumbnailPath'] = "/pictures/" + this.id + "/th_" + (this.get('path'));
    };

    Picture.prototype.getPath = function() {
      return "/pictures/" + this.get("_id") + "/render/";
    };

    Picture.prototype.getDownloadPath = function() {
      return "/pictures/" + this.get("_id") + "/download/";
    };

    Picture.prototype["delete"] = function() {
      this.url = "/pictures/" + this.id + "/";
      this.destroy();
      return this.view.remove();
    };

    Picture.prototype.isNew = function() {
      return !this.id;
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

  pictureRouter = new PicturesRouter(app);

  loadingIndicator = new LoadingIndicator;

  confirmationDialog = new ConfirmationDialog;

  infoDialog = new InfoDialog;

  app.setWidgets();

  app.setListeners();

  app.displayAllPictures(null);

}).call(this);
