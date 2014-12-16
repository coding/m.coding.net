require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        zepto: '../bower_components/zepto/zepto',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['app', 'zepto'], function (app, $) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running ZeptoJS %s', $);

});
