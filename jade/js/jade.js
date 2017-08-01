function showDashButton() {
	$(".dashboard-button").fadeIn("slow");
}

// show hide applications
function display(element) {
  
  $.when($(".category-msg, #search-icon, #recent-used-files-msg").fadeOut()).done(function() {
  $(".category-container, .search-results, #main-dashboard, #recently-used-files, .category-msg, #search-icon, #recent-used-files-msg").hide();
  $(".category-msg").addClass("animated slideInLeft");
  $(element).show();
  grid(element);
  });
  showDashButton();
};

function grid(element) {
	$(element).masonry({
    itemSelector: ".col"
  });
}

function emptyClass(element) {
  $(element).attr("class", "");
}

//show hide dashboard
function showDashboard() {
  $(".category-container, .search-results, .category-msg, #search-icon, #recently-used-files, #recent-used-files-msg, .dashboard-button").hide();
  $("#main-dashboard").show().css("display', 'block"); // fix, reset display state at the end of animation
  emptyClass("#background");
}

// send messages to the back end
function notifySend(msg) {
  document.title = "notify:" + msg;
}

// DOCUMENT READY
$(document).ready(function() {
	
  // Init a timeout variable to be used below
  var dashTimeout = null;

  // Listen for events
  $(document).on("keypress mousewheel mousemove mousedown", function() {

    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(dashTimeout);

    // Make a new timeout set to go off in 30sec this could be a really neat feature or the most annoying one
    // This depends how fast people read, it might need adjustment
    dashTimeout = setTimeout(function() {
      if ($("#main-dashboard").css("display") == 'none') { // don't repeat animation
        $(".category-container, .search-results, .category-msg, #search-icon, #recently-used-files, #recent-used-files-msg, .dashboard-button").fadeOut("slow", function() {
          $("#main-dashboard").fadeOut("slow");
        });
        $(".category-container, .search-results, .category-msg, #search-icon, #recently-used-files, #recent-used-files-msg, .dashboard-button").promise().done(function() {
          $("#main-dashboard").fadeIn("slow");
          setTimeout(function() {
            emptyClass("#background");
            $("#main-dashboard").css("display', 'block"); // fix, reset display state at the end of animation
          }, 1800); // delayed background reset
        });
      } else {
        clearTimeout(dashTimeout);
      }
    }, 30000);
  });

  // focus on hover
  $(".box.notes").parent().mouseover(function() {
    $(".notes .content-editable").focus();
  });

  // disk usage colours
  function diskPercentage() {
    var diskPercentage = $(".disk-percentage").text();
    if (diskPercentage >= "90%") {
      $(".disk-usage").css("border-color", "rgba(244, 67, 54, 0.5)"); // red
    } else if (diskPercentage >= "61%") {
      $(".disk-usage").css("border-color", "rgba(255, 152, 0, 0.5"); // orange
    } else {
      $(".disk-usage").css("border-color", "rgba(76, 175, 80, 0.5"); // green
    }
  }
  diskPercentage();

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

  

  // move to correct containers
  $(".application-category").appendTo(".menu");
  $(".category-container").appendTo(".dashboard");
  $(".category-msg, #search-icon").appendTo(".msg");
  $("#recent-used-files-msg").appendTo(".msg");

  // help category comes first!
  $(".application-category.help").prependTo("#nav-mobile");

  // settings & system
  $(".application-category.settings, .application-category.system").addClass("col m12").appendTo(".mini-dashboard-left");
  $(".application-category.settings a, .application-category.system a").addClass("box col m12");
  $(".application-category.settings, .application-category.system").removeClass("application-category");
  $(".category-icon.Settings").clone().appendTo(".settings a");
  $(".category-icon.System").clone().appendTo(".system a");
  emptyClass(".settings a img");
  emptyClass(".system a img");

  // application info slider and icon transition
  $(".application-box").hover(function() {
    $(this).find(".application-icon").fadeOut("slow");
    $(this).find(".info-icon").fadeIn("slow");
    $(".application-box").css("z-index", "1");
    $(this).css("z-index", "2");
    $(this).find("p").slideDown("fast");

  }, function() {
    $(this).find(".info-icon").fadeOut("slow");
    $(this).find(".application-icon").fadeIn("slow");
    $(this).find("p").slideUp("fast");
  });

  // exit menu animation
  $("#exit-button").hover(function() {
    $("#exit-menu").parent().find("div").slideToggle("slow");
  });

  var red = "#f44336";
  var pink = "#e91e63";
  var blue = "#2196f3";
  var teal = "#009688";
  var green = "#4caf50";
  var yellow = "#ffeb3b";
  var orange = "#ff9800";
  var brown = "#795548";
  var grey = "#9e9e9e";
  var colors = [red, blue, pink, green, orange];

  // apply colors to application container background
  $('.application-box').css('background-color', function(index) {
    return colors[index % colors.length];
  });

  $(".recent-files-button").click(function() {
  	   showDashButton();
      $("#main-dashboard").hide();
      $("#recent-used-files-msg").addClass("animated slideInLeft");
      $("#recently-used-files, #recent-used-files-msg").show();
      document.title = "recent";
  });

  $(".dashboard-button a").click(function() {
    emptyClass("#background");
    showDashboard();

  });
  // backgrounds
  $("li.application-category, #search").mouseover(function() {

    if ($(this).hasClass("office")) {
      emptyClass("#background");
      $("#background").addClass("office-background");
    } else if ($(this).hasClass("development")) {
      emptyClass("#background");
      $("#background").addClass("development-background");
    } else if ($(this).hasClass("education")) {
      emptyClass("#background");
      $("#background").addClass("education-background");
    } else if ($(this).hasClass("multimedia")) {
      emptyClass("#background");
      $("#background").addClass("multimedia-background");
    } else if ($(this).hasClass("gaming")) {
      emptyClass("#background");
      $("#background").addClass("games-background");
    } else if ($(this).hasClass("graphics")) {
      emptyClass("#background");
      $("#background").addClass("graphics-background");
    } else if ($(this).hasClass("go-online")) {
      emptyClass("#background");
      $("#background").addClass("internet-background");
    } else if ($(this).hasClass("help")) {
      emptyClass("#background");
      $("#background").addClass("help-background");
    } else if ($(this).hasClass("accessories")) {
      emptyClass("#background");
      $("#background").addClass("accessories-background");
    } else if ($(this).is("#search")) {
      emptyClass("#background");
      $("#background").addClass("search-background");
    } else {
      emptyClass("#background");
    }

  });

  $(".settings, .system, .recent-files-button").click(function() {

    if ($(this).hasClass("settings")) {
      emptyClass("#background");
      $("#background").addClass("settings-background");
    } else if ($(this).hasClass("system")) {
      $("#background").addClass("system-background");
    } else if ($(this).hasClass("recent-files-button")) {
      emptyClass("#background");
      $("#background").addClass("recent-files-background");
    } else {
      emptyClass("#background");
    }

  });
});
