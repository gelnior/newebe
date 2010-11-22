module("Model: News.Models.MicroPost")

test("findAll", function(){
	stop(2000);
	News.Models.MicroPost.findAll({}, function(micro_posts){
		start()
		ok(micro_posts)
        ok(micro_posts.length)
        ok(micro_posts[0].name)
        ok(micro_posts[0].description)
	});
	
})

test("create", function(){
	stop(2000);
	new News.Models.MicroPost({name: "dry cleaning", description: "take to street corner"}).save(function(micro_post){
		start();
		ok(micro_post);
        ok(micro_post.id);
        equals(micro_post.name,"dry cleaning")
        micro_post.destroy()
	})
})
test("update" , function(){
	stop();
	new News.Models.MicroPost({name: "cook dinner", description: "chicken"}).
            save(function(micro_post){
            	equals(micro_post.description,"chicken");
        		micro_post.update({description: "steak"},function(micro_post){
        			start()
        			equals(micro_post.description,"steak");
        			micro_post.destroy();
        		})
            })

});
test("destroy", function(){
	stop(2000);
	new News.Models.MicroPost({name: "mow grass", description: "use riding mower"}).
            destroy(function(micro_post){
            	start();
            	ok( true ,"Destroy called" )
            })
})