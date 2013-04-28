(function() {
  $(document).ready(function() {
    return $('#action').click(function(e) {
      e.preventDefault();
      if ($(this).text() === 'OK') {
        $(this).text('Deal');
        return $('h2').text('Click to win or lose.');
      } else {
        $(this).text('OK');
        return $.get("/result", function(data) {
          return $('h2').text(data);
        });
      }
    });
  });

}).call(this);