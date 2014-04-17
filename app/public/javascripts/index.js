var setText = function (state) {
  $('h2').text(state.message);
  $('#action').text(state.actionAvailable);
  $('#wager').val(state.wager);
  return $('#score').text(state.score);
};

var params = function () {
  return {
    session_id: $('#session').attr('value'),
    wager: $('#wager').val()
  };
};

var play = function () {
  return $.post("/play", params(), setText);
};

var aFunction = function () { return 5; };

$(document).ready(function () {
  return $('#action').click(play);
});