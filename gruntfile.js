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
          predef: ["jasmine", "beforeEach", "describe", "it", "xit", "spyOn", "expect", "afterEach", "pending" ]
        },
        files: {
          src: ["spec/**/*.js"]
        }
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
      "jasmine-unit": {
        command: "node_modules/jasmine-node/bin/jasmine-node spec/client spec/server --captureExceptions"
      },

      "jasmine-functional": {
        command: "node_modules/jasmine-node/bin/jasmine-node spec/full_stack_spec.js --captureExceptions"
      },

      "start-server": {
        command: "node app/main.js"
      }
    }
  })

  grunt.loadNpmTasks("grunt-browserify")
  grunt.loadNpmTasks("grunt-contrib-jshint")
  grunt.loadNpmTasks("grunt-sass")
  grunt.loadNpmTasks("grunt-shell")

  grunt.registerTask("unit-test", ["shell:jasmine-unit"])
  grunt.registerTask("compile", ["browserify", "sass"])
  grunt.registerTask("functional-test", ["shell:jasmine-functional"])
  grunt.registerTask("launch", ["shell:start-server"])

  grunt.registerTask("dev:all", ["jshint", "unit-test", "compile", "functional-test"])
  grunt.registerTask("dev:lite", ["jshint", "unit-test"])

  grunt.registerTask("default", ["dev:all"])
}
