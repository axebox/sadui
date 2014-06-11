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
 *
 * $.Object opts.$container $('.carousel');
 * $.Object opts.$pagination $('.carousel-pagination')
 * $.Object opts.$navigation $('[class^="carousel-navigation"]')
 * $.Object opts.$handle $('.carousel-handle')
 * $.Object opts.$content $('.carousel-content')
 * $.Object opts.$background $('.carousel-background')
 *
 * String opts.orientation orientation of the carousel '[horizontal]|vertical'
 * Integer opts.visibleItems number of visible items per slide
 * Boolean opts.playback [false]
 * //Boolean opts.drag [false]
 * Boolean opts.paginationPages [false]
 * Boolean opts.autoinit [true]
 *
 * Function opts.callback_beforeslide_fn the function to be called before slide is finished
 * Function opts.callback_afterslide_fn the function to be called after slide is finished
 *
 * @return Object opts internal configuration object
*/

sadui.carousel = function(opts){

    var defaults = {
        index: 0,
        totalItems: 0,
        totalScreens: 0,
        paginationPages: false,
        fluid: false,
        autoinit: true
    };

    var conf = $.extend(defaults, opts);

    var bind = function(){

        // Bind pagination
        if (conf.hasPagination) {

            $('.carousel-pagination-item', conf.$pagination).off('click').on('click', function(ev){

                // item index
                var ix = $(ev.currentTarget).index();

                // page index
                if (conf.hasPaginationPages && conf.visibleItems) {
                    ix = ix * conf.visibleItems;
                } 

                set_index( ix );
                set_page();
                jump_to_item(ev);

            });

        }

        // Bind navigation
        if (conf.hasNavigation) {

            conf.$navigation.off('click').on('click', function(ev){
                ev.preventDefault();
                ev.stopPropagation();

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

    // sets conf.page
    var set_page = function(){

        // abort if no pages
        if (!conf.hasPaginationPages) return false;

        var page = 1;
        for (var i = conf.visibleItems; i < conf.totalItems; i+=conf.visibleItems) {
            if (conf.index < i ) {
                break;
            }
            page++;
        }

        conf.page = page;

        return page;
    };

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

                    set_page();

                    break;
                
                case 'forward':

                    if (conf.visibleItems) {
                        conf.index = conf.index + conf.visibleItems;
                    } else {
                        conf.index++;    
                    }

                    set_page();

                    break;

                // the carouselID
                default:

                    conf.index = $('.carousel-content-item[data-carousel-item="'+ directive +'"]', conf.$content).index();

                    set_page();

                    break;
            }

        }

        // circular
        // sets index to first item or last item

        // works
        if (conf.hasCircular && !conf.hasPaginationPages && conf.index > conf.totalItems) {
            conf.index = 0;
        }

        if (conf.hasCircular && conf.hasPaginationPages) {

            // if first item, set to last item
            if (conf.index < 0) {
                conf.index = conf.totalItems -1;
                conf.page = conf.totalScreens;

            // if last item, set to first item
            } else if (conf.index > conf.totalItems) {
                conf.index = 0;
                conf.page = 1;
            }
        }

        // index boundaries
        // - set to 0 if its somehow lower than 0
        // - set index to the last slide, which is totalItems - visibleItems
        if (conf.visibleItems > 1) {

            // When there are multiple visible items
            if (conf.index <= 0 && !conf.hasCircular) {
                conf.index = 0;
            }

            // adjust index for last pages
            if (conf.hasPaginationPages && conf.page === conf.totalScreens) {

                conf.index = conf.index - (conf.visibleItems - conf.lastScreenItems) - 1;
            }
        }

        // When visibleItem is 1
        if (conf.visibleItems <= 1) {

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

            if ($.isFunction(conf.callback_afterslide_fn)) {
                conf.callback_afterslide_fn();
            }

        });

    };

    var refresh_content = function(){

        conf.item_width = 0;

        if ($.isFunction(conf.callback_beforeslide_fn)) {
            conf.callback_beforeslide_fn();
        }

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

            var prop = '-' + conf.item_width * conf.index + 'px';

            // apply
            if (Modernizr.csstransforms3d) {
                conf.$content.css({
                    transform: 'translate3d(' + prop + ', 0, 0)'
                })
            } else {
                conf.$content.animate({
                    left: prop
                });
            }
        }

    };

    var refresh_navigation = function(){
        if (!conf.hasNavigation || conf.hasCircular) return false;
            
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

        if (conf.hasPaginationPages && conf.visibleItems) {
            $('.carousel-pagination-item', conf.$pagination).eq( conf.page-1 ).addClass('is-selected');
        } else {
            $('.carousel-pagination-item', conf.$pagination).eq( conf.index * conf.visibleItems ).addClass('is-selected');
        }
    };

    // constructs pagination items
    var build_pagination = function(){
        if (!conf.hasPaginationPages) return false;

        $('.carousel-pagination-item', conf.$pagination).removeClass('is-selected');

        var pagination_items = [];
        for (var i = conf.totalScreens - 1; i >= 0; i--) {
            pagination_items.push( $('.carousel-pagination-item', conf.$pagination).eq(0).clone() );
        }

        // empty pagination items
        conf.$pagination.empty();

        // build pagination items from num pages
        $.each(pagination_items, function(i,v){
            conf.$pagination.append(pagination_items[i]);
        });

        // set selected pagination item
        $('.carousel-pagination-item', conf.$pagination).eq(conf.page).addClass('is-selected');
    };

    var refresh_background = function(){
        if (!conf.hasBackground) return false;

        $('.carousel-background-item', conf.$background).removeClass('is-selected');
        $('.carousel-background-item.is-index-'+ conf.index, conf.$background).addClass('is-selected');

        $('.carousel-background-item', conf.$background).one('transitionend', function(){
            setTimeout(function(){
                $('.is-selected', conf.$background).remove().insertBefore( $('.carousel-background-item:first', conf.$background) );
            }, sadui.Globals.animSpeed / 2);
        });
    };

    conf.play = function(){
        conf.playback_timer = setTimeout(function(){
            set_index('forward');
            jump_to_item();
        }, sadui.Globals.baseSpeed*5);
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

        conf.hasPagination          = (typeof conf.$pagination !== 'undefined' && conf.$pagination.length > 0) ? true:false;
        conf.hasPaginationPages     = (typeof conf.paginationPages !== 'undefined' && conf.paginationPages === true) ? true:false;
        conf.hasNavigation          = (typeof conf.$navigation !== 'undefined' && conf.$navigation.length > 1) ? true:false;
        conf.hasBackground          = (typeof conf.$background !== 'undefined' && conf.$background.length > 0) ? true:false;
        conf.hasPlayback            = (typeof conf.playback !== 'undefined' && conf.playback === true) ? true:false;
        conf.hasCircular            = (typeof conf.circular !== 'undefined' && conf.circular === true) ? true:false;
        conf.hasFluid               = (typeof conf.fluid !== 'undefined' && conf.fluid === true) ? true:false;
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

        if (conf.hasPaginationPages) {
            
            conf.lastScreenItems = (conf.totalScreens * conf.visibleItems) - (conf.totalItems+2);
            
            // default
            conf.page = 0;

            // calculates items on last screen
            conf.lastScreenItems = (conf.visibleItems * conf.totalScreens) - (conf.totalItems+1);
        }

        // tab index allows $container to achieve focus event
        // conf.$container.attr('tabIndex', '-1');

        // set up background
        // store original index because we'll be moving these elements around and they'll lose their index
        if (conf.hasBackground) {
            $('.carousel-background-item', conf.$background).each(function(i){
                $(this).addClass('is-index-' + i);
            });
        }
        var d = 0;
        build_pagination();

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