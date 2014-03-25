/**
 * Preloads DOM assets
 * 
 * These attributes 
 * [data-preload] Required. The asset (image) src
 * [data-preload-rule] A rule to follow
 *
 * Available rules:
 * "image" Default. Replaces attribute src
 * "backgroundImage" Adds a css background-image style
 *
 * @Param opts Object hash of options
 * @Param opts.$container $.Object that contains assets with [data-preload]. Defaults to $(window)
 */
sadui.loader = function(opts){

    var defaults = {
        $container: $(document)
    };

    var conf = $.extend(defaults, opts);

    var srcs = [];

    // Makes an array of asset srcs
    $('[data-preload]', conf.$container).each(function(){
        srcs.push( $(this).data('preload') );
    });

    conf.load_image = function(src) {
        
        var dfr = $.Deferred();
        var sprite = new Image();

        sprite.onload = function (d) {
            dfr.resolve();
        };

        sprite.onerror = function () {
            dfr.reject();
        };

        if (typeof src === 'string' && src !== '' && src.length > 4) {
            sprite.src = src;
        }

        return dfr.promise();
    };

    conf.load_images = function() {

        var dfr = $.Deferred();

        var deferreds = [];

        $.each(srcs, function(i,src){
            
            if (typeof src === 'string' && src !== '' && src.length > 4) {
                deferreds.push( conf.load_image(srcs[i]) );
            }

        });

        $.when.apply($, deferreds).done(function(){

            $('[data-preload]', conf.$container).each(function(){

                var $this = $(this);

                var src = $this.data('preload');
                
                var rule = (typeof $this.attr('data-preload-rule') !== 'undefined' && $this.attr('data-preload-rule').length > 0) ? $this.data('preload-rule') : 'image';

                if (rule === 'backgroundImage') {
                    $this.css('background-image', "url('"+ src +"')");
                
                } else if (rule === 'image') {
                    $this.attr('src', src);
                }

            });


            dfr.resolve();
        });

        return dfr.promise();

    };

    conf.$container.addClass('has-disable-animation');

    $('.has-loader-content', conf.$container).on('transitionend', function(){
        conf.$container.removeClass('has-disable-animation');
    });

    return conf;

};