var PROJECT_ITEM = (function(){
    var HOST_URL = window.HOST_URL || '';


    function extraNavbarItemTemplate(){
        var template =  '<li class="nav-divider"></li>' +
                        '<li><a href="#">代码</a></li>' +
                        '<li><a href="#">Pull Request</a></li>' +
                        '<li><a href="#">讨论</a></li>' +
                        '<li><a href="#">演示</a></li>' +
                        '<li><a href="#">质量管理</a></li>';

        return template;
    }

    function projectItemActionTemplate(){
        var template =  '<div class="btn-group btn-group-justified" role="group" aria-label="...">' +
                            '<div class="btn-group" role="group">' +
                                '<button type="button" class="btn btn-default glyphicon glyphicon-star">Star</button>' +
                            '</div>' +
                            '<div class="btn-group" role="group">' +
                                '<button type="button" class="btn btn-default glyphicon glyphicon-eye-open">Watch</button>' +
                            '</div>' +
                        '</div>';
        return template;
    }

    function loadProject(){
        setTimeout(function(){
            console.log($('#navbar'));
            $(projectItemActionTemplate()).insertAfter($('#navbar'));
        },500)
    }

    return {
        ctrl: function(user, id){
            //set up routes in this page
            var projectItemRouter = new Routy.Router(null, 'a', '#projects_item');

            //set up the page information in the banner
            $('title').text(user +'/' + id);
            $('#page_name').text(user + '/' + id);
            //and those extra items in nav menu
            $("#navigator").append(extraNavbarItemTemplate());

            loadProject();
        }
    }
})();
