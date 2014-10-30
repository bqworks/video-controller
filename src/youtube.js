/*
	YouTube video
*/
var YoutubeVideoHelper = {
	youtubeAPIAdded: false,
	youtubeVideos: []
};

var YoutubeVideo = function(video) {
	this.init = false;
	var youtubeAPILoaded = window.YT && window.YT.Player;

	if (typeof youtubeAPILoaded !== 'undefined') {
		Video.call(this, video);
	} else {
		YoutubeVideoHelper.youtubeVideos.push({'video': video, 'scope': this});
		
		if (YoutubeVideoHelper.youtubeAPIAdded === false) {
			YoutubeVideoHelper.youtubeAPIAdded = true;

			var tag = document.createElement('script');
			tag.src = "http://www.youtube.com/player_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			window.onYouTubePlayerAPIReady = function() {
				$.each(YoutubeVideoHelper.youtubeVideos, function(index, element) {
					Video.call(element.scope, element.video);
				});
			};
		}
	}
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
	this.init = true;
	this._setup();
};
	
YoutubeVideo.prototype._setup = function() {
	var that = this;

	// get reference to the player
	this.player = new YT.Player(this.$video[0], {
		events: {
			'onReady': function() {
				that.trigger({type: 'ready'});
				that.ready = true;
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
	var that = this;

	if ( this.ready === true ) {
		this.player.playVideo();
	} else {
		var timer = setInterval(function() {
			if ( that.ready === true ) {
				clearInterval( timer );
				that.player.playVideo();
			}
		}, 100 );
	}
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

YoutubeVideo.prototype.on = function(type, callback) {
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