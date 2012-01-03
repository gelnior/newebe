(function() {
  var ActivitiesView, Activity, ActivityCollection, ActivityRow, ConfirmationDialog, InfoDialog, LoadingIndicator, Row, activitiesApp, confirmationDialog, infoDialog, loadingIndicator;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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

  ActivitiesView = (function() {

    __extends(ActivitiesView, Backbone.View);

    ActivitiesView.prototype.el = $("#activities");

    /* Events
    */

    ActivitiesView.prototype.events = {
      "click #activities-my-button": "onMineClicked",
      "click #activities-all-button": "onAllClicked",
      "click #activities-sync-button": "onSyncClicked",
      "click #activities-more": "onMoreActivitiesClicked"
    };

    function ActivitiesView() {
      this.prependOne = __bind(this.prependOne, this);
      this.appendOne = __bind(this.appendOne, this);
      this.addAll = __bind(this.addAll, this);
      this.addAllMore = __bind(this.addAllMore, this);      ActivitiesView.__super__.constructor.apply(this, arguments);
    }

    ActivitiesView.prototype.initialize = function() {
      _.bindAll(this, 'displayMyActivities', 'onMoreActivtiesClicked');
      _.bindAll(this, 'onDatePicked');
      this.tutorialOn = true;
      this.activities = new ActivityCollection;
      this.activities.bind('add', this.prependOne);
      this.activities.bind('reset', this.addAll);
      this.moreActivities = new ActivityCollection;
      this.moreActivities.bind('reset', this.addAllMore);
      this.currentPath = '/activities/all/';
      return this.selectedRow = null;
    };

    /* Listeners
    */

    ActivitiesView.prototype.onMineClicked = function(event) {
      $("#activities-my-button").button("disable");
      $("#activities-all-button").button("enable");
      this.clearActivities(null);
      $("#activities-from-datepicker").val(null);
      this.currentPath = '/activities/mine/';
      this.reloadActivities(null);
      return event;
    };

    ActivitiesView.prototype.onAllClicked = function(event) {
      $("#activities-all-button").button("disable");
      $("#activities-my-button").button("enable");
      this.clearActivities(null);
      $("#activities-from-datepicker").val(null);
      this.currentPath = '/activities/all/';
      this.reloadActivities(null);
      return event;
    };

    ActivitiesView.prototype.onSyncClicked = function(event) {
      $.ajax({
        url: "/synchronize/",
        success: function() {
          return infoDialog.display("Synchronization process started, check back your data in a few minutes.");
        },
        error: function() {
          return infoDialog.display("Synchronize process failed.");
        }
      });
      return event;
    };

    ActivitiesView.prototype.onDatePicked = function(dateText, event) {
      var d, sinceDate;
      d = Date.parse(dateText);
      sinceDate = d.toString("yyyy-MM-dd");
      this.clearActivities();
      return this.reloadActivities(sinceDate);
    };

    ActivitiesView.prototype.onRowClicked = function(row) {
      if (row !== this.selectedRow) {
        if (this.selectedRow) this.selectedRow.deselect();
        row.select();
        return this.selectedRow = row;
      }
    };

    /* Functions
    */

    ActivitiesView.prototype.clearActivities = function() {
      $("#activity-list").empty();
      return $("#activities-more").show();
    };

    ActivitiesView.prototype.addAllMore = function() {
      var activitiesArray;
      activitiesArray = this.moreActivities.toArray().reverse();
      activitiesArray = _.rest(activitiesArray);
      _.each(activitiesArray, this.appendOne);
      this.lastDate = this.moreActivities.last().getUrlDate();
      if (activitiesArray.length < 30) $("#activities-more").hide();
      loadingIndicator.hide();
      return this.lastDate;
    };

    ActivitiesView.prototype.addAll = function() {
      if (this.activities.length > 0) {
        this.tutorialOn = false;
        this.lastDate = this.activities.first().getUrlDate();
        if (this.activities.length < 30) $("#activities-more").hide();
      } else {
        if (this.tutorialOn) {
          this.displayTutorial(1);
        } else {
          $("#tutorial").html(null);
        }
        $("#activities-more").hide();
      }
      this.activities.each(this.prependOne);
      loadingIndicator.hide();
      return this.activities.length;
    };

    ActivitiesView.prototype.appendOne = function(activity) {
      var el, row;
      row = new ActivityRow(activity, this);
      el = row.render();
      $("#activity-list").append(el);
      return row;
    };

    ActivitiesView.prototype.prependOne = function(activity) {
      var el, row;
      row = new ActivityRow(activity, this);
      el = row.render();
      $("#activity-list").prepend(el);
      loadingIndicator.hide();
      if (this.tutorialOn) {
        this.displayTutorial(2);
        this.tutorialOn = false;
      }
      return row;
    };

    ActivitiesView.prototype.displayTutorial = function(index) {
      return $.get("/activities/tutorial/" + index + "/", function(data) {
        return $("#tutorial-activities").html(data);
      });
    };

    ActivitiesView.prototype.reloadActivities = function(date, path) {
      loadingIndicator.display();
      this.selectedRow = null;
      this.activities.url = this.currentPath;
      if (date) this.activities.url = this.currentPath + date + '-23-59-00/';
      this.activities.fetch();
      return this.activities;
    };

    ActivitiesView.prototype.fetch = function() {
      this.activities.fetch();
      return this.activties;
    };

    ActivitiesView.prototype.onMoreActivitiesClicked = function() {
      loadingIndicator.display();
      if (this.lastDate) {
        this.moreActivities.url = this.currentPath + this.lastDate;
      } else {
        this.moreActivities.url = this.currentPath;
      }
      this.moreActivities.fetch();
      return this.moreActivities;
    };

    /* UI Builders
    */

    ActivitiesView.prototype.setListeners = function() {
      return $("input#activities-from-datepicker").datepicker({
        onSelect: this.onDatePicked
      });
    };

    ActivitiesView.prototype.setWidgets = function() {
      $("#activities-my-button").button();
      $("#activities-all-button").button();
      $("#activities-sync-button").button();
      $("#activities-all-button").button("disable");
      $("#activities-more").button();
      return $("#activities-from-datepicker").val(null);
    };

    return ActivitiesView;

  })();

  ActivityRow = (function() {

    __extends(ActivityRow, Row);

    ActivityRow.prototype.tagName = "div";

    ActivityRow.prototype.className = "activity-row";

    ActivityRow.prototype.template = _.template('<span class="activity-date">\n <%= displayDate %> -\n</span>\n<a href="#" class="activity-author"><%= author %></a>\n<span class="activity-verb"><%= verb %></span>\na\n<span class="doc-ref">\n<span class="activity-verb"><%= docType %></span>\n</span>\n<span class="activity-error-number">\n<%= errorNumber %>\n</span>\n<div class="activity-errors">\nErrors :\n<% _.each(errors, function(error) { %>\n  <div class="activity-error">\n    <%= error.contactName %> |\n    <%= error.contactUrl %> ->\n    <span id="<%= error.contactKey%>"\n          class="activity-error-resend">\n      resend\n    </span>\n</div>\n<% }); %>\n</div>');

    /* Events
    */

    ActivityRow.prototype.events = {
      "mouseover": "onMouseOver",
      "mouseout": "onMouseOut",
      "click": "onClick",
      "click .doc-ref": "onDocRefClicked",
      "click .activity-author": "onActivityAuthorClicked",
      "click .activity-error-number": "onErrorNumberClicked",
      "click .activity-error-resend": "onErrorResendClicked"
    };

    function ActivityRow(model, mainView) {
      this.model = model;
      this.mainView = mainView;
      this.onActivityAuthorClicked = __bind(this.onActivityAuthorClicked, this);
      this.onPreviewLoaded = __bind(this.onPreviewLoaded, this);
      ActivityRow.__super__.constructor.call(this);
      this.id = this.model.id;
      this.model.view = this;
      this.selected = false;
      this.authorDisplayed = false;
      this.preview = $("#activities-preview");
    }

    /* Listeners
    */

    ActivityRow.prototype.onMouseOver = function() {
      if (!this.selected) return $(this.el).addClass("mouseover");
    };

    ActivityRow.prototype.onMouseOut = function() {
      return $(this.el).removeClass("mouseover");
    };

    ActivityRow.prototype.onClick = function() {
      return this.mainView.onRowClicked(this);
    };

    ActivityRow.prototype.onDocRefClicked = function(event) {
      if (this.model.getDocType() === "micropost" && this.model.getMethod() === "POST") {
        $.get("/news/micropost/" + this.model.getDocId() + "/html/", this.onPreviewLoaded);
      } else if (this.model.getDocType() === "note") {
        $.get("/notes/" + (this.model.getDocId()) + "/html/", this.onPreviewLoaded);
      } else if (this.model.getDocType() === "picture" && this.model.getMethod() === "POST") {
        $.get("/pictures/" + (this.model.getDocId()) + "/render/", this.onPreviewLoaded);
        if (event) event.preventDefault();
      }
      return false;
    };

    ActivityRow.prototype.onPreviewLoaded = function(data) {
      this.preview.html(data);
      return this.updatePreviewPosition();
    };

    ActivityRow.prototype.onActivityAuthorClicked = function(event) {
      var _this = this;
      if (!this.authorDisplayed) {
        $.get("/contacts/render/" + this.model.getAuthorKey() + "/", function(data) {
          _this.preview.append("<p>&nbsp;</p>");
          _this.preview.append("<p>Author profile: </p>");
          _this.preview.append(data);
          return _this.authorDisplayed = true;
        });
      }
      event.preventDefault();
      return false;
    };

    ActivityRow.prototype.onErrorNumberClicked = function(event) {
      return this.$(".activity-errors").show();
    };

    ActivityRow.prototype.onErrorResendClicked = function(event) {
      var error, extra, _i, _len, _ref;
      extra = "";
      _ref = this.model.getErrors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        error = _ref[_i];
        if (error.contactKey && error.contactKey === event.target.id) {
          extra = error.extra;
        }
      }
      if (this.model.getDocType() === "micropost") {
        switch (this.model.getMethod()) {
          case "POST":
            return this.sendRetryRequest("POST", "/news/micropost/" + this.model.getDocId() + "/retry/", event);

          case "DELETE":
            return this.sendRetryRequest("PUT", "/news/micropost/" + this.model.getDocId() + "/retry/", event, extra);
        }
      } else if (this.model.getDocType() === "picture") {
        switch (this.model.getMethod()) {
          case "POST":
            return this.sendRetryRequest("POST", "/pictures/" + this.model.getDocId() + "/retry/", event);
          case "DELETE":
            return this.sendRetryRequest("PUT", "/news/pictures/" + this.model.getDocId() + "/retry/", event, extra);
        }
      }
    };

    ActivityRow.prototype.sendRetryRequest = function(type, path, event, extra) {
      var _this = this;
      $(event.target).html("resending...");
      return $.ajax({
        type: type,
        url: path,
        data: '{"contactId": "' + event.target.id + '", "activityId":"' + this.model.id + '", "extra":"' + extra + '"}',
        dataType: "json",
        success: function(data) {
          return $(event.target).html("resending succeeds.");
        },
        error: function(data) {
          infoDialog.display("Sending data fails again.");
          return $(event.target).html("resend");
        }
      });
    };

    /* Functions
    */

    ActivityRow.prototype.render = function() {
      if (!this.model.getDisplayDate()) this.model.setDisplayDate();
      $(this.el).html(this.template(this.model.toJSON()));
      this.$(".activity-errors").hide();
      return this.el;
    };

    ActivityRow.prototype.select = function() {
      $(this.el).removeClass("mouseover");
      $(this.el).addClass("selected");
      $("#activities-preview").empty();
      return this.onDocRefClicked(null);
    };

    ActivityRow.prototype.deselect = function() {
      $(this.el).removeClass("selected");
      $("#news-preview").html(null);
      return this.authorDisplayed = false;
    };

    return ActivityRow;

  })();

  Activity = (function() {

    __extends(Activity, Backbone.Model);

    Activity.prototype.url = '/activities/all/';

    function Activity(activity) {
      var activityDate, urlDate;
      Activity.__super__.constructor.apply(this, arguments);
      this.set('author', activity.author);
      this.set('authorKey', activity.authorKey);
      this.set('date', activity.date);
      this.set('docId', activity.docId);
      this.set('verb', activity.verb);
      this.set('docType', activity.docType);
      this.set('method', activity.method);
      this.set('errors', activity.errors);
      this.set('mid', activity._id);
      this.attributes['mid'] = activity._id;
      this.setDisplayDate();
      this.id = activity._id;
      if (activity.date) {
        activityDate = Date.parseExact(activity.date, "yyyy-MM-ddTHH:mm:ssZ");
        urlDate = activityDate.toString("yyyy-MM-dd-HH-mm-ss/");
        this.attributes['urlDate'] = urlDate;
      }
      if (activity.errors.length) {
        this.attributes['errorNumber'] = "(" + activity.errors.length + ")";
      } else {
        this.attributes['errorNumber'] = "";
      }
    }

    /* Getters / Setters
    */

    Activity.prototype.getDisplayDate = function() {
      return this.attributes['displayDate'];
    };

    Activity.prototype.setDisplayDate = function() {
      var dateToSet;
      dateToSet = this.attributes["date"];
      return this.setDisplayDateFromDbDate(dateToSet);
    };

    Activity.prototype.setDisplayDateFromDbDate = function(date) {
      var postDate, stringDate;
      postDate = Date.parseExact(date, "yyyy-MM-ddTHH:mm:ssZ");
      stringDate = postDate.toString("dd MMM yyyy, HH:mm");
      this.attributes['displayDate'] = stringDate;
      return postDate;
    };

    Activity.prototype.getAuthor = function() {
      return this.get('author');
    };

    Activity.prototype.getAuthorKey = function() {
      return this.get('authorKey');
    };

    Activity.prototype.getDate = function() {
      return this.get('date');
    };

    Activity.prototype.getUrlDate = function() {
      return this.attributes['urlDate'];
    };

    Activity.prototype.getDocType = function() {
      return this.attributes['docType'];
    };

    Activity.prototype.getDocId = function() {
      return this.get('docId');
    };

    Activity.prototype.getMethod = function() {
      return this.get('method');
    };

    Activity.prototype.getMid = function() {
      return this.get('mid');
    };

    Activity.prototype.getErrors = function() {
      return this.get('errors');
    };

    return Activity;

  })();

  ActivityCollection = (function() {

    __extends(ActivityCollection, Backbone.Collection);

    function ActivityCollection() {
      ActivityCollection.__super__.constructor.apply(this, arguments);
    }

    ActivityCollection.prototype.model = Activity;

    ActivityCollection.prototype.url = '/activities/all/';

    ActivityCollection.prototype.comparator = function(activity) {
      return activity.getDate();
    };

    ActivityCollection.prototype.parse = function(response) {
      return response.rows;
    };

    return ActivityCollection;

  })();

  loadingIndicator = new LoadingIndicator;

  confirmationDialog = new ConfirmationDialog;

  infoDialog = new InfoDialog;

  activitiesApp = new ActivitiesView;

  activitiesApp.setWidgets();

  activitiesApp.setListeners();

  activitiesApp.fetch();

}).call(this);
