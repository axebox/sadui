/*
 * Modal
 * Will show/hide a modal and overlay, and nothing else. 
 * 
 * Requires _overlay.scss, _modal.scss
 * 
 * Example DOM:
 * div.modal
 * 
 * div.overlay (recommended placement bottommost in DOM)
 *
 * API accessible through $container.data('modal')
 *
 * @Param Object opts
 * @Param String opts.init_state Set to 'visible' to show modal on load
 * @Param Boolean opts.active Flag to report whether modal is currently active
 */

sadui.modal = function(opts){

    var defaults = {
        autoinit:       true,
        init_state:     'hidden',
        position:       'center',
        active:         false,
        triggerClass:   '.is-modal-trigger',
        $modals:        {},
        show_count:     0
    };

    var conf = $.extend(defaults, opts);

    var bind = function(){

        // trigger
        if (conf.$container) {
            conf.$container.on('click', conf.triggerClass, function(ev){
                ev.preventDefault();

                // set modal
                conf.$current_modal = $($(this).data('modalRel'));
                update_data();

                show_hide_modal();
            });
        }

        // overlay close
        if (conf.$overlay) {
            conf.$overlay.on('click', function(ev){
                ev.preventDefault();
                conf.close_modal();
            });
        }

        $('body').on('keyup', function(ev){
            ev.preventDefault();

            if (conf.active) {

                switch (ev.keyCode) {
                    // esc
                    case 27:
                        conf.close_modal();
                        break;

                    default:
                        return false;
                }
            }
        });

        // modal UI
        $.each(conf.$modals, function(){

            var $this = $(this);

            $this.on('click', '.is-modal-close-trigger', function(ev){
                ev.preventDefault();
                conf.close_modal();
            });

            $this.on('transitionend', function(ev){

                resize_img();

                if ($.isFunction(conf.callback_aftershow_fn) && conf.callback_aftershow_fn.length > 0 ) {
                    
                    conf.callback_aftershow_fn;

                }
            });

        });


    };

    var show_hide_modal = function(directive){

        var data = conf.$container.data('modal');

        if (typeof directive === 'undefined') {
            directive = 'show';
        }

        if ($.isFunction(conf.callback_beforeshow_fn) && conf.callback_beforeshow_fn.length > 0 ) {
            conf.callback_beforeshow_fn;
        }

        // Just referencing offset is supposed to resolve css animation issues
        if (typeof data.$current_modal !== 'undefined' && data.$current_modal.length > 0) {
            data.$current_modal.offset().height;
        }

        switch (directive) {
            case 'hide':

                conf.active = false;

                data.$current_modal
                    .removeClass('is-visible')
                    .css('top', 'inherit');
                    
                conf.$overlay.removeClass('is-visible');

                break;

            case 'show':

                conf.active = true;

                data.$current_modal.addClass('is-visible');

                conf.position_modal();

                conf.$overlay.addClass('is-visible');

                conf.show_count++;

                break;

        }

    };

    // vertically center position modal
    // can expand this feature to support custom positioning at a later date
    conf.position_modal = function(directive){

        var data = conf.$container.data('modal');

        var css = {}

        if (typeof directive === 'undefined') {
            directive = 'css';
        }

        if (conf.show_count < 1) {
            directive = 'css';
        }

        switch (conf.position) {

            case "center":

                modal_height = data.$current_modal.outerHeight(true);
                viewport_height = $(window).height();

                css.top = Math.floor(((viewport_height / 2) - (modal_height / 2)) / 2);

                break;

            case "absolutecenter":

                modal_height = data.$current_modal.outerHeight(true);
                viewport_height = $(window).height();

                css.top = Math.floor((viewport_height / 2) - (modal_height / 2));

                break;

        }

        // Apply Position
        data.$current_modal[directive](css);

    };

    conf.show_modal = function(modal_id){

        // target internal modal 
        conf.$current_modal = conf.$modals[modal_id];

        show_hide_modal('show');
    };

    conf.close_modal = function(modal_id){
        show_hide_modal('hide');
    };

    // resize img height if longer than viewport
    // width is covered in css (width:100%, height:auto)
    var resize_img = function(){

/*            $('.modal-content-img', conf.$modal).each(function(){

            var $this       = $(this);
            
            // store original dimensions in DOM
            $this.attr('original-height', $this.attr('height')).attr('original-width', $this.attr('width'));
            $this.removeAttr('height').removeAttr('width');

            var height      = parseInt($this.attr('original-height')),
                width       = parseInt($this.attr('original-width')),
                vp_height   = $('body').outerHeight(),
                vp_width    = $('body').outerWidth(),
                css         = {};

            if ($(this).outerHeight() > vp_height) {
                console.log('height');
                css = {
                    'width':   width * Math.round($(this).outerHeight() / height),
                    'height':  '100%'
                };

            } else {
                console.log('width');
                css = {
                    'width':   '100%',
                    'height':  height * Math.round($(this).outerWidth() / width)
                };
            }

            // resize DOM element
            $this.css(css);
            
        });*/

    };

    conf.resize_img = resize_img;

    var bind_resize_img = function(){

        $.each(Globals.breakpoints, function(name){
            var obj = Globals.breakpoints[name];

            if (typeof obj.Callbacks === 'object') {

                obj.Callbacks.add( resize_img );

            }
                
        });

    };

    var update_data = function(){
        conf.$container.data('modal', conf);
    };

    var init = function(){

        // Collect modals
        $('[data-modal-rel]', conf.$container).each(function(i){
            var modal_id = $(this).data('modalRel');

            conf.$modals[modal_id] = $(modal_id);
        });

        bind();
        bind_resize_img();

        if (conf.init_state === 'visible') show_hide_modal();

        update_data();
    };

    // expose init
    conf.init = init();

    if (conf.autoinit) {
        init();
    }

    // provide interface on object
    return conf;

};