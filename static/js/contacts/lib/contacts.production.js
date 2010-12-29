(function(){var h,i,f,c,j=Object.prototype.hasOwnProperty,e=function(a,b){function d(){this.constructor=a}for(var g in b)if(j.call(b,g))a[g]=b[g];d.prototype=b.prototype;a.prototype=new d;a.__super__=b.prototype;return a};h=function(){function a(b){a.__super__.constructor.apply(this,arguments);this.set("url",b.url);this.id=b.slug+"/";b.state&&this.set("state",b.state)}e(a,Backbone.Model);a.prototype.url="/platform/contacts/";a.prototype.getUrl=function(){return this.get("url")};a.prototype.getState=
function(){return this.get("state")};a.prototype["delete"]=function(){this.url="/platform/contacts/"+this.id;this.destroy();return this.view.remove()};a.prototype.saveToDb=function(){this.url="/platform/contacts/"+this.id;this.save();return this.url};a.prototype.isNew=function(){return!this.getState()};return a}();i=function(){function a(){a.__super__.constructor.apply(this,arguments)}e(a,Backbone.Collection);a.prototype.model=h;a.prototype.url="/platform/contacts/";a.prototype.comparator=function(b){return b.getUrl()};
a.prototype.parse=function(b){return b.rows};return a}();f=function(){function a(b){this.model=b;a.__super__.constructor.apply(this,arguments);this.model.view=this}e(a,Backbone.View);a.prototype.tagName="div";a.prototype.className="platform-contact-row";a.prototype.template=_.template('<span class="platform-contact-row-buttons">\n<% if (state === "Wait for approval") { %>\n  <a class="platform-contact-wap">Confim</a>\n<% } else if (state !== "Trusted") { %>\n  <a class="platform-contact-resend">Resend</a>\n<% } %>\n<a class="platform-contact-delete">X</a>    \n</span>\n<p class="platform-contact-url">\n <%= url %> \n <span> (<%= state %>)</span>\n</p>');
a.prototype.events={"click .platform-contact-delete":"onDeleteClicked","click .platform-contact-wap":"onConfirmClicked",mouseover:"onMouseOver",mouseout:"onMouseOut"};a.prototype.onMouseOver=function(){return this.$(".platform-contact-row-buttons").show()};a.prototype.onMouseOut=function(){return this.$(".platform-contact-row-buttons").hide()};a.prototype.onDeleteClicked=function(){return this.model["delete"]()};a.prototype.onConfirmClicked=function(){return this.model.saveToDb()};a.prototype.remove=
function(){return $(this.el).remove()};a.prototype.render=function(){$(this.el).html(this.template(this.model.toJSON()));this.$(".platform-contact-delete").button();this.$(".platform-contact-resend").button();this.$(".platform-contact-wap").button();this.$(".platform-contact-row-buttons").hide();return this.el};return a}();c=new (function(){function a(){a.__super__.constructor.apply(this,arguments)}e(a,Backbone.View);a.prototype.el=$("#news");a.prototype.isCtrl=false;a.prototype.events={"click #contact-post-button":"onPostClicked",
"submit #contact-post-button":"onPostClicked","click #contact-alm-button":"onAllClicked","click #contact-pending-button":"onPendingClicked","click #contact-request-button":"onRequestClicked"};a.prototype.initialize=function(){_.bindAll(this,"postNewContact","appendOne","prependOne","addAll");_.bindAll(this,"onPostClicked");this.contacts=new i;this.contacts.bind("add",this.prependOne);return this.contacts.bind("refresh",this.addAll)};a.prototype.onKeyUp=function(b){if(b.keyCode===17)this.isCtrl=false;
return b};a.prototype.onKeyDown=function(b){if(b.keyCode===17)this.isCtrl=true;if(b.keyCode===13&&this.isCtrl){this.isCtrl=false;this.postNewContact()}return b};a.prototype.onPostClicked=function(b){b.preventDefault();this.postNewContact();return b};a.prototype.onAllClicked=function(b){b.preventDefault();return this.reloadContacts("/platform/contacts/")};a.prototype.onPendingClicked=function(b){b.preventDefault();return this.reloadContacts("/platform/contacts/pending/")};a.prototype.onRequestClicked=
function(b){b.preventDefault();return this.reloadContacts("/platform/contacts/requested/")};a.prototype.reloadContacts=function(b){this.clearContacts();this.contacts.url=b;this.contacts.fetch();return this.contacts};a.prototype.clearContacts=function(){return $("#contacts").empty()};a.prototype.addAll=function(){this.contacts.each(this.appendOne);return this.contacts};a.prototype.appendOne=function(b){var d;d=new f(b);b=d.render();$("#contacts").prepend(b);return d};a.prototype.prependOne=function(b){var d;
d=new f(b);b=d.render();$("#contacts").prepend(b);return d};a.prototype.clearPostField=function(){$("#contact-url-field").val(null);$("#contact-url-field").focus();return $("#contact-url-field")};a.prototype.fetch=function(){this.contacts.fetch();return this.contacts};a.prototype.postNewContact=function(){this.contacts.create({url:$("#contact-url-field").val()});$("#contact-url-field").val(null);$("#contact-url-field").focus();return false};a.prototype.setListeners=function(){$("#contact-url-field").keyup(function(b){return c.onKeyUp(b)});
$("#contact-url-field").keydown(function(b){return c.onKeyDown(b)});$("#contact-post-button").submit(function(b){return c.onPostClicked(b)});$("#contact-post-button").click(function(b){return c.onPostClicked(b)});$("#contact-all-button").click(function(b){return c.onAllClicked(b)});$("#contact-pending-button").click(function(b){return c.onPendingClicked(b)});return $("#contact-request-button").click(function(b){return c.onRequestClicked(b)})};a.prototype.setWidgets=function(){$("#contact-all-button").button();
$("#contact-pending-button").button();$("#contact-request-button").button();$("input#contact-post-button").button();return $("#contact-a").addClass("disabled")};return a}());c.setWidgets();c.setListeners();c.clearPostField();c.fetch()}).call(this);
