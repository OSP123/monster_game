$( document ).ready(function() {
	var db = firebase.database();
	var chatData = db.ref('/chat');
	var playersRef = db.ref('/players');
	var currentTurnRef = db.ref('/turn');

	var username = "Guest";
	var currentPlayers = null;
	var currentTurn = null;
	var playerNum = false;
	var playerOneExists = false;
	var playerTwoExists = false;
	var playerThreeExists = false;
	var playerFourExists = false;
	var playerOneData = null;
	var playerTwoData = null;
	var playerThreeData = null;
	var playerFourData = null;

	//USERNAME LISTENERS
	//Start button - takes username and tries to get user in game
	// $('#start').click(function() {
	//   if ($('#username').val() !== "") {
	//     username = capitalize($('#username').val());
	//     getInGame();
	//   }
	// });

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    currentPlayers++;
	  } else {
	    currentPlayers--;
	  }
	});

	$('#username').keypress(function(e) {
	  if (e.keyCode == 13 && $('#username').val() !== "") {
	    username = capitalize($('#username').val());
	    getInGame();
	  }
	});

	//Function to capitalize usernames
	function capitalize(name) {
	  return name.charAt(0).toUpperCase() + name.slice(1);
	}

	//click event for dynamically added li elements
	$(document).on('click', 'li', function() {
	  console.log('click');
	  //grabs text from li choice
	  var clickChoice = $(this).text();

	  //sets the choice in the current player object in firebase
	  playerRef.child('choice').set(clickChoice);

	  //user has chosen, so removes choices and displays what they chose
	  $('#player' + playerNum + ' ul').empty();
	  $('#player' + playerNum + 'chosen').html(clickChoice);

	  //increments turn. Turn goes from:
	  //1 - player 1
	  //2 - player 2
	  //3 - determine winner
	  currentTurnRef.transaction(function(turn) {
	    return turn + 1;
	  });
	});

	//tracks changes in key which contains player objects
	playersRef.on('value', function(snapshot) {
	  //length of the 'players' array
	  currentPlayers = snapshot.numChildren();

	  //check to see if players exist
	  playerOneExists = snapshot.child('1').exists();
	  playerTwoExists = snapshot.child('2').exists();
	  playerThreeExists = snapshot.child('3').exists();
	  playerFourExists = snapshot.child('4').exists();

	  //player data objects
	  playerOneData = snapshot.child('1').val();
	  playerTwoData = snapshot.child('2').val();
	  playerThreeData = snapshot.child('3').val();
	  playerFourData = snapshot.child('4').val();

	  //If theres a player 1, fill in name and win loss data
	  if (playerOneExists) {
	    $('#player1name').text(playerOneData.name);
	    $('#player1wins').text("Wins: " + playerOneData.wins);
	    $('#player1losses').text("Losses: " + playerOneData.losses);

	  } else {
	    //if there is no player 1, clear win/loss data and show waiting
	    $('#player1name').text("Waiting for Player 1");
	    $('#player1wins').empty();
	    $('#player1losses').empty();
	  }

	  //if theres a player 2, fill in name and win/loss data
	  if (playerTwoExists) {
	    $('#player2name').text(playerTwoData.name);
	    $('#player2wins').text("Wins: " + playerTwoData.wins);
	    $('#player2losses').text("Losses: " + playerTwoData.losses);
	  } else {
	    //if no player 2, clear win/loss and show waiting
	    $('#player2name').text("Waiting for Player 2");
	    $('#player2wins').empty();
	    $('#player2losses').empty();
	  }
	});

	//When a player joins, checks to see if there are two players now. If yes, then it will start the game.
	playersRef.on('child_added', function(snapshot) {
	  if (currentPlayers == 4) {

	    //set turn to 1, which starts the game
	    currentTurnRef.set(1);
	  }
	});

	//Function to get in the game
	function getInGame() {
	  //checks for current players, if theres a player one connected, then the user becomes player 2.
	  //if there is no player one, then the user becomes player 1
	  if (currentPlayers < 4) {
	    if (playerOneExists) {
	      playerNum = 2;
	    } else {
	      playerNum = 1;
	    }

	    //creates key based on assigned player number
	    playerRef = new Firebase('https://monstergame-9944d.firebaseio.com/players/' + playerNum);

	    //creates player object. 'choice' is unnecessary here, but I left it in to be as complete as possible
	    playerRef.set({
	      name: username,
	      wins: 0,
	      losses: 0,
	      choice: null
	    });

	    //on disconnect remove this user's player object
	    playerRef.onDisconnect().remove();

	    //if a user disconnects, set the current turn to 'null' so the game does not continue
	    currentTurnRef.onDisconnect().remove();

	    //send disconnect message to chat with Firebase server generated timestamp and id of '0' to denote system message
	    chatDataDisc.onDisconnect().set({
	      name: username,
	      time: Firebase.ServerValue.TIMESTAMP,
	      message: 'has disconnected.',
	      idNum: 0
	    });

	    //Remove name input box and show current player number.
	    $('#swapzone').html('<h2>Hi ' + username + '! You are Player ' + playerNum + '</h2>');

	  } else {
	    //if current players is '2', will not allow the player to join
	    alert('Sorry, Game Full! Try Again Later!');
	  }
	}

});
