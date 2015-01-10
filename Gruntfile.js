module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner  : { comment : '/* <%= grunt.template.today("yyyymmdd") %> */\n' },

    jsFiles : ['config/*.js', 'apps/**/*.js', 'controllers/*.js', 'lib/*.js', 'parsers/*.js', 'pollers/*.js', 'js/common.js', 'js/switchBoard.js', 'lang/*.js', 'tests/**/*Test.js', 'app.js'],

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
      all : ['tests/unit/apps/**/*Test.js',
             'tests/unit/controllers/*Test.js',
             'tests/unit/lib/*Test.js',
             'tests/unit/parsers/*Test.js',
             'tests/unit/js/*Test.js']
    },

    uglify : {
      options : { banner : '<%= banner.comment %>' },
      dist    : { files : { 'js/combo.min.js' : ['js/common.js', 'js/switchBoard.js', 'parsers/*', 'lib/sharedUtil.js'] } }
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

  grunt.registerTask('freshenManifest', function() {
    var fs           = require('fs'),
        done         = this.async();
        rawManifest  = fs.readFileSync(__dirname + '/manifest.appcache').toString(),
        parts        = rawManifest.split("\n"),
        now          = new Date(),
        dateStamp    = now.toLocaleString(),
        manifest     = rawManifest,
        manifestFile = {};

    parts[1] = '# ' + dateStamp;

    manifest = parts.join("\n");

    if((parts.length > 3) && (manifest)) {
      manifestFile = fs.writeFile(__dirname + '/manifest.appcache', manifest, function(err) {
        if(err) {
          console.log('\x1b[31mApp Cache\x1b[0m: Cache manifest unable to be updated');
        }

        else {
          console.log('\x1b[32mApp Cache\x1b[0m: Cache manifest updated');
        }

        done();
      });
    }

    else {
      console.log('\x1b[31mApp Cache\x1b[0m: Cache manifest unable to be read');

      done();
    }
  });

  grunt.registerTask('install-precommit', function() {
    var fs   = require('fs'),
        done = this.async(),
        file = __dirname + '/.git/hooks/pre-commit',
        hook;

    fs.exists(file, function(exists) {
      if(!exists) {
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

        fs.writeFile(file, hook, function(err) {
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

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['concat', 'cssmin', 'jshint', 'nodeunit', 'uglify', 'translation', 'install-precommit', 'freshenManifest']);
};
