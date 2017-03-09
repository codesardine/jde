// show hide applications
function display(element) {
    $(".category-msg").addClass("animated slideInLeft");
    $(".category-container, .search-results, .category-msg, #search-icon, #main-dashboard, #recently-used-files, .recent-files-msg").hide();
    $(element).show();
    $(".dashboard-button").show();
}

function grid(element) { $(element).masonry('layout'); }

function emptyClass(element) {
    $(element).attr("class", "");
}

//show hide dashboard
function showDashboard() {
    $(document).off("mousemove keydown");
    $(".category-container, .search-results, .category-msg, #search-icon, #recently-used-files, .recent-files-msg, .dashboard-button").hide();
    emptyClass("#background");
    $("#main-dashboard").show();

}

// detect mouse or keyboard usage and set a dashboard timer
function detectUsage() {

    var dashboardTimeoutID;

    // dashboard timer 1 min
    function dashboardStartTimer() {
        dashboardTimeoutID = window.setTimeout(showDashboard, 60000);
    }

    function dashboardClearTimer() {

        window.clearTimeout(dashboardTimeoutID);
    }
    $(document).on("mousemove keydown", function() {

        dashboardClearTimer();
        dashboardStartTimer();
    });
}
// send messages to the backend
function notifySend(msg) {
    document.title = "notify:" + msg;
}

// DOCUMENT READY
$(document).ready(function() {

    // double click for shutdown
    $(function($) {
        $(".mini-dashboard-exit a").click(function() {
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

    $('.category-container').masonry({
        itemSelector: '.col',
        transitionDuration: '0.0s'
    });

    // move to correct containers
    $(".application-category").appendTo(".menu");
    $(".category-container").appendTo(".dashboard");
    $(".category-msg, #search-icon").appendTo(".msg");
    
    // help category comes first!
    $(".application-category.help").prependTo("#nav-mobile");

    // settings
    $(".application-category.settings").addClass("col m12").appendTo(".mini-dashboard-left");
    $(".application-category.settings a").addClass("box col m12");
    $(".application-category.settings").removeClass("application-category");
    $(".category-icon.Settings").clone().appendTo(".settings a");
    emptyClass(".settings a img");

    // application info slider
    $(".application-box").hover(function() {
        $(".application-box").css("z-index", "1");
        $(this).css("z-index", "2");
        $(this).find("p").slideDown("fast");

    }, function() {
        $(this).find("p").slideUp("fast");
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


    $(".application-category a").hover(function() {

        $(this).addClass("card").fadeIn("fast");
    }, function() {
        $(".application-category a").removeClass("card");
        $(".application-category a").css("background-color", "transparent");
    });

    // application icon transition to info icon
    $(".application-box").hover(function() {
        $(this).find(".application-icon").fadeOut("slow");
        $(this).find(".info-icon").fadeIn("slow");
    }, function() {
        $(this).find(".info-icon").fadeOut("slow");
        $(this).find(".application-icon").fadeIn("slow");
    })

    $(".recent-files-button").click(function() {
    	  document.title = "recent"
        $("#main-dashboard").hide();
        $("#recently-used-files, .recent-files-msg").show();

    })

    $("#recent-files-button-close").click(function() {
        showDashboard();
    })


    $(".dashboard-button a").click(function() {
            emptyClass("#background");
            showDashboard();

        })
        // backgrounds
    $("li.application-category, .settings").click(function() {

        detectUsage();

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
        } else if ($(this).hasClass("system")) {
            emptyClass("#background");
            $("#background").addClass("system-background");
        } else if ($(this).hasClass("settings")) {
            emptyClass("#background");
            $("#background").addClass("settings-background");
        } else { emptyClass("#background"); }

    })
});