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
                //data = {"code":0,"data":{"tags_str":"Java, Python, Mac, Linux, 自由人, 请叫我设计湿, 吐槽帝, 硬件玩家, 追求逼格产品","tags":"2,6,9,10,22,36,39,40,42","job_str":"开发","job":1,"sex":0,"birthday":"1989-11-09","location":"江苏 苏州","company":"苏州外星科技","slogan":"像我这样拉风帅气的码农，还能有第二个？~","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/f23205b8-9d9c-466b-bbdb-5deb4de562c3.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a15a0","gravatar":"","lavatar":"https://dn-coding-net-production-static.qbox.me/f23205b8-9d9c-466b-bbdb-5deb4de562c3.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a15a0","created_at":1413787731000,"last_logined_at":1423198977000,"last_activity_at":1423619309005,"global_key":"brainqi","name":"BrainQi","name_pinyin":"","updated_at":1413787731000,"path":"/u/brainqi","status":1,"is_member":0,"id":36142,"follows_count":19,"fans_count":11,"tweets_count":34,"followed":false,"follow":false}}
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
                //data = {"code":0,"data":{"id":22095,"owner_id":73998,"owner":{"tags_str":"","tags":"","job":0,"sex":1,"birthday":"1992-01-01","location":"上海 ","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/4fa8eca5-ac21-4a22-a016-49f2542d4366.jpg","gravatar":"https://dn-coding-net-avatar.qbox.me/e692347c-3f2e-4e7e-af1d-0c429ac7f0a6.jpg","lavatar":"https://dn-coding-net-production-static.qbox.me/4fa8eca5-ac21-4a22-a016-49f2542d4366.jpg","created_at":1420981213000,"last_logined_at":1423310724000,"last_activity_at":1423619033613,"global_key":"tanya","name":"张若熙","name_pinyin":"|zhangruoxi|zrx","updated_at":1420981213000,"path":"/u/tanya","status":1,"is_member":0,"id":73998,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1423480113000,"likes":7,"comments":46,"comment_list":[{"id":59291,"tweet_id":22095,"owner_id":41106,"owner":{"tags_str":"PHP, Linux","tags":"4,10","job_str":"打杂","job":6,"sex":2,"birthday":"1975-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","gravatar":"https://dn-coding-net-avatar.qbox.me/778054a6-374c-48cc-ae89-524a28af00ff.png","lavatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","created_at":1415687370000,"last_logined_at":1422631926000,"last_activity_at":1423619021519,"global_key":"fwolf","name":"Fwolf","name_pinyin":"","updated_at":1415687370000,"path":"/u/fwolf","status":1,"is_member":0,"id":41106,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1423575154585,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/tanya\" rel\u003d\"nofollow\"\u003e@张若熙\u003c/a\u003e 等你找到“他”之后就不怕丑了"},{"id":59290,"tweet_id":22095,"owner_id":41106,"owner":{"tags_str":"PHP, Linux","tags":"4,10","job_str":"打杂","job":6,"sex":2,"birthday":"1975-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","gravatar":"https://dn-coding-net-avatar.qbox.me/778054a6-374c-48cc-ae89-524a28af00ff.png","lavatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","created_at":1415687370000,"last_logined_at":1422631926000,"last_activity_at":1423619021519,"global_key":"fwolf","name":"Fwolf","name_pinyin":"","updated_at":1415687370000,"path":"/u/fwolf","status":1,"is_member":0,"id":41106,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1423575126230,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/onetea\" rel\u003d\"nofollow\"\u003e@林一茶\u003c/a\u003e 激光好像是切割晶状体，虽然治好了近视，但眼压过高时危险系数直线上升"},{"id":59196,"tweet_id":22095,"owner_id":74562,"owner":{"tags_str":"","tags":"","job_str":"设计","job":3,"sex":1,"birthday":"1992-01-16","location":"","company":"coding","slogan":"","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/29f16abb-b16d-4506-8ef3-b5349ba9b12e.jpg?imageMogr2/auto-orient/format/jpeg/crop/!638x638a0a0","gravatar":"https://dn-coding-net-avatar.qbox.me/ed01d37c-d0d2-42a6-8eaf-58a8699807e0.jpg","lavatar":"https://dn-coding-net-production-static.qbox.me/29f16abb-b16d-4506-8ef3-b5349ba9b12e.jpg?imageMogr2/auto-orient/format/jpeg/crop/!638x638a0a0","created_at":1421028798000,"last_logined_at":1423535234000,"last_activity_at":1423615890275,"global_key":"onetea","name":"林一茶","name_pinyin":"|lyc|linyicha|","updated_at":1421028798000,"path":"/u/onetea","status":1,"is_member":0,"id":74562,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1423563590845,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/tanya\" rel\u003d\"nofollow\"\u003e@张若熙\u003c/a\u003e 丑也不至于啦，，"},{"id":59179,"tweet_id":22095,"owner_id":73998,"owner":{"tags_str":"","tags":"","job":0,"sex":1,"birthday":"1992-01-01","location":"上海 ","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/4fa8eca5-ac21-4a22-a016-49f2542d4366.jpg","gravatar":"https://dn-coding-net-avatar.qbox.me/e692347c-3f2e-4e7e-af1d-0c429ac7f0a6.jpg","lavatar":"https://dn-coding-net-production-static.qbox.me/4fa8eca5-ac21-4a22-a016-49f2542d4366.jpg","created_at":1420981213000,"last_logined_at":1423310724000,"last_activity_at":1423619033613,"global_key":"tanya","name":"张若熙","name_pinyin":"|zhangruoxi|zrx","updated_at":1420981213000,"path":"/u/tanya","status":1,"is_member":0,"id":73998,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1423562794426,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/onetea\" rel\u003d\"nofollow\"\u003e@林一茶\u003c/a\u003e : 戴眼镜实在是丑"},{"id":59178,"tweet_id":22095,"owner_id":74562,"owner":{"tags_str":"","tags":"","job_str":"设计","job":3,"sex":1,"birthday":"1992-01-16","location":"","company":"coding","slogan":"","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/29f16abb-b16d-4506-8ef3-b5349ba9b12e.jpg?imageMogr2/auto-orient/format/jpeg/crop/!638x638a0a0","gravatar":"https://dn-coding-net-avatar.qbox.me/ed01d37c-d0d2-42a6-8eaf-58a8699807e0.jpg","lavatar":"https://dn-coding-net-production-static.qbox.me/29f16abb-b16d-4506-8ef3-b5349ba9b12e.jpg?imageMogr2/auto-orient/format/jpeg/crop/!638x638a0a0","created_at":1421028798000,"last_logined_at":1423535234000,"last_activity_at":1423615890275,"global_key":"onetea","name":"林一茶","name_pinyin":"|lyc|linyicha|","updated_at":1421028798000,"path":"/u/onetea","status":1,"is_member":0,"id":74562,"follows_count":0,"fans_count":0,"tweets_count":0,"followed":false,"follow":false},"created_at":1423562715711,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/tanya\" rel\u003d\"nofollow\"\u003e@张若熙\u003c/a\u003e 不考虑 觉得太危险了 有同学家长是做眼科医生 不准他激光"}],"device":"iPhone 6 Plus","content":"\u003cp\u003e听说…生病的时候…眼睛会变…深…邃！\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/mask.png\" title\u003d\"mask\"\u003e\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/mask.png\" title\u003d\"mask\"\u003e\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/mask.png\" title\u003d\"mask\"\u003e \u003ca href\u003d\"https://dn-coding-net-production-pp.qbox.me/17a3cce0-2111-4d65-8f26-062cab0d4585.jpg\" target\u003d\"_blank\" class\u003d\"bubble-markdown-image-link\" rel\u003d\"nofollow\"\u003e\u003cimg src\u003d\"https://dn-coding-net-production-pp.qbox.me/17a3cce0-2111-4d65-8f26-062cab0d4585.jpg\" alt\u003d\"图片\" class\u003d\" bubble-markdown-image\"\u003e\u003c/a\u003e \u003ca href\u003d\"https://dn-coding-net-production-pp.qbox.me/010b7dd2-0b6d-42fc-b967-333791844424.jpg\" target\u003d\"_blank\" class\u003d\"bubble-markdown-image-link\" rel\u003d\"nofollow\"\u003e\u003cimg src\u003d\"https://dn-coding-net-production-pp.qbox.me/010b7dd2-0b6d-42fc-b967-333791844424.jpg\" alt\u003d\"图片\" class\u003d\" bubble-markdown-image\"\u003e\u003c/a\u003e \u003c/p\u003e","path":"/u/tanya/pp/22095","activity_id":928027,"liked":false,"like_users":[{"global_key":"Michael","name":"张艺辰","path":"/u/Michael","avatar":"https://dn-coding-net-production-static.qbox.me/66fbd5f0-9a76-44c7-93c9-9e0e6b7afdd9.jpg?imageMogr2/auto-orient/format/jpeg/crop/!509x509a0a0"},{"global_key":"lingling","name":"灵灵","path":"/u/lingling","avatar":"https://dn-coding-net-production-static.qbox.me/29804577-f5b5-4cf9-9c1c-0bb528f37ff8.jpg?imageMogr2/auto-orient/format/jpeg/crop/!640x640a0a0"},{"global_key":"maonx","name":"maonx","path":"/u/maonx","avatar":"https://dn-coding-net-production-static.qbox.me/d8eed25b-fbcc-4843-8885-908a29e2d4d3.png?imageMogr2/auto-orient/format/png/crop/!128x128a0a0"},{"global_key":"anchoretic","name":"anchoretic","path":"/u/anchoretic","avatar":"https://dn-coding-net-production-static.qbox.me/2bb7724a-a77f-4135-9692-18510a37782d.png?imageMogr2/auto-orient/format/png/crop/!500x500a0a0"},{"global_key":"wzw","name":"王振威","path":"/u/wzw","avatar":"https://dn-coding-net-production-static.qbox.me/73ff719a-ce59-4076-8f06-056e4da4079a.png?imageMogr2/auto-orient/format/png/crop/!542x542a0a0"},{"global_key":"zhlmmc","name":"zhlmmc","path":"/u/zhlmmc","avatar":"https://dn-coding-net-production-static.qbox.me/4f02cf13-5d6a-46cf-8b8d-efc389fba4c1.jpg"},{"global_key":"force","name":"force","path":"/u/force","avatar":"https://dn-coding-net-production-static.qbox.me/4c181ac2-650b-4d2c-bff0-0ea935d5b3ce.jpg?imageMogr2/auto-orient/format/jpeg/crop/!337x337a141a0"}]}}
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

        heading_ele.find('img').attr('src', assetPath(user.avatar));
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
        ele.find('.titleBox > .commenterImage > a > img').attr('src', assetPath(pp.owner.avatar));
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
        ele.find('.commenterImage img').attr('src', assetPath(comment.owner.avatar));
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
        ele.find('img').attr('src', assetPath(user.avatar));

        return ele;
    }

    function assetPath(path){
        if(path.substr(0,1) === '/'){
            path = API_DOMAIN + path;
        }
        return path;
    }


    return {
        template_url: '/views/pp_item.html',
        context: ".container",
        before_enter: function(user,pp){

            $('title').text(user + '的冒泡');

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
            $('#navigator > li').slice(-2).remove();
        }
    }
})();
