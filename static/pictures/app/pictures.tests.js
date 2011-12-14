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

  PicturesView = (function() {

    __extends(PicturesView, Backbone.View);

    PicturesView.prototype.el = $("#pictures");

    /* Events
    */

    PicturesView.prototype.events = {
      "click #pictures-post-button": "onRowClicked"
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
      this.pictureList.empty();
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
      this.pictureList.append(el);
      return row;
    };

    PicturesView.prototype.prependOne = function(picture) {
      var el, row;
      row = new PictureRow(picture, this);
      el = row.render();
      this.pictureList.prepend(el);
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
      var _this = this;
      $("input#pictures-post-button").button();
      $("#pictures-my-button").button();
      $("#pictures-all-button").button();
      $("#pictures-all-button").button("disable");
      $("#pictures-more").button();
      $("#pictures-from-datepicker").val(null);
      $("#pictures-a").addClass("disabled");
      this.pictureList = $("#pictures-list");
      return uploader = new qq.FileUploader({
        element: document.getElementById('pictures-file-uploader'),
        action: '/pictures/fileuploader/',
        debug: true,
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
        onSubmit: function(id, fileName) {
          return loadingIndicator.display();
        },
        onComplete: function(id, fileName, responseJSON) {
          var picture, row, rowEl;
          loadingIndicator.hide();
          picture = new Picture(responseJSON);
          row = new PictureRow(picture, _this);
          rowEl = row.render();
          $(rowEl).hide();
          $(row.render()).prependTo(_this.pictureList).slideDown();
          return _this.onRowClicked(row);
        }
      });
    };

    return PicturesView;

  })();

  PictureRow = (function() {

    __extends(PictureRow, Backbone.View);

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
      return this.displayPreview();
    };

    PictureRow.prototype.deselect = function() {
      return $(this.el).removeClass("selected");
    };

    PictureRow.prototype.displayPreview = function() {
      var _this = this;
      return this.preview.fadeOut(function() {
        _this.preview.html(null);
        return $.get("/pictures/" + _this.model.get("_id") + "/render/", function(data) {
          _this.preview.append(data);
          $("#pictures-delete-button").button();
          $("#pictures-delete-button").click(_this.onDeleteClicked);
          $("#pictures-full-size-button").button();
          _this.preview.fadeIn();
          return _this.updatePreviewPosition();
        });
      });
    };

    PictureRow.prototype.updatePreviewPosition = function() {
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
      this.setThumbnailPath();
      if (picture.date) this.setDisplayDateFromDbDate(picture.date);
    }

    /* Getters / Setters
    */

    Picture.prototype.setImgPath = function() {
      this.set('imgPath', "/pictures/" + this.id + "/" + (this.get('path')));
      return this.attributes['imgPath'] = "/pictures/" + this.id + "/" + (this.get('path'));
    };

    Picture.prototype.setThumbnailPath = function() {
      this.set('thumnbailPath', "/pictures/" + this.id + "/th_" + (this.get('path')));
      return this.attributes['thumbnailPath'] = "/pictures/" + this.id + "/th_" + (this.get('path'));
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

  loadingIndicator = new LoadingIndicator;

  confirmationDialog = new ConfirmationDialog;

  app.setWidgets();

  app.setListeners();

  app.fetchData();

  describe('picture app', function() {
    var pic;
    pic = new Picture({
      author: "author",
      key: "key",
      _id: "1234",
      path: "path.jpg",
      title: "test title",
      date: "2011-12-06T20:38:47Z"
    });
    describe('models', function() {
      it('Image path is properly built in constructor', function() {
        return expect(pic.get('imgPath')).toBe('/pictures/1234/path.jpg');
      });
      it('Thumbnail path is properly built in constructor', function() {
        return expect(pic.get('thumbnailPath')).toBe('/pictures/1234/th_path.jpg');
      });
      return it('Display date is properly built in constructor', function() {
        return expect(pic.getDisplayDate()).toBe('06 Dec 2011, 20:38');
      });
    });
    describe('rows', function() {
      var row;
      row = new PictureRow(pic, app);
      $("#pictures-list").append(row.render());
      it('Image path is properly built in constructor', function() {
        expect(pic.get('imgPath')).toBe('/pictures/1234/path.jpg');
        return expect($('#' + pic._id)).not.toBe(null);
      });
      it('Image is correctly rendered', function() {
        return expect($('#' + pic._id)).not.toBe(null);
      });
      it('has mouseover class when mouse is over the row', function() {
        row.onMouseOver();
        return expect($(row.el).hasClass("mouseover")).toBe(true);
      });
      it('has not mouseover class when is out the row', function() {
        row.onMouseOut();
        return expect($(row.el).hasClass("mouseover")).not.toBe(true);
      });
      it('has right class when is selected', function() {
        $(row.el).addClass("mouseover");
        row.select();
        expect($(row.el).hasClass("selected")).toBe(true);
        return expect($(row.el).hasClass("mouseover")).not.toBe(true);
      });
      it('has not selected class when is selected', function() {
        row.deselect();
        return expect($(row.el).hasClass("selected")).not.toBe(true);
      });
      return it('is null when is removed', function() {
        row.remove();
        return expect($(row.el).parent()).toBeNull();
      });
    });
    return describe('main view', function() {
      var happy;
      return happy = true;
    });
  });

}).call(this);
