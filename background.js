console.log('background running');

const API_KEY = 'AIzaSyCEjl8mryu0brl7fFv5-NczaITfcK0k1aU';
var client_id = '313984530579-8o0eh41p2j92gvk91kccu52qrun5u21t.apps.googleusercontent.com';
var resp_type = encodeURIComponent('id_token');
var redirect_uri =  'https://cfhdojbkjhnklbpkdaibdccddilifddb.chromiumapp.org';
var scope = encodeURIComponent('openid');
var prompt = encodeURIComponent('consent');

var state = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
var nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

let auth_url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&response_type=${resp_type}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&nonce=${nonce}&prompt=${prompt}`;


let user_signed_in = false;

chrome.identity.onSignInChanged.addListener(function (account_id, signedIn) {
    if (signedIn) {
        user_signed_in = true;
    } else {
        user_signed_in = false;
    }
});

function is_user_signed_in() {
    return user_signed_in;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'signin') {

        if (is_user_signed_in()) {
            // do nothing 
            console.log("user signed in already");

            chrome.browserAction.setPopup({ popup: 'popup-signedin.html'}, function() {});

        } else {
            // interactive true so that they can pick which account to sign in with
            // launches the sign in page
            chrome.identity.getAuthToken({ interactive: true }, function (token) {                
                console.log(token);
                // change the popup window
                chrome.browserAction.setPopup({ popup: 'popup-signedin.html'}, function() {
                    // send response back to popup.js that signed in successfully 
                    chrome.runtime.sendMessage({
                        msg: "signinsuccess"
                    });
                    // changes to signed in
                    user_signed_in = true;
                });
            });
            return true;
        }    

    } else if (request.message === 'signout') {
        // change the popup window to original popup page
        chrome.browserAction.setPopup({ popup: 'popup.html'}, function() {
            // send response back to popup.js that signed out
            chrome.runtime.sendMessage({
                msg: "signoutsuccess"
            });
            // changes to signed out
            user_signed_in = false;
        });
        return true;

    } else if (request.message === 'isSignedIn') {

        // send response back to popup.js that signed out
        chrome.runtime.sendMessage({
            msg: is_user_signed_in()
        });

    }    
});      


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'REMOVING') {
    
        console.log("REMOVING");

        chrome.identity.launchWebAuthFlow(
            {
                url: auth_url, 
                interactive: true}, 
            
            function(respUrl) { 
                console.log(respUrl); 
                console.log("logoutpage");

                if (chrome.runtime.lastError) {
                    console.log("closed the logout page");
                }
        });

    }
});        



        /*
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${AIzaSyCEjl8mryu0brl7fFv5-NczaITfcK0k1aU}`;
            let fetch_options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            fetch(fetch_url, fetch_options)
                .then(res => res.json())
                .then(res => {
                    if (res.memberCount) {
                        const members = res.memberResourceNames;
                        fetch_url = `https://people.googleapis.com/v1/people:batchGet?personFields=names&key=${AIzaSyCEjl8mryu0brl7fFv5-NczaITfcK0k1aU}`;

                        members.forEach(member => {
                            fetch_url += `&resourceNames=${encodeURIComponent(member)}`;
                        });

                        fetch(fetch_url, fetch_options)
                            .then(res => res.json())
                            .then(res => console.log(res));
                    }
                });
        });

    } else if (request.message === 'create_contact') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://people.googleapis.com/v1/people:createContact?key=${AIzaSyCEjl8mryu0brl7fFv5-NczaITfcK0k1aU}`;

            let fetch_options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'names': [
                        {
                            "givenName": "Johnny",
                            "familyName": "Silver"
                        }
                    ]
                })
            }

            fetch(fetch_url, fetch_options)
                .then(res => res.json())
                .then(res => console.log(res));
        });
    } else if (request.message === 'delete_contact') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${AIzaSyCEjl8mryu0brl7fFv5-NczaITfcK0k1aU}`;
            let fetch_options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            fetch(fetch_url, fetch_options)
                .then(res => res.json())
                .then(res => {
                    if (res.memberCount) {
                        const members = res.memberResourceNames;

                        fetch_options.method = 'DELETE';
                        fetch_url = `https://people.googleapis.com/v1/${members[0]}:deleteContact?key=${AIzaSyCEjl8mryu0brl7fFv5-NczaITfcK0k1aU}`;

                        fetch(fetch_url, fetch_options)
                            .then(res => console.log(res));
                    }
                });
        });
    }
  });
*/
/*

let user_signed_in = false;

const CLIENT_ID = encodeURIComponent('313984530579-68g0144s6js8lqcnf1j3v8cd045l6s5a.apps.googleusercontent.com');
const RESPONSE_TYPE = encodeURIComponent('id_token');
const REDIRECT_URI = encodeURIComponent('https://oedofflneggladijdnofdpoggpobmnac.chromiumapp.org/');
const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
const SCOPE = encodeURIComponent('openid');
const PROMPT = encodeURIComponent('consent');

function create_oauth2_url() {
    let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

    let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${STATE}&nonce=${nonce}&prompt=${PROMPT}`;

        return url;
}

function is_user_signed() {
    return user_signed_in;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        if (is_user_signed()) {
            console.log("user signed in");
        } else {
            chrome.identity.launchWebAuthFlow({
                'url': create_oauth2_url(),
                'interactive': true
            }, function (redirect_url) {
                console.log(redirect_url);
                sendResponse('success');
            });    
            
            return true;
        }
    } else if (request.message === 'logout') {
        return true;
    } else if (request.message === 'isUserSignedIn') {
        return true;
    }    
});










// Add a listener for thebrowser action 
// When user clicks button, triggers 'onClick' event
// this code will go to background.js 
chrome.browserAction.onClicked.addListener(buttonClicked);

// the user has clicked the button 
// 'tab' is an objects with infromation about current
// opened tab 
// We want to send a 'message' from the background script 
// to the content script for content script to perform any action
function buttonClicked(tab) {
    let msg = {
        txt: "hello"
    };
    chrome.tabs.sendMessage(tab.id, msg);
}

// scribbeoExt password
// scribbeo.help@gmail.com
*/