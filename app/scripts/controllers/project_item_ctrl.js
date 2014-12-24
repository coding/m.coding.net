var PROJECT_ITEM_ROUTE = (function(){

    function loadCommit(user, project, commit){

        var commit = commit || 'master';
        var path = '/api/user/' + user + '/project/' + project + '/git/tree/' + commit;
        
       $.ajax({
          url: path,
          dataType: 'json',
          success: function(data){
            console.log(data);
            updateCommit(data);
          },
          error: function(xhr, type){
            alert('Failed to load commits');
          },
          complete: function(){
            $('#project_code > .panel-heading').html('');
            $('#project_readme > .panel-body').html('')
          }
        });
    }

    function loadProject(user, project){

        var path = '/api/user/' + user + '/project/' + project;

        $.ajax({
          url: path,
          dataType: 'json',
          success: function(data){
            updateDOM(data);
          },
          error: function(xhr, type){
            alert('Failed to load project');
          },
          complete: function(){
            $('#project_actions a:first').text(' 收藏 ');
            $('#project_actions a:last').text(' 关注 ');
          }
        });
    }

    function updateCommit(data){
        var data = data || {"code":0,"data":{}};

        var commit       = data.data,
            lastCommit = commit.lastCommit,
            files        = commit.files,
            readme       = commit.readme.preview;

        $('.comment-message').text(lastCommit.shortMessage);
        $('.comment-hash').text(lastCommit.commitId.substr(0,10));
        
        var lastCommitElement = '<span class="panel-title"><img src="' + lastCommit.committer.avatar + '" height="20" width="20"> ' + lastCommit.committer.name + ' </span>';

        $('#project_code > .panel-heading').html(lastCommitElement);
        $('#project_readme > .panel-body').html(readme);

    }

    function updateDOM(data){
        var data = data || {"code":0,"data":{}};

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
            loadCommit(user, project);
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
