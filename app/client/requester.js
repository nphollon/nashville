"use strict";

exports.buildRequester = function ($, urls) {
  var requester = {}

  var sendResponseTo = function (callback) {
    return function (data) {
      process.nextTick(function () {
        callback(data)
      })
    }
  }

  var post = function (url, postObject, callback) {
    $.post(url, JSON.stringify(postObject), sendResponseTo(callback), "json")
  }

  requester.request = function (callback) {
    post(urls.requestUrl, {}, callback)
  }

  requester.submit = function (decision, callback) {
    post(urls.submitUrl, decision, callback)
  }

  return requester
}
