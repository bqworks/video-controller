/*
	Vimeo video
*/
var VimeoVideoHelper = {
	vimeoAPIAdded: false,
	vimeoVideos: []
};

var VimeoVideo = function(video) {
	this.init = false;

	if (typeof window.Froogaloop !== 'undefined') {
		Video.call(this, video);
	} else {
		VimeoVideoHelper.vimeoVideos.push({'video': video, 'scope': this});

		if (VimeoVideoHelper.vimeoAPIAdded === false) {
			VimeoVideoHelper.vimeoAPIAdded = true;

			var tag = document.createElement('script');
			tag.src = "http://a.vimeocdn.com/js/froogaloop2.min.js";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		
			var checkVimeoAPITimer = setInterval(function() {
				if (typeof window.Froogaloop !== 'undefined') {
					clearInterval(checkVimeoAPITimer);
					
					$.each(VimeoVideoHelper.vimeoVideos, function(index, element) {
						Video.call(element.scope, element.video);
					});
				}
			}, 100);
		}
	}
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
	this.init = true;
	this._setup();
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
	var that = this;

	if ( this.ready === true ) {
		this.player.api( 'play' );
	} else {
		var timer = setInterval(function() {
			if ( that.ready === true ) {
				clearInterval( timer );
				that.player.api( 'play' );
			}
		}, 100 );
	}
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

VimeoVideo.prototype.on = function(type, callback) {
	var that = this;

	if (this.init === true) {
		Video.prototype.on.call(this, type, callback);
	} else {
		var timer = setInterval(function() {
			if (that.init === true) {
				clearInterval(timer);
				Video.prototype.on.call(that, type, callback);
			}
		}, 100);
	}
};