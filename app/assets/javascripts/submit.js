$(document).ready(function() {

  var usersFacebookID;
  var usersFacebookPicture;
  var usersName;
  var usersFacebookProfileUrl
  var likedMovies;
  var numberOfLikedMovies;
  var requestCounter = 0;
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
    var html = '<table width="100%"><tbody><tr><td>Rank</td><td rowspan="2"><img src="' + usersFacebookPicture + '" class="profile-img" /></td><td rowspan="2">' + usersName + '</td><td>IMDB Avg</td><td>Rotten Tomatoes Avg</td></tr><tr><td>&nbsp;</td><td>' + averageRating(imdbRatingResultsArray) + '</td><td>' + averageRating(rottenTomatoesRatingResultsArray) + '%</td></tr></tbody></table>'
    $('#results').html(html);
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
      average = (sum/numberOfRatings).toFixed(2);
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
          // save the user's profile picture, name and profile url
          usersFacebookPicture = response.avatar;
          usersName = response.name;
          usersFacebookProfileUrl = response.url
          // Use the ID to get the movies
          usersFacebookID = response.id;
          var userUrl = 'https://graph.facebook.com/v2.3/' + usersFacebookID + '/movies?access_token=' +
                         accessToken

          $.ajax({
            url: userUrl,
            dataType: 'json',
            success: function(data) {
                      likedMovies = data.data;
                      numberOfLikedMovies = likedMovies.length;
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
                                if (data.release_date != undefined) {
                                  releaseDate = data.release_date.substring(data.release_date.length - 4);
                                }
                              },
                              complete: function(data) {
                                console.log(movieTitle + " " + releaseDate);
                                if (data.release_date != undefined) {
                                  // with the release year, search the OMDB database to get ratings info
                                  var movieSearchUrl = 'http://www.omdbapi.com/?t=' + movieTitle + '&y=' +
                                                        releaseDate + '&type=movie&tomatoes=true&plot=short&r=json'
                                } else {
                                  var movieSearchUrl = 'http://www.omdbapi.com/?t=' + movieTitle +
                                                        '&type=movie&tomatoes=true&plot=short&r=json'
                                }
                                $.ajax({
                                  url: movieSearchUrl,
                                  dataType: 'json',
                                  success: function(data) {
                                    requestCounter += 1;
                                    var imdbRating = data.imdbRating;
                                    var rottenTomatoesRating = data.tomatoMeter;
                                    if (imdbRating != undefined) {
                                      imdbRatingResultsArray.push(imdbRating);
                                    }
                                    if (rottenTomatoesRating != undefined) {
                                      rottenTomatoesRatingResultsArray.push(rottenTomatoesRating);
                                    }
                                    console.log(movieTitle + ': IMDB-' + imdbRating + ' RT-' + rottenTomatoesRating);
                                  },
                                  error: function() {
                                    numberOfLikedMovies -= 1;
                                  },
                                  complete: function() {
                                    // when all of the requests have completed, render results on page by calling renderResults
                                    if (requestCounter === numberOfLikedMovies) {
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
