var MY_PROJECT_TASKS_ROUTE = (function(){

    var pageSize  = 20,
        pageCount = 0,
        ownerName = '',
        projectName = '',
        projectData = null,
        taskCounts = null,
        userName = null,
        $container = null;


    function loadProject(){
        var path = '/api/user/' + ownerName + '/project/' + projectName;
        var successed = function(data){
            if(data.data){
                coding.showProjectBreadcrumb(data.data);
                projectData = data.data;
                getUserTaskCount();
                loadProcessingTasks();
                loadDoneTasks();
            }
        }
       coding.get(path,successed);
    }
    
    function getUserTaskCount() {
        var path = '/api/project/' + projectData.id + '/task/user/count';
        var successed = function(data){
            if(data.data){
                taskCounts = data.data;
            }
            loadMembers();
        };
        coding.get(path,successed);
    }
    
    function loadMembers(){
        var path = '/api/project/' + projectData.id + '/members?page=1&pageSize=9999';
        var successed = function(data){
            if(data.data){
                setMenu(data.data);    
            }
        };
        coding.get(path, successed);
    }
    function setMenu(data){
        // 只显示有任务的人员
        var tasks = [];
        var current_user = null;
        var selected_user = null;

        for(var i =0;i<data.list.length;i++){
            var cnt = 0;
            data.list[i].user.avatar = coding.assetPath(data.list[i].user.avatar);
            if(taskCounts && taskCounts.length){
                for(var j = 0; j<taskCounts.length;j++){
                    if(data.list[i].user_id == taskCounts[j].user){
                         cnt = taskCounts[j].processing+taskCounts[j].done;
                    }    
                }
            }
            data.list[i].task_count = cnt;
            if(data.list[i].user_id*1 == router.current_user.id*1)
                current_user = data.list[i]; 
            if(data.list[i].user.global_key == userName)
                selected_user = data.list[i].user;
            if(cnt) // 只显示有任务的
                tasks.push(data.list[i]);
        }


        var tData = {userName:ownerName, 
            projectName:projectName, 
            selected_user: selected_user, 
            current_user:current_user, 
            list:tasks,
            projectHomeURL: coding.projectHomePath(ownerName, projectName)
        };
        var rendered = Mustache.render($('#theader').html(), tData);
        $("nav.main-navbar").after(rendered); 

    }

    
    function loadProcessingTasks(){
        var path = '/api/user/' + ownerName + '/project/' + projectName + '/tasks';
        if(userName){
            path += '/user/'+userName;
        }
        path +='/processing?page=1&pageSize=9999';
        coding.get(path, assembleProcessingDOM);
    }
    
    function loadDoneTasks(){
        coding.loading();
        var path = '/api/user/' + ownerName + '/project/' + projectName + '/tasks';
        if(userName){
            path += '/user/'+userName;
        }
        path += '/done';
        
        pageCount++;
        
        path += '?page=' + pageCount + '&' + 'pageSize='+pageSize;
        coding.get(path, assembleDoneDOM, null, coding.loadingDone);
    }

    function assembleProcessingDOM(data) {
        if(data.data.list&&data.data.list.length){
            data.data.list[0].hideFirstLine = true;
        }
        
        $("#tprocessing").html('');
        if(data.data.list.length){
            $("#task_container").show();
        }
        
        assembleDOM(data.data, '#tprocessing', '#tlist');
    }
    function assembleDoneDOM(data) {
        if(pageCount === 1 && data.data.list&&data.data.list.length){
            data.data.list[0].hideFirstLine = true;
        }
        if(data.data.list.length){
            $("#task_container").show();
        }
        assembleDOM(data.data, '#tdone', '#tlist');
    }
    function assembleDOM(data, container, template){
        if(!data || !data.list || !data.list.length) return;
        data.projectHomeURL = coding.projectHomePath(ownerName, projectName);
        
        for (var index = 0; index < data.list.length; index++) {
            var element = data.list[index];
            data.list[index].project_name = projectName;
            
            var d = moment(element.created_at);
            var dt = moment(element.deadline, "YYYY-MM-DD");
            
            data.list[index].deadline_display = dt.format("MM/DD")
            data.list[index].display = d.fromNow();
            
            data.list[index].owner.avatar = coding.assetPath(data.list[index].owner.avatar); 
            
            var deadline_style = '';
            if(element.status == 2){
                deadline_style = 'done';
            } else if (moment().add(1, 'days').format("YYYYMMDD") == dt.format("YYYYMMDD")){
                deadline_style = 'tomorrow';
            } else if (moment().format("YYYYMMDD") == dt.format("YYYYMMDD")){
                deadline_style = 'today';
            } else if (moment().format("YYYYMMDD") > dt.format("YYYYMMDD")){
                deadline_style = 'expired';
            }
            data.list[index].deadline_style = deadline_style;
            data.list[index].isDone = element.status == 2;
            
            data.list[index].priority_list = [];
            for(var t = 0; t<element.priority;t++)
                data.list[index].priority_list.push({color:'#f24b4b', image:'priority.png'});
            for(var t = 0; t<3-element.priority;t++)
                data.list[index].priority_list.push({color:'#c3d3da', image:'priority_gray.png'});
            data.list[index].priority_list[0].isFirst = true;
        }

        var rendered = Mustache.render($(template).html(), data);
        $(container).append(rendered);
    }
    
    function updateTaskStatus(e){
        e.preventDefault();
        var status = this.checked ? 2 : 1;
        var id = $(this).attr('data-task-id');
        var path = '/api/task/'+id+'/status';
        coding.put(path, {status: status}, function(data){
            pageCount = 0;
            $("#tprocessing").html('');
            $("#tdone").html('');
            loadProcessingTasks();
            loadDoneTasks();
        });
    }   
     
    return {
        template_url: '/views/my_project_tasks.html',
        context: ".container",
        before_enter: function(user, project, member){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            pageCount = 0;
            $('#tprocessing').html('');
            $('#tdone').html('');
            $("#task_container").hide();
        },
        on_enter: function(user, project, member){
            ownerName = user;
            projectName = project;
            userName = member;

            $("#create_task").attr('href', coding.projectHomePath(ownerName, projectName)+'/task/create');
            
            loadProject();
            
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadDoneTasks();
            });
            
            $(document).on('change', '.task-status-checkbox', updateTaskStatus);
        },
        on_exit: function(){
            $(document).off('change', '.task-status-checkbox');
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            $('.project_header').remove();
            $("#taskHeader").remove();
            coding.showBanner();
        }
    }

})();
