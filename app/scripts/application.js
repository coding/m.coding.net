(function (PROJECT_ROUTE, PROJECT_ITEM_ROUTE) {
    $(function(){
        FastClick.attach(document.body);

        var router = new Routy.Router(null, 'a', '.main', 'click longTap swipe');

        router.register('/projects', {
            template_url: '/views/projects.html',
            context: ".container",
            before_enter: PROJECT_ROUTE.before,
            on_enter: PROJECT_ROUTE.ctrl,
            after_enter: PROJECT_ROUTE.after,
            on_exit: PROJECT_ROUTE.exit,
            default: true
        });

        router.register('/u/:user/p/:project',{
            template_url: '/views/project.html',
            events: ['longTap', 'swipe'],
            context: '.container',
            before_enter: PROJECT_ITEM_ROUTE.before,
            on_enter: PROJECT_ITEM_ROUTE.ctrl,
            after_enter: PROJECT_ITEM_ROUTE.after,
            on_exit:  PROJECT_ITEM_ROUTE.exit
        });

        router.register('/pp', {
            template_url: '/views/pp.html',
            context: ".container",
            on_enter: function (){
                console.log('pp');
            }
        });

    })
})(PROJECT_ROUTE, PROJECT_ITEM_ROUTE);
