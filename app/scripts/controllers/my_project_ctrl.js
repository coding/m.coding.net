var MY_PROJECT_ROUTE = (function(){

    var pageSize  = 10,
        pageCount = 0,
        lastType  = 'public',
        $container = null;
        currentType = '',
        pinList = [];

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
        var newList = [];
        for(var i =0; i < data.list.length;i++){
            data.list[i].projectHomeURL = coding.projectHomePath(null, null, data.list[i]);
            //加载完项目信息后，将未读动态数超过 100 的设为 99+
            if (parseInt(data.list[i].un_read_activities_count) >= 100) {
                data.list[i].un_read_activities_count = '99+';
            }
            // 删除常用项目
            var exist = false;
            for(var j = 0; j < pinList.length;j++){
                if(pinList[j].id == data.list[i].id){
                    exist = true;
                }
            }
            if(!exist) newList.push(data.list[i]);
        }
        data.list = newList;
        if(!data || !data.list || !data.list.length) {
            $("#projects_list_container").hide();
            return;
        }
        $container = $('#projects_list');
        var template = $('#tlist').html();
        Mustache.parse(template);   // optional, speeds up future uses
        var rendered = Mustache.render(template, data);

        $container.append(rendered);

    }
     function assemblePinDOM(data){
        if(!data || !data.list || !data.list.length) {
            $("#project_pin_container").hide();
            return;
        }

        data.list = fixRelativeURL(data.list, "icon");
        for(var i =0; i < data.list.length;i++){
            data.list[i].projectHomeURL = coding.projectHomePath(null, null, data.list[i]);
            //加载完项目信息后，将未读动态数超过 100 的设为 99+
            if (parseInt(data.list[i].un_read_activities_count) >= 100) {
                data.list[i].un_read_activities_count = '99+';
            }
        }

        $container = $('#projects_pin');
        var template = $('#tlist').html();
        Mustache.parse(template);   // optional, speeds up future uses
        var rendered = Mustache.render(template, data);

        $container.append(rendered);
    }
    function loadPinProjects(){
        coding.get('/api/user/projects/pin?pageSize=9999',function(data){
            pinList = data.data.list;
            assemblePinDOM(data.data);
            loadMore();
        });
    }

    function loadMore(){
        var path = '/api/projects';
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
            if (location.pathname === '/' && !router.current_user) {
                location.href = '/home.html';
                return
            }


            if(!router.current_user && currentType === 'mine'){
                alert('You are not logged in');
                return;
            }

            loadPinProjects();


            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadMore();
            });
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-project img").attr('src','/images/icons/project.png');
            lastType = currentType; //remember the type set last time;
        }
    }

})();
