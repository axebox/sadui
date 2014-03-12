/* 
 * Pretty Check Radio
 * 
 * Requires _pretty_checkradio.scss
 *
 * Example DOM:
 * div.pretty-checkradio
 *   span.pretty-checkradio-layer
 *   input.is-input
 * 
 * API accessible through $el.data('prettyCheckRadio')
 *
 * opts Object
 * opts.$el $ DOM Object
 * opts.autoinit Boolean [true]
 */

sadui.pretty_checkradio = function(opts){

    var defaults = {
        autoinit: true
    };

    var conf = $.extend(defaults, opts);

    var bind = function(){

        conf.$el.each(function(){

            var $this = $(this);

            $('.is-input', $this).on('change', function(ev){

                var _$this = $(this);

                if (_$this.attr('disabled')) return false;

                var $group = $('[name='+_$this.attr('name')+']', conf.$el);

                if ($group.length > 1) {

                    $group.parent().removeClass('is-selected');
                    $this.addClass('is-selected');

                } else {

                    // checkbox|single
                    $this[ (this.checked) ? 'addClass' : 'removeClass']('is-selected');

                }
                
                // manage disabled state
                _$this.parent()[ (_$this.is('[disabled]')) ? 'addClass' : 'removeClass']('is-disabled');

                update_data();

                return true;

            });

        });
    };

    var update_data = function(){
        conf.$el.data('prettyCheckRadio', conf);
    };

    var init = function(){
        bind();
        
        $('.is-input', conf.$el).each(function(ev){
            var $this = $(this);

            $this.parent()[ ($this.is(':disabled')) ? 'addClass' : 'removeClass']('is-disabled');
        });

    };

    if (conf.autoinit) {
        init();
    }

    update_data();

    return conf;

};