/**
 * @tag models, home
 * Wraps backend micro_post services.  Enables 
 * [News.Models.MicroPost.static.getLast retrieving],
 * [News.Models.MicroPost.static.destroy destroying], and
 * [News.Models.MicroPost.static.create creating] micro_posts.
 */
$.Model.extend('News.Models.MicroPost',

/* @Static */
{
  attributes : { 
    author : 'string',
    content : 'string',
    date : 'date'
  },

  /**
   * Retrieves last micro posts from services.
   *
   * @param {Function} success a callback function that returns wrapped 
   * micro_post objects.
   * @param {Function} error a callback function for an error in the ajax 
   * request.
   */
  getLast: function(params, success, error) {
    $.ajax({
      url: '/news/news-item/',
      type: 'get',
      dataType: 'json',
      // data: params,
      success: this.callback([success]),
      error: error//,
      // fixture: "//news/fixtures/micro_posts.json.get" 
      //calculates the fixture path from the url and type.
    });
  },

  /**
   * Retrieves micro_posts data from services backend since startDate. 
   * startDate format is : YYYY-mm-dd-HH-MM-SS.
   *
   * @param {String} startDate Date since which micro post will be retrieved.
   * @param {Function} success a callback function that returns retrieved
   * micro_post objects.
   * @param {Function} error a callback function for an error in the ajax 
   * request.
   */
  getSince: function(startDate, params, success, error) {
    $.ajax({
      url: '/news/news-item/' + startDate + '/',
      type: 'get',
      dataType: 'json',
      //data: params,
      success: this.callback([success]),
      error: error
    });
  },


  /**
   * Destroys a micro_post posted at dateKey time. dateKey format is : 
   * YYYY-mm-dd-HH-MM-SS.
   *
   * @param {String} dateKey Date of the micro_post.
   * @param {Function} success a callback function that indicates a 
   * successful destroy.
   * @param {Function} error a callback that should be called with an object 
   * of errors.
   */
  destroy: function(dateKey, success, error) {
    $.ajax({
      url: '/news/news-item/' + dateKey + '/',
      type: 'delete',
      dataType: 'json',
      success: success,
      error: error,
      //fixture: "-restDestroy" // uses $.fixture.restDestroy for response.
    });
  },

  /**
   * Send a micro_post creation request to services backend.
   *
   * @param {String} jsonObject JSON Object needed for creation (data). 
   * jsonObject should only have a content field with micro_post. User and 
   * date are set by server.
   * @param {Function} success a callback function that indicates a 
   * successful creation.  
   * @param {Function} error a callback that should be called with an object
   * of errors.
   */
  create: function(jsonObject, success, error){
    $.ajax({
      url: '/news/news-item/',
      type: 'post',
      dataType: 'json',
      success: success,
      error: error,
      data: jsonObject
      //fixture: "-restCreate" //uses $.fixture.restCreate for response.
    });
  }
},

/* @Prototype */
{});
