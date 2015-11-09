/**
 * Created by phy on 15-11-3.
 */
var DISPATCH_PROJECT_TOPIC_ROUTE = (function(){
    return {
        resolve: function (ownerName, projectName) {
            var path = '/api/user/' + ownerName + '/project/' + projectName;
            return coding.get(path);
        },
        dispatch: function (ownerName, projectName, topicId, project) {
            if (!project) {
                router.run.call(router,  '/user/projects');
            }
            return project.is_public ? PROJECT_TOPIC_ROUTE : MY_PROJECT_TOPIC_ROUTE;
        },
        context: '.container',
    }

})();