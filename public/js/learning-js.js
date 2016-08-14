$( document ).ready(function() {
	


	  // //update status to be working
	  // var checker = checkIfPlayerExists("foo");
	  // checker.then(function() {
	  // 	//update status to be idle
	  // });

	  // checker.then(outputStatus).then(function(success) {
	  // 	return checkIfPlayerExists("Bar");
	  // }).then(...);

	  // function outputStatus(x) {
	  // 	console.log(JSON.stringify(x));
	  // 	return x;
	  // }


	// function createPlayer(uid, displayName) {
	//     var p1 = new Promise(
	//         function(resolve, reject) {
	//             // resolve(findPlayer(uid));
	//         }
	//     );
	//     p1.then(
	//         // Log the fulfillment value
	//         function(val) {
	//      				console.log(val);
	//         })
	//     .catch(
	//         // Log the rejection reason
	//         function(reason) {
	//             console.log('Handle rejected promise ('+reason+') here.');
	//         });
	// }


	var db = firebase.database();
	var playersRef = db.ref('/players');
	var roomsRef = db.ref('/channels');
	var profiles = db.ref('/profiles');
	//This is where the profile of users will be stored. This might include the stats of the user over time, their avatar, and a few other things.

	// A location under GAME_LOCATION that will store the list of 
	// players who have joined the game (up to MAX_PLAYERS).
	var PLAYERS_LOCATION = 'player_list';

	// A location under GAME_LOCATION that you will use to store data 
	// for each player (their game state, etc.)
	var PLAYER_DATA_LOCATION = 'player_data';

	// The maximum number of players.  If there are already 
	// NUM_PLAYERS assigned, users won't be able to join the game.
	var NUM_PLAYERS = 4;

	function signedInDisplay(displayName) {
		$("#firebaseui-auth-container").hide();
		$("#firebase_authentication").html("<div class='col-sm-12'>" + "<h1>" + displayName + " is signed in.</h1>" +
        "</div>");
	}

	function signedOutDisplay(theUser) {
		$("#firebaseui-auth-container").show();
		$("#firebase_authentication").html("<div class='col-sm-12'>" + "<h1>" + displayName + " is signed out.</h1>" +
        "</div>");
	}

	var initApp = function() {
		firebase.auth().onAuthStateChanged(function(user) {
	    if (user) {
	      // User is signed in.

	      user.getToken().then(function(accessToken) {
	      	signedInDisplay(user.displayName);
				  // Consider adding '/<unique id>' if you have multiple games.
				  var gameRef = db.ref();
				  assignPlayerNumberAndPlayGame(user.uid, gameRef);
	      });
	    } else {
	      // User is signed out.
	      signedOutDisplay(user.displayName);
	    }
	  }, function(error) {
	    console.log(error);
	  });
	};

	window.addEventListener('load', function() {
		initApp();
	});

	// Called after player assignment completes.
	function playGame(myPlayerNumber, userId, justJoinedGame, gameRef) {
	  var playerDataRef = gameRef.child(PLAYER_DATA_LOCATION).child(myPlayerNumber);
	  alert('You are player number ' + myPlayerNumber + 
	      '.  Your data will be located at ' + playerDataRef.toString());

	  if (justJoinedGame) {
	    alert('Doing first-time initialization of data.');
	    playerDataRef.set({userId: userId, state: 'game state'});
	  }
	}

	// Use transaction() to assign a player number, then call playGame().
	function assignPlayerNumberAndPlayGame(userId, gameRef) {
	  var playerListRef = gameRef.child(PLAYERS_LOCATION);
	  var myPlayerNumber, alreadyInGame = false;

	  playerListRef.transaction(function(playerList) {
	    // Attempt to (re)join the given game. Notes:
	    //
	    // 1. Upon very first call, playerList will likely appear null (even if the
	    // list isn't empty), since Firebase runs the update function optimistically
	    // before it receives any data.
	    // 2. The list is assumed not to have any gaps (once a player joins, they 
	    // don't leave).
	    // 3. Our update function sets some external variables but doesn't act on
	    // them until the completion callback, since the update function may be
	    // called multiple times with different data.
	    if (playerList === null) {
	      playerList = [];
	    }

	    for (var i = 0; i < playerList.length; i++) {
	      if (playerList[i] === userId) {
	        // Already seated so abort transaction to not unnecessarily update playerList.
	        alreadyInGame = true;
	        myPlayerNumber = i; // Tell completion callback which seat we have.
	        return;
	      }
	    }

	    if (i < NUM_PLAYERS) {
	      // Empty seat is available so grab it and attempt to commit modified playerList.
	      playerList[i] = userId;  // Reserve our seat.
	      myPlayerNumber = i; // Tell completion callback which seat we reserved.
	      return playerList;
	    }

	    // Abort transaction and tell completion callback we failed to join.
	    myPlayerNumber = null;
	  }, function (error, committed) {
	    // Transaction has completed.  Check if it succeeded or we were already in
	    // the game and so it was aborted.
	    if (committed || alreadyInGame) {
	      playGame(myPlayerNumber, userId, !alreadyInGame, gameRef);
	    } else {
	      alert('Game is full.  Can\'t join. :-(');
	    }
	  });
	}

});
