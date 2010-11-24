/*global confirm: true */

/**
 * @tag controllers, home
 * Displays a table of micro_posts.	 Lets the user 
 * ["News.Controllers.MicroPost.prototype.form submit" create], 
 * ["News.Controllers.MicroPost.prototype.&#46;edit click" edit],
 * or ["News.Controllers.MicroPost.prototype.&#46;destroy click" destroy] micro_posts.
 */
$.Controller.extend('News.Controllers.MicroPost',

/* @Static */
{
	onDocument: true,
    docController: null
},

/* @Prototype */
{
 /**
 * When the page loads, gets all micro_posts to be displayed.
 */


  /* Members */

  /** 
   * Store date of last micro post displayed. It is needed when user 
   *  requests for more. Backend need a date and not a page number. 
   */
  lastRowDate : "",
  /** 
   * isCtrl is used to handle ctrl+enter keyboard shortcut when writing
   * posts. When shortcut is activated, it posts the typed text. 
   */
  isCtrl : false,
   

  /* Init functions */

  /**
   * When page is initialized, it makes all jquery ui widgets then it
   * focus on post text area. 
   * Finally it retrieves last posts.
   */
  ready: function() {
    News.Controllers.MicroPost.docController = this;
    this.initWidgets();
    News.Models.MicroPost.getLast({}, this.callback('list'));
    this.clearAndFocusTextArea();
  },
 
  /**
   * Initialize widgets, set up buttons and date picker.
   */
  initWidgets: function() {
    $("input#news-post-button").button();
    $("#news-my-button").button();
    $("#news-all-button").button();
    $("#news-all-button").button("disable");
    $("#news-more").button();
    $("#news-from-datepicker").datepicker({onSelect : this.datePicked});  
    $("#news-from-datepicker").val(null);

    //$('.news-news').live('hoverenter', this.hoverenter)
    //$('.news-news').live('hoverleave', this.hoverleave)
  },


  /* Utils functions */

  /** Cleat post text area and focus it. */
  clearAndFocusTextArea: function() {
    $("#id_content").val(null);
    $("#id_content").focus();
  },
  
  /** Remove all displayed posts. */
  clearMicroPosts: function() {
    $("#newss").empty();
    $("#news-more").show();
  },

  /** Configure delete buttons and hide them. */
  setDeleteButtons: function() {
    $("a.news-delete").button();
    $("a.news-delete").hide();
  },


  /* Events functions */

  /**
   * When a date is picked in date picker, it clears micro posts and retrieve
   * last 10 micro posts since date represented by dateText.
   *
   * @param {String} dateText Text corresponding to date set by date picker.
   * @param {?} inst ?
   */
  datePicked: function(dateText, inst) {
    News.Controllers.MicroPost.docController.clearMicroPosts();
    d = Date.parse(dateText);
    sinceDate = d.toString("yyyy-MM-dd");
    News.Controllers.MicroPost.docController.loadNewsSince(sinceDate);
  },

  /** 
   * When my button is clicked. it clears since field, and reloads last
   * 10 last micro posts.
   */
 '#news-my-button click': function() {
    $("#news-from-datepicker").val(null);
    this.clearMicroPosts();
    News.Models.MicroPost.getLast({}, this.callback('list'));
    this.clearAndFocusTextArea();
  },

  /**
   * When more button is clicked it retrieves last 10 micro posts.
   */
  '#news-more click': function() {
    News.Models.MicroPost.getSince(this.lastRowDate, {}, 
                                   this.callback('list'));
  },

  /**
   * When post button is clicked, it posts a new micro post and add it to the
   * micro post list.
   */
  '#news-post-button click' : function() {
    this.postMicroPost();
    return false;
  },

  /**
   * When delete micro post button is clicked, a confirm dialog box is 
   * displayed, then it sends a delete request to backend and remove it from
   * micro post list.
   *
   * @param {Element} el The clicked delete button.
   * @param {Event} ev The delete button click event.
   */
  '.news-delete click' : function(el, ev) {
	if (confirm("Are you sure you want to destroy this micro post ?")) {
      this.deleteMicroPost(el.parent());
    }
  },

  /**
   * When a key is up on post text area, it sets isCtrl variable to false.
   *
   * @param {Element} el The post text area.
   * @param {Event} ev The key up event.
   */
  '#id_content keyup' : function(el, ev) {
      if (ev.keyCode == '17') this.isCtrl=false;
  },

  /**
   * When a key is down on post text area, it sets isCtrl variable to true
   * if control key is pressed. If control key is pressed while enter key 
   * is pressed, text is posted to backend as a new micro post.
   *
   * @param {Element} el The post text area.
   * @param {Event} ev The key down event.
   */
  '#id_content keydown' : function(el, ev) {
    if (ev.keyCode == '17') this.isCtrl=true; 
    if (ev.keyCode == '13' && this.isCtrl == true) {
       this.isCtrl = false;
       this.postMicroPost();
    } 
  },
 
  /** 
   * When mouse is over a micropost, it displays the micro post delete button.
   *
   * @param {Element} el The micro post div.
   * @param {Event} ev The hover event.
   */
  '.news-news hoverenter' : function(el, ev) {
    $(".news-delete", el).show();
  },
 
  /** 
   * When mouse leaves a micropost, it hides the micro post delete button.
   *
   * @param {Element} el The micro post div.
   * @param {Event} ev The leave event.
   */
  '.news-news hoverleave' : function(el, ev) {
    $(".news-delete", el).hide();
  },


  /** Loading function and model callbacks */

  /**
   * Loads micro posts since sinceDate.
   *
   * @param {String} sinceDate Date since when micro posts should be retrived.
   */
  loadNewsSince: function(sinceDate) {
    News.Models.MicroPost.getSince(sinceDate + "-23-59-00", {}, 
                                   this.callback('list'));
    this.clearAndFocusTextArea();
  },

  /**
   * Sends to backend a micro post creation request for content in post
   * text area.
   */
  postMicroPost: function() {
    jsonString = '{"content": "' +  $("#id_content").val() + '"}';
    News.Models.MicroPost.create(jsonString , this.callback('createMicroPost'));
    this.clearAndFocusTextArea();
  },

  /** 
   * From post object, generates a micro post div, set up buttons, then
   * clear post text area and focus it.
   *
   * @param {Object} post Micro post returned by backend after creation.
   */
  createMicroPost: function(post) { 
    $('#newss').prepend(this.getHtmlFromMicroPost(post));
    
    this.setDeleteButtons();
    this.clearAndFocusTextArea()
  },

  /**
   * Request micro post deletion to backend then remove it from post list. 
   *
   * @param {Element} el Micro post div.
   */
  deleteMicroPost: function(el) {
    id = el.attr('id');
    News.Models.MicroPost.destroy(id, function() { 
      el.remove();
    }); 
  },

  /**
   * Return HTML code from a micro post object (use show.ejs template). 
   *
   * @param {Object} post Micro post from which HTML is requested.
   */
  getHtmlFromMicroPost: function(post) {
    micro_post = new News.Models.MicroPost();
    
    micro_post.content = post.content;
    micro_post.author = post.author;
    var d = Date.parse(post.date);
    micro_post.date = d.toString("dd/MM - HH:mm:ss");
    var id = d.toString('yyyy-MM-dd-HH-mm-ss');
    
    return this.view('show', {micro_post: micro_post, id:id});
  },


 /**
 * Displays a list of micro_posts and the submit form.
 * @param {Array} micro_posts An array of News.Models.MicroPost objects.
 */
 list: function(micro_posts) { 
    total_rows = micro_posts.total_rows;
    rows = micro_posts.rows;

    for (var rowIdx in rows) {
      row = rows[rowIdx];
      $('#newss').append(this.getHtmlFromMicroPost(row));
    }

    if (rows.length > 0) {
      this.lastRowDate = rows[rows.length -1].date;
      this.lastRowDate = this.lastRowDate.replace(" ", "-");
      this.lastRowDate = this.lastRowDate.replace(":", "-");
      this.lastRowDate = this.lastRowDate.replace(":", "-");    

      this.setDeleteButtons();
    }
    if (rows.length < 10) {
      $("#news-more").hide();
    } else {
      $("#news-more").show();
    } 
  },


 /**
 *	 Listens for micro_posts being destroyed and removes them from being displayed.
 */
//"micro_post.destroyed subscribe": function(called, micro_post){
//	micro_post.elements().remove();	 //removes ALL elements
// }
});

