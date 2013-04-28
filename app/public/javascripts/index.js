(function() {
  $(document).ready(function() {
    return $('#action').click(function(e) {
      e.preventDefault();
      if ($(this).text() === 'Reset') {
        $(this).text('Play');
        return $('h2').text('Hello!');
      } else {
        $(this).text('Reset');
        return $.get("/result", function(data) {
          return $('h2').text(data);
        });
      }
    });
  });

}).call(this);
