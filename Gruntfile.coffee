module.exports = (grunt) ->
  grunt.initConfig
    devserver:
      server:
        options:
          port: 8080
    coffee:
      compile:
        options:
          sourceMap: false
        files:
          'tuner.js': 'coffeescript/*.litcoffee'
    docco:
      all:
        options:
          layout: 'linear'
        files:
          src: 'coffeescript/*.litcoffee'
    watch:
      app:
        files: ['**/*.litcoffee', '**/*.scss']
        tasks: ['build']
    uglify:
      minify:
        files:
          'tuner.min.js': ['tuner.js']
    sass:
      dist:
        files:
          'tuner.css': 'styles/style.scss'
    concurrent:
      default: 
        tasks: ['devserver', 'watch']
        options:
          logConcurrentOutput: true

  grunt.loadNpmTasks 'grunt-concurrent'
  grunt.loadNpmTasks 'grunt-devserver'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-docco-multi'

  grunt.registerTask 'build', ['coffee', 'docco', 'uglify', 'sass']
  grunt.registerTask 'default', ['concurrent:default']