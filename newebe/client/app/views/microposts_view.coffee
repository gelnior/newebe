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

    subscriptions:
        'tag:selected': 'onTagSelected'

    afterRender: ->
        @micropostList = new MicropostListView el: @$ "#micropost-all"
        @isLoaded = false
        @micropostField = @$ "#micropost-field"
        setTimeout =>
            @tagList = new SimpleTagList '#micropost-tag-list'
            @tagList.fetch success: => @tagList.select 'all'
            @configureUpload()
        , 200

    onAddAttachmentClicked: (event) ->
        $(event.target).fadeOut =>
            @$(".js-fileapi-wrapper input").show()
            @$(".js-fileapi-wrapper").fadeIn()

    configureUpload: ->
        input = document.getElementById('attach-picture')
        previewNode = document.getElementById('preview-list')


        FileAPI.event.on input, 'change', (evt) =>
            files = FileAPI.getFiles(evt)
            callback1 = (file, info) =>
                true
            FileAPI.filterFiles files, callback1, (fileList, ignor) =>
                unless fileList.length
                    alert '0 file'
                    return 0
                imageList = FileAPI.filter fileList, (file) =>
                     return /image/.test(file.type)

                @$(".js-fileapi-wrapper input").fadeOut()
                FileAPI.each imageList, (imageFile) =>
                    FileAPI.Image(imageFile)
                        .preview(100, 120)
                        .get (err, image) =>
                            if err then alert err
                            else
                                previewNode.appendChild(image)

                @attachments = imageList


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

            postMicropost = (pictureId) =>
                micropost = new MicroPost()
                if pictureId?
                    micropost.set 'pictures', [pictureId]
                else
                    micropost.set 'pictures', []
                content = @checkLink content
                micropost.set 'tags', [@tagList.selectedTag]
                micropost.save 'content', content,
                    success: =>
                        @micropostList.prependMicropost micropost
                        @micropostField.enable()
                        @micropostField.val null
                        @$("#add-attachment").fadeIn()
                        @$('#preview-list').fadeOut()
                    error: =>
                        @micropostField.enable()
                        @$("#add-attachment").fadeIn()
                        @$('#preview-list').fadeOut()

            if @attachments?.length > 0
                xhr = FileAPI.upload
                    url: '/pictures/all/'
                    files:
                        picture: @attachments[0]
                    complete: (err, xhr) ->
                        if err then alert 'upload failed'
                        picture = JSON.parse xhr.response
                        @attachments = null
                        postMicropost picture._id
            else
                postMicropost()


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
