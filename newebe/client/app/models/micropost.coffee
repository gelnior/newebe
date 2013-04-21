Model = require 'lib/model'
request = require 'lib/request'

module.exports = class MicropostModel extends Model

    urlRoot: 'microposts/all/'
    idAttribute: '_id'

    defaults:
        "tags": ["all"]
