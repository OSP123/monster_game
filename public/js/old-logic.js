$( document ).ready(function() {
	// Set up refs for Database endpoints
	var db = firebase.database();
	var playersRef = db.ref('/players');
	var roomsRef = db.ref('/channels');
	var amOnline = db.ref('/.info/connected');

	function addRoomAndEmptySeats() {

	  var newRoom = {
	  	seat1: "empty",
	  	seat2: "empty",
	  	seat3: "empty",
	  	seat4: "empty",
	  	locked: false,
	  	numPlayers: 0
	  }

	  roomsRef.push(newRoom);
	}

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

	// Note, this returns a promise
	function findPlayer(uid) {
  	return playersRef.once("value")
  		.then(function(snapshot) {
  			var result = false;
  			snapshot.forEach(function(childSnapshot) {
	  			if (childSnapshot.val().uid === uid) {
					result = childSnapshot.val();
				}
			});
			return result;
  		});
  }

  // This will return a promise
  function checkIfPlayerExists(uid) {
  	return playersRef.once("value")
  		.then(function(snapshot) {
  			var result = [false];
  			snapshot.forEach(function(childSnapshot) {
	  			if (childSnapshot.val().uid === uid) {
					console.log("We found it!");
					result[0] = true;
					result.push(childSnapshot.val());
				}
			});
			return result;
  		});
  }

  function seatCheckAndRoomUpdate(uid, thePlayerObject){

		return roomsRef.once("value")
		 	.then(function(snapshot) {

		 		var objData = {};
		 		var dataHasBeenSet = false;
		 		

		 		console.log("Is this being passed into seatCheckAndRoomUpdate",thePlayerObject);
		 		
		 		// look through each room and find one that is empty
		  	snapshot.forEach(function(childSnapshot) {
		  		childSnapshot.forEach(function(roomProp) {
		  			// Need to figure out a way to the check if the data has already been added

		  			var roomKey = childSnapshot.key;

		  			console.log("Room Key", roomKey);
		  			
			  			if (roomProp.val() == "empty" && thePlayerObject.room == null) {

								// find Player and assign room key to the room property
							  // Make this more efficient by putting code into a function
							  playersRef.once('value', function(snapshot) {
							  	snapshot.forEach(function(childSnapshot) {
							  		if (childSnapshot.val().uid === uid) {
							  			childSnapshot.ref.update({ 
									  		room: roomKey 
									  	});
							  		}
							  	})
							  }).then(function(result){
							  	roomProp.ref.set(uid);
							  })

								var numberOfPlayers = childSnapshot.val().numPlayers;
							  // Now simply find the parent and return the name.
							  if (numberOfPlayers < 4) {
							  	childSnapshot.ref.update({ 
							  		numPlayers: numberOfPlayers + 1 
							  	});
							  }

							  

							  // Add player to Room
							  
							  
							  if (numberOfPlayers == 4) {
							  	childSnapshot.ref.update({ locked: true });
							  }

							 	objData.key = childSnapshot.key;
							 	dataHasBeenSet = true;
							}
							if (dataHasBeenSet) {
			  				// will exit out of loop
			  				return true;
			  			}
		  			// })
		  		})
				});
				return objData;
			});
  }

  function createRoom(uid) {
  	return playersRef.once("value")
  		.then(function(snapshot) {
  			var result = false;
  			snapshot.forEach(function(childSnapshot) {
	  			if (childSnapshot.val().uid === uid) {
					console.log("We found it!");
					// currentPlayer = childSnapshot.val();
					result = true;
				}
			});
			return result;
  		});
  }

	function createPlayer(uid, displayName, playerExists) {

	  var playerData = {
	    name: displayName,
	    uid: uid,
	    hitPoints: 100, //Default to 100 hitpoints for now
	    turn: 0, // Default to 0 for now. This could be used later with a data ref to turns/
	    playerImage: "", //Currently set to some default image. This will be based off of the character the user chooses.
	    attacks: {
	    	basicAttack: 35,
	    	advancedAttack: 50,
	    	ultraAttack: 75,
	    	ridiculousAttack: 125
	    },
	    items: {},
	    room: null
	  };

	  // Get a key for a new Player.
	  var newPlayerKey = playersRef.push().key;

	  // Write the new player's data in the players list.
	  var updates = {};
	  updates['/players/' + newPlayerKey] = playerData;

	  db.ref().update(updates);

	  return playerData;
	}

	var initApp = function() {
		firebase.auth().onAuthStateChanged(function(user) {
	    if (user) {
	      // User is signed in.

	      var userRef = db.ref('/presence/' + user.uid);

	      // checks to see if the user is logged in.
      	amOnline.on('value', function(snapshot) {
				  if (snapshot.val()) {
				  	// Preferably all users see that user has been disconnected and ill come back.
				    userRef.onDisconnect().set("☆ offline");

				    userRef.set(true);
				  }
				});

	      user.getToken().then(function(accessToken) {
	      	
	      	// Display log in name
	      	signedInDisplay(user.displayName);

	      	// for (var i = 0; i < 100; i++) {
	      	// 	addRoomAndEmptySeats();
	      	// }
	      	
				  
				  // Check to see if player already created
				  checkIfPlayerExists(user.uid)
				  	.then(function(arrayOfBooleanAndPlayer){

				  		var player;
				  		// If player doesn't exist, create the player, otherwise mention that player is already in the system
				  		if (arrayOfBooleanAndPlayer[0] == false) {
				  			player = createPlayer(user.uid, user.displayName);
				  			console.log(player);
				  		} else if (arrayOfBooleanAndPlayer[0]) {
				  			player = arrayOfBooleanAndPlayer[1];
				  		}

				  		console.log(player);

				  		return player;

				  	}).then(function(playerObject){
				  		console.log("Hopefully, player key", playerObject);
				  		// I want the result to be the player that was created
				  		// addRoomAndEmptySeats();
				  		return seatCheckAndRoomUpdate(user.uid, playerObject);

				  	}).then(function(result){
				  			// console.log(result);
				  	});
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

});