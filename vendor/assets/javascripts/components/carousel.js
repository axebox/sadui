/* 
 * Carousel
 * Responsive carousel retains grid per carousel item
 *
 * Requires _carousel.scss
 * 
 * @param Object conf generic hash that contains these options:
 * $.Object conf.$container $('.carousel');
 * $.Object conf.$pagination $('.carousel-pagination')
 * $.Object conf.$navigation $('[class^="carousel-navigation"]')
 * $.Object conf.$handle $('.carousel-handle')
 * $.Object conf.$content $('.carousel-content')
 * $.Object conf.$background $('.carousel-background')
 * String conf.orientation orientation of the carousel '[horizontal]|vertical'
 * Integer conf.visibleItems number of visible items per slide
 * Boolean conf.playback [false]
 * Boolean conf.drag [false]
 * @return Object opts internal configuration object
*/

sadui.carousel = function(conf){

    var opts = {};

    var bind = function(){

        // Bind pagination
        if (opts.hasPagination) {

            $('.carousel-pagination-item', opts.$pagination).off('click').on('click', function(ev){
                var ix = $(ev.currentTarget).index();
                set_index( ix );
                jump_to_item(ev);
            });

        }

        // Bind navigation
        if (opts.hasNavigation) {

            opts.$navigation.off('click').on('click', function(ev){
                ev.preventDefault();

                var $this = $(this);

                // abort if disabled
                if ( $this.hasClass('is-disabled') ) return false;

                if ( $this.hasClass('is-carousel-back') ) {

                    set_index('back');

                } else {

                    set_index('forward');

                }

                jump_to_item(ev);

                // Reset playback
                if (opts.hasPlayback) {
                    opts.play();
                }

            });
        }

        // Bind playback
        if (opts.hasPlayback) {
            opts.play();
        }

        // if (opts.hasDrag) {
        //     opts.$content.drags({
        //         direction: opts.orientation,
        //         handle: opts.$handle,
        //         mouseup_callback: drags_mouseup_callback
        //     });
        // }

    };

    var drags_mouseup_callback = function(){
        detect_selected_item();
    };

    // finds visible items and returns leftmost item in carousel viewport
    var detect_selected_item = function(){
        var $visible = $('.carousel-content-item:visible', opts.$content);
        var $element;

        return $element;
    };

    /* 
     * Set the internal index of the left-most carousel item in the viewport
     * @Param directive String back|forward OR....
     * @Param directive Integer carouselID
     */
    var set_index = function(directive){

        if (typeof directive === 'number') {
            opts.index = directive;
        } else {

            switch(directive){
                case 'back':

                    if (opts.visibleItems) {
                        opts.index = opts.index - opts.visibleItems;
                    } else {
                        opts.index--;
                    }

                    break;
                
                case 'forward':

                    if (opts.visibleItems) {
                        opts.index = opts.index + opts.visibleItems;
                    } else {
                        opts.index++;    
                    }

                    break;

                // the carouselID
                default:

                    opts.index = $('.carousel-content-item[data-carousel-item="'+ directive +'"]', opts.$content).index();

                    break;
            }

        }

        if (opts.hasCircular && opts.index > opts.totalItems ) {
            opts.index = 0;
        }

        function get_last_screen(){

            var last_screen;
            var m = (opts.totalItems / opts.visibleItems);
            var screens = Math.ceil(m);
            var differential = screens - m;

            console.log(m, screens, differential);
            return last_screen;
        }

        // index boundaries
        // - set to 0 if its somehow lower than 0
        // - set index to the last slide, which is totalItems - visibleItems
        if (opts.visibleItems > 1) {
            // When there are multiple visible items

            if (opts.index <= 0) {
                opts.index = 0;

            // } else {

                // if ( opts.index >=  ){
                //     opts.index = get_last_screen();
                // }

                // if ( (opts.index >= opts.totalItems) + opts.visibleItems ) {
                // opts.index = opts.totalItems - opts.visibleItems;

            }


        } else {
            // When visibleItem is 1

            if (opts.index <= 0) {
                opts.index = 0;

            } else if ( opts.index >= opts.totalItems ) {
                opts.index = opts.totalItems;

            }

        }

        // should really just use opts.index instead of returning this function
        return opts.index;
    };

    // accepts event object of navigation/pagination item that inititated the event
    var jump_to_item = function(ev){

        if (typeof ev === 'undefined') ev = null;

        var $this = $(this),
            selectedItem = $this.data('carouselItem');

        if (selectedItem) {
            set_index(selectedItem);
        }

        // if (typeof ev.gesture !== 'undefined' && ev.type === 'swipe') {
        //     if (ev.gesture.direction === 'right') {
        //         index = index + 1;

        //     } else if (ev.gesture.direction === 'left') {
        //         index = index - 1;
        //     }

        //     if (index <= 0) {
        //         // show the last item
        //         index = totalItems;

        //     } else if (index >= totalItems) {
        //         // show the first item
        //         index = 0;
        //     }

        //     selectedItem = $('.carousel-content-item', opts.$content).eq( index ).data('carouselItem');
        // }

        // Enable animation capability
        opts.$content.addClass('is-animate');

        refresh_pagination();

        refresh_navigation();

        refresh_content();

        refresh_background();

        update_data();

        // Kill animation capability
        opts.$content.off('transitionend').on('transitionend', function(){
            opts.$content.removeClass('is-animate');

            if (opts.slide_end && typeof opts.slide_end === 'function') {
                opts.slide_end();
            }

            // resume playback
            if (opts.hasPlayback) {
                opts.pause();
                opts.play();
            }

        });

    };

    var refresh_content = function(){
        opts.$content.removeClass (function (index, cssclass) {
            return (cssclass.match (/\bis-selected-item\S+/g) || []).join(' ');
        });
        opts.$content.addClass('is-selected-item-' + opts.index);
        $('.carousel-content-item', opts.$content).removeClass('is-selected');
        $('.carousel-content-item', opts.$content).eq( opts.index ).addClass('is-selected');
    };

    var refresh_navigation = function(){
        if (!opts.hasNavigation) return false;
            
        opts.$navigation.each(function(i,el){

            if ($(this).hasClass('is-carousel-back')) {

                $(this)[(opts.index <= 0) ? 'addClass':'removeClass']('is-disabled');

            } else {

                if (opts.visibleItems > 1) {
                    $(this)[( opts.index + opts.visibleItems >= opts.totalItems ) ? 'addClass':'removeClass']('is-disabled');

                } else {                            
                    $(this)[(opts.index >= opts.totalItems) ? 'addClass':'removeClass']('is-disabled');

                }

            }

        });
    };

    var refresh_pagination = function(){
        if (!opts.hasPagination) return false;

        $('.carousel-pagination-item', opts.$pagination).removeClass('is-selected');
        $('.carousel-pagination-item', opts.$pagination).eq( opts.index ).addClass('is-selected');
    };

    var refresh_background = function(){
        if (!opts.hasBackground) return false;

        $('.carousel-background-item', conf.$background).removeClass('is-selected');
        $('.carousel-background-item.is-index-'+ opts.index, conf.$background).addClass('is-selected');

        $('.carousel-background-item', conf.$background).one('transitionend', function(){
            setTimeout(function(){
                $('.is-selected', conf.$background).remove().insertBefore( $('.carousel-background-item:first', conf.$background) );
            }, Globals.animSpeed / 2);
        });
    };

    opts.play = function(){
        opts.playback_timer = setTimeout(function(){
            set_index('forward');
            jump_to_item();
        }, Globals.baseSpeed*5);
        return 'play';
    };

    opts.pause = function(){
        clearInterval(opts.playback_timer);
        return 'paused';
    };

    opts.forward = function(){
        set_index('forward');
        jump_to_item();
        return 'forward';
    };

    opts.back = function(){
        set_index('back');
        jump_to_item();
        return 'back';
    };

    // expose jump_to_item
    opts.jump_to_item = jump_to_item;

    // snaps the item to the right position 
    var snap_item = function(){

        // jump_to_item();
    };

    var update_data = function(){
        opts.$container.data('carousel', opts);
    };

    // Doesn't work very well
    opts.resetCarousel = function(){

        jump_to_item(null);

        $('.carousel-content-item', opts.$content).removeClass('is-selected')

        opts.$content.removeClass('is-animate');

        opts.$content.removeClass (function (index, cssclass) {
            return (cssclass.match (/\bis-selected-item\S+/g) || []).join(' ');
        });

        opts.$container.removeData('carousel');

        init();
    };

    var init = function(){

        opts.index = 0;
        opts.totalItems = 0;
        opts.totalScreens = 0;
        
        opts = $.extend(conf,opts);

        opts.hasPagination  = (typeof opts.$pagination !== 'undefined' && opts.$pagination.length > 0) ? true:false;
        opts.hasNavigation  = (typeof opts.$navigation !== 'undefined' && opts.$navigation.length > 1) ? true:false;
        opts.hasBackground  = (typeof opts.$background !== 'undefined' && opts.$background.length > 0) ? true:false;
        opts.hasPlayback    = (typeof opts.playback !== 'undefined' && opts.playback === true) ? true:false;
        opts.hasCircular    = (typeof opts.circular !== 'undefined' && opts.circular === true) ? true:false;
        opts.hasDrag        = (typeof opts.drag !== 'undefined' && opts.drag === true) ? true:false;

        if (typeof $('.carousel-content-item', opts.$content) !== 'undefined' && $('.carousel-content-item', opts.$content).length > 0) {
            opts.totalItems = $('.carousel-content-item', opts.$content).length - 1;
        } else {
            opts.totalItems = 0;
        }

        if (opts.visibleItems > 1) {
            opts.totalScreens = Math.ceil( (opts.totalItems / opts.visibleItems) );
        } else {
            opts.totalScreens = opts.totalItems;
        }

        // tab index allows $container to achieve focus event
        opts.$container.attr('tabIndex', '-1');

        // set up background
        // store original index because we'll be moving these elements around and they'll lose their index
        if (opts.hasBackground) {
            $('.carousel-background-item', conf.$background).each(function(i){
                $(this).addClass('is-index-' + i);
            });
        }

        bind();

        refresh_navigation();

        update_data();
    };

    init();

    return opts;

};