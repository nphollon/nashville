(function() {
  var getStateAndUpdateDOM, initialize, play, setText;

  setText = function(state) {
    $('h2').text(state.message);
    $('#action').text(state.actionAvailable);
    return $('#score').text(state.score);
  };

  getStateAndUpdateDOM = function(path) {
    return $.get(path, setText);
  };

  play = function() {
    return getStateAndUpdateDOM("/play");
  };

  initialize = function() {
    return getStateAndUpdateDOM("/init");
  };

  $(document).ready(function() {
    initialize();
    return $('#action').click(play);
  });

}).call(this);
