/**
 * Created by simonykq on 21/12/2014.
 */
var PP_ROUTE  = (function(){

    var last_id  = 99999999,
        sort     = 'time',
        list     = null,
        elements = {};

    function assembleDOM(data){
        var pps       = data || {},
            fragment  = document.createDocumentFragment(),
            ele;

        list = document.getElementById('pp_list');

        for (var i = 0; i < pps.length; i++) {
            ele = createTweetDOM(pps[i]);
            fragment.appendChild(ele[0]);
            elements[pps[i]['id']] = pps[i];

        }

        list.appendChild(fragment);

    }

    function createTweetDOM(pp){
        var template = '<div class="detailBox">' +
                            '<div class="titleBox">' +
                                '<div class="commenterImage">' +
                                    '<a href="#"><img src="#" height="30" width="30" /></a>' +
                                '</div>' +
                                '<a class="commenterName" href="#"><label></label></a>' +
                                '<div class="commenterDetail"></div>' +
                                <!--this would only be shown if this comment belongs to current user-->
                                //'<a href="#" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></a>' +
                            '</div>' +
                            '<div class="commentBox">' +
                                '<p class="taskDescription"></p>' +
                            '</div>' +

                            '<a href="#" class="pull-right comment">' +
                                '<span class="glyphicon glyphicon-comment"> 评论 </span>' +
                            '</a>' +
                            '<a href="#" class="pull-right star">' +
                                '<span class="glyphicon glyphicon-heart"> 赞 </span>' +
                            '</a>' +
                            '<br />' +
                            '<div class="actionBox">' +
                                '<div class="row">' +
                                    '<div class="col-sm-12 like_users">' +
                                    '</div>' +
                                '</div>' +
                                '<ul class="commentList">' +
                                '</ul>' +
                                //'<form class="form-inline commentSubmit" role="form">' +
                                //     '<div class="input-group">' +
                                //        '<input type="text" class="form-control" placeholder="在此输入评论内容">' +
                                //        '<span class="input-group-btn">' +
                                //            '<button class="btn btn-default" type="submit"><span class="glyphicon glyphicon-arrow-right"></span></button>' +
                                //        '</span>' +
                                //    '</div>' +
                                //'</form>' +
                            '</div>' +
                        '</div>',
            ele = $(template);

        ele.attr('id', pp.id);

        var owner_name = pp.owner.name,
            owner_key  = pp.owner.global_key,
            device = pp.device;
        ele.find('.titleBox > .commenterImage > a').attr('href', '/u/' + owner_key);
        ele.find('.titleBox > .commenterImage > a > img').attr('src', assetPath(pp.owner.avatar));
        ele.find('.titleBox > a.commenterName').attr('href', '/u/' + owner_key);
        ele.find('.titleBox > a.commenterName > label').text(owner_name);
        //TODO: add time info using moment.js
        if(device !== ''){
            ele.find('.titleBox > div.commenterDetail').text("来自" + device);
        }

        ele.find('.detailBox > a.comment').attr('href', '/u/' + owner_key + '/pp/' + pp.id);
        if(pp.liked){
            ele.find('.detailBox > a.star > span').css('color','#D95C5C');
        }

        //create liked users
        var likeUsers   = pp.like_users,
            userList    = ele.find('.actionBox .like_users'),
            userEle;

        for (var i = 0; i < likeUsers.length; i++) {
            userEle = createLikedUsersDOM(likeUsers[i]);
            userList.append(userEle);
        }


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
        //ele.on('click', '.star', function(e){
        //    e.preventDefault();
        //    var id = pp.id,
        //        path = pp['liked'] ? '/api/tweet/' + id + '/unlike' : '/api/tweet/' + id + '/like';
        //
        //    $.post(API_DOMAIN + path, function(){
        //        pp['liked'] = !pp['liked'];
        //        pp['liked'] ? pp['likes'] += 1 : pp['likes'] -= 1;
        //        //pp['like_users'].push(current_user);  //add current user to the liked list
        //        var newEle = createTweetDOM(pp);
        //        ele.replaceWith(newEle);
        //        elements[id] = pp;
        //    });
        //    return false;
        //});

        //ele.on('submit', '.commentSubmit', function(e){
        //    e.preventDefault();
        //
        //    var id    = pp.id,
        //        input = $(this).find('input'),
        //        button= $(this).find('button'),
        //        path  = '/api/tweet/' + id + '/comment';
        //
        //    $.post(API_DOMAIN + path,{content: input.val()}, function(data){
        //
        //        if(data.msg){
        //            for(var key in data.msg){
        //                alert(data.msg[key]);
        //            }
        //        }
        //        if(data.data){
        //            data.data['owner'] = {}; //current user
        //            var commentEle = createCommentDOM(data.data);
        //            commentsList.append(commentEle);
        //        }
        //
        //        input.removeAttr('disabled');
        //        button.removeAttr('disabled');
        //    });
        //
        //    input.attr('disabled','disabled');
        //    button.attr('disabled','disabled');
        //
        //    return false
        //});


        return ele;
    }

    function createCommentDOM(comment){
        var template = '<li>' +
                            //'<div class="commenterImage">' +
                            //     '<a href="#"><img src="#" /></a>' +
                            //'</div>' +
                            //'<a class="commenterName" href="#"><span class="comment-meta"></span></a>' +
                            '<div class="commentText">' +
                                '<p></p>' +
                                '<a class="commenterName" href="#"><span class="comment-meta"></span></a>' +
                                '<span class="date sub-text"></span>' +
                                //'<a class="reply" href="#" class="comment-hash"> 回复 </a>' +
                                //'<a class="delete" href="#" class="comment-hash"> 删除 </a>' +
                            '</div>' +
                        '</li>',
            ele  = $(template);

        var owner_name = comment.owner.name,
            owner_key  = comment.owner.global_key;

        //ele.find('.commenterImage > a').attr('href', '/u/' + owner_key);
        //ele.find('.commenterImage img').attr('src', assetPath(comment.owner.avatar));
        ele.find('a.commenterName').attr('href', '/u/' + owner_key);
        ele.find('a.commenterName > span').text(owner_name);
        ele.find('.commentText > p').html(comment.content);
        ele.find('.commentText > .date').text("刚刚");//TODO: add time info using moment.js
        ele.find('.commentText > a').attr('id', comment.owner_id);

        //ele.on('click', '.reply', function(e){
        //    e.preventDefault();
        //    var input = ele.parents('.commentList').next('form').find('input');
        //    if(input.val() === ''){
        //        input.val('@' + owner_name)
        //    }else{
        //        var value = input.val();
        //        input.val(value + ', @' + owner_name);
        //    }
        //    return false
        //});
        //
        //ele.on('click', '.delete', function(e){
        //    e.preventDefault();
        //    var r = confirm('确认删除该评论？');
        //    if(r){
        //        var ppId      = ele.parents('.detailBox').attr('id'),
        //            commentId = comment.id,
        //            path = '/api/tweet/' + ppId + '/comment/' + commentId;
        //
        //        $.ajax({
        //            url: API_DOMAIN + path,
        //            type: 'DELETE',
        //            success: function(data){
        //                if(data.msg){
        //                    for(var key in data.msg){
        //                        alert(data.msg[key]);
        //                    }
        //                }else{
        //                    var comment_list = elements[ppId]['comment_list'];
        //                    for(var i = comment_list.length-1; i>=0; i--) {
        //                        if( comment_list[i]['id'] === commentId) comment_list.splice(i,1);
        //                    }
        //                    ele.remove();
        //                }
        //            }
        //        });
        //    }
        //
        //    return false
        //});

        return ele
    }

    function createLikedUsersDOM(user){
        var template = '<a class="pull-left" style="padding: 0 3px 0" href="#">' +
                            '<img src="#" height="15" width="15" />' +
                        '</a>',
            ele = $(template);

        ele.attr('href', '/u/' + user.global_key);
        ele.find('img').attr('src', assetPath(user.avatar));

        return ele;
    }

    function reset(){
        elements = {};
        last_id = 99999999;
    }

    function refresh(){

        elements = {};
        last_id  = 99999999;
        //remove all existing elements in DOM
        $('#pp_list > .detailBox').remove();
        loadMore('/api/tweet/public_tweets');
    }

    function loadMore(path){

        var loadMoreBtn = $('#load_more');

        loadMoreBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');

        path += '?last_id=' + last_id + '&' + 'sort=' + sort;

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            success: function(data){
                if(data.data){
                    assembleDOM(data.data);
                    last_id = data.data[data.data.length - 1]['id']; //id of last item in list
                }else{
                    alert('Failed to load pp');
                }
            },
            error: function(xhr, type){
                alert('Failed to load pp');
                //var data = {"code":0,"data":[{"id":22298,"owner_id":11008,"owner":{"job":6,"sex":2,"phone":"","birthday":"1983-01-15","location":"湖北 十堰","company":"","slogan":"时间就是金钱我的朋友！","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/df670482-163a-48ae-8a09-f394ffa41dc5.jpeg?imageMogr2/auto-orient/format/jpeg/crop/!200x200a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/df670482-163a-48ae-8a09-f394ffa41dc5.jpeg?imageMogr2/auto-orient/format/jpeg/crop/!200x200a0a0","created_at":1408073700000,"last_logined_at":1421460191000,"last_activity_at":1423619004070,"global_key":"aixiu","name":"aixiu","updated_at":1408073700000,"path":"/u/aixiu","status":1,"id":11008,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423619004084,"likes":0,"comments":0,"comment_list":[],"device":"","content":"\u003cp\u003e今天过小年喽，冒泡一下。\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]},{"id":22297,"owner_id":36160,"owner":{"job":1,"sex":0,"phone":"18842666295","birthday":"1991-12-01","location":"辽宁 大连","company":"","slogan":"人之患，在好为人师","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/4751e2e8-8673-4370-9d12-91adece59031.jpg?imageMogr2/auto-orient/format/jpeg/crop/!480x480a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/4751e2e8-8673-4370-9d12-91adece59031.jpg?imageMogr2/auto-orient/format/jpeg/crop/!480x480a0a0","created_at":1413792700000,"last_logined_at":1422411637000,"last_activity_at":1423618772005,"global_key":"Sumer","name":"Sumer","updated_at":1413792700000,"path":"/u/Sumer","status":1,"id":36160,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618772019,"likes":0,"comments":0,"comment_list":[],"device":"","content":"\u003cp\u003e小年了，曾还没吃，先锻炼一下\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]},{"id":22296,"owner_id":22811,"owner":{"job":6,"sex":0,"phone":"","birthday":"1986-08-16","location":"山东 青岛","company":"","slogan":"有点想法很好，有点行动更好","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/effe786f-c79a-4102-93d0-f684d36a3c20.png?imageMogr2/auto-orient/format/png/crop/!230x230a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/effe786f-c79a-4102-93d0-f684d36a3c20.png?imageMogr2/auto-orient/format/png/crop/!230x230a0a0","created_at":1409097666000,"last_logined_at":1420447520000,"last_activity_at":1423618201962,"global_key":"silverwing","name":"愚夫","updated_at":1409097666000,"path":"/u/silverwing","status":1,"id":22811,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618201978,"likes":0,"comments":0,"comment_list":[],"device":"","content":"\u003cp\u003e\u003cimg class\u003d\"emotion monkey\" src\u003d\"https://coding.net/static/coding-emotions/coding-emoji-36.png\" title\u003d\"冒泡\"\u003e \u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]},{"id":22295,"owner_id":77658,"owner":{"job":6,"sex":0,"phone":"","birthday":"2013-01-20","location":"北京 朝阳区","company":"kir","slogan":"不！","introduction":"","avatar":"/static/fruit_avatar/Fruit-10.png","lavatar":"/static/fruit_avatar/Fruit-10.png","created_at":1422022194000,"last_logined_at":1423555202000,"last_activity_at":1423617472016,"global_key":"kiringame","name":"kiringame","updated_at":1422022194000,"path":"/u/kiringame","status":1,"id":77658,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423617472035,"likes":1,"comments":0,"comment_list":[],"device":"iPhone 5","content":"\u003cp\u003e新的一天，萌萌哒！\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[{"global_key":"haibing","name":"haibing","path":"/u/haibing","avatar":"/static/fruit_avatar/Fruit-6.png"}]},{"id":22294,"owner_id":41005,"owner":{"job":1,"sex":0,"phone":"","birthday":"1985-01-01","location":"","company":"","slogan":"寄意寒星荃不察，我以我血荐轩辕","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/93dccaa9-964b-49d4-8151-bb9529bfa73b.gif?imageMogr2/auto-orient/format/jpg/crop/!189x189a10a10","lavatar":"https://dn-coding-net-production-static.qbox.me/93dccaa9-964b-49d4-8151-bb9529bfa73b.gif?imageMogr2/auto-orient/format/jpg/crop/!189x189a10a10","created_at":1415682686000,"last_logined_at":1423617220084,"last_activity_at":1423617270605,"global_key":"lechenging","name":"lechenging","updated_at":1415682686000,"path":"/u/lechenging","status":1,"id":41005,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423617270632,"likes":1,"comments":1,"comment_list":[{"id":59384,"tweet_id":22294,"owner_id":34260,"owner":{"job":1,"sex":0,"phone":"","birthday":"1994-04-23","location":"","company":"","slogan":"No man is an island, entire of itself.","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/49a2c54f-d5bf-4aec-b318-5a8e938d58c8.png?imageMogr2/auto-orient/format/png/crop/!480x480a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/49a2c54f-d5bf-4aec-b318-5a8e938d58c8.png?imageMogr2/auto-orient/format/png/crop/!480x480a0a0","created_at":1412760501000,"last_logined_at":1423616417494,"last_activity_at":1423618149261,"global_key":"yaodan","name":"瑶蛋","updated_at":1412760501000,"path":"/u/yaodan","status":1,"id":34260,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618149269,"content":"奶瓶仔！"}],"device":"","content":"\u003cp\u003e昨晚公司聚会很嗨啊\u003cimg class\u003d\"emotion monkey\" src\u003d\"https://coding.net/static/coding-emotions/coding-emoji-08.png\" title\u003d\"你咬我啊\"\u003e\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[{"global_key":"ikeith","name":"ikeith","path":"/u/ikeith","avatar":"https://dn-coding-net-production-static.qbox.me/bbf1f3fa-d935-4233-8e22-f63ced41d2a8.jpg?imageMogr2/auto-orient/format/jpeg/crop/!465x465a81a172"}]},{"id":22293,"owner_id":8,"owner":{"job":6,"sex":0,"phone":"","birthday":"1984-12-23","location":"广东 深圳  ","company":"Coding.net","slogan":"岂能尽如人意，但求无愧我心","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/4f02cf13-5d6a-46cf-8b8d-efc389fba4c1.jpg","lavatar":"https://dn-coding-net-production-static.qbox.me/4f02cf13-5d6a-46cf-8b8d-efc389fba4c1.jpg","created_at":1399066489000,"last_logined_at":1423487276000,"last_activity_at":1423616749261,"global_key":"zhlmmc","name":"zhlmmc","updated_at":1399066489000,"path":"/u/zhlmmc","status":1,"id":8,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423616749783,"likes":2,"comments":2,"comment_list":[{"id":59398,"tweet_id":22293,"owner_id":8,"owner":{"job":6,"sex":0,"phone":"","birthday":"1984-12-23","location":"广东 深圳  ","company":"Coding.net","slogan":"岂能尽如人意，但求无愧我心","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/4f02cf13-5d6a-46cf-8b8d-efc389fba4c1.jpg","lavatar":"https://dn-coding-net-production-static.qbox.me/4f02cf13-5d6a-46cf-8b8d-efc389fba4c1.jpg","created_at":1399066489000,"last_logined_at":1423487276000,"last_activity_at":1423619074696,"global_key":"zhlmmc","name":"zhlmmc","updated_at":1399066489000,"path":"/u/zhlmmc","status":1,"id":8,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423619074704,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/mojifan\" rel\u003d\"nofollow\"\u003e@墨迹凡\u003c/a\u003e : 被拒了好多次\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/sob.png\" title\u003d\"sob\"\u003e"},{"id":59394,"tweet_id":22293,"owner_id":12402,"owner":{"job":6,"sex":0,"phone":"","birthday":"1990-05-25","location":"北京 海淀区","company":"","slogan":"专业打杂20年","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/9da7c336-85a0-4c8d-9774-07de17867780.jpeg?imageMogr2/auto-orient/format/jpeg/crop/!200x200a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/9da7c336-85a0-4c8d-9774-07de17867780.jpeg?imageMogr2/auto-orient/format/jpeg/crop/!200x200a0a0","created_at":1408254032000,"last_logined_at":1422262854000,"last_activity_at":1423618766179,"global_key":"mojifan","name":"墨迹凡","updated_at":1408254032000,"path":"/u/mojifan","status":1,"id":12402,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618766189,"content":"审核好久了吧"}],"device":"iPhone 6","content":"\u003cp\u003e据说已经小年了…但愿 iOS 新版能尽快通过…\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/cry.png\" title\u003d\"cry\"\u003e\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[{"global_key":"youzi","name":"柚子","path":"/u/youzi","avatar":"https://dn-coding-net-production-static.qbox.me/04a99819-ecbc-4e1b-b209-9ccc73104e50.jpg?imageMogr2/auto-orient/format/jpeg/crop/!440x440a0a0"},{"global_key":"ikeith","name":"ikeith","path":"/u/ikeith","avatar":"https://dn-coding-net-production-static.qbox.me/bbf1f3fa-d935-4233-8e22-f63ced41d2a8.jpg?imageMogr2/auto-orient/format/jpeg/crop/!465x465a81a172"}]},{"id":22292,"owner_id":36142,"owner":{"job":1,"sex":0,"phone":"15688888134","birthday":"1989-11-09","location":"江苏 苏州","company":"苏州外星科技","slogan":"像我这样拉风帅气的码农，还能有第二个？~","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/f23205b8-9d9c-466b-bbdb-5deb4de562c3.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a15a0","lavatar":"https://dn-coding-net-production-static.qbox.me/f23205b8-9d9c-466b-bbdb-5deb4de562c3.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a15a0","created_at":1413787731000,"last_logined_at":1423198977000,"last_activity_at":1423616489042,"global_key":"brainqi","name":"BrainQi","updated_at":1413787731000,"path":"/u/brainqi","status":1,"id":36142,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423616489571,"likes":1,"comments":9,"comment_list":[{"id":59399,"tweet_id":22292,"owner_id":35907,"owner":{"job":0,"sex":0,"phone":"","birthday":"1111-11-11","location":"","company":"","slogan":"资深不专业逗比","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/257fef5d-af58-48ad-949a-80dbb9bce847.jpg?imageMogr2/auto-orient/format/jpeg/crop/!193x193a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/257fef5d-af58-48ad-949a-80dbb9bce847.jpg?imageMogr2/auto-orient/format/jpeg/crop/!193x193a0a0","created_at":1413647368000,"last_logined_at":1423615773257,"last_activity_at":1423619107943,"global_key":"itsing","name":"一台一台一台台","updated_at":1413647368000,"path":"/u/itsing","status":1,"id":35907,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423619107952,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/brainqi\" rel\u003d\"nofollow\"\u003e@BrainQi\u003c/a\u003e 不不不，我也觉得\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/panpan\" rel\u003d\"nofollow\"\u003e@潘潘\u003c/a\u003e 说的很对"},{"id":59396,"tweet_id":22292,"owner_id":36142,"owner":{"job":1,"sex":0,"phone":"15688888134","birthday":"1989-11-09","location":"江苏 苏州","company":"苏州外星科技","slogan":"像我这样拉风帅气的码农，还能有第二个？~","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/f23205b8-9d9c-466b-bbdb-5deb4de562c3.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a15a0","lavatar":"https://dn-coding-net-production-static.qbox.me/f23205b8-9d9c-466b-bbdb-5deb4de562c3.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a15a0","created_at":1413787731000,"last_logined_at":1423198977000,"last_activity_at":1423618855133,"global_key":"brainqi","name":"BrainQi","updated_at":1413787731000,"path":"/u/brainqi","status":1,"id":36142,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618855143,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/ikeith\" rel\u003d\"nofollow\"\u003e@ikeith\u003c/a\u003e 醉了，我买的时牙膏，不是苏菲，再说了，谁说男的就不能买卫生棉了，给女朋友买啊！\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/trollface.png\" title\u003d\"trollface\"\u003e"},{"id":59395,"tweet_id":22292,"owner_id":56056,"owner":{"job":1,"sex":0,"phone":"","birthday":"1988-01-08","location":"北京 海淀区","company":"","slogan":"Never stop","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/bbf1f3fa-d935-4233-8e22-f63ced41d2a8.jpg?imageMogr2/auto-orient/format/jpeg/crop/!465x465a81a172","lavatar":"https://dn-coding-net-production-static.qbox.me/bbf1f3fa-d935-4233-8e22-f63ced41d2a8.jpg?imageMogr2/auto-orient/format/jpeg/crop/!465x465a81a172","created_at":1418908271000,"last_logined_at":1421686187000,"last_activity_at":1423618766511,"global_key":"ikeith","name":"ikeith","updated_at":1418908271000,"path":"/u/ikeith","status":1,"id":56056,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618766517,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/brainqi\" rel\u003d\"nofollow\"\u003e@BrainQi\u003c/a\u003e : 女汉子←_←"},{"id":59393,"tweet_id":22292,"owner_id":36142,"owner":{"job":1,"sex":0,"phone":"15688888134","birthday":"1989-11-09","location":"江苏 苏州","company":"苏州外星科技","slogan":"像我这样拉风帅气的码农，还能有第二个？~","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/f23205b8-9d9c-466b-bbdb-5deb4de562c3.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a15a0","lavatar":"https://dn-coding-net-production-static.qbox.me/f23205b8-9d9c-466b-bbdb-5deb4de562c3.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a15a0","created_at":1413787731000,"last_logined_at":1423198977000,"last_activity_at":1423618740336,"global_key":"brainqi","name":"BrainQi","updated_at":1413787731000,"path":"/u/brainqi","status":1,"id":36142,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618740342,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/ikeith\" rel\u003d\"nofollow\"\u003e@ikeith\u003c/a\u003e : 汉子…"},{"id":59392,"tweet_id":22292,"owner_id":36142,"owner":{"job":1,"sex":0,"phone":"15688888134","birthday":"1989-11-09","location":"江苏 苏州","company":"苏州外星科技","slogan":"像我这样拉风帅气的码农，还能有第二个？~","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/f23205b8-9d9c-466b-bbdb-5deb4de562c3.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a15a0","lavatar":"https://dn-coding-net-production-static.qbox.me/f23205b8-9d9c-466b-bbdb-5deb4de562c3.jpg?imageMogr2/auto-orient/format/jpeg/crop/!170x170a15a0","created_at":1413787731000,"last_logined_at":1423198977000,"last_activity_at":1423618720114,"global_key":"brainqi","name":"BrainQi","updated_at":1413787731000,"path":"/u/brainqi","status":1,"id":36142,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618720125,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/panpan\" rel\u003d\"nofollow\"\u003e@潘潘\u003c/a\u003e : 明明是牙膏好伐，女人和男人关注点始终不一样啊，你说是吧\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/itsing\" rel\u003d\"nofollow\"\u003e@一台一台一台台\u003c/a\u003e "}],"device":"iPhone 5s","content":"\u003cp\u003e我这是来上班的么…\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/smile.png\" title\u003d\"smile\"\u003e \u003ca href\u003d\"https://dn-coding-net-production-pp.qbox.me/355f3ee6-195d-400e-b506-3bc5afc71ad6.jpg\" target\u003d\"_blank\" class\u003d\"bubble-markdown-image-link\" rel\u003d\"nofollow\"\u003e\u003cimg src\u003d\"https://dn-coding-net-production-pp.qbox.me/355f3ee6-195d-400e-b506-3bc5afc71ad6.jpg\" alt\u003d\"图片\" class\u003d\" bubble-markdown-image\"\u003e\u003c/a\u003e \u003ca href\u003d\"https://dn-coding-net-production-pp.qbox.me/0c0a8a53-83a4-46ce-b5fc-d8b2a6d67bd5.jpg\" target\u003d\"_blank\" class\u003d\"bubble-markdown-image-link\" rel\u003d\"nofollow\"\u003e\u003cimg src\u003d\"https://dn-coding-net-production-pp.qbox.me/0c0a8a53-83a4-46ce-b5fc-d8b2a6d67bd5.jpg\" alt\u003d\"图片\" class\u003d\" bubble-markdown-image\"\u003e\u003c/a\u003e \u003ca href\u003d\"https://dn-coding-net-production-pp.qbox.me/b769f37b-f6f6-42a7-b020-0e9ed2a20113.jpg\" target\u003d\"_blank\" class\u003d\"bubble-markdown-image-link\" rel\u003d\"nofollow\"\u003e\u003cimg src\u003d\"https://dn-coding-net-production-pp.qbox.me/b769f37b-f6f6-42a7-b020-0e9ed2a20113.jpg\" alt\u003d\"图片\" class\u003d\" bubble-markdown-image\"\u003e\u003c/a\u003e \u003c/p\u003e","activity_id":0,"liked":false,"like_users":[{"global_key":"jaysun","name":"卡基猫","path":"/u/jaysun","avatar":"https://dn-coding-net-production-static.qbox.me/1d3476cac70c29fe779592a42ea7bff2.png"}]},{"id":22291,"owner_id":2455,"owner":{"job":1,"sex":2,"phone":"","birthday":"1970-01-01","location":"北京 ","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/1d3476cac70c29fe779592a42ea7bff2.png","lavatar":"https://dn-coding-net-production-static.qbox.me/1d3476cac70c29fe779592a42ea7bff2.png","created_at":1405998676000,"last_logined_at":1421763388000,"last_activity_at":1423616104146,"global_key":"jaysun","name":"卡基猫","updated_at":1405998676000,"path":"/u/jaysun","status":1,"id":2455,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423616104160,"likes":1,"comments":0,"comment_list":[],"device":"","content":"\u003cp\u003e禽兽们，早上好。\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[{"global_key":"ikeith","name":"ikeith","path":"/u/ikeith","avatar":"https://dn-coding-net-production-static.qbox.me/bbf1f3fa-d935-4233-8e22-f63ced41d2a8.jpg?imageMogr2/auto-orient/format/jpeg/crop/!465x465a81a172"}]},{"id":22290,"owner_id":80670,"owner":{"job":0,"sex":2,"phone":"","birthday":"1985-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/84bed0ff-6d21-432a-888f-f2e54eab9725.png?imageMogr2/auto-orient/format/png/crop/!402x402a0a1","lavatar":"https://dn-coding-net-production-static.qbox.me/84bed0ff-6d21-432a-888f-f2e54eab9725.png?imageMogr2/auto-orient/format/png/crop/!402x402a0a1","created_at":1423575523000,"last_logined_at":1423614563967,"last_activity_at":1423615081758,"global_key":"MJ_michael","name":"MJ_michael","updated_at":1423575523000,"path":"/u/MJ_michael","status":1,"id":80670,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423614785716,"likes":1,"comments":0,"comment_list":[],"device":"","content":"\u003cp\u003e\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/smiley.png\" title\u003d\"smiley\"\u003e 开始新的一天！\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[{"global_key":"ikeith","name":"ikeith","path":"/u/ikeith","avatar":"https://dn-coding-net-production-static.qbox.me/bbf1f3fa-d935-4233-8e22-f63ced41d2a8.jpg?imageMogr2/auto-orient/format/jpeg/crop/!465x465a81a172"}]},{"id":22289,"owner_id":2552,"owner":{"job":6,"sex":2,"phone":"","birthday":"1994-08-02","location":"山东 烟台","company":"","slogan":"にゃにゃん","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/669e1714-e6d7-47d6-8984-8de4e5c3d5c1.png?imageMogr2/auto-orient/format/png/crop/!450x450a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/669e1714-e6d7-47d6-8984-8de4e5c3d5c1.png?imageMogr2/auto-orient/format/png/crop/!450x450a0a0","created_at":1406008158000,"last_logined_at":1419560577000,"last_activity_at":1423613837983,"global_key":"xin","name":"xin","updated_at":1406008158000,"path":"/u/xin","status":1,"id":2552,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423613838001,"likes":2,"comments":2,"comment_list":[{"id":59385,"tweet_id":22289,"owner_id":22811,"owner":{"job":6,"sex":0,"phone":"","birthday":"1986-08-16","location":"山东 青岛","company":"","slogan":"有点想法很好，有点行动更好","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/effe786f-c79a-4102-93d0-f684d36a3c20.png?imageMogr2/auto-orient/format/png/crop/!230x230a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/effe786f-c79a-4102-93d0-f684d36a3c20.png?imageMogr2/auto-orient/format/png/crop/!230x230a0a0","created_at":1409097666000,"last_logined_at":1420447520000,"last_activity_at":1423618155026,"global_key":"silverwing","name":"愚夫","updated_at":1409097666000,"path":"/u/silverwing","status":1,"id":22811,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618155033,"content":"麻木"},{"id":59369,"tweet_id":22289,"owner_id":34260,"owner":{"job":1,"sex":0,"phone":"","birthday":"1994-04-23","location":"","company":"","slogan":"No man is an island, entire of itself.","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/49a2c54f-d5bf-4aec-b318-5a8e938d58c8.png?imageMogr2/auto-orient/format/png/crop/!480x480a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/49a2c54f-d5bf-4aec-b318-5a8e938d58c8.png?imageMogr2/auto-orient/format/png/crop/!480x480a0a0","created_at":1412760501000,"last_logined_at":1423616417494,"last_activity_at":1423616952556,"global_key":"yaodan","name":"瑶蛋","updated_at":1412760501000,"path":"/u/yaodan","status":1,"id":34260,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423616952566,"content":"看到第一个就感觉自己也痛的不行不行的 \u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/wave.png\" title\u003d\"wave\"\u003e"}],"device":"","content":"\u003cp\u003e\u003ca href\u003d\"http://www.zcool.com.cn/work/ZNjgwMzU2MA\u003d\u003d/1.html\" target\u003d\"_blank\" class\u003d\" auto-link\" rel\u003d\"nofollow\"\u003ehttp://www.zcool.com.cn/work/ZNjgwMzU2MA\u003d\u003d/1.html\u003c/a\u003e\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[{"global_key":"ikeith","name":"ikeith","path":"/u/ikeith","avatar":"https://dn-coding-net-production-static.qbox.me/bbf1f3fa-d935-4233-8e22-f63ced41d2a8.jpg?imageMogr2/auto-orient/format/jpeg/crop/!465x465a81a172"},{"global_key":"yaodan","name":"瑶蛋","path":"/u/yaodan","avatar":"https://dn-coding-net-production-static.qbox.me/49a2c54f-d5bf-4aec-b318-5a8e938d58c8.png?imageMogr2/auto-orient/format/png/crop/!480x480a0a0"}]},{"id":22288,"owner_id":56056,"owner":{"job":1,"sex":0,"phone":"","birthday":"1988-01-08","location":"北京 海淀区","company":"","slogan":"Never stop","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/bbf1f3fa-d935-4233-8e22-f63ced41d2a8.jpg?imageMogr2/auto-orient/format/jpeg/crop/!465x465a81a172","lavatar":"https://dn-coding-net-production-static.qbox.me/bbf1f3fa-d935-4233-8e22-f63ced41d2a8.jpg?imageMogr2/auto-orient/format/jpeg/crop/!465x465a81a172","created_at":1418908271000,"last_logined_at":1421686187000,"last_activity_at":1423611948516,"global_key":"ikeith","name":"ikeith","updated_at":1418908271000,"path":"/u/ikeith","status":1,"id":56056,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423611948533,"likes":1,"comments":0,"comment_list":[],"device":"小米 3W","content":"\u003cp\u003eGood morning coding coding\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[{"global_key":"zhlmmc","name":"zhlmmc","path":"/u/zhlmmc","avatar":"https://dn-coding-net-production-static.qbox.me/4f02cf13-5d6a-46cf-8b8d-efc389fba4c1.jpg"}]},{"id":22287,"owner_id":20146,"owner":{"job":1,"sex":0,"phone":"","birthday":"1992-10-22","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/aa3557ac-1b6c-4353-bcbb-30092a3deb2e.jpg","lavatar":"https://dn-coding-net-production-static.qbox.me/aa3557ac-1b6c-4353-bcbb-30092a3deb2e.jpg","created_at":1408843171000,"last_logined_at":1423615034901,"last_activity_at":1423610343387,"global_key":"tosone","name":"tosone","updated_at":1408843171000,"path":"/u/tosone","status":1,"id":20146,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423609457585,"likes":5,"comments":2,"comment_list":[{"id":59386,"tweet_id":22287,"owner_id":44455,"owner":{"job":0,"sex":0,"phone":"","birthday":"1985-01-01","location":"安徽 合肥","company":"","slogan":"至繁归于至简，简约而不简单。","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/d369b510-f4d3-42ca-88ea-12ca0a062be5.jpg","lavatar":"https://dn-coding-net-production-static.qbox.me/d369b510-f4d3-42ca-88ea-12ca0a062be5.jpg","created_at":1416112039000,"last_logined_at":1422968278000,"last_activity_at":1423618191639,"global_key":"dphdjy","name":"尚简","updated_at":1416112039000,"path":"/u/dphdjy","status":1,"id":44455,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618191650,"content":"举爪"},{"id":59363,"tweet_id":22287,"owner_id":77157,"owner":{"job":0,"sex":0,"phone":"","birthday":"1985-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/d8198758-548a-42d6-8b01-cd2b803fd65f.jpg?imageMogr2/auto-orient/format/jpeg/crop/!412x412a0a55","lavatar":"https://dn-coding-net-production-static.qbox.me/d8198758-548a-42d6-8b01-cd2b803fd65f.jpg?imageMogr2/auto-orient/format/jpeg/crop/!412x412a0a55","created_at":1421903400000,"last_logined_at":1423045694000,"last_activity_at":1423616370529,"global_key":"alfredduck","name":"alfredduck","updated_at":1421903400000,"path":"/u/alfredduck","status":1,"id":77157,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423616370538,"content":"举手"}],"device":"红米 Note","content":"\u003cp\u003e做nodejs开发的有没有？来冒个泡。\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/smiley.png\" title\u003d\"smiley\"\u003e\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[{"global_key":"dphdjy","name":"尚简","path":"/u/dphdjy","avatar":"https://dn-coding-net-production-static.qbox.me/d369b510-f4d3-42ca-88ea-12ca0a062be5.jpg"},{"global_key":"Flamehaze","name":"Flamehaze","path":"/u/Flamehaze","avatar":"https://dn-coding-net-production-static.qbox.me/accc56ae-c8c6-432c-bc36-1670054c33f7.jpg?imageMogr2/auto-orient/format/jpeg/crop/!566x566a0a106"},{"global_key":"silexchan","name":"Bill-chan","path":"/u/silexchan","avatar":"https://dn-coding-net-production-static.qbox.me/f38dc6c8-da47-45dc-8c2c-42ce36f64456.jpg?imageMogr2/auto-orient/format/jpeg/crop/!280x280a0a0"},{"global_key":"kiringame","name":"kiringame","path":"/u/kiringame","avatar":"/static/fruit_avatar/Fruit-10.png"},{"global_key":"tosone","name":"tosone","path":"/u/tosone","avatar":"https://dn-coding-net-production-static.qbox.me/aa3557ac-1b6c-4353-bcbb-30092a3deb2e.jpg"}]},{"id":22286,"owner_id":78985,"owner":{"job":3,"sex":0,"phone":"","birthday":"1973-08-01","location":"北京 朝阳区","company":"","slogan":"喝咖啡就大蒜 秋水长天一色","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/208a3e8d-2dde-4251-9d62-dc0ce77e4762.jpg?imageMogr2/auto-orient/format/jpeg/crop/!340x340a0a1","lavatar":"https://dn-coding-net-production-static.qbox.me/208a3e8d-2dde-4251-9d62-dc0ce77e4762.jpg?imageMogr2/auto-orient/format/jpeg/crop/!340x340a0a1","created_at":1422622113000,"last_logined_at":1423545066000,"last_activity_at":1423598733855,"global_key":"bati","name":"bati","updated_at":1422622113000,"path":"/u/bati","status":1,"id":78985,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423598733875,"likes":0,"comments":4,"comment_list":[{"id":59397,"tweet_id":22286,"owner_id":45341,"owner":{"job":1,"sex":0,"phone":"","birthday":"1985-01-01","location":"","company":"","slogan":"Call me a dreamer, I\u0027m doing it anyway.","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/a9a54cb6-f20e-47e4-8243-8d32ee53cb02.jpg?imageMogr2/auto-orient/format/jpeg/crop/!441x441a10a10","lavatar":"https://dn-coding-net-production-static.qbox.me/a9a54cb6-f20e-47e4-8243-8d32ee53cb02.jpg?imageMogr2/auto-orient/format/jpeg/crop/!441x441a10a10","created_at":1416281760000,"last_logined_at":1423228626000,"last_activity_at":1423619020781,"global_key":"lythm","name":"lythm","updated_at":1416281760000,"path":"/u/lythm","status":1,"id":45341,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423619020791,"content":"没有vpn难道照着百度百科开发吗"},{"id":59387,"tweet_id":22286,"owner_id":32654,"owner":{"job":1,"sex":0,"phone":"","birthday":"1992-09-04","location":"广东 深圳","company":"","slogan":"你必须非常努力，才能看上去毫不费力","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/fd2d9076-a577-4822-9ed6-de8d0c62ddda.jpg?imageMogr2/auto-orient/format/jpeg/crop/!180x180a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/fd2d9076-a577-4822-9ed6-de8d0c62ddda.jpg?imageMogr2/auto-orient/format/jpeg/crop/!180x180a0a0","created_at":1411295440000,"last_logined_at":1422542423000,"last_activity_at":1423618238069,"global_key":"heby","name":"heby","updated_at":1411295440000,"path":"/u/heby","status":1,"id":32654,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423618238076,"content":"VPN当然要搞起。"},{"id":59378,"tweet_id":22286,"owner_id":33054,"owner":{"job":1,"sex":0,"phone":"","birthday":"1988-04-14","location":"广东 深圳","company":"失业ing","slogan":"一直在学习，从未超越过。","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/c35ead42-c0a0-46e6-9408-a9978ca0d005.jpg?imageMogr2/auto-orient/format/jpeg/crop/!638x638a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/c35ead42-c0a0-46e6-9408-a9978ca0d005.jpg?imageMogr2/auto-orient/format/jpeg/crop/!638x638a0a0","created_at":1411640969000,"last_logined_at":1423490979000,"last_activity_at":1423617491248,"global_key":"skiy","name":"skiy","updated_at":1411640969000,"path":"/u/skiy","status":1,"id":33054,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423617491255,"content":"有vps。发现不知道怎么架设l2tp或者pptp"},{"id":59362,"tweet_id":22286,"owner_id":8,"owner":{"job":6,"sex":0,"phone":"","birthday":"1984-12-23","location":"广东 深圳  ","company":"Coding.net","slogan":"岂能尽如人意，但求无愧我心","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/4f02cf13-5d6a-46cf-8b8d-efc389fba4c1.jpg","lavatar":"https://dn-coding-net-production-static.qbox.me/4f02cf13-5d6a-46cf-8b8d-efc389fba4c1.jpg","created_at":1399066489000,"last_logined_at":1423487276000,"last_activity_at":1423615872927,"global_key":"zhlmmc","name":"zhlmmc","updated_at":1399066489000,"path":"/u/zhlmmc","status":1,"id":8,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423615872934,"content":"必备啊"}],"device":"","content":"\u003cp\u003e程序员都有vpn吗？ angularjs golang 等等打不开，貌似s3和gg都不好使\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]},{"id":22285,"owner_id":10737,"owner":{"job":6,"sex":0,"phone":"15901026760","birthday":"1985-01-01","location":"","company":"","slogan":"哥要成为一个写的了代码做的好设计下的了厨房赚的了钞票的居家好男人。","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/be81384c-6301-479f-8d91-c83336afb6f3.png?imageMogr2/auto-orient/format/png/crop/!440x440a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/be81384c-6301-479f-8d91-c83336afb6f3.png?imageMogr2/auto-orient/format/png/crop/!440x440a0a0","created_at":1408037612000,"last_logined_at":1420611013000,"last_activity_at":1423597131303,"global_key":"bijiabo","name":"毕加波","updated_at":1408037612000,"path":"/u/bijiabo","status":1,"id":10737,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423597131316,"likes":0,"comments":0,"comment_list":[],"device":"","content":"\u003cp\u003e最近coding又有活动了@@？\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]},{"id":22284,"owner_id":10737,"owner":{"job":6,"sex":0,"phone":"15901026760","birthday":"1985-01-01","location":"","company":"","slogan":"哥要成为一个写的了代码做的好设计下的了厨房赚的了钞票的居家好男人。","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/be81384c-6301-479f-8d91-c83336afb6f3.png?imageMogr2/auto-orient/format/png/crop/!440x440a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/be81384c-6301-479f-8d91-c83336afb6f3.png?imageMogr2/auto-orient/format/png/crop/!440x440a0a0","created_at":1408037612000,"last_logined_at":1420611013000,"last_activity_at":1423596951568,"global_key":"bijiabo","name":"毕加波","updated_at":1408037612000,"path":"/u/bijiabo","status":1,"id":10737,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423596952087,"likes":0,"comments":0,"comment_list":[],"device":"","content":"\u003cp\u003e\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/desperatecat\" rel\u003d\"nofollow\"\u003e@猫爷\u003c/a\u003e “我来张开双腿诱惑你啦!”\u003cbr\u003e \u003ca href\u003d\"https://dn-coding-net-production-pp.qbox.me/07a3dd87-6711-481e-ab62-d188d178d427.jpeg\" target\u003d\"_blank\" class\u003d\"bubble-markdown-image-link\" rel\u003d\"nofollow\"\u003e\u003cimg src\u003d\"https://dn-coding-net-production-pp.qbox.me/07a3dd87-6711-481e-ab62-d188d178d427.jpeg\" alt\u003d\"图片\" class\u003d\" bubble-markdown-image\"\u003e\u003c/a\u003e\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]},{"id":22283,"owner_id":41106,"owner":{"job":6,"sex":2,"phone":"","birthday":"1975-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","lavatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","created_at":1415687370000,"last_logined_at":1422631926000,"last_activity_at":1423590566204,"global_key":"fwolf","name":"Fwolf","updated_at":1415687370000,"path":"/u/fwolf","status":1,"id":41106,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423590566222,"likes":0,"comments":2,"comment_list":[{"id":59355,"tweet_id":22283,"owner_id":41106,"owner":{"job":6,"sex":2,"phone":"","birthday":"1975-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","lavatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","created_at":1415687370000,"last_logined_at":1422631926000,"last_activity_at":1423612688232,"global_key":"fwolf","name":"Fwolf","updated_at":1415687370000,"path":"/u/fwolf","status":1,"id":41106,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423612688243,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/wangshunightowl\" rel\u003d\"nofollow\"\u003e@望舒theNightOwl\u003c/a\u003e : 谢谢，如果不行我就把js文件转码，应该也行"},{"id":59344,"tweet_id":22283,"owner_id":79402,"owner":{"job":1,"sex":0,"phone":"","birthday":"1987-12-21","location":"辽宁 沈阳","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-avatar.qbox.me/e69d635e-251f-4985-8165-0f2de28f9d63.jpg","lavatar":"https://dn-coding-net-avatar.qbox.me/e69d635e-251f-4985-8165-0f2de28f9d63.jpg","created_at":1422886972000,"last_logined_at":1422986420000,"last_activity_at":1423591194935,"global_key":"wangshunightowl","name":"望舒theNightOwl","updated_at":1422886972000,"path":"/u/wangshunightowl","status":1,"id":79402,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423591194944,"content":"有没有听过 iconv-lite (\u003ca href\u003d\"https://github.com/ashtuchkin/iconv-lite\" class\u003d\"auto-link\" target\u003d\"_blank\" rel\u003d\"nofollow\"\u003ehttps://github.com/ashtuchkin/iconv-lite\u003c/a\u003e), 是用纯 js 实现的字符集转码, 可以看一看"}],"device":"","content":"\u003cp\u003e求 js 中把 utf8 字符串转为 gb2312 编码的原生代码，提交后台转换太慢效果不好。\u003cbr\u003e \u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/itsing\" rel\u003d\"nofollow\"\u003e@一台一台一台台\u003c/a\u003e \u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]},{"id":22282,"owner_id":67398,"owner":{"job":0,"sex":0,"phone":"","birthday":"1985-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-avatar.qbox.me/e7a65616-2b49-4d9e-989f-875824d388f1.jpg","lavatar":"https://dn-coding-net-avatar.qbox.me/e7a65616-2b49-4d9e-989f-875824d388f1.jpg","created_at":1420180503000,"last_logined_at":1423589792610,"last_activity_at":1423589954031,"global_key":"xingfeng737","name":"xingfeng737","updated_at":1420180503000,"path":"/u/xingfeng737","status":1,"id":67398,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423589954551,"likes":0,"comments":1,"comment_list":[{"id":59347,"tweet_id":22282,"owner_id":10737,"owner":{"job":6,"sex":0,"phone":"15901026760","birthday":"1985-01-01","location":"","company":"","slogan":"哥要成为一个写的了代码做的好设计下的了厨房赚的了钞票的居家好男人。","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/be81384c-6301-479f-8d91-c83336afb6f3.png?imageMogr2/auto-orient/format/png/crop/!440x440a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/be81384c-6301-479f-8d91-c83336afb6f3.png?imageMogr2/auto-orient/format/png/crop/!440x440a0a0","created_at":1408037612000,"last_logined_at":1420611013000,"last_activity_at":1423596988207,"global_key":"bijiabo","name":"毕加波","updated_at":1408037612000,"path":"/u/bijiabo","status":1,"id":10737,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423596988212,"content":"15寸就是爽"}],"device":"iPhone 5s","content":"\u003cp\u003e\u003ca href\u003d\"https://dn-coding-net-production-pp.qbox.me/79f8512f-4db8-45e3-9d74-b9bc38e4c87c.jpg\" target\u003d\"_blank\" class\u003d\"bubble-markdown-image-link\" rel\u003d\"nofollow\"\u003e\u003cimg src\u003d\"https://dn-coding-net-production-pp.qbox.me/79f8512f-4db8-45e3-9d74-b9bc38e4c87c.jpg\" alt\u003d\"图片\" class\u003d\" bubble-markdown-image\"\u003e\u003c/a\u003e \u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]},{"id":22281,"owner_id":3757,"owner":{"job":0,"sex":2,"phone":"","birthday":"1985-01-01","location":"","company":"","slogan":"我们做出选择并活在这个选择中，然后满怀希望的生活下去。","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/0a7e3f8a-5093-4e66-9db1-c53a57cc710c.png?imageMogr2/auto-orient/format/png/crop/!773x773a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/0a7e3f8a-5093-4e66-9db1-c53a57cc710c.png?imageMogr2/auto-orient/format/png/crop/!773x773a0a0","created_at":1406182863000,"last_logined_at":1423574466328,"last_activity_at":1423589155322,"global_key":"wangfeiping","name":"wangfeiping","updated_at":1406182863000,"path":"/u/wangfeiping","status":1,"id":3757,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423589155337,"likes":0,"comments":0,"comment_list":[],"device":"","content":"\u003cp\u003egwt还是不行,又报和上次一样的错了,这是为什么?这次看了一下编译时间,不到3分钟.\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]},{"id":22280,"owner_id":41106,"owner":{"job":6,"sex":2,"phone":"","birthday":"1975-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","lavatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","created_at":1415687370000,"last_logined_at":1422631926000,"last_activity_at":1423588073004,"global_key":"fwolf","name":"Fwolf","updated_at":1415687370000,"path":"/u/fwolf","status":1,"id":41106,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423588073517,"likes":0,"comments":4,"comment_list":[{"id":59364,"tweet_id":22280,"owner_id":41106,"owner":{"job":6,"sex":2,"phone":"","birthday":"1975-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","lavatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","created_at":1415687370000,"last_logined_at":1422631926000,"last_activity_at":1423616454533,"global_key":"fwolf","name":"Fwolf","updated_at":1415687370000,"path":"/u/fwolf","status":1,"id":41106,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423616454544,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/kiringame\" rel\u003d\"nofollow\"\u003e@kiringame\u003c/a\u003e 别人的媳妇和自己的语言才是最好的！"},{"id":59357,"tweet_id":22280,"owner_id":77658,"owner":{"job":6,"sex":0,"phone":"","birthday":"2013-01-20","location":"北京 朝阳区","company":"kir","slogan":"不！","introduction":"","avatar":"/static/fruit_avatar/Fruit-10.png","lavatar":"/static/fruit_avatar/Fruit-10.png","created_at":1422022194000,"last_logined_at":1423555202000,"last_activity_at":1423612735271,"global_key":"kiringame","name":"kiringame","updated_at":1422022194000,"path":"/u/kiringame","status":1,"id":77658,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423612735276,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/bijiabo\" rel\u003d\"nofollow\"\u003e@毕加波\u003c/a\u003e : c++才是！"},{"id":59356,"tweet_id":22280,"owner_id":41106,"owner":{"job":6,"sex":2,"phone":"","birthday":"1975-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","lavatar":"https://dn-coding-net-avatar.qbox.me/de0b3864-c6f5-4ac4-813a-9c7433816ec7.png","created_at":1415687370000,"last_logined_at":1422631926000,"last_activity_at":1423612700243,"global_key":"fwolf","name":"Fwolf","updated_at":1415687370000,"path":"/u/fwolf","status":1,"id":41106,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423612700247,"content":"\u003ca class\u003d\"at-someone\" href\u003d\"https://coding.net/u/bijiabo\" rel\u003d\"nofollow\"\u003e@毕加波\u003c/a\u003e : 噗…………"},{"id":59348,"tweet_id":22280,"owner_id":10737,"owner":{"job":6,"sex":0,"phone":"15901026760","birthday":"1985-01-01","location":"","company":"","slogan":"哥要成为一个写的了代码做的好设计下的了厨房赚的了钞票的居家好男人。","introduction":"","avatar":"https://dn-coding-net-production-static.qbox.me/be81384c-6301-479f-8d91-c83336afb6f3.png?imageMogr2/auto-orient/format/png/crop/!440x440a0a0","lavatar":"https://dn-coding-net-production-static.qbox.me/be81384c-6301-479f-8d91-c83336afb6f3.png?imageMogr2/auto-orient/format/png/crop/!440x440a0a0","created_at":1408037612000,"last_logined_at":1420611013000,"last_activity_at":1423597000004,"global_key":"bijiabo","name":"毕加波","updated_at":1408037612000,"path":"/u/bijiabo","status":1,"id":10737,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423597000009,"content":"js是世界上最好的语言！"}],"device":"","content":"\u003cp\u003e偶尔写点js，这个头大啊～～～\u003cbr\u003e \u003cimg class\u003d\"emotion monkey\" src\u003d\"https://coding.net/static/coding-emotions/coding-emoji-04.png\" title\u003d\"忧伤\"\u003e \u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]},{"id":22279,"owner_id":1142,"owner":{"job":0,"sex":0,"phone":"","birthday":"1970-01-01","location":"","company":"","slogan":"","introduction":"","avatar":"/static/fruit_avatar/Fruit-17.png","lavatar":"/static/fruit_avatar/Fruit-17.png","created_at":1405573492000,"last_logined_at":1423587949407,"last_activity_at":1423588069418,"global_key":"baozi","name":"baozi","updated_at":1405573492000,"path":"/u/baozi","status":1,"id":1142,"follows_count":0,"fans_count":0,"followed":false,"follow":false},"created_at":1423588069436,"likes":0,"comments":0,"comment_list":[],"device":"","content":"\u003cp\u003e\u003cimg class\u003d\"emotion emoji\" src\u003d\"https://coding.net/static/emojis/grin.png\" title\u003d\"grin\"\u003e\u003c/p\u003e","activity_id":0,"liked":false,"like_users":[]}]}
                //if(data.data){
                //    assembleDOM(data.data);
                //    last_id = data.data[data.data.length - 1]['id']; //id of last item in list
                //}else{
                //    alert('Failed to load pp');
                //}
            },
            complete: function(){
                loadMoreBtn.text('更多泡泡');
            }
        });
    }

    function assetPath(path){
        if(path.substr(0,1) === '/'){
            path = API_DOMAIN + path;
        }
        return path;
    }


    return {
        template_url: '/views/pp.html',
        context: ".container",
        before_enter: function(hot){

            $('title').text('冒泡');

            var pp_nav =  '<div class="row project_header">' +
                                '<div class="col-xs-6">' +
                                    '<a href="#">最新</a>' +
                                '</div>' +
                                '<div class="col-xs-6">' +
                                    '<a href="#">热门</a>' +
                                '</div>' +
                            '</div>',
                nav_ele = $(pp_nav);

            nav_ele.find('div').eq(0).children('a').attr('href', '/pp');
            nav_ele.find('div').eq(1).children('a').attr('href',  '/pp/hot');

            $("nav.main-navbar").after(nav_ele);

            //active this page link
            $('#navigator').find("li:last-child").addClass('active');
            if(hot === 'hot'){
                nav_ele.find('div').eq(1).children('a').addClass('active');
            }else{
                nav_ele.find('div').eq(0).children('a').addClass('active');
            }

        },
        on_enter: function(hot){

            //decide if this is hot page
            if(hot === 'hot'){
                sort = 'hot';
            }else{
                sort = 'time';
            }

            refresh();

            $('#load_more').on('click', function(e){
                e.preventDefault();
                loadMore('/api/tweet/public_tweets');
            });

        },
        on_exit: function(){
            $('title').text('');

            $('#navigator').find('li').removeClass('active');
            $('.project_header').remove();

            reset();
        }
    }

})();
