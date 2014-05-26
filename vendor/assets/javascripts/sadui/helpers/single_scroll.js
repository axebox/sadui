/*
 * Allows for single window.scroll bound events
 * window.scroll $.Callbacks
 */
sadui.Globals.scroll = $.Callbacks('unique');

// Bind window.scroll and fire all callbacks
$(window).on('scroll', function(ev){

    var fire_scroll_callbacks = function(ev){
        sadui.Globals.scroll.fire(ev);
        update_data();
    };

    fire_scroll_callbacks(ev);

});