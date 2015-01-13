var PROJECT_ITEM_ROUTE = (function(){

    var currentUser,
        currentProject,
        currentCommit,
        currentPath,
        projectData;

    function loadCommit(commit, path){

        var user    = currentUser,
            project = currentProject;

        var commit = commit || 'master',
            path   = path || '',
            uri = '/api/user/' + user + '/project/' + project + '/git/tree/' + commit + '/' + path;

        //record the current commit and path in this project
        currentCommit = commit;
        currentPath   = path;

       $.ajax({
          url: uri,
          dataType: 'json',
          success: function(data){
              //TODO: change this back later to call with data;
            updateCommit();
          },
          error: function(xhr, type){
              alert('Failed to load commits');
              $('#project_code > .panel-heading').html('');
              $('#project_readme > .panel-body').html('');
          }
        });
    }

    function loadProject(){

        var path = '/api/user/' + currentUser + '/project/' + currentProject;

        $.ajax({
          url: path,
          dataType: 'json',
          success: function(data){
            projectData = data.data;
            updateDOM(data.data);
          },
          error: function(xhr, type){
            alert('Failed to load project');
            $('#project_actions a:first').text('');
            $('#project_actions a:last').text('');
          }
        });
    }

    function updateCommit(data){
        var commit = data || {"ref":"master","lastCommitter":{"name":"ElevenChen","email":"skyhacker@126.com","avatar":"https://dn-coding-net-production-static.qbox.me/c1caa543-f158-41c4-a74a-6ccbf7b7f36c.jpeg?imageMogr2/auto-orient/format/jpeg/crop/!180x180a0a0","link":"/u/elevenchen"},"files":[{"mode":"tree","path":".settings","name":".settings"},{"mode":"tree","path":"coffee","name":"coffee"},{"mode":"tree","path":"frameworks","name":"frameworks"},{"mode":"tree","path":"images","name":"images"},{"mode":"tree","path":"libs","name":"libs"},{"mode":"tree","path":"publish","name":"publish"},{"mode":"tree","path":"res","name":"res"},{"mode":"tree","path":"src","name":"src"},{"mode":"file","path":".cocos-project.json","name":".cocos-project.json"},{"mode":"file","path":".gitignore","name":".gitignore"},{"mode":"file","path":".project","name":".project"},{"mode":"file","path":"Gulpfile.js","name":"Gulpfile.js"},{"mode":"file","path":"Procfile","name":"Procfile"},{"mode":"file","path":"WeixinApi.js","name":"WeixinApi.js"},{"mode":"file","path":"app.js","name":"app.js"},{"mode":"file","path":"build-android.sh","name":"build-android.sh"},{"mode":"file","path":"config.json","name":"config.json"},{"mode":"file","path":"index.html","name":"index.html"},{"mode":"file","path":"main.js","name":"main.js"},{"mode":"file","path":"package.json","name":"package.json"},{"mode":"file","path":"project.json","name":"project.json"},{"mode":"file","path":"publish.sh","name":"publish.sh"},{"mode":"file","path":"readme.md","name":"readme.md"},{"mode":"file","path":"run-android.sh","name":"run-android.sh"},{"mode":"file","path":"runweb.sh","name":"runweb.sh"}],"can_edit":false,"isHead":true,"readme":{"data":"#空降小色块\n\n![image](https://coding.net/u/elevenchen/p/FlyBlock/git/raw/master/res/favicon.png)\n\n本项目使用cocos2d-js引擎\n\n使用coffeescript开发\n\n使用gulp前端构建工具构建coffeescript脚本\n\n##初始化:\n\n```\nnpm install\n```\n##编译\n\n```\ngulp\n```\n\n##运行\n\n```\n./runweb.sh\n```\n注意：需要把`runweb.sh`文件的引擎地址改成本机的\n\n##发布\n\n```\n./publish.sh\n```\n\n同样需要注意文件内容修改\n\n##部署\n\n```\nnode app.js\n```\n","lang":"markdown","size":471,"previewed":true,"preview":"\u003ch1\u003e空降小色块\u003c/h1\u003e \n\u003cp\u003e\u003cimg src\u003d\"https://coding.net/u/elevenchen/p/FlyBlock/git/raw/master/res/favicon.png\" alt\u003d\"image\"\u003e\u003c/p\u003e \n\u003cp\u003e本项目使用cocos2d-js引擎\u003c/p\u003e \n\u003cp\u003e使用coffeescript开发\u003c/p\u003e \n\u003cp\u003e使用gulp前端构建工具构建coffeescript脚本\u003c/p\u003e \n\u003ch2\u003e初始化:\u003c/h2\u003e \n\u003cpre\u003e\u003ccode\u003enpm install\n\u003c/code\u003e\u003c/pre\u003e \n\u003ch2\u003e编译\u003c/h2\u003e \n\u003cpre\u003e\u003ccode\u003egulp\n\u003c/code\u003e\u003c/pre\u003e \n\u003ch2\u003e运行\u003c/h2\u003e \n\u003cpre\u003e\u003ccode\u003e./runweb.sh\n\u003c/code\u003e\u003c/pre\u003e \n\u003cp\u003e注意：需要把\u003ccode\u003erunweb.sh\u003c/code\u003e文件的引擎地址改成本机的\u003c/p\u003e \n\u003ch2\u003e发布\u003c/h2\u003e \n\u003cpre\u003e\u003ccode\u003e./publish.sh\n\u003c/code\u003e\u003c/pre\u003e \n\u003cp\u003e同样需要注意文件内容修改\u003c/p\u003e \n\u003ch2\u003e部署\u003c/h2\u003e \n\u003cpre\u003e\u003ccode\u003enode app.js\n\u003c/code\u003e\u003c/pre\u003e","lastCommitMessage":"增加readme.md\n","lastCommitDate":1418647580000,"lastCommitId":"442eb449154518918b70c98ca4a0423068c05b8c","lastCommitter":{"name":"ElevenChen","email":"skyhacker@126.com","avatar":"https://dn-coding-net-production-static.qbox.me/c1caa543-f158-41c4-a74a-6ccbf7b7f36c.jpeg?imageMogr2/auto-orient/format/jpeg/crop/!180x180a0a0","link":"/u/elevenchen"},"mode":"file","path":"readme.md","name":"readme.md"},"lastCommit":{"fullMessage":"update\n","shortMessage":"update\n","commitId":"7aa32afc1e7e0ed179d35808896e92a73ef99246","commitTime":1419342157000,"committer":{"name":"ElevenChen","email":"skyhacker@126.com","avatar":"https://dn-coding-net-production-static.qbox.me/c1caa543-f158-41c4-a74a-6ccbf7b7f36c.jpeg?imageMogr2/auto-orient/format/jpeg/crop/!180x180a0a0","link":"/u/elevenchen"}}},
            lastCommit   = commit.lastCommit,
            files        = commit.files,
            readme       = commit.readme.preview;

        $('.commit').addClass('alert alert-info');
        $('.commit > .comment-meta').text(lastCommit.shortMessage);
        $('.commit > .comment-hash > a').attr('href', currentProject + '/git/commit/' + lastCommit.commitId).text(lastCommit.commitId.substr(0,10));

        var lastCommitElement = '<span class="panel-title"><img src="' + lastCommit.committer.avatar + '" height="20" width="20"> ' + lastCommit.committer.name + ' </span>';

        $('#project_code > .panel-heading').html(lastCommitElement);
        $('#project_readme > .panel-body').html(readme);

        var file    = null,
            fileEle = null;
        for (var i = 0; i < files.length; i++) {
            file = files[i];
            fileEle = renderFile(file);
            $('#project_code > .list-group').append(fileEle);
        }

    }

    function updateDOM(data){
        var project  = data || {};
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

    function renderFile(file){
        var li      = '<li class="list-group-item list-group-item-info glyphicon"> </li>',
            a       = '<a href="#"></a>',
            element = null;

        if(file['mode'] === 'file'){
            var link = $(a).attr('href', currentProject + '/git/tree/' + currentCommit + '/' + file['path']).text(file['name']);
            element = $(li).addClass('glyphicon-list-alt').append(link);

        }else if(file['mode'] === 'tree'){
            var link = $(a).attr('href', currentProject + '/git/blob/' + currentCommit + '/' + file['path']).text(file['name']);
            element = $(li).addClass('glyphicon-folder-close').append(link);
        }else{
        }
        return element;
    }

    return {
        template_url: '/views/project.html',
        //events: ['longTap', 'swipe'],
        context: '.container',
        before_enter: function(user, project){
            var path =  '/u/' + user + '/p/' +  project;
            //set up the page information in the banner
            $('title').text(user + '/' + project);
            $('#page_name').html('<a href="#">' + user + '</a>' + '/' + '<a href="' + path + '">' + project + '</a>');
            //and those extra items in nav menu
            $("#navigator").append( '<li class="nav-divider"></li>' +
                                    '<li><a href="' + path + '/code' + '">代码</a></li>' +
                                    '<li><a href="#">合并请求</a></li>' +
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

            currentUser = user;
            currentProject = project;

            loadProject();
            loadCommit();

            $('#project_actions a.glyphicon-star').click(function(e){
                e.preventDefault();

                if(!projectData) return;  //do nothing if projectData is not loaded

                var path = '/api/user/' + currentUser + '/project/' + currentProject;
                projectData['stared'] ? path += '/unstar' : path += '/star';

                $(this).html(' <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> ');
                $.post(path, function(){
                    projectData['stared'] = !projectData['stared'];
                    projectData['stared'] ? projectData['star_count'] += 1 : projectData['star_count'] -= 1;
                    updateDOM(projectData);
                });
            });

            $('#project_actions a.glyphicon-eye-open').click(function(e){
                e.preventDefault();

                if(!projectData) return;  //do nothing if projectData is not loaded

                var path = '/api/user/' + currentUser + '/project/' + currentProject;
                projectData['watched'] ? path += '/unwatch' : path += '/watch';

                $(this).html(' <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> ');
                $.post(path, function(){
                    projectData['watched'] = !projectData['watched'];
                    projectData['watched'] ? projectData['watch_count'] += 1 : projectData['watch_count'] -= 1;
                    updateDOM(projectData);
                });
            });
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
