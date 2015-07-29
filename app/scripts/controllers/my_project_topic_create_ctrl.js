var MY_PROJECT_TOPIC_CREATE_ROUTE = (function(){

    var $container,
		projectData,
        ownerName,
        projectName;
    
    function loadProject(){
       var path = '/api/user/' + ownerName + '/project/' + projectName;
       coding.get(path, function(data){
          if(data.data){
              coding.showProjectBreadcrumb(data.data);
              projectData = data.data;
              $("#submit").removeAttr('disabled');
          }
	  });
    }
    
    function submit() {
        var $content = $("#topic-content");
        var $title = $("#topic-title");
        if($.trim($title.val())==""){
            alert('请输入标题!');
            return;
        }
        if($.trim($content.val())==""){
            alert('请输入内容!');
            return;
        }
        coding.post(API_DOMAIN + '/api/project/'+projectData.id+'/topic?parent=0',
            {
                title:$title.val(),
                content:$content.val(),
                type:1
            },
            function(data){
                if(data.data){
                    router.run.call(router, coding.projectHomePath(ownerName, projectName)+'/topic/'+data.data.id);
                }
            }
        );
    }

    return {
        template_url: '/views/my_project_topic_create.html',
        context: ".container",
        before_enter: function(user, project){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            

        },
        on_enter: function(user, project){
            ownerName = user;
            projectName = project;
 
            loadProject();
			$("#submit").on('click', submit);
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            $('.project_header').remove();
            coding.showBanner();
        }
    }

})();
