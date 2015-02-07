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
                if(data.file){
                    commitData = data.file;
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
        if(commit.mode === 'file'){
            var source   = escape2Html(commit.data),
                language = commit.lang;
            var result = hljs.getLanguage(language) ? hljs.highlight(language, source) : hljs.highlightAuto(source);

            $('code.hljs').html(result.value);
        }else{
            var path = commit.path,
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
            //and those extra items in nav menu
            var nav_extra = '<li class="nav-divider"></li>' +
                    '<li><a href="#">项目主页</a></li>' +
                    '<li><a href="#">阅读代码</a></li>' +
                    '<li><a href="#">合并请求</a></li>' +
                    '<li><a href="#">项目讨论</a></li>',
                ele       = $(nav_extra);
            ele.eq(1).find('a').attr('href', path + '/git');
            ele.eq(2).find('a').attr('href', path + '/tree' );

            //active the current active item
            ele.eq(2).addClass('active');
            //add all extra items
            $("#navigator").append(ele);

            //add the project header
            var project_header = '<div class="page-header project_header">' +
                '<p class="text-center"></p>' +
                '</div>';
            ele = $(project_header);
            ele.find('p').text(project);

            $("nav.navbar").after(ele);

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
            $('#navigator > li').slice(-5).remove();
            $('.project_header').remove();
        }
    }
})();
