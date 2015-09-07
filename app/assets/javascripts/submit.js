$(document).ready(function() {

  var facebookID;
  var likedMovies;
  var requestCounter = 0
  var imdbRatingResultsArray = [];
  var rottenTomatoesRatingResultsArray = [];

  var loadingResultsButton = function() {
    $('#button').html('')
    $('#button').html('<button class="btn btn-lg btn-info">Calculating Your Results <span class="glyphicon glyphicon-refresh spinning"></span></button>')
  };

  // changes the button from 'find out' to 'share results'
  var changeButton = function() {
    $('#button').html('')
    $('#button').html('<button id="share-it" class="btn btn-lg btn-success">Share Your Rating</button>')
  };

  // takes the movie information and returns a list item with the movie information
  var renderResults = function () {
    var html = '<li>Average IMDB Rating: ' + averageRating(imdbRatingResultsArray) + '  Average Rotten Tomatoes Rating: ' + averageRating(rottenTomatoesRatingResultsArray) + '%';
    $('#results ul').append(html);
  };

  // averages the ratings of the IMDB results in the imdbRatingResultsArray
  var averageRating = function(arrayOfMovieRatings) {
    var sum = 0
    var numberOfRatings = arrayOfMovieRatings.length
    var average = 0
    if (numberOfRatings > 0) {
      for (var i = 0; i < numberOfRatings; i += 1) {
          sum += parseFloat(arrayOfMovieRatings[i]);
      }
      average = sum/numberOfRatings
    }
    return average
  };

  $('#get-it').click(function(){
    OAuth.popup('facebook', function(error, result) {
      var accessToken = result.access_token;
      // get the user ID to be able to search the movies on their Facebook page
      if (error) {
        alert(error); // do something with error
        return;
      } else {
        loadingResultsButton();
        result.me().done(function (response) {
          // Use the ID to get the movies
          facebookID = response.id;
          var userUrl = 'https://graph.facebook.com/v2.3/' + facebookID + '/movies?access_token=' +
                         accessToken

          $.ajax({
            url: userUrl,
            dataType: 'json',
            success: function(data) {
                      likedMovies = data.data
                    },
            complete: function() {
                          // loop through each movie in the likedMovies list
                          $.each(likedMovies, function(i, movie) {
                            var movieID = movie.id;
                            var movieTitle = movie.name;
                            var releaseDate
                            var movieUrl = 'https://graph.facebook.com/v2.3/' + movieID +
                                           '?fields=release_date&access_token=' + accessToken
                            // send request to Facebook to get movie release year
                            $.ajax({
                              url: movieUrl,
                              dataType: 'json',
                              success: function(data) {
                                releaseDate = data.release_date.substring(data.release_date.length - 4);
                              },
                              complete: function() {
                                // with the release year, search the OMDB database to get ratings info
                                var movieSearchUrl = 'http://www.omdbapi.com/?t=' + movieTitle + '&y=' +
                                                      releaseDate + '&type=movie&tomatoes=true&plot=short&r=json'
                                $.ajax({
                                  url: movieSearchUrl,
                                  dataType: 'json',
                                  success: function(data) {
                                    requestCounter += 1;
                                    var imdbRating = data.imdbRating;
                                    var rottenTomatoesRating = data.tomatoMeter;
                                    imdbRatingResultsArray.push(imdbRating);
                                    rottenTomatoesRatingResultsArray.push(rottenTomatoesRating);
                                  },
                                  complete: function() {
                                    // when all of the requests have completed, render results on page by calling renderResults
                                    if (requestCounter === likedMovies.length) {
                                      changeButton();
                                      renderResults();
                                    }
                                  }
                                })
                              }
                            })
                          });
                      }
            });
        })
        .fail(function (err) {
            //handle error with err
        });
      }
    });
  });
});
