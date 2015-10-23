var ROOT_ROUTE = (function(){
     return {
        before_enter: function(type){
            if (!router.current_user) {
                location.href = '/home.html';
            } else {
                location.href = '/user/projects';
            }
        }
    };
})();
