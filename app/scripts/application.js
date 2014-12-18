(function () {
    $(function(){
        FastClick.attach(document.body);


        var router = new Routy.Router(null, 'a', '#navigator');

        router.register('/projects', {
            template_url: '/views/projects.html',
            context: ".container",
            callback: PROJECT.ctrl,
            default: true
        });

        router.register('/pp', {
            template_url: '/views/pp.html',
            context: ".container",
            callback: function (){
            }
        });

    })
})();
