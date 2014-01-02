request = require './request'

# Utilities to render stuff from newebe document data.
module.exports = class Renderer

    markdownConverter: new Showdown.converter()

    # Check on what could be improved for a proper display of a given document.
    # Actually only micropost are handled by this function.
    renderDoc: (doc) ->
        if doc?
            if doc.get('doc_type') is 'MicroPost'
                rawContent = doc.get 'content'
                rawContent = sanitize(rawContent).escape()
                content = '<div class="mod left w40">'
                content = @markdownConverter.makeHtml rawContent

                if doc.get('pictures')?.length > 0 or
                   doc.get('pictures_to_download')?.length > 0

                    content += '<img src="static/images/attachment.png" />'

                if doc.get('commons')?.length > 0 or
                   doc.get('commons_to_download')?.length > 0

                    content += '<img src="static/images/attachment.png" />'

                content += '</div>'
                content += '<div class="mod right w40 micropost-attachments">'
                content += @checkForPictures doc.get 'pictures'
                content += @checkForPicturesToDl doc.get 'pictures_to_download'
                content += @checkForCommons doc.get 'commons'
                content += @checkForCommonsToDl doc.get 'commons_to_download'
                content += @checkForImages rawContent
                content += @checkForVideos rawContent
                content += '</div>'
                return content
        return ''


    # Transform a CouchDB formatted date to a human readable date.
    renderDate: (dateString) ->
        date =  moment dateString, 'YYYY-MM-DDThh:mm:ssZ'
        date.format 'D MMM  YYYY, HH:mm'


    # Return embedded picture code for an array of neweve picture IDs.
    checkForPictures: (pictures) ->
        result = ""
        if pictures?.length > 0
            for picture in pictures
                result += """
<a href="pictures/#{picture}/#{picture}.jpg">
<img class="post-picture" src="pictures/#{picture}/prev_#{picture}.jpg" />
</a>
"""
        result

    checkForPicturesToDl: (pictures) ->
        result = ""
        if pictures?.length > 0
            for picture in pictures
                result += """
                <p>The image is not avalaible yet, you need to download it
                first.</p>
                <button class="download-picture-btn">download</button>
                """
        result

    checkForCommons: (commons) ->
        result = ""
        if commons?.length > 0
            for commonId in commons
                if commonId?
                    result += "<a id=\"common-#{commonId}\"></a>"
                    request.get "/commons/#{commonId}/", (err, commonRows) ->
                        common = commonRows.rows[0]
                        link = "/commons/#{commonId}/#{common.path}"
                        $("#common-#{commonId}").attr 'href', link
                        $("#common-#{commonId}").html common.path
        result

    checkForCommonsToDl: (commons) ->
        result = ""
        if commons?.length > 0
            for common in commons
                result += """
                <p>The common is not avalaible yet, you need to download it
                first.</p>
                <button class="download-common-btn">download</button>
                """
        result


    # Look for image URL and return embedded code corresponding to these
    # pictures.
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


    # Extract url from a markdown link [text](url)
    getUrlFromMarkdown: (markdownLink) ->
        index = markdownLink.indexOf "("
        markdownLink.substring index + 1, markdownLink.length - 1


    # Look for youtube videos and return embedded code corresponding to these
    # videos.
    # Remember we analyze markdown code, not displayed text.
    checkForVideos: (content) ->
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
