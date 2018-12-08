/*
如果喜欢请点个Star吧!
本人第一个写的开源项目
博客:huyaoblog.cn

我参考的信息在这里:
https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API 
https://www.web-tinker.com/search/AudioAPI%20createAnalyser%20%E6%B3%A2%E5%BD%A2%E5%9B%BE/1.html
*/

var audio_bass=false,audio_reverberation=false;
var AudioContext = AudioContext || webkitAudioContext;
var context = new AudioContext;
//加载媒体
var source = context.createMediaElementSource(audio);//资源

var convolver=context.createConvolver();//混响1
var convolver2=context.createConvolver();//混响2 (用来增强混响效果的x)
var delay=context.createDelay();//delay混响
var gain=context.createGain();//音量限制1
var gain2=context.createGain();//音量限制2
var gain3=context.createGain();//音量限制3
var gain4=context.createGain();//音量限制3
var filter = context.createBiquadFilter();//音频滤波器

var distortion = context.createWaveShaper();

gain.gain.value=1;//限制主音量
gain2.gain.value=0.7;//混响1音量限制
gain3.gain.value=0.25;//混响2音量限制
gain4.gain.value=1;//低音音量限制

source.connect(gain);//将资源连接至音量限制1
source.connect(convolver);//将资源连接至混响1
source.connect(convolver2);//将资源连接至混响2

convolver.connect(gain2);//混响1连接至音量限制2
convolver2.connect(gain3);//混响1连接至音量限制2

gain.connect(context.destination);//将音量限制1的数据输出

source.connect(gain4);//将资源连接至音量限制1

//source.connect(filter);//连接滤波器
//设置filter参数
filter.type = 'lowpass';// 低通滤波器 BiquadFilterNode 文档有说明
filter.frequency.value = 100;// 设置截止位置为 100HZ 让100HZ以下的声音通过

//模拟混响样本
var frameCount = context.sampleRate * 2.0;
var length = context.sampleRate;
var buffer=context.createBuffer(2,frameCount,context.sampleRate);
var data=[buffer.getChannelData(0),buffer.getChannelData(1)];
//console.log(data)
for(var i=0;i<length;i++){
  //平方根衰减
  var v=1-Math.sqrt(i/length);
  //叠加24个不同频率
  for(var j=1;j<=24;j++){
	v*=Math.sin(i/j);
  }
  //记录数据
  data[0][i]=data[1][i]=v;
};

//source.connect(distortion);失真

function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = context.sampleRate ,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};

distortion.curve = makeDistortionCurve(20);
distortion.oversample = 'none';

//distortion.connect(context.destination);

//缓冲
convolver.buffer=buffer;
convolver2.buffer=buffer;

//设置低音效果
function bass_effect(option){
	audio_bass=option;
	if(audio_bass==false){
		//断开滤波器连接
		filter.disconnect();
		//判断混响有没有开
		if(audio_reverberation==false){
			gain.gain.value=1
		}else{
			gain.gain.value=0.4;
		}
	}else{
		//滤波器连接至主输出
		gain4.connect(filter);
		filter.connect(context.destination);
		//音量限制1保持0.4
		gain.gain.value=0.4;
	}
}

//设置混响
function rever_effect(option){
	audio_reverberation=option;
	if(audio_reverberation==false){
		//断开混响连接
		convolver.disconnect();
		convolver2.disconnect();
		//判断混响有开没
		if(audio_reverberation==false){
			gain.gain.value=1;
		}else{
			gain.gain.value=0.4;
		}
	}else{
		//连接两个混响
		convolver.connect(context.destination);
		convolver2.connect(context.destination);
		gain.gain.value=0.4;
	}
}

//设置低音音量
function bass_volume(option){
	option=option/100;
	gain4.gain.value=option;
}

