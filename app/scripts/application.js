/**
 * Created by simonykq on 21/12/2014.
 */
(function(REGISTER_ROUTE, LOGIN_ROUTE, ACTIVATE_ROUTE, RESETPASSWORD_ROUTE, PROJECT_ROUTE, PROJECT_ITEM_ROUTE, PROJECT_TREE_ROUTE, PROJECT_BLOB_ROUTE, PROJECT_PULL_ROUTE, PROJECT_TOPICS_ROUTE, PROJECT_TOPIC_ROUTE, PP_ROUTE, USER_ROUTE, USER_INFO_ROUTE, USER_FANS_ROUTE, USER_PROJECT_ROUTE, USER_PP_ROUTE, FRIENDS_INFO_ROUTE) {
    $(function() {
        FastClick.attach(document.body);
        moment.locale('zh');

        $('button.navbar-toggle').on('click',function() {
            var target = $('.navbar-collapse'),
            target_cover = $('.black-cover'),
            status = $(this).data('status');
            if ($(target).hasClass('collapsing') || $(target_cover).hasClass('collapsing')) return; //dont do anything if it is transitioning
            //the current status is open
            if (status === 'open') {
                $(target_cover).hide();
                $(target).collapse('hide');
                $(this).data('status', 'closed');
            } else {
                $(target_cover).show();
                $(target).collapse('show');
                $(this).data('status', 'open');
            }
        });

        //collapse the navbar on click event
        $('body.main').on('click touchmove',function() {
            var $nav_bar = $('div.navbar-collapse'),
            $button = $('button.navbar-toggle');
            if (!$nav_bar.hasClass('collapsing') && $button.data('status') === 'open') {
                $('.black-cover').hide();
                $nav_bar.collapse('hide');
                $button.data('status', 'closed');
            }
        });

        // var user_agent = navigator.userAgent;
        // if(user_agent.match(/Android/i)){
        //     $('a.mobile-app-link').attr('href', "https://coding.net/app/android")
        // }
        // else if(user_agent.match(/iPhone|iPad|iPod/i)){
        //     $('a.mobile-app-link').attr('href', 'https://itunes.apple.com/app/id923676989')
        // }
        // else{
        // }

        window.router = new Routy.Router(null, 'a', '.main');

        router.rootRegister(PROJECT_ROUTE);

        router.register('/login', LOGIN_ROUTE);

        router.register('/register', REGISTER_ROUTE);

        router.register('/activate?email=:email&key=:key', ACTIVATE_ROUTE);

        router.register('/user/activate', ACTIVATE_ROUTE);

        router.register('/resetPassword', RESETPASSWORD_ROUTE);

        router.register('/user/resetPassword?email=:email&key=:key', RESETPASSWORD_ROUTE);

        router.register('/projects', PROJECT_ROUTE);

        router.register('/projects/:type', PROJECT_ROUTE);

        router.register('/u/:user/p/:project, /u/:user/p/:project/git', PROJECT_ITEM_ROUTE);

        router.register('/u/:user/p/:project/tree, /u/:user/p/:project/tree/:commit/:path', PROJECT_TREE_ROUTE);

        router.register('/u/:user/p/:project/blob/:commit/:path', PROJECT_BLOB_ROUTE);

        router.register('/u/:user/p/:project/pull', PROJECT_PULL_ROUTE);

        router.register('/u/:user/p/:project/topics', PROJECT_TOPICS_ROUTE);

        router.register('/u/:user/p/:project/topics/:topic', PROJECT_TOPIC_ROUTE);

        router.register('/pp', PP_ROUTE);

        router.register('/pp/:type', PP_ROUTE);

        router.register('/u/:user', USER_ROUTE);


        // 我的项目相关
        router.register('/user/projects', MY_PROJECT_ROUTE);

        router.register('/i/:user/p/:project/members', MY_PROJECT_MEMBERS_ROUTE);

        router.register('/i/:user/p/:project/activities, /i/:user/p/:project/activities/:type', MY_PROJECT_ACTIVITIES_ROUTE);

        router.register('/i/:user/p/:project/attachment/:id', MY_PROJECT_ATTACHMENT_ROUTE);

        router.register('/i/:user/p/:project/attachment', MY_PROJECT_ATTACHMENT_LIST_ROUTE);

        router.register('/i/:user/p/:project/topic/create', MY_PROJECT_TOPIC_CREATE_ROUTE);

        router.register('/i/:user/p/:project/topics/:type, /i/:user/p/:project/topics', MY_PROJECT_TOPICS_ROUTE);

        router.register('/i/:user/p/:project/topic/:id', MY_PROJECT_TOPIC_ROUTE);

        router.register('/i/:user/p/:project/tasks, /i/:user/p/:project/tasks/:member', MY_PROJECT_TASKS_ROUTE);

        router.register('/i/:user/p/:project/task/create', MY_PROJECT_TASK_CREATE_ROUTE);

        router.register('/i/:user/p/:project/task/:id', MY_PROJECT_TASK_ROUTE);

        router.register('/i/:user/p/:project/task/:id/description', MY_PROJECT_TASK_DESC_ROUTE);

        router.register('/i/:user/p/:project/git, /i/:user/p/:project/git/home', MY_PROJECT_GIT_HOME_ROUTE);

        router.register('/i/:user/p/:project/git/code, /i/:user/p/:project/git/code/:commit/:path', MY_PROJECT_GIT_CODE_ROUTE);

        router.register('/i/:user/p/:project/git/merge', MY_PROJECT_GIT_MERGE_ROUTE);

        router.register('/i/:user/p/:project/git/blob/:commit/:path', MY_PROJECT_GIT_BLOB_ROUTE);

        router.register('/i/:user/p/:project', MY_PROJECT_HOME_ROUTE);
        router.register('/user/:user', USER_ROUTE);
        router.register('/info/:user', USER_INFO_ROUTE);
        router.register('/social/:user/:type', USER_FANS_ROUTE);
        router.register('/user/:user/projects/:type', USER_PROJECT_ROUTE);
        router.register('/user_tweet', USER_PP_ROUTE);
        router.register('/active/:user', USER_PP_ROUTE);
        router.register('/friends/:user', FRIENDS_INFO_ROUTE);

    })
})(REGISTER_ROUTE, LOGIN_ROUTE, ACTIVATE_ROUTE, RESETPASSWORD_ROUTE, PROJECT_ROUTE, PROJECT_ITEM_ROUTE, PROJECT_TREE_ROUTE, PROJECT_BLOB_ROUTE, PROJECT_PULL_ROUTE, PROJECT_TOPICS_ROUTE, PROJECT_TOPIC_ROUTE, PP_ROUTE, USER_ROUTE, USER_INFO_ROUTE, USER_FANS_ROUTE, USER_PROJECT_ROUTE, USER_PP_ROUTE, FRIENDS_INFO_ROUTE);
