console.log("signed in page");

// do window.onload so that the javascript file runs after the html loads
window.onload = function() {
    var signout = document.getElementById('sign-out');
    var status = document.getElementById('status');
    
    if (signout) {
        // when they click the 'sign out' button to sign out of everything
        // sends a message to backend to log them out
        signout.addEventListener('click', function () {

            // send message to background.js to log out
            chrome.runtime.sendMessage({ message: 'signout' });
            chrome.runtime.sendMessage({ message: 'REMOVING' });


            // if response is back and successful, close the popup tab 
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
              if (request.msg === 'signoutsuccess') window.close(); 
            });
            
        });
    }

    if (status) {

        // returns boolean value if signed in or not
        status.addEventListener('click', function () {

            // send message to background.js for query
            chrome.runtime.sendMessage({ message: 'isSignedIn' });

            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                alert(request.msg);
            });

        });
    }    
} 