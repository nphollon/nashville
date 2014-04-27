module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      build: {
        src: "app/client/main.js",
        dest: "public/index.js"
      }
    },

    shell: {
      runJasmine: {
        command: "node_modules/jasmine-node/bin/jasmine-node spec"
      },

      compileStatic: {
        command: "nodejs app/compile_static_resources.js"
      },

      startServer: {
        command: "nodejs app/main.js"
      }
    },

    jshint: {
      all: ["spec/*.js", "app/**/*.js"]
    }
  })

  grunt.loadNpmTasks("grunt-browserify")
  grunt.loadNpmTasks("grunt-shell")
  grunt.loadNpmTasks("grunt-contrib-jshint")

  grunt.registerTask("default", ["shell:runJasmine"])
}