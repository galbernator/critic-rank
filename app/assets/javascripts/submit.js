$(document).ready(function() {

  var facebookID

  // changes the button from 'find out' to 'share results'
  var changeButton = function() {
    $('#button').html('')
    $('#button').html('<button id="share-it" class="btn btn-lg btn-warning">Share Your Rating</button>')
  };

  // takes the movie information and returns a list item with the movie information
  var renderMovie = function (movieName, imdbMovieScore, tomatoesMovieScore) {
    return '<li>' + movieName + '  IMDB Rating: ' + imdbMovieScore + '  Rotten Tomatoes Rating: ' + tomatoesMovieScore;
  };

  // adds the movie to the page by calling renderMovie function
  var addMovie = function (movieName, imdbMovieScore, tomatoesMovieScore) {
    var html = renderMovie(movieName, imdbMovieScore, tomatoesMovieScore);
    $('#results ul').append(html);
  };

  $('#get-it').click(function(){
    OAuth.popup('facebook', function(error, result) {
      var accessToken = result.access_token;
      // get the user ID to be able to search the movies on their Facebook page
      if (error) {
        alert(error); // do something with error
        return;
      } else {
        result.me().done(function (response) {
          // Use the ID to get the movies
          facebookID = response.id;
          var userUrl = 'https://graph.facebook.com/v2.3/' + facebookID + '/movies?access_token=' +
                         accessToken
          var likedMovies;
          var imdbMovieRatings = [];
          var rottenTomatoesMovieRatings = [];
          changeButton();

          $.ajax({
            url: userUrl,
            dataType: 'json',
            success: function(data) {
                      likedMovies = data.data
                    },
            complete: function() {

                        $.each(likedMovies, function(i, movie) {
                          var movieID = movie.id;
                          var movieTitle = movie.name;
                          var releaseDate
                          var movieUrl = 'https://graph.facebook.com/v2.3/' + movieID +
                                         '?fields=release_date&access_token=' + accessToken
                          $.ajax({
                            url: movieUrl,
                            dataType: 'json',
                            success: function(data) {
                              releaseDate = data.release_date.substring(data.release_date.length - 4);
                            },
                            complete: function() {
                              var movieSearchUrl = 'http://www.omdbapi.com/?t=' + movieTitle + '&y=' +
                                                    releaseDate + '&type=movie&tomatoes=true&plot=short&r=json'
                              $.getJSON(movieSearchUrl, function(data) {
                                var imdbRating = data.imdbRating;
                                imdbMovieRatings.push(imdbRating);
                                var rottenTomatoesRating = data.tomatoMeter;
                                rottenTomatoesMovieRatings.push(rottenTomatoesRating);
                                console.log( movieTitle + ' IMDB: ' + imdbRating + ' RT: ' +
                                             rottenTomatoesRating + '%'  );
                                addMovie(movieTitle, imdbRating, rottenTomatoesRating);
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
