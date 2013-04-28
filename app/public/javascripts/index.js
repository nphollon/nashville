(function() {
  var Main, Score, playLabel, resetLabel, welcomeHeader,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  resetLabel = 'Reset';

  playLabel = 'Play';

  welcomeHeader = 'Hello!';

  $(document).ready(function() {
    var main;

    main = new Main();
    return main.run();
  });

  Score = (function() {
    function Score(element) {
      this.element = element;
    }

    Score.prototype.update = function(resultString) {
      var points;

      points = this.didUserWin(resultString) ? +1 : -1;
      return this.changeBy(points);
    };

    Score.prototype.didUserWin = function(resultString) {
      return resultString === "You have won";
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

  Main = (function() {
    function Main() {
      this.displayResult = __bind(this.displayResult, this);
    }

    Main.prototype.score = new Score($('#score'));

    Main.prototype.run = function() {
      var _this = this;

      this.setHeader(welcomeHeader);
      this.setButtonText(playLabel);
      return $('#action').click(function(e) {
        if ($('#action').text() === resetLabel) {
          _this.setHeader(welcomeHeader);
          return _this.setButtonText(playLabel);
        } else {
          _this.setButtonText(resetLabel);
          return $.get("/result", _this.displayResult);
        }
      });
    };

    Main.prototype.displayResult = function(resultString) {
      this.setHeader(resultString);
      return this.score.update(resultString);
    };

    Main.prototype.setHeader = function(newText) {
      return $('h2').text(newText);
    };

    Main.prototype.setButtonText = function(newText) {
      return $('#action').text(newText);
    };

    return Main;

  })();

}).call(this);
