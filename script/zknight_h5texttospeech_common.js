/**
 * 文字转语音 
 * 无论页面有多少需要播报的信息，仅一个DIV去放置播报源，每次播报重新加载播报信息
 * @param {Object} text 播报的文本
 * @param {Object} targetDomId 播报源放置的dom
 */
function zknightTextToSpeech(text, targetDomId) {
	//放置播报语音的dom
	var targetDomDiv = document.getElementById(targetDomId);
	//获取语音源
	var audioModel = document.getElementById('zknight_h5texttospeech_autio');
	
	//防止多次点击播报，每次重新播报
	if(document.body.contains(audioModel)){
		targetDomDiv.removeChild(audioModel);
	}
	
	// 文字转语音
	// lan=zh（语言zh:中文；en:英文；fr:法文；）
	// ie=UTF-8（字符集）
	// per=3（每3个字符停顿）
	// spd=5（语音播放速度，数字越大越快0-15）
	// text=“”（需要转换的文字）
	var zknightH5texttospeechAudio = '<audio id="zknight_h5texttospeech_autio" autoplay="autoplay">'
			+'<source src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&per=3&spd=5&text=' + text + '" type="audio/mpeg">';
			+'<embed  height="0" width="0" src="">';
			+'</audio>';
	targetDomDiv.innerHTML = zknightH5texttospeechAudio;
	
	//播报源
	audioModel = document.getElementById('zknight_h5texttospeech_autio');
	//播报文本
	audioModel.play();
}