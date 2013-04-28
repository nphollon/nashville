$(document).ready ->
  $('#action').click (e) ->
    e.preventDefault()
    if $(this).text() == 'Reset'
      $(this).text 'Play'
      $('h2').text 'Hello!'
    else
      $(this).text 'Reset'
      $.get("/result", (data) ->
        $('h2').text(data)
      )