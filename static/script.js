var prlx = {
    ratio: 0.2,
    elem: false, //initialized onload
    images: ["meeting.jpg","desk.jpg"],
    type: 1 //1 = tiles, 2 = free
}
var fullSubjects = ["English","Maths","Modern History","Ancient History","Extension History","IPT","Software","Physics","Legal Studies","Business Studies"];
var subjectTutors = [["Aidan","Will"],["Aidan","Will","Eddie","Hayden"],["Eddie","Aidan","Will"],["Will"],["Will","Eddie"],["Hayden","Eddie"],["Hayden"],["Hayden"],["Aidan"],["Aidan"]];
var screenSizes = [400,703];
var currentSize = -1;
var maxSizes = 5;
var subjects = ["Humanities","Social Sciences","Science and Technology"];
var tutors = ["Aidan", "Will", "Eddie", "Hayden"];
function init(page){
    prlx.elem = document.getElementById("parallax");
    updateSize();
    
    switch(page){
        case "index":
            generateSubjects();
            //generateTutors();
            break;
            
        case "subjects":
            generateFullSubjects();
        break;
            
        case "aboutus":
            prlx.type = 2;
        break;
            
        case "credits":
            prlx.type = 2;
        break;
    }
    ui();
}
function sendRequest(){
    $("#enquire").dialog("close");
    var data = $("#enquire form").serialize();
    sendEmail(data);
}
function openEnquiry(){
    $("#enquire").dialog("open");
}
function ui(){
    $("[data-j='dialog']").dialog();
    dialog = $("#enquire").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Send": sendRequest,
            Cancel: function() {
                dialog.dialog( "close" );
            }
        }
    });
    dialog.find("form").on("submit", function(event) {
        event.preventDefault();
        sendRequest();
    }); 
    $(".accordion").accordion({
        collapsible: true
    });
    $("#facebookMessage").dialog({
        autoOpen: false,
        width: 350,
        modal: true,
    });
}
function parallax(event){
    var oldScroll = event.target.scrollTop;
    var newScroll = prlx.ratio * oldScroll;
    var maxNewScroll = prlx.elem.scrollHeight;
    if(event.currentTarget === event.target){
        prlx.elem.scrollTop = newScroll;
    }
    
    if(prlx.type === 1){
        var imgIndex = Math.round(Math.floor(event.target.scrollTop / window.innerHeight)/2);
        prlx.elem.children[0].src = "images/"+prlx.images[imgIndex];
    }
    else{
        if(newScroll > maxNewScroll){
            
        }
    }
}
function resize(){
    updateSize();
}
function updateSize(){
    var newSize = checkSize();
    for(var size = 0; size < maxSizes; size++){
        if(size > newSize){
            $("[data-show='"+String(size)+"']").hide();
        }
        else{
            $("[data-show='"+String(size)+"']").show();
        }
    }
}
function checkSize(){
    var width = document.body.offsetWidth;
    var sizeIndex = -1;
    for(var size = 0; size < screenSizes.length; size++){
        if(width <= screenSizes[size]){
            sizeIndex = size;
            break;
        }
    }
    if(sizeIndex === -1){
        sizeIndex = screenSizes.length;
    }
    currentSize = sizeIndex;
    return sizeIndex;
}
function generateSubjects(){
    /*<div class="subject">
                <img class="subjImage" />
                <div class="subjTitle">Maths</div>
            </div>*/
    for(var subj = 0; subj < subjects.length; subj++){
        var link = document.createElement("a");
        link.href = "subjects.html";
        var sub = document.createElement("div");
        var imgLink = "images/"+subjects[subj].toLowerCase().replace(/\s/g,"_")+".png";
        var subTitle = document.createElement("div");
        sub.className = "subject";
        sub.onmouseover = hoverSubj;
        sub.onmouseout = unhoverSubj;
//        sub.style.backgroundImage = "url('"+imgLink+"')"
        var subImg = document.createElement("img");
        subImg.className = "subjImage";
        subImg.src = imgLink;
        subTitle.className = "subjTitle";
        subTitle.innerHTML = subjects[subj];
        sub.appendChild(subImg);
        sub.appendChild(subTitle);
        link.appendChild(sub)
        document.getElementsByClassName("tile")[1].appendChild(link);
    }
    var moreLink = document.createElement("A");
    moreLink.className = "bottom";
    var moreText = document.createElement("h2");
    moreText.innerHTML = "View our fill list of subjects";
    moreLink.href="subjects.html";
    moreLink.id ="moreLink";
    moreLink.appendChild(moreText);
    document.getElementsByClassName("tile")[1].appendChild(moreLink);
}
//Credit to https://stackoverflow.com/questions/20082283/animate-css-blur-filter-in-jquery
function setBlur(ele, radius) {
    $(ele).css({
       "-webkit-filter": "blur("+radius+"px)",
        "filter": "blur("+radius+"px)"
   });
}
// Generic function to tween blur radius
function tweenBlur(ele, startRadius, endRadius) {
    $({blurRadius: startRadius}).animate({blurRadius: endRadius}, {
        duration: 200,
        easing: 'swing', // or "linear"
                         // use jQuery UI or Easing plugin for more options
        step: function() {
            setBlur(ele, this.blurRadius);
        },
        callback: function() {
            // Final callback to set the target blur radius
             // jQuery might not reach the end value
             setBlur(ele, endRadius);
        }
    });
}
function hoverSubj(event){
    $(event.currentTarget).stop();
    $(event.currentTarget).animate({
        "height": "23vw",
        "width": "23vw",
        "margin-left":"0.5vw",
        "margin-right":"0.5vw",
        "margin-bottom":"-3vw"},
       {
        "duration":200
    });
    //tweenBlur(event.currentTarget.children[0],0,10);
    $(event.currentTarget.children[1]).stop()
    $(event.currentTarget.children[1]).animate({
        "margin-top": "-10vw"
    },{"duration":200});
}
function unhoverSubj(event){
    //Credit to:
    //https://stackoverflow.com/questions/4697758/prevent-onmouseout-when-hovering-child-element-of-the-parent-absolute-div-withou
    var e = event.toElement || event.relatedTarget;
    if (e.parentNode == this || e == this) {
       return;
    }
    $(event.currentTarget).stop();
    $(event.currentTarget).animate({
        "height": "20vw",
        "width": "20vw",
        "margin-left":"2vw",
        "margin-right":"2vw",
        "margin-bottom":"0vw"},
       {
        "duration":200
    });
    //tweenBlur(event.currentTarget.children[0],10,0);
    $(event.currentTarget.children[1]).stop();
    var type = event.currentTarget.className;
    $(event.currentTarget.children[1]).animate({
        "margin-top": ((type === "subject")?"-6vw":"-3vw")
    },{"duration":200});
}
function hoverTutor(){
    
}
function unhoverTutor(){
    
}
function generateTutors(){ //Same code as generateSubjects
    /*<div class="subject">
                <img class="subjImage" />
                <div class="subjTitle">Maths</div>
            </div>*/
    for(var tut = 0; tut < subjects.length; tut++){
        var link = document.createElement("a");
        link.href = "tutors.html#"+tutors[tut].toLowerCase();
        var tutor = document.createElement("div");
        var imgLink = "images/"+tutors[tut].toLowerCase()+".jpg";
        var name = document.createElement("div");
        tutor.className = "tutor";
        tutor.onmouseover = hoverSubj;
        tutor.onmouseout = unhoverSubj;
//        sub.style.backgroundImage = "url('"+imgLink+"')"
        var tutorImg = document.createElement("img");
        tutorImg.className = "tutorImage";
        tutorImg.src = imgLink;
        name.className = "tutorTitle";
        name.innerHTML = tutors[tut];
        tutor.appendChild(tutorImg);
        tutor.appendChild(name);
        link.appendChild(tutor)
        document.getElementsByClassName("tile")[2].appendChild(link);
    }
}
function generateFullSubjects(){
    var targ = document.getElementsByClassName("subjectHolder")[0];
    var numSubs = fullSubjects.length;
    for(var sub = 0; sub < numSubs; sub++){
        var subHead = document.createElement("h3");
        subHead.id = fullSubjects[sub];
        subHead.innerHTML = fullSubjects[sub];
        targ.appendChild(subHead);
    }
}
function req(type,directory,callback,data){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(xhttp);
       }
    };
    var useCallback = true;
    if(callback === undefined){
        useCallback = false;
    }
    xhttp.open(type, directory, useCallback);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if(data === undefined){
        data = "";
    }
    xhttp.send(data); 
}
function sendEmail(data) {
    req("POST","/request",function(xhttp){
        console.log(xhttp.responseText);
    },data);
}
function openFacebook(){
    $("#facebookMessage").dialog("open");
}