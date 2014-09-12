"use strict";

exports.buildRequester = function ($, urls) {
  var requester = {}

  var sendResponseTo = function (callback) {
    return function (data) {
      callback(null, data)
    }
  }

  var sendErrorTo = function (callback) {
    return function (xhr) {
      callback(xhr.responseText)
    }
  }

  var post = function (url, postObject, callback) {
    $.post(url, postObject, sendResponseTo(callback), "json")
      .fail(sendErrorTo(callback))
  }

  requester.request = function (callback) {
    post(urls.requestUrl, {}, callback)
  }

  requester.submit = function (decision, callback) {
    post(urls.submitUrl, decision, callback)
  }

  return requester
}
