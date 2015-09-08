$(document).ready(function() {

  var usersFacebookID;
  var usersFacebookPicture;
  var usersName;
  var rank;
  var usersFacebookProfileUrl;
  var usersFacebookFriends = [];
  var likedMovies;
  var numberOfLikedMovies;
  var requestCounter = 0;
  var imdbRatingResultsArray = [];
  var rottenTomatoesRatingResultsArray = [];
  var imdbAvg;
  var rottenTomatoesAvg;
  var overallAvg;

  var rankCalculate = function(rankArray) {
    if (rankArray == undefined) {
      return '<div class="share">Share to see your rank!</div>'
    } else {
      // insert code to find where in the ranking array the user falls
    }
  };

  var loadingResultsButton = function() {
    $('#button').html('');
    $('#button').html('<button class="btn btn-lg btn-info">Calculating Your Results <span class="glyphicon glyphicon-refresh spinning"></span></button>');
  };

  // changes the button from 'find out' to 'share results'
  var changeButton = function() {
    $('#button').html('');
    $('#button').html('<button id="share-it" class="btn btn-lg btn-success">Share Your Rating</button>');
  };

  // if there is an error, show the original button to user
  var returnToOriginalButton = function() {
    $('#button').html('');
    $('#button').html('<button id="get-it" class="btn btn-lg btn-warning">Find Out Now</button>');
  }

  // calculate the overall average of both imdb abd rotten tomatoes
  var overallAverage = function() {
    overallAvg = (imdbAvg + (rottenTomatoesAvg/10))/2
    console.log(overallAvg);
    return overallAvg;
  }

  // takes the movie information and returns a list item with the movie information
  var renderResults = function () {
    var html = '<tr><td><div class="rank-box">' + rankCalculate(rank) + '</div></td><td><img src="' + usersFacebookPicture + '" class="profile-img" /></td><td class="name">' + usersName + '</td><td class="rating-title"><img src="http://gallowmere.com/wp-content/uploads/2012/06/imdb-logo.png" class="imdb-logo" /><div class="rating-result">' + imdbAvg + '</div></td><td class="rating-title"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Rt-logo.svg/300px-Rt-logo.svg.png" class="rt-logo" /><div class="rating-result">' + rottenTomatoesAvg + '%</div></td></tr>'
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
      average = +(sum/numberOfRatings).toFixed(2);
    } else {
      alert('Your results could not be calculated becuase no rating results were received. Please try again later.')
    }
    return average
  };

  $('#get-it').click(function(){
    OAuth.popup('facebook', function(error, result) {
      var accessToken = result.access_token;
      console.log('Access Token: ' + accessToken);
      if (error) {
        alert(error); // do something with error
        return;
      } else {
        loadingResultsButton();
        result.me().done(function (response) {
          console.log(response);
          // save the user's profile picture, name and profile url and add to hidden form
          usersFacebookPicture = response.avatar;
          usersName = response.name;
          usersFacebookProfileUrl = response.url
          // Use the ID to get the movies
          usersFacebookID = response.id;
          var userFriends;
          var userUrl = 'https://graph.facebook.com/v2.3/' + usersFacebookID + '/movies?access_token=' +
                         accessToken
          var userFriendsUrl = 'https://graph.facebook.com/v2.3/' + usersFacebookID + '/friends?limit=5000&access_token=' +
                         accessToken

          // get a  list user's friends
          $.ajax({
            url: userFriendsUrl,
            dataType: 'json',
            success: function(data) {
                      console.log(data);
                      userFriends = data.data;
                    },
            complete: function() {
              for (var i = 0; i < userFriends.length; i += 1) {
                usersFacebookFriends.push(userFriends[i].id);
              };
              console.log(usersFacebookFriends);
            }
          });

          // get a user's liked movies
          $.ajax({
            url: userUrl,
            dataType: 'json',
            success: function(data) {
                      likedMovies = data.data;
                      numberOfLikedMovies = likedMovies.length;
                    },
            complete: function() {
                          if (numberOfLikedMovies === 0){
                            alert('You do not have any "Liked" movies. Please go Facebook and "Like" your favorite movies and then try again.');
                            returnToOriginalButton();
                          } else {
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
                                  if (data.release_date != undefined) {
                                    // with the release year, search the OMDB database to get ratings info
                                    var movieSearchUrl = 'https://www.omdbapi.com/?t=' + movieTitle + '&y=' +
                                                          releaseDate + '&type=movie&tomatoes=true&plot=short&r=json'
                                  } else {
                                    var movieSearchUrl = 'https://www.omdbapi.com/?t=' + movieTitle +
                                                          '&type=movie&tomatoes=true&plot=short&r=json'
                                  }
                                  $.ajax({
                                    url: movieSearchUrl,
                                    dataType: 'json',
                                    success: function(data) {
                                      requestCounter += 1;
                                      var imdbRating = data.imdbRating;
                                      var rottenTomatoesRating = data.tomatoMeter;
                                      if (isNaN(parseFloat(imdbRating)) === false) {
                                        imdbRatingResultsArray.push(imdbRating);
                                      }
                                      if (isNaN(parseFloat(rottenTomatoesRating)) === false) {
                                        rottenTomatoesRatingResultsArray.push(rottenTomatoesRating);
                                      }
                                      console.log(movieTitle + '(' + releaseDate + '): IMDB-' + imdbRating + ' RT-' + rottenTomatoesRating);
                                    },
                                    complete: function() {
                                      // when all of the requests have completed, calculate averages, render results on page by calling renderResults, and save user
                                      if (requestCounter === numberOfLikedMovies) {
                                        imdbAvg = averageRating(imdbRatingResultsArray);
                                        rottenTomatoesAvg = averageRating(rottenTomatoesRatingResultsArray);
                                        overallAvg = overallAverage(imdbAvg, rottenTomatoesAvg);
                                        renderResults();
                                        console.log('IMDB Array - ' + imdbRatingResultsArray);
                                        console.log('RT Array - ' + rottenTomatoesRatingResultsArray);
                                        changeButton();
                                        // save users and rating results to the database
                                        $.ajax({ url: '/users',
                                                          type: 'POST',
                                                          beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                                                          data: { facebook_id: usersFacebookID, name: usersName, facebook_picture: usersFacebookPicture, facebook_url: usersFacebookProfileUrl, imdb_avg: imdbAvg, rt_avg: rottenTomatoesAvg, overall_avg: overallAvg },
                                                          success: function(response) {
                                                            console.log('User should be created');
                                                          }
                                                        })
                                                        .fail(function(error){
                                                          console.log(error);
                                                        });
                                      }
                                    }
                                  })
                                }
                              })
                            });
                          };
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
