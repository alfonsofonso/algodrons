//alfonsofonso's algodrone starfield
var stars=[];
var numStars;
var amp=0;
var alt=0;
var radio=0;//hipotenusa del canvas
var margen=100;
var ratio=6;
var stage = new createjs.Stage("micanvas");
var canvasContext=document.getElementById("micanvas");
//stage.mouseEnabled=false;


var floarr=new Float32Array(256);
var selectedStarColor="#ffff88";
var unselectedColor="#eeeeee";
var minStarRadius=38;

function ponEstrellas(num){

  minStarRadius-=num*4;

  console.log("num "+num)
  for (let i = 0; i < num; i++) {
    let equis=(amp/(num+1))*(i+1);
    let igriega=alt-baseNote*alt/MaxFreq;
    var c = new createjs.Shape();

    c.x = equis
    c.y = igriega;
    c.radio=10;
    c.color=unselectedColor;

    c.graphics.beginFill(unselectedColor).drawCircle(2, 2, 5);
    c.addEventListener("click",function(){tocaEstrella(i)});
    stage.addChild(c);
    stars.push(c);
      console.log("pongo estrella en "+equis)
  }
}

function tocaEstrella(d){
  eligeNota(d)
}

function pintaCanvas(){
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.setFPS=60;
  createjs.Ticker.addEventListener("tick", tick);
  ajustaCanvas();
  ponEstrellas(numStars)
}
///// funciones ponEstrellas

function mueveEstrella(f){// y axis
  let s=mainArr.indexOf(currentOsc);
  stars[s].y=alt-f*alt/MaxFreq;
}

function oscEstrellas(){
  for (let i = 0; i < mainArr.length; i++) {
    mainArr[i][4].getFloatTimeDomainData(floarr);
    stars[i].graphics.clear().beginFill(stars[i].color).drawCircle(0,0,sumarr(floarr)/ratio+minStarRadius);
  }
}

////////
function tick(event) {
  stage.update();
  oscEstrellas()
  //stars[0].
}
window.onresize = function(event) {
  ajustaCanvas()
}
function ajustaCanvas(){
  amp=canvasContext.width  = window.innerWidth-10;
  alt=canvasContext.height = (window.innerHeight-10)*.6;
  radio= Math.round(Math.sqrt(amp*amp+alt*alt)/2);

}
