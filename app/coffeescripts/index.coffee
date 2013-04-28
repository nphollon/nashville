$(document).ready ->
  $('#action').click (e) ->
    e.preventDefault()
    if $(this).text() == 'OK'
      $(this).text 'Deal'
      $('h2').text 'Hello!'
    else
      $(this).text 'OK'
      $.get("/result", (data) ->
        $('h2').text(data)
      )