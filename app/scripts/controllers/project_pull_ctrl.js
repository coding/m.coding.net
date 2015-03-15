/**
 * Created by simonykq on 15/03/2015.
 */
var PROJECT_PULL_ROUTE = (function(){

    var ownerName,
        projectName;

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
            //set up the page information in the banner
            $('title').text(user + '/' + project);
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

            header_ele.find('a.navbar-brand').attr('href', router.default);
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

        },
        on_exit: function(user, project){
            //clean up the nav menu
            $('title').text('');

            $('#navigator').find('li').removeClass('active');

            $('.project_navbar').remove();
            $('.project_header').remove();
        }
    }
})();
