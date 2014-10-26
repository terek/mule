generate = function() {
  var link = 'index.html#' + $('#form').serialize();
  $('#link').attr('href', link);
  $('#link').text(link);
}

$(document).ready(function() {
  $('#generate').bind('click', generate);
});
