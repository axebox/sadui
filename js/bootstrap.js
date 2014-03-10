/*
 * Bootstrap
 * Requires: jquery, response
 */

// Add $.Callbacks() obj to each breakpoint
$.each(Globals.breakpoints, function(i,v){
    var name = i;
    v.Callbacks = $.Callbacks('unique');
});

var update_data = function(){
    if (Globals.debug) $('body').data('Globals', Globals);
};

// Set up template breakpoints
Response.action(function(){
    
    if (Response.viewportW() <= Globals.breakpoints.phone.breakpoint) {

        Globals.breakpoints.device = 'phone';

        // Update DOM
        $('body')
            .removeClass('is-device-desktop')
            .removeClass('is-device-tablet')
            .addClass('is-device-phone');

    } else if (Response.viewportW() <= Globals.breakpoints.tablet.breakpoint) {

        Globals.breakpoints.device = 'tablet';

        // Update DOM
        $('body')
            .removeClass('is-device-desktop')
            .addClass('is-device-tablet')
            .removeClass('is-device-phone');

    } else {

        Globals.breakpoints.device = 'desktop';

        $('body')
            .addClass('is-device-desktop')
            .removeClass('is-device-tablet')
            .removeClass('is-device-phone');
    }
    
    var date = new Date();
    date.setTime( date.getTime()+ 60 * 60 * 24 * 7 ); // 60 seconds to a minute, 60 minutes to an hour, 24 hours to a day, and 7 days

    // if (document.cookie.indexOf("device") >= 0)
    document.cookie='device=' + Globals.breakpoints.device + '; max-age=' + date.toGMTString() + '; expires=' + date.toGMTString() + '; path=/';

    // Execute registered breakpoint callbacks
    $.each(Globals.breakpoints, function(name){
        var obj = Globals.breakpoints[name];

        if (typeof obj.Callbacks === 'object' && Globals.breakpoints.device === name) {
            obj.Callbacks.fire(obj);
            // console.log('fired ' + name + ', device is ' + Globals.breakpoints.device);

            update_data();
        }

    });

});


// window.scroll $.Callbacks
Globals.scroll = $.Callbacks('unique');

// Bind window.scroll and fire all callbacks
$(window).on('scroll', function(ev){

    var fire_scroll_callbacks = function(ev){
        Globals.scroll.fire(ev);
        update_data();
    };

    fire_scroll_callbacks(ev);

});