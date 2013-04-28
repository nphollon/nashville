resetLabel = 'Reset'
playLabel = 'Play'
welcomeHeader = 'Hello!'

$(document).ready ->
  main = new Main()
  main.run()


class Score
  constructor: (@element) ->

  update: (resultString) ->
    points = if @didUserWin(resultString) then +1 else -1
    @changeBy(points)

  didUserWin: (resultString) ->
    resultString == "You have won"

  changeBy: (points) ->
    @setValue (@getValue() + points)

  setValue: (newValue) ->
    @element.text newValue

  getValue: ->
    Number @element.text()


class Main
  score: new Score $('#score')

  run: ->
    @setHeader welcomeHeader
    @setButtonText playLabel

    $('#action').click (e) =>
      if $('#action').text() == resetLabel
        @setHeader welcomeHeader
        @setButtonText playLabel
      else
        @setButtonText resetLabel
        $.get "/result", @displayResult

  displayResult: (resultString) =>
    @setHeader resultString
    @score.update resultString

  setHeader: (newText) ->
    $('h2').text newText

  setButtonText: (newText) ->
    $('#action').text newText