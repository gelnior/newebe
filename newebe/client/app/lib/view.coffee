module.exports = class View extends Backbone.View
    tagName: 'div'

    template: ->

    initialize: ->
        @render()

    getRenderData: ->
        model: @model?.toJSON()

    render: ->
        @beforeRender()
        @$el.html @template()(@getRenderData())
        @afterRender()
        @

    publish: (channel, data) ->
        Backbone.Mediator.pub channel, data

    beforeRender: ->

    afterRender: ->

    destroy: ->
        @undelegateEvents()
        @$el.removeData().unbind()
        @remove()
        Backbone.View::remove.call @

    hide: -> @$el.hide()
    show: -> @$el.show()
    fadeOut: (callback) -> @$el.fadeOut callback
    fadeIn: (callback) -> @$el.fadeIn callback
