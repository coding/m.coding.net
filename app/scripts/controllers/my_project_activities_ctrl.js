/**
 * Created by simonykq on 21/12/2014.
 */
var MY_PROJECT_ACTIVITIES_ROUTE = (function(){

    var pageSize  = 10,
        pageCount = 0,
        $container = null,
        ownerName = null,
        projectName = null,
        currentType = '';
    var lastActivities = null;
    var lastType = "all";

    var type_list = {'all':'全部','task':'任务','topic':'讨论','file':'文件','code':'代码','other':'其他'};
    
    
    function loadProject(){
       var path = '/api/user/' + ownerName + '/project/' + projectName;
       coding.get(path,function(data){
          if(data.data){
              coding.showProjectBreadcrumb(data.data);
              projectData = data.data;
              loadMore();
          }
	  });
    }
    
    function assembleDOM(){
        if(!activities) return;      
        var list = {list:converActivities()};     

        var rendered = Mustache.render($('#tlist').html(), list);
        $('#tcontainer').append(rendered);
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

    function loadMore(){
        coding.loading();
        
        pageCount++;
        
        var path = '/api/project/' + projectData.id + '/activities?type='+lastType+'&user_id='+router.current_user.id;
        if(lastActivities){
            path += "&last_id=" + lastActivities.id;
        }
        coding.get(path, function(data){
            if(data.data){
                activities = data.data;
                assembleDOM();
            }
        }, null, coding.loadingDone);
    }

    return {
        template_url: '/views/my_project_activity.html',
        context: ".container",
        before_enter: function(user, project, type){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            lastActivities = null;
            pageCount = 0;
            
        },
        on_enter: function(user, project, type){
            ownerName = user;
            projectName = project;
            lastType = type || 'all';
            
            var path = coding.projectHomePath(user, project);
            path += '/activities/';
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
