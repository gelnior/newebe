  
# Convert markdown url to href link for better display.
convertUrlsToMarkdownLink = (content) ->
  regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g

  urls = content.match(regexp)

  if urls
   for url in urls
     urlIndex = content.indexOf(url)
     if urlIndex == 0 or content.charAt(urlIndex - 1) != '('
       content = content.replace(url, "[" + url + "]" + "(" + url + ")" )
  content

