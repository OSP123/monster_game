
// Set up refs for Database endpoints
var db = firebase.database();
var playersRef = db.ref('/players');
var roomsRef = db.ref('/channels');
var amOnline = db.ref('/.info/connected');
var playerChoiceHTML = false;

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

$(document).on('click', '.chooseCharacter', function() {

  
});


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

function chooseCharacterPageLoad() {
	sessionStorage.setItem("characterScreenLoaded", "true");
	window.location = "../chooseCharacter.html";
}

function chooseCharacter(uid, playerObj) {
		// Do all the stuff for choosing a character. You should now be on choose character page
}

function seatCheckAndRoomUpdate(uid, thePlayerObject){
	return roomsRef.once("value")
	 	.then(function(snapshot) {

	 		var arrayOfData = [thePlayerObject];
	 		var dataHasBeenSet = false;

	 		// look through each room and find one that is empty
	  	snapshot.forEach(function(childSnapshot) {
	  		childSnapshot.forEach(function(roomProp) {
	  			
		  			if (roomProp.val() == "empty" && thePlayerObject.room == null) {

		  				var roomKey = childSnapshot.key;
		  				var nameOfRoom = roomProp.key;
		  				var numberOfPlayers = childSnapshot.val().numPlayers;

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
						  }).then(function(result){
						  	if (numberOfPlayers < 4) {
							  	childSnapshot.ref.update({ 
							  		numPlayers: numberOfPlayers + 1 
							  	});
						  	} else if (numberOfPlayers == 4) {
						  	childSnapshot.ref.update({ locked: true });
						  	}

						  	chooseCharacterPageLoad();
						  })
				
						 	objData.key = childSnapshot.key;
						 	dataHasBeenSet = true;
						}
						if (dataHasBeenSet) {
		  				// will exit out of loop
		  				return true;
		  			}
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


function afterAuth(uid, name) {
	var userRef = db.ref('/presence/' + uid);

  // checks to see if the user is logged in.
	amOnline.on('value', function(snapshot) {
	  if (snapshot.val()) {
	  	// Preferably all users see that user has been disconnected and ill come back.
	    userRef.onDisconnect().remove();

	    userRef.set(true);

	    // Check to see if player already created
		  checkIfPlayerExists(uid)
		  	.then(function(arrayOfBooleanAndPlayer){

		  		var playerObj;

		  		// If player doesn't exist, create the player, otherwise mention that player is already in the system
		  		if (arrayOfBooleanAndPlayer[0] == false) {
		  			playerObj = createPlayer(uid, name);
		  		} else if (arrayOfBooleanAndPlayer[0]) {
		  			playerObj = arrayOfBooleanAndPlayer[1];
		  		}

		  		console.log(playerObj);

		  		return playerObj;

		  	}).then(function(playerObject){
		  		// I want the result to be the player that was created
		  		if (sessionStorage.getItem("characterScreenLoaded") !== 'true') {
		  			return seatCheckAndRoomUpdate(uid, playerObject);
		  		// } else if ((sessionStorage.getItem("characterScreenLoaded") === 'true') && location.href ) {

		  		} else {
		  			// be sure to return the playerObject so that it gets passed to the next function
		  			chooseCharacter(uid, playerObject);
		  		}

		  		
		  	}).then(function(result){
		  			console.log("result from seatCheckAndRoomUpdate", result);
		  	});
	  }
	});
}


// window.addEventListener('load', function() {
// 	initApp();
// });