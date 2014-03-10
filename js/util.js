// is_scrolled_into_view
// get_geo_country
// get_nearest_number
// parse_query_string
// truncate_string


sadui.util = {};

// http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
sadui.util.is_scrolled_into_view = function($elem) {

    var docViewTop      = $(window).scrollTop();
    var docViewBottom   = docViewTop + $(window).height();

    var elemTop         = $elem.offset().top;
    var elemBottom      = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));

};

/**
 * Returns local geo code
 * todo: return deferred promise
 */
sadui.util.get_geo_country = function() {

    var that = this;

    if ("geolocation" in navigator) {

        navigator.geolocation.getCurrentPosition(function (position) {

            var conf = {
                lat:    position.coords.latitude,
                lng:    position.coords.longitude,
                radius: 10,
                type:   'JSON'
            };

            that.json = $.getJSON('http://ws.geonames.org/countryCode', conf);

        });

        that.json.complete(function(result){
            console.log(result);
        });

        return that;

    }

};

//+ Carlos R. L. Rodrigues
//@ http://jsfromhell.com/array/nearest-number [rev. #0]
sadui.util.get_nearest_number = function(a, n) {

    if((l = a.length) < 2) {
        return l - 1;
    }

    for(var l, p = Math.abs(a[--l] - n); l--;) {
        if(p < (p = Math.abs(a[l] - n))) {
            break;
        }
    }

    return l + 1;
};

// http://www.joezimjs.com/javascript/3-ways-to-parse-a-query-string-in-a-url/
sadui.util.parse_query_string = function(queryString) {

    var params = {}, queries, temp, i, l;
 
    // Split into key/value pairs
    queries = queryString.split("&");
 
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
 
    return params;

};

/**
 * truncates a string, returning array of various lengths
 * @Param text String
 * @Param conf Object
 * @Param conf.size Object sizes of characters to truncate {name:characters}
 * @Return options Object containing sizes and original text
 */
sadui.util.truncate_string = function(text, conf) {

    var opts = {
        truncate: {
            original: text
        }
    };

    text = $.trim(text);
    
    $.extend(opts,conf);

    $.each(opts.sizes, function(name,size){

        opts.truncate[name] = [];
        opts.truncate[name].push(text.slice( 0, size ));
        opts.truncate[name].push(text.slice( size ));

    });

    return opts;

};