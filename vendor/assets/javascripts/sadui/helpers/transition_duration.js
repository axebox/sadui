/* 
 * Transition Duration
 * Retrievs the total amount of time, in miliseconds that
 * an element will be transitioned
 * 
 * opts Object
 * opts.$el $ DOM Object
 */

sadui.transition_duration = function(opts){

    var defaults = {
        properties: [
            'transition-duration',
            '-webkit-transtion-duration',
            '-moz-transtion-duration',
            '-ms-transtion-duration',
            '-o-transtion-duration',
        ]
    };

    var conf = $.extend(defaults, opts);

    var get_duration = function(property){
        return Math.round(parseFloat(conf.$el.css( property )) * 1000);
    };

    for (var i = conf.properties.length - 1; i >= 0; i--) {
        var prop = conf.properties[i];
        if (prop === 'transition-duration') {
            return get_duration('transition-duration');
        } else {
            return get_duration( prop );
        }
    };

    // check the main transition duration property
    // if (conf.$el.css('transition-duration')) {

    //     return get_duration('transition-duration');
    
    // // check the vendor transition duration properties
    // } else {

    //     if (conf.$el.css('-webkit-transtion-duration')) {
    //         return get_duration('-webkit-transtion-duration');
    //     }

    //     if (conf.$el.css('-moz-transtion-duration')) {
    //         return get_duration('-moz-transtion-duration');
    //     }

    //     if (conf.$el.css('-ms-transtion-duration')) {
    //         return get_duration('-ms-transtion-duration');
    //     }

    //     if (conf.$el.css('-o-transtion-duration')) {
    //         return get_duration('-o-transtion-duration');
    //     }
    // }

    // no transition duration was found, return 0
    return 0;

};