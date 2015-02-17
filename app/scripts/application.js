/**
 * Created by simonykq on 21/12/2014.
 */
(function (PROJECT_ROUTE, PROJECT_ITEM_ROUTE, PROJECT_TREE_ROUTE, PROJECT_BLOB_ROUTE, PP_ROUTE, PP_ITEM_ROUTE) {
    $(function(){
        FastClick.attach(document.body);
        moment.locale('zh');

        $('button.navbar-toggle').click(function(){
            var target = $(this).data('target'),
                status = $(this).data('status');
            if($(target).hasClass('collapsing')) return; //dont do anything if it is transitioning
            //the current status is open
            if(status === 'open'){
                $(target).collapse('hide');
                $(this).find('img.up').hide();
                $(this).find('img.down').show();
                $(this).data('status', 'closed');
            }else{
                $(target).collapse('show');
                $(this).find('img.up').show();
                $(this).find('img.down').hide();
                $(this).data('status', 'open');
            }
        });

        //collapse the navbar on click event
        $('body.main').on('click touchmove', function(){
            var $nav_bar = $('div.navbar-collapse'),
                $button  = $('button.navbar-toggle');
            if(!$nav_bar.hasClass('collapsing') && $button.data('status') === 'open'){
                $nav_bar.collapse('hide');
                $button.find('img.up').hide();
                $button.find('img.down').show();
                $button.data('status', 'closed');
            }
        });

        window.router = new Routy.Router(null, 'a', '.main');

        router.register('/projects', PROJECT_ROUTE);

        router.register('/u/:user/p/:project, /u/:user/p/:project/git', PROJECT_ITEM_ROUTE);

        router.register('/u/:user/p/:project/tree, /u/:user/p/:project/tree/:commit/:path', PROJECT_TREE_ROUTE);

        router.register('/u/:user/p/:project/blob/:commit/:path', PROJECT_BLOB_ROUTE);

        router.register('/pp', PP_ROUTE);

        router.register('/pp/:hot', PP_ROUTE);

        router.register('/u/:user/pp/:pp',PP_ITEM_ROUTE);

    })
})(PROJECT_ROUTE, PROJECT_ITEM_ROUTE, PROJECT_TREE_ROUTE, PROJECT_BLOB_ROUTE, PP_ROUTE, PP_ITEM_ROUTE);
