View = require '../lib/view'
MicroPost = require '../models/micropost'
MicropostListView = require '../views/micropost_list_view'
SimpleTagList = require '../views/simple_tag_list'

module.exports = class MicropostsView extends View
    id: 'microposts-view'
    className: 'pa1'

    template: ->
        require './templates/microposts'

    events:
        "keyup #micropost-field": "onMicropostFieldKeyup"
        "keydown #micropost-field": "onMicropostFieldKeydown"
        "click #micropost-post-button": "createNewPost"
        "click #more-microposts-button": "loadMoreMicroposts"

    subscriptions:
        'tag:selected': 'onTagSelected'

    afterRender: ->
        @micropostList = new MicropostListView el: @$ "#micropost-all"
        @isLoaded = false
        @micropostField = @$ "#micropost-field"
        setTimeout =>
            @tagList = new SimpleTagList '#micropost-tag-list'
            @tagList.fetch success: => @tagList.select 'all'
        , 200

    fetch: ->
        @micropostList.collection.fetch
            success: =>
            error: =>
                alert 'A server error occured while retrieving news feed'

    onMicropostFieldKeydown: (event) =>
        if event.keyCode is 17 then @isCtrl = true

    onMicropostFieldKeyup: (event) =>
        keyCode = if event.which then event.which else event.keyCode

        if event.keyCode is 17 then @isCtrl = false
        else if keyCode is 13 and @isCtrl then @createNewPost()

    createNewPost: =>
        content = @micropostField.val()

        if content?.length isnt 0
            @micropostField.disable()

            micropost = new MicroPost()
            content = @checkLink content
            micropost.set 'tags', [@tagList.selectedTag]
            micropost.save 'content', content,
                success: =>
                    @micropostList.prependMicropost micropost
                    @micropostField.enable()
                    @micropostField.val null
                error: =>
                    @micropostField.enable()

    loadMoreMicroposts: =>
        @micropostList.loadMore()

    checkLink: (content) ->
        regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g
        urls = content.match regexp
        if urls
             for url in urls
                 urlIndex = content.indexOf(url)
                 if urlIndex is 0
                     content = content.replace url, "[#{url}](#{url})"
                 else
                    previousChar = content.charAt(urlIndex - 1)
                    if previousChar isnt '(' and previousChar isnt "["
                        content = content.replace url, "[#{url}](#{url})"
        content

    onTagSelected: (name) ->
        if @tagsView?
            @tagsView.$(".tag-select-button").removeClass 'selected'
        @micropostList.loadTag name
        @tagList.select name
