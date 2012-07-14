
class TagCombo extends Backbone.View
  el: "input"
  
  
  constructor: (el) ->
    super()

    @tags = []
    @element = el
    
  fetch: ->
    $.get "/contacts/tags/", (data) =>
      @element.html null
      _.forEach data.rows, (tag) =>
        if tag isnt "all"
          @element.append "<option>#{tag}</option>"
        else
          @element.append "<option selected=\"selected\">#{tag}</option>"

  getSelection: ->
    @element.val()
