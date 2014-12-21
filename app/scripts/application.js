/**
 * Created by simonykq on 21/12/2014.
 */
(function (PROJECT_ROUTE, PROJECT_ITEM_ROUTE, PP_ROUTE) {
    $(function(){
        FastClick.attach(document.body);

        var router = new Routy.Router(null, 'a', '.main', 'click longTap swipe');

        router.register('/projects', PROJECT_ROUTE);

        router.register('/u/:user/p/:project, /u/:user/p/:project/code', PROJECT_ITEM_ROUTE);

        router.register('/pp', PP_ROUTE);

    })
})(PROJECT_ROUTE, PROJECT_ITEM_ROUTE, PP_ROUTE);
