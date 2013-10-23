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

## Preparing the videos ##

### YouTube ###

The iframe embeds need to have the `enablejsapi=1` parameter appended to the URL of the video.

```html
<iframe id="my-video" src="http://www.youtube.com/embed/msIjWthwWwI?enablejsapi=1" width="500" height="350" frameborder="0" allowfullscreen></iframe>
```

### Vimeo ###

The iframe embeds need to have the `api=1` parameter appended to the URL of the video.

```html
<iframe id="my-video" src="http://player.vimeo.com/video/43401199?api=1" width="500" height="350" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```

### HTML5 ###

Simple HTML5 videos don't need any preparation.

```html
<video id="my-video" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none">
	<source src="path/to/video.mp4" type="video/mp4"/>
	<source src="path/to/video.ogv" type="video/ogg"/>
</video>
```

### Video.js ###

Videos that use the Video.js library have their HTML markup modified. This creates some problems if we want to instantiate the plugin on the `video` element. The solution is to create a container element and add the video inside the container. To this container we'll add the `data-videojs-id` attribute in order to indicate the `id` attribute of the video element.

```html
<div id="video-container" data-videojs-id="my-video">
	<video id="my-video" class="video-js vjs-default-skin" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none" 
			data-setup="{}">
		<source src="path/to/video.mp4" type="video/mp4"/>
		<source src="path/to/video.ogv" type="video/ogg"/>
	</video>
</div>
```

```javascript
$(document).ready(function() {
	$('#video-container').videoController();
});
```

If you prefer to not use a container, you will need to instantiate the plugin after the video was set up.

```html
<video id="my-video" class="video-js vjs-default-skin" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none" 
		data-setup="{}">
	<source src="path/to/video.mp4" type="video/mp4"/>
	<source src="path/to/video.ogv" type="video/ogg"/>
</video>
```

```javascript
$(document).ready(function() {
	videojs('my-video').ready(function() {
		$('#video-container').videoController();
	});
});
```

Please note that, in order to use Video.js, you need to load the Video.js JavaScript and CSS files in your page. More information about how to use Video.js, in general, can be found on the [official Video.js page](http://www.videojs.com/). 

### SublimeVideo ###

No preparation is required, other than setting up the videos as the Sublime Video documentation indicates.

```html
<video id="my-video" class="sublime" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none">
	<source src="path/to/video.mp4" type="video/mp4"/>
	<source src="path/to/video.ogv" type="video/ogg"/>
</video>
```

Please note that, in order to use SublimeVideo, you will also need to load a script in your page which you need to download from the SublimeVideo page. More information about how to use SublimeVideo, in general, can be found on the [official SublimeVideo page](http://www.sublimevideo.net/).

### JW Player ###

Just like Video.js, JW Player videos modify the HTML markup and we need to use a container element to facilitate the integration with the Video Controller plugin. The container will have the `data-jwplayer-id` attribute which will indicate the `id` attribute of the video element.

```html
<div id="video-container" data-jwplayer-id="my-video">
	<div id="my-video">Loading the video...</div>
</div>
```

```javascript
$(document).ready(function() {
    jwplayer("my-video").setup({
        file: "http://bqworks.com/products/assets/videos/bbb/bbb-trailer.mp4",
        image: "http://bqworks.com/products/assets/videos/bbb/bbb-poster.jpg",
        width: 500,
        height: 350
    });


	$('#video-container').videoController();
});
```

It's also possible to not use a container element, but in that case the plugin needs to be instantiated after the video was set up.

```html
<div id="my-video">Loading the video...</div>
```

```javascript
var video;

$(document).ready(function() {
    jwplayer("my-video").setup({
        file: "http://bqworks.com/products/assets/videos/bbb/bbb-trailer.mp4",
        image: "http://bqworks.com/products/assets/videos/bbb/bbb-poster.jpg",
        width: 500,
        height: 350,
        events: {
        	onReady: function() {
        		// if the flash player is used, the set ID will be attributed to an object element. 
        		// However, we can't instantiate the plugin on an object element, 
        		// so we instantiate it on the object's wrapper instead
        		video = $('#my-video').is('object') ? $('#my-video').parent() : $('#my-video');
        		video.videoController();
        	}
        }
    });
});
```

## License ##

The plugin is available under the <a href="http://opensource.org/licenses/MIT">MIT license</a>.
