$(function(){

  var $view;

  (function(){

    $view = $('#pretty_checkradio_view');

    var pretty_checkradio = new sadui.pretty_checkradio({
      $el: $('.pretty-checkradio', $view)
    });

  })();

  (function(){

    $view = $('#pretty_dropdown_view');

    var pretty_dropdown_example_1 = new sadui.pretty_dropdown({
      $el: $('.pretty-dropdown-example-1', $view)
    });

  })();

  (function(){

    $view = $('#pretty_dropdown_view');

    var pretty_dropdown_example_2 = new sadui.pretty_dropdown({
      $el: $('.pretty-dropdown-example-2', $view)
    });

  })();

  (function(){

    $view = $('#loader_view');

    $('#loader_example_single li', $view).each(function(){
      var $this, $img, loader, promise, src;

      $this = $(this);

      $img = $('[data-preload]', $this);

      loader = new sadui.loader();
      // images = new sadui.loader({
      //   $container: $('#loader_example_single')
      // });

      src = $img.data('preload');

      promise = loader.load_image( src );

      // When assets have loaded
      promise.done(function(d){
        $img.attr('src', src);
      });

      promise.fail(function(d){
        console.log('asset failed', d);
      });


    });

  })();

  (function(){

    $view = $('#modal_view');

    var modal = new sadui.modal({
      $container: $view,
      $overlay: $('.overlay')
    });

  })();

  (function(){

    $view = $('#carousel_view');

    var carousel_example_base = new sadui.carousel({
      $container: $('#carousel_example_base'),
      $pagination: $('.carousel-pagination', '#carousel_example_base'),
      $navigation: $('[class^="carousel-navigation"]', '#carousel_example_base'),
      $content: $('.carousel-content', '#carousel_example_base'),
      $background: $('.carousel-background', '#carousel_example_base'),
      orientation: 'horizontal',
      visibleItems: 4,
      playback: false
    });

    var carousel_example_fluid = new sadui.carousel({
      $container: $('#carousel_example_fluid'),
      $pagination: $('.carousel-pagination', '#carousel_example_fluid'),
      $navigation: $('[class^="carousel-navigation"]', '#carousel_example_fluid'),
      $content: $('.carousel-content', '#carousel_example_fluid'),
      $background: $('.carousel-background', '#carousel_example_fluid'),
      orientation: 'horizontal',
      visibleItems: 4,
      fluid: true,
      playback: false
    });

  })();

});