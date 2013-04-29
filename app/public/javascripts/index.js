(function() {
  var Button, Main, Score;

  $(document).ready(function() {
    var main;

    return main = new Main();
  });

  Score = (function() {
    Score.prototype.victoryString = "You have won";

    function Score(element) {
      this.element = element;
      this.setValue(0);
    }

    Score.prototype.update = function(resultString) {
      var points;

      points = this.didUserWin(resultString) ? +1 : -1;
      return this.changeBy(points);
    };

    Score.prototype.didUserWin = function(resultString) {
      return resultString === this.victoryString;
    };

    Score.prototype.changeBy = function(points) {
      return this.setValue(this.getValue() + points);
    };

    Score.prototype.setValue = function(newValue) {
      return this.element.text(newValue);
    };

    Score.prototype.getValue = function() {
      return Number(this.element.text());
    };

    return Score;

  })();

  Button = (function() {
    Button.prototype.resetLabel = 'Reset';

    Button.prototype.playLabel = 'Play';

    function Button(main, element) {
      var _this = this;

      this.element = element;
      this.element.click(function() {
        if (_this.isResetButton()) {
          return main.reset();
        } else {
          return main.play();
        }
      });
    }

    Button.prototype.isResetButton = function() {
      return this.getText() === this.resetLabel;
    };

    Button.prototype.setText = function(newText) {
      return this.element.text(newText);
    };

    Button.prototype.getText = function() {
      return this.element.text();
    };

    return Button;

  })();

  Main = (function() {
    Main.prototype.welcomeHeader = 'Hello!';

    function Main() {
      this.score = new Score($('#score'));
      this.button = new Button(this, $('#action'));
      this.headerElement = $('h2');
      this.reset();
    }

    Main.prototype.play = function() {
      var _this = this;

      return $.get("/result", function(resultString) {
        _this.setText(resultString, _this.button.resetLabel);
        return _this.score.update(resultString);
      });
    };

    Main.prototype.reset = function() {
      return this.setText(this.welcomeHeader, this.button.playLabel);
    };

    Main.prototype.setText = function(headerText, buttonText) {
      this.headerElement.text(headerText);
      return this.button.setText(buttonText);
    };

    return Main;

  })();

}).call(this);
