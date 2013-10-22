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