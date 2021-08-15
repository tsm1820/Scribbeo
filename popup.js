console.log("popupscript");
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
window.onload = function() {


    const firebaseConfig = {
        apiKey: "AIzaSyDWio76-wq-BBHF13c4DfzypSnQwknnlkg",
        authDomain: "scribbeo-b350e.firebaseapp.com",
        projectId: "scribbeo-b350e",
        storageBucket: "scribbeo-b350e.appspot.com",
        messagingSenderId: "389666741311",
        appId: "1:389666741311:web:0baaad88af48a02c4aec8a",
        measurementId: "G-BHTBQTMXLP"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.firestore();


    var getstarted = document.getElementById('sign-in');
    
    var provider = new firebase.auth.GoogleAuthProvider();

    if (getstarted) {
      // when they click the 'get started' button to launch the google sign in
      // sends a message to backend to log them in
      getstarted.addEventListener('click', function () {      
          googleSignInPopup(provider);
      });
    }


      function googleSignInPopup(provider) {
      // [START auth_google_signin_popup]
        firebase.auth()
          .signInWithPopup(provider)
          .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                  window.location = 'popup-signedin.html';
                  chrome.browserAction.setPopup( { popup: "popup-signedin.html" });
                } else {
                    /// user is not signed in 
                }
              });

        }).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    }

  

}


