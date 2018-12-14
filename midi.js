// request MIDI access
var luces;
var ilu=false;
var hayMidi=true;
var entradas=[];
var salidas=[];
var data;
var learning=false;
var detectingPadChannel=false;
var detectingKnobChannel=false;
var curBotNum=0;
var curSliNum=0;
var PadMidiChannel=153;//153 en arturia minilab
var SliMidiChannel=176;
var TeclasMidiChannel=144;
var knobs=[7,74,71,76,77,93,73,75];//1-8
var encoders=[1,2,43,5,6,7,8,9];//not infinite knobs
var pads=[36,37,38,39,40,41,42,43];//1-8  data[0]=153

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false // this defaults to 'false' and we won't be covering sysex in this article.
    }).then(onMIDISuccess, onMIDIFailure);
} else { alert("No MIDI support in your browser."); }
// midi functions
function onMIDISuccess(midiAccess) {
    // when we get a succesful response, run this code
   //console.log('MIDI Access Object SIZE=', midiAccess.inputs.size);

    if(midiAccess.inputs.size==0){hayMidi=false;return}
      midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
      inputs = midi.inputs.values();
      outputs= midi.outputs.values();
    if(midiAccess.inputs.size==0){hayMidi=false;return}
    // loop over all available inputs and listen for any MIDI input
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        entradas.push(input);
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        salidas.push(output);
    }
    luces=salidas[0].value;

    for(var i=0;i<salidas.length;i++){
      console.log("hay " +entradas.length+" entrada/s conectada/s:");
      console.log(entradas[i].value.name);
      console.log(entradas[i]);
      console.log("y " +salidas.length+" salida/s conectada/s:");
      console.log(salidas[i].value.name);
      console.log(salidas[i]);
    }
  }
}

function onMIDIFailure(e) {
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}

function onMIDIMessage(message) {
  data = message.data;
  if(data[0]==SliMidiChannel){
    if (learning){
      knobs[curSliNum-1]=data[1];//aprendo knobs
      learning=false;

    }else if(data[1]==knobs[0]){
      cambiaFrecuencia(data[2]-64);
    }else if(data[1]==knobs[1]){
      cambiaFrecuenciaFino(data[2]-64);
    }else if(data[1]==knobs[2]){
      cambiaVolumen(data[2]-64)
    }else if(data[1]==knobs[3]){
      cambiaVolumenLFO(data[2]-64)

    }else if(data[1]==knobs[4]){
      cambiaFrecuenciaLFO(data[2]-64)
    }else if(data[1]==knobs[5]){
      cambiaFrecuenciaLFOfino(data[2]-64)
    }else if(data[1]==knobs[6]){
        panea(data[2]-64);
    }else if(data[1]==knobs[7]){
      //eligeNota(data[2]-64);
    }

  }else if(data[0]==PadMidiChannel){ /// Pads
    if(learning){
      pads[curBotNum-1]=data[1];//aprendo
      learning=false;
    }else if(data[1]==pads[0]){
        eligeNota(0)
    }else if(data[1]==pads[1]){
        eligeNota(1)
    }else if(data[1]==pads[2]){
        eligeNota(2)
    }else if(data[1]==pads[3]){
        eligeNota(3)
    }else if(data[1]==pads[4]){
        eligeNota(4)
    }else if(data[1]==pads[5]){
        eligeNota(5)
    }else if(data[1]==pads[6]){
        eligeNota(6)
    }else if(data[1]==pads[7]){
        eligeNota(7)
    }
  }else if(data[0]==TeclasMidiChannel){//teclas
      //creaNota(frequencyFromNoteNumber(data[1]));
      //console.log("toco tecla");
  }else{
    //console.log("unmapped midi controller")
  }
  if(detectingKnobChannel){
    SliMidiChannel=data[0];
    document.getElementById("knobs").innerText="knobsChannel="+data[0];
    detectingKnobChannel=false;
  }else if(detectingPadChannel){
    PadMidiChannel=data[0];
    document.getElementById("pads").innerText="PadsChannel="+data[0];
    detectingPadChannel=false;
  }
  //console.log("MIDI: "+ data[0] + " "+ data[1]+" "+data[2]);
}


function learn(b){// onmousedown
  if(b.type=="range"){
    learning=true;
    curSliNum=b.name;//num del knob girado
  }else{
    learning=true;
    curBotNum=b.name;//num boton clicado
  }
    console.log("aprende: "+curSliNum);
}
function learnPadChannel(c){//onmousedown
  detectingPadChannel=true;
}
function learnKnobChannel(c){//onmousedown
  detectingKnobChannel=true;
}

function stopLearn(){
  learning=false;
}
function mueveHandler(h,d){
  handlers[h].value=d;
  handlersCont[h].childNodes[3].innerText=Math.round(d*1000)/1000;
}

function asigna(){}
