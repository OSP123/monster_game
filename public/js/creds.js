// Initialize Firebase

const $emailInput = $("#email_input");
const $passwordInput = $("#password_input");
const $signInBtn= $("#btnSignIn");
const $signOutBtn = $("#btnSignOut");
const $signUpBtn = $("#btnSignUp");

$signInBtn.on("click", function(){
	const email = $emailInput.val();
	const password = $passwordInput.val();
	const auth = firebase.auth();

	const promise = auth.signInWithEmailAndPassword(email, password);
	promise.catch(function(e){
		console.log(e.message)
	});
});

$signOutBtn.on("click", function(){
	firebase.auth().signOut();
});

$signUpBtn.on("click", function(){
	// Create some validation for emails
	const email = $emailInput.val();
	const password = $passwordInput.val();
	const auth = firebase.auth();

	const promise = auth.createUserWithEmailAndPassword(email, password);
	console.log("signup");
	promise.catch(function(e){
		console.log(e.message);
	});
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    $signOutBtn.removeClass("hide");

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
    // signedOutDisplay(user.displayName);
    $signOutBtn.addClass("hide");
  }
}, function(error) {
  console.log(error);
});