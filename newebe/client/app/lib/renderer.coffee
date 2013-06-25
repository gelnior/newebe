
# Utilities to render stuff from newebe document data.
module.exports = class Renderer

    markdownConverter: new Showdown.converter()

    renderDoc: (doc) ->
        if doc?
            if doc.get 'doc_type' is 'MicroPost'
                content = @markdownConverter.makeHtml doc.content
                content += @checkForImages doc.content
                content += @checkForVideos doc.content
                return content
            else if doc.get 'doc_type' is 'Picture'
                return "<img src= \"/pictures/# doc._id}/th_#{doc.path}V5\" />"
            else if doc.get 'doc_type' is 'Common'
                return doc.path
        return ''

    renderDate: (dateString) ->
        date =  moment dateString, 'YYYY-MM-DDThh:mm:ssZ'
        return date.format 'D MMM  YYYY, HH:mm'

    checkForImages: (content) ->
        regexp = /\[.+\]\((http|https):\/\/\S+\.(jpg|png|gif)\)/g
        urls = content.match regexp
        console.log urls

        result = ""

        if urls
            result += "<p>Embedded pictures: </p>"

            for url in urls
                url = @getUrlFromMarkdown url

                if url
                    result += """
<p>
<img style="max-width: 100%;"
src="#{url}"
alt="Image #{url}" />
</img>
</p>
"""
        return result

    getUrlFromMarkdown: (markdownLink) ->
        index = markdownLink.indexOf "("
        markdownLink.substring index + 1, markdownLink.length - 1

    checkForVideos: (content) ->
        # Remember we analyze markdown code, not displayed text.
        regexp = /\[.+\]\((http|https):\/\/\S*youtube.com\/watch\?v=\S+\)/g
        urls = content.match(regexp)
        result = ""

        if urls
            result += "<p>Embedded videos: </p>"

            for url in urls
                url = @getUrlFromMarkdown url

                res = url.match(/v=\S+&/)
                key = res[0] if res?

                unless key
                    res = url.match(/v=\S+/)
                    key = res[0] if res?

                if key
                    if key.indexOf("&") > 0
                        key = key.substring 2, (key.length - 1)
                    else
                        key = key.substring 2, key.length

                    result += """
<p>
<iframe class="video" width="50%" height="315"
src="http://www.youtube.com/embed/#{key}"
frameborder="0" allowfullscreen>
</iframe>
</p>
"""

        result
