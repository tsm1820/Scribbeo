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

    var provider = new firebase.auth.GoogleAuthProvider();

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

            // send message to background.js for query
            chrome.runtime.sendMessage({ message: 'signin' }, function (response) {
                // if signed in successfully, replace the page to signed in page
                if (response.message === 'signinsuccess') {
                    window.location.replace('popup-signedin.html');
                }
            });

            // ...
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
        // [END auth_google_signin_popup]
      }

      function signOut() {
        // [START auth_sign_out]
        firebase.auth().signOut().then(() => {
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
        });
        // [END auth_sign_out]
      }


    document.getElementById('sign-in').addEventListener('click', () => {
        googleSignInPopup(provider);
    });    
}

      