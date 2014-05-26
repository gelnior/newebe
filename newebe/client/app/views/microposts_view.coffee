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
        "click #add-attachment": "onAddAttachmentClicked"
        "keyup #microposts-search": "onSearchKeyUp"

    subscriptions:
        'tag:selected': 'onTagSelected'
        'posts:no-more': 'onNoMorePost'

    afterRender: ->
        @micropostList = new MicropostListView el: @$ "#micropost-all"
        @isLoaded = false
        @micropostField = @$ "#micropost-field"
        @micropostButton = @$ "#micropost-post-button"
        setTimeout =>
            @tagList = new SimpleTagList '#micropost-tag-list'
            @tagList.fetch success: => @tagList.select 'all'
            @configureUpload()
            @$("#micropost-field").focus()
        , 200
        @configurePublisherSubscription()
        @isSearchRunning = false

    configurePublisherSubscription: ->

        protocol = ""
        if window.location.protocol is 'http:'
            protocol = 'ws'
        else if window.location.protocol is 'https:'
            protocol = 'wss'
        host = window.location.host
        path = "#{protocol}://#{host}/microposts/publisher/"

        @ws = new WebSocket path
        @ws.onmessage = (evt) =>
            micropost = new MicroPost JSON.parse evt.data
            @micropostList.prependMicropost micropost

    configureUpload: ->
        input = document.getElementById 'attach-picture'
        previewNode = document.getElementById 'preview-list'

        FileAPI.event.on input, 'change', (evt) =>
            files = FileAPI.getFiles(evt)

            callback1 = (file, info) =>
                true

            FileAPI.filterFiles files, callback1, (fileList, ignor) =>
                unless fileList.length
                    alert 'No file selected, no upload possible'
                    return 0

                imageList = FileAPI.filter fileList, (file) =>
                     return /image/.test(file.type)

                fileList = FileAPI.filter fileList, (file) =>
                     return not /image/.test(file.type)

                @$(".js-fileapi-wrapper input").fadeOut()
                FileAPI.each imageList, (imageFile) =>
                    FileAPI.Image(imageFile)
                        .preview(100, 120)
                        .get (err, image) =>
                            if err then alert err
                            else
                                previewNode.appendChild(image)

                FileAPI.each fileList, (file) =>
                    $(previewNode).append "<p>#{file.name}</p>"

                @attachedImages = imageList
                @attachedFiles = fileList

    fetch: ->
        @$(".tag-all .tag-select-button").addClass 'selected'
        @micropostList.loadTag 'all'

    onAddAttachmentClicked: (event) ->
        $(event.target).fadeOut =>
            @$(".js-fileapi-wrapper input").show()
            @$(".js-fileapi-wrapper").fadeIn()

    # The two followings function are here to support the ctrl+enter combo
    # that sends the post to the newebe server.
    onMicropostFieldKeydown: (event) =>
        if event.keyCode is 17 then @isCtrl = true

    onMicropostFieldKeyup: (event) =>
        keyCode = if event.which then event.which else event.keyCode

        if event.keyCode is 17 then @isCtrl = false
        else if keyCode is 13 and @isCtrl then @createNewPost()

    createNewPost: =>
        content = @micropostField.val()

        attachmentButton = @$("#add-attachment")
        previewList = @$('#preview-list')

        if content?.length isnt 0
            @micropostButton.spin 'small'
            @micropostField.disable()

            postMicropost = (pictureId, fileId) =>
                micropost = new MicroPost()
                if pictureId? then micropost.set 'pictures', [pictureId]
                else micropost.set 'pictures', []
                if fileId? then micropost.set 'commons', [fileId]
                else micropost.set 'commons', []
                content = @checkLink content
                micropost.set 'tags', [@tagList.selectedTag]
                micropost.save 'content', content,
                    success: =>
                        @micropostButton.spin()
                        @micropostList.prependMicropost micropost
                        @micropostField.val null
                    error: =>
                        @micropostButton.spin()
                    complete: =>
                        @micropostField.enable()
                        attachmentButton.fadeIn()
                        previewList.fadeOut()
                        previewList.html null
                        previewList.fadeIn()
                        $('#attach-picture').val null

            if @attachedImages?.length > 0
                xhr = FileAPI.upload
                    url: '/pictures/all/'
                    files:
                        picture: @attachedImages[0]
                    complete: (err, xhr) ->
                        if err then alert 'upload failed'
                        picture = JSON.parse xhr.response
                        @attachedImages = null
                        postMicropost picture._id

            else if @attachedFiles?.length > 0
                xhr = FileAPI.upload
                    url: '/commons/all/'
                    files:
                        common: @attachedFiles[0]
                    complete: (err, xhr) ->
                        if err then alert 'upload failed'
                        file = JSON.parse xhr.response
                        @attachedFiles = null
                        postMicropost null, file._id

            else
                postMicropost()

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
        @tagsView.$(".tag-select-button").unSelect() if @tagsView?
        @tagList.select name
        @$("#microposts-search").val null
        @micropostList.loadTag name

    loadMoreMicroposts: =>
        button = $ "#more-microposts-button"
        button.spin 'small'
        @micropostList.loadMore =>
            button.spin()

    onNoMorePost: ->
        @$("#more-microposts-button").hide()

    onSearchKeyUp: (event) =>
        $(".tag-select-button").removeClass 'selected'
        runSearch = =>
            @isSearchRunning = true
            searchVal = $("#microposts-search").val()
            if searchVal.length is 0
                @fetch()
            else
                @micropostList.search searchVal, =>
                    @isSearchRunning = false
                    runSearch() if searchVal isnt $("#microposts-search").val()

            setTimeout =>
                @isSearchRunning = false
            , 2000

        runSearch() if @isSearchRunning is false
