// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/login", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");  
});

// Routing
//app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

// socket events
var numUsers = 0;

/*
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
*/

// recieve a new note from a client and emit
// to all the other clients.
io.on('connection', (socket) => {
  socket.on('new note', msg => {
    io.emit("new note", msg)
  });
  
  socket.on('add user', function (username) {
    //if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    
    ++numUsers;
    
    socket.emit('login', {numUsers: numUsers});
    
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers}
    );
    
  });
 
  
});


/*
io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new note', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

*/