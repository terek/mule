generate = function() {
  var link = 'mule.html#' + $('#form').serialize();
  $('#link').attr('href', link);
  $('#link').text(link);
}

$(document).ready(function() {
  $('#generate').bind('click', generate);
});
