//
var ctx=new AudioContext();
var mainGain=ctx.createGain();
mainGain.connect(ctx.destination);
var mainArr=[];
var currentOsc=[];
var baseNote=128;//128,256,512
var MaxLFOfreq=48;
var MaxFreq=440;
var handlers=[];
var handlersCont=[];
var oscs=[];

function creaOscilador(f){//toca una nota
  var notarr=[];
  // oscilador
  var o = ctx.createOscillator();
  o.frequency.value = baseNote;
  o.name="oscilador";
  o.start(ctx.currentTime);
  notarr.push(o);
  // panorama
  var p=ctx.createStereoPanner();
  p.name="oscPan";
  notarr.push(p);
  // volumen oscilador
  var g=ctx.createGain();
  g.name="oscGain";
  g.gain.value=0;
  notarr.push(g);
  // LFO
  var lfo=ctx.createOscillator();
  lfo.frequency.value=0;
  lfo.name="lfo";
  lfo.start();
  notarr.push(lfo);
  // analyser
  var analyser = ctx.createAnalyser();
  analyser.name="analyser";
  analyser.fftSize=256;
  notarr.push(analyser);
  // volumen
  var nodeGain=ctx.createGain();
  nodeGain.gain.value=0;
  nodeGain.name="nodeGain";
  notarr.push(nodeGain)

  o.connect(p);
  p.connect(g);
  lfo.connect(g.gain);
  g.connect(nodeGain);
  nodeGain.connect(analyser);
  analyser.connect(mainGain);

  currentOsc=notarr;
  return notarr
}

//function createHarmonics(notarr,narr){}


function creaNota(f){
  mainArr.push(creaOscilador(f));
  //console.log("cu= "+mainArr.indexOf(currentOsc));
}

function duplicaNota(f){
  mainArr.push(creaOscilador(currentOsc[0].frequency.value));
}

function cambiaVolumen(d){//knob 3
  let v=currentOsc[2].gain.value;
  v=v+d/100;
  if(v<0){v=0}else if(v>1){v=1}
  currentOsc[2].gain.linearRampToValueAtTime(v,ctx.currentTime+0.001);
    currentOsc[5].gain.linearRampToValueAtTime(v,ctx.currentTime+0.001);
  mueveHandler(0,v);
  console.log(mainArr.indexOf(currentOsc)+1+" vol: "+v);
}
function cambiaVolumenAbs(d){ //knob 3
  currentOsc[2].gain.linearRampToValueAtTime(d,ctx.currentTime+0.001);
    currentOsc[5].gain.linearRampToValueAtTime(d,ctx.currentTime+0.001);
  handlersCont[0].childNodes[3].innerText=Math.round(d*1000)/1000;
  console.log(mainArr.indexOf(currentOsc)+1+" vol: "+d);
}

function cambiaFrecuencia(d){//knob 1
  if(d==0){return}
  if(currentOsc[0].frequency.value<0){currentOsc[0].frequency.value=0;return
  }else if(currentOsc[0].frequency.value>2000){currentOsc[0].frequency.value=2000;return}else{
    currentOsc[0].frequency.linearRampToValueAtTime(currentOsc[0].frequency.value+d,ctx.currentTime+0.01);
  }
  mueveHandler(1,currentOsc[0].frequency.value);
  mueveEstrella(currentOsc[0].frequency.value+d);
  console.log(mainArr.indexOf(currentOsc)+1+" = "+currentOsc[0].frequency.value);//currentOsc[0].frequency.value);
}

function cambiaFrecuenciaAbs(d){//Encoder/Slider 1
  currentOsc[0].frequency.linearRampToValueAtTime(d,ctx.currentTime+0.01);
  handlersCont[1].childNodes[3].innerText=Math.round(d*1000)/1000;
    mueveEstrella(d)
  console.log(mainArr.indexOf(currentOsc)+1+" = "+d);
}

function cambiaFrecuenciaFino(d){//knob 2

  currentOsc[0].frequency.value+=d/10;
  if(currentOsc[0].frequency.value<0){currentOsc[0].frequency.value=0
  }else if(currentOsc[0].frequency.value>MaxFreq){currentOsc[0].frequency.value=MaxFreq;return}

  mueveHandler(1,currentOsc[0].frequency.value+d);
  console.log(mainArr.indexOf(currentOsc)+1+" freqF= "+currentOsc[0].frequency.value);
  mueveEstrella(currentOsc[0].frequency.value+d)
}
function cambiaFrecuenciaFinoAbs(d){//Encoder/Slider 2
    if(d==-MaxFreq||d==0||d==MaxFreq){mueveHandler(1,0,true)}
  cambiaFrecuenciaFino(d/200)
}

function cambiaFrecuenciaLFO(d){//knob 5
  currentOsc[3].frequency.linearRampToValueAtTime(currentOsc[3].frequency.value+d/10,ctx.currentTime+0.01);
  if(currentOsc[3].frequency.value<0){currentOsc[3].frequency.value=0}
  else if(currentOsc[3].frequency.value>MaxLFOfreq){currentOsc[3].frequency.value=MaxLFOfreq}
  mueveHandler(3,currentOsc[3].frequency.value);
  oscEstrella(currentOsc[3].frequency.value)
  console.log(mainArr.indexOf(currentOsc)+1+" LFOfreq: "+currentOsc[3].frequency.value);
}
function cambiaFrecuenciaLFOAbs(d){//knob 5
  currentOsc[3].frequency.linearRampToValueAtTime(d,ctx.currentTime+0.01);
  handlersCont[3].childNodes[3].innerText=Math.round(d*1000)/1000;
  console.log(mainArr.indexOf(currentOsc)+1+" = "+d);
}

function cambiaFrecuenciaLFOfino(d){//knob 6
  currentOsc[3].frequency.linearRampToValueAtTime(currentOsc[3].frequency.value+d/1000,ctx.currentTime+0.01);
  if(currentOsc[3].frequency.value<0){currentOsc[3].frequency.value=0}
  else if(currentOsc[3].frequency.value>MaxLFOfreq){currentOsc[3].frequency.value=MaxLFOfreq}

  mueveHandler(3,currentOsc[3].frequency.value);;
  console.log(mainArr.indexOf(currentOsc)+1+" LFOfreq: "+currentOsc[3].frequency.value);
}
function cambiaFrecuenciaLFOfinoAbs(d){//knob 6
    if(d==-48||d==0||d==MaxLFOfreq){mueveHandler(3,0,true)}//ponlo en medio
  cambiaFrecuenciaLFOfino(d/8)
}


function panea(d){ //knob 7
  let p=currentOsc[1].pan.value;
  p=p+d/100;
  if(p>1){p=1} else if (p<-1){p=-1}
  currentOsc[1].pan.value=p;
  mueveHandler(5,p)
  console.log(mainArr.indexOf(currentOsc)+1+" panorama: "+p)
}
function paneaAbs(d){
  currentOsc[1].pan.value=d;
    mueveHandler(5,d)
  console.log(mainArr.indexOf(currentOsc)+1+" panorama: "+d)
}

////////////////////////////////////////////////////////////////////////////

function eligeNota(d){//Pads
  currentOsc = mainArr[d];
  // for (let i = 0; i < oscs.length; i++) {
  //   oscs[i].style.backgroundColor="dddddd"
  // }
  // oscs[d].style.backgroundColor="ffff00";
  for (let i = 0; i < stars.length; i++) {
    stars[i].color=unselectedColor;
    stars[i].graphics.clear().beginFill(unselectedColor).drawCircle(0, 0, stars[i].radio);
  }
  stars[d].color=selectedStarColor;
  stars[d].graphics.clear().beginFill(selectedStarColor).drawCircle(0, 0, stars[d].radio);

  updateView();
  console.log(mainArr.indexOf(currentOsc)+1+" = "
    + Math.floor(currentOsc[0].frequency.value*100)/100
    +" ("+Math.floor(currentOsc[2].gain.value*100)/100
    +") + "+Math.floor(currentOsc[3].frequency.value*100)/100
    +" ("+Math.floor(currentOsc[2].gain.value*100)/100+")");
}


function updateView(){//handlers view
  mueveHandler(0,currentOsc[2].gain.value);//LFOVol
  mueveHandler(1,currentOsc[0].frequency.value);//freq
  mueveHandler(3,currentOsc[3].frequency.value);//LFOfreqF
  mueveHandler(5,currentOsc[1].pan.value);//pan

}

function start(){
  info();
  creaNota(0);
  creaNota(1);
  creaNota(2);
  // creaNota(3);
  // creaNota(4);
  // creaNota(5);
  // creaNota(6);
  // creaNota(7);

  handlers.push(window.document.getElementById('Vol'));
  handlers.push(window.document.getElementById('Freq'));
  handlers.push(window.document.getElementById('FreqF'));
  handlers.push(window.document.getElementById('LFOfreq'));
  handlers.push(window.document.getElementById('LFOfreqF'));
  handlers.push(window.document.getElementById('Pan'));
  handlers.push(window.document.getElementById('xxx'));

  handlersCont.push(window.document.getElementById('VolCont'));
  handlersCont.push(window.document.getElementById('FreqCont'));
  handlersCont.push(window.document.getElementById('FreqFCont'));
  handlersCont.push(window.document.getElementById('LFOFreqCont'));
  handlersCont.push(window.document.getElementById('LFOFreqFCont'));
  handlersCont.push(window.document.getElementById('PanCont'));
  handlersCont.push(window.document.getElementById('xxxCont'));

  oscs.push(window.document.getElementById('osc1'));
  oscs.push(window.document.getElementById('osc2'));
  oscs.push(window.document.getElementById('osc3'));
  // oscs.push(window.document.getElementById('osc4'));
  // oscs.push(window.document.getElementById('osc5'));
  // oscs.push(window.document.getElementById('osc6'));
  // oscs.push(window.document.getElementById('osc7'));
  // oscs.push(window.document.getElementById('osc8'));

  pintaCanvas();
  tocaEstrella(0);
}

start()

//////////////////////////////////////////////////////////  helpers

function info(){
  console.log("Instructions:");
  console.log("Pads: 8 notas a volumen 0");
  console.log("1:tune  2:FineTune  3:Vol  4:LFOvol ");
  console.log("5:LFOfreq  6:LFOfreqFino  7:Panea  8:  ");
  console.log("Functions: borraNota() //borra currentOsc ");
  console.log("Vars: mainArr, currentOsc  ");
  console.log(" PadMidiChannel=153, SliMidiChannel=176, TeclasMidiChannel=144, knobs, encoders, pads ");
  console.log("for midi learning press and hold the element and rotate/push in your midi controller, then release the mouse/finger.")
}

function noteFromPitch( frequency ) {
  var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
  return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber( note ) {
  return 440 * Math.pow(2,(note-69)/12);
}

function showInfo(){
  let arr=document.getElementsByClassName("info");
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].style.display=="none"){arr[i].style.display="block"} else {arr[i].style.display="none"}
  }
}

function sumarr(arr){
  let sum=0;
  for (let i = 0; i < arr.length; i++) {
    sum+=Math.abs(arr[i])
  }
  return sum
}
