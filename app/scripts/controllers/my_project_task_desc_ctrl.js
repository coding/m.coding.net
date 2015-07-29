var MY_PROJECT_TASK_DESC_ROUTE = (function(){

    var pageSize  = 20,
        pageCount = 0,
        ownerName = '',
        projectName = '',
        projectData = null,
        taskId = null,
        taskCounts = null,
        members = null,
        deadline = moment(),
        $container = null;

    var priority_list = [
        {name:'十万火急',level:3, images:[{isFirst:true,image:'priority.png'},{image:'priority.png'},{image:'priority.png'}]},
        {name:'有线处理',level:2, images:[{isFirst:true,image:'priority.png'},{image:'priority.png'},{image:'priority_gray.png'}]},
        {name:'正常处理',level:1, images:[{isFirst:true,image:'priority.png'},{image:'priority_gray.png'},{image:'priority_gray.png'}]},
        {name:'有空看看',level:0, images:[{isFirst:true,image:'priority_gray.png'},{image:'priority_gray.png'},{image:'priority_gray.png'}]},
    ];

    function loadProject(){
        var path = '/api/user/' + ownerName + '/project/' + projectName;
        var successed = function(data){
            if(data.data){
                coding.showProjectBreadcrumb(data.data);
                projectData = data.data;
                getTask();
            }
        }
       coding.get(path,successed);
    }
    
    function getTask() {
        var path = '/api/project/' + projectData.id + '/task/'+taskId;
        var successed = function(data){
            if(data.data){
                $("#task_content").html(data.data.content);
                if(data.data.has_description){
                   getTaskDesc();
                }
             
            }
        };
        coding.get(path,successed);
    }
    function getTaskDesc() {
        var path = '/api/task/'+taskId+'/description';
        var successed = function(data){
            if(data.data){
                $("#task_desc").html(data.data.description);
            }
        };
        coding.get(path,successed);
    }

    
    return {
        template_url: '/views/my_project_task_desc.html',
        context: ".container",
        before_enter: function(user,project){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            
            pageCount = 0;
        },
        on_enter: function(user, project, id){
            ownerName = user;
            projectName = project;
            taskId = id;
            loadProject();
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            $('.project_header').remove();
            coding.showBanner();
        }
    }

})();
