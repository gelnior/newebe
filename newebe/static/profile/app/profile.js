((function(){var a,b,c,d,e,f,g=function(a,b){return function(){return a.apply(b,arguments)}},h=Object.prototype.hasOwnProperty,i=function(a,b){function d(){this.constructor=a}for(var c in b)h.call(b,c)&&(a[c]=b[c]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a};a=function(){function a(){var a;$("#form-dialog").length===0&&(a=document.createElement("div"),a.id="form-dialog",a.className="dialog",$("body").prepend(a),this.element=$("#form-dialog"),this.element.html('<div id="form-dialog-text"></div>\n<div id="form-dialog-fields">\n</div>\n<div id="form-dialog-buttons">\n  <span id="form-dialog-yes">Yes</span>\n  <span id="form-dialog-no">No</span>\n</div>')),this.element=$("#form-dialog"),this.setNoButton,this.element.hide(),this.fields=[]}return a.prototype.addField=function(a){return this.fields.append(a),a.label&&$("#form-dialog-fields").append('<label for="'+a.name+'"></label>'),$("#form-dialog-fields").append('<input class="form-dialog-field"                 id="form-dialog-field-'+a.name+'"                type="text"                 name="'+a.name+'" />')},a.prototype.clearFields=function(){return this.fields=[],$("#form-dialog-fields").html(null)},a.prototype.setNoButton=function(){return $("#form-dialog-no").click(g(function(){return this.element.fadeOut()},this),!1)},a.prototype.display=function(a,b){return $("#form-dialog-text").empty(),$("#form-dialog-text").append("<span>"+a+"</span>"),$("#form-dialog-yes").click(b),$("#form-dialog-no").click(g(function(){return this.element.fadeOut(),!1},this)),this.element.show()},a.prototype.hide=function(){return this.element.fadeOut()},a}(),b=function(){function a(){this.onDescriptionEditClicked=g(this.onDescriptionEditClicked,this),this.onMouseOut=g(this.onMouseOut,this),this.onMouseOver=g(this.onMouseOver,this),a.__super__.constructor.call(this)}return i(a,Backbone.View),a.prototype.el=$("#profile"),a.prototype.initialize=function(){return _.bindAll(this,"onKeyUp","postUserInfo","fetch","addAll"),this.users=new d,this.isEditing=!1,this.users.bind("reset",this.addAll)},a.prototype.events={"click #profile-description-edit":"onDescriptionEditClicked","click #profile-change-password":"onChangePasswordClicked","mouseover #profile div.app":"onMouseOver","mouseout #profile div.app":"onMouseOut"},a.prototype.onKeyUp=function(a){return this.postUserInfo(),a},a.prototype.onMouseOver=function(a){return $("#profile-description-edit").show(),$("#profile-change-password").show()},a.prototype.onMouseOut=function(a){return $("#profile-description-edit").hide(),$("#profile-change-password").hide()},a.prototype.onDescriptionEditClicked=function(a){return this.isEditing?(this.isEditing=!1,$("#profile-preview").fadeOut(function(){return $("#profile-description").slideUp(function(){return $("#profile-description-display").fadeIn()})})):(this.isEditing=!0,$("#profile-description-display").fadeOut(function(){return $("#profile-description-display").hide(),$("#profile-description").slideDown(function(){return $("#profile-preview").fadeIn()})})),!1},a.prototype.onChangePasswordClicked=function(a){return e.display("test",function(){return alert("yes")})},a.prototype.addAll=function(){return this.users,this.user=this.users.first(),$("#platform-profile-name").val(this.user.getName()),$("#profile-description").val(this.user.getDescription()),$("#platform-profile-url").val(this.user.get("url")),this.renderProfile(),this.user.get("url")||(this.tutorialOn=!0,this.displayTutorial(1)),this.users},a.prototype.fetch=function(){return this.users.fetch(),this.users},a.prototype.postUserInfo=function(){var a;return $("#profile").addClass("modified"),a=this.tutorialOn,this.user.save({name:$("#platform-profile-name").val(),url:$("#platform-profile-url").val(),description:$("#profile-description").val()},{success:function(){return a&&$.get("/profile/tutorial/2/",function(a){return $("#tutorial-profile").html(a)}),$("#profile").removeClass("modified")}}),this.renderProfile()},a.prototype.testTutorial=function(){return this.tutorialOn&&(this.displayTutorial(2),this.tutorialOn=!1),!1},a.prototype.displayTutorial=function(a){return $.get("/profile/tutorial/"+a+"/",function(a){return $("#tutorial-profile").html(a)})},a.prototype.renderProfile=function(){var a,b,c;return c=_.template('<h1 class="profile-name"><%= name %></h1>\n<p class="profile-url"><%= url %></p>\n<p class="profile-description"><%= description %></p>'),b=$("#profile-description").val(),a=new Showdown.converter,b=a.makeHtml(b),$("#profile-description-display").html(b),$("#profile-render").html(c({name:$("#platform-profile-name").val(),url:$("#platform-profile-url").val(),description:b})),this.user},a.prototype.setListeners=function(){return $("#platform-profile-name").keyup(function(a){return f.onKeyUp(a)}),$("#platform-profile-url").keyup(function(a){return f.onKeyUp(a)}),$("#profile-description").keyup(function(a){return f.onKeyUp(a)})},a.prototype.setWidgets=function(){return $("#profile input").val(null),$("#profile-a").addClass("disabled"),$("#profile-description").hide(),$("#profile-preview").hide(),$("#profile-description-edit").button(),$("#profile-description-edit").hide(),$("#profile-change-password").button(),$("#profile-change-password").hide()},a}(),c=function(){function a(b){a.__super__.constructor.apply(this,arguments),this.id="",this.set("url",b.url),this.set("name",b.name),this.set("description",b.description)}return i(a,Backbone.Model),a.prototype.url="/user/",a.prototype.getName=function(){return this.get("name")},a.prototype.setName=function(a){return alert(a),this.set("name",a),alert(this.getName())},a.prototype.getUrl=function(){return this.get("userUrl")},a.prototype.setUrl=function(a){return this.set("url",a)},a.prototype.getDescription=function(){return this.get("description")},a.prototype.setDescription=function(a){return this.set("description",a)},a.prototype.isNew=function(){return!1},a}(),d=function(){function a(){a.__super__.constructor.apply(this,arguments)}return i(a,Backbone.Collection),a.prototype.model=c,a.prototype.url="/user/",a.prototype.parse=function(a){return a.rows},a}(),f=new b,e=new a,f.setWidgets(),f.setListeners(),f.fetch()})).call(this);