/*global module: true, ok: true, equals: true, S: true, test: true */
module("micro_post", {
	setup: function () {
		// open the page
		S.open("//news/news.html");

		//make sure there's at least one micro_post on the page before running a test
		S('.micro_post').exists();
	},
	//a helper function that creates a micro_post
	create: function () {
		S("[name=name]").type("Ice");
		S("[name=description]").type("Cold Water");
		S("[type=submit]").click();
		S('.micro_post:nth-child(2)').exists();
	}
});

test("micro_posts present", function () {
	ok(S('.micro_post').size() >= 1, "There is at least one micro_post");
});

test("create micro_posts", function () {

	this.create();

	S(function () {
		ok(S('.micro_post:nth-child(2) td:first').text().match(/Ice/), "Typed Ice");
	});
});

test("edit micro_posts", function () {

	this.create();

	S('.micro_post:nth-child(2) a.edit').click();
	S(".micro_post input[name=name]").type(" Water");
	S(".micro_post input[name=description]").type("\b\b\b\b\bTap Water");
	S(".update").click();
	S('.micro_post:nth-child(2) .edit').exists(function () {

		ok(S('.micro_post:nth-child(2) td:first').text().match(/Ice Water/), "Typed Ice Water");

		ok(S('.micro_post:nth-child(2) td:nth-child(2)').text().match(/Cold Tap Water/), "Typed Cold Tap Water");
	});
});

test("destroy", function () {

	this.create();

	S(".micro_post:nth-child(2) .destroy").click();

	//makes the next confirmation return true
	S.confirm(true);

	S('.micro_post:nth-child(2)').missing(function () {
		ok("destroyed");
	});

});