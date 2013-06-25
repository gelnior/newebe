Model = require 'lib/model'

module.exports = class Micropost extends Model

    urlRoot: '/microposts/all/'
    idAttribute: '_id'

    defaults:
        "tags": ["all"]
