
window.onload = function () {

    refreshStep();
    
    document.getElementById("Start").onclick = function () {
        chrome.runtime.sendMessage({ command: "start" });
    }
    
    document.getElementById("Stop").onclick = function () {
        chrome.runtime.sendMessage({ command: "stop" });
    }
    
    
}

//send message to background.js to get the step value
function refreshStep(){
    chrome.runtime.sendMessage({command: "step"},
    function (response){
        document.getElementById("SetpNum").innerHTML = response.msg;
    });
}

// no use
// function showResult(){
//     chrome.runtime.sendMessage({command: "result"},
//     function (response){
//         document.getElementById("script").innerHTML = response.msg;
//     });
// }