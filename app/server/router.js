"use strict";

var buildResponder = function (responseStream) {
  var responder = {}

  responder.respondToInvalidPath = function () {
    process.nextTick(function () {
      responseStream.writeHead(404)
      responseStream.end()
    })
  }

  responder.respondToInvalidMethod = function () {
    process.nextTick(function () {
      responseStream.writeHead(405)
      responseStream.end()
    })
  }

  responder.respondToValidRequest = function (requestBody, responseType, processRequest) {
    var headers = { "Content-Type": responseType }

    var writeToResponseStream = function (error, body) {
      if (error !== null) {
        responseStream.writeHead(422, headers)
        responseStream.end(error)
      } else {
        responseStream.writeHead(200, headers)
        responseStream.end(body)
      }
    }

    process.nextTick(function () {
      processRequest(requestBody, writeToResponseStream)
    })
  }

  return responder
}

exports.build = function (routes) {
  var router = {}

  router.respond = function (requestStream, responseStream) {
    var responder = buildResponder(responseStream)
    
    var route = routes[requestStream.url]

    if (route === undefined) {
      responder.respondToInvalidPath()
    } else if (requestStream.method !== route.method) {
      responder.respondToInvalidMethod()
    } else {
      responder.respondToValidRequest(requestStream.read(), route.responseType, route.processRequest)
    }
  }

  return router
}
