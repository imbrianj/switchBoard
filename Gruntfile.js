module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner  : { comment : '/* <%= grunt.template.today("yyyymmdd") %> */\n' },

    jsFiles : ['config/*.js',
               'apps/**/*.js',
               'devices/**/*.js',
               'lib/*.js',
               'js/common.js',
               'js/switchBoard.js',
               'lang/*.js',
               'tests/**/*.js',
               'app.js'],

    jshint  : {
      files   : '<%= jsFiles %>',
      options : {
        bitwise       : true,
        debug         : true,
        curly         : true,
        eqeqeq        : true,
        eqnull        : true,
        forin         : true,
        freeze        : true,
        futurehostile : true,
        iterator      : true,
        latedef       : true,
        laxbreak      : true,
        loopfunc      : true,
        noarg         : true,
        nonbsp        : true,
        nocomma       : true,
        nonew         : true,
        notypeof      : true,
        strict        : true,
        undef         : true,
        unused        : true,
        globals       : {
          module      : true,
          require     : true,
          console     : true,
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
      all : ['tests/unit/apps/**/*.js',
             'tests/unit/devices/**/*.js',
             'tests/unit/lib/*.js',
             'tests/unit/js/*.js']
    },

    uglify : {
      options : { banner : '<%= banner.comment %>' },
      dist    : { files  : { 'js/combo.min.js' : ['js/common.js', 'js/switchBoard.js', 'devices/**/parser.js', 'lib/sharedUtil.js'] } }
    },

    concat : {
      css : {
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

  grunt.registerTask('translation', function () {
    var master = require(__dirname + '/lang/en').strings(),
        langs  = ['es-CO'],
        lang,
        group,
        string,
        i      = 0,
        found  = 0;

    for(i; i < langs.length; i += 1) {
      lang = require(__dirname + '/lang/' + langs[i]).strings();

      for(group in master) {
        if(lang[group]) {
          for(string in master[group]) {
            if(!lang[group][string]) {
              found += 1;

              console.log('\x1b[31mTranslation\x1b[0m: Missing ' + string + ' for ' + group + ' in ' + langs[i]);
            }
          }
        }

        else {
          found += 1;

          console.log('\x1b[31mTranslation\x1b[0m: Missing ' + group + ' for ' + langs[i]);
        }
      }
    }

    if(found === 0) {
      console.log('\x1b[32mTranslation\x1b[0m: All strings translated');
    }
  });

  grunt.registerTask('install-precommit', function () {
    var fs   = require('fs'),
        done = this.async(),
        file = __dirname + '/.git/hooks/pre-commit',
        hook;

    fs.stat(file, function(err, data) {
      if(err) {
        hook  = '#!/bin/bash\n';
        hook += '\n';
        hook += 'grunt\n';
        hook += 'RETVAL=$?\n';
        hook += '\n';
        hook += 'if [ $RETVAL -ne 0 ]\n';
        hook += 'then\n';
        hook += '  echo -e "\\e[31mGit Precommit\\e[0m: Ran into an issue"\n';
        hook += '  exit 1\n';
        hook += 'else\n';
        hook += '  echo -e "\\e[32mGit Precommit\\e[0m: Finished without error"\n';
        hook += 'fi';

        fs.writeFile(file, hook, function (err) {
          if(err) {
            console.log('\x1b[31mGit Precommit\x1b[0m: Hook failed to generate');
          }

          else {
            fs.chmodSync(file, '755');
            console.log('\x1b[32mGit Precommit\x1b[0m: Hook generated');
          }

          done();
        });
      }

      else {
        console.log('\x1b[32mGit Precommit\x1b[0m: File already exists');

        done();
      }
    });
  });

  grunt.registerTask('update-version', function () {
    var fs      = require('fs'),
        done    = this.async(),
        file    = __dirname + '/cache/version.txt',
        version = new Date().getTime();

    fs.writeFile(file, version, function (err) {
      if(err) {
        console.log('\x1b[31mVersion\x1b[0m: Failed to update');
      }

      else {
        console.log('\x1b[32mVersion\x1b[0m: Updated');
      }

      done();
    });
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('test-suite', ['jshint', 'nodeunit', 'translation']);
  grunt.registerTask('default',    ['update-version', 'concat', 'cssmin', 'jshint', 'nodeunit', 'uglify', 'translation', 'install-precommit']);
};
