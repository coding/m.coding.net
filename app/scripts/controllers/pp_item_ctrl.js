/**
 * Created by simonykq on 13/01/2015.
 */
var PP_ITEM_ROUTE = (function(){

    var tweet;

    function loadUser(user){

        var uri = '/api/user/key/' + user;

        $.ajax({
            url: uri,
            dataType: 'json',
            success: function(data){
                updateUser(data.data);
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
            url: uri,
            dateType: 'json',
            success: function(data){
                tweet = data.data;
                updateTweet(tweet);
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
        var user    = data || {"tags_str":"PHP, Go, Javascript, Node.js, 专注前端一百年","tags":"4,5,11,12,27","job_str":"开发","job":1,"sex":0,"birthday":"1970-01-01","location":"广东 深圳","company":"鹅厂","slogan":"生命在于折腾","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/19ab9751-12cc-4e06-bf89-015d77ab8fae.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a0a0","gravatar":"","lavatar":"https://dn-coding-net-production-static.qbox.me/19ab9751-12cc-4e06-bf89-015d77ab8fae.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a0a0","created_at":1404879208000,"last_logined_at":1420427362000,"last_activity_at":1421290052354,"global_key":"f2e","name":"f2e","updated_at":1404879208000,"path":"/u/f2e","status":1,"is_member":0,"id":290,"follows_count":15,"fans_count":8,"tweets_count":41,"followed":false,"follow":false},
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
            $.post(path + '?users=' + user.global_key, function(data){
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
        var pp = data || {"id":18926,"owner_id":290,"owner":{"tags_str":"PHP, Go, Javascript, Node.js, 专注前端一百年","tags":"4,5,11,12,27","job_str":"开发","job":1,"sex":0,"birthday":"1970-01-01","location":"广东 深圳","company":"鹅厂","slogan":"生命在于折腾","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/19ab9751-12cc-4e06-bf89-015d77ab8fae.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a0a0","gravatar":"","lavatar":"https://dn-coding-net-production-static.qbox.me/19ab9751-12cc-4e06-bf89-015d77ab8fae.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a0a0","created_at":1404879208000,"last_logined_at":1420427362000,"last_activity_at":1421290052354,"global_key":"f2e","name":"f2e","updated_at":1404879208000,"path":"/u/f2e","status":1,"is_member":0,"id":290,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1421288642000,"likes":3,"comments":5,"comment_list":[{"id":46682,"tweet_id":18926,"owner_id":43418,"owner":{"tags_str":"PHP, Javascript, 专注前端一百年, 吐槽帝","tags":"4,11,27,39","job_str":"开发","job":1,"sex":0,"birthday":"1985-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-avatar.qbox.me/5f0b7693-fd37-4959-a4e8-44a0061b412c.png","gravatar":"https://dn-coding-net-avatar.qbox.me/5f0b7693-fd37-4959-a4e8-44a0061b412c.png","lavatar":"https://dn-coding-net-avatar.qbox.me/5f0b7693-fd37-4959-a4e8-44a0061b412c.png","created_at":1415933322000,"last_logined_at":1418821489000,"last_activity_at":1421289991251,"global_key":"sfwxp","name":"有追求的大鸟","updated_at":1415933322000,"path":"/u/sfwxp","status":1,"is_member":0,"id":43418,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1421289991000,"content":"那我八成是连毛巾都拿不到了~ \n\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/joy.png\" title\u003d\"joy\"\u003e"},{"id":46679,"tweet_id":18926,"owner_id":290,"owner":{"tags_str":"PHP, Go, Javascript, Node.js, 专注前端一百年","tags":"4,5,11,12,27","job_str":"开发","job":1,"sex":0,"birthday":"1970-01-01","location":"广东 深圳","company":"鹅厂","slogan":"生命在于折腾","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/19ab9751-12cc-4e06-bf89-015d77ab8fae.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a0a0","gravatar":"","lavatar":"https://dn-coding-net-production-static.qbox.me/19ab9751-12cc-4e06-bf89-015d77ab8fae.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a0a0","created_at":1404879208000,"last_logined_at":1420427362000,"last_activity_at":1421290052354,"global_key":"f2e","name":"f2e","updated_at":1404879208000,"path":"/u/f2e","status":1,"is_member":0,"id":290,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1421289750000,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"/u/heby\" rel\u003d\"nofollow\"\u003e@heby\u003c/a\u003e 两个益达。。"},{"id":46677,"tweet_id":18926,"owner_id":32654,"owner":{"tags_str":"Mac, Javascript, Node.js, 技术宅, 请叫我设计湿, 屌丝码士","tags":"9,11,12,25,36,37","job_str":"开发","job":1,"sex":0,"birthday":"1992-09-04","location":"广东 深圳","company":"","slogan":"你必须非常努力，才能看上去毫不费力","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/fd2d9076-a577-4822-9ed6-de8d0c62ddda.jpg?imageMogr2/auto-orient/format/jpeg/crop/!180x180a0a0","gravatar":"","lavatar":"https://dn-coding-net-production-static.qbox.me/fd2d9076-a577-4822-9ed6-de8d0c62ddda.jpg?imageMogr2/auto-orient/format/jpeg/crop/!180x180a0a0","created_at":1411295440000,"last_logined_at":1420648277000,"last_activity_at":1421289738968,"global_key":"heby","name":"heby","updated_at":1411295440000,"path":"/u/heby","status":1,"is_member":0,"id":32654,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1421289696000,"content":"快说！"},{"id":46661,"tweet_id":18926,"owner_id":290,"owner":{"tags_str":"PHP, Go, Javascript, Node.js, 专注前端一百年","tags":"4,5,11,12,27","job_str":"开发","job":1,"sex":0,"birthday":"1970-01-01","location":"广东 深圳","company":"鹅厂","slogan":"生命在于折腾","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/19ab9751-12cc-4e06-bf89-015d77ab8fae.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a0a0","gravatar":"","lavatar":"https://dn-coding-net-production-static.qbox.me/19ab9751-12cc-4e06-bf89-015d77ab8fae.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a0a0","created_at":1404879208000,"last_logined_at":1420427362000,"last_activity_at":1421290052354,"global_key":"f2e","name":"f2e","updated_at":1404879208000,"path":"/u/f2e","status":1,"is_member":0,"id":290,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1421288900000,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"/u/skiy\" rel\u003d\"nofollow\"\u003e@skiy\u003c/a\u003e 还真不是 \n\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/bomb.png\" title\u003d\"bomb\"\u003e"},{"id":46660,"tweet_id":18926,"owner_id":33054,"owner":{"tags_str":"PHP, MySQL, Lua","tags":"4,16,45","job_str":"开发","job":1,"sex":0,"birthday":"1988-04-14","location":"广东 深圳","company":"某某公司","slogan":"一直在学习，从未超越过。","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/c35ead42-c0a0-46e6-9408-a9978ca0d005.jpg?imageMogr2/auto-orient/format/jpeg/crop/!638x638a0a0","gravatar":"","lavatar":"https://dn-coding-net-production-static.qbox.me/c35ead42-c0a0-46e6-9408-a9978ca0d005.jpg?imageMogr2/auto-orient/format/jpeg/crop/!638x638a0a0","created_at":1411640969000,"last_logined_at":1420911615000,"last_activity_at":1421288878901,"global_key":"skiy","name":"skiy","updated_at":1411640969000,"path":"/u/skiy","status":1,"is_member":0,"id":33054,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1421288852000,"content":"毛巾。"}],"device":"","content":"\u003cp\u003eCoding的礼物收到了，我不会说是什么的\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/laughing.png\" title\u003d\"laughing\"\u003e\u003c/p\u003e","path":"/u/f2e/pp/18926","activity_id":730906,"liked":false,"like_users":[{"global_key":"icewing","name":"冰翼","path":"/u/icewing","avatar":"https://dn-coding-net-production-static.qbox.me/1a45a6ea2b8dc025c3512eb577d01ccd.png"},{"global_key":"desperatecat","name":"猫爷","path":"/u/desperatecat","avatar":"https://dn-coding-net-production-static.qbox.me/2b778891-e8e8-43ed-a5fc-be0f807e23eb.jpg?imageMogr2/auto-orient/format/jpeg/crop/!640x640a0a0"},{"global_key":"jaysun","name":"卡基猫","path":"/u/jaysun","avatar":"https://dn-coding-net-production-static.qbox.me/1d3476cac70c29fe779592a42ea7bff2.png"}]};

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

        var owner_name = pp.owner.name;
        ele.find('.titleBox > .commenterImage > a').attr('href', '/u/' + owner_name);
        ele.find('.titleBox > .commenterImage > a > img').attr('src', pp.owner.avatar);
        ele.find('.titleBox > a.commenterName').attr('href', '/u/' + owner_name);
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


        ele.find('.titleBox > a.comment').attr('href', '/u/' + owner_name + '/pp/' + pp.id);
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

            $.post(path, function(){
                pp['liked'] = !pp['liked'];
                pp['liked'] ? pp['likes'] += 1 : pp['likes'] -= 1;
                //pp['like_users'].push(current_user);  //add current user to the liked list
                var newEle = updateTweet(pp);
                ele.replaceWith(newEle);
                tweet = pp;
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
                    url: path,
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

            $.post(path,{content: input.val()}, function(data){

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

        var owner_name = comment.owner.name;

        ele.find('.commenterImage > a').attr('href', '/u/' + owner_name);
        ele.find('.commenterImage img').attr('src', comment.owner.avatar);
        ele.find('a.commenterName').attr('href', '/u/' + owner_name);
        ele.find('a.commenterName > span').text(owner_name);
        ele.find('.commentText > p').html(comment.content);
        ele.find('.commentText > .date').text("on March 5th, 2014");
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
                    commentId = comment.id;
                path = '/api/tweet/' + ppId + '/comment/' + commentId;

                $.ajax({
                    url: path,
                    type: 'DELETE',
                    success: function(data){
                        if(data.msg){
                            for(var key in data.msg){
                                alert(data.msg[key]);
                            }
                        }else{
                            var comment_list = tweet['comment_list'];
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

        ele.attr('href', '/u/' + user.name);
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
