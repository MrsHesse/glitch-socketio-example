// Prompt for setting a username
var username = null;
var connected = false;


// this is all that is required to connect the client
// to the socket server on this host
var socket = io();

console.log("socket connected");
console.log(socket);


// form events
var notes = document.getElementById('notes');
var notetext = document.getElementById('noteText');
var usernametext = document.getElementById('usernameInput');

notetext.addEventListener('change', function(e){
    e.preventDefault();
    if( notetext.value){
      socket.emit('new note', {"from":username, "note":notetext.value});
      notetext.value="";
    }
});

usernametext.addEventListener('change', function(e){
    e.preventDefault();
    username = usernametext.value;
    if( username){
      
      // send a message to the server
      socket.emit('add user', username);
      
      // show the notes page
      switchToNotesPage();
    }
});


function switchToNotesPage(){
  var notespage = document.getElementById("notespage");
  var loginpage = document.getElementById("loginpage");
  
  notespage.style.display = "block";
  loginpage.style.display = "none";
  
};

/*
// Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

*/
// respond to socket messages
socket.on('new note', function (msg){
  var item = document.createElement('li');
  item.textContent = msg;
  item.innerHTML = "<span style='font-style: italic;font-weight: bold;'>" + msg.from + " >></span>";
  item.innerHTML = item.innerHTML + "  " + msg.note;
  console.log("client new node message received");
  console.log(item.innerHTML);
  notes.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});