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
 *   div.pretty-dropdown-layer.is-menu-trigger
 *     div.pretty-dropdown-label.is-label
 *     span.pretty-dropdown-icon-container
 *       span.pretty-dropdown-icon &gt;
 *   div.pretty-dropdown-menu
 *     ul.is-menu
 * 
 * You may like to prepopulate .is-label element on server output
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

    conf.$label = $('.is-label', conf.$el);
    conf.$dropdown = $('.is-dropdown', conf.$el);

    conf.$menu = $('.is-menu', conf.$el);
    conf.hasMenu = (conf.$menu && typeof conf.$menu === 'object' && conf.$menu.length > 0) ? true : false;
    conf.menu_state = 'closed';

    var bind = function(){

        // Bind <select> dropdown 
        conf.$dropdown.on('change', function(ev){

            if (conf.hasMenu) {
                ev.preventDefault();
            }

            var $this = $(this);
            var $item = $('option:selected', $this);
            
            var value = $item.text();

            // update label
            update_label();
            // conf.$label.text( value );

            // trigger location if has href
            if ($item.hasClass('is-href')) {
                document.location = $item.val();
            }

            // manage disabled state
            $this.parent()[ ($this.is('[disabled]')) ? 'addClass' : 'removeClass']('is-disabled');

            return;

        });

        // Bind menu
        if (conf.hasMenu) {

            conf.$el.on('click.sadui.prettyDropdown', '.is-menu-trigger, .is-menu-item', function(ev){
                ev.preventDefault();

                if ($(ev.target).hasClass('is-menu-trigger')) {

                    if (!conf.$el.hasClass('has-menu-visible')) {

                        open_menu();
                        ev.stopPropagation();

                    } else {
                        close_menu();
                    }

                } else if ($(ev.target).hasClass('is-menu-item')) {

                    update_dropdown(ev);

                    $('.is-menu-item', conf.$menu).removeClass('is-selected');
                    $(this).addClass('is-selected');

                    conf.$menu.removeClass('is-visible');
                }

            });
        }
    };

    var open_menu = function(){
        conf.$el.addClass('has-menu-visible');
        conf.$menu.addClass('is-visible');
        conf.menu_state = 'open';

        $(document).on('click.sadui.prettyDropdown', function(){
            if (conf.menu_state === 'open') close_menu();
        });
    };

    var close_menu = function(){
        conf.$el.removeClass('has-menu-visible');
        conf.$menu.removeClass('is-visible');
        conf.menu_state = 'closed';

        $(document).off('click.sadui.prettyDropdown');
    };

    // @Param ev Object the event object of selected menu item
    var update_dropdown = function(ev){
        var el = $(ev.target);
        
        // Select form element
        conf.$dropdown.val( el.data('value') );

        conf.$dropdown.trigger('change');
    };

    var update_label = function(){
        var label_value = $('.is-dropdown option:selected', conf.$el).text();
        conf.$label.html( label_value );
    };

    var populate_menu = function(){
        conf.values = $.map( $('option', conf.$dropdown), function(option){
            var $option = $(option);
            return {
                value: $option.val(),
                name: $option.text(),
                selected: (typeof $option.attr('selected') !== 'undefined') ? true:false
            }
        });

        // Clear current items
        conf.$menu.html('');
        
        $.each(conf.values, function(i,attr){
            var li = $('<li>')
                .addClass('is-menu-item')
                .attr('data-value', attr.value )
                .html( attr.name )
                .appendTo(conf.$menu);

            if (attr.selected) li.addClass('is-selected');
        });
    };

    var update_data = function(){
        conf.$el.data('prettyDropdown', conf);
    };

    var init = function(){
        bind();

        if (conf.hasMenu) {
            conf.$el.addClass('has-menu');

            // Populate Menu
            populate_menu();
        }

        update_label();

    };

    if (conf.autoinit) {
        init();
    }

    update_data();

    return conf;

};