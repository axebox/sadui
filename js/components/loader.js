/**
 * Loader
 * Preloads DOM object assets with the attribute [data-preload] as the src
 * @Param conf Object hash of options
 * @Param conf.mode String 'visible|default'
 * @Param conf.$container $.Object
 */
sadui.loader = function(conf){

    conf.loaders = [];
    
    if (typeof conf.mode === 'undefined') conf.mode = null;

    switch (conf.mode) {

        case 'visible':
            conf.$el = $('[data-preload]:visible', conf.$container);
            break;

        default:
            conf.$el = $('[data-preload]', conf.$container);
            break;

    }

    var load_assets = function(src) {
        
        var deferred = $.Deferred();
        var sprite = new Image();

        sprite.onload = function (d) {
            deferred.resolve();
        };

        sprite.onerror = function () {
            deferred.reject();
        };

        if (typeof src !== 'undefined') sprite.src = src;

        return deferred.promise();
    };

    conf.bind_preload = function(){

        conf.$el.each(function(){
            var $this = $(this);

            // Skip if element or preload isn't set
            if (typeof $this === 'undefined' || 
                $this.length <= 0 ||
                // typeof $this.data('preload') !== 'undefined' ||
                typeof $this.data('preload') !== 'string') return true;

            var obj = $this.data('preload').split(',');
            
            var src = obj[0],
                rule = (typeof obj[1] !== 'undefined') ? obj[1]:'image';

            // init deferred loader for this element
            var d = load_assets(src);

            // asset loaded successfully
            d.done(function(){

                // console.log('doned:',$this);

                if (rule === 'backgroundImage') {
                    $this.css('background-image', "url('"+ src +"')");
                
                } else if (rule === 'image') {
                    $this.attr('src', src);
                }
                
                // } else if (rule === 'mp3' || rule === 'ogg') {
                // }

                // remove preload data attr
                $this.removeAttr('data-preload');
                    
            });

            // asset failed to load
            d.fail(function(){
                // console.log('failed:',$this);
            });

            // add this deferred to master deferred object (loaders)
            conf.loaders.push(d.promise());

        });

    };

    conf.$container.addClass('has-disable-animation');

    $('.has-loader-content', conf.$container).on('transitionend', function(){
        conf.$container.removeClass('has-disable-animation');
    });

    return conf;

};