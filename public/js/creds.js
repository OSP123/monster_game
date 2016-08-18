// Initialize Firebase

const $email = $("#email_input");
const $password = $("#password_input");
const $signIn= $("#btnSignIn");
const $signOut = $("#btnSignOut");
const $signUp = $("#btnSignUp");

$signIn.click(function(){
	const email = $email.val();
	const password = $password.val();
	const auth = firebase.auth();

	const promise = auth.signInWithEmailAndPassword(email, password);
	promise.catch(function(e){
		console.log(e.message)
	});
});

$signOut.click(function(){
	firebase.auth().signOut();
});

$signUp.click(function(){
	// Create some validation for emails
	const email = $email.val();
	const password = $password.val();
	const auth = firebase.auth();

	const promise = auth.createUserWithEmailAndPassword(email, password);
	promise.catch(function(e){
		console.log(e.message);
	});
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    user.getToken().then(function(accessToken) {

    	afterAuth(user);
    	
    	// Display log in name
    	signedInDisplay(user.displayName);

    	// for (var i = 0; i < 100; i++) {
    	// 	addRoomAndEmptySeats();
    	// }
  });
  } else {
    // User is signed out.
    signedOutDisplay(user.displayName);
  }
}, function(error) {
  console.log(error);
});