console.log("Scribbeo is running");

// listens for messages

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        if (request.getURL === "getTime" ) {
            var URL = request.URL;
            var video = document.querySelector('video');
            // check if video exists on the page
            if (URL.includes("youtube") || URL.includes("youtu.be")) {
                if (video) {
                    var timeStampURL = getCurrentTime(request.URL);
                    
                    sendResponse({
                        URL: timeStampURL
                    });
                }
            } else {
                alert("Sorry! Scribbeo works best on a YouTube page!");
            }

        } else if (request.getHighlightTime === "highlightTime") {
            var URL = request.URL;
            var video = document.querySelector('video');
            var highlightTime = getHighlightTime(URL);
            sendResponse({
                highlightTime: highlightTime
            });
        
        } else if (request.isVideoPlaying === "videoPlay") {
            var isVidPlaying = videoPlayingFunction();
            sendResponse({
                videoPlay: isVidPlaying
            });
            console.log("vide is playing " + isVidPlaying);
        } else if (request.isThereVideo === "isThereVid") {
            var video = document.querySelector('video');
            var haveVideo = false;
            if (video) {
                haveVideo = true;
            }    
            sendResponse({
                haveVid: haveVideo
            });
        }

        return true;
    }
    
);


function videoPlayingFunction() {
    var video = document.querySelector('video');
    var isVidPlaying = false;
    if (video.paused) {
        isVidPlaying = false;
    } else {
        isVidPlaying = true;
    }
    return isVidPlaying
}

function getHighlightTime(url) {
    var video = document.querySelector('video');
    var videoTime = video.currentTime;
    var roundedTime = Math.round(videoTime);
    return roundedTime;
}

function getCurrentTime(url) {
    var video = document.querySelector('video');
    console.log("video is " + video + " and url is " + url);
    var videoTime = video.currentTime;
    var roundedTime = Math.round(videoTime);
    
    var youtubeID = YouTubeGetID(url);
    var timeStampURL = 'https://youtu.be/' + youtubeID + '?t=' + roundedTime

    function YouTubeGetID(url) {
        var ID = '';
        url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if(url[2] !== undefined) {
          ID = url[2].split(/[^0-9a-z_\-]/i);
          ID = ID[0];
        }
        else {
          ID = url;
        }
          return ID;
    }

    console.log(video + " video's current time is " + roundedTime + " and " + timeStampURL);
    return timeStampURL;
}
