console.log("Scribbeo is running");

// listens for messages

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(request, sender, sendResponse) {
    console.log(request);
    if (request.txt === 'hello') {
        var elts = document.getElementsByTagName('p');
        for (var i = 0; i < elts.length; i++) {
            //elts[i].style['background-color'] = '#F0C';
            elts[i].innerHTML = request.txt;
        }
    }    
}
