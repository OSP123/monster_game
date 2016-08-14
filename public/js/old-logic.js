$( document ).ready(function() {
	var db = firebase.database();
	var playersRef = db.ref('/players');
	var roomsRef = db.ref('/channels');
	var profiles = db.ref('/profiles');
	//USERNAME LISTENERS
	//Start button - takes username and tries to get user in game
	// $('#start').click(function() {
	//   if ($('#username').val() !== "") {
	//     username = capitalize($('#username').val());
	//     getInGame();
	//   }
	// });

	function addRoomAndEmptySeats() {

	  var newRoom = {
	  	seat1: "empty",
	  	seat2: "empty",
	  	seat3: "empty",
	  	seat4: "empty"
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

	// function playerExists(uid) {
		
	// 	var result = false;

		// playersRef.once("value", function(snapshot) {
		//   snapshot.forEach(function(childSnapshot) {
		// 		if (childSnapshot.val().uid == uid) {
		// 			console.log("Player already exists");
		// 			result = true;
		// 		}
	 //  	});
		// });

	// 	return result;
	// }

	// function findPlayer(uid) {
	// 		if (playersRef.child(uid)) {

	// 			console.log("Found it!");

	// 			return playersRef.child(uid).once('value').then(function(snapshot) {

	// 	    	return snapshot.val();

	// 			});

	// 		} else {

	// 			console.log("not found");

	// 			return false;
	// 		}
	//   };

	  // Michael's example of code working
	  function checkIfPlayerExists(uid) {
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

	  function checkForSeat(){
			return roomsRef.once("value")
			 	.then(function(snapshot) {
			 		var seatExists = false;
			  	snapshot.forEach(function(childSnapshot) {
			  		childSnapshot.forEach(function(babySnap) {
			  			if (babySnap.val() == "empty") {
								console.log("empty seat");
								seatExists = true;
							} else {
								console.log("seats are full");
							}
			  		})
					});
					return seatExists;
				});
	  }

	function createPlayer(uid, displayName) {

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

	  return db.ref().update(updates);
	}

		//Function to capitalize usernames
	function capitalize(name) {
	  return name.charAt(0).toUpperCase() + name.slice(1);
	}

	var initApp = function() {
		firebase.auth().onAuthStateChanged(function(user) {
	    if (user) {
	      // User is signed in.

	      user.getToken().then(function(accessToken) {

	      	signedInDisplay(user.displayName);
				  
				  checkIfPlayerExists(user.uid)
				  	.then(function(result){

				  		var playerCreated = false;

				  		if (result == false) {
				  			createPlayer(user.uid, user.displayName);
				  			playerCreated = true;
				  		} else if (result) {
				  			console.log("You're already in the system");
				  			playerCreated = false;
				  		}

				  		return playerCreated;

				  	}).then(function(result){
				  			return checkForSeat();
				  	}).then(function(result){
				  			console.log(result);
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