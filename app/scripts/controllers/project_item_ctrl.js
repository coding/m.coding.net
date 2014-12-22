var PROJECT_ITEM_ROUTE = (function(){
    var HOST_URL = window.HOST_URL || '';



    function loadCommit(user, project, commit){
        setTimeout(function(){
            updateCommit();
        },200);
        //var commit = commit || 'master';
        //var path = '/api/user/' + user + '/project/' + project + '/git/tree/' + commit;
        //$.getJSON(HOST_URL + path, function(data,status,xhr){
        //    updateCommit();
        //});
    }

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

    function updateCommit(data){
        var data = data || {"code":0,"data":{"ref":"master","lastCommitter":{"name":"tsl0922","email":"tsl0922@gmail.com","avatar":"https://dn-coding-net-production-static.qbox.me/9242be0e48f6e35e0e98804bb9d381c8.jpg","link":"/u/tsl0922"},"files":[{"mode":"tree","path":"public","name":"public"},{"mode":"file","path":".gitignore","name":".gitignore"},{"mode":"file","path":".jshintrc","name":".jshintrc"},{"mode":"file","path":"CONTRIBUTING.md","name":"CONTRIBUTING.md"},{"mode":"file","path":"LICENSE.txt","name":"LICENSE.txt"},{"mode":"file","path":"Procfile","name":"Procfile"},{"mode":"file","path":"README.md","name":"README.md"},{"mode":"file","path":"Rakefile","name":"Rakefile"},{"mode":"file","path":"gruntfile.js","name":"gruntfile.js"},{"mode":"file","path":"index.js","name":"index.js"},{"mode":"file","path":"package.json","name":"package.json"}],"can_edit":false,"isHead":true,"readme":{"data":"# Node-2048\n\n这是一个修改版的 2048，添加了 NodeJS 后端，提供了可以查询和更新 MySQL 数据库中排行榜数据的 REST API。\n\n本示例演示了怎样在应用内通过读取 `VCAP_SERVICES` 环境变量的值来获取服务信息并连接到服务。\n\n### 本地开发和运行\n\n1. 安装 [nodejs](http://nodejs.org) 环境和 [npm](https://www.npmjs.org)，具体方法请自行参考其官网文档。\n2. 在项目根目录执行 `npm install` 安装依赖项，然后执行 `grunt server` 即可启动开发服务器并调用系统浏览器打开 \u003chttp://localhost:9090\u003e。\n3. 默认数使用的 MySQL 服务器地址为 `localhost`，数据库为 `test`，用户名为 `root`，密码为空。\n\n### 演示平台部署\n\n本应用只需要绑定 MySQL 服务就可以直接部署并运行起来了，应用会自动进行数据库表初始化操作（见：`index.js`文件）。\n\n------------------------------------\n\n### `VCAP_SERVICES` 环境变量介绍\n\n给应用绑定了服务，重启应用后，服务的相关信息就会被设置到 `VCAP_SERVICES` 的值里，该环境变量的值为 `JSON` 字符串，如果给一个应用绑定了多个服务或同一个服务的多个实例，它们的信息也会出现在这个环境变量的值里。\n\n\u003e **格式说明：**\n\n\u003e JSON 对象的格式为 `服务名 -\u003e 数组`，数组内容为该服务的每个实例信息。数组的值对象中，`name` 为实例名，`credentials` 该服务实例的连接信息，在应用中需要获取的就是 `credentials` 的内容。\n\n### `VCAP_SERVICES` 环境变量示例\n\n```\n{\n    \"mysql\": [\n        {\n            \"name\": \"mysql\",\n            \"label\": \"mysql\",\n            \"tags\": [\n                \"mysql\"\n            ],\n            \"plan\": \"100mb-dev\",\n            \"credentials\": {\n                \"hostname\": \"192.168.0.134\",\n                \"port\": 3306,\n                \"name\": \"cf_a77f5575_4cd2_45d7_8744_a42b3410d362\",\n                \"username\": \"XndXUYoadzgNyBQr\",\n                \"password\": \"7hzSmuhaUEpLuQZa\",\n                \"uri\": \"mysql://XndXUYoadzgNyBQr:7hzSmuhaUEpLuQZa@192.168.0.134:3306/cf_a77f5575_4cd2_45d7_8744_a42b3410d362?reconnect\u003dtrue\",\n                \"jdbcUrl\": \"jdbc:mysql://XndXUYoadzgNyBQr:7hzSmuhaUEpLuQZa@192.168.0.134:3306/cf_a77f5575_4cd2_45d7_8744_a42b3410d362\"\n            }\n        }\n    ],\n    \"elephantsql\": [\n        {\n            \"name\": \"elephantsql-c6c60\",\n            \"label\": \"elephantsql\",\n            \"tags\": [\n                \"postgres\",\n                \"postgresql\",\n                \"relational\"\n            ],\n            \"plan\": \"turtle\",\n            \"credentials\": {\n                \"uri\": \"postgres://seilbmbd:PHxTPJSbkcDakfK4cYwXHiIX9Q8p5Bxn@babar.elephantsql.com:5432/seilbmbd\"\n            }\n        }\n    ]\n}\n```\n\n------------------------------------\n\n# 2048\nA small clone of [1024](https://play.google.com/store/apps/details?id\u003dcom.veewo.a1024), based on [Saming\u0027s 2048](http://saming.fr/p/2048/) (also a clone).\n\nMade just for fun. [Play it here!](http://gabrielecirulli.github.io/2048/)\n\nThe official app can also be found on the [Play Store](https://play.google.com/store/apps/details?id\u003dcom.gabrielecirulli.app2048) and [App Store!](https://itunes.apple.com/us/app/2048-by-gabriele-cirulli/id868076805)\n\n### Contributions\n\n - [TimPetricola](https://github.com/TimPetricola) added best score storage\n - [chrisprice](https://github.com/chrisprice) added custom code for swipe handling on mobile\n - [elektryk](https://github.com/elektryk) made swipes work on Windows Phone\n - [mgarciaisaia](https://github.com/mgarciaisaia) added support for Android 2.3\n\nMany thanks to [rayhaanj](https://github.com/rayhaanj), [Mechazawa](https://github.com/Mechazawa), [grant](https://github.com/grant), [remram44](https://github.com/remram44) and [ghoullier](https://github.com/ghoullier) for the many other good contributions.\n\n### Screenshot\n\n\u003cp align\u003d\"center\"\u003e\n  \u003cimg src\u003d\"https://dn-coding-net-production-pp.qbox.me/b8d3bbb6-ff5c-4c8a-b528-6267c6dc4437.png\" alt\u003d\"Screenshot\"/\u003e\n\u003c/p\u003e\n\nThat screenshot is fake, by the way. I never reached 2048 :smile:\n\n## Contributing\nChanges and improvements are more than welcome! Feel free to fork and open a pull request. Please make your changes in a specific branch and request to pull into `master`! If you can, please make sure the game fully works before sending the PR, as that will help speed up the process.\n\nYou can find the same information in the [contributing guide.](https://github.com/gabrielecirulli/2048/blob/master/CONTRIBUTING.md)\n\n## License\n2048 is licensed under the [MIT license.](https://github.com/gabrielecirulli/2048/blob/master/LICENSE.txt)\n\n## Donations\nI made this in my spare time, and it\u0027s hosted on GitHub (which means I don\u0027t have any hosting costs), but if you enjoyed the game and feel like buying me coffee, you can donate at my BTC address: `1Ec6onfsQmoP9kkL3zkpB6c5sA4PVcXU2i`. Thank you very much!\n","lang":"markdown","size":4952,"previewed":true,"preview":"\u003ch1\u003eNode-2048\u003c/h1\u003e \n\u003cp\u003e这是一个修改版的 2048，添加了 NodeJS 后端，提供了可以查询和更新 MySQL 数据库中排行榜数据的 REST API。\u003c/p\u003e \n\u003cp\u003e本示例演示了怎样在应用内通过读取 \u003ccode\u003eVCAP_SERVICES\u003c/code\u003e 环境变量的值来获取服务信息并连接到服务。\u003c/p\u003e \n\u003ch3\u003e本地开发和运行\u003c/h3\u003e \n\u003col\u003e \n \u003cli\u003e安装 \u003ca href\u003d\"http://nodejs.org\" rel\u003d\"nofollow\"\u003enodejs\u003c/a\u003e 环境和 \u003ca href\u003d\"https://www.npmjs.org\" rel\u003d\"nofollow\"\u003enpm\u003c/a\u003e，具体方法请自行参考其官网文档。\u003c/li\u003e \n \u003cli\u003e在项目根目录执行 \u003ccode\u003enpm install\u003c/code\u003e 安装依赖项，然后执行 \u003ccode\u003egrunt server\u003c/code\u003e 即可启动开发服务器并调用系统浏览器打开 \u003ca href\u003d\"http://localhost:9090\" rel\u003d\"nofollow\"\u003ehttp://localhost:9090\u003c/a\u003e。\u003c/li\u003e \n \u003cli\u003e默认数使用的 MySQL 服务器地址为 \u003ccode\u003elocalhost\u003c/code\u003e，数据库为 \u003ccode\u003etest\u003c/code\u003e，用户名为 \u003ccode\u003eroot\u003c/code\u003e，密码为空。\u003c/li\u003e \n\u003c/ol\u003e \n\u003ch3\u003e演示平台部署\u003c/h3\u003e \n\u003cp\u003e本应用只需要绑定 MySQL 服务就可以直接部署并运行起来了，应用会自动进行数据库表初始化操作（见：\u003ccode\u003eindex.js\u003c/code\u003e文件）。\u003c/p\u003e \n\u003chr\u003e \n\u003ch3\u003e\u003ccode\u003eVCAP_SERVICES\u003c/code\u003e 环境变量介绍\u003c/h3\u003e \n\u003cp\u003e给应用绑定了服务，重启应用后，服务的相关信息就会被设置到 \u003ccode\u003eVCAP_SERVICES\u003c/code\u003e 的值里，该环境变量的值为 \u003ccode\u003eJSON\u003c/code\u003e 字符串，如果给一个应用绑定了多个服务或同一个服务的多个实例，它们的信息也会出现在这个环境变量的值里。\u003c/p\u003e \n\u003cblockquote\u003e \n \u003cp\u003e\u003cstrong\u003e格式说明：\u003c/strong\u003e\u003c/p\u003e \n \u003cp\u003eJSON 对象的格式为 \u003ccode\u003e服务名 -\u0026gt; 数组\u003c/code\u003e，数组内容为该服务的每个实例信息。数组的值对象中，\u003ccode\u003ename\u003c/code\u003e 为实例名，\u003ccode\u003ecredentials\u003c/code\u003e 该服务实例的连接信息，在应用中需要获取的就是 \u003ccode\u003ecredentials\u003c/code\u003e 的内容。\u003c/p\u003e \n\u003c/blockquote\u003e \n\u003ch3\u003e\u003ccode\u003eVCAP_SERVICES\u003c/code\u003e 环境变量示例\u003c/h3\u003e \n\u003cpre\u003e\u003ccode\u003e{\n    \"mysql\": [\n        {\n            \"name\": \"mysql\",\n            \"label\": \"mysql\",\n            \"tags\": [\n                \"mysql\"\n            ],\n            \"plan\": \"100mb-dev\",\n            \"credentials\": {\n                \"hostname\": \"192.168.0.134\",\n                \"port\": 3306,\n                \"name\": \"cf_a77f5575_4cd2_45d7_8744_a42b3410d362\",\n                \"username\": \"XndXUYoadzgNyBQr\",\n                \"password\": \"7hzSmuhaUEpLuQZa\",\n                \"uri\": \"mysql://XndXUYoadzgNyBQr:7hzSmuhaUEpLuQZa@192.168.0.134:3306/cf_a77f5575_4cd2_45d7_8744_a42b3410d362?reconnect\u003dtrue\",\n                \"jdbcUrl\": \"jdbc:mysql://XndXUYoadzgNyBQr:7hzSmuhaUEpLuQZa@192.168.0.134:3306/cf_a77f5575_4cd2_45d7_8744_a42b3410d362\"\n            }\n        }\n    ],\n    \"elephantsql\": [\n        {\n            \"name\": \"elephantsql-c6c60\",\n            \"label\": \"elephantsql\",\n            \"tags\": [\n                \"postgres\",\n                \"postgresql\",\n                \"relational\"\n            ],\n            \"plan\": \"turtle\",\n            \"credentials\": {\n                \"uri\": \"postgres://seilbmbd:PHxTPJSbkcDakfK4cYwXHiIX9Q8p5Bxn@babar.elephantsql.com:5432/seilbmbd\"\n            }\n        }\n    ]\n}\n\u003c/code\u003e\u003c/pre\u003e \n\u003chr\u003e \n\u003ch1\u003e2048\u003c/h1\u003e \n\u003cp\u003eA small clone of \u003ca href\u003d\"https://play.google.com/store/apps/details?id\u003dcom.veewo.a1024\" rel\u003d\"nofollow\"\u003e1024\u003c/a\u003e, based on \u003ca href\u003d\"http://saming.fr/p/2048/\" rel\u003d\"nofollow\"\u003eSaming\u0027s 2048\u003c/a\u003e (also a clone).\u003c/p\u003e \n\u003cp\u003eMade just for fun. \u003ca href\u003d\"http://gabrielecirulli.github.io/2048/\" rel\u003d\"nofollow\"\u003ePlay it here!\u003c/a\u003e\u003c/p\u003e \n\u003cp\u003eThe official app can also be found on the \u003ca href\u003d\"https://play.google.com/store/apps/details?id\u003dcom.gabrielecirulli.app2048\" rel\u003d\"nofollow\"\u003ePlay Store\u003c/a\u003e and \u003ca href\u003d\"https://itunes.apple.com/us/app/2048-by-gabriele-cirulli/id868076805\" rel\u003d\"nofollow\"\u003eApp Store!\u003c/a\u003e\u003c/p\u003e \n\u003ch3\u003eContributions\u003c/h3\u003e \n\u003cul\u003e \n \u003cli\u003e\u003ca href\u003d\"https://github.com/TimPetricola\" rel\u003d\"nofollow\"\u003eTimPetricola\u003c/a\u003e added best score storage\u003c/li\u003e \n \u003cli\u003e\u003ca href\u003d\"https://github.com/chrisprice\" rel\u003d\"nofollow\"\u003echrisprice\u003c/a\u003e added custom code for swipe handling on mobile\u003c/li\u003e \n \u003cli\u003e\u003ca href\u003d\"https://github.com/elektryk\" rel\u003d\"nofollow\"\u003eelektryk\u003c/a\u003e made swipes work on Windows Phone\u003c/li\u003e \n \u003cli\u003e\u003ca href\u003d\"https://github.com/mgarciaisaia\" rel\u003d\"nofollow\"\u003emgarciaisaia\u003c/a\u003e added support for Android 2.3\u003c/li\u003e \n\u003c/ul\u003e \n\u003cp\u003eMany thanks to \u003ca href\u003d\"https://github.com/rayhaanj\" rel\u003d\"nofollow\"\u003erayhaanj\u003c/a\u003e, \u003ca href\u003d\"https://github.com/Mechazawa\" rel\u003d\"nofollow\"\u003eMechazawa\u003c/a\u003e, \u003ca href\u003d\"https://github.com/grant\" rel\u003d\"nofollow\"\u003egrant\u003c/a\u003e, \u003ca href\u003d\"https://github.com/remram44\" rel\u003d\"nofollow\"\u003eremram44\u003c/a\u003e and \u003ca href\u003d\"https://github.com/ghoullier\" rel\u003d\"nofollow\"\u003eghoullier\u003c/a\u003e for the many other good contributions.\u003c/p\u003e \n\u003ch3\u003eScreenshot\u003c/h3\u003e \n\u003cp\u003e \u003cimg src\u003d\"https://dn-coding-net-production-pp.qbox.me/b8d3bbb6-ff5c-4c8a-b528-6267c6dc4437.png\" alt\u003d\"Screenshot\"\u003e \u003c/p\u003e \n\u003cp\u003eThat screenshot is fake, by the way. I never reached 2048 \u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/smile.png\" title\u003d\"smile\"\u003e\u003c/p\u003e \n\u003ch2\u003eContributing\u003c/h2\u003e \n\u003cp\u003eChanges and improvements are more than welcome! Feel free to fork and open a pull request. Please make your changes in a specific branch and request to pull into \u003ccode\u003emaster\u003c/code\u003e! If you can, please make sure the game fully works before sending the PR, as that will help speed up the process.\u003c/p\u003e \n\u003cp\u003eYou can find the same information in the \u003ca href\u003d\"https://github.com/gabrielecirulli/2048/blob/master/CONTRIBUTING.md\" rel\u003d\"nofollow\"\u003econtributing guide.\u003c/a\u003e\u003c/p\u003e \n\u003ch2\u003eLicense\u003c/h2\u003e \n\u003cp\u003e2048 is licensed under the \u003ca href\u003d\"https://github.com/gabrielecirulli/2048/blob/master/LICENSE.txt\" rel\u003d\"nofollow\"\u003eMIT license.\u003c/a\u003e\u003c/p\u003e \n\u003ch2\u003eDonations\u003c/h2\u003e \n\u003cp\u003eI made this in my spare time, and it\u0027s hosted on GitHub (which means I don\u0027t have any hosting costs), but if you enjoyed the game and feel like buying me coffee, you can donate at my BTC address: \u003ccode\u003e1Ec6onfsQmoP9kkL3zkpB6c5sA4PVcXU2i\u003c/code\u003e. Thank you very much!\u003c/p\u003e","lastCommitMessage":"update README.md","lastCommitDate":1403610510000,"lastCommitId":"d996ee7acce26daa59ea81248bf537d9359e4468","lastCommitter":{"name":"demo","email":"demo@coding.net","avatar":"https://dn-coding-net-production-static.qbox.me/eb160ca8-9bb9-4df1-a577-c712e45b2882.jpg?imageMogr2/auto-orient/format/jpeg/crop/!323x323a8a0","link":"/u/demo"},"mode":"file","path":"README.md","name":"README.md"},"lastCommit":{"fullMessage":"validate score and sanitize name\n","shortMessage":"validate score and sanitize name","commitId":"4768fed095cac6386b965191fbe3328ca260fc87","commitTime":1405694702000,"committer":{"name":"tsl0922","email":"tsl0922@gmail.com","avatar":"https://dn-coding-net-production-static.qbox.me/9242be0e48f6e35e0e98804bb9d381c8.jpg","link":"/u/tsl0922"}}}};

        var commit       = data.data,
            lastCommit = commit.lastCommit,
            files        = commit.files,
            readme       = commit.readme.preview;

        var lastCommitElement = '<span class="panel-title"><img src="' + lastCommit.committer.avatar + '" height="20" width="20"> ' + lastCommit.committer.name + ' </span>' +
                                '<span class="comment-meta"> '+ lastCommit.shortMessage + ' </span>';

        $('.comment-hash').text(lastCommit.commitId.substr(0,10));

        $('#project_code > .panel-heading').html(lastCommitElement);
        $('#project_readme > .panel-body').html(readme);

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
        events: ['longTap', 'swipe'],
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
