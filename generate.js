generate = function() {
  var domain = $('#form-maths').css('display') == 'none' ? 'music' : 'maths';
  var link = domain + '.html#' +
    $('#form').serialize() + '&' +
    $('#form-' + domain).serialize();
  $('#link').attr('href', link);
  $('#link').text(link);
}

showPane = function(name) {
  $('#form-maths').toggle(name == 'maths');
  $('#form-music').toggle(name == 'music');
};

$(document).ready(function() {
  $('#generate').bind('click', generate);
  showPane('maths');
  $('#radioMaths').bind('click', function() { showPane('maths'); });
  $('#radioMusic').bind('click', function() { showPane('music'); });
});
