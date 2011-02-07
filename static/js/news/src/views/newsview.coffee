### Main view for news application
###

class NewsView extends Backbone.View
  el: $("#news")

  # Local variable needed to test if user type a CTRL+Enter keyboard shortcut
  # while typing his post content.
  isCtrl: false

  events:
    "click #news-post-button" : "onPostClicked"
    "submit #news-post-button" : "onPostClicked"
    "click #news-my-button" : "onMineClicked"
    "click #news-more" : "onMoreNewsClicked"


  constructor: ->
    super

  ##
  # Initiliaze bind functions to this view, sets up micropost colleciton
  # behaviours.
  initialize: ->
    _.bindAll(this, 'postNewPost', 'appendOne', 'prependOne', 'addAll')
    _.bindAll(this, 'displayMyNews', 'onMoreNewsClicked', 'addAllMore')
    _.bindAll(this, 'onDatePicked')

    @tutorialOn = true
    @microposts = new MicroPostCollection
    
    @microposts.bind('add', @prependOne)
    @microposts.bind('refresh', @addAll)
        
    @moreMicroposts = new MicroPostCollection
    @moreMicroposts.bind('refresh', @addAllMore)

  ### Events
  ###

  ##
  # When key control is up it set is ctrl pressed variable to false.
  onKeyUp: (event) ->
    if(event.keyCode == 17)
      @isCtrl = false
    event

  ##
  # When key is down, if enter and CTRL are down together, the content field
  # is posted.
  onKeyDown: (event) ->

    if(event.keyCode == 17)
      @isCtrl = true

    if (event.keyCode == 13 and @isCtrl)
      @isCtrl = false
      @postNewPost()
    event
 
  ##
  # When post button is clicked the content field is posted.
  onPostClicked: (event) ->
    event.preventDefault()
    @postNewPost()
    event

  ##
  # When my news is clicked it reloads all news from current user since today.
  onMineClicked: (event) ->
    @clearNews(null)
    @reloadMicroPosts()
    @displayMyNews()
    event

  ##
  # When a date is picked it loads all news from current user since this date.
  onDatePicked: (dateText, event) ->
    d = Date.parse(dateText)
    sinceDate = d.toString("yyyy-MM-dd")

    @clearNews()
    @reloadMicroPosts(sinceDate)


  ### Functions
  ###

  ##
  # Clear micro posts list then display more news button.
  clearNews: ->
    $("#micro-posts").empty()
    $("#news-more").show()

  ##
  # Add more news to current list. It skips first result to not display again
  # last post. If less thant 10 rows are returned, it means that there are 
  # no more posts, so more button is hidden.
  addAllMore: ->
    microPostsArray = @moreMicroposts.toArray().reverse()
    microPostsArray = _.rest(microPostsArray)
    _.each(microPostsArray, @appendOne)
    @lastDate = @moreMicroposts.last().id
    
    if(microPostsArray.length < 10)
      $("#news-more").hide()

    loadingIndicator.hide()
    @lastDate

  ##
  # Add news to current list. If less thant 10 rows are returned, 
  # it means that there are no more posts, so more button is hidden.
  addAll: ->
    if @microposts.length > 0
      @tutorialOn = false
      @lastDate = @microposts.first().id
      if @microposts.length < 10
        $("#news-more").hide()
    else
      if @tutorialOn
        @displayTutorial(1)
      else
        $("#tutorial").html(null)
      $("#news-more").hide()
    @microposts.each(@prependOne)

    loadingIndicator.hide()
    @microposts.length

  ## 
  # Append *micropost* to the beginning of current post list (render it).
  appendOne: (micropost) ->
    row = new MicroPostRow micropost
    el = row.render()
    $("#micro-posts").append(el)
    row

  ## 
  # Prepend *micropost* to the end of current post list (render it).
  prependOne: (micropost) ->
    row = new MicroPostRow micropost
    el = row.render()
    $("#micro-posts").prepend(el)
    loadingIndicator.hide()
    if @tutorialOn
      @displayTutorial(2)
      @tutorialOn = false
    row

  # Displays tutorial in the tutorial DIV element.
  displayTutorial: (index) ->
    $.get("/news/tutorial/" + index + "/", (data) ->
      $("#tutorial").html(data)
    )


  ##
  # Clear post field and focus it.
  clearPostField: () ->
    $("#id_content").val(null)
    $("#id_content").focus()
    $("#id_content")

  ##
  # Clear micro posts lists and reload micro posts until *date*.
  reloadMicroPosts: (date) ->
    loadingIndicator.display()
    @microposts.url = '/news/microposts/'
    if date
      @microposts.url = '/news/microposts/' + date + '-23-59-00/'
    @microposts.fetch()
    @microposts

  ##
  # Reload micro post list.
  fetch: () ->
    @microposts.fetch()
    @microposts

  ##
  # Send a post request to server and add post at the beginning of current 
  # post list.
  postNewPost: ()->
    loadingIndicator.display()
    @microposts.create(content : $("#id_content").val(),
                        success : (nextModel, resp) ->
                            loadingIndicator.hide()
                      )
    $("#id_content").val(null)
    $("#id_content").focus()
    false

  ##
  # When more news is clicked, GET URL is updated with last register date,
  # (because /news/news-item/*date* returns 10 last micro posts until *date*).
  # Then it retrieves posts and display it at the follown of current post list.
  onMoreNewsClicked: ->
    loadingIndicator.display()
    if @lastDate
      @moreMicroposts.url = '/news/microposts/' + @lastDate
    else
      @moreMicroposts.url = '/news/microposts/'

    @moreMicroposts.fetch()
    @moreMicroposts

  ### UI Builders
  ###

  ##
  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
    $("#id_content").keyup((event) -> newsApp.onKeyUp(event))
    $("#id_content").keydown((event) -> newsApp.onKeyDown(event))
    $("input#news-from-datepicker").datepicker({
      onSelect : @onDatePicked
    })

  ##
  # Build JQuery widgets.
  setWidgets: ->
    $("input#news-post-button").button()
    $("#news-my-button").button()
    $("#news-all-button").button()
    $("#news-all-button").button("disable")
    $("#news-more").button()
    $("#news-from-datepicker").val(null)
    $("#news-a").addClass("disabled")

