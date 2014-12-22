var PROJECT_ITEM_ROUTE = (function(){
    var HOST_URL = window.HOST_URL || '';


    function loadProject(user, project){

        setTimeout(function(){
            updateDOM();
        },200);
        //
        //var path = '/api/user/' + user + '/project/' + project;
        //$.getJSON(HOST_URL + path, function(data, status, xhr){
        //   updateDOM(data);
        //});
    }

    function updateDOM(data){
        var data = data || {"code":0,"data":{"backend_project_path":"/user/demo/project/node-2048","created_at":1403062201000,"current_user_role":"visitor","current_user_role_id":70,"depot_path":"/u/demo/p/node-2048/git","description":"NodeJS + 2048 + MySQL","fork_count":254,"forked":false,"git_url":"git://coding.net/demo/node-2048.git","groupId":0,"https_url":"https://coding.net/demo/node-2048.git","icon":"/static/project_icon/scenery-20.png","id":124,"is_public":true,"last_updated":1417075124000,"max_member":10,"name":"node-2048","owner":{"avatar":"https://dn-coding-net-production-static.qbox.me/eb160ca8-9bb9-4df1-a577-c712e45b2882.jpg?imageMogr2/auto-orient/format/jpeg/crop/!323x323a8a0","birthday":"1970-01-01","company":"Coding.net","created_at":1401937522000,"fans_count":0,"follow":false,"followed":false,"follows_count":0,"global_key":"demo","gravatar":"","id":26,"introduction":"","is_member":0,"job":0,"last_activity_at":1418744225968,"last_logined_at":1417952025000,"lavatar":"https://dn-coding-net-production-static.qbox.me/eb160ca8-9bb9-4df1-a577-c712e45b2882.jpg?imageMogr2/auto-orient/format/jpeg/crop/!323x323a8a0","location":"广东 深圳","name":"demo","path":"/u/demo","sex":0,"slogan":"Coding 演示平台的示例代码和文档","status":1,"tags":"","tags_str":"","tweets_count":0,"updated_at":1401937522000},"owner_id":26,"owner_user_home":"<a href=\"https://coding.net/u/demo\">demo</a>","owner_user_name":"demo","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/eb160ca8-9bb9-4df1-a577-c712e45b2882.jpg?imageMogr2/auto-orient/format/jpeg/crop/!323x323a8a0","pin":false,"project_path":"/u/demo/p/node-2048","recommended":3,"ssh_url":"git@coding.net:demo/node-2048.git","star_count":91,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1403062370000,"watch_count":127,"watched":false}};

        var project  = data.data;

        //set up project actions
        if(project['stared']){
            $('#project_actions a:first').text(' 已收藏(' + project['star_count'] + ') ');
        }else{
            $('#project_actions a:first').text(' 收藏(' + project['star_count'] + ') ');
        }
        if(project['watched']){
            $('#project_actions a:last').text(' 已关注(' + project['watch_count'] + ') ');
        }else{
            $('#project_actions a:last').text(' 关注(' + project['watch_count'] + ') ');
        }

        //set up the project owner section
        var project_owner_ele = '<img src="' + project['icon'] + '" height="40" width="40"> ' +
                                '<a href="' + project['owner_path'] + '">'+ project['owner_user_name'] +'</a>/<a href="' + project['project_path'] + '">' + project['name'] + '</a>';


        $('#project_owner').html(project_owner_ele);

        //set up project description
        $('#project_description').text(project['description']);

    }

    return {
        template_url: '/views/project.html',
        //events: ['longTap', 'swipe'],
        context: '.container',
        before_enter: function(user, project){
            var path = '/u/' + user + '/p/' + project;
            //set up the page information in the banner
            $('title').text(user + '/' + project);
            $('#page_name').html('<a href="#">' + user + '</a>' + '/' + '<a href="' + path + '">' + project + '</a>');
            //and those extra items in nav menu
            $("#navigator").append( '<li class="nav-divider"></li>' +
                                    '<li><a href="' + path + '/code' + '">代码</a></li>' +
                                    '<li><a href="#">Pull Request</a></li>' +
                                    '<li><a href="#">讨论</a></li>' +
                                    '<li><a href="#">演示</a></li>' +
                                    '<li><a href="#">质量管理</a></li>'
                                    );

            $('<div id="project_actions" class="btn-group btn-group-justified" role="group" aria-label="...">' +
                    '<div class="btn-group" role="group">' +
                    '<a class="btn btn-default glyphicon glyphicon-star"> <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> </a>' +
                    '</div>' +
                    '<div class="btn-group" role="group">' +
                    '<a class="btn btn-default glyphicon glyphicon-eye-open"> <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> </a>' +
                    '</div>' +
                '</div>'
            ).insertAfter($('#bs-example-navbar-collapse-1'));

            $('#navigator').find("li:eq(5)").addClass('active');
        },
        on_enter: function(user, project){
            loadProject(user, project);
        },
        on_exit: function(user, project){
            //clean up the nav menu
            $('title').text('');
            $('#page_name').text('');

            $('#navigator').find('li').removeClass('active');
            $('#navigator > li').slice(-6).remove();
            $('#project_actions').remove();
        }
    }
})();
