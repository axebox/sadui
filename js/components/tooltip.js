/**
 * Tooltip
 */

sadui.tooltip = function(conf){

    var opts = {};
    opts.el = '[rel~=tooltip]',
    opts.$container = $('body'),
    opts.target  = false,
    opts.tooltip = false;
    
    $.extend(opts,conf);

    opts.$container.on( 'mouseenter', opts.el, function() {
        conf.target  = $( this );
        tip     = conf.target.attr( 'title' );
        conf.tooltip = $( '<div class="tooltip"></div>' );
 
        if( !tip || tip == '' )
            return false;
 
        opts.target.removeAttr( 'title' );

        conf.tooltip.css( 'opacity', 0 )
               .html( tip )
               .appendTo( 'body' );
 
        var init = function() {

            if( $( window ).width() < conf.tooltip.outerWidth() * 1.5 ) {
                conf.tooltip.css( 'max-width', $( window ).width() / 2 );
            } else {
                conf.tooltip.css( 'max-width', 340 );
            }
 
            var pos_left = opts.target.offset().left + ( opts.target.outerWidth() / 2 ) - ( conf.tooltip.outerWidth() / 2 ),
                pos_top  = opts.target.offset().top - conf.tooltip.outerHeight() - 20;
 
            if( pos_left < 0 ) {
                pos_left = opts.target.offset().left + opts.target.outerWidth() / 2 - 20;
                conf.tooltip.addClass( 'left' );
            } else {
                conf.tooltip.removeClass( 'left' );
            }
 
            if( pos_left + conf.tooltip.outerWidth() > $( window ).width() ) {
                pos_left = opts.target.offset().left - conf.tooltip.outerWidth() + opts.target.outerWidth() / 2 + 20;
                conf.tooltip.addClass( 'right' );
            } else {
                conf.tooltip.removeClass( 'right' );
            }
 
            if( pos_top < 0 )
            {
                var pos_top  = opts.target.offset().top + opts.target.outerHeight();
                conf.tooltip.addClass( 'top' );
            }
            else
                conf.tooltip.removeClass( 'top' );
 
            conf.tooltip.css( { left: pos_left, top: pos_top } )
                   .animate( { top: '+=10', opacity: 1 }, 50 );
        };
 
        init();
        $( window ).resize( init );
 
        var remove = function() {
            conf.tooltip.animate( { top: '-=10', opacity: 0 }, 50, function() {
                $( this ).remove();
            });
 
            target.attr( 'title', tip );
        };
 
        conf.target.on( 'mouseleave', remove );
        conf.tooltip.on( 'click', remove );
    });

};