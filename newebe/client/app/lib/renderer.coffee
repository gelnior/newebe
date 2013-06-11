
# Utilities to render stuff from newebe document data.
module.exports = class Renderer

    markdownConverter: new Showdown.converter()

    renderDoc: (doc) ->
        if doc?
            if doc.doc_type is 'MicroPost'
                content = @markdownConverter.makeHtml doc.content
                content += @checkForImages doc.content
                return content
            else if doc.doc_type is 'Picture'
                return "<img src= \"/pictures/# doc._id}/th_#{doc.path}V5\" />"
            else if doc.doc_type is 'Common'
                return doc.path
        return ''

    renderDate: (dateString) ->
        date =  moment dateString, 'YYYY-MM-DDThh:mm:ssZ'
        return date.format 'D MMM  YYYY, HH:mm'

    checkForImages: (content) ->
        regexp = /\[.+\]\((http|https):\/\/\S+\.(jpg|png|gif)\)/g
        console.log content

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
