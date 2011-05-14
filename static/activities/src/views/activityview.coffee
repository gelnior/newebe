## ActivitiesView


# Main view for activity application
class ActivitiesView extends Backbone.View
  el: $("#activities")

  ### Events ###

  events:
    "click #activities-my-button" : "onMineClicked"
    "click #activities-all-button" : "onAllClicked"
    "click #activities-more" : "onMoreActivitiesClicked"


  constructor: ->
    super

  # Initiliaze binds functions to this view, sets up activities colleciton
  # behaviours.
  initialize: ->
    _.bindAll(this, 'appendOne', 'prependOne', 'addAll')
    _.bindAll(this, 'displayMyActivities', 'onMoreActivtiesClicked', 'addAllMore')
    _.bindAll(this, 'onDatePicked')

    @tutorialOn = true
    @activities = new ActivityCollection
    
    @activities.bind('add', @prependOne)
    @activities.bind('refresh', @addAll)
        
    @moreActivities = new ActivityCollection
    @moreActivities.bind('refresh', @addAllMore)

    @currentPath = '/activities/all/'


  ### Listeners  ###

  
  # When my activities is clicked it reloads all acitivities from current user 
  # since today.
  onMineClicked: (event) ->
    $("#activities-my-button").button("disable")
    $("#activities-all-button").button("enable")
    @clearActivities(null)
    $("#activities-from-datepicker").val(null)
    @currentPath = '/activities/mine/'
    @reloadActivities(null)
    event

  # When all activitiess is clicked it reloads actvities from contacts and 
  # user since today.
  onAllClicked: (event) ->
    $("#activities-all-button").button("disable")
    $("#activities-my-button").button("enable")
    @clearActivities(null)
    $("#activities-from-datepicker").val(null)
    @currentPath = '/activities/all/'
    @reloadActivities(null)
    event

  
  # When a date is picked it loads all activities from current user since 
  # this date.
  onDatePicked: (dateText, event) ->
    d = Date.parse(dateText)
    sinceDate = d.toString("yyyy-MM-dd")

    @clearActivities()
    @reloadActivities(sinceDate)


  ### Functions  ###

  
  # Clear activity list then display more activities button.
  clearActivities: ->
    $("#activity-list").empty()
    $("#activities-more").show()

  
  # Add more activties to current list. It skips first result to not display 
  # again last post. If less thant 30 rows are returned, 
  # it means that there are no more posts, so more button is hidden.
  addAllMore: ->
    activitiesArray = @moreActivities.toArray().reverse()
    activitiesArray = _.rest(activitiesArray)
    _.each(activitiesArray, @appendOne)
    @lastDate = @moreActivities.last().getUrlDate()
    
    # In fact server should tell to UI that there is no more post.
    if(activitiesArray.length < 30)
      $("#activities-more").hide()

    loadingIndicator.hide()
    @lastDate

  
  # Add activities to current list. If less than 30 rows are returned, 
  # it means that there are no more activities, so more button is hidden.
  addAll: ->
    if @activities.length > 0
      @tutorialOn = false
      @lastDate = @activities.first().getUrlDate()
      if @activities.length < 30
        $("#activities-more").hide()
    else
      if @tutorialOn
        @displayTutorial(1)
      else
        $("#tutorial").html(null)
      $("#activities-more").hide()
    @activities.each(@prependOne)

    loadingIndicator.hide()
    @activities.length

   
  # Append *activity* to the beginning of current post list (render it).
  appendOne: (activity) ->
    row = new ActivityRow activity
    el = row.render()
    $("#activity-list").append(el)
    row

   
  # Prepend *activity* to the end of current activity list (render it).
  # Displays second tutorial of tutorial mode is on.
  prependOne: (activity) ->
    row = new ActivityRow activity
    el = row.render()
    $("#activity-list").prepend(el)
    loadingIndicator.hide()
    if @tutorialOn
      @displayTutorial(2)
      @tutorialOn = false
    row


  # Displays tutorial in the tutorial DIV element.
  displayTutorial: (index) ->
    $.get("/activities/tutorial/" + index + "/", (data) ->
      $("#tutorial-activities").html(data)
    )

  
  # Clears activity lists and reload activities until *date*.
  reloadActivities: (date, path) ->
    loadingIndicator.display()
    @activities.url = @currentPath
    if date
      @activities.url = @currentPath + date + '-23-59-00/'
    @activities.fetch()
    @activities

  
  # Reloads activity list.
  fetch: () ->
    @activities.fetch()
    @activties

  
  # When more activities is clicked, GET URL is updated with last register date,
  # (because /activities/*date* returns 30 last activities until *date*).
  # Then it retrieves activities and displays it after the current 
  # activity list
  onMoreActivitiesClicked: ->
    loadingIndicator.display()
    if @lastDate
      @moreActivities.url = @currentPath + @lastDate
    else
      @moreActivities.url = @currentPath

    @moreActivities.fetch()
    @moreActivities


  ### UI Builders  ###

  
  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
    $("input#activities-from-datepicker").datepicker({
      onSelect : @onDatePicked
    })

  
  # Build JQuery widgets.
  setWidgets: ->
    $("#activities-my-button").button()
    $("#activities-all-button").button()
    $("#activities-all-button").button("disable")
    $("#activities-more").button()
    $("#activities-from-datepicker").val(null)

