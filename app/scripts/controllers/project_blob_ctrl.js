/**
 * Created by simonykq on 01/02/2015.
 */
var PROJECT_BLOB_ROUTE = (function(){

    var commitData,
        ownerName,
        projectName,
        commitId,
        projectPath;

    function loadCommit(){

        var path = '/api/user/' + ownerName + '/project/' + projectName + '/git/blob/' + commitId + '/' + projectPath;

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            success: function(data){
                if(data.data){
                    commitData = data.data;
                    assembleCommitDOM(commitData);
                }else{
                    alert('Failed to load commits');
                }
            },
            error: function(xhr, type){
                alert('Failed to load commits');
            },
            complete: function(){
                $('div.loading').remove();
            }
        });
    }

    function assembleCommitDOM(commit){
        var file = commit['file'];
        if(file.mode === 'file'){
            var source   = escape2Html(file.data),
                language = file.lang;
            var result = hljs.getLanguage(language) ? hljs.highlight(language, source) : hljs.highlightAuto(source);

            $('code.hljs').html(result.value);
        }else{
            var path = file.path,
                asset_path = API_DOMAIN + '/u/' + ownerName + '/p/' + projectName + '/git/raw/' + commitId + '/' + path;
            $('pre').replaceWith('<img src=' + asset_path + '>')
        }

    }

    function escape2Html(str) {
        var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
    }

    return {
        template_url: '/views/project_blob.html',
        //events: ['longTap', 'swipe'],
        context: '.container',
        before_enter: function(user, project){

            var path =  '/u/' + user + '/p/' +  project;
            //set up the page information in the banner
            $('title').text(user + '/' + project);

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

            //active the current tab
            nav_ele.find('div').eq(1).children('a').addClass('active');

            $("nav.main-navbar").after(header_ele);
            header_ele.after(nav_ele);

        },
        on_enter: function(user, project, commit, path){

            ownerName = user;
            projectName = project;
            commitId = commit || 'master';
            projectPath = (path || '').replace(/%2F/g,'/');
            //
            loadCommit();

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
