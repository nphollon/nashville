(function() {
  var params, play, setText;

  setText = function(state) {
    $('h2').text(state.message);
    $('#action').text(state.actionAvailable);
    $('#wager').val(state.wager);
    $('#score-player').text(state.scores[0]);
    return $('#score-opponent').text(state.scores[1]);
  };

  params = function() {
    return {
      session_id: $('#session').attr('value'),
      wager: $('#wager').val()
    };
  };

  play = function() {
    return $.post("/play", params(), setText);
  };

  $(document).ready(function() {
    return $('#action').click(play);
  });

}).call(this);
