/*
 * Breakpoints
 * Sets up default template breakpoints
 * Requires Response.js library (Response obj)
 */

// Add $.Callbacks() obj to each breakpoint
$.each(sadui.Globals.breakpoints, function(i,v){
    var name = i;
    v.Callbacks = $.Callbacks('unique');
});

var update_data = function(){
    if (sadui.Globals.debug) $('body').data('Globals', sadui.Globals);
};

// Set up template breakpoints
Response.action(function(){
    
    if (Response.viewportW() <= sadui.Globals.breakpoints.phone.breakpoint) {

        sadui.Globals.breakpoints.device = 'phone';

        // Update DOM
        $('body')
            .removeClass('is-device-desktop')
            .removeClass('is-device-tablet')
            .addClass('is-device-phone');

    } else if (Response.viewportW() <= sadui.Globals.breakpoints.tablet.breakpoint) {

        sadui.Globals.breakpoints.device = 'tablet';

        // Update DOM
        $('body')
            .removeClass('is-device-desktop')
            .addClass('is-device-tablet')
            .removeClass('is-device-phone');

    } else {

        sadui.Globals.breakpoints.device = 'desktop';

        $('body')
            .addClass('is-device-desktop')
            .removeClass('is-device-tablet')
            .removeClass('is-device-phone');
    }
    
    var date = new Date();
    date.setTime( date.getTime()+ 60 * 60 * 24 * 7 ); // 60 seconds to a minute, 60 minutes to an hour, 24 hours to a day, and 7 days

    // if (document.cookie.indexOf("device") >= 0)
    document.cookie='device=' + sadui.Globals.breakpoints.device + '; max-age=' + date.toGMTString() + '; expires=' + date.toGMTString() + '; path=/';

    // Execute registered breakpoint callbacks
    $.each(sadui.Globals.breakpoints, function(name){
        var obj = sadui.Globals.breakpoints[name];

        if (typeof obj.Callbacks === 'object' && sadui.Globals.breakpoints.device === name) {
            obj.Callbacks.fire(obj);
            // console.log('fired ' + name + ', device is ' + sadui.Globals.breakpoints.device);

            update_data();
        }

    });

});