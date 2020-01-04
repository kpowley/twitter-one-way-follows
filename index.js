// Packages
var app = require('express')();
var bodyParser = require('body-parser');
var userList = require('./user-list');

// Config and Pug setup
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

// Static path
app.get('/', (req, res) => {
  res.render('index');
});

// API post path
app.post('/get_users', (req, res) => {
  var screen_name = req.body.handle;
  var users = userList(res, screen_name);
});

// App setup
const port = process.env.PORT || 5000;
app.listen(process.env.PORT, () =>
  console.log(`Server started on port: ${port}`)
);
