$( document ).ready(function() {
	var db = firebase.database();
	var playersRef = db.ref('/players');
	var roomsRef = db.ref('/channels');
	var profiles = db.ref('/profiles');
	var amOnline = db.ref('/.info/connected');

	function addRoomAndEmptySeats() {

	  var newRoom = {
	  	seat1: "empty",
	  	seat2: "empty",
	  	seat3: "empty",
	  	seat4: "empty",
	  	locked: false
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
							// babySnap.val() = 
						} else {
							console.log("seats are full");
							addRoomAndEmptySeats();
						}
		  		})
				});
				return seatExists;
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

	  return db.ref().update(updates); 
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
				  
				  // Check to see if player already created
				  checkIfPlayerExists(user.uid)
				  	.then(function(result){

				  		var playerCreated = false;

				  		// If player doesn't exist, create the player, otherwise mention that player is already in the system
				  		if (result == false) {
				  			createPlayer(user.uid, user.displayName);
				  			playerCreated = true;
				  		} else if (result) {
				  			console.log("You're already in the system");
				  			playerCreated = false;
				  		}

				  		return playerCreated;

				  	}).then(function(result){
				  		// The result is if player was created or not. We could use this if we want to, but not necessary.
				  		console.log(result);
				  			// return function(){
				  			// 	doneChecking = false;
				  			// 	while (doneChecking == false) {
				  			// 		if (checkForSeat() == true){
				  			// 			doneChecking = true;
				  			// 		}
				  			// 	}
				  			// 	return doneChecking;
				  			// }
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