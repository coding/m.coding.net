var MY_PROJECT_TOPIC_ROUTE = (function(){
    var pageSize  = 20,
        pageCount = 0,
        $container = null;
        ownerName = null,
        projectName = null,
        topicId = 0;
        currentType = '';
    var lastType = "all";
    var topicData = null;
    
    var type_list = {'all':'全部讨论','mine':'我的讨论'};
    
    function loadProject(){

       var path = '/api/user/' + ownerName + '/project/' + projectName;
       coding.get(path, function(data){
          if(data.data){
              coding.showProjectBreadcrumb(data.data);
              projectData = data.data;
              loadTopic();
          }
	  });
    }
    
    function loadTopic() {
       var path = '/api/topic/'+topicId;
       coding.get(path, function(data){
          if(data.data){
              topicData = data.data;
              assembleDOM(data.data);
              loadComment();
          }
	  });
    }
    
    function assembleDOM(data){
        if(!data ) return;  
        data.display =  data.owner.name + ' 创建于' + moment(data.created_at).fromNow();

        var rendered = Mustache.render($('#tmain').html(), data);
        $('#tcontainer').html(rendered);
    }

    function assembleCommentDOM(data){
        if(!data || !data.list || !data.list.length) return;  
        
        for (var index = 0; index < data.list.length; index++) {
            var element = data.list[index];
            data.list[index].project_name = projectName;
            data.list[index].fromNow =  moment(element.created_at).fromNow();
        }

        var rendered = Mustache.render($('#tlist').html(), data);
        $('#tcomment').append(rendered);
    }

    function loadComment(){
        coding.loading();
                
        pageCount++;
                
        var path = '/api/topic/' + topicId + '/comments';
        path += '?page=' + pageCount + '&' + 'pageSize=20';
        coding.get(path, function(data){
            if(data.data){
                assembleCommentDOM(data.data);
            }
        }, null, coding.loadingDone);
    }
    
    function reply() {
        var $input = $("#reply-content");
        if($.trim($input.val())==="") return;
        coding.post(API_DOMAIN + '/api/project/'+projectData.id+'/topic?parent='+topicId,
            {content:$input.val()},
            function(data){
                $input.val('');
                
                if(data.data){
                    topicData.child_count ++;
                    if(!topicData.child_count) topicData.child_count = 1;
                    assembleDOM(topicData);
                    assembleCommentDOM({list:[data.data]});
                }
            }
        );
    }

    return {
        template_url: '/views/my_project_topic.html',
        context: ".container",
        before_enter: function(user, project, id){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');
            pageCount = 0;
        },
        on_enter: function(user, project, id){
            ownerName = user;
            projectName = project;
            topicId = id;
            
            loadProject();
            
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadComment();
            });
            
            $(document).on("click", ".reply-comment", function(){
                var name = $(this).attr("data-owner-name");
                var $input = $("#reply-content");
                var val = $input.val();
                if($.trim(val) !== ""){
                    val += " ";
                }
                val += "@"+name;
                $input.val(val);
            });
            $("#reply").on("click", reply);
        },
        on_exit: function(){
            $(document).off("click", ".reply-comment");
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            $('.project_header').remove();
            
            coding.showBanner();
        }
    }

})();
