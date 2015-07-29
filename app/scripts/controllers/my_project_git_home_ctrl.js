/**
 * Created by simonykq on 21/12/2014.
 */
var MY_PROJECT_GIT_HOME_ROUTE = (function(){
    
    var pageCount = 0;
    var fileCounts = null;
    var $container = null;
    var projectData = null;
    var ownerName = "";
    var projectName = "";
    var lastType = "home";
    
    var type_list = {'home':'项目介绍','code':'阅读代码', 'merge':'合并请求'};

    var type_desc = {
        "Project": "项目",
        "ProjectTopic": "讨论",
        "ProjectMember": "项目成员",
        "ProjectFile": "文件",
        "Task": "任务"
    };
    
    function loadProject(){
       var path = '/api/user/' + ownerName + '/project/' + projectName;
       var success = function(data){
          if(data.data){
              coding.showProjectBreadcrumb(data.data);
              projectData = data.data;
              getProjectMaster();
          }
	   };
       coding.get(path, success);
    }
    
    function getProjectMaster() {
        var success = function(data){
            if(data.data){
                assembleDOM(data.data);
            }
        };
        coding.get('/api/user/' + ownerName + '/project/' + projectName+'/git/tree/master', success);
    }
    
    function assembleDOM(data){
        data.project = projectData;
        data.project.short_description = coding.truncateText(projectData.description);
        data.project.icon = coding.assetPath(projectData.icon);
        var rendered = Mustache.render($('#tlist').html(), data);
        $("#tcontainer").html(rendered);
    } 

    return {
        template_url: '/views/my_project_git_home.html',
        context: ".container",
        before_enter: function(user, project, id){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');            
            pageCount = 0;
            lastType = "home;"
            
        },
        on_enter: function(user, project, type){
            ownerName = user;
            projectName = project;
            lastType = type || 'home';
            
            var path = coding.projectHomePath(ownerName, projectName)+'/git/';
            var data = {list:[]};
            $.each(type_list, function(k,v){
               data.list.push({href:path+k,name:v,active:k==lastType});
            });

            var rendered = Mustache.render($('#theader').html(), data);
            $("nav.main-navbar").after(rendered);
            
            loadProject();
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadFolders();
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
