$(function(){

  var pretty_checkradio = new sadui.pretty_checkradio({
    $el: $('.pretty-checkradio')
  });

  var pretty_dropdown_example_1 = new sadui.pretty_dropdown({
    $el: $('.pretty-dropdown-example-1', '#pretty_dropdown_view')
  });

  var pretty_dropdown_example_2 = new sadui.pretty_dropdown({
    $el: $('.pretty-dropdown-example-2', '#pretty_dropdown_view')
  });

  var modal = new sadui.modal({
    $container: $('#modal_view'),
    $overlay: $('.overlay')
  });

});