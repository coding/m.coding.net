/**
 * Created by simonykq on 21/12/2014.
 */
var MY_PROJECT_ATTACHMENT_ROUTE = (function(){

    var pageCount = 0;
    var fileCounts = null;
    var $container = null;
    var projectData = null;
    var fileId = null;
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
            if(fileId===undefined||fileId===null){
            } else {
                loadFiles();
            }
        };
        coding.get(path, success);
    }

    function assembleDOM(data){
        if(fileId===undefined||fileId===null) data = addDefaultFolder(data);
        if(!data || !data.list || !data.list.length) return;
        data.projectHomeURL = coding.projectHomePath(ownerName, projectName);
        if(!(fileId===undefined||fileId===null)){
            var list = [];
            if(fileId*1>0){
                for(var i =0;i<data.list.length;i++){
                    if(data.list[i].file_id==fileId){
                        list = data.list[i].sub_folders;
                    }
                }
            }
            data.list = list;
        }

        // 创建者
        for (var index = 0; index < data.list.length; index++) {
            var element = data.list[index];
            data.list[index].project_name = projectName;
            data.list[index].project_owner_name = ownerName;
            if(fileCounts){
                $.each(fileCounts, function(i, v){
                    console.log(v);
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
    function loadFiles(type) {
        coding.loading();

        pageCount++;

        //var path = '/api/user/' + ownerName + '/project/' + projectName + '/folder/'+fileId+'/files';
        var path = '/api/project/'+ projectData.id + '/files/'+fileId;
        path += '?page=' + pageCount + '&' + 'pageSize=20';
        var success = function(data){
            if(data.data){
                assembleFileDOM(data.data);
            }
        };
        coding.get(path, success, null, coding.loadingDone);
    }
    function assembleFileDOM(data){
        if(fileId===undefined||fileId===null) data = addDefaultFolder(data);
        if(!data || !data.list || !data.list.length) return;
        data.projectHomeURL = coding.projectHomePath(ownerName, projectName);

        // 创建者
        for (var index = 0; index < data.list.length; index++) {
            var element = data.list[index];
            data.list[index].project_name = projectName;
            data.list[index].display = element.owner.name + ' 创建于' + moment(element.created_at).fromNow();

            data.list[index].isImage = (element.type == 2);

            var size = element.size;
            if(size < 1024){
                size = size.toFixed(2) + ' bytes';
            } else if (size < 1024*1024){
                size = (size/1024).toFixed(2) + ' KB';
            } else if (size < 1024*1024*1024){
                size = (size/1024*1024).toFixed(2) + ' M';
            } else if (size < 1024*1024*1024*1024){
                size = (size/1024*1024*1024).toFixed(2) + ' G';
            }
            data.list[index].size_display = size;
            data.list[index].download_url = API_DOMAIN + '/api/user/' + ownerName + '/project/' +
                projectName + '/files/' + data.list[index].file_id + '/download';
        }

        var rendered = Mustache.render($('#tlistfile').html(), data);
        $('#tcontainer').append(rendered);
    }

    // 跟目录中增加[默认文件夹]
    function addDefaultFolder(data) {
        if(!data.list || !data.list.length) data.list = [];
        if(fileId===undefined||fileId===null){
            data.list.unshift({project_name:projectName, name: "默认文件夹", file_id:0, owner_name:ownerName, isDefault:true})
        }
        return data;
    }

    return {
        template_url: '/views/my_project_attachment.html',
        context: ".container",
        before_enter: function(user, project, id){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            pageCount = 0;
            fileId = id;
        },
        on_enter: function(user, project, id){

            ownerName = user;
            projectName = project;
            fileId = id;

            if(fileId===undefined||fileId===null){
                $("#load_more").hide();
            } else {
                $("#load_more").show();
            }


            loadProject();
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadFiles();
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
