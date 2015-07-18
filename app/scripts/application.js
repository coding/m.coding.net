/**
 * Created by simonykq on 21/12/2014.
 */
(function (REGISTER_ROUTE, LOGIN_ROUTE, ACTIVATE_ROUTE, RESETPASSWORD_ROUTE, PROJECT_ROUTE, PROJECT_ITEM_ROUTE, PROJECT_TREE_ROUTE, PROJECT_BLOB_ROUTE, PROJECT_PULL_ROUTE, PROJECT_TOPICS_ROUTE, PROJECT_TOPIC_ROUTE, PP_ROUTE, USER_ROUTE) {
    $(function(){
        FastClick.attach(document.body);
        moment.locale('zh');
        
        $('button.navbar-toggle').on('click',function(){
            var target = $('.navbar-collapse'),
                target_cover = $('.black-cover'),
                status = $(this).data('status');
            if($(target).hasClass('collapsing') || $(target_cover).hasClass('collapsing')) return; //dont do anything if it is transitioning
            //the current status is open
            if(status === 'open'){
                $(target_cover).hide();
                $(target).collapse('hide');
                $(this).data('status', 'closed');
            }else{
                $(target_cover).show();
                $(target).collapse('show');
                $(this).data('status', 'open');
            }
        });

        //collapse the navbar on click event
        $('body.main').on('click touchmove', function(){
            var $nav_bar = $('div.navbar-collapse'),
                $button  = $('button.navbar-toggle');
            if(!$nav_bar.hasClass('collapsing') && $button.data('status') === 'open'){
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

        router.register('/user/activate', ACTIVATE_ROUTE);

        router.register('/resetPassword', RESETPASSWORD_ROUTE);

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

        router.register('/user/:user', USER_ROUTE);

    })
})(REGISTER_ROUTE, LOGIN_ROUTE, ACTIVATE_ROUTE, RESETPASSWORD_ROUTE, PROJECT_ROUTE, PROJECT_ITEM_ROUTE, PROJECT_TREE_ROUTE, PROJECT_BLOB_ROUTE, PROJECT_PULL_ROUTE, PROJECT_TOPICS_ROUTE, PROJECT_TOPIC_ROUTE, PP_ROUTE, USER_ROUTE);
