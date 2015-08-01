var PROJECT_ITEM_ROUTE = (function(){

    var projectData,
        ownerName,
        projectName,
        readme;
    
    var forking = false;
        
    var type_list = {'git':'项目介绍','tree':'阅读代码', 'pull':'合并请求', 'topics':'项目讨论'};
    
    function loadProject(){

        var path = '/api/user/' + ownerName + '/project/' + projectName;
        coding.get(path, function(data){
            coding.showProjectBreadcrumb(data.data);
            projectData = data.data;
            loadReadme();
        }); 
    }

    function loadReadme(){
        var path = '/api/user/' + ownerName + '/project/' + projectName + '/git/tree/master';
        coding.get(path, function(data){
            readme = data.data;
            assembleDOM();            
        });
    }
    function assembleDOM(){
        data = readme;
        data.project = projectData;
        //data.project.short_description = coding.truncateText(projectData.description);
        data.stared = projectData.stared;
        data.watched = projectData.watched;
        data.forked = projectData.forked;
        data.project.icon = coding.assetPath(projectData.icon);
        var rendered = Mustache.render($('#tlist').html(), data);
        $("#tcontainer").html(rendered);
        $("#star_link").on('click', starProject);
        $("#watch_link").on('click', watchProject);
        $("#fork_link").on('click', forkProject);
    } 
    
    function starProject(params) {
        var url = '/api/user/'+ownerName+'/project/'+projectName+'/';
        url += projectData.stared? 'unstar' : 'star';
        
        coding.post(url, null, function(data){
            projectData.stared = !projectData.stared;
            reload();
        });
    }
    function watchProject(params) {
        var url = '/api/user/'+ownerName+'/project/'+projectName+'/';
        url += projectData.watched? 'unwatch' : 'watch';
        
        coding.post(url, null, function(data){
            projectData.watched = !projectData.watched;
            reload();
        });
    }
    function forkProject(params) {
        if(forking) return;
        if(projectData.forked){
            alert('已经在此仓库中或者fork过此仓库');
            return;
        }
        if(!confirm('fork会将此项目复制到您的个人空间，确定要fork吗？'))return;
        
        
        $("#fork_image").hide();
        $("#fork_icon").show();
        var url = '/api/user/'+ownerName+'/project/'+projectName+'/git/fork';
        forking = true;
        
        coding.post(url, null, function(data){
            projectData.stared = true;
            $("#fork_icon").hide();
            $("#fork_image").show();
            forking = false;
            reload();
        });
    }        
    function reload(){
        $("#tcontainer").html('');
        
        loadProject();
    }
    
    return {
        template_url: '/views/project_item.html',
        //events: ['doubleTap','swipe'],
        context: '.container',
        before_enter: function(user, project){
            
        },
        on_enter: function(user, project){

            ownerName = user;
            projectName = project;
            
            var path =  '/u/' + user + '/p/' +  project + '/';
            var data = {list:[]};
            $.each(type_list, function(k,v){
               data.list.push({href:path+k,name:v,active:k=='git'});
            });            
            var rendered = Mustache.render($('#theader').html(), data);
            
            $("nav.main-navbar").after(rendered);
            
            loadProject();
            loadReadme();

        },
        on_exit: function(user, project){
            coding.showBanner();
            $('#navigator').find('li').removeClass('active');

            $('.project_navbar').remove();
            $('.project_header').remove();
        }
    }
})();
