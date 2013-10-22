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