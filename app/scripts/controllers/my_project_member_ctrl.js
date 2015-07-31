var MY_PROJECT_MEMBERS_ROUTE = (function(){

    var pageSize  = 10;
    var pageCount = 0;
    var $container = null;
    var projectData = null;
    var ownerName = "";
    var projectName = "";

    var type_desc = {
        "Project": "项目",
        "ProjectTopic": "讨论",
        "ProjectMember": "项目成员",
        "ProjectFile": "文件",
        "Task": "任务"
    };

    function loadProject(){

       var path = '/api/user/' + ownerName + '/project/' + projectName;
       coding.get(path, function(data){
          if(data.data){
              coding.showProjectBreadcrumb(data.data);
              projectData = data.data;
              loadMembers();
          }
	  });
    }

    function loadMembers() {
        coding.loading()
        
        pageCount++;
        
        var path = '/api/project/' + projectData.id + '/members';
        path += '?page=' + pageCount + '&' + 'pageSize=' + pageSize;
        coding.get(path, function(data){
            if(data.data){
                assembleDOM(data.data);
            }
        }, null, coding.loadingDone);
    }

    function assembleDOM(data){
        if(!data || !data.list || !data.list.length) return;  
        
        // 创建者
        for (var index = 0; index < data.list.length; index++) {
            var element = data.list[index];
            if(element.type == 100){
                data.list[index].isCreator = true;
            }
            if(element.user.avatar.substr(0,1) === '/'){
                data.list[index].user.avatar = API_DOMAIN + element.user.avatar;
            }
        }   


        var rendered = Mustache.render($('#tlist').html(), data);
        $('#members').append(rendered);
    }

    return {
        template_url: '/views/my_project_members.html',
        context: ".container",
        before_enter: function(user, project){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            
            pageCount = 0;
        },
        on_enter: function(user, project){
            ownerName = user;
            projectName = project;
            
            loadProject();
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadMembers();
            });
            
            
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            coding.showBanner();
        }
    }

})();
