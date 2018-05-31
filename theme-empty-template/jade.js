
// search for /home/user/.config/jade/theme/override.css
function themeOverride(fileName) {

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.charset = 'UTF-8';
  link.href = fileName;
  document.getElementsByTagName('head')[0].appendChild(link);
}

function backEndGet(python_function) {
  document.title = python_function
}

  // Native Notifications
  function notifySend(msg) {
    Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          var notification = new Notification(msg);
        }
      });
  }

  searchMatchesFound = 0
  function savedSearches() {
    if (searchMatchesFound > 0) {
      $("input#search").blur();
      $("#search-msg").remove();
      $("#search-container").append("<div id='search-msg'>Your Search Query Is Saved</div>");
  }
    else {
      $("input#search").blur();
      $("#search-msg").remove();
    }
}

  // DOCUMENT READY
  $(document).ready(function() {

  	 backEndGet("disk-usage");
    $('.modal').modal();
    $("#app-name").text(JAK.app.getName);
    $("#app-author").text("Author - " + JAK.app.getAuthor);
    $("#app-description").text(JAK.app.getDescription);
    $("#app-url").append("<a href='xdg-open:" + JAK.app.getUrl + "'>" + JAK.app.getUrl + "</a></span>");
    $("#app-version").text("Version - " + "v" + JAK.app.getVersion);
    $("#app-license").text("License - " + JAK.app.getLicense);

    // double click for shutdown
    $(function($) {
      $("#exit-menu a").click(function() {
        notifySend("Double click to use!");
        return false;
      }).dblclick(function() {
        window.location = this.href;
        return false;
      }).keydown(function(event) {
        switch (event.which) {
          case 13: // Enter
            window.location = this.href;
            return false;
        }
      });
    });
  });
