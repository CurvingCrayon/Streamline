var prlx = {
    ratio: 0.2
}
function init(){
    prlx.elem = document.getElementById("parallax");
}

function parallax(event){
    if(event.currentTarget === event.target){
        prlx.elem.scrollTop = prlx.ratio * event.target.scrollTop;
    }
}