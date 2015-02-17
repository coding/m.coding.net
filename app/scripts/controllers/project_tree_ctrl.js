/**
 * Created by simonykq on 01/02/2015.
 */
var PROJECT_TREE_ROUTE = (function(){

    var commitData,
        ownerName,
        projectName,
        commitId,
        projectPath;

    function loadCommit(){

        var path = '/api/user/' + ownerName + '/project/' + projectName + '/git/treeinfo/' + commitId + '/' + projectPath;

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
        var files = commit.infos;

        var file    = null,
            fileEle = null;
        for (var i = 0; i < files.length; i++) {
            file = files[i];
            fileEle = createFileDOM(file);
            $('#project_code > .list-group').append(fileEle);
        }
    }

    function createFileDOM(file){
        var template = '<li class="list-group-item list-group-item-info project_item">' +
                            '<img src="#" height="25" width="23" >' +
                            '<div class="item_details">' +
                                '<span class="item_name"></span>' +
                                '<br />' +
                                '<span class="item_note"></span>' +
                            '</div>' +
                            '<a href="#" class="item_arrow pull-right glyphicon glyphicon-chevron-right"></a>' +
                        '</li>',
            ele      = $(template),
            link     = file['mode'] === 'tree' ? '/u/' + ownerName + '/p/' + projectName + '/tree/' + commitId + '/' + file['path'].replace(/\//g,'%2F') : '/u/' + ownerName + '/p/' + projectName + '/blob/' + commitId + '/' + file['path'].replace(/\//g,'%2F'),
            image    = file['mode'] === 'tree' ? '/images/static/folder.png' : '/images/static/file.png';

        ele.find('img').attr('src', image);
        ele.find('span.item_name').text(truncateText(file['name'],25));

        ele.find('a.item_arrow').attr('href',link);
        ele.find('span.item_note').text(moment(file['lastCommitDate']).fromNow() + ' ' + file['lastCommitter']['name']);

        return ele;
    }

    function truncateText(text, length){
        return text.length < length ? text : text.substr(0,length) + '...';
    }

    return {
        template_url: '/views/project_tree.html',
        //events: ['longTap', 'swipe'],
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
                    '<div class="col-xs-6">' +
                    '<a href="#">项目主页</a>' +
                    '</div>' +
                    '<div class="col-xs-6">' +
                    '<a href="#">阅读代码</a>' +
                    '</div>' +
                    //'<div class="col-xs-3">' +
                    //'<a href="#">合并请求</a>' +
                    //'</div>' +
                    //'<div class="col-xs-3">' +
                    //'<a href="#">项目讨论</a>' +
                    //'</div>' +
                    '</div>',
                header_ele  = $(project_header),
                nav_ele     = $(project_nav);

            header_ele.find('a.navbar-brand').attr('href', router.default);
            header_ele.find('span').text(project);

            nav_ele.find('div').eq(0).children('a').attr('href', path + '/git');
            nav_ele.find('div').eq(1).children('a').attr('href', path + '/tree');

            //active the current tab
            nav_ele.find('div').eq(1).addClass('active');

            $("nav.main-navbar").after(header_ele);
            header_ele.after(nav_ele);
        },
        on_enter: function(user, project, commit, path){

            ownerName = user;
            projectName = project;
            commitId = commit || 'master';
            projectPath = (path || '').replace(/%2F/g,'/');

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
