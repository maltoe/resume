function update_language_graph(languages) {
  $(languages).each(function(idx, language) {
    var elem = $("#language-" + language['selector']);
    elem.css('background', '-webkit-linear-gradient(left, #ccc 0%, #fff ' + language['percentage'] + ')');
    elem.css('background', '-moz-linear-gradient(left, #ccc 0%, #fff ' + language['percentage'] + ')');
    elem.css('background', '-o-linear-gradient(left, #ccc 0%, #fff ' + language['percentage'] + ')');
    elem.css('background', 'linear-gradient(left, #ccc 0%, #fff ' + language['percentage'] + ')');
  });
}
