/*
	Vimeo video
*/
var VimeoVideo = function(video) {
	Video.call(this, video);
};

VimeoVideo.prototype = new Video();
VimeoVideo.prototype.constructor = VimeoVideo;
$.VideoController.addPlayer('VimeoVideo', VimeoVideo);

VimeoVideo.isType = function(video) {
	if (video.is('iframe')) {
		var src = video.attr('src');

		if (src.indexOf('vimeo.com') !== -1)
			return true;
	}

	return false;
};

VimeoVideo.prototype._init = function() {
	var that = this;

	if (typeof window.Froogaloop !== 'undefined') {
		this._setup();
	} else {
		var tag = document.createElement('script');
		tag.src = "http://a.vimeocdn.com/js/froogaloop2.min.js";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		
		var checkVimeoAPITimer = setInterval(function() {
			if (typeof window.Froogaloop !== 'undefined') {
				clearInterval(checkVimeoAPITimer);
				that._setup();
			}
		}, 100);
	}
};

VimeoVideo.prototype._setup = function() {
	var that = this;

	// get reference to the player
	this.player = $f(this.$video[0]);
	
	this.player.addEvent('ready', function() {
		that.ready = true;
		that.trigger({type: 'ready'});
		
		that.player.addEvent('play', function() {
			if (that.started === false) {
				that.started = true;
				that.trigger({type: 'start'});
			}

			that.state = 'playing';
			that.trigger({type: 'play'});
		});
		
		that.player.addEvent('pause', function() {
			that.state = 'paused';
			that.trigger({type: 'pause'});
		});
		
		that.player.addEvent('finish', function() {
			that.state = 'ended';
			that.trigger({type: 'ended'});
		});
	});
};

VimeoVideo.prototype.play = function() {
	this.player.api('play');
};

VimeoVideo.prototype.pause = function() {
	this.player.api('pause');
};

VimeoVideo.prototype.stop = function() {
	this.player.api('seekTo', 0);
	this.player.api('pause');
	this.state = 'stopped';
};

VimeoVideo.prototype.replay = function() {
	this.player.api('seekTo', 0);
	this.player.api('play');
};