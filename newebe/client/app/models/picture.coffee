Model = require '../lib/model'

module.exports = class PictureModel extends Model
    urlRoot: "pictures/all/"
    idAttribute: '_id'

    constructor: (picture) ->
        super picture

        if @get('path')?
            path = @get('path')
        else
            path = @get('_id') + '.jpg'

        @set 'url', "/pictures/#{picture._id}/#{path}"
        @set 'prevUrl', "/pictures/#{picture._id}/prev_#{path}"
