$(document).ready(function() {
  $('#get-it').click(function(){
    OAuth.popup('facebook', function(error, result) {
      if (error) {
        alert(error); // do something with error
        return;
      } else {
        result.get('/me').done(function (response) {
            //this will display "John Doe" in the console
            console.log(response);
            for (var i = 0; i < response.length; i += 1) {
              var info = response[i];
              console.log(info);
            }
        })
        .fail(function (err) {
            //handle error with err
        });
      }
    });
  });
});
