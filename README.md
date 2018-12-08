# web_audio_effect
web音频效果
<br/><br/><br/>
使用浏览器自带Web Audio API

自己封装的一个音效...
<br/><br/>
参考文档:<br/>
https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API
<br/>https://www.web-tinker.com/search/AudioAPI%20createAnalyser%20%E6%B3%A2%E5%BD%A2%E5%9B%BE/1.html
<br/><br/>示例在index.html里<br/><br/>
使用:<br/>
在引用js前写上这一句:<br/>
var audio = document.getElementById(" audio_id ");
<br/>
audio_id = 您的audio标签的id
<br/><br/><br/><br/><br/>
当前支持的一些音效:<br/>
低音增强<br/>空间混响<br/>
<br/><br/>
低音增强:<br/>
bass_effect(boolean);<br/>使用布尔值控制<br/>

空间混响:<br/>
rever_effect(boolean);<br/>使用布尔值控制<br/>
