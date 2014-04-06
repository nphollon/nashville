setText = (state) ->
  $('h2').text state.message
  $('#action').text state.actionAvailable
  $('#wager').val state.wager
  $('#score-player').text state.scores[0]
  $('#score-opponent').text state.scores[1]

play = ->
  params = { session_id: $('#session').attr('value'), wager: $('#wager').val() }
  $.post "/play", params, setText

$(document).ready ->
  $('#action').click play