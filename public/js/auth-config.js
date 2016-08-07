// FirebaseUI config.
var uiConfig = {
  'signInSuccessUrl': '/',
  'signInOptions': [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  'tosUrl': '<your-tos-url>',
  'callbacks': {
	  'signInSuccess': function(currentUser, credential, redirectUrl) {
	    // Do something.
	    // Return type determines whether we continue the redirect automatically
	    // or whether we leave that to developer to handle.
	    console.log("You signed in successfully");
	    return true;
	  }
	}
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);