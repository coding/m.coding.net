/**
 * Created by simonykq on 13/01/2015.
 */
var PP_ITEM_ROUTE = (function(){

    var tweetData,
        userData;

    function loadUser(user){

        var uri = '/api/user/key/' + user;

        $.ajax({
            url: API_DOMAIN + uri,
            dataType: 'json',
            success: function(data){
                if(data.data){
                    userData = data.data;
                    updateUser(userData);
                }else{
                    alert('Failed to load user' + user);
                    $('#user-heading').html('');
                }
            },
            error: function(xhr, type){
                alert('Failed to load user' + user);
                $('#user-heading').html('');
            }
        });
    }

    function loadTweet(user,tweet){

        var uri = '/api/tweet/' + user + '/' + tweet;

        $.ajax({
            url: API_DOMAIN + uri,
            dateType: 'json',
            success: function(data){
                if(data.data){
                    tweetData = data.data;
                    updateTweet(tweetData);
                }else{
                    alert('Failed to load pp' + tweet);
                }
            },
            error: function(){
                alert('Failed to load pp' + tweet);
            },
            complete: function(){
                $('button.btn-warning').remove();
            }
        })
    }


    function updateUser(data){
        var user    = data || {},
            heading = '<h4 class="panel-title">' +
                        '<img src="#" height="25" width="25" />' +
                        '<a class="panel-title" data-toggle="collapse" href="#accordion" data-target="#user-details" aria-expanded="true" aria-controls="user-details">' +
                        '</a>' +
                        '<a href="#" class="pull-right watched"></a>' +
                        '<a href="#" class="pull-right followed"></a>' +
                    '</h4>',
            body    =   '<p>' +
                            '<span class="description" ></span>' +
                        '</p>' +
                        '<p>' +
                            '<button type="button" class="btn btn-primary follow"></button>' +
                            '<button type="button" class="btn btn-default message">给TA私信</button>' +
                        '</p>' +
                        '<table class="table">' +
                            '<tr class="join">' +
                                '<td>加入时间</td>' +
                                '<td></td>' +
                            '</tr>' +
                            '<tr class="activity">' +
                                '<td>最后活动</td>' +
                                '<td></td>' +
                            '</tr>'+
                            '<tr class="sufix">' +
                                '<td>个性后缀</td>' +
                                '<td></td>' +
                            '</tr>' +
                        '</table>',
            heading_ele = $(heading),
            body_ele    = $(body);

        heading_ele.find('img').attr('src', user.avatar);
        heading_ele.find('a.panel-title').text(' ' + user.name + ' ');
        heading_ele.find('a.watched').attr('href','/u/' + user.global_key + '/followers').text(' ' + user.fans_count + '粉丝 ');
        heading_ele.find('a.followed').attr('href','/u/' + user.global_key + '/friends').text(' ' + user.follows_count + '关注 ');
        heading_ele.click(function(e){
            e.preventDefault();
            var ele = $('#user-details');
            if(ele.hasClass('in')){
                ele.collapse('hide');
            }else{
                ele.collapse('show');
            }
            return false;
        });

        var follow_btn = body_ele.find('button.follow');
        if(user.followed){
            follow_btn.text('取消关注');
        }else{
            follow_btn.text('关注');
        }
        body_ele.find('.description').text(user.slogan);
        body_ele.find('table .join td:eq(1)').text(new Date(user.created_at));
        body_ele.find('table .activity td:eq(1)').text(new Date(user.last_activity_at));
        body_ele.find('table .sufix td:eq(1)').text(user.global_key);

        if(user.sex !== ''){
            var sex = (user.sex === 0) ? '男' : '女';
            body_ele.find('table tbody').append('<tr class="sex"><td>性别</td><td>'+ sex +'</td></tr>')
        }

        if(user.job_str !== ''){
            body_ele.find('table tbody').append('<tr class="job"><td>工作</td><td>'+ user.job_str + '</td></tr>')
        }

        if(user.location !== ''){
            body_ele.find('table tbody').append('<tr class="location"><td>地点</td><td>'+ user.location + '</td></tr>')
        }

        if(user.tags_str !== ''){
            var tags = user.tags_str.split(','),
                tags_ele = [];

            for (var i = 0; i < tags.length; i++) {
                var obj = tags[i],
                    ele = '<a href="/tags/search/' + obj + '">' + obj + '</a>';
                tags_ele.push(ele);
            }
            body_ele.find('table tbody').append('<tr class="tags"><td>标签</td><td>'+ tags_ele.join() + '</td></tr>')
        }

        body_ele.on('click', 'button.follow', function(e){
            e.preventDefault();
            follow_btn.attr('disabled','disabled');
            var path = user.followed ? '/api/user/unfollow' : '/api/user/follow';
            $.post(API_DOMAIN + path + '?users=' + user.global_key, function(data){
                //fail
                if(data.msg){
                    for(var key in data.msg){
                        alert(data.msg[key]);
                    }
                }//success
                else{
                    user.followed = !user.followed;
                    if(user.followed){
                        user.follows_count = user.follows_count + 1;
                    }else{
                        user.follows_count = user.follows_count - 1;
                    }
                    updateUser(user);
                }
                follow_btn.removeAttr('disabled');
            })
        });

        $('#user-details > .panel-body').html(body_ele);
        $('#user-heading').html(heading_ele);
    }


    function updateTweet(data){
        var pp = data || {};

        var template = '<div class="detailBox">' +
                '<div class="titleBox">' +
                '<div class="commenterImage">' +
                '<a href="#"><img src="#" height="30" width="30" /></a>' +
                '</div>' +
                '<a class="commenterName" href="#"><label></label></a>' +
                    <!--this would only be shown if this comment belongs to current user-->
                '<a href="#" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></a>' +
                '<a href="#" class="pull-right star">' +
                '<span class="glyphicon glyphicon-heart"></span>' +
                '</a>' +
                '<a href="#" class="pull-right comment">' +
                '<span class="glyphicon glyphicon-comment"></span>' +
                '</a>' +

                '<div class="row">' +
                '<div class="col-sm-12 like_users">' +
                '</div>' +
                '</div>' +

                '</div>' +
                '<div class="commentBox">' +
                '<p class="taskDescription"></p>' +
                '</div>' +
                '<div class="actionBox">' +
                '<ul class="commentList">' +
                '</ul>' +
                '<form class="form-inline commentSubmit" role="form">' +
                '<div class="input-group">' +
                '<input type="text" class="form-control" placeholder="在此输入评论内容">' +
                '<span class="input-group-btn">' +
                '<button class="btn btn-default" type="submit"><span class="glyphicon glyphicon-arrow-right"></span></button>' +
                '</span>' +
                '</div>' +
                '</form>' +
                '</div>' +
                '</div>',
            ele = $(template);

        ele.attr('id', pp.id);

        var owner_name = pp.owner.name,
            owner_key  = pp.owner.global_key;
        ele.find('.titleBox > .commenterImage > a').attr('href', '/u/' + owner_key);
        ele.find('.titleBox > .commenterImage > a > img').attr('src', pp.owner.avatar);
        ele.find('.titleBox > a.commenterName').attr('href', '/u/' + owner_key);
        ele.find('.titleBox > a.commenterName > label').text(owner_name);

        ele.find('.titleBox > a.star > span').text(pp.likes);
        if(pp.liked){
            ele.find('.titleBox > a.star > span').css('color','#D95C5C');
        }

        //create liked users
        var likeUsers   = pp.like_users,
            userList    = ele.find('.titleBox .like_users'),
            userEle;

        for (var i = 0; i < likeUsers.length; i++) {
            userEle = createLikedUsersDOM(likeUsers[i]);
            userList.append(userEle);
        }


        ele.find('.titleBox > a.comment').attr('href', '/u/' + owner_key + '/pp/' + pp.id);
        ele.find('.titleBox > a.comment > span').text(pp.comments);

        ele.find('.commentBox > .taskDescription').html(pp.content);

        //create tweet comments
        var comments     = pp.comment_list,
            commentsList = ele.find('.actionBox > .commentList'),
            commentEle;

        for(var j = 0; j < comments.length; j++){
            commentEle = createCommentDOM(comments[j]);
            commentsList.append(commentEle);
        }


        //event listeners for this element
        ele.on('click', '.star', function(e){
            e.preventDefault();
            var id = pp.id,
                path = pp['liked'] ? '/api/tweet/' + id + '/unlike' : '/api/tweet/' + id + '/like';

            $.post(API_DOMAIN + path, function(){
                pp['liked'] = !pp['liked'];
                pp['liked'] ? pp['likes'] += 1 : pp['likes'] -= 1;
                //pp['like_users'].push(current_user);  //add current user to the liked list
                updateTweet(pp);
                tweetData = pp;
            });
            return false;
        });

        ele.on('click', '.close', function(e){
            e.preventDefault();

            var r = confirm("确认删除该泡泡？");

            if(r){
                var id   = pp.id,
                    path = '/api/tweet/' + id;

                $.ajax({
                    url: API_DOMAIN + path,
                    type: 'DELETE',
                    success: function(data){
                        if(data.msg){
                            for(var key in data.msg){
                                alert(data.msg[key]);
                            }
                        }else{
                            ele.remove();
                        }
                    }
                });
            }

            return false
        });

        ele.on('submit', '.commentSubmit', function(e){
            e.preventDefault();

            var id    = pp.id,
                input = $(this).find('input'),
                button= $(this).find('button'),
                path  = '/api/tweet/' + id + '/comment';

            $.post(API_DOMAIN + path,{content: input.val()}, function(data){

                if(data.msg){
                    for(var key in data.msg){
                        alert(data.msg[key]);
                    }
                }
                if(data.data){
                    data.data['owner'] = {}; //current user
                    var commentEle = createCommentDOM(data.data);
                    commentsList.append(commentEle);
                }

                input.removeAttr('disabled');
                button.removeAttr('disabled');
            });

            input.attr('disabled','disabled');
            button.attr('disabled','disabled');

            return false
        });

        $('#accordion').after(ele);
    }


    function createCommentDOM(comment){
        var template = '<li>' +
                '<div class="commenterImage">' +
                '<a href="#"><img src="#" /></a>' +
                '</div>' +
                '<a class="commenterName" href="#"><span class="comment-meta"></span></a>' +
                '<div class="commentText">' +
                '<p></p>' +
                '<span class="date sub-text"></span>' +
                '<a class="reply" href="#" class="comment-hash"> 回复 </a>' +
                '<a class="delete" href="#" class="comment-hash"> 删除 </a>' +
                '</div>' +
                '</li>',
            ele  = $(template);

        var owner_name = comment.owner.name,
            owner_key  = comment.owner.global_key;

        ele.find('.commenterImage > a').attr('href', '/u/' + owner_key);
        ele.find('.commenterImage img').attr('src', comment.owner.avatar);
        ele.find('a.commenterName').attr('href', '/u/' + owner_key);
        ele.find('a.commenterName > span').text(owner_name);
        ele.find('.commentText > p').html(comment.content);
        ele.find('.commentText > .date').text(new Date(comment.created_at));
        ele.find('.commentText > a').attr('id', comment.owner_id);

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
                var ppId      = ele.parents('.detailBox').attr('id'),
                    commentId = comment.id,
                    path = '/api/tweet/' + ppId + '/comment/' + commentId;

                $.ajax({
                    url: API_DOMAIN + path,
                    type: 'DELETE',
                    success: function(data){
                        if(data.msg){
                            for(var key in data.msg){
                                alert(data.msg[key]);
                            }
                        }else{
                            var comment_list = tweetData['comment_list'];
                            for(var i = comment_list.length-1; i>=0; i--) {
                                if( comment_list[i]['id'] === commentId) comment_list.splice(i,1);
                            }
                            ele.remove();
                        }
                    }
                });
            }

            return false
        });

        return ele
    }

    function createLikedUsersDOM(user){
        var template = '<a class="pull-right" style="padding: 0 3px 0" href="#">' +
                '<img src="#" height="15" width="15" />' +
                '</a>',
            ele = $(template);

        ele.attr('href', '/u/' + user.global_key);
        ele.find('img').attr('src', user.avatar);

        return ele;
    }

    return {
        template_url: '/views/pp_item.html',
        context: ".container",
        before_enter: function(user,pp){

            $('title').text(user + '的冒泡');
            $('#page_name').text(user + '的冒泡');

            //add those extra items in nav menu
            $("#navigator").append( '<li class="nav-divider"></li>' +
                '<li><a href="/pp/hot' + '">热门</a></li>'
            );

        },
        on_enter: function(user,pp){
            loadUser(user);
            loadTweet(user,pp);
        },
        on_exit: function(){
            $('title').text('');
            $('#page_name').text('');
            $('#navigator > li').slice(-1).remove();
        }
    }
})();
