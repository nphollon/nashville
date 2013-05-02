(function() {
  var play, sessionAsParam, setText;

  sessionAsParam = {
    session_id: $('#session').attr('value')
  };

  setText = function(state) {
    $('h2').text(state.message);
    $('#action').text(state.actionAvailable);
    return $('#score').text(state.score);
  };

  play = function() {
    return $.post("/play", sessionAsParam, setText);
  };

  $(document).ready(function() {
    return $('#action').click(play);
  });

}).call(this);
