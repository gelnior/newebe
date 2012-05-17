(function() {

  $(function() {
    var displayInstall, element, lastSelected, lastSelectedMenu, path, url;
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
    displayInstall = function(event) {
      lastSelected.fadeOut(300, function() {
        return $('#installation').fadeIn(500);
      });
      lastSelected = $('#installation');
      lastSelectedMenu.removeClass('selected');
      lastSelectedMenu = $('#menu-installation');
      return lastSelectedMenu.addClass('selected');
    };
    $('#menu-installation').click(displayInstall);
    $('#download-text').click(displayInstall);
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
    $('#menu-developers').click(function(event) {
      lastSelected.fadeOut(300, function() {
        return $('#developers').fadeIn(300);
      });
      lastSelected = $('#developers');
      lastSelectedMenu.removeClass('selected');
      lastSelectedMenu = $('#menu-developers');
      return lastSelectedMenu.addClass('selected');
    });
    url = document.location.href;
    if (url && url.indexOf("#") > 0) {
      path = url.split("#")[1];
      element = "#" + path;
      $('#home').hide();
      $(element).show();
      lastSelected = $(element);
      lastSelectedMenu.removeClass('selected');
      lastSelectedMenu = $('#menu-' + path);
      return lastSelectedMenu.addClass('selected');
    }
  });

}).call(this);
