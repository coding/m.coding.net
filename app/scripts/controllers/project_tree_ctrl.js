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
                            '<img src="#" height="25" width="25" >' +
                            '<span class="item_name"></span>' +
                            '<a href="#" class="item_arrow pull-right glyphicon glyphicon-chevron-right"></a>' +
                            '<span class="clearfix"></span>' +
                            '<span class="item_note"></span>' +
                        '</li>',
            ele      = $(template),
            link     = file['mode'] === 'file' ? '/u/' + ownerName + '/p/' + projectName + '/blob/' + commitId + '/' + file['path'].replace('/','%2F') : '/u/' + ownerName + '/p/' + projectName + '/tree/' + commitId + '/' + file['path'].replace('/','%2F'),
            image    = file['mode'] === 'file' ? '/images/static/file.png' : '/images/static/folder.png';

        ele.find('img').attr('src', image);
        ele.find('span.item_name').text(file['name']);

        ele.find('a.item_arrow').attr('href',link);
        //TODO: add time info using moment.js
        ele.find('span.item_note').text("n天前 " + file['lastCommitter']['name']);

        return ele;
    }

    return {
        template_url: '/views/project_tree.html',
        //events: ['longTap', 'swipe'],
        context: '.container',
        before_enter: function(user, project){

            var path =  '/u/' + user + '/p/' +  project;
            //set up the page information in the banner
            $('title').text(user + '/' + project);
            //and those extra items in nav menu
            var nav_extra = '<li class="nav-divider"></li>' +
                    '<li><a href="#">项目主页</a></li>' +
                    '<li><a href="#">代码阅读</a></li>' +
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
            projectPath = (path || '').replace('%2F','/');

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
