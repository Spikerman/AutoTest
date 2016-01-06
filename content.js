

var port = chrome.runtime.connect({ name: "hey" });

var isclose = true;

$("a").click(function (e) {

    //get the href of selected link
    var linkHref = $(this).attr('href');
    console.log(linkHref);
    
    //get the href of current tab
    var tabHref = document.location.href;
    tabHref=tabHref.substring(0,tabHref.length-1);
    
    var isBlank =false;
    if(e.currentTarget.target =="_blank"){
        isBlank=true;
    }
    
    if (e.currentTarget.href != "") {
        port.postMessage({ type: "a", propertyName: "href", property: linkHref, currentUrl: tabHref, openNewTab: isBlank });
    }
    // else if (e.currentTarget.title != "") {
    //     port.postMessage({ type: "a", propertyName: "title", property: e.currentTarget.title , currentUrl: tabHref});
    // }
    // else if (e.currentTarget.id != "") {
    //     port.postMessage({ type: "a", propertyName: "id", property: e.currentTarget.id, currentUrl: tabHref });
    // }
    // else if (e.currentTarget.name != "") {
    //     port.postMessage({ type: "a", propertyName: "name", property: e.currentTarget.name, currentUrl: tabHref });
    // }

    // else if (e.currentTarget.class != "") {
    //     port.postMessage({ type: "a", propertyName: "name", property: e.currentTarget.class, currentUrl: tabHref });
    // }
    isclose = false;
});

$("button").click(function (e) {
    var tabHref = document.location.href;
    if (e.currentTarget.id != "") {
        port.postMessage({ type: "button", propertyName: "id", property: e.currentTarget.id, currentUrl: tabHref });
    }
    else if (e.currentTarget.name != "") {
        port.postMessage({ type: "button", propertyName: "name", property: e.currentTarget.name, currentUrl: tabHref });
    }
    else if (e.currentTarget.class != "") {
        port.postMessage({ type: "button", propertyName: "class", property: e.currentTarget.class, currentUrl: tabHref })
    }
    isclose = false;
});

$("input").blur(function (e) {
    var tabHref = document.location.href;
    
    if (e.currentTarget.type != "submit") {
        if (e.currentTarget.name != "") {
            port.postMessage({ type: "input", propertyName: "name", property: e.currentTarget.name, value: $(this).val(), currentUrl: tabHref });
        }
        else if (e.currentTarget.id != "") {
            port.postMessage({ type: "input", propertyName: "id", property: e.currentTarget.id, value: $(this).val() , currentUrl: tabHref });
        }

    }
});

$("input[type=submit]").click(function (e) {
    var tabHref = document.location.href;
    port.postMessage({ type: "submit", propertyName: "type", property: e.currentTarget.type, currentUrl: tabHref, openNewTab:true });
    isclose = false;
});

// window.onbeforeunload = function () {
//     if (isclose == true) {
//         port.postMessage({ type: "close" });
//     }
//     else {
//         isclose = true;
//     }
// };
