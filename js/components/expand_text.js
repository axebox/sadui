sadui.expand_text = function(conf){

    var opts = {
        state: 'closed',//open
        text_array: [],
        text_start: [],
        text_start_array: [],
        text_end: [],
        text_end_array: [],
        truncate_words: 25,
        ellipses: '&#8230;'
    };
    
    $.extend(opts,conf);

    var bind = function(){

        opts.$trigger.on('click', function(ev){

            ev.preventDefault();

            show_hide_text();

        });

    };

    var show_hide_text = function(){

        // show more
        if ( opts.$container.text().split(' ').length === opts.truncate_words ) {

            opts.$container.append( opts.text_end );

            opts.$trigger.html( opts.$trigger.data('altLabel') );

        // show less
        } else {

            opts.$container.html( opts.text_start );

            opts.$trigger.html( 'Read more' );
        }

    };

    var init = function(){

        opts.text_array = opts.$container.text().split(' ');

        // abort check
        if (opts.text_array.length <= opts.truncate_words) return false;

        opts.$trigger.addClass('is-visible');
        
        opts.text_start_array = opts.text_array.slice( 0, opts.truncate_words );
        opts.text_start = opts.text_start_array.join(' ');

        opts.text_end_array = opts.text_array.slice( opts.truncate_words );
        opts.text_end = opts.text_end_array.join(' ');

        show_hide_text();

        bind();

    };

    init();

};