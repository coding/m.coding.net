/**
 * Created by simonykq on 15/03/2015.
 */
var PROJECT_TOPICS_ROUTE = (function(){

    var ownerName,
        projectName,
        projectData,
        pageCount = 1,
        pageSize  = 10,
        type      = 1;

    function createTopicDOM(topic){

        var template = '<li class="list-group-item title" role="tab">' +
                            '<a class="target" data-toggle="collapse" data-parent="#project_topic" data-target="" aria-expanded="true">' +
                                '<img src="#" height="35" width="35">' +
                                '<div>' +
                                    '<strong></strong>' +
                                    '<br />' +
                                    '<b></b><span></span><span></span>' +
                                '</div>' +
                            '</a>' +
                            '<div id="" class="collapse" role="tabpanel">' +
                                '<div class="panel-body">' +
                                '</div>' +
                                '<a class="hidden"></a>' +
                            '</div>' +
                        '</li>',
            $topic    = $(template);

        $topic.find('a.target').attr('data-target',"#topic_" + topic['id']);
        $topic.find('a.target > img').attr('src', assetPath(topic.owner.avatar));
        $topic.find('a.target > div > strong').text(topic['title']);
        $topic.find('a.target > div > b').text(' ' + topic.owner.name + ' ');
        $topic.find('a.target > div > span:eq(0)').text(' ' + '发布于' + moment(topic['created_at']).fromNow() + ', ');
        $topic.find('a.target > div > span:eq(1)').text(' ' + '有' + topic['child_count'] + '条回应' + ' ');

        $topic.find('div.collapse').attr('id', 'topic_' + topic['id']);
        $topic.find('div.collapse > div.panel-body').html(sanitize(topic['content']));

        $topic.find('a.hidden').attr('href', '/u/' + ownerName + '/p/' + projectName + '/topics/' + topic['id']);

        $topic.find('div.collapse > div.panel-body').click(function(e){
            e.preventDefault();
            $topic.find('a.hidden').trigger('click');
        });

        return $topic;
    }

    function assembleDOM(data){
        var topics    = data.list || [],
            fragment = document.createDocumentFragment(),
            ele,
            list;

        list = document.getElementById('project_topic');

        for (var i = 0; i < topics.length; i++) {
            ele = createTopicDOM(topics[i]);
            fragment.appendChild(ele[0]);
        }

        list.appendChild(fragment);
    }

    function loadMore(path){

        var loadMoreBtn = $('#load_more');
        loadMoreBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');
        path += '?pageSize=' + pageSize + '&page=' + pageCount + '&type=' + type;

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                if(data.data){
                    assembleDOM(data.data);
                    pageCount ++
                }
            },
            error: function(xhr, type){
                alert('Failed to load pulls');
            },
            complete: function(){
                loadMoreBtn.text('更多评论');
            }
        })
    }

    function reset(){
        pageCount = 1;
        pageSize  = 10;
        type      = 1;
    }

    function assetPath(path){
        if(path.substr(0,1) === '/'){
            path = API_DOMAIN + path;
        }
        return path;
    }

    function sanitize(content){
        return content.replace(/\\"/g, "'")
    }

    return {
        template_url: '/views/project_topics.html',
        context: '.container',
        resolve: function(user, project){
          var promise = $.ajax({
              url: API_DOMAIN + '/api/user/' + user + '/project/' + project,
              dataType: 'json'
          });
          return promise;
        },
        before_enter: function(user, project, data){

            var path =  '/u/' + user + '/p/' +  project;
            //active the project navbar item
            $('#navigator').find('li:first').addClass('active');

            //add the project header and navigation bar
            var project_header = '<nav class="project_navbar navbar navbar-default">' +
                    '<div class="container-fluid">' +
                    '<div class="navbar-header">' +
                    '<a class="navbar-brand" href="#">' +
                    '<img alt="left" src="/images/static/left_arrow.png" height="20" width="20">' +
                    '</a>' +
                    '<span class="text-center"></span>' +
                    '</div>' +
                    '</div>' +
                    '</nav>',
                project_nav =  '<div class="row project_header nested">' +
                    '<div class="col-xs-3">' +
                    '<a href="#">项目主页</a>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<a href="#">阅读代码</a>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<a href="#">合并请求</a>' +
                    '</div>' +
                    '<div class="col-xs-3">' +
                    '<a href="#">项目讨论</a>' +
                    '</div>' +
                    '</div>',
                header_ele  = $(project_header),
                nav_ele     = $(project_nav);

            header_ele.find('a.navbar-brand').attr('href', '/projects');
            header_ele.find('span').text(project);

            nav_ele.find('div').eq(0).children('a').attr('href', path + '/git');
            nav_ele.find('div').eq(1).children('a').attr('href', path + '/tree');
            nav_ele.find('div').eq(2).children('a').attr('href', path + '/pull');
            nav_ele.find('div').eq(3).children('a').attr('href', path + '/topics');

            //active the current tab
            nav_ele.find('div').eq(3).addClass('active');

            $("nav.main-navbar").after(header_ele);
            header_ele.after(nav_ele);

        },
        on_enter: function(user, project, data){

            ownerName = user;
            projectName = project;
            projectData = data;

            var uri = '/api/project/' + projectData['id'] + '/topics';

            loadMore(uri);

            $('#load_more').on('click', function(e){
                e.preventDefault();
                loadMore(uri);
            });

        },
        on_exit: function(user, project){

            $('#navigator').find('li').removeClass('active');

            $('.project_navbar').remove();
            $('.project_header').remove();

            reset();
        }
    }
})();
