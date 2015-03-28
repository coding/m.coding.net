/**
 * Created by simonykq on 22/03/2015.
 */
var PROJECT_TOPIC_ROUTE = (function(){

    var ownerName,
        projectName,
        projectData,
        topicId,
        topicData,
        commentsData = {},
        pageCount = 1,
        pageSize  = 10,
        type      = 0;

    function updateTopicDOM(topic){
        var $topic    = $('#topic_item');

        $topic.find('div.title > img').attr('src', assetPath(topic.owner.avatar));
        $topic.find('div.title > div > strong').text(topic['title']);
        $topic.find('div.title > div > b').text(' ' + topic.owner.name + ' ');
        $topic.find('div.title > div > span:eq(0)').text(' ' + '发布于' + moment(topic['created_at']).fromNow() + ', ');
        $topic.find('div.title > div > span:eq(1)').text(' ' + '有' + topic['child_count'] + '条回应' + ' ');

        $topic.find('div.panel-body > p').html(topic['content']);
    }

    function updateCommentsDOM(data){
        var comments = data.list || [],
            fragment = document.createDocumentFragment(),
            list     = document.getElementById('comments_list'),
            com,
            ele;

        for (var i = 0; i < comments.length; i++) {
            com = comments[i];
            commentsData[com.id] = com;
            ele = createCommentDOM(com);
            fragment.appendChild(ele[0]);
        }

        list.appendChild(fragment);
        $('div.panel-body > h6').text('评论（' + comments.length + '）');
    }

    function createCommentDOM(comment){
        var template = '<li>' +
                //'<div class="commenterImage">' +
                //'<a href="#"><img src="#" /></a>' +
                //'</div>' +
                '<div class="commentText">' +
                '<p></p>' +
                '<a class="commenterName" href="#"><span class="comment-meta"></span></a>' +
                '<span class="date sub-text"></span>' +
                '<a class="reply" href="#" class="comment-hash"> 回复 </a>' +
                '</div>' +
                '</li>',
            ele  = $(template);

        var owner_name = comment.owner.name,
            owner_key  = comment.owner.global_key;

        //add the delete button if this comment is made by the current logged in user
        if(router.current_user){
            var global_key = router.current_user.global_key;
            if(global_key === owner_key){
                ele.find('.reply').after('<a class="delete" href="#" class="comment-hash"> 删除 </a>');
            }
        }

        //ele.find('.commenterImage img').attr('src', assetPath(comment.owner.avatar));
        ele.find('a.commenterName').attr('href', '/user/' + owner_key);
        ele.find('a.commenterName > span').text(owner_name);
        ele.find('.commentText > p').html(comment.content);
        ele.find('.commentText > .date').text(moment(comment.created_at).fromNow());
        //ele.find('.commentText > a').attr('id', comment.owner_id);

        ele.on('click', '.reply', function(e){
            e.preventDefault();
            var input = ele.parents('.commentList').next('form').find('input');
            if(input.val() === ''){
                input.val('@' + owner_name)
            }else{
                var value = input.val();
                input.val(value + ', @' + owner_name);
            }
            return false
        });

        ele.on('click', '.delete', function(e){
            e.preventDefault();

            var r = confirm('确认删除该评论？');

            if(r){
                var commentId = comment.id,
                    path = '/api/topic/' + commentId;

                $.ajax({
                    url: API_DOMAIN + path,
                    type: 'DELETE',
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.msg){
                            for(var key in data.msg){
                                alert(data.msg[key]);
                            }
                        }else{
                            delete commentsData[commentId];
                            ele.remove();
                        }
                    },
                    error: function(){
                        alert('Failed to delete comment');
                    }
                });
            }

            return false
        });

        return ele
    }

    function loadTopic(path){

        path += '?type=' + type;

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                if(data.data){
                    topicData = data.data;
                    updateTopicDOM(topicData);
                }
            },
            error: function(xhr, type){
                alert('Failed to load topics');
            }
        })
    }


    function loadComments(path){
        path += '?type=' + type;

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                if(data.data){
                    updateCommentsDOM(data.data);
                }
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

    return {
        template_url: '/views/project_topic.html',
        context: '.container',
        resolve: function(user, project, topic){
            var promise = $.ajax({
                url: API_DOMAIN + '/api/user/' + user + '/project/' + project,
                dataType: 'json'
            });
            return promise;
        },
        before_enter: function(user, project, topic, data){

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
        on_enter: function(user, project, topic, data){

            ownerName = user;
            projectName = project;
            topicId     = topic;
            projectData = data;

            var uri = '/api/topic/' + topicId;
            loadTopic(uri);
            uri += '/comments';
            loadComments(uri);

            $('form.commentSubmit').submit(function(e){
                e.preventDefault();

                var path    = '/api/project/' + projectData.id + '/topic?parent=' + topicId,
                    $input  = $(this).find('input'),
                    $button = $(this).find('button'),
                    $commentList = $(this).prev('.commentList');

                $.ajax({
                    url: API_DOMAIN + path,
                    type: 'POST',
                    dataType: 'json',
                    data: {content: $input.val()},
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.msg){
                            for(var key in data.msg){
                                alert(data.msg[key]);
                            }
                        }
                        if(data.data){
                            var comment = data.data,
                                commentEle = createCommentDOM(comment);
                            commentsData[comment['id']] = comment;
                            $commentList.prepend(commentEle);
                            $input.val('');
                        }
                    },
                    error: function(){
                        alert('Failed to send comment');
                    },
                    complete: function(){
                        $input.removeAttr('disabled');
                        $button.removeAttr('disabled');
                    }
                });

                $input.attr('disabled', 'disabled');
                $button.attr('disabled', 'disabled');
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
