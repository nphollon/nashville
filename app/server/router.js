"use strict";

var readRequestBody = function (requestStream, callback) {
  var body = ""

  requestStream.setEncoding("utf8")

  requestStream.on("data", function (chunk) {
    body += chunk
  })

  requestStream.on("end", function () {
    process.nextTick(function () {
      callback(body)
    })
  })
}

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
      if (error === null) {
        responseStream.writeHead(200, headers)
        responseStream.end(body)
      } else {
        responseStream.writeHead(422, headers)
        responseStream.end(error)
      }
    }

    process.nextTick(function () {
      processRequest(requestBody, writeToResponseStream)
    })
  }

  return responder
}

exports.build = function (routes) {
  return function (requestStream, responseStream) {
    var responder = buildResponder(responseStream)
    
    var route = routes[requestStream.url]

    if (route === undefined) {
      responder.respondToInvalidPath()
    } else if (requestStream.method !== route.method) {
      responder.respondToInvalidMethod()
    } else {
      readRequestBody(requestStream, function (body) {
        responder.respondToValidRequest(body, route.responseType, route.processRequest)
      })
    }
  }
}
