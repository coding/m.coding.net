var PROJECT_ITEM = (function(){
    var HOST_URL = window.HOST_URL || '';


    function loadProject(){
    }

    return {
        before: function(user, id){
            //set up the page information in the banner
            $('title').text(id);
            $('#page_name').text(id);
            //and those extra items in nav menu
            $("#navigator").append( '<li class="nav-divider"></li>' +
                                    '<li><a href="#">代码</a></li>' +
                                    '<li><a href="#">Pull Request</a></li>' +
                                    '<li><a href="#">讨论</a></li>' +
                                    '<li><a href="#">演示</a></li>' +
                                    '<li><a href="#">质量管理</a></li>'
                                    );

            $( '<div id="project_actions" class="btn-group btn-group-justified" role="group" aria-label="...">' +
                    '<div class="btn-group" role="group">' +
                    '<button type="button" class="btn btn-default glyphicon glyphicon-star">Star</button>' +
                    '</div>' +
                    '<div class="btn-group" role="group">' +
                    '<button type="button" class="btn btn-default glyphicon glyphicon-eye-open">Watch</button>' +
                    '</div>' +
                '</div>'
            ).insertAfter($('#bs-example-navbar-collapse-1'));
        },
        ctrl: function(user, id){
            loadProject();
        },
        after: function(user_id){
            //set up routes in this page
            var projectItemRouter = new Routy.Router(null, 'a', '.main');

        },
        exit: function(){
            //clean up the nav menu
            $('title').text('');
            $('#page_name').text('');

            $('#navigator > li').slice(-6).remove();
            $('#project_actions').remove();
        }
    }
})();
