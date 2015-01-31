/**
 * Created by simonykq on 21/12/2014.
 */
var PROJECT_ROUTE = (function(){

    var pageSize  = 10,
        pageCount = 0,
        list      = null,
        pros  = [];

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
        var template = '<a href="#" class="list-group-item" style="height: 105px">' +
                            '<img class="pull-left project_icon" src="#" width="80" height="80">' +
                            '<span class="project_name"></span>' +
                            '<br />' +
                            '<span class="project_description"></span>' +
                            '<br />' +
                            '<div class="project_owner">' +
                                '<img src="#" height="15" width="14" />' +
                                '<span>最后更新于</span>' +
                            '</div>' +
                        '</a>',
            ele  = $(template);

        ele.attr('href', pro['project_path']);
        ele.find('img.project_icon').attr('src', assetPath(pro['icon']));
        ele.find('span.project_name').text(pro['name']);
        ele.find('span.project_description').text(pro['description']);
        ele.find('div.project_owner > img').attr('src', pro['owner_user_picture']);
        //TODO: add time info using moment.js


        ele.on('swipe click', function(e){
            e.preventDefault();
            $(list).find('a').removeClass('active');
            $(this).addClass('active');
        });

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
		  success: function(data){
              if(data.data){
                  assembleDOM(data.data);
              }else{
                  alert('Failed to load projects');
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

    function assetPath(path){
        if(path.substr(0,1) === '/'){
            path = API_DOMAIN + path;
        }
        return path;
    }

    return {
        template_url: '/views/projects.html',
        context: ".container",
        before_enter: function(){
            //set up the page information in the banner
            $('title').text('精彩项目');

            $('#navigator').find('li:first').addClass('active');

        },
        on_enter: function(){
            //check if it has previous loaded element
            if(pros.length === 0){
                loadMore("/api/public/all");
            }
            //otherwise just show the cached result
            else{
                showAll();
            }
            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadMore("/api/public/all");
            });
        },
        on_exit: function(){
            //clean up the banner
            $('title').text('');
            $('#navigator').find('li').removeClass('active');

        },
        default: true
    }

})();
