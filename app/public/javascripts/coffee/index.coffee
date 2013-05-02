sessionAsParam = { session_id: $('#session').attr('value') }

setText = (state) ->
  $('h2').text state.message
  $('#action').text state.actionAvailable
  $('#score').text state.score

play = ->
  $.get "/play", sessionAsParam, setText

$(document).ready ->
  $('#action').click play