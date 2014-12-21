var PROJECT_ITEM_ROUTE = (function(){
    var HOST_URL = window.HOST_URL || '';


    function loadProject(){
    }

    return {
        template_url: '/views/project.html',
        //events: ['longTap', 'swipe'],
        context: '.container',
        before_enter: function(user, id){
            var path = '/u/' + user + '/p/' + id;
            //set up the page information in the banner
            $('title').text(user + '/' + id);
            $('#page_name').html('<a href="#">' + user + '</a>' + '/' + '<a href="' + path + '">' + id + '</a>');
            //and those extra items in nav menu
            $("#navigator").append( '<li class="nav-divider"></li>' +
                                    '<li><a href="' + path + '/code' + '">代码</a></li>' +
                                    '<li><a href="#">Pull Request</a></li>' +
                                    '<li><a href="#">讨论</a></li>' +
                                    '<li><a href="#">演示</a></li>' +
                                    '<li><a href="#">质量管理</a></li>'
                                    );

            $( '<div id="project_actions" class="btn-group btn-group-justified" role="group" aria-label="...">' +
                    '<div class="btn-group" role="group">' +
                    '<button type="button" class="btn btn-default glyphicon glyphicon-star"> 收藏 </button>' +
                    '</div>' +
                    '<div class="btn-group" role="group">' +
                    '<button type="button" class="btn btn-default glyphicon glyphicon-eye-open"> 关注 </button>' +
                    '</div>' +
                '</div>'
            ).insertAfter($('#bs-example-navbar-collapse-1'));

            $('#navigator').find("li:eq(5)").addClass('active');
        },
        on_enter: function(user, id){
            loadProject();
        },
        on_exit: function(){
            //clean up the nav menu
            $('title').text('');
            $('#page_name').text('');

            $('#navigator').find('li').removeClass('active');
            $('#navigator > li').slice(-6).remove();
            $('#project_actions').remove();
        }
    }
})();
