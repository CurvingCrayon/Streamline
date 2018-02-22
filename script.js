var prlx = {
    ratio: 0.2,
    elem: false, //initialized onload
    images: ["meeting.jpg","desk.jpg"]
}
var screenSizes = [400,703];
var currentSize = -1;
var maxSizes = 5;
var subjects = ["Maths","English","Business","IPT"];
function init(){
    prlx.elem = document.getElementById("parallax");
    updateSize();
    ui();
    generateSubjects();
}
function sendRequest(){
    $("#enquire").dialog("close");
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
}
function parallax(event){
    if(event.currentTarget === event.target){
        prlx.elem.scrollTop = prlx.ratio * event.target.scrollTop;
    }
    var imgIndex = Math.round(Math.floor(event.target.scrollTop / window.innerHeight)/2);
    prlx.elem.children[0].src = "images/"+prlx.images[imgIndex];
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
        var sub = document.createElement("div");
        var imgLink = "images/"+subjects[subj].toLowerCase()+".png";
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
        document.getElementsByClassName("tile")[1].appendChild(sub);
    }
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
        "margin-right":"0.5vw"},
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
        "margin-right":"2vw"},
       {
        "duration":200
    });
    //tweenBlur(event.currentTarget.children[0],10,0);
    $(event.currentTarget.children[1]).stop();
    $(event.currentTarget.children[1]).animate({
        "margin-top": "-4vw"
    },{"duration":200});
}