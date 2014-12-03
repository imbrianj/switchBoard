module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner  : { comment : '/* <%= grunt.template.today("yyyymmdd") %> */\n' },

    jsFiles : ['config/*.js', 'apps/*.js', 'controllers/*.js', 'lib/*.js', 'parsers/*.js', 'pollers/*.js', 'js/common.js', 'js/switchBoard.js', 'lang/*.js', 'tests/**/*Test.js', 'app.js'],

    jshint  : {
      files   : '<%= jsFiles %>',
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
        newcap   : false,
        globals  : {
          console     : true,
          State       : true,
          __dirname   : true,
          SB          : true,
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
      all : ['tests/unit/controllers/*Test.js',
             'tests/unit/events/*Test.js',
             'tests/unit/lib/*Test.js',
             'tests/unit/parsers/*Test.js',
             'tests/unit/js/*Test.js']
    },

    uglify : {
      options : { banner : '<%= banner.comment %>' },
      dist    : { files : { 'js/common.min.js' : ['js/common.js', 'js/switchBoard.js', 'parsers/*', 'lib/sharedUtil.js'] } }
    },

    concat: {
      css: {
        src  : ['css/common.css', 'css/font-awesome.css'],
        dest : 'css/combo.min.css'
      }
    },

    cssmin : {
      options : { banner : '<%= banner.comment %>' },
      css : {
        src  : 'css/combo.min.css',
        dest : 'css/combo.min.css'
      }
    },

    watch : {
      files : ['<%= jshint.files %>', 'css/common.css', 'css/font-awesome.css'],
      tasks : ['default']
    }
  });

  grunt.registerTask('translation', function() {
    var master = require(__dirname + '/lang/en').strings(),
        langs  = ['es-CO'],
        lang,
        group,
        string,
        i      = 0;

    for(i; i < langs.length; i += 1) {
      lang = require(__dirname + '/lang/' + langs[i]).strings();

      for(group in master) {
        if(lang[group]) {
          for(string in master[group]) {
            if(!lang[group][string]) {
              console.log('Missing String Translation: ' + langs[i] + ': ' + group + ': ' + string);
            }
          }
        }

        else {
          console.log('Missing Device Translation: ' + langs[i] + ': ' + group);
        }
      }
    }
  });

  grunt.registerTask('freshenManifest', function() {
    var fs           = require('fs'),
        done         = this.async();
        rawManifest  = fs.readFileSync(__dirname + '/cache.manifest').toString(),
        parts        = rawManifest.split("\n"),
        now          = new Date(),
        dateStamp    = now.toISOString().slice(0, 10).replace(/-/g, ""),
        manifest     = rawManifest,
        manifestFile = fs.createWriteStream(__dirname + '/cache.manifest');

    parts[1] = '#' + dateStamp;

    manifest = parts.join("\n");

    manifestFile.write(manifest);
    manifestFile.end();

    console.log('Updated cache manifest');

    done();
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['concat', 'cssmin', 'jshint', 'nodeunit', 'uglify', 'translation', 'freshenManifest']);
};
