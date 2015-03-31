/**
 * Created by simonykq on 21/12/2014.
 */
var PROJECT_ROUTE = (function(){

    var pageSize  = 10,
        pageCount = 0,
        list      = null,
        pros      = [],
        lastType  = 'public',
        currentType = '';

    function assembleDOM(data){
        var data = data || {};

        var projects = data.list,
            fragment = document.createDocumentFragment(),
            pro,
            ele;

        list = document.getElementById('projects_list');

        for (var i = 0; i < projects.length; i++) {
            pro = projects[i];
            ele = createTemplate(pro);

            fragment.appendChild(ele[0]);
            pros.push(pro);

        }

        list.appendChild(fragment);
    }

    function createTemplate(pro){
        var template = '<a href="#" class="list-group-item needsclick" style="height: 105px">' +
                            '<img class="pull-left project_icon" src="#" width="80" height="80">' +
                            '<span class="project_name"></span>' +
                            '<br />' +
                            '<span class="project_description"></span>' +
                            '<br />' +
                            '<div class="project_owner">' +
                                '<img src="#" height="15" width="14" />' +
                                '<span> 最后更新于 </span>' +
                            '</div>' +
                        '</a>',
            ele  = $(template);

        ele.attr('href', pro['project_path']);
        ele.find('img.project_icon').attr('src', assetPath(pro['icon']));
        ele.find('span.project_name').text(pro['name']);
        ele.find('span.project_description').text(truncateText(pro['description'],15));
        ele.find('div.project_owner > img').attr('src', assetPath(pro['owner_user_picture']));
        ele.find('div.project_owner > span').text(' 最后更新于' + moment(pro['updated_at']).fromNow());

        //ele.on('touchstart', function(e){
        //    $("#projects_list").find('a').removeClass('active');
        //    ele.addClass('active');
        //});

        return ele;
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

    function showAll(){
        var fragment = document.createDocumentFragment(),
            list     = document.getElementById('projects_list'),
            ele;
        for (var i = 0; i < pros.length; i++) {
            ele = createTemplate(pros[i]);
            fragment.appendChild(ele[0]);
        }
        list.appendChild(fragment)
    }

    function reset(){
        pros = [];
        pageCount = 0;
    }

    function assetPath(path){
        if(path.substr(0,1) === '/'){
            path = API_DOMAIN + path;
        }
        return path;
    }

    function truncateText(text, length){
        return text.length < length ? text : text.substr(0,length) + '...';
    }

    return {
        template_url: '/views/project.html',
        context: ".container",
        before_enter: function(type){
            //active the project navbar item
            $('#navigator').find('li:first').addClass('active');

            var project_nav = '<div class="row project_header">' +
                    '<div class="col-xs-6">' +
                    '<a href="#">精彩项目</a>' +
                    '</div>' +
                    '<div class="col-xs-6">' +
                    '<a href="#">我的项目</a>' +
                    '</div>',
                nav_ele     = $(project_nav);

            nav_ele.find('div').eq(0).children('a').attr('href', '/projects');
            nav_ele.find('div').eq(1).children('a').attr('href', '/projects/mine');

            $("nav.main-navbar").after(nav_ele);

            if(type === 'mine'){
                nav_ele.find('div').eq(1).addClass('active');
            }else{
                nav_ele.find('div').eq(0).addClass('active');
            }

        },
        on_enter: function(type){

            currentType = type || 'public';
            //if the type has changed, clear all the contents
            if(currentType != lastType){
                reset();
            }

            if(currentType === 'mine'){
                $('#projects_list > a.projects_title').text('我的项目');
            }else{
                $('#projects_list > a.projects_title').text('精彩项目');
            }

            if(!router.current_user && currentType === 'mine'){
                alert('You are not logged in');
                return;
            }
            var uri = (currentType === 'public') ? '/api/public/all' : '/api/user/' + router.current_user['global_key'] + '/public_projects';
            //check if it has previous loaded element
            if(pros.length === 0){
                loadMore(uri);
            }
            //otherwise just show the cached result
            else{
                showAll();
            }
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadMore(uri);
            });
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('.project_header').remove();
            lastType = currentType; //remember the type set last time;
        }
    }

})();
