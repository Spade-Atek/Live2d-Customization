// 初始化
var state = 0;// 0 1 2
function changeState(action){
  if (action = "wait") state = 0;
  if (action = "teach") state = 1; 
  if (action = "study") state = 2
  console.log(state);
}

function init(){	
    var resourcesPaths = `${resourcesPath}`;
    var backImageNames = `${backImageName}`;
    var modelDirString = `${modelDir}`;
    var modelDirs = modelDirString.split(',');
    initDefine(resourcesPaths, backImageNames, modelDirs);  // lappdefine.ts开放的接口用于初始化常量被编译到bundle.js文件里
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