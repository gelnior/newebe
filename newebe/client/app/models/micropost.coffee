Model = require 'lib/model'
request = require 'lib/request'

module.exports = class Micropost extends Model

    urlRoot: '/microposts/all/'
    idAttribute: '_id'

    defaults:
        "tags": ["all"]

    downloadPicture: (pictureId, callback) ->
       request.get "/pictures/#{pictureId}/download/", callback

    downloadCommon: (commonId, callback) ->
       request.get "/commons/#{commonId}/download/", callback
