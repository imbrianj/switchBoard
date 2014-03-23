module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner : { comment : '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n' },

    jshint : {
      files : ['config/*.js', 'lib/*.js', 'controllers/*.js', 'js/common.js', 'tests/**/*Test.js', 'app.js'],
      options : { globals : { console : true } }
    },

    nodeunit : {
      all : ['tests/**/*Test.js']
    },

    uglify : {
      options : { banner : '<%= banner.comment %>' },
      dist : { files : { 'js/common.min.js' : ['js/common.js'] } }
    },

    concat: {
      css: {
        src : ['css/common.css', 'css/font-awesome.min.css'],
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
      files : ['<%= jshint.files %>', 'css/*.css'],
      tasks : ['concat', 'cssmin', 'uglify', 'nodeunit', 'jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['concat', 'cssmin', 'uglify', 'nodeunit', 'jshint']);
};