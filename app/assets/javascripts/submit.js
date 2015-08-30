$(document).ready(function() {

  var facebookID

  var changeButton = function() {
    $('#button').html('')
    $('#button').html('<button id="share-it" class="btn btn-lg btn-warning">Share Your Rating</button>')
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
          var likedMovies
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
                              console.log(data);
                              releaseDate = data.release_date.substring(data.release_date.length - 4);
                              console.log(movieTitle + ' ' + releaseDate);
                            }
                          })
                        });
                        // loop through each movie
                        // for (var i=0; i < likedMovies.length; i += 1) {
                        //   console.log(movieTitle);
                        // }
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
