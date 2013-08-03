module.exports = class PicturesCollection extends Backbone.Collection
    model: require '../models/picture'
    url: 'pictures/all/'

    parse: (response) -> response.rows
