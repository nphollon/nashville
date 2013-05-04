setText = (state) ->
  $('h2').text state.message
  $('#action').text state.actionAvailable
  $('#wager').val state.wager
  $('#score').text state.score

params = ->
  { session_id: $('#session').attr('value'), wager: $('#wager').val() }

play = ->
  $.post "/play", params(), setText

$(document).ready ->
  $('#action').click play