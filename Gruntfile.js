module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner : { comment : '/* <%= grunt.template.today("yyyymmdd") %> */\n' },

    jsFiles : ['config/*.js', 'lib/*.js', 'controllers/*.js', 'parsers/*.js', 'events/*.js', 'js/common.js', 'tests/**/*Test.js', 'app.js'],

    jshint : {
      files : '<%= jsFiles %>',
      options : {
        undef    : true,
        eqnull   : true,
        debug    : true,
        noarg    : true,
        boss     : true,
        loopfunc : true,
        evil     : true,
        laxbreak : true,
        bitwise  : true,
        strict   : true,
        nonew    : true,
        globals  : {
          console     : true,
          State       : true,
          __dirname   : true,
          Switchboard : true,
          exports     : true,
          process     : true,
          setTimeout  : true,
          setInterval : true,
          WebSocket   : true,
          document    : true,
          window      : true
        }
      }
    },

    nodeunit : {
      /* We want to explicitly run tests/unit/js/ last since it will create some
         mock client objects that would otherwise be picked up in
         tests/unit/parsers/ */
      all : ['tests/unit/controller/*Test.js',
             'tests/unit/events/*Test.js',
             'tests/unit/lib/*Test.js',
             'tests/unit/parsers/*Test.js',
             'tests/unit/js/*Test.js']
    },

    uglify : {
      options : { banner : '<%= banner.comment %>' },
      dist : { files : { 'js/common.min.js' : ['js/common.js', 'parsers/*'] } }
    },

    concat: {
      css: {
        src : ['css/common.css', 'css/font-awesome.css'],
        dest : 'css/combo.min.css'
      }
    },

    cssmin : {
      options : { banner : '<%= banner.comment %>' },
      css : {
        src : 'css/combo.min.css',
        dest : 'css/combo.min.css'
      }
    },

    watch : {
      files : ['<%= jshint.files %>', 'css/common.css', 'css/font-awesome.css'],
      tasks : ['concat', 'cssmin', 'nodeunit', 'jshint', 'uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['concat', 'cssmin', 'nodeunit', 'jshint', 'uglify']);
};
