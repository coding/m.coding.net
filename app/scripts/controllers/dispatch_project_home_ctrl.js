/**
 * Created by phy on 15-10-30.
 */

var DISPATCH_PROJECT_HOME_ROUTE = (function(){
    return {
        resolve: function (ownerName, projectName) {
            var path = '/api/user/' + ownerName + '/project/' + projectName;
            return coding.get(path);
        },
        dispatch: function (ownerName, projectName, project) {
            if (!project) {
                router.run.call(router,  '/user/projects');
            }
            return project.is_public ? PROJECT_ITEM_ROUTE : MY_PROJECT_HOME_ROUTE;
        },
        context: '.container',
    }

})();
