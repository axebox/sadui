/**
 * Shortens DOM text strings and stores full string in title attribute
 * @Require util.truncate_string
 */
sadui.short_text = function(conf){

    var opts = {
        // $el: $()
        state: 'closed',//open
        truncate: 25,
        ellipses: '&#8230;',
        method: 'words'
    };
    
    $.extend(opts,conf);

    var init = function(){

        conf.$el.each(function(){

            var $this = $(this),
                text = $this.text();

            var truncate = sadui.util.truncate_string(text, {
                sizes: {
                    short: opts.truncate
                }
            });

            if (truncate.truncate.short[1].length > 0) {

                $this.html( truncate.truncate.short[0] + opts.ellipses )
                     .attr('title', truncate.truncate.original);

            } else {

                $this.html( truncate.truncate.short[0] );

            }

        });

    };

    init();

};