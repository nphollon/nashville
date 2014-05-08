"use strict";

exports.build = function (dependencies) {
  return { get: function (name) {
    return dependencies[name] ||
      require("./" + name).build(dependencies)
    }
  }
}