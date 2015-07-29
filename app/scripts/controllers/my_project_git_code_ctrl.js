/**
 * Created by simonykq on 21/12/2014.
 */
var MY_PROJECT_GIT_CODE_ROUTE = (function(){
    
    var pageCount = 0;
    var fileCounts = null;
    var $container = null;
    var projectData = null;
    var ownerName = "";
    var projectName = "";
    var commit = 'master';
    var treePath = '';
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
              getTreeInfo();
          }
	   };
       coding.get(path, success);
    }
    
    function getTreeInfo() {
        var success = function(data){
            if(data.data){
                assembleDOM(data.data);
            }
        };
        var path = '/api/user/' + ownerName + '/project/' + projectName+'/git/treeinfo';
        path += '/'+commit;
        if(treePath){
            path += '/'+treePath;
        }
        
        coding.get(path, success);
    }
    
    function assembleDOM(data){
        if(!data.infos || !data.infos.length) return;
        for(var i = 0; i <　data.infos.length; i++){
            data.infos[i].isFolder = data.infos[i].mode == 'tree';
            data.infos[i].isFile = data.infos[i].mode == 'file';
            data.infos[i].isImage = data.infos[i].mode == 'image';
            data.infos[i].last_commit_display = moment(data.infos[i].lastCommitDate).fromNow();
            var path = coding.projectHomePath(ownerName, projectName) + '/git/';
            path += data.infos[i].isFolder ? 'code/':'blob/';
            path += commit + '/';
            path += data.infos[i].path.replace(/\//g,'%2F')
            data.infos[i].redirectURL = path;

        }
        
        var rendered = Mustache.render($('#tlist').html(), data);
        $('#tcontainer').html(rendered);

    } 

    return {
        template_url: '/views/my_project_git_code.html',
        context: ".container",
        before_enter: function(user, project, id){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');            
            pageCount = 0;
            lastType = "code";
            commit = "master";
            treePath = "";
            
        },
        on_enter: function(user, project, commit, path){
            ownerName = user;
            projectName = project;
            lastType = 'code';
            commit = commit;
            treePath = (path || '').replace(/%2F/g,'/');
            
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
