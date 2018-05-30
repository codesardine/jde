function isElementVisible(element) {
    return $(element).css('display') !== 'none';
}

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

// show hide applications
function display(element) {
    $.when($(".category-msg, #search-icon").fadeOut()).done(function () {
        $(".category-container, .search-results, #main-dashboard, .category-msg, #search-icon").hide();
        $(".category-msg").addClass("animated slideInLeft");
        $(element).show();
        grid(".grid");
    });
}

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
    $(".category-container, .search-results, .category-msg, #search-icon").hide();
    $("#main-dashboard").show().css("display', 'block"); // fix, reset display state at the end of animation
    emptyClass("#background");
}

// send messages to the back end
function notifySend(msg) {
    backEndGet("notify:" + msg);
}

// disk usage colours
function getDiskColors() {
    var diskPercentage = $(".disk-percentage").text();
    if (diskPercentage >= "90%") {
        $(".disk-usage").css("background-color", "#b71c1c"); // red
    } else if (diskPercentage >= "71%") {
        $(".disk-usage").css("background-color", "#e65100"); // orange
    } else {
        $(".disk-usage").css("background-color", "#2e7d32"); // green
    }
}

searchMatchesFound = 0;

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
$(document).ready(function () {
    backEndGet("disk-usage");
    $('.modal').modal();
    $("#app-name").text(JAK.app.getName);
    $("#app-author").text("Author - " + JAK.app.getAuthor);
    $("#app-description").text(JAK.app.getDescription);
    $("#app-url").append("<a href='xdg-open:" + JAK.app.getUrl + ">" + JAK.app.getUrl + "</a></span>");
    $("#app-version").text("Version - " + "v" + JAK.app.getVersion);
    $("#app-license").text("License - " + JAK.app.getLicense);

    // Init a timeout variable to be used below
    var dashTimeout = null;

    // Listen for events
    $(document).on("keypress mousewheel mousemove mousedown", function () {

        // Clear the timeout if it has already been set.
        // This will prevent the previous task from executing
        // if it has been less than <MILLISECONDS>
        clearTimeout(dashTimeout);

        // Make a new timeout set to go off in 30sec this could be a really neat feature or the most annoying one
        // This depends how fast people read, it might need adjustment
        dashTimeout = setTimeout(function () {

            if ($("#main-dashboard").css("display") === 'none') { // don't repeat animation
                var elems = $(".category-container, .search-results, .category-msg, #search-icon");
                elems.fadeOut("slow", function () {
                    $("#main-dashboard").fadeOut("slow");
                });
                elems.promise().done(function () {
                    $("#main-dashboard").fadeIn("slow");
                    setTimeout(function () {
                        emptyClass("#background");
                        $("#main-dashboard").css("display', 'block"); // fix, reset display state at the end of animation
                        $(".dash-btn").fadeOut("slow");
                    }, 1800); // delayed background reset
                });
            } else {
                clearTimeout(dashTimeout);
            }
            savedSearches();
        }, 25000);
    });

    // double click for shutdown
    $(function ($) {
        $("#exit-menu a").click(function () {
            notifySend("Double click to use!");
            return false;
        }).dblclick(function () {
            window.location = this.href;
            return false;
        }).keydown(function (event) {
            switch (event.which) {
                case 13: // Enter
                    window.location = this.href;
                    return false;
            }
        });
    });

    var application_box = $(".application-box");

    // move to correct containers, and add classes
    $("#Applications").prependTo("nav .dropdown");
    $(".application-category").appendTo(".dropdown-menu");
    $(".category-container").appendTo(".dashboard");
    $(".category-msg, #search-icon").appendTo("#TOP-LEFT-DESCRIPTION");
    $(".application-wrapper").addClass("col l4 xl3");
    application_box.addClass("card");

    function fixDuckIframe() {
        // fix iframe slideToggle
        var iframeHeight = window.innerHeight - 261;
        $("#duckduckgo").css("height", iframeHeight);
    }

    fixDuckIframe();
    // settings & system
    var app_cat = $(".application-category.settings, .application-category.system, .application-category.help");
    app_cat.appendTo(".mini-dashboard-left");
    $(".application-category.settings a, .application-category.system a, .application-category.help a").addClass("box col m12");
    app_cat.removeClass("application-category");
    $(".category-icon.Settings").clone().appendTo(".settings a");
    $(".category-icon.System").clone().appendTo(".system a");
    $(".category-icon.Help").clone().appendTo(".help a");
    emptyClass(".settings a img");
    emptyClass(".system a img");
    emptyClass(".help a img");

    // application info slider 
    application_box.hover(function () {
        $(".application-wrapper").css("z-index", "1");
        $(this).parent().css("z-index", "2");
        $(this).find("p").slideDown(300);

    }, function () {
        $(this).find("p").slideUp(300);
    });

    // exit menu animation
    $("#exit-button").click(function () {
        $("#exit-menu").parent().find("div").slideToggle("slow");
    });

    $("nav a, #clear-search").hover(function () {
        $(this).addClass("underline pointer");
    }, function () {
        $(this).removeClass("underline pointer");
    });

    var red = "#f44336";
    var pink = "#e91e63";
    var blue = "#2196f3";
    var green = "#4caf50";
    var orange = "#ff9800";

    var background = $("#background");

    var colors = [red, blue, pink, green, orange];

    // apply colors to application container background
    application_box.css("background-color", function (index) {
        return colors[index % colors.length];
    });

    $(".dash-btn").click(function () {
        if ($(this).hasClass("dash-btn")) {
            $(this).fadeOut();
        }
        emptyClass("#background");
        showDashboard();
        savedSearches();
    });

    // detect when arrow animation ends
    $(".applications-arrow-highlight").on('webkitAnimationEnd', function () {
        $(this).fadeOut();
    });

    // backgrounds
    $("li.application-category").mouseover(function () {
        emptyClass("#background");
        $(".dash-btn").fadeIn();

        if ($(this).hasClass("office")) {
            background.addClass("office-background");
        } else if ($(this).hasClass("development")) {
            background.addClass("development-background");
        } else if ($(this).hasClass("education")) {
            background.addClass("education-background");
        } else if ($(this).hasClass("multimedia")) {
            background.addClass("multimedia-background");
        } else if ($(this).hasClass("gaming")) {
            background.addClass("games-background");
        } else if ($(this).hasClass("graphics")) {
            background.addClass("graphics-background");
        } else if ($(this).hasClass("go-online")) {
            background.addClass("internet-background");
        } else if ($(this).hasClass("accessories")) {
            background.addClass("accessories-background");
        }
        savedSearches();
    });

    $(".settings, .system, .help").click(function () {
        $(".dash-btn").fadeIn();
        emptyClass("#background");
        if ($(this).hasClass("settings")) {
            background.addClass("settings-background");
        } else if ($(this).hasClass("system")) {
            background.addClass("system-background");
        } else if ($(this).hasClass("help")) {
            background.addClass("help-background");
        }
    });
});
