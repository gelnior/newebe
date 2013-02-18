Model = require 'lib/model'

module.exports = class ContactModel extends Model

    urlRoot: 'contacts/'
    idAttribute: 'slug'
