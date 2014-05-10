describe("The requester", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var mock = helpers.mock
  var requesterFactory = helpers.requireSource("client/requester")

  var jQuery, requestUrl, submitUrl, requester

  beforeEach(function () {
    jQuery = mock(["post"])
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
      
      jQuery.post.and.callFake(function (postUrl, postBody, postCallback) {
        expect(postUrl).toBe(requestUrl)
        expect(postBody).toEqual({})
        postCallback(response)
      })

      var callback = function (postResponse) {
        expect(postResponse).toEqual(response)
        done()
      }

      requester.request(callback)
    })
  })

  describe("submitting a decision", function () {
    it("posts the decision to the submit url", function (done) {
      var decision = { decision: "value" }
      var response = { key: "value" }

      jQuery.post.and.callFake(function (postUrl, postBody, postCallback) {
        expect(postUrl).toBe(submitUrl)
        expect(postBody).toEqual(decision)
        postCallback(response)
      })

      var callback = function (postResponse) {
        expect(postResponse).toEqual(response)
        done()
      }

      requester.submit(decision, callback)
    })
  })
})