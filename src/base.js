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