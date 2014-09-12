describe("The requester", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var requesterFactory = helpers.requireSource("client/requester")

  var jQuery, requestUrl, submitUrl, requester, postXHR

  beforeEach(function () {
    jQuery = {}
    postXHR = { fail: function () {} }
    requestUrl = "request url"
    submitUrl = "submit url"
    requester = requesterFactory.buildRequester(jQuery, {
      requestUrl: requestUrl,
      submitUrl: submitUrl
    })
  })

  describe("requesting data", function () {
    it("posts an empty message to the request url", function (done) {
      var response = { key: "value" }
      
      jQuery.post = function (postUrl, postBody, postCallback) {
        expect(postUrl).toBe(requestUrl)
        expect(postBody).toEqual({})
        postCallback(response, "success", { status: 200 })
        return postXHR
      }

      var callback = function (error, postResponse) {
        expect(error).toBe(null)
        expect(postResponse).toEqual(response)
        done()
      }

      requester.request(callback)
    })

    it("sends error to callback if Ajax returns unexpected status code", function (done) {
      var response = JSON.stringify({ key: "value" })
      var responseXHR = {
        status: 422,
        responseText: response
      }

      jQuery.post = function () {
        return {
          fail: function (callback) {
            callback(responseXHR)
          }
        }
      }

      var callback = function (error) {
        expect(error).toBe(response)
        done()
      }

      requester.request(callback)
    })
  })

  describe("submitting a decision", function () {
    it("posts the decision to the submit url", function (done) {
      var decision = { decision: "value" }
      var response = { key: "value" }

      jQuery.post = function (postUrl, postBody, postCallback) {
        expect(postUrl).toBe(submitUrl)
        expect(postBody).toEqual(decision)
        postCallback(response, "success", { status: 200 })
        return postXHR
      }

      var callback = function (error, postResponse) {
        expect(error).toBe(null)
        expect(postResponse).toEqual(response)
        done()
      }

      requester.submit(decision, callback)
    })
  })
})
