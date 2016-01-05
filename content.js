

var port = chrome.runtime.connect({ name: "hey" });

var isclose = true;

$("a").click(function (e) {

    var href = $(this).attr('href');
    console.log(href);

    if (e.currentTarget.href != "") {
        port.postMessage({ type: "a", propertyName: "href", property: href });
    }
    else if (e.currentTarget.title != "") {
        port.postMessage({ type: "a", propertyName: "id", property: e.currentTarget.title });
    }
    else if (e.currentTarget.id != "") {
        port.postMessage({ type: "a", propertyName: "id", property: e.currentTarget.id });
    }
    else if (e.currentTarget.name != "") {
        port.postMessage({ type: "a", propertyName: "name", property: e.currentTarget.name });
    }

    else if (e.currentTarget.class != "") {
        port.postMessage({ type: "a", propertyName: "name", property: e.currentTarget.class });
    }
    isclose = false;
});

$("button").click(function (e) {
    if (e.currentTarget.id != "") {
        port.postMessage({ type: "button", propertyName: "id", property: e.currentTarget.id });
    }
    else if (e.currentTarget.name != "") {
        port.postMessage({ type: "button", propertyName: "name", property: e.currentTarget.name });
    }
    else if (e.currentTarget.class != "") {
        port.postMessage({ type: "button", propertyName: "class", property: e.currentTarget.class })
    }
    isclose = false;
});

$("input").blur(function (e) {
    if (e.currentTarget.type != "submit") {
        if (e.currentTarget.name != "") {
            port.postMessage({ type: "input", propertyName: "name", property: e.currentTarget.name, value: $(this).val() });
        }
        else if (e.currentTarget.id != "") {
            port.postMessage({ type: "input", propertyName: "id", property: e.currentTarget.id, value: $(this).val() });
        }

    }
});

$("input[type=submit]").click(function (e) {
    port.postMessage({ type: "submit", propertyName: "type", property: e.currentTarget.type });
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
