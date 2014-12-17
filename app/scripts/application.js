(function () {
    $(function(){
        FastClick.attach(document.body);


        var router = new Routy.Router();

        router.register('projects', function(){
            console.log('projects');
        });

        router.register('projects/:id', function(id){
            console.log(id);
        });

        router.register('pp', function(){
            console.log('pp');
        });

    })
})();
