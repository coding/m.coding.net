/**
 * Created by simonykq on 15/03/2015.
 */
var PROJECT_PULL_ROUTE = (function(){

    var ownerName,
        projectName,
        pageCount = 1,
        status = 'open';

    function assembleDOM(data){
        var pulls       = data.list || [],
            fragment    = document.createDocumentFragment(),
            ele,
            list;

        list = document.getElementById('project_pull');

        for (var i = 0; i < pulls.length; i++) {
            ele = createPullDOM(pulls[i]);
            fragment.appendChild(ele[0]);
        }

        list.appendChild(fragment);
    }

    function createPullDOM(pull){
        var template = '<li class="list-group-item title">' +
                            '<h6></h6>' +
                            '<p><b></b>  <span class="label"></span></p>' +
                            '<div>' +
                                '<img src="#" height="20" width="20" />' +
                                '<span></span>' +
                            '</div>' +
                        '</li>',
            $pull    = $(template);

        $pull.find('h6').text('#' + pull['iid'] + ' ' + pull['title']);
        $pull.find('p > b').text(pull['source_owner_name'] + ':' + pull['srcBranch'] + ' -> ' + ownerName + ':' + pull['desBranch']);

        var $status = $pull.find('p > span.label');

        if(pull['merge_status'] === 'ACCEPTED'){
            $status.addClass('label-warning');
            $status.text('已合并');
        }else if(pull['merge_status'] === 'REFUSED'){
            $status.addClass('label-danger');
            $status.text('已拒绝');
        }else if(pull['merge_status'] === 'CANNOTMERGE'){
            $status.addClass('label-info');
            $status.text('不可合并');
        }
        else if(pull['merge_status'] === 'OPEN'){
            $status.addClass('label-success');
            $status.text('未处理');
        }

        $pull.find('div > img').attr('src', assetPath(pull.author.avatar));
        $pull.find('div > span').text(' 创建于' + moment(pull['created_at']).fromNow());

        return $pull;
    }

    function loadMore(path){

        var loadMoreBtn = $('#load_more');
        loadMoreBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');
        path += '/' + status + '?page=' + pageCount;

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
                loadMoreBtn.text('更多合并请求');
            }
        })
    }

    function reset(stat){
        pageCount = 1;
        status    = stat;
    }

    function refresh(path){

        //remove all existing elements in DOM
        $('#project_pull > li.title').remove();

        loadMore(path);
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
        template_url: '/views/project_pull.html',
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
            nav_ele.find('div').eq(2).addClass('active');

            $("nav.main-navbar").after(header_ele);
            header_ele.after(nav_ele);

        },
        on_enter: function(user, project){

            ownerName = user;
            projectName = project;


            var uri = '/api/user/' + user + '/project/' + project + '/git/pulls';

            loadMore(uri);

            $('#load_more').on('click', function(e){
                e.preventDefault();
                loadMore(uri);
            });

            $('select.status').on('change',function(e){
                e.preventDefault();
                reset($(this).val());
                refresh(uri);
            });
        },
        on_exit: function(user, project){

            $('#navigator').find('li').removeClass('active');

            $('.project_navbar').remove();
            $('.project_header').remove();

            reset('open');
        }
    }
})();
