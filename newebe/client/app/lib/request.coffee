# Make ajax request more easy to do.
# Expected callbacks: success and error
exports.request = (type, url, data, callback) ->
    $.ajax
        type: type
        url: url
        data: if data? then JSON.stringify data else null
        contentType: "application/json"
        dataType: "json"
        success: (data) ->
            callback null, data if callback?
        error: (data) ->
            if data? and data.msg? and callback?
                callback new Error data.msg
            else if callback?
                callback new Error "Server error occured"

# Sends a get request with data as body
# Expected callbacks: success and error
exports.get = (url, callback) ->
    exports.request "GET", url, null, callback

# Sends a post request with data as body
# Expected callbacks: success and error
exports.post = (url, data, callback) ->
    exports.request "POST", url, data, callback

# Sends a put request with data as body
# Expected callbacks: success and error
exports.put = (url, data, callback) ->
    exports.request "PUT", url, data, callback

# Sends a delete request with data as body
# Expected callbacks: success and error
exports.del = (url, callback) ->
    exports.request "DELETE", url, null, callback
