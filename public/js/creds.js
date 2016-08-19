// Initialize Firebase

const $emailInput = $("#email_input");
const $passwordInput = $("#password_input");
const $signInBtn= $("#btnSignIn");
const $signOutBtn = $("#btnSignOut");
const $signUpBtn = $("#btnSignUp");

function signedInDisplay(displayName) {
	$(".form-signin-heading").html(displayName + " is signed in");
}

function signedOutDisplay(theUser) {
	$(".form-signin-heading").html("You have signed out");
}

function emailVerifyDisplay() {
	$(".form-signin").html("Please Verify Email to continue");
}

function toggleSignIn() {
  if (firebase.auth().currentUser) {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  } else {
    const email = $emailInput.val();
    const password = $passwordInput.val();
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END authwithemail]
  }
}
/**
 * Handles the sign up button press.
 */
function handleSignUp() {

  const email = $emailInput.val();
  const password = $passwordInput.val();

  console.log(email, password);

  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }

  // Sign in with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  }).then(function(result){
  	console.log("sending Email Verification");
  	sendEmailVerification();
  });
  // [END createwithemail]
}
/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    // Email Verification sent!
    // [START_EXCLUDE]
    alert('Email Verification Sent!');
    // [END_EXCLUDE]
  });
  // [END sendemailverification]
}
function sendPasswordReset() {
  const email = $emailInput.val();
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    alert('Password Reset Email Sent!');
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}

function addDisplayNameToUser() {
	const displayNameValue = $("#display_name_input").val();
	var user = firebase.auth().currentUser;

	user.updateProfile({
	  displayName: displayNameValue
	});
}

function userDisplayNameCreation() {
	$(".form-signin").html('<input id="display_name_input" type="text" class="form-control" name="displayName" placeholder="Display Name" autofocus="" /><button id="btnDisplayName" class="btn btn-lg btn-primary btn-block">Choose Display Name</button> ');
}

var initApp = function() {

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	console.log(user);
	    // User is signed in.
	    $signOutBtn.removeClass("hide");

	    user.getToken().then(function(accessToken) {

	    	if (!user.emailVerified) {
          emailVerifyDisplay();
        } else if (user.displayName !== null) {
        	signedInDisplay(user.displayName);
        	afterAuth(user.uid, user.displayName);
        }	else {
        	userDisplayNameCreation();
        }   	

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

	$(document).on("click", "#btnSignIn", toggleSignIn);
	$(document).on("click", "#btnSignOut", toggleSignIn);
	$(document).on("click", "#btnSignUp", handleSignUp);
	$(document).on("click", "#btnDisplayName", addDisplayNameToUser);
}

window.onload = function() {
   initApp();
};