
exports.isSpecialKey = (key) ->
    keychar = String.fromCharCode(key).toLowerCase()
    if (key is null) or (key is 0) or (key is 8) or (key is 9) or
    (key is 13) or (key is 27)
         return true
    else if ('abcdefghijklmnopqrstuvwxyz0123456789').indexOf(keychar) is -1
        event.preventDefault()
        return false


