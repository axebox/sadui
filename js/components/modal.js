/*
 * @Param String opts.init_state Set to 'visible' to show modal on load
 * @Param Boolean opts.active Flag to report whether modal is currently active
 */
sadui.modal = function(conf){

    var opts = {
        init_state: 'hidden',
        active:      false
    };

    opts = $.extend(conf,opts);

    var bind = function(){

        // trigger
        if (opts.$container) {
            opts.$container.on('click', opts.triggerClass, function(ev){
                ev.preventDefault();

                show_hide_modal();
            });
        }

        // overlay close
        if (opts.$overlay) {
            opts.$overlay.on('click', function(ev){
                ev.preventDefault();
                opts.close_modal();
            });
        }

        $('body').on('keyup', function(ev){
            ev.preventDefault();

            if (opts.active) {

                switch (ev.keyCode) {
                    // esc
                    case 27:
                        opts.close_modal();
                        break;

                    default:
                        return false;
                }
            }
        });

        // modal UI
        opts.$modal.on('click', '.is-close-trigger', function(ev){
            ev.preventDefault();
            opts.close_modal();
        });

        opts.$modal.on('transitionend', function(ev){

            resize_img();

            if ($.isFunction(opts.callback_aftershow_fn) && opts.callback_aftershow_fn.length > 0 ) {
                
                opts.callback_aftershow_fn;

            }
        });

    };

    var show_hide_modal = function(directive){

        if (typeof directive === 'undefined') {
            directive = 'show';
        }

        if ($.isFunction(opts.callback_beforeshow_fn) && opts.callback_beforeshow_fn.length > 0 ) {
            opts.callback_beforeshow_fn;
        }

        switch (directive) {
            case 'hide':

                opts.active = false;

                opts.$modal.removeClass('is-visible');
                    
                opts.$overlay.removeClass('is-visible');

                break;

            case 'show':

                opts.active = true;

                opts.$modal.addClass('is-visible');

                opts.$overlay.addClass('is-visible');

                break;

        }

    };

    opts.show_modal = function(){
        show_hide_modal('show');
    };

    opts.close_modal = function(){
       show_hide_modal('hide');
    };

    // resize img height if longer than viewport
    // width is covered in css (width:100%, height:auto)
    var resize_img = function(){

/*            $('.modal-content-img', opts.$modal).each(function(){

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

    opts.resize_img = resize_img;

    var bind_resize_img = function(){

        $.each(Globals.breakpoints, function(name){
            var obj = Globals.breakpoints[name];

            if (typeof obj.Callbacks === 'object') {

                obj.Callbacks.add( resize_img );

            }
                
        });

    };

    var update_data = function(){
        opts.$container.data('modal', opts);
    };

    var init = function(){

        bind();
        bind_resize_img();

        if (opts.init_state === 'visible') show_hide_modal();

        update_data();
    };

    init();

};