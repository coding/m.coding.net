/**
 * Created by simonykq on 21/12/2014.
 */
var MY_PROJECT_ATTACHMENT_LIST_ROUTE = (function(){
    
    var pageCount = 0;
    var fileCounts = null;
    var $container = null;
    var projectData = null;
    var ownerName = "";
    var projectName = "";
    
    var fileTypeList = ['png','jpg','jpeg','gif','bmp'];

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
              loadFolders();
          }
	   };
       coding.get(path, success);
    }
    
    function getFileCount() {
        var success = function(data){
            if(data.data){
                fileCounts = data.data;
            }
        };
        coding.get('/api/project/'+projectData.id+'/folders/all_file_count', success, null, null, {async:false});
    }
    
    function loadFolders() {
        coding.loading();
        
        var path = '/api/project/'+projectData.id+'/all_folders';
        path += '?page=1&pageSize=1000';
        var success = function(data){
            // 未在API中带出文件数量, 只能另一个ajax取了..
            getFileCount();
            
            if(data.data){
                assembleDOM(data.data);
            }
        };
        coding.get(path, success);
    }
    function assembleDOM(data){
        if(!data.list || !data.list.length) data.list = [];
        data.list.unshift({project_name:projectName, name: "默认文件夹", file_id:0, owner_name:ownerName, isDefault:true});
        data.projectHomeURL = coding.projectHomePath(ownerName, projectName);
        
        // 创建者
        for (var index = 0; index < data.list.length; index++) {
            var element = data.list[index];
            data.list[index].project_name = projectName;
            data.list[index].project_owner_name = ownerName;
            if(fileCounts){
                $.each(fileCounts, function(i, v){
                    if(v.folder==element.file_id) data.list[index].file_count = v.count;
                })
            }
        }

        $container = $('#tcontainer');
        var template = $('#tlist').html();
        Mustache.parse(template);   // optional, speeds up future uses
        var rendered = Mustache.render(template, data);
        
        $container.append(rendered);
    } 

    return {
        template_url: '/views/my_project_attachment_list.html',
        context: ".container",
        before_enter: function(user, project, id){
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
                loadFolders();
            });
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            lastType = currentType; //remember the type set last time;
            coding.showBanner();
        }
    }

})();
