(function (PROJECT_ROUTE) {
    $(function(){
        FastClick.attach(document.body);


        var router = new Routy.Router(null, 'a', '#navigator');

        router.register('/projects', {
            template_url: '/views/projects.html',
            context: ".container",
            before_enter: PROJECT_ROUTE.before,
            on_enter: PROJECT_ROUTE.ctrl,
            after_enter: PROJECT_ROUTE.after,
            on_exit: PROJECT_ROUTE.exit,
            default: true
        });

        router.register('/pp', {
            template_url: '/views/pp.html',
            context: ".container",
            on_enter: function (){
            }
        });

    })
})(PROJECT_ROUTE);
