// do window.onload so that the javascript file runs after the html loads
window.onload = function() {
    

    const firebaseConfig = {
        apiKey: "AIzaSyDWio76-wq-BBHF13c4DfzypSnQwknnlkg",
        authDomain: "scribbeo-b350e.firebaseapp.com",
        projectId: "scribbeo-b350e",
        storageBucket: "scribbeo-b350e.appspot.com",
        messagingSenderId: "389666741311",
        appId: "1:389666741311:web:0baaad88af48a02c4aec8a",
        measurementId: "G-BHTBQTMXLP",
        databaseURL: "https://scribbeo-b350e-default-rtdb.asia-southeast1.firebasedatabase.app"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var signout = document.getElementById('sign-out');


    var createDocButton = document.getElementById('createdocbutton');

    var oldNotes = document.getElementById('oldnotes');
    var name = document.getElementById('name');
    var timeOfDay = document.getElementById('currentTime');

    var blackbackground = document.getElementById('blackbackground');

    var newDocModal = document.getElementById('newdocmodal');
    var newDocTitle = document.getElementById('newdoctitle');
    var newDocSubmit = document.getElementById('newdocsubmit');
    var newDocCancel = document.getElementById('closenewdocmodal');

    var signoutconfirm = document.getElementById('signoutconfirm');
    var yesoutconfirm = document.getElementById('yesoutbutton');
    var nooutconfirm = document.getElementById('nooutbutton');
    var helpguide = document.getElementById('helpguide');
    var guidebook = document.getElementById('guidebook');

    var closeguidebutton = document.getElementById('closeguidebutton');

    var date = new Date();
    var currentTime = date.getHours();
    
    // firebase user id to access database 
    var userId;

    // if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userId = user.uid;
            chrome.runtime.sendMessage({userId: userId});
            updName();
        }
    });

    // adjusts greeting based on time of the day
    if (currentTime > 5 && currentTime < 12) {
        timeOfDay.textContent = "morning";
    } else if (currentTime >= 12 && currentTime < 17) {
        timeOfDay.textContent = "afternoon";
    } else {
        timeOfDay.textContent = "evening";
    }

    var sliderHidden = true; 

    if (helpguide) {
        helpguide.addEventListener('click', () => {
            guidebook.style.display = "block";
            blackbackground.style.display = "block";
        });    

        closeguidebutton.addEventListener('click', () => { 
            guidebook.style.display = "none";
            blackbackground.style.display = "none";
        });
    }

    if (signout) {
        // when they click the 'sign out' button to sign out of everything
        // sends a message to backend to log them out
        signout.addEventListener('click', () => {
            signoutconfirm.style.display = "block";
            blackbackground.style.display = "block";
            
            if (yesoutconfirm && nooutconfirm) {
                yesoutconfirm.addEventListener('click', () => {
                    signOut();
                    blackbackground.style.display = "none";
                    window.location.replace('popup.html');
                    chrome.browserAction.setPopup( { popup: "popup.html" });
                });    
                nooutconfirm.addEventListener('click', () => {
                    signoutconfirm.style.display = "none";
                    blackbackground.style.display = "none";
                });    
            }
        });    
    }

    if (oldNotes) {
        oldNotes.addEventListener('click', function () {
            window.location.replace('usersdocs.html');
            chrome.browserAction.setPopup( { popup: "usersdocs.html" });
        });
    }


    if (createDocButton) {
        
        createDocButton.addEventListener('click', function () {
            blackbackground.style.display = "block";
            newDocModal.style.display = "block";
            
            if (newDocSubmit) {
                newDocSubmit.addEventListener('click', function () {
                    // asks for name of document
                    var newDocName = newDocTitle.value;
                    
                    if (newDocName === "") {
                        alert("Please enter a title for your document");
                    }
                    // sends request to google apps script to create a document as well as push 
                    // to the user's created documents 
                    //background.users.documents.push(newDocName);
                    chrome.runtime.sendMessage({addNewDoc: newDocName}, function(response) {
                        if (response.haveDoc === true) {
                            alert("Another document with this name exists. Please choose another name");
                        } else {
                            // brings to note taking page
                            var newDoc = "new";
                            var url = 'note-taking.html' + '#' + newDocName + '/' + newDoc;
                            window.location.replace(url);
                            chrome.browserAction.setPopup( { popup: url });
                        }
                    });                        
                });    
                blackbackground.style.display = "none";
            }     
        });

        newDocCancel.addEventListener('click', () => { 
            newDocModal.style.display = "none";
            blackbackground.style.display = "none";
        });
    }
      
    
    function updName() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                name.textContent = user.displayName.split(" ")[0];
            }
          });
    }

    function signOut() {
        firebase.auth().signOut().then(() => {
            chrome.browserAction.setPopup( { popup: "popup.html" });
        }).catch((error) => {});
    }

}