
# Utilities to render stuff from newebe document data.
module.exports = class Renderer

    markdownConverter: new Showdown.converter()

    renderDoc: (doc) ->
        if doc?
            if doc.doc_type is 'MicroPost'
                return @markdownConverter.makeHtml doc.content
            else if doc.doc_type is 'Picture'
                return "<img src= \"/pictures/# doc._id}/th_#{doc.path}\" />"
            else if doc.doc_type is 'Common'
                return doc.path
        return ''

    renderDate: (dateString) ->
        date =  moment dateString, 'YYYY-MM-DDThh:mm:ssZ'
        return date.format 'D MMM  YYYY, HH:mm'
