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

	// 	playersRef.once("value", function(snapshot) {
	// 	  snapshot.forEach(function(childSnapshot) {
	// 			if (childSnapshot.val().uid == uid) {
	// 				console.log("Player already exists");
	// 				result = true;
	// 			}
	//   	});
	// 	});

	// 	return result;
	// }

	function findPlayer(uid) {
			if (playersRef.child(uid)) {

				console.log("Found it!");

				return playersRef.child(uid).once('value').then(function(snapshot) {

		    	return snapshot.val();

				});

			} else {

				console.log("not found");

				return false;
			}
	  };

	  function checkIfPlayerExists() {
		  playersRef.once("value", function(snapshot) {
			  snapshot.forEach(function(childSnapshot) {
						if (childSnapshot.val().uid === uid) {
							console.log("We found it!");
							// currentPlayer = childSnapshot.val();
							result = true;
						}
		  	});
			});
			return result;
	  }



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

	// function createPlayer(uid, displayName) {

	//   var playerData = {
	//     name: displayName,
	//     uid: uid,
	//     hitPoints: 100, //Default to 100 hitpoints for now
	//     turn: 0, // Default to 0 for now. This could be used later with a data ref to turns/
	//     playerImage: "", //Currently set to some default image. This will be based off of the character the user chooses.
	//     attacks: {
	//     	basicAttack: 35,
	//     	advancedAttack: 50,
	//     	ultraAttack: 75,
	//     	ridiculousAttack: 125
	//     },
	//     items: {},
	//     room: null
	//   };

	//   // Get a key for a new Player.
	//   var newPlayerKey = playersRef.push().key;

	//   // Write the new player's data in the players list.
	//   var updates = {};
	//   updates['/players/' + newPlayerKey] = playerData;

	//   return db.ref().update(updates);
	// }

		//Function to capitalize usernames
	function capitalize(name) {
	  return name.charAt(0).toUpperCase() + name.slice(1);
	}

	roomsRef.on("value", function(snapshot) {
	  snapshot.forEach(function(childSnapshot) {
			if (childSnapshot.val().seat == "empty") {
				console.log("empty seat");
			} else {
				console.log("seats are full");
			}

			});
	});

