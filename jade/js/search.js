 $(document).ready(function() {

     $("input#search").on("click", function() {

         $('.category-container, .category-msg, #main-dashboard, #recently-used-files, .recent-files-msg').hide();
         $('.search-results, #search-icon, .dashboard-button').show();
         $('.search-results').masonry({
             itemSelector: '.col',
             transitionDuration: '0.0s'
         });
     })
     $("#search").on("keyup", function() {

         $('.search-results').empty();
         $("#search-container #search-msg").remove();
         searchValue = this.value

             "use strict";
         if (searchValue.startsWith("$", 0)) {
             window.location.href = "quik:" + searchValue
         }

         if (searchValue !== "") {
             searchValue.toLocaleLowerCase();

             $(".application-wrapper").each(function() {

                 if ($(this).html().toLocaleLowerCase().indexOf(searchValue) > -1) {

                     $(this).clone().appendTo(".search-results");
                     $('.search-results').masonry('reloadItems');
                     $('.search-results').masonry('layout');
                     var elementsNumber = $(".search-results .application-wrapper").length;

                     if (elementsNumber === 1) {
                         $("#search-container").append("<div id='search-msg'>Press ENTER key to launch this application!</div>");
                     } else if (elementsNumber !== 1) {
                         $("#search-container #search-msg").remove();
                         $("#search-container").append("<div id='search-msg'>You have " + elementsNumber + " matches!</div>");
                     }
                 }
             })
         } else if (searchValue == "") {
             $('.search-results').empty();
         }
     });
     $("#search").keypress(function(event) {
         var elementsNumber = $(".search-results .application-wrapper").length;
         var key = event.which || event.keyCode;
         if (key == 13 && elementsNumber === 1) {
             launch = $(".search-results .application-wrapper .application-box").attr('href');
             window.location.href = launch
         }
     })
 })