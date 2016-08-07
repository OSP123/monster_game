$( document ).ready(function() {
	var db = firebase.database();
	var playersRef = db.ref('/players');
	var rooms = db.ref('/channels');

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

	  rooms.push(newRoom);
	}

	// var checkForUserId = function(userId) {
	// 	if (arrayOfUserIds.indexOf(userId) >= 0 ) {
	// 		console.log("we are a go");
	// 		console.log(arrayOfUserIds);
	// 	} else {
	// 		console.log("wtf");
	// 	}
	// }

	$("#testButton").on("click", function() {
		firebase.auth().onAuthStateChanged(function(user) {
	      if (user) {
	        // User is signed in.
	        rooms.once("value", function(snapshot) {
					  snapshot.forEach(function(childSnapshot) {
					  	console.log(childSnapshot.val());
				  	});
					});
	        
	        user.getToken().then(function(accessToken) {
	        	if (user.room == "empty") {
	        		for (var seat in rooms) {
	        			if (rooms[seat] == "empty") {
	        				console.log("empty seat");
	        			}
	        			else {
	        				console.log("seats are full");
	        			}
	        		}
	        		// If the user doesn't have a room, either add the user to a room or create a new room for the user.
	        		// addRoom();
	        	}
	        	else {

	        	}
	        });
	      } else {
	        // User is signed out.
	        // document.getElementById('sign-in-status').textContent = 'Signed out';
	        // document.getElementById('sign-in').textContent = 'Sign in';
	        // document.getElementById('account-details').textContent = 'null';
	      }
	    }, function(error) {
	      console.log(error);
	    });
	});

	var initApp = function() {
    	// firebase.auth().onAuthStateChanged(function(user) {
	    //   if (user) {
	    //     // User is signed in.
	        
	    //     user.getToken().then(function(accessToken) {
	    //     	if (user.room == "empty") {
	    //     		for (var seat in rooms) {
	    //     			if (rooms[seat] == "empty") {
	    //     				console.log("empty seat");
	    //     			}
	    //     			else {
	    //     				console.log("seats are full");
	    //     			}
	    //     		}
	    //     		// If the user doesn't have a room, either add the user to a room or create a new room for the user.
	    //     		// addRoom();
	    //     	}
	    //     	else {

	    //     	}
	    //     });
	    //   } else {
	    //     // User is signed out.
	    //     // document.getElementById('sign-in-status').textContent = 'Signed out';
	    //     // document.getElementById('sign-in').textContent = 'Sign in';
	    //     // document.getElementById('account-details').textContent = 'null';
	    //   }
	    // }, function(error) {
	    //   console.log(error);
	    // });
  };

  window.addEventListener('load', function() {
    initApp();
  });

 // 	playersRef.once("value", function(snapshot) {
	//   snapshot.forEach(function(childSnapshot) {
	//   	console.log(childSnapshot.val());
 //  	});
	// });

	// $('#username').keypress(function(e) {
	//   if (e.keyCode == 13 && $('#username').val() !== "") {
	//     username = capitalize($('#username').val());
	//     getInGame();
	//   }
	// });

	//Function to capitalize usernames
	function capitalize(name) {
	  return name.charAt(0).toUpperCase() + name.slice(1);
	}

});
