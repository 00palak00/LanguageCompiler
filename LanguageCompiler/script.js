var BASE_URL="https://codequotient.com/api/";

var langSelector;
var codeEditor;
var compileBtn;
var outputHeading;

// var to send to server
var codeWritten;
var languageId;

function initProcess()
{
    langSelector = document.getElementById("langSelector");
    codeEditor = ace.edit("editor");
    compileBtn = document.getElementById("btnCompile");
    outputHeading = document.getElementById("outputHeading");

    setLanguageId();
    setCode();
    sendCodeForSubmission();
}

function sendCodeForSubmission()
{
    var urlToSubmitt = BASE_URL+"executeCode";
    var objectToSend = {code:codeWritten,langId:languageId};

    //ajax
    var request = new XMLHttpRequest();
    request.open("POST",urlToSubmitt);
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(objectToSend));

    request.addEventListener("load",function(){
        var response = JSON.parse(request.responseText);
        if("codeId" in response)
        {
            var codeId = response.codeId;
            checkResultOfOurCode(codeId);
        }
        else
        {
            alert("please write something first before compiling");
        }
    });
}

function checkResultOfOurCode(codeId)
{
    var urlToCheck = BASE_URL+"codeResult/"+codeId;

    var request = new XMLHttpRequest();
    request.open("GET",urlToCheck);
    request.send();
    
    request.addEventListener("load",function(){
        var response = JSON.parse(request.responseText);
        var data = JSON.parse(response.data);
       // console.log(data);
        if(data.status=="Pending")
        {
            checkResultOfOurCode(codeId);
        }
        else
        {
            if(data.errors!=="")
            {
                outputHeading.innerHTML += data.errors;
            }
            else
            {
                outputHeading.innerHTML += data.output;
            }
        }
    });
}

function setCode()
{
    codeWritten = codeEditor.getValue();
}

function setLanguageId()
{
    // ( Python : 0 , JavaScript : 4 , C : 7 , C++ : 77 , Java : 8)
    var language = langSelector.value;
    switch(language)
    {
        case "Java": languageId = 8;break;
        case "Python": languageId = 0;break;
        case "JavaScript": languageId = 4;break;
        case "C": languageId = 7;break;
        case "C++": languageId = 77;break;
        default: languageId = 4;break;
    }
    
}