$(document).ready ->
  $('#action').click (e) ->
    e.preventDefault()
    if $(this).text() == 'OK'
      $(this).text 'Deal'
      $('h2').text 'Click to win or lose.'
    else
      $(this).text 'OK'
      $.get("/result", (data) ->
        $('h2').text(data)
      )