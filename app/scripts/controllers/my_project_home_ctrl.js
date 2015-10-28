var MY_PROJECT_HOME_ROUTE = (function(){

    var lastType  = 'public';
    var $container = null;
    var projectData = null;
    var activities = [];
    var lastActivities = null;
    var ownerName = "";
    var projectName = "";

    function loadProject(){
        var path = '/api/user/' + ownerName + '/project/' + projectName;
        var successed = function(data){
            if(data.data){
                  coding.showProjectBreadcrumb(data.data);
                  projectData = data.data;
                  loadActivities();
            }
        };
        coding.get(path, successed);
    }

    function loadActivities() {
        coding.loading();
        
        var path = '/api/project/' + projectData.id + '/activities?type=all&user_id='+router.current_user.id;
        if(lastActivities){
            path += "&last_id=" + lastActivities.id;
        }
        var successed = function(data){
            if(data.data){
                activities = data.data;
                assembleDOM();
            }
        }
        coding.get(path, successed, null, coding.loadingDone);

    }

    function assembleDOM(data){
        if(!activities) return;
        
        var list = {list:converActivities(data)};     

        var rendered = Mustache.render($('#tlist').html(), list);
        $('#activities').append(rendered);

        var renderedDescription = Mustache.render($('#tlist-project-description').html(), projectData);
        $('#project_description').append(renderedDescription);
    }

    function converActivities(){
        var list = [];
        for(var i=0;i<activities.length;i++){
            var c = activities[i],
                m = moment(c.created_at),
                d = m.format("YYYY-MM-DD");
                wk = m.format("ddd");
            
            var header = d + " "+wk;
            if(moment().add(-1, 'days').format("YYYY-MM-DD") == d){
                header += " (昨天)";
            }
            if(moment().format("YYYY-MM-DD") == d){
                header += " (今天)";
            }
            c.header = header;     
            c.display = m.format("A hh:mm");
            c.date = d;
            
            c = coding.addActivityData(c);
            
            // 修正相对路径图片
            if(c.user.avatar.substr(0,1) === '/'){
                c.user.avatar = API_DOMAIN + c.user.avatar;
            }
            // 修复缺失的content
            if(!c.content){
                if(c.target_type=="Project"){
                    c.content = c.project.name;
                }else if(c.target_type == "ProjectMember"){
                    c.content = c.target_user.name;
                }
            }
            
            // 文件夹和文件用相同的type?
            // 只能修复了....
            if(c.target_type=="ProjectFile" &&c.type=="dir"){
                c.target_type_desc += "夹";
            }
            
            c.showHeader = !lastActivities || lastActivities.date !== c.date;
            
            list.push(c);
            lastActivities = c;
        }
        
        // 未读动态
        if(projectData.un_read_activities_count){
            for(var i = 0; i < list.length;i++){
                if(i < projectData.un_read_activities_count){
                    list[i].isUnread = true;
                }
            }
        }
        
        return list;
    }

    return {
        template_url: '/views/my_project_home.html',
        context: ".container",
        before_enter: function(user, project){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            
            lastActivities = null;
        },
        on_enter: function(user, project){
            ownerName = user;
            projectName = project;
            
            var path = coding.projectHomePath(user, project);
            $("#home_nav_activities").on('click', function(){
               router.run.call(router,  path+'/activities/all'); 
            });         
            $("#home_nav_task").on('click', function(){
               router.run.call(router,  path+'/tasks'); 
            });
            $("#home_nav_attachment").on('click', function(){
               router.run.call(router, path+'/attachment'); 
            });
            $("#home_nav_topic").on('click', function(){
               router.run.call(router, path+'/topics/all'); 
            });
            $("#home_nav_code").on('click', function(){
               router.run.call(router, path+'/git/code');
            });
            $("#home_nav_member").on('click', function(){
               router.run.call(router, path+'/members'); 
            });
            
            loadProject();
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadActivities();
            });
            
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            coding.showBanner();
        }
    }

})();
