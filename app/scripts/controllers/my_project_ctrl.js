var MY_PROJECT_ROUTE = (function(){

    var pageSize  = 10,
        pageCount = 0,
        lastType  = 'public',
        $container = null;
        currentType = '';

    // 修复图片的相对路径
    function fixRelativeURL(list, key){
        if($.isPlainObject(list)) list = [list];
        
        for(var i = 0; i < list.length;i++){
            if(list[i][key].substr(0,1) === '/'){
                list[i][key] = API_DOMAIN + list[i][key];
            }
        }
        
        return list;
    }

    function assembleDOM(data){
        if(!data || !data.list || !data.list.length) return;
        data.list = fixRelativeURL(data.list, "icon");  
        for(var i =0; i < data.list.length;i++){
            data.list[i].projectHomeURL = coding.projectHomePath(data.list[i].owner_user_name, data.list[i].name);
        }

        $container = $('#projects_list');
        var template = $('#tlist').html();
        Mustache.parse(template);   // optional, speeds up future uses
        var rendered = Mustache.render(template, data);
        
        $container.append(rendered);
    }

    function loadMore(path){

        pageCount++;
        var element = $("#load_more");
        element.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');
        path += '?page=' + pageCount + '&' + 'pageSize=' + pageSize;

       $.ajax({
		  url: API_DOMAIN + path,
		  dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
		  success: function(data){
              if(data.data){
                  assembleDOM(data.data);
              }
		  },
		  error: function(xhr, type){
		    alert('Failed to load projects');
		  },
		  complete: function(){
		  	element.text('更多项目');
		  }
		});

    }

    return {
        template_url: '/views/my_project.html',
        context: ".container",
        before_enter: function(type){
            $('#navigator').find('.li-project').addClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project_active.png');

            pageCount = 0;
        },
        on_enter: function(type){

            if(!router.current_user && currentType === 'mine'){
                alert('You are not logged in');
                return;
            }
            var uri = '/api/projects';
            
            loadMore(uri);
            
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadMore(uri);
            });
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            lastType = currentType; //remember the type set last time;
        }
    }

})();
