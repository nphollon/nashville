(function() {
  var play_label, reset_label, welcome_header;

  reset_label = 'Reset';

  play_label = 'Play';

  welcome_header = 'Hello!';

  $(document).ready(function() {
    $('h2').text(welcome_header);
    $('#action').text(play_label);
    return $('#action').click(function(e) {
      e.preventDefault();
      if ($(this).text() === reset_label) {
        $(this).text(play_label);
        return $('h2').text(welcome_header);
      } else {
        $(this).text(reset_label);
        return $.get("/result", function(data) {
          return $('h2').text(data);
        });
      }
    });
  });

}).call(this);
