
# Utilities to render stuff from newebe document data.
module.exports = class Renderer

    markdownConverter: new Showdown.converter()

    renderDoc: (doc) ->
        if doc?
            if doc.get('doc_type') is 'MicroPost'
                rawContent = doc.get 'content'
                content = '<div class="mod left w40">'
                content = @markdownConverter.makeHtml rawContent
                if doc.get('pictures')?.length > 0
                    content += '<img src="static/images/attachment.png" />'
                content += '</div>'
                content += '<div class="mod right w40 micropost-attachments">'
                content += @checkForPictures doc.get 'pictures'
                content += @checkForImages rawContent
                content += @checkForVideos rawContent
                content += '</div>'
                return content
            else if doc.get('doc_type') is 'Common'
                return doc.path
        return ''

    renderDate: (dateString) ->
        date =  moment dateString, 'YYYY-MM-DDThh:mm:ssZ'
        return date.format 'D MMM  YYYY, HH:mm'

    checkForPictures: (pictures) ->
        result = ""
        if pictures?.length > 0
            for picture in pictures
                html = """
<a href="pictures/#{picture}/#{picture}.jpg">
<img class="post-picture" src="pictures/#{picture}/prev_#{picture}.jpg" />
</a>
"""
                result += html
        result

    checkForImages: (content) ->
        regexp = /\[.+\]\((http|https):\/\/\S+\.(jpg|png|gif)\)/g
        urls = content.match regexp
        result = ""

        if urls
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
<iframe class="video" style="max-width: 100%" width="560" height="315"
src="http://www.youtube.com/embed/#{key}"
frameborder="0" allowfullscreen>
</iframe>
</p>
"""

        result
