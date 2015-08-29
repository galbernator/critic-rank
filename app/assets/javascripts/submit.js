$(document).ready(function() {
  var facebookID
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
          var url = 'https://graph.facebook.com/v2.3/' + facebookID + '/movies?access_token=' + accessToken
          console.log(response);
          $.getJSON(url, function(data) {
            console.log(data);
            // loop through each of the results and then call addProduct on each result
            for (var i=0; i < data.data.length; i += 1) {
              var movie = data.data[i].name;
              console.log(movie);
            //   addWalmartProduct(company, movie);
            };
          })
        })
        .fail(function (err) {
            //handle error with err
        });
      }
    });
  });
});
