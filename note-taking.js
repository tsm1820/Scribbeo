window.onload = function () {

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

    var submitButton = document.getElementById('submit');
    var newnoteButton = document.getElementById('newnote');
    
    var signout = document.getElementById('sign-out');
    var documentName = document.getElementById('docname');
    var backButton = document.getElementById('back');
    var textarea = document.getElementById('notebox');
    var closeTextArea = document.getElementById('closebutton');
    var addTextArea = document.getElementById('addbutton');

    

    var notesHeaders = document.createElement("div");
    notesHeaders.setAttribute("id", "notesHeaders");
    document.body.appendChild(notesHeaders);

    var pdfButton = document.getElementById('pdfbutton');

    var notesHeadersDiv = document.getElementById("notesHeaders");

    // firebase user id to access database 
    var userId;
    var docId;
    var docNameRef;


    // if user is logged in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userId = user.uid;
            displayDocName();
            displayNotes();
            
        }
    });

    function reloadDisplay() {
        // reload notes headers division
        // should automatically call display notes again 
        notesHeaders.style.display = 'none';
        notesHeaders.style.display = 'block';
        
    }



    if (closeTextArea) {
        closeTextArea.addEventListener('click', function () {
            textarea.style.display = "none";
            submitButton.style.display = "none";
            notesHeaders.style.height = "453px";
            notesHeaders.style.top = "8px";
        })

    }

    if (addTextArea) {
        addTextArea.addEventListener('click', function () {
            textarea.style.display = "inline";
            textarea.removeAttribute('readonly');
            submitButton.style.display = "inline";
            notesHeaders.style.height = "280px" ;
        })

    }

    if (backButton) {
        backButton.addEventListener('click', function () {
            window.location.replace("usersdocs.html");
            chrome.browserAction.setPopup( { popup: "usersdocs.html" });
        });
    }



    if (submitButton) {
        // when submit button is clicked
        submitButton.addEventListener('click', () => {

            // sends to content.js
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var activeTab = tabs[0];
                var activeTabURL = activeTab.url;
                chrome.runtime.sendMessage({ URL: activeTabURL });

                chrome.tabs.sendMessage(activeTab.id, {

                    getURL: "getTime",
                    URL: activeTabURL

                }, function (response) {

                    if (response != undefined) {
                        var timeStampURL = response.URL;
                        var notes = document.getElementById('notebox').value;

                        var bundledNotes = {
                            time: timeStampURL,
                            notes: notes,
                            docname: docNameRef
                        };


                        var retrievedTimeHours = Math.floor(timeStampURL.split('=')[1] / 3600)
                        var retrievedTimeMin = Math.floor(timeStampURL.split('=')[1] % 3600 / 60)
                        var retrievedTimeSec = (timeStampURL.split('=')[1] % 60);
                        // sends to background.js
                        chrome.runtime.sendMessage({ addNote: bundledNotes });

                        // appending notes to the note-taking page
                        var header = document.createElement("header");
                        header.setAttribute("class", "headerid");
                        header.setAttribute("id", timeStampURL.split("=")[1]);   

                                           
                        
                        var h3 = document.createElement("h3");
                        h3.setAttribute("id", "notesinside");

                        h3.textContent = (retrievedTimeHours + "." + retrievedTimeMin + "." + retrievedTimeSec + ": " + notes);


                        // makes each note button clickable and redirects you to the YouTube URL
                        header.addEventListener('click', () => {
                            chrome.tabs.update(activeTab.id, {
                                url: timeStampURL
                            });
                        });

                        header.appendChild(h3);
                        
                        notesHeaders.appendChild(header);

                        // to scroll to the bottom if new note is added
                        header.scrollIntoView(true);
                        
                        // reset textbox to empty textbox
                        document.getElementById('notebox').value = "";
                        
                        // to refresh division
                        notesHeadersDiv.innerHTML = "";
                        displayNotes(header);

                        
                    } else {
                        alert("Sorry! Scribbeo works best on a YouTube page!");
                    }
                });
            });

        });
        
    }

    //THE ENTER BUTTON CODE
    document.getElementById("notebox")
        .addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.key === 'Enter') {
                document.getElementById("submit").click();
            }
        });



    function displayNotes(headerFromPrev) {
        notesHeaders.style.display = 'block';
        
        var numOfNotes;
        chrome.runtime.sendMessage({ displayNotes: docNameRef }, function (response) {
            if(chrome.runtime.lastError) {
                // do nothing
            } else {

                numOfNotes = response.notes;
        
                for (var i = 0; i < numOfNotes.length; i++) {
                    (function () {
                    var retrieveTimeURL = numOfNotes[i].time;

                    var notes = numOfNotes[i].notes;
                    
                    var retrievedTimeHours = Math.floor(retrieveTimeURL.split('=')[1] / 3600)
                    var retrievedTimeMin = Math.floor(retrieveTimeURL.split('=')[1] % 3600 / 60)
                    var retrievedTimeSec = (retrieveTimeURL.split('=')[1] % 60);
                    var notes = numOfNotes[i].notes;

                    var header = document.createElement("header");
                    header.setAttribute("class", "headerid");
                    header.setAttribute("id", retrieveTimeURL.split("=")[1]);

                    var h3 = document.createElement("h3");
                    h3.setAttribute("id", "notesinside");


                    h3.textContent = (retrievedTimeHours + "." + retrievedTimeMin + "." + retrievedTimeSec + ": " + notes);

                    header.addEventListener('click', () => {
                    
                        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            var activeTab = tabs[0];
                            chrome.tabs.update(activeTab.id, {
                                url: retrieveTimeURL
                            });
                        });
                    });

                    header.appendChild(h3);
                    
                    notesHeaders.appendChild(header);

                }());
                }
            }
        });

        headerFromPrev.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });

    }

    setInterval(highlightNotes, 1000);

    function highlightNotes() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            var activeTabURL = activeTab.url;
            // sends to content script to get back the current time
            chrome.tabs.sendMessage(activeTab.id, {
                getHighlightTime: "highlightTime",
                URL: activeTabURL

            }, function (response) {
                if (response != undefined) {
                    var highlightTimeOfCurrentVid = response.highlightTime;
                    var numOfNotes;

                    chrome.runtime.sendMessage({ displayNotes: docNameRef }, function (response) {
                        if(chrome.runtime.lastError) {
                            // do nothing
                        } else {
                            // response can be undefined if there are no notes at all
                            if (response != undefined) {
                                numOfNotes = response.notes;
                    
                                for (var i = 0; i < numOfNotes.length; i++) {
                                    (function () {
                                    var retrieveTimeURL = numOfNotes[i].time;
                                    var retrievedTime = retrieveTimeURL.split('=')[1];
                                    
                                
                                    if (Number(highlightTimeOfCurrentVid) === Number(retrievedTime)) {
                                        var target = document.getElementById(highlightTimeOfCurrentVid);
                                        target.style.background = '#D5E3E5';
                                        target.style.border = "thin solid #0e5c55";
                                        
                                        target.scrollIntoView({
                                                behavior: 'auto',
                                                block: 'center',
                                                inline: 'center'
                                        });
                                    
                                    } else {
                                        var target = document.getElementById(retrievedTime);
                                    
                                        target.style.background = '#629e9e';
                                        target.style.border = "none";
                                        
                                    }
                                    })();

                                }
                            } else { 
                                // do nothing if there are no notes at all recorded 
                            } 
                        }    
                    });   
                         
                }    
            });
        });    
    }

    

    function displayDocName() {
        oldOrNewDoc();
        function oldOrNewDoc() {
            var string = window.location.hash.substring(1);
            var parts = string.split("/");

            docNameRef = parts[0];
            var replaced = docNameRef.replaceAll("%20", " ");
            docNameRef = replaced;

            // variable that indicates if newly opened document or older files
            var newDocOrOld = parts[1];

            documentName.textContent = docNameRef;
        }
    }


    
    if (signout) {
        // when they click the 'sign out' button to sign out of everything
        // sends a message to backend to log them out
        signout.addEventListener('click', () => {
            signOut();
            window.location.replace('popup.html');
            chrome.browserAction.setPopup({ popup: "popup.html" });
        });
    }

}

