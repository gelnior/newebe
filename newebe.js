(function() {
  $(function() {
    var lastSelected, lastSelectedMenu;
    $('#installation').hide();
    $('#documentation').hide();
    $('#contact').hide();
    $('#developers').hide();
    lastSelected = $('#home');
    lastSelectedMenu = $('#menu-home');
    lastSelectedMenu.addClass('selected');
    $('#menu-home').click(function(event) {
      lastSelected.fadeOut(300, function() {
        return $('#home').fadeIn(500);
      });
      lastSelected = $('#home');
      lastSelectedMenu.removeClass('selected');
      lastSelectedMenu = $('#menu-home');
      return lastSelectedMenu.addClass('selected');
    });
    $('#menu-installation').click(function(event) {
      lastSelected.fadeOut(300, function() {
        return $('#installation').fadeIn(500);
      });
      lastSelected = $('#installation');
      lastSelectedMenu.removeClass('selected');
      lastSelectedMenu = $('#menu-installation');
      return lastSelectedMenu.addClass('selected');
    });
    $('#menu-documentation').click(function(event) {
      lastSelected.fadeOut(300, function() {
        return $('#documentation').fadeIn(300);
      });
      lastSelected = $('#documentation');
      lastSelectedMenu.removeClass('selected');
      lastSelectedMenu = $('#menu-documentation');
      return lastSelectedMenu.addClass('selected');
    });
    $('#menu-contact').click(function(event) {
      lastSelected.fadeOut(300, function() {
        return $('#contact').fadeIn(300);
      });
      lastSelected = $('#contact');
      lastSelectedMenu.removeClass('selected');
      lastSelectedMenu = $('#menu-contact');
      return lastSelectedMenu.addClass('selected');
    });
    return $('#menu-developers').click(function(event) {
      lastSelected.fadeOut(300, function() {
        return $('#developers').fadeIn(300);
      });
      lastSelected = $('#developers');
      lastSelectedMenu.removeClass('selected');
      lastSelectedMenu = $('#menu-developers');
      return lastSelectedMenu.addClass('selected');
    });
  });
}).call(this);
