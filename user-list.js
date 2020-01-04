// Packages
var Twitter = require('twitter');
const config = require('config');

module.exports = function(res, screen_name) {
  var client = new Twitter({
    // Get Twitter API Keys
    consumer_key: config.get('consumer_key'),
    consumer_secret: config.get('consumer_secret'),
    access_token_key: config.get('access_token_key'),
    access_token_secret: config.get('access_token_secret')
  });

  var params = { screen_name: screen_name };
  var one_way_following = [];
  var users_to_display = [];

  // Twitter API get ids of followers
  client.get('followers/ids', params, function(error, followers_raw, response) {
    if (error) throw error;

    var followers = followers_raw.ids;

    // Twitter API get ids of people being followed
    client.get('friends/ids', params, function(error, following_raw, response) {
      if (error) throw error;

      var following = following_raw.ids;

      // Cycle through each person being followed
      // Look try to match their ID in the following list
      // If no match add them to the 'one-way-followin' list
      following.forEach(function(person) {
        if (followers.indexOf(person) === -1) {
          one_way_following.push(person);
        }
      });

      // Take first 100 of list to avoid ratelimit on next step
      one_way_following = one_way_following.slice(0, 99);

      var one_way_following_string = one_way_following.join();

      // Lookup the one way following users
      client.get(
        'users/lookup',
        { user_id: one_way_following_string },
        function(error, users, response) {
          users.forEach(function(user) {
            // Construct a user object for each one way follow user
            var userObject = {
              name: user.name,
              screen_name: user.screen_name,
              avatar: user.profile_image_url
            };

            // Push each user to the list
            users_to_display.push(userObject);
          });

          // Render the final one way following list
          res.render('list', { users: users_to_display });
        }
      );
    });
  });
};
