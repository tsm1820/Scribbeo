// page that displays all user created documents
// each document links to note-taking page with the specific google document id
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
    

    // firebase user id to access database 
    var userId;
    var gridOfDocuments = document.getElementById('columns');
    var backButton = document.getElementById('back');
    var signOut = document.getElementById('signout');
    var signoutconfirm = document.getElementById('signoutconfirm');
    var yesoutconfirm = document.getElementById('yesoutbutton');
    var nooutconfirm = document.getElementById('nooutbutton');
    var blackbackground = document.getElementById('blackbackground')

    var searchBar = document.getElementById('searchbar');

    // if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userId = user.uid;
            chrome.runtime.sendMessage({displayDocs: "display"}, function(response) {
                displayFileIcons(response.documents);
            });
            
        }
    });


    searchBar.addEventListener('keyup', event => {
        chrome.runtime.sendMessage({displayDocs: "display"}, function(response) {
            var allDocs = response.documents;
            const searchTyped = event.target.value.toUpperCase();

            for (let i = 0; i < allDocs.length; i++) {
                var docUpperCase = allDocs[i].toUpperCase();
                if (docUpperCase.includes(searchTyped)) {
                    showFileIcon(allDocs[i]);
                } else {
                    removeFileIcon(allDocs[i]);
                }
                
            }
        });
    });


    if (signOut) {
        // when they click the 'sign out' button to sign out of everything
        // sends a message to backend to log them out
        signOut.addEventListener('click', () => {
            signoutconfirm.style.display = "block";
            blackbackground.style.display = "block";
            
            if (yesoutconfirm && nooutconfirm) {
                yesoutconfirm.addEventListener('click', () => {
                    firebase.auth().signOut().then(() => {
                        chrome.browserAction.setPopup( { popup: "popup.html" });
                    }).catch((error) => {});
                    window.location.replace('popup.html');
                    blackbackground.style.display = "none";
                    chrome.browserAction.setPopup( { popup: "popup.html" });
                });    
                nooutconfirm.addEventListener('click', () => {
                    signoutconfirm.style.display = "none";
                    blackbackground.style.display = "none";
                });    
            }
        });    
    }

    if (backButton) {
        backButton.addEventListener('click', function () {
            window.location.replace("popup-signedin.html");
            chrome.browserAction.setPopup( { popup: "popup-signedin.html" });
        });    
    }

    // function to display all the user's icons once the page is loaded
    function displayFileIcons(allDocs) {
        for (var i = 0; i < allDocs.length; i++) {
            addFileIcon(allDocs[i]);
        }
    }    
        
    function addFileIcon(docName) {
        // image itself
        var fileWithText = document.createElement("div");
        fileWithText.setAttribute("id", docName);

        var filebutton = document.createElement("img");
        filebutton.setAttribute("id", "fileButton");
        filebutton.src = "images/alldocs.png";
        filebutton.style.cursor = "pointer";

        var text = document.createElement("span");
        text.innerHTML = docName;
        text.setAttribute("id", "documentName");

        fileWithText.appendChild(filebutton);
        fileWithText.appendChild(text);

        gridOfDocuments.appendChild(fileWithText);

        // url has information about the document id which is 
        // sent to note taking page 
        var oldDoc = "old";
        var url = 'note-taking.html' + '#' + docName + '/' + oldDoc;

        // makes file button clickable and redirects you to note taking page
        filebutton.addEventListener('click', () => {
            window.location.replace(url);
            chrome.browserAction.setPopup( { popup: url });
        });
    }

    function removeFileIcon(docName) {
        var fileWithTextToRemove = document.getElementById(docName);
        if (fileWithTextToRemove) {
            fileWithTextToRemove.style.display = "none";
        }    
    }

    function showFileIcon(docName) {
        var fileToShow = document.getElementById(docName);
        if (fileToShow) {
            fileToShow.style.display = "block";
        }
    }

}    