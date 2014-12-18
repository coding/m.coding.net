(function () {
    $(function(){
        FastClick.attach(document.body);


        var router = new Routy.Router();


        router.rootRegister({
            url: '/views/projects.html',
            context: ".container"
        }, PROJECT.ctrl);

        router.register('/projects', {
            url: '/views/projects.html',
            context: ".container"
        }, PROJECT.ctrl);

        router.register('pp', {
            url: '/views/pp.html',
            context: ".container"
        } ,function(){
            console.log('/pp');
        });

    })
})();
