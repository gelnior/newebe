Model = require '../lib/model'

module.exports = class CommonModel extends Model
    urlRoot: "commons/all/"
    idAttribute: '_id'

    constructor: (common) ->
        super common

        if @get('path')?
            path = @get('path')
        else
            path = @get('_id') + '.jpg'

        @set 'url', "/commons/#{common._id}/#{path}"
        @set 'prevUrl', "/commons/#{common._id}/prev_#{path}"
