$(document).ready(function () {
    var search = $("#search");
    var searchMatchesFound = 0;
    var searchResults = $(".search-results");
    var searchContainer = $("#search-container");

    $("#clear-search").click(function () {
        searchMatchesFound = 0;
        $("input#search[type=text], textarea").val("");
        $("#search-msg").remove();
        searchResults.children().remove();
        search.focus();
    });

    search.on("click", function () {
        search.focus();

        $.when($(".category-msg").fadeOut()).done(function () {
            search.attr("placeholder", "Search Applications...");
            $(".category-container, #main-dashboard").hide();
            $("#search-icon").addClass("animated slideInLeft");
            $(".search-results, #search-icon").show();
            $(".dash-btn").fadeIn();
            grid(".search-results");
        });
    });

    // Init a timeout variable to be used below
    var timeout = null;

    // Listen for key up events
    search.on("keyup", function () {
        // fix return to search
        if ($("#main-dashboard").css("display") === "block") { // don't repeat animation
            $("#main-dashboard").fadeOut("slow", function () {
                $(".search-results, #search-icon, dash-btn").fadeIn("slow");
            });
        }

        // Assign search value to input
        var searchValue = this.value;

        // Clear the timeout if it has already been set.
        // This will prevent the previous task from executing
        // if it has been less than <MILLISECONDS>
        clearTimeout(timeout);

        // Make a new timeout set to go off in 1000ms
        // This depends how fast people type, it should be ok even for slow typers
        timeout = setTimeout(function () {
            if (searchValue.length !== 0) {
                searchResults.empty();
                $("#search-msg").remove();
                appSearch(searchValue);

                function appSearch(searchValue) {
                    searchValue = searchValue.toLocaleLowerCase();

                    // search title description and keywords
                    var searchLocation = ".application-wrapper";

                    // if we have only 1 letter search tittle only
                    if (searchValue.length === 1) {
                        searchLocation = ".application-wrapper h5"
                    }

                    $(searchLocation).each(function () {
                        if ($(this).text().toLocaleLowerCase().indexOf(searchValue) > -1) {
                            if (searchValue.length === 1) {
                                if ($(this).text().toLocaleLowerCase().charAt(0) === searchValue) {
                                    $(this).parent().parent().clone().prependTo(".search-results");
                                }
                            } else {
                                if ($(this).text().toLocaleLowerCase().trim().startsWith(searchValue)) {
                                    // More relevant results first
                                    $(this).clone().prependTo(".search-results");
                                } else {
                                    // Less relevant results last
                                    $(this).clone().appendTo(".search-results");
                                }
                            }

                            searchMatchesFound = $(".search-results " + searchLocation).length;

                            if (searchMatchesFound === 1) {
                                $("#search-msg").remove();
                                searchContainer.append("<div id='search-msg'>Press ENTER Key To Launch This Application!</div>");
                            } else if (searchMatchesFound > 1) {
                                $("#search-msg").remove();
                                searchContainer.append("<div id='search-msg'>" + searchMatchesFound + " Search Matches Found</div>");
                            }
                        } else if (searchResults.children().length === 0) {
                            $("#search-msg").remove();
                            searchContainer.append("<div id='search-msg'>Sorry No Matches Found</div>");
                        }
                    });
                }
            } else if (searchValue.length === 0) {
                $("#search-msg").remove();
                searchContainer.append("<div id='search-msg'>Type Something To Search For</div>");
            }
            searchResults.masonry("reloadItems").masonry("layout");
        }, 1000);
    });

    search.keypress(function (event) {
        searchMatchesFound = $(".search-results .application-wrapper").length;
        var key = event.which;

        if (key === 13 && searchMatchesFound === 1) {
            var text = "Launching " + $(".search-results h5.application-name").text();
            notifySend(text);

            window.location.href = $(".search-results .application-wrapper .application-box").attr("href");
        }
    });
});
