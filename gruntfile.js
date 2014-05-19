module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    
    browserify: {
      build: {
        src: "app/client/main.js",
        dest: "public/index.js"
      }
    },

    sass: {
      dist: {
        files: {
          "public/index.css": "public/index.scss"
        }
      }
    },

    shell: {
      runJasmine: {
        command: "node_modules/jasmine-node/bin/jasmine-node spec --captureExceptions"
      },

      startServer: {
        command: "node app/main.js"
      }
    },

    jshint: {
      options: {
        asi: true,
        bitwise: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        freeze: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        nonbsp: true,
        nonew: true,
        plusplus: true,
        quotmark: "double",
        undef: true,
        unused: true,
        strict: true,
        trailing: true,
      
        maxparams: 3,
        maxdepth: 1,
        maxlen: 120,
        maxcomplexity: 3,

        node: true
      },

      source: ["app/**/*.js", "gruntfile.js"],

      spec: {
        options: {
          predef: ["jasmine", "beforeEach", "describe", "it", "xit", "spyOn", "expect", "afterEach" ]
        },
        files: {
          src: ["spec/**/*.js"]
        }
      }
    }
  })

  grunt.loadNpmTasks("grunt-browserify")
  grunt.loadNpmTasks("grunt-shell")
  grunt.loadNpmTasks("grunt-contrib-jshint")
  grunt.loadNpmTasks("grunt-sass")

  grunt.registerTask("compile", ["jshint:source", "browserify", "sass"])
  grunt.registerTask("test", ["compile", "jshint:spec", "shell:runJasmine"])
  grunt.registerTask("launch", ["test", "shell:startServer"])
  grunt.registerTask("default", ["test"])
}
