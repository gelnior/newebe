steal.plugins(	
	'jquery/controller',            // a widget factory
	'jquery/controller/subscribe',  // subscribe to OpenAjax.hub
	'jquery/view/ejs',              // client side templates
	'jquery/model',                 // Ajax wrappers
	'jquery/dom/fixture',           // simulated Ajax requests
	'jquery/dom/form_params',       // form data helper
    'jquery/event/hover')           // Hover event handling
	
	.css('news')                    // loads styles

	.resources()					// 3rd party script's (like jQueryUI), 
                                    // in resources folder

	.models('micro_post')           // loads files in models folder 
	.controllers('micro_post')      // loads files in controllers folder
	.views();                       // adds views to be added to build
