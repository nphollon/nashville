setText = (state) ->
  $('h2').text state.message
  $('#action').text state.actionAvailable
  $('#score').text state.score

getStateAndUpdateDOM = (path) ->
  $.get path, {session_id: $('#session').attr("value")}, setText

play = ->
  getStateAndUpdateDOM "/play"

initialize = ->
  getStateAndUpdateDOM "/init"

$(document).ready ->
  initialize()
  $('#action').click play