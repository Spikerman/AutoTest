// use to define the notification number
var notID=0;
var isProcessing=false;
var headUrl; 
var currentPageUrl;
var stepNumber=0;

var opt={ type:"basic",
          iconUrl:"icon.png",
          title:"Default Operation",
          message:"Success !"
          };

//handle popup.js event
chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse)
    {
       if (request.command=="start") {
           stepNumber=0;
           isProcessing=true;
           getStartPageUrl();
           performNotify("Auto Test Start","");
           console.log("Testing Start");
       } else if(request.command=="stop"){
          stepNumber=0;
          outputScript=outputScript+endMark;
          alert(outputScript);
          outputScript=header;
          isProcessing=false;
          windowNum=1;
          console.log("Testing End");
       } else if(request.command=="step"){
          sendResponse({
            msg: stepNumber
          });
       }
    }
);




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
    stepNumber=0;
    outputScript=outputScript+endMark;
    alert(outputScript);
    console.log("The notification '" + notID + "' had button " + iBtn + " clicked");
    outputScript=header;
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

function getMoveToElementScript(type, propertyName, property){
    return ".moveToElement('"
            +formatAlter(type,propertyName,property)
            +"',0,0)";
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
   var command="";
   
   if(msg.openNewTab==true){
    
    windowNum=windowNum+1;
    var state1="var newWindow;";
    var state2="this.verify.equal(result.value.length, "+windowNum+", ' There should be "+windowNum +" windows open');";
    var state3="newWindow = result.value["+(windowNum-1)+"];";
    var state4="this.switchWindow(newWindow);";
    var functionBody=state1+state2+state3+state4;
   
   command= ".windowHandles(function(result){"+functionBody+"})";
   }
   
   return command;
 }

//generate the header script of the test
function genHeaderScript(url){
    header="module.exports = {'Auto Test' : function (browser) {browser.url('"+url+"').waitForElementVisible('body', 1000)";
    outputScript=header;
    console.log("current Url: "+header);
 }
 
 //notify the current website url when the extension starts
 function getStartPageUrl(){
   chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
   headUrl= tabs[0].url;
   genHeaderScript(headUrl);
   performNotify(headUrl,"");
});
}

// function getCurrentPageUrl(){
//    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
//    currentPageUrl= tabs[0].url;
// });
// }

//adding missing part of url if needed ----no use
 function getCurrentLinkUrl(linkUrl){
     var regx=new RegExp('http','i');
     if(linkUrl.search(regx)==(-1)){
         linkUrl=currentPageUrl+linkUrl;
     }
     return linkUrl;
 }

var closeMark = ".closeWindow()";
var endMark = ".pause(10000).end();}};";
var header 
var windowNum=1;

//initialize the testScript with header script
var outputScript;

//handle the popup page event
chrome.runtime.onConnect.addListener(function(port) {
  	console.assert(port.name == "hey");

  	port.onMessage.addListener(function(msg) {
        if(isProcessing==true){
          
          if(msg.type == "a"&&msg.event!="mouseover"){
             
             stepNumber=stepNumber+1;
            
             outputScript=outputScript
            +getWaitScript(msg.type,msg.propertyName,msg.property)
            +getClickScript(msg.type,msg.propertyName,msg.property)
            +setPauseTime(1000)
            +openNewWindow(msg)
            +genWaitBodyScript()
            +setPauseTime(1000);
            
            performNotify("Link Click Operation",outputScript);
            
            
  		}
     
        else if(msg.type == "button"){ //without handling new window here
             stepNumber=stepNumber+1;
             
             outputScript=outputScript
            +getWaitScript(msg.type,msg.propertyName,msg.property)
            +getClickScript(msg.type,msg.propertyName,msg.property)
            +setPauseTime(1000)
            +genWaitBodyScript()
            +setPauseTime(1000);
            
            performNotify("Button Click Operation",outputScript);
        }
  	
      	else if(msg.type == "submit"){
  			  
              stepNumber=stepNumber+1;
              msg.openNewTab=true;
              outputScript = outputScript+ getWaitScript("input",msg.propertyName,msg.property)
              +getClickScript("input",msg.propertyName,msg.property)
              +setPauseTime(1000)+genWaitBodyScript()
              +openNewWindow(msg);
            performNotify("Submit Operation",outputScript);
  		}
  		else if(msg.type == "input"){
  			  stepNumber=stepNumber+1;
              outputScript = outputScript 
              + getWaitScript(msg.type,msg.propertyName,msg.property) 
              + setInputValue(msg.type,msg.propertyName,msg.property,msg.value)
              + setPauseTime(1000);
           
            performNotify("Input Complete",outputScript);
  		}
        
        else if(msg.type=="focus"){
            
            performNotify("Start Input",outputScript);
        }
  		else if(msg.type=="a"&&msg.event=="mouseover"){
              outputScript = outputScript
              +getMoveToElementScript(msg.type,msg.propertyName,msg.property)
              + setPauseTime(500);
        }
        else if(msg.type=="li"){
            outputScript = outputScript
              +getMoveToElementScript(msg.type,msg.propertyName,msg.property)
              +setPauseTime(500);
        }
        else if(msg.type == "close"){
  			outputScript = outputScript + closeMark;
            
            performNotify("Close Operation",outputScript);
  		}
      }
      });
});
