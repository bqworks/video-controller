module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    appName: 'Video Controller',
    fileName: 'jquery.videoController',
    concat: {
      options: {
        separator: '\n\n'
      },
      dist: {
        src: [
          'src/intro.js',
          'src/core.js',
          'src/base.js',
          'src/youtube.js',
          'src/vimeo.js',
          'src/html5.js',
          'src/videojs.js',
          'src/sublimevideo.js',
          'src/jwplayer.js',
          'src/outro.js',
        ],
        dest: 'dist/<%= fileName %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*!\n<%= appName %> by <%= pkg.author %>\n<%= pkg.homepage %>\n*/\n'
      },
      dist: {
        files: {
          'dist/<%= fileName %>.min.js': '<%= concat.dist.dest %>'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'dist/<%= fileName %>.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= concat.dist.src %>'],
      tasks: ['concat', 'jshint', 'uglify']
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'jshint', 'uglify']);

};