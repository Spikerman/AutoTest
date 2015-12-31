// use to define the notification number
var notID=0;
var isProcessing=false;
var headUrl; 
var currentPageUrl;

var opt={ type:"basic",
          iconUrl:"icon.png",
          title:"Default Operation",
          message:"Success !"
          };

// git Test
function performNotify(operation,information) {
	var option = null;
	option=opt;
	option.priority = 0;
    
	option.buttons = [];
	option.buttons.push({ title: "OK" });
	
    option.title=operation;
	option.message=information;
    chrome.notifications.create("id"+notID++, option, creationCallback);
}

window.addEventListener("load", function() {
    	chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
});

function notificationBtnClick(notID, iBtn) {
    testScript=testScript+endMark;
    alert(testScript);
    console.log("The notification '" + notID + "' had button " + iBtn + " clicked");
    testScript=header;
    isProcessing=false;
    windowNum=1;
    console.log("Testing End");
}


function creationCallback(notID) {
	console.log("Succesfully created " + notID + " notification");
		setTimeout(function() {
			chrome.notifications.clear(notID, function(wasCleared) {
				console.log("Notification " + notID + " cleared: " + wasCleared);
			});
		}, 5000);
	
}


function getStartUrl(){
   chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
   headUrl= tabs[0].url;
   genHeaderScript(headUrl);
   performNotify(headUrl,"");
});
}

function getCurrentPageUrl(){
   chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
   currentPageUrl= tabs[0].url;
});
}

//add the missing part of the url if need
 function getCurrentLinkUrl(linkUrl){
     var regx=new RegExp('http','i');
     if(linkUrl.search(regx)==1){
         linkUrl=currentPageUrl+linkUrl;
     }
     return linkUrl;
 }

chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse)
    {
       if (request.command=="start") {
           isProcessing=true;
           getStartUrl();
           performNotify("Auto Test Start","");
           console.log("Testing Start");
       } else if(request.command=="stop")
       {
           // do nothing
       } else{
           // do nothing
       }
    }
);

function formatAlter(type,propertyName,property){
	return type + '[' + propertyName + '="' + property + '"]';
}

function getWaitScript(type,propertyName,property){
	return ".waitForElementPresent('"
			+ formatAlter(type,propertyName,property)
			+ "',1000)";
}

function getClickScript(type, propertyName, property){
	return ".click('"
			+ formatAlter(type,propertyName,property)
			+"')";
}

function setInputValue(type, propertyName, property, value){
	return ".setValue('"
			+ formatAlter(type,propertyName,property)
			+ "','"
			+ value
			+ "')";
}

function setPauseTime(time){
    return ".pause("+time+")";
}

function genWaitBodyScript(){
    return ".waitForElementVisible('body', 1000)";
}

function openNewWindow(msg){
   
   windowNum=windowNum+1;
   var state1="var newWindow;";
   var state2="this.verify.equal(result.value.length, "+windowNum+", 'There should be "+windowNum +"windows open');";
   var state3="newWindow = result.value["+(windowNum-1)+"];";
   var state4="this.switchWindow(newWindow);";
    
   var functionBody=state1+state2+state3+state4;
   
   var command= getWaitScript(msg.type,msg.propertyName,msg.property)+setPauseTime(1000)+".windowHandles(function(result){"+functionBody+"})";
   
   return command;
 }

//generate the header script of the test
function genHeaderScript(url){
    header="module.exports = {'Auto Test' : function (browser) {browser.url('"+url+"').waitForElementVisible('body', 1000)";
    testScript=header;
    console.log("current Url: "+header);
 }
 
 

var closeMark = ".closeWindow()";
var endMark = ".pause(10000).end();}};";
var header 
var windowNum=1;

//initialize the testScript with header script
var testScript;


chrome.runtime.onConnect.addListener(function(port) {
  	console.assert(port.name == "hey");

  	port.onMessage.addListener(function(msg) {
        if(isProcessing==true){
          
          // handle the "open new tab" action 
          if(msg.type == "a" || msg.type == "button"){
            
         //   getCurrentUrl();
         //   msg.property=getLinkUrl(msg);
            
            testScript=testScript
            +getWaitScript(msg.type,msg.propertyName,msg.property)
            +getClickScript(msg.type,msg.propertyName,msg.property)
            +setPauseTime(1000)
            +openNewWindow(msg)
            +genWaitBodyScript()
            +setPauseTime(1000);
            
            performNotify("Click Operation",testScript);
            
  		}
  		else if(msg.type == "submit"){
  			testScript = testScript+ getWaitScript("input",msg.propertyName,msg.property)
              +getClickScript("input",msg.propertyName,msg.property)
              +setPauseTime(1000)+genWaitBodyScript()
              +openNewWindow(msg);
            
            performNotify("Submit Operation",testScript);
  		}
  		else if(msg.type == "input"){
  			testScript = testScript 
              + getWaitScript(msg.type,msg.propertyName,msg.property) 
              + setInputValue(msg.type,msg.propertyName,msg.property,msg.value)
              + setPauseTime(1000);
           
            performNotify("Input Operation",testScript);
  		}
  		else if(msg.type == "close"){
  			testScript = testScript + closeMark;
            
            performNotify("Close Operation",testScript);
  		}
      }
      });
});
