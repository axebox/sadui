/* 
 * Tabs
 * 
 * Requires _tabs.scss
 */
sadui.tab = function(conf){

    var opts = {};

    opts.containerDimension = {};
    opts.slideDimension = {};
    opts.index = 0;
    opts.tabTarget = 0;
    
    opts = $.extend(conf,opts);

    opts.$tabTarget = opts.$tabContentItem.eq(0);
    opts.$menuTarget = opts.$tabMenuItem.eq(0);

    var change_tab = function(ev){
        ev.preventDefault();

        var $this = $(ev.currentTarget);
        
        opts.tabTarget = $this.data('tabTarget');
        opts.$tabTarget = opts.$tabContentItem.eq( opts.tabTarget );

        update_data();

        if ($.isFunction( opts.slideStart )) opts.slideStart();

        opts.$tabMenuItem.removeClass('is-selected');
        opts.$tabMenuItem.eq( opts.tabTarget ).addClass('is-selected');

        opts.$tabContentItem.removeClass('is-selected');
        opts.$tabContentItem.eq( opts.tabTarget ).addClass('is-selected');

        opts.$tabContentItem.on('transitionend', function(){
            if ($.isFunction( opts.slideEnd )) opts.slideEnd();
        });
    };

    var update_data = function(){
        opts.$container.data('tabs', opts);
    };

    var init = function() {
        // Bindings
        opts.$tabMenuItem.on('click.ui_tabs', function(ev){
            var $this = $(this);

            change_tab(ev);
        });

        opts.$menuTarget.trigger('click');

        update_data();
    };

    init();
};