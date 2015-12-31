
window.onload = function () {

    document.getElementById("Start").onclick = function () {
        chrome.runtime.sendMessage({ command: "start" });
    }
    
    document.getElementById("Stop").onclick = function () {
        chrome.runtime.sendMessage({ command: "stop" });
    }

}
