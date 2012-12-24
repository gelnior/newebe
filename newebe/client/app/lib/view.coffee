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

    beforeRender: ->

    afterRender: ->

    destroy: ->
        @undelegateEvents()
        @$el.removeData().unbind()
        @remove()
        Backbone.View::remove.call @
