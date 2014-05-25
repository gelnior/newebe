module.exports = class CommonsCollection extends Backbone.Collection
    model: require '../models/common'
    url: 'commons/all/'

    parse: (response) -> response.rows
