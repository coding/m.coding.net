var MY_PROJECT_TOPICS_ROUTE = (function(){

    var pageSize  = 10,
        pageCount = 0,
        ownerName = '',
        projectName = '',        
        $container = null;
        currentType = '';
    var lastType = "all";
    var type_desc = {
        "Project": "项目",
        "ProjectTopic": "讨论",
        "ProjectMember": "项目成员",
        "ProjectFile": "文件",
        "Task": "任务"
    };
    
    var type_list = {'all':'全部讨论','mine':'我的讨论'};
    
    function loadProject(){
       var path = '/api/user/' + ownerName + '/project/' + projectName;
       coding.get(path, function(data){
          if(data.data){
              coding.showProjectBreadcrumb(data.data);
              projectData = data.data;
              loadMore();
          }
	  });
    }
    
    function assembleDOM(data){
        if(!data || !data.list || !data.list.length) return;  
        data.projectHomeURL = coding.projectHomePath(ownerName, projectName);
        for (var index = 0; index < data.list.length; index++) {
            var element = data.list[index];
            data.list[index].project_name = projectName;
            data.list[index].display = element.owner.name + ' 创建于' + moment(element.created_at).fromNow();
        }

        var rendered = Mustache.render($('#tlist').html(), data);
        $('#tcontainer').append(rendered);
    }


    function loadMore(){

        coding.loading();
                
        pageCount++;
                
        var path = '/api/project/' + projectData.id + '/topics';
        if(lastType == 'all'){
            path += '?_=_';
        }else{
            path += '/me?_=_'
        }
        path += '&page=' + pageCount + '&' + 'pageSize=20';
        coding.get(path, function(data){
            if(data.data){
                if(pageCount===1&&data.data.list.length){
                    $("#load_more").show();
                }
                if(pageCount===1&&!data.data.list.length){
                    $("#bg-image").show();
                }
                assembleDOM(data.data);
            }
        },null, coding.loadingDone);

    }

    return {
        template_url: '/views/my_project_topics.html',
        context: ".container",
        before_enter: function(user, project, type){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            pageCount = 0;
        },
        on_enter: function(user, project, type){
            ownerName = user;
            projectName = project;
            lastType = type || 'all';

            var path = coding.projectHomePath(ownerName, projectName);
            var data = {list:[]};
            $.each(type_list, function(k,v){
               data.list.push({href:path+'/topics/'+k,name:v,active:k==lastType});
            });

            $("#create_topic").attr('href', path+'/topic/'+'create')

            var rendered = Mustache.render($('#theader').html(), data);
            $("nav.main-navbar").after(rendered);
                        
            
            loadProject();
            
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadMore();
            });
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            $('.project_header').remove();
            coding.showBanner();
        }
    }

})();
