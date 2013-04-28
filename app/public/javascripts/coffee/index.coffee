reset_label = 'Reset'
play_label = 'Play'
welcome_header = 'Hello!'

$(document).ready ->
  $('h2').text welcome_header
  $('#action').text play_label

  $('#action').click (e) ->
    e.preventDefault()
    if $(this).text() == reset_label
      $(this).text play_label
      $('h2').text welcome_header
    else
      $(this).text reset_label
      $.get("/result", (data) ->
        $('h2').text(data)
      )