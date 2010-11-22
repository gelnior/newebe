//steal/js news/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('news/scripts/build.html',{to: 'news'});
});
