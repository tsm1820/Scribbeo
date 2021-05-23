console.log("popupscript");

// do window.onload so that the javascript file runs after the html loads
window.onload = function() {
    var getstarted = document.getElementById('sign-in');
    var status = document.getElementById('status');
    
    if (getstarted) {
        // when they click the 'get started' button to launch the google sign in
        // sends a message to backend to log them in
        getstarted.addEventListener('click', function () {
            
            // send message to background.js to log in 
            chrome.runtime.sendMessage({ message: 'signin' });
            
            // if response is back and successful, close the popup tab 
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.msg === 'signinsuccess') window.close(); 
            });

        });
    }

    if (status) {
        // returns boolean value if signed in or not when status is clicked
        status.addEventListener('click', function () {

            // send message to background.js for query
            chrome.runtime.sendMessage({ message: 'isSignedIn' });

            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                alert(request.msg);
            });
        });
    }    
} 