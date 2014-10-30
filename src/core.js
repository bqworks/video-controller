// check if an iOS device is used
// this information is important because a video can not be
// controlled programmatically unless the user has started the video manually
var	userAgent = window.navigator.userAgent.toLowerCase(),
	isIOS = window.navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ? true : false;

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

		var that = this,
			players = $.VideoController.players,
			videoID = this.$video.attr('id');

		// loop through the available video players
		// and check if the targeted video element is supported by one of the players.
		// if a compatible type is found, store the video type
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
		var events = ['ready', 'start', 'play', 'pause', 'ended'];
		
		$.each(events, function(index, element) {
			var event = 'video' + element.charAt(0).toUpperCase() + element.slice(1);

			that.player.on(element, function() {
				that.trigger({type: event, video: videoID});
				if ($.isFunction(that.settings[event]))
					that.settings[event].call(that, {type: event, video: videoID});
			});
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

		this.$video.removeData('videoController');
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