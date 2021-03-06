$(document).ready(function() {
// Starting emotions that show on load      
var peopleFeelings = ["Frustration", "Confusion", "Sadness", "Happiness", "Rage", "Excitement"];

    // displayGifEmotions function re-renders the HTML to display the appropriate content 
   function displayGifEmotions() {
      $("#showMeHowYouFeel").empty(); // Empty out previous gifs so they don't stack up
      // In this case, the "this" keyword refers to the button that was clicked
      var stressor = $(this).attr("data-name");

      // Constructing a URL to search Giphy for the name of the stressor
      var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        stressor + "&api_key=dc6zaTOxFJmzC&limit=10";

      // Performing our AJAX GET request
      $.ajax({
          url: queryURL,
          method: "GET"
        })
        // After the data comes back from the API
        .done(function(response) {
          // Storing an array of results in the results variable
          var results = response.data;
          console.log(results); //TESTING
          // Looping over every result item
          for (var i = 0; i < results.length; i++) {

            // and only take action if the photo has an appropriate rating (in this case not "R" or "PG-13")
            if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
              // Create a div with the class "item"
              var gifDiv = $("<div class='item'>");

              // Store the result item's rating
              var rating = results[i].rating;

              // Create a paragraph tag with the result item's rating
              var p = $("<p>").text("Rating: " + rating);

              // Create an image tag
              var feelingImage = $("<img>");

              // Give the image tag the attributes for the gif from the API
              // result item for the "still" gif
              feelingImage.attr("src", results[i].images.fixed_height_still.url); //url for the "still" gif for the initial load
              feelingImage.attr("data-still", results[i].images.fixed_height_still.url); //"still" gif url
              feelingImage.attr("data-animate", results[i].images.fixed_height.url); //"animated" gif url
              feelingImage.attr("data-state", "still"); //status of gif motion
              feelingImage.attr("class", "gif");

              // Is there a way to "thin" my code for with .attr?   feel 
              /*feelingImage.attr({src: results[i].images.fixed_height_still.url,
                data-still: results[i].images.fixed_height_still.url, 
                data-animate: results[i].images.fixed_height.url, 
                data-state: "still"
              })*/

              // Append the paragraph and feelingImage we created to the "gifDiv" div we created
              gifDiv.append(p);
              gifDiv.append(feelingImage);

              // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
              $("#showMeHowYouFeel").prepend(gifDiv);
            }
          }
        });
    };

    //Function for starting and stoping the gif animations
    function startStopGif() {
          // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
          var state = $(this).attr("data-state");
          // If the clicked image's state is still, update its src attribute to what its data-animate value is.
          // Then, set the image's data-state to animate
          // Else set src to the data-still value
          if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
          } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
          }
        };

    // Function for displaying emotion data
    function renderButtons() {

      // Deleting the movies prior to adding new movies
      // (this is necessary otherwise you will have repeat buttons)
      $("#feelingButtons").empty();

      // Looping through the array of movies
      for (var i = 0; i < peopleFeelings.length; i++) {

        // Then dynamicaly generating buttons for each emotion in the array
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var a = $("<button>");
        // Adding a class of emotion to our button
        a.addClass("emotion");
        // Adding a data-attribute
        a.attr("data-name", peopleFeelings[i]);
        // Providing the initial button text
        a.text(peopleFeelings[i]);
        // Adding the button to the buttons-view div
        $("#feelingButtons").append(a);
      }
    }

    // This function handles events where a movie button is clicked
    $("#addFeelings").on("click", function(event) {
      event.preventDefault();
      // This line grabs the input from the textbox
      var movie = $("#symptoms").val().trim();

      // Adding movie from the textbox to our array
      peopleFeelings.push(movie);

      // Calling renderButtons which handles the processing of our movie array
      renderButtons();
    });

    // Adding a click event listener to all elements with a class of "emotion" and "gif"
    $(document).on("click", ".emotion", displayGifEmotions);
    $(document).on("click", ".gif", startStopGif);

    // Calling the renderButtons function to display the intial buttons
    renderButtons();

});
