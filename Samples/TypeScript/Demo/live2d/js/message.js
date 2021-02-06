/*
 * @Author: XIE Yutai
 * @LastEditors: XIE Yutai
 * @Date: 2021-01-20 10:28:25
 */
// 初始化
var state = 0;// 0 1 2
function changeState(action){
  if (action == "wait") state = 0;
  if (action == "teach") state = 1; 
  if (action == "study") state = 2
  console.log('当前状态'+state+":"+action);
}

function init(){	
    var resourcesPaths = `${resourcesPath}`;;
    var modelDirString = `${modelDir}`;
    var modelDirs = modelDirString.split(',');
    initDefine(resourcesPaths, modelDirs);  // lappdefine.ts开放的接口用于初始化常量被编译到bundle.js文件里
}

// 监听复制（这里简单添加了一些事件，可以添加更多的事件，比如报时等）
(function() {
    document.addEventListener('copy',(e)=>{
      e.preventDefault();
      e.stopPropagation();
      showMessage('你都复制了些什么呀,能让我看看吗？', 5000, true); // 显示信息
    })
}());
// 工具栏的点击事件
$('.tool .fui-home').click(function (){
});

$('.tool .fui-eye').click(function (){
});

$('.tool .fui-chat').click(function (){
});

$('.tool .fui-user').click(function (){
});

$('.tool .fui-info-circle').click(function (){
});

$('.tool .fui-cross').click(function (){
});

$('.tool .fui-photo').click(function (){
});


function showMessage(text, timeout, flag){
    if(flag || sessionStorage.getItem('waifu-text') === '' || sessionStorage.getItem('waifu-text') === null){
        if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
        //console.log(text);
        if(flag) sessionStorage.setItem('waifu-text', text);
        $('.live2d-tips').stop();
        $('.live2d-tips').html(text).fadeTo(200, 1);
        if (timeout === undefined) timeout = 5000;
        hideMessage(timeout);
    }
}

function hideMessage(timeout){
    $('.live2d-tips').stop().css('opacity',1);
    if (timeout === undefined) timeout = 5000;
    window.setTimeout(function() {sessionStorage.removeItem('waifu-text')}, timeout);
    $('.live2d-tips').delay(timeout).fadeTo(200, 0);
}

if(state == 0){
    onTeaching(state);
    console.log("执行");
    getData();
}




// use XHR to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source

function getData() {
    window.AudioContext = (window.AudioContext || window.webkitAudioContext);
    if(window.AudioContext) {
        var audioCtx = new window.AudioContext();
        var source = audioCtx.createBufferSource();
        var audioAnalyser = audioCtx.createAnalyser();
    } else {
        console.log('not support web audio api');
    }

    var request = new XMLHttpRequest();

    request.open('GET', 'http://127.0.0.1:5000/audio/getMp3/letitgo.mp3', true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
    var audioData = request.response;
    console.log(audioData);
    audioCtx.decodeAudioData(audioData, function(buffer) {
        source.buffer = buffer;
        audioAnalyser.fftSize = 32;
        audioAnalyser.minDecibels = -90;
        audioAnalyser.maxDecibels = -10;
        audioAnalyser.smoothingTimeConstant = 0.85;
        var bufferLength = audioAnalyser.fftSize;
        var dataArray = new Uint8Array(bufferLength);
        audioAnalyser.getByteFrequencyData(dataArray);
        source.connect(audioAnalyser);
        audioAnalyser.connect(audioCtx.destination);
        source.loop = true;
        //source.start(0);
        
        // 画出动态
        var canvas = document.getElementById('audioCanvas'),
        cwidth = document.body.clientWidth,
        cheight = canvas.height,
        meterWidth = 1, //width of the meters in the spectrum
        gap = 0,
            // capHeight = 2,
            // capStyle = '#fff',
            // meterNum = 1000 / (10 + 2), //count of the meters
            // capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
        ctx = canvas.getContext('2d');
        var _color = "#f99";
        canvas.setAttribute('width', cwidth);
        var drawMeter = function() {
            var array = new Uint8Array(audioAnalyser.frequencyBinCount);
            audioAnalyser.getByteFrequencyData(array);

            // var step = Math.round(array.length / meterNum); //sample limited data from the total array
            // console.log(step)
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                //console.log(array[i]);
                ctx.fillStyle = _color; //set the filllStyle to gradient for a better look
                ctx.fillRect(i * meterWidth /*meterWidth+gap*/ , cheight - value, meterWidth, value); //the meter
            }
            requestAnimationFrame(drawMeter);
        }
        requestAnimationFrame(drawMeter);
      },
      function(e){"Error with decoding audio data" + e.err});

  }

  request.send();
}






function showAudio(){
    
    /**
     * 
     * window.AudioContext = (window.AudioContext || window.webkitAudioContext);
    if(window.AudioContext) {
        var context = new window.AudioContext();
    } else {
        console.log('not support web audio api');
    }

    var source = context.createBufferSource();

    
    var audioURl = "http://127.0.0.1:5000/audio/getMp3/letitgo.mp3";
    var xhr = new XMLHttpRequest();
    xhr.open('GET',audioURl,true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(){
        
        context.decodeAudioData(request.response, function(buffer){
            source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
        })
    }
    xhr.send();

    var audioCtx = new AudioContext();
    var audio = document.getElementById("testaudio");
    var source = audioCtx.createMediaElementSource(audio);
    var audioAnalyser = audioCtx.createAnalyser();
    audioAnalyser.fftSize =256;
    var bufferLength = audioAnalyser.fftSize;
    var dataArray = new Uint8Array(bufferLength);
    audioAnalyser.getByteFrequencyData(dataArray);
    console.log(dataArray);
    source.connect(audioAnalyser);
    audioAnalyser.connect(audioCtx.destination);
    console.log("音乐播放1");
    audio.play();

     */
}