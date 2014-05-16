/* 
 * Carousel
 * Responsive carousel retains grid per carousel item
 *
 * Requires _carousel.scss
 * 
 * Example DOM:
    .carousel
        .carousel-navigation-item-back.is-carousel-back
            span.label title="Back" &lt;
        .carousel-navigation-item-forward.is-carousel-forward
            span.label title="Forward" &gt;
        ul.carousel-pagination
            li.carousel-pagination-item data-carousel-item="1"
            li.carousel-pagination-item data-carousel-item="2"
        .carousel-content-wrapper
            ul.carousel-content
                li.carousel-content-item Item 1
                li.carousel-content-item Item 2
            ul.carousel-background
                li.carousel-background-item
                li.carousel-background-item
 *
 * API accessible through $el.data('carousel')
 * 
 * @param Object opts generic hash that contains these options:
 * $.Object opts.$container $('.carousel');
 * $.Object opts.$pagination $('.carousel-pagination')
 * $.Object opts.$navigation $('[class^="carousel-navigation"]')
 * $.Object opts.$handle $('.carousel-handle')
 * $.Object opts.$content $('.carousel-content')
 * $.Object opts.$background $('.carousel-background')
 * String opts.orientation orientation of the carousel '[horizontal]|vertical'
 * Integer opts.visibleItems number of visible items per slide
 * Boolean opts.playback [false]
 * Boolean opts.drag [false]
 * Boolean opts.autoinit [true]
 * @return Object opts internal configuration object
*/

sadui.carousel = function(opts){

    var defaults = {
        index: 0,
        totalItems: 0,
        totalScreens: 0,
        fluid: false,
        autoinit: true
    };

    var conf = $.extend(defaults, opts);

    var bind = function(){

        // Bind pagination
        if (conf.hasPagination) {

            $('.carousel-pagination-item', conf.$pagination).off('click').on('click', function(ev){
                var ix = $(ev.currentTarget).index();
                set_index( ix );
                jump_to_item(ev);
            });

        }

        // Bind navigation
        if (conf.hasNavigation) {

            conf.$navigation.off('click').on('click', function(ev){
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
                if (conf.hasPlayback) {
                    conf.play();
                }

            });
        }

        // Bind playback
        if (conf.hasPlayback) {
            conf.play();
        }

        // if (conf.hasDrag) {
        //     conf.$content.drags({
        //         direction: conf.orientation,
        //         handle: conf.$handle,
        //         mouseup_callback: drags_mouseup_callback
        //     });
        // }

    };

    // var drags_mouseup_callback = function(){
    //     detect_selected_item();
    // };

    // finds visible items and returns leftmost item in carousel viewport
    // var detect_selected_item = function(){
    //     var $visible = $('.carousel-content-item:visible', conf.$content);
    //     var $element;

    //     return $element;
    // };

    /* 
     * Set the internal index of the left-most carousel item in the viewport
     * @Param directive String back|forward OR....
     * @Param directive Integer carouselID
     */
    var set_index = function(directive){

        if (typeof directive === 'number') {
            conf.index = directive;
        } else {

            switch(directive){
                case 'back':

                    if (conf.visibleItems) {
                        conf.index = conf.index - conf.visibleItems;
                    } else {
                        conf.index--;
                    }

                    break;
                
                case 'forward':

                    if (conf.visibleItems) {
                        conf.index = conf.index + conf.visibleItems;
                    } else {
                        conf.index++;    
                    }

                    break;

                // the carouselID
                default:

                    conf.index = $('.carousel-content-item[data-carousel-item="'+ directive +'"]', conf.$content).index();

                    break;
            }

        }

        if (conf.hasCircular && conf.index > conf.totalItems ) {
            conf.index = 0;
        }

        function get_last_screen(){

            var last_screen;
            var m = (conf.totalItems / conf.visibleItems);
            var screens = Math.ceil(m);
            var differential = screens - m;

            console.log(m, screens, differential);
            return last_screen;
        }

        // index boundaries
        // - set to 0 if its somehow lower than 0
        // - set index to the last slide, which is totalItems - visibleItems
        if (conf.visibleItems > 1) {
            // When there are multiple visible items

            if (conf.index <= 0) {
                conf.index = 0;

            // } else {

                // if ( conf.index >=  ){
                //     conf.index = get_last_screen();
                // }

                // if ( (conf.index >= conf.totalItems) + conf.visibleItems ) {
                // conf.index = conf.totalItems - conf.visibleItems;

            }


        } else {
            // When visibleItem is 1

            if (conf.index <= 0) {
                conf.index = 0;

            } else if ( conf.index >= conf.totalItems ) {
                conf.index = conf.totalItems;

            }

        }

        // should really just use conf.index instead of returning this function
        return conf.index;
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

        //     selectedItem = $('.carousel-content-item', conf.$content).eq( index ).data('carouselItem');
        // }

        // Enable animation capability
        conf.$content.addClass('is-animate');

        refresh_pagination();

        refresh_navigation();

        refresh_content();

        refresh_background();

        update_data();

        // Kill animation capability
        conf.$content.off('transitionend').on('transitionend', function(){
            conf.$content.removeClass('is-animate');

            if (conf.slide_end && typeof conf.slide_end === 'function') {
                conf.slide_end();
            }

            // resume playback
            if (conf.hasPlayback) {
                conf.pause();
                conf.play();
            }

        });

    };

    var refresh_content = function(){

        conf.item_width = 0;

        // Set selected fluid cssclass. CSS will handle animation
        if (conf.hasFluid){

            conf.$content.removeClass (function (index, cssclass) {
                return (cssclass.match (/\bis-selected-item\S+/g) || []).join(' ');
            });

            conf.$content.addClass('is-selected-item-' + conf.index);

        }

        // Set left most item in carousel content
        $('.carousel-content-item', conf.$content).removeClass('is-selected');
        $('.carousel-content-item', conf.$content).eq( conf.index ).addClass('is-selected');

        // Adjust content position
        if (!conf.hasFluid){

            // figure out position
            conf.item_width = $('.carousel-content-item', conf.$content).eq(conf.index).outerWidth(true);

            // apply
            conf.$content.css('transform', 'translate3d(-' + conf.item_width * conf.index + 'px, 0, 0)');

        }

    };

    var refresh_navigation = function(){
        if (!conf.hasNavigation) return false;
            
        conf.$navigation.each(function(i,el){

            if ($(this).hasClass('is-carousel-back')) {

                $(this)[(conf.index <= 0) ? 'addClass':'removeClass']('is-disabled');

            } else {

                if (conf.visibleItems > 1) {
                    $(this)[( conf.index + conf.visibleItems >= conf.totalItems ) ? 'addClass':'removeClass']('is-disabled');

                } else {                            
                    $(this)[(conf.index >= conf.totalItems) ? 'addClass':'removeClass']('is-disabled');

                }

            }

        });
    };

    var refresh_pagination = function(){
        if (!conf.hasPagination) return false;

        $('.carousel-pagination-item', conf.$pagination).removeClass('is-selected');
        $('.carousel-pagination-item', conf.$pagination).eq( conf.index ).addClass('is-selected');
    };

    var refresh_background = function(){
        if (!conf.hasBackground) return false;

        $('.carousel-background-item', conf.$background).removeClass('is-selected');
        $('.carousel-background-item.is-index-'+ conf.index, conf.$background).addClass('is-selected');

        $('.carousel-background-item', conf.$background).one('transitionend', function(){
            setTimeout(function(){
                $('.is-selected', conf.$background).remove().insertBefore( $('.carousel-background-item:first', conf.$background) );
            }, Globals.animSpeed / 2);
        });
    };

    conf.play = function(){
        conf.playback_timer = setTimeout(function(){
            set_index('forward');
            jump_to_item();
        }, Globals.baseSpeed*5);
        return 'play';
    };

    conf.pause = function(){
        clearInterval(conf.playback_timer);
        return 'paused';
    };

    conf.forward = function(){
        set_index('forward');
        jump_to_item();
        return 'forward';
    };

    conf.back = function(){
        set_index('back');
        jump_to_item();
        return 'back';
    };

    // expose jump_to_item
    conf.jump_to_item = jump_to_item;

    // snaps the item to the right position 
    var snap_item = function(){

        // jump_to_item();
    };

    var update_data = function(){
        conf.$container.data('carousel', conf);
    };

    conf.resetCarousel = function(){

        jump_to_item(null);

        $('.carousel-content-item', conf.$content).removeClass('is-selected')

        conf.$content.removeClass('is-animate');

        conf.$content.removeClass (function (index, cssclass) {
            return (cssclass.match (/\bis-selected-item\S+/g) || []).join(' ');
        });

        conf.$container.removeData('carousel');

        init();
    };

    var init = function(){

        conf.hasPagination  = (typeof conf.$pagination !== 'undefined' && conf.$pagination.length > 0) ? true:false;
        conf.hasNavigation  = (typeof conf.$navigation !== 'undefined' && conf.$navigation.length > 1) ? true:false;
        conf.hasBackground  = (typeof conf.$background !== 'undefined' && conf.$background.length > 0) ? true:false;
        conf.hasPlayback    = (typeof conf.playback !== 'undefined' && conf.playback === true) ? true:false;
        conf.hasCircular    = (typeof conf.circular !== 'undefined' && conf.circular === true) ? true:false;
        conf.hasFluid       = (typeof conf.fluid !== 'undefined' && conf.fluid === true) ? true:false;
        // conf.hasDrag        = (typeof conf.drag !== 'undefined' && conf.drag === true) ? true:false;

        if (typeof $('.carousel-content-item', conf.$content) !== 'undefined' && $('.carousel-content-item', conf.$content).length > 0) {
            conf.totalItems = $('.carousel-content-item', conf.$content).length - 1;
        } else {
            conf.totalItems = 0;
        }

        if (conf.visibleItems > 1) {
            conf.totalScreens = Math.ceil( (conf.totalItems / conf.visibleItems) );
        } else {
            conf.totalScreens = conf.totalItems;
        }

        // tab index allows $container to achieve focus event
        conf.$container.attr('tabIndex', '-1');

        // set up background
        // store original index because we'll be moving these elements around and they'll lose their index
        if (conf.hasBackground) {
            $('.carousel-background-item', conf.$background).each(function(i){
                $(this).addClass('is-index-' + i);
            });
        }

        bind();

        refresh_navigation();

        update_data();
    };

    conf.init = init();

    if (conf.autoinit) {
        init();
    }

    return conf;

};