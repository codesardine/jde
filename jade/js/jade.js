// show hide applications
function display(element) {
    $(".category-msg").addClass('animated slideInLeft');
    $(".category-container, .search-results, .category-msg, #search-icon, #main-dashboard, #recently-used-files, .recent-files-msg").hide();
    $(element).show();
    $(".dashboard-button").show();
}



function grid(element) { $(element).masonry('layout'); }

//show hide dashboard
var dashboardTimeoutID;

function dashboardStartTimer() {
    dashboardTimeoutID = window.setTimeout(showDashboard, 20000);
}

function showDashboard() {

    $(".category-container, .search-results, .category-msg, #search-icon, #recently-used-files, .recent-files-msg, .dashboard-button").fadeOut(1000).promise().done(function() {
        $("#background").attr("class", "");
        $("#main-dashboard").fadeIn(1000);
    })
}

function dashboardClearTimer() {
    window.clearTimeout(dashboardTimeoutID);
}

$(document).mousemove(function() {
    dashboardClearTimer();
    dashboardStartTimer();
});
// DOCUMENT READY
$(document).ready(function() {

    // double click for shutdown
    jQuery(function($) {
        $('.exit a').click(function() {
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
    })

    $('.category-container').masonry({
        itemSelector: '.col',
        transitionDuration: '0.0s'
    });



    // move to correct containers
    $(".application-category").appendTo(".menu");
    $(".category-container").appendTo(".dashboard");
    $(".category-msg, #search-icon").appendTo(".msg");
    $("#recently-used-files").appendTo(".dashboard");
    $(".recent-files-msg").appendTo(".display-msg");

    // application info slider
    $(".application-box").hover(function() {
        $(".application-box").css("z-index", "1");
        $(this).css("z-index", "2");
        $(this).find("p").slideDown("fast");

    }, function() {
        $(this).find("p").slideUp("fast");
    });

    var red = "#f44336"
    var pink = "#e91e63"
    var blue = "#2196f3"
    var teal = "#009688"
    var green = "#4caf50"
    var yellow = "#ffeb3b"
    var orange = "#ff9800"
    var brown = "#795548"
    var grey = "#9e9e9e"
    var colors = [red, blue, teal, pink, green, orange, brown, grey];

    // apply colors to application container background
    $('.application-box').css('background-color', function(index) {
        return colors[index % colors.length];
    });

    // apply ramdom colors to menu backgrounds
    $(".application-category a").hover(function() {

        $(this).css('background-color', colors[Math.floor(Math.random() * colors.length)]);
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
        $("#main-dashboard").hide();
        $("#recently-used-files, .recent-files-msg").show();

    })

    $("#recent-files-button-close").click(function() {
        $("#recently-used-files, .recent-files-msg, .category-container").hide();
        $("#main-dashboard").show();

    })

    $(".dashboard-button a").click(function() {
            $("#background").attr("class", "");
            showDashboard()

        })
        // backgrounds
    $("li.application-category").click(function() {
        console.log(this.className)
        if ($(this).hasClass("office")) {
            $("#background").attr("class", "");
            $("#background").addClass("office");
        } else if ($(this).hasClass("development")) {
            $("#background").attr("class", "");
            $("#background").addClass("development");
        } else if ($(this).hasClass("education")) {
            $("#background").attr("class", "");
            $("#background").addClass("education");
        } else if ($(this).hasClass("multimedia")) {
            $("#background").attr("class", "");
            $("#background").addClass("multimedia");
        } else if ($(this).hasClass("games")) {
            $("#background").attr("class", "");
            $("#background").addClass("games");
        } else if ($(this).hasClass("graphics")) {
            $("#background").attr("class", "");
            $("#background").addClass("graphics");
        } else if ($(this).hasClass("internet")) {
            $("#background").attr("class", "");
            $("#background").addClass("internet");
        } else if ($(this).hasClass("system")) {
            $("#background").attr("class", "");
            $("#background").addClass("system");
        } else if ($(this).hasClass("settings")) {
            $("#background").attr("class", "");
            $("#background").addClass("settings");
        } else { $("#background").attr("class", ""); }

    })


});