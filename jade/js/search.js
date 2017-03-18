 $(document).ready(function() {

     $("input#search").on("click", function() {

         $(".category-container, .category-msg, #main-dashboard, #recently-used-files, .recent-files-msg").hide();
         $(".search-results, #search-icon, .dashboard-button").show();
         $(".search-results").masonry({
             itemSelector: ".col",
             transitionDuration: "0.0s"
         });
     });
     $("#search").on("keyup", function() {

         $(".search-results").empty();
         $("#search-msg").remove();
         var searchValue = this.value;

         //"use strict"; quick shell this is not done yet
         //if (searchValue.startsWith("$", 0)) {
         //    window.location.href = "quick:" + searchValue;
         //} else if

         if (searchValue.length !== 0) {
             searchValue.toLocaleLowerCase();

             $(".application-wrapper").each(function() {

                 if ($(this).html().toLocaleLowerCase().indexOf(searchValue) > -1) {

                     $(this).clone().prependTo(".search-results");
                     $(".search-results").masonry("reloadItems");
                     $(".search-results").masonry("layout");

                     var elementsNumber = $(".search-results .application-wrapper").length;
                     if (elementsNumber === 1) {
                         $("#search-container").append("<div id='search-msg'>Press ENTER key to launch this application!</div>");
                     } else if (elementsNumber > 1) {
                         $("#search-msg").remove();
                         $("#search-container").append("<div id='search-msg'>You have " + elementsNumber + " matches!</div>");
                     }
                 }
             });
         }
     });
     $("#search").keypress(function(event) {
         var elementsNumber = $(".search-results .application-wrapper").length;
         var key = event.which;
         if (key === 13 && elementsNumber === 1) {
             var text = "Launching " + $(".search-results h5.application-name").text();
             notifySend(text);
             var launch = $(".search-results .application-wrapper .application-box").attr("href");
             window.location.href = launch;
         }
     });
 });