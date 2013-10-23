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
	if ((typeof video.attr('data-videojs-id') !== 'undefined' || video.hasClass('video-js')) && typeof videojs !== 'undefined')
		return true;

	return false;
};

VideoJSVideo.prototype._init = function() {
	var that = this,
		videoID = this.$video.hasClass('video-js') ? this.$video.attr('id') : this.$video.attr('data-videojs-id');
	
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