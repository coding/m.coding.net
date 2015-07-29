var MY_PROJECT_TASK_CREATE_ROUTE = (function(){

    var pageSize  = 20,
        pageCount = 0,
        ownerName = '',
        projectName = '',
        projectData = null,
        taskId = null,
        task = {},
        taskCounts = null,
        members = null,
        deadline = moment(),
        $container = null;
       
    var task = {priority:1};
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
                loadMembers();
                assembleDOM();
            }
        }
       coding.get(path,successed);
    }

    function loadMembers(){
        var path = '/api/project/' + projectData.id + '/members?page=1&pageSize=9999';
        var successed = function(data){
            if(data.data){
                for (var index = 0; index < data.data.list.length; index++) {
                    var element = data.data.list[index];
                    if(element.type == 100){
                        data.data.list[index].isCreator = true;
                    }
                    if(element.user.avatar.substr(0,1) === '/'){
                        data.data.list[index].user.avatar = API_DOMAIN + element.user.avatar;
                    }
                } 
                members = data.data;
            }
        };
        coding.get(path, successed, null, null, {async:false});
    }


    
    function setPopUp(itemId, popupContainer, container, templateId, itemClass, data) {
        if(templateId){
            var rendered = Mustache.render($(templateId).html(), data);
            $(container).html(rendered);    
        }
        $(itemId).on('click', function(e){
            e.preventDefault();
            $(popupContainer).show(); 
        });
        $(popupContainer).on('click', function(e){
            e.preventDefault();
            $(this).hide(); 
        });
        if(itemClass){
            $(itemClass).on('click', function(){
                var key = $(this).attr('data-update-key');
                var val = $(this).attr('data-update-value');
                var d = {key:key, value:val};
                updateTask(d);
                $(popupContainer).hide();
            });
        }
    }
    
    function updateTask(data) {
        task[data.key] = data.value;
        if(data.key == 'owner_id'){
            $.each(members.list, function(i, v){
                console.log(v)
               if(v.user.id == data.value){
                   task.owner = v.user;
               } 
            });
        }
        assembleDOM();
    }
    
    function assembleDOM(data){
        data = data || task;
        data.project_name = projectName;
        
        var d = moment(data.created_at);
        //data.deadline_display = d.format("MM月DD日")
        data.display = d.fromNow();
        data.status_display = data.status == 2 ? '已完成':'未完成';
        data.priority_display = data.priority == 0 && '有空看看' 
            || data.priority == 1 && '正常处理'
            || data.priority == 2 && '优先处理'
            || data.priority == 3 && '十万火急';
        
        $container = $('#tcontainer');
        var template = $('#tlist').html();
        Mustache.parse(template);   // optional, speeds up future uses
        var rendered = Mustache.render(template, data);
        
        $container.html(rendered);
        
        deadline = data.deadline? moment(data.deadline, "YYYY-MM-DD"):moment();
        setDatePicker();
        
        setPopUp("#task_owner", "#member_container", "#member_list", "#tmember", ".member-item", members);
        setPopUp("#task_priority", "#priority_container", "#priority_list", "#tpriority", ".priority-item", {list:priority_list});
        setPopUp("#task_status", "#status_container", null, null, ".status-item", null);
        $("#task_deadline").on('click', function(){
           $("#deadline_container").show(); 
        });
        $("#task_content").on('keyup', function(){
            task.content = $(this).val(); 
        });        
    }
    
    function changeDate(e) {
        e.preventDefault();
        var target = $(this).attr('data-target');
        var step = $(this).attr('data-step');
        deadline.add(step*1, target);
        setDatePicker();
    }
    
    function setDatePicker(){
        $("#dp_display").text(deadline.format("YYYY年MM月DD日 ddd"));
        $("#dp_year").text(deadline.format("YYYY"));
        $("#dp_month").text(deadline.format("MM"));
        $("#dp_date").text(deadline.format("DD"));
    };
    
    function createTask() {
        var content = $('#task_content').val();
        if(!$.trim(content)){
            alert('请输入内容!');
            return;
        }
        
        var path = '/api/user/' + ownerName +'/project/' + projectName + '/task';
        var data = {owner_id: task.owner_id, priority:task.priority, content:content, deadline:task.deadline||''};
        coding.post(path, data, function(res){
           router.run.call(router, coding.projectHomePath(ownerName, projectName)+'/task/'+res.data.id); 
        });
    }
    
    return {
        template_url: '/views/my_project_task_create.html',
        context: ".container",
        before_enter: function(user, project){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            
            pageCount = 0;
            task.owner_id = router.current_user.id;
        },
        on_enter: function(user, project, id){
            ownerName = user;
            projectName = project;
            taskId = id;
            
            task.creator = router.current_user;
            task.owner = router.current_user;

            loadProject();
            
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadMore();
            });
            
            setDatePicker();

            $(".dp_arrow").on('click', changeDate);
            $("#dp_cancel").on('click', function(){
                $("#deadline_container").hide()
            });
            $("#dp_clear").on('click', function(){
                updateTask({key:'deadline', value:''});
                $("#deadline_container").hide();
            });
            $("#dp_ok").on('click', function(){
                updateTask({key:'deadline', value:deadline.format('YYYY-MM-DD')});
                $("#deadline_container").hide();
            });            
            $("#create_task").on('click', createTask);

        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            $('.project_header').remove();
            coding.showBanner();
        }
    }

})();
