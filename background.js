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

// stores database as well 
var users = [];
// array that only stores user ids
var usersNamesOnly = [];

var userIdentity;
var currUser;

chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
    if (request.userId) {
        addUser(request.userId);
        console.log("adding user");

    } else if (request.addNewDoc) {
        var boolValue = addNewDoc(request.addNewDoc);
        sendResponse({haveDoc: boolValue});
        console.log(" adding a new doc ");
    
    } else if (request.displayDocs) {
        var allDocs = displayDocs();
        sendResponse({documents: allDocs});
        console.log("displaying all docs " + allDocs);
    
    } else if (request.openOldDoc) {
        var oldDoc = openOldDoc(request.openOldDoc);
        sendResponse({doc: oldDoc});
        console.log("opening old doc");
    
    } else if (request.addNote) {
        addNewNote(request.addNote);
    
    } else if (request.displayNotes) {
        var allNotes = displayNotes(request.displayNotes);
        sendResponse({notes: allNotes});
    }
    return true;
});   

function addUser(userId) {
    
    var userTemplate = {
        userId: userIdentity,
        // array of list of documents names
        documents: [], 
        // one array for each document to store key value pairs (time, notes)
        documentsNotes: []
    }

    // if array is empty initially, add first user
    if (users.length === 0) {
        userIdentity = userId;
        userTemplate.userId = userIdentity;
        users.push(userTemplate);
        usersNamesOnly.push(userId);
        currUser = userTemplate;
        console.log("first user " + userIdentity + " " + users.length);

    } else {
        // check if user already exists
        for (i = 0; i < users.length; i++) { 
            // if user exists, assign it as current user
            if (usersNamesOnly.includes(userId)) {
                var indexOfUser = usersNamesOnly.indexOf(userId);
                var existingUser = users[indexOfUser];
                currUser = existingUser;
            } else {
                // create new user if doesn't exist
                userIdentity = userId;
                userTemplate.userId = userIdentity;
                users.push(userTemplate);
                usersNamesOnly.push(userId);
                currUser = userTemplate;
                break;
            }
        }
    }
}

function addNewDoc(fileName) {
    // if another document with the same name exists
    if (currUser.documents.includes(fileName)) {
        console.log(fileName + " alr exists inside " + currUser.documents);
        return true;
    } else {
        // add new document to list of documents
        currUser.documents.push(fileName);
        // add new array to indicate creation of document
        // this array will contain pairs of key (time) and value (notes) 
        // eg. [ [time, notes] , [time, notes] , [time, notes] ]
        var newDocArray = [];
        currUser.documentsNotes.push(newDocArray);
        console.log(" my list of docs " + currUser.documents);
        return false; 
    }
}

function addNewNote(note) {
    var time = note.time;
    var notes = note.notes;
    var docName = note.docname;
    console.log("imt he doc name " + docName);
    var index = currUser.documents.indexOf(docName);
    console.log("index is " + index);
    currUser.documentsNotes[index].push(note);
    currUser.documentsNotes[index].sort(compareToSort);
}


function compareToSort(notes1, notes2) {
    //Math.floor(timeStampURL.split('=')[1]
    var time1 = Math.floor(notes1.time.split('=')[1]);
    var time2 = Math.floor(notes2.time.split('=')[1]);
    console.log("time1 is " + time1 + " and time2 is " + time2);
    if (time1 < time2) {
        return -1;
    } else if (time1 > time2) {
        return 1;
    } else {
        return 0;
    }
}


function displayNotes(docName) {
    var index = currUser.documents.indexOf(docName);
    var numOfNotes = currUser.documentsNotes[index];
    
    return numOfNotes;  
   // [{time, note}, {time, note}, {time, note}]
}

function displayDocs() {
    console.log("all docs " + currUser.documents);
    return currUser.documents;
}

function openOldDoc(docName) {
    var document;
    document = currUser.documents.indexOf(docName);
    return document;
}

