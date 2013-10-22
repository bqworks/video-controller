/*
	Video Controller jQuery plugin

	Creates a universal controller for multiple video types and providers
*/
;(function($) {

	"use strict";

// check if an iOS device is used
// this information is important because a video can not be
// controlled programmatically unless the user has started the video manually
var	userAgent = window.navigator.userAgent.toLowerCase(),
	isIOS = (userAgent.match(/ipad/i) !== null) ||
			(userAgent.match(/ipod/i) !== null) ||
			(userAgent.match(/iphone/i) !== null);

var VideoController = function(instance, options) {
	this.$video = $(instance);
	this.options = options;
	this.settings = {};
	this.player = null;

	this._init();
};

VideoController.prototype = {

	_init: function() {
		this.settings = $.extend({}, this.defaults, this.options);

		var players = $.VideoController.players,
			that = this,
			videoID = this.$video.attr('id');

		// loop through the available video players
		// and check if the targeted video element is supported by one of the players
		for (var name in players) {
			if (typeof players[name] !== 'undefined' && players[name].isType(this.$video)) {
				this.player = new players[name](this.$video);
				break;
			}
		}

		// return if the player could not be instantiated
		if (this.player === null)
			return;

		// add event listeners
		this.player.on('ready', function() {
			that.trigger({type: 'videoReady', video: videoID});
			if ($.isFunction(that.settings.videoReady))
				that.settings.videoReady.call(that, {type: 'videoReady', video: videoID});
		});

		this.player.on('start', function() {
			that.trigger({type: 'videoStart', video: videoID});
			if ($.isFunction(that.settings.videoStart))
				that.settings.videoStart.call(that, {type: 'videoStart', video: videoID});
		});

		this.player.on('play', function() {
			that.trigger({type: 'videoPlay', video: videoID});
			if ($.isFunction(that.settings.videoPlay))
				that.settings.videoPlay.call(that, {type: 'videoPlay', video: videoID});
		});

		this.player.on('pause', function() {
			that.trigger({type: 'videoPause', video: videoID});
			if ($.isFunction(that.settings.videoPause))
				that.settings.videoPause.call(that, {type: 'videoPause', video: videoID});
		});

		this.player.on('ended', function() {
			that.trigger({type: 'videoEnded', video: videoID});
			if ($.isFunction(that.settings.videoEnded))
				that.settings.videoEnded.call(that, {type: 'videoEnded', video: videoID});
		});
	},
	
	play: function() {
		if (isIOS === true && this.player.isStarted() === false || this.player.getState() === 'playing')
			return;

		this.player.play();
	},
	
	stop: function() {
		if (isIOS === true && this.player.isStarted() === false || this.player.getState() === 'stopped')
			return;

		this.player.stop();
	},
	
	pause: function() {
		if (isIOS === true && this.player.isStarted() === false || this.player.getState() === 'paused')
			return;

		this.player.pause();
	},

	replay: function() {
		if (isIOS === true && this.player.isStarted() === false)
			return;
		
		this.player.replay();
	},

	on: function(type, callback) {
		return this.$video.on(type, callback);
	},
	
	off: function(type) {
		return this.$video.off(type);
	},

	trigger: function(data) {
		return this.$video.triggerHandler(data);
	},

	destroy: function() {
		if (this.player.isStarted() === true)
			this.stop();

		this.player.off('ready');
		this.player.off('start');
		this.player.off('play');
		this.player.off('pause');
		this.player.off('ended');
	},

	defaults: {
		videoReady: function() {},
		videoStart: function() {},
		videoPlay: function() {},
		videoPause: function() {},
		videoEnded: function() {}
	}
};

$.VideoController = {
	players: {},

	addPlayer: function(name, player) {
		this.players[name] = player;
	}
};

$.fn.videoController = function(options) {
	var args = Array.prototype.slice.call(arguments, 1);

	return this.each(function() {
		// instantiate the video controller or call a function on the current instance
		if (typeof $(this).data('videoController') === 'undefined') {
			var newInstance = new VideoController(this, options);

			// store a reference to the instance created
			$(this).data('videoController', newInstance);
		} else if (typeof options !== 'undefined') {
			var	currentInstance = $(this).data('videoController');

			// check the type of argument passed
			if (typeof currentInstance[options] === 'function') {
				currentInstance[options].apply(currentInstance, args);
			} else {
				$.error(options + ' does not exist in videoController.');
			}
		}
	});
};

/*
	Base object for the video players
*/
var Video = function(video) {
	this.$video = video;
	this.player = null;
	this.ready = false;
	this.started = false;
	this.state = '';
	this.events = $({});

	this._init();
};

Video.prototype = {
	_init: function() {},

	play: function() {},

	pause: function() {},

	stop: function() {},

	replay: function() {},

	isType: function() {},

	isReady: function() {
		return this.ready;
	},

	isStarted: function() {
		return this.started;
	},

	getState: function() {
		return this.state;
	},

	on: function(type, callback) {
		return this.events.on(type, callback);
	},
	
	off: function(type) {
		return this.events.off(type);
	},

	trigger: function(data) {
		return this.events.triggerHandler(data);
	}
};

/*
	YouTube video
*/
var YoutubeVideo = function(video) {
	Video.call(this, video);
};

YoutubeVideo.prototype = new Video();
YoutubeVideo.prototype.constructor = YoutubeVideo;
$.VideoController.addPlayer('YoutubeVideo', YoutubeVideo);

YoutubeVideo.isType = function(video) {
	if (video.is('iframe')) {
		var src = video.attr('src');

		if (src.indexOf('youtube.com') !== -1 || src.indexOf('youtu.be') !== -1)
			return true;
	}

	return false;
};

YoutubeVideo.prototype._init = function() {
	var that = this,
		youtubeAPILoaded = window.YT && window.YT.Player;

	if (typeof youtubeAPILoaded !== 'undefined') {
		this._setup();
	} else {
		var tag = document.createElement('script');
		tag.src = "http://www.youtube.com/player_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		
		window.onYouTubePlayerAPIReady = function() {
			that._setup();
		};
	}
};
	
YoutubeVideo.prototype._setup = function() {
	var that = this;

	// get reference to the player
	this.player = new YT.Player(this.$video[0], {
		events: {
			'onReady': function() {
				that.ready = true;
				that.trigger({type: 'ready'});
			},
			
			'onStateChange': function(event) {
				switch (event.data) {
					case YT.PlayerState.PLAYING:
						if (that.started === false) {
							that.started = true;
							that.trigger({type: 'start'});
						}

						that.state = 'playing';
						that.trigger({type: 'play'});
						break;
					
					case YT.PlayerState.PAUSED:
						that.state = 'paused';
						that.trigger({type: 'pause'});
						break;
					
					case YT.PlayerState.ENDED:
						that.state = 'ended';
						that.trigger({type: 'ended'});
						break;
				}
			}
		}
	});
};

YoutubeVideo.prototype.play = function() {
	this.player.playVideo();
};

YoutubeVideo.prototype.pause = function() {
	// on iOS, simply pausing the video can make other videos unresponsive
	// so we stop the video instead
	if (isIOS === true)
		this.stop();
	else
		this.player.pauseVideo();
};

YoutubeVideo.prototype.stop = function() {
	this.player.seekTo(1);
	this.player.stopVideo();
	this.state = 'stopped';
};

YoutubeVideo.prototype.replay = function() {
	this.player.seekTo(1);
	this.player.playVideo();
};

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

/*
	HTML5 video
*/
var HTML5Video = function(video) {
	Video.call(this, video);
};

HTML5Video.prototype = new Video();
HTML5Video.prototype.constructor = HTML5Video;
$.VideoController.addPlayer('HTML5Video', HTML5Video);

HTML5Video.isType = function(video) {
	if (video.is('video') && video.hasClass('video-js') === false && video.hasClass('sublime') === false)
		return true;

	return false;
};

HTML5Video.prototype._init = function() {
	var that = this;

	// get reference to the player
	this.player = this.$video[0];
	this.ready = true;

	this.player.addEventListener('play', function() {
		if (that.started === false) {
			that.started = true;
			that.trigger({type: 'start'});
		}

		that.state = 'playing';
		that.trigger({type: 'play'});
	});
	
	this.player.addEventListener('pause', function() {
		that.state = 'paused';
		that.trigger({type: 'pause'});
	});
	
	this.player.addEventListener('ended', function() {
		that.state = 'ended';
		that.trigger({type: 'ended'});
	});
};

HTML5Video.prototype.play = function() {
	this.player.play();
};

HTML5Video.prototype.pause = function() {
	this.player.pause();
};

HTML5Video.prototype.stop = function() {
	this.player.currentTime = 0;
	this.player.pause();
	this.state = 'stopped';
};

HTML5Video.prototype.replay = function() {
	this.player.currentTime = 0;
	this.player.play();
};

/*
	VideoJS video
*/
var VideoJSVideo = function(video) {
	Video.call(this, video);
};

VideoJSVideo.prototype = new Video();
VideoJSVideo.prototype.constructor = VideoJSVideo;
$.VideoController.addPlayer('VideoJSVideo', VideoJSVideo);

VideoJSVideo.isType = function(video) {
	if (typeof video.attr('data-videojs-id') !== 'undefined' && typeof videojs !== 'undefined')
		return true;

	return false;
};

VideoJSVideo.prototype._init = function() {
	var that = this,
		videoID = this.$video.attr('data-videojs-id');

	this.player = videojs(videoID);

	this.player.ready(function() {
		that.ready = true;
		that.trigger({type: 'ready'});

		that.player.on('play', function() {
			if (that.started === false) {
				that.started = true;
				that.trigger({type: 'start'});
			}

			that.state = 'playing';
			that.trigger({type: 'play'});
		});
		
		that.player.on('pause', function() {
			that.state = 'paused';
			that.trigger({type: 'pause'});
		});
		
		that.player.on('ended', function() {
			that.state = 'ended';
			that.trigger({type: 'ended'});
		});
	});
};

VideoJSVideo.prototype.play = function() {
	this.player.play();
};

VideoJSVideo.prototype.pause = function() {
	this.player.pause();
};

VideoJSVideo.prototype.stop = function() {
	this.player.currentTime(0);
	this.player.pause();
	this.state = 'stopped';
};

VideoJSVideo.prototype.replay = function() {
	this.player.currentTime(0);
	this.player.play();
};

/*
	Sublime video
*/
var SublimeVideo = function(video) {
	Video.call(this, video);
};

SublimeVideo.prototype = new Video();
SublimeVideo.prototype.constructor = SublimeVideo;
$.VideoController.addPlayer('SublimeVideo', SublimeVideo);

SublimeVideo.isType = function(video) {
	if (video.hasClass('sublime') && typeof sublime !== 'undefined')
		return true;

	return false;
};

SublimeVideo.prototype._init = function() {
	var that = this;

	sublime.ready(function() {
		// get a reference to the player
		that.player = sublime.player(that.$video.attr('id'));

		that.ready = true;
		that.trigger({type: 'ready'});

		that.player.on('play', function() {
			if (that.started === false) {
				that.started = true;
				that.trigger({type: 'start'});
			}

			that.state = 'playing';
			that.trigger({type: 'play'});
		});

		that.player.on('pause', function() {
			that.state = 'paused';
			that.trigger({type: 'pause'});
		});

		that.player.on('stop', function() {
			that.state = 'stopped';
			that.trigger({type: 'stop'});
		});

		that.player.on('end', function() {
			that.state = 'ended';
			that.trigger({type: 'ended'});
		});
	});
};

SublimeVideo.prototype.play = function() {
	this.player.play();
};

SublimeVideo.prototype.pause = function() {
	this.player.pause();
};

SublimeVideo.prototype.stop = function() {
	this.player.stop();
};

SublimeVideo.prototype.replay = function() {
	this.player.stop();
	this.player.play();
};

/*
	JWPlayer video
*/
var JWPlayerVideo = function(video) {
	Video.call(this, video);
};

JWPlayerVideo.prototype = new Video();
JWPlayerVideo.prototype.constructor = JWPlayerVideo;
$.VideoController.addPlayer('JWPlayerVideo', JWPlayerVideo);

JWPlayerVideo.isType = function(video) {
	if (typeof video.attr('data-jwplayer-id') !== 'undefined' && typeof jwplayer !== 'undefined')
		return true;

	return false;
};

JWPlayerVideo.prototype._init = function() {
	var that = this,
		videoID = this.$video.attr('data-jwplayer-id');

	// get reference to the player
	this.player = jwplayer(videoID);

	this.player.onReady(function() {
		that.ready = true;
		that.trigger({type: 'ready'});
	
		that.player.onPlay(function() {
			if (that.started === false) {
				that.started = true;
				that.trigger({type: 'start'});
			}

			that.state = 'playing';
			that.trigger({type: 'play'});
		});

		that.player.onPause(function() {
			that.state = 'paused';
			that.trigger({type: 'pause'});
		});
		
		that.player.onComplete(function() {
			that.state = 'ended';
			that.trigger({type: 'ended'});
		});
	});
};

JWPlayerVideo.prototype.play = function() {
	this.player.play(true);
};

JWPlayerVideo.prototype.pause = function() {
	this.player.pause(true);
};

JWPlayerVideo.prototype.stop = function() {
	this.player.stop();
	this.state = 'stopped';
};

JWPlayerVideo.prototype.replay = function() {
	this.player.seek(0);
	this.player.play(true);
};

})(jQuery);