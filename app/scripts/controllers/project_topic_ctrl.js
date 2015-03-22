/**
 * Created by simonykq on 22/03/2015.
 */
var PROJECT_TOPIC_ROUTE = (function(){

    var ownerName,
        projectName,
        topicId,
        pageCount = 1,
        pageSize  = 10,
        type      = 0;

    function createTopicDOM(topic){

        var template =  '<div class="panel panel-default">' +
                            '<div class="panel-heading title">' +
                                '<a href="#" class="target">' +
                                    '<img src="#" height="35" width="35" >' +
                                    '<div>' +
                                        '<strong></strong>' +
                                        '<br />' +
                                        '<b></b><span></span><span></span>' +
                                    '</div>' +
                                '</a>' +
                            '</div>' +
                            '<div class="panel-body">' +
                            '</div>' +
                        '</div>',
            $topic    = $(template);

        $topic.find('a.target').attr('href', '/u/' + ownerName + '/p/' + projectName + '/topics/' + topic['id']);
        $topic.find('a.target > img').attr('src', assetPath(topic.owner.avatar));
        $topic.find('a.target > div > strong').text(topic['title']);
        $topic.find('a.target > div > b').text(' ' + topic.owner.name + ' ');
        $topic.find('a.target > div > span:eq(0)').text(' ' + '发布于' + moment(topic['created_at']).fromNow() + ', ');
        $topic.find('a.target > div > span:eq(1)').text(' ' + '有' + topic['child_count'] + '条回应' + ' ');

        $topic.find('div.panel-body').html(topic['content']);

        return $topic;
    }

    function loadTopic(path){

        path += topicId + '?type=' + type;

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                if(data.data){
                    var $dom = createTopicDOM(data.data);
                    $('#topic_item').html($dom);
                }
            },
            error: function(xhr, type){
                alert('Failed to load topics');
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

    function truncateText(text, length){
        return text.length < length ? text : text.substr(0,length) + '...';
    }

    return {
        template_url: '/views/project_topic.html',
        context: '.container',
        before_enter: function(user, project){

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
                project_nav =  '<div class="row project_header">' +
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
        on_enter: function(user, project, topic){

            ownerName = user;
            projectName = project,
            topicId     = topic

            var uri = '/api/topic/';
            loadTopic(uri);

        },
        on_exit: function(user, project){

            $('#navigator').find('li').removeClass('active');

            $('.project_navbar').remove();
            $('.project_header').remove();

            reset();
        }
    }
})();
