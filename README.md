# Video Controller #

jQuery plugin that offers an interface for controlling (play, pause and stop) some of the popular video players and providers, so that you don't have to deal with the particularities of each video API. The plugin is most useful when you have multiple types of videos.

At the moment, support was added for YouTube, Vimeo, HTML5, Video.js, Sublime Video and JW Player.

## Getting started ##

### Load the scripts: ###

```html
<script type="text/javascript" src="/path/to/jquery-1.10.1.min.js"></script>
<script type="text/javascript" src="/path/to/jquery.videoController.min.js"></script>
```

### Load the video(s): ###

```html
<body>
	<iframe id="my-video" src="http://www.youtube.com/embed/oaDkph9yQBs?enablejsapi=1" width="560" height="315" frameborder="0" allowfullscreen></iframe>
</body>
```

### Instantiate the plugin: ###

```html
<script type="text/javascript">
	$(document).ready(function() {
		$('#my-video').videoController();
	});
</script>
```

## Usage ##

Once the plugin is instantiated, you can use the API provided by the plugin for playing or pausing videos, as well as listening for events.

### Methods ###

The available public methods are: 

* `play` - plays the video
* `pause` - pauses the video
* `stop` - stops the video
* `replay` - replays the video

Example:

```html
<script type="text/javascript">
	$(document).ready(function() {
		$('#my-video').videoController();
	});

	function playVideo() {
		$('#my-video').videoController('play');
	}

	function pauseVideo() {
		$('#my-video').videoController('pause');
	}

	function stopVideo() {
		$('#my-video').videoController('stop');
	}
</script>
</head>

<body>
	<iframe id="my-video" src="http://www.youtube.com/embed/oaDkph9yQBs?enablejsapi=1" width="560" height="315" frameborder="0" allowfullscreen></iframe>
				
	<div class="controls">
	    <a href="#" onclick="playVideo();">Play</a>
	    <a href="#" onclick="pauseVideo();">Pause</a>
	    <a href="#" onclick="stopVideo();">Stop</a>
	</div>
</body>
```

### Events ###

The available events are: 

* `videoReady` - triggered when the video is ready for interaction
* `videoStart` - triggered the first time when a video starts playing
* `videoPlay` - triggered whenever a video starts playing, whether it's the first time or after it was paused or stopped
* `videoPause` - triggered when the video is paused
* `videoStop` - triggered when the video is stopped. Usually, when a video is stopped it's actually paused and the playhead is moved to the beginning of the video
* `videoEnded` - triggered when a video ends

Example 1:

```html
<script type="text/javascript">
	$(document).ready(function() {
		$('#my-video').videoController({
			videoReady: function() { console.log('ready'); },
			videoStart: function() { console.log('start'); },
			videoPlay: function() { console.log('play'); },
			videoPause: function() { console.log('pause'); },
			videoEnded: function() { console.log('ended'); }
		});
	});
</script>
```

Example 2:

```html
<script type="text/javascript">
	$(document).ready(function() {
		$('#my-video').videoController();

		$('#my-video').on('videoPlay', function(event) {
			console.log('video with the ID ' + event.video + ' has started playing');
		});

		$('#my-video').on('videoEnded', function(event) {
			console.log('video has ended');
		});
	});
</script>
```

## Examples ##

More examples can be found in the 'examples' folder.

## License ##

The plugin is available under the <a href="http://opensource.org/licenses/MIT">MIT license</a>.
