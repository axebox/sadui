/* Responsive radio group (desktop/tablet) <--> select (phone)
 * @param conf.$container
 * @const $class .is-radio-group The radio group (desktop/tablet)
 * @const $class .is-radio-item The radio group (desktop/tablet)
 * @const $class .is-dropdown The dropdown (phone)
 * @const $class .is-target The master data form element that stores data
 */
sadui.responsive_radio_select = function(conf){

    var bind_radio_group = function(){

        var $item = $('.is-radio-group .is-radio-item', conf.$container);

        $item.on('click', function(ev){
            ev.preventDefault();

            update_target_element(ev);

            // show/hide bullets
            $item.removeClass('is-selected');
            $(this).addClass('is-selected');

            // update DOM node
            $('.is-dropdown', conf.$container).trigger('change');
        });
    };

    var bind_dropdown = function(){
        $('.is-dropdown', conf.$container).on('change', function(ev){
            update_target_element(ev);
        });
    };

    var update_target_element = function(ev){
        // Abort if triggered 
        // if ($(ev.target).hasClass('is-target')) return false;
        if (ev.isTrigger) return false;

        var $target = $('.is-target', conf.$container);
        var value;

        // GET values
        if ($(ev.currentTarget).hasClass('is-radio-item')) {
            value = $(ev.currentTarget).data('value');

        } else if ($(ev.currentTarget).hasClass('is-dropdown')) {
            value = $(ev.currentTarget).val();
        }

        // SET values
        $('.is-dropdown', conf.$container).val(value);
        $('.is-dropdown option', conf.$container).prop('selected', false);
        $('.is-dropdown option[value="'+ value +'"]', conf.$container).prop('selected', true);
        
        $('.is-radio-item', conf.$container).removeClass('is-selected'); // all
        $('.is-radio-item[data-value="'+ value +'"]', conf.$container).addClass('is-selected'); // this

    };

    var init = function(){

        bind_radio_group();
        bind_dropdown();

        var value = $('.is-dropdown', conf.$container).val();
        var $radioItem = $('.is-radio-item[data-value="' + value + '"]', conf.$container);

        $radioItem.addClass('is-selected');

    };

    init();

};