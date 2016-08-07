$( document ).ready(function() {
		// Have the ability to create a session based on players authenticated
			// One method could be to check if there are any players authenticated. Putting that authenticated player in an array can show that there are players that are authenticated. 
			var authPlayers = [];
			// The player that is authenticated then has their own url generated on firebase that will track that session and the interactions within that session. 
			// If player number is larger than 4, a new session is created with the new player. Otherwise, the players joining will be part of the existing session.
			// Players can have option of having their own session or joining an existing session.

			

		//All my data is a giant JSON tree, which is what firebase databases are. So I have a 'rooms' child, (just a regular array), that I push room objects onto. Room objects are just regular javascript objects. Inside that room object is an array of seats for each player (yep another javascript object). Firebase makes it really easy to save data however you want it inside this JSON structure, and you can get updated when ANY reference is updated. So, I just add a simple listener the room object, and when players join, they modify that object (setting their Seat object to be occupied), and then all the players in the room are updated that event occurred, and then each player's client knows to fill that seat in, because it heard an update event. This is all done client-side with the Firebase JS library, its great.

});