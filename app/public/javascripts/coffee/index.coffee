$(document).ready ->
  main = new Main()


class Score
  victoryString: "You have won"

  constructor: (@element) ->
    @setValue 0

  update: (resultString) ->
    points = if @didUserWin(resultString) then +1 else -1
    @changeBy(points)

  didUserWin: (resultString) ->
    resultString == @victoryString

  changeBy: (points) ->
    @setValue (@getValue() + points)

  setValue: (newValue) ->
    @element.text newValue

  getValue: ->
    Number @element.text()


class Button
  resetLabel: 'Reset'
  playLabel: 'Play'

  constructor: (main, @element) ->
    @element.click =>
      if @isResetButton()
        main.reset()
      else
        main.play()

  isResetButton: ->
    @getText() == @resetLabel

  setText: (newText) ->
    @element.text newText

  getText: ->
    @element.text()


class Main
  welcomeHeader: 'Hello!'

  constructor: ->
    @score = new Score $('#score')
    @button = new Button this, $('#action')
    @headerElement = $('h2')
    @reset()

  play: ->
    $.get "/result", (resultString) =>
      @setText resultString, @button.resetLabel
      @score.update resultString

  reset: ->
    @setText @welcomeHeader, @button.playLabel

  setText: (headerText, buttonText) ->
    @headerElement.text headerText
    @button.setText buttonText