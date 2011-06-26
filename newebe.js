$(function(){
    $('#installation').hide();
    $('#documentation').hide();
    $('#contact').hide();
    $('#developers').hide();
    var lastSelected = $('#home');
    var lastSelectedMenu = $('#menu-home');
    lastSelectedMenu.addClass('selected');

    $('#menu-home').click(function(event) {
        lastSelected.fadeOut(300, function() {
            $('#home').fadeIn(500);
        });
        lastSelected = $('#home');
        lastSelectedMenu.removeClass('selected');
        lastSelectedMenu = $('#menu-home');
        lastSelectedMenu.addClass('selected');
    });
    $('#menu-installation').click(function(event) {
        lastSelected.fadeOut(300, function() {
            $('#installation').fadeIn(500);
        });
        lastSelected = $('#installation');
        lastSelectedMenu.removeClass('selected');
        lastSelectedMenu = $('#menu-installation');
        lastSelectedMenu.addClass('selected');
    });
    $('#menu-documentation').click(function(event) {
        lastSelected.fadeOut(300, function() {
            $('#documentation').fadeIn(300);
        });
        lastSelected = $('#documentation');
        lastSelectedMenu.removeClass('selected');
        lastSelectedMenu = $('#menu-documentation');
        lastSelectedMenu.addClass('selected');
    });
    $('#menu-contact').click(function(event) {
        lastSelected.fadeOut(300, function() {
            $('#contact').fadeIn(300);
        });
        lastSelected = $('#contact');
        lastSelectedMenu.removeClass('selected');
        lastSelectedMenu = $('#menu-contact');
        lastSelectedMenu.addClass('selected');
    });
    $('#menu-developers').click(function(event) {
        lastSelected.fadeOut(300, function() {
            $('#developers').fadeIn(300);
        });
        lastSelected = $('#developers');
        lastSelectedMenu.removeClass('selected');
        lastSelectedMenu = $('#menu-developers');
        lastSelectedMenu.addClass('selected');
    });
});


