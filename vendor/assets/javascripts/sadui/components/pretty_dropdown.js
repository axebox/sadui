/* 
 * Pretty Dropdown
 * 
 * Requires _pretty_dropdown.scss
 *
 * Example DOM:
 * div.pretty-dropdown
 *   select.is-dropdown
 *     option
 *     option.is-href
 *   div.pretty-dropdown-layer
 *     div.pretty-dropdown-label.is-label
 *     span.pretty-dropdown-icon-container
 *       span.pretty-dropdown-icon &gt;
 * 
 * API accessible through $el.data('prettyDropdown')
 *
 * opts Object
 * opts.$el $ DOM Object
 * opts.autoinit Boolean [true]
 */

sadui.pretty_dropdown = function(opts){

    var defaults = {
        autoinit: true
    };

    var conf = $.extend(defaults, opts);

    var $label = $('.is-label', conf.$el);

    var bind = function(){
        $('.is-dropdown', conf.$el).on('change', function(ev){

            var $this = $(this);
            var $item = $('option:selected', $this);
            
            var value = $item.text();

            // update label
            $label.text( value );

            // trigger location if has href
            if ($item.hasClass('is-href')) {
                document.location = $item.val();
            }

            // manage disabled state
            $this.parent()[ ($this.is('[disabled]')) ? 'addClass' : 'removeClass']('is-disabled');

        });
    };

    var update_data = function(){
        conf.$el.data('prettyDropdown', conf);
    };

    var init = function(){
        bind();

        var value = $('.is-dropdown option:selected', conf.$el).text();
        
        // update label
        $label.text( value );
    };

    if (conf.autoinit) {
        init();
    }

    update_data();

    return conf;

};