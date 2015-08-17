/**
 * Created by simonykq on 21/12/2014.
 */
var PP_ROUTE  = (function(){

    var last_id  = 99999999,
        sort     = 'time',
        list     = null,
        elements = {};

    function assembleDOM(data){
        var pps       = data || [],
            fragment  = document.createDocumentFragment(),
            ele;

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
                                '<a class="commenterName" href="#"></a>' +
                                '<div class="commentedAt"></div>' +
                            '</div>' +
                            '<div class="commentBox">' +
                                '<p class="taskDescription"></p>' +
                            '</div>' +

                            '<div class="commenterDetail pull-left"></div>' +

                            '<a href="#" class="pull-right comment">' +
                                '<span><i class="icon-comment"></i> 评论 </span>' +
                            '</a>' +
                            '<a href="#" class="pull-right star">' +
                                '<span><i class="icon-like"></i> <span class="star-tip">赞</span> </span>' +
                            '</a>' +
                            '<br />' +
                            '<div class="actionBox">' +
                                '<div class="row">' +
                                    '<div class="col-sm-12 like_users">' +
                                        '<a class="toLikeUsers" href="#"></a>' + 
                                    '</div>' +
                                '</div>' +
                                '<ul class="commentList">' +
                                '</ul>' +
                                '<form class="form-inline commentSubmit" role="form">' +
                                     '<div class="input-group">' +
                                        '<input type="text" class="form-control" disabled placeholder="我也说一句 ...">' +
                                    '</div>' +
                                '</form>' +
                            '</div>' +
                        '</div>',
            ele = $(template);

        ele.attr('id', pp.id);

        var owner_name = pp.owner.name,
            owner_key  = pp.owner.global_key,
            device = pp.device;

        //add the delete button if this comment is made by the current logged in user
        if(router.current_user){
            var global_key = router.current_user.global_key;
            if(global_key === owner_key){
                ele.find('.commentedAt').after('<a href="#" class="close pull-right" aria-label="Close"><span aria-hidden="true">&times;</span></a>');
            }
        }

        ele.find('.titleBox > .commenterImage > a').attr('href', '/friends/' + owner_key);
        ele.find('.titleBox > .commenterImage > a > img').attr('src', assetPath(pp.owner.avatar));
        ele.find('.titleBox > a.commenterName').attr('href', '/friends/' + owner_key);
        ele.find('.titleBox > a.commenterName').text(owner_name);
        ele.find('.titleBox > div.commentedAt').text(moment(pp.created_at).fromNow() + ' ' + pp.location);

        if(device !== ''){
            ele.find('.detailBox > div.commenterDetail').text("来自" + device);
        }

        if(pp.liked){
            ele.find('.detailBox > a.star').addClass('liked').find('.star-tip').text('赞了');
        }

        //create liked users
        var likeUsers   = pp.like_users || [],
            userList    = ele.find('.actionBox .like_users'),
            toLikeUsers = ele.find('.actionBox .toLikeUsers'),
            userEle;

        for (var i = 0; i < likeUsers.length; i++) {
            userEle = createLikedUsersDOM(likeUsers[i]);
            toLikeUsers.before(userEle);
        }

        setTimeout(function(){
            var totalWidth = userList.width();
            var subWidth = userList.children().eq(1).width();
            if( likeUsers.length * subWidth > (totalWidth - 22) ){
                userList.addClass('moreLikedUsers');

                while( userList.height() > 22 ){
                   toLikeUsers.prev().remove();
                }
            }
        },0);

        if( likeUsers.length ){
            toLikeUsers.attr('href', '/u/' + pp.owner.global_key + '/pp/' + pp.id + '/likeusers' ).text( pp.likes );
        }else{
            toLikeUsers.remove();
        }

        if( pp.likes>10 ){
            userList.addClass('moreLikedUsers');
        }

        var $element = $('<div>').html(pp.content),
            $images  = $element.find('a.bubble-markdown-image-link'),
            $topic = $element.find('a.topic');

        //change pp topic link to pc web
        $topic.length && $topic.attr('href', 'https://coding.net' + $topic.attr('href') );

        //if this pp contains images
        if($images.length !== 0){

            $images.removeAttr('target'); //prevent opening new tab when clicking on images

            var $copy = $images.clone(),
                $new_images  = $('<p></p>');
            $images.remove(); //remove the images in original content
            $element.find('br').remove(); //remove the </br>
            var images = $copy.map(function(index, ele){
               return ele.outerHTML;
            }).get().join("");
            $new_images.html(images);

            //if there is more than one image, we need to set the width of image to 1/3 of the containing block
            if($copy.length > 1){
                var height = $('#pp_list').width()/4;
                $new_images.addClass('thumbnail');
            }

            ele.find('.commentBox > .taskDescription').html($element.html());
            ele.find('.commentBox > .taskDescription > p:last').after($new_images)
        }else{
            ele.find('.commentBox > .taskDescription').html($element.html());
        }

        //change at-someone /u/xxx ->  /friends/xxx
        ele.find('.at-someone').each(function(){
            $(this).attr( 'href', $(this).attr('href').replace(/^\/u\//,'/friends/') );
        });

        var commentsList = ele.find('.actionBox > .commentList');

        fetchMoreComments(pp)
            .then(function(comments){
                var commentEle;
                comments = comments || [];
                for(var j = 0; j < comments.length; j++){
                    if(j>=5){
                        commentEle = createLookAllCommentDOM(pp);
                        commentsList.append(commentEle);
                        break;
                    }
                    commentEle = createCommentDOM(comments[j]);
                    commentsList.append(commentEle);
                }
            });

        //event listeners for this element
        ele.on('click', '.star', function(e){
            e.preventDefault();
            var id = pp.id,
                path = pp['liked'] ? '/api/tweet/' + id + '/unlike' : '/api/tweet/' + id + '/like';

            $.ajax({
                url: API_DOMAIN + path,
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    //success
                    if(data.code === 0){
                        pp['liked'] = !pp['liked'];
                        pp['liked'] ? pp['likes'] += 1 : pp['likes'] -= 1;
                        //if user like it, add current user to like_users, otherwise, remove current user from like_users
                        pp['like_users'] = pp['like_users'] || [];
                        if(pp['liked']){
                            pp['like_users'].push(router.current_user)
                        }else{
                            var index,obj;
                            for (var i = 0; i < pp['like_users'].length; i++) {
                                obj = pp['like_users'][i];
                                if(obj['global_key'] === router.current_user['global_key']){
                                    index = i;
                                    break
                                }
                            }
                            pp['like_users'].splice(index,1);
                        }
                        var newEle = createTweetDOM(pp);
                        ele.replaceWith(newEle);
                        elements[id] = pp;
                    }
                    if(data.msg){
                        for(var key in data.msg){
                            alert(data.msg[key]);
                        }
                    }
                },
                error: function(xhr, type){
                    alert('Failed to lik_unlike pp');
                }

            });
            return false;
        });

        //event listeners for deleting pp
        ele.on('click', '.close', function(e){
            e.preventDefault();

            var r = confirm("确认删除该泡泡？");
            if(r){
                var id   = pp.id,
                    path = '/api/tweet/' + id;

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
                            delete elements[id];
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

        return ele;
    }


    function createCommentDOM(comment){
        var template = '<li>' +
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
        ele.find('a.commenterName').attr('href', '/friends/' + owner_key);
        ele.find('a.commenterName > span').text(owner_name);
        ele.find('.commentText > p').html(comment.content);
        ele.find('.commentText > .date').text(moment(comment.created_at).fromNow());

        //change at-someone /u/xxx ->  /friends/xxx
        ele.find('.at-someone').each(function(){
            $(this).attr( 'href', $(this).attr('href').replace(/^\/u\//,'/friends/') );
        });
        //ele.find('.commentText > a').attr('id', comment.owner_id);

    

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
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.msg){
                            for(var key in data.msg){
                                alert(data.msg[key]);
                            }
                        }else{
                            elements[ppId]['comment_list'] = elements[ppId]['comment_list'] || [];
                            for(var i = elements[ppId]['comment_list'].length-1; i>=0; i--) {
                                if( elements[ppId]['comment_list'][i]['id'] === commentId) {
                                    elements[ppId]['comment_list'].splice(i,1);
                                    elements[ppId]['comments'] -= 1;
                                }
                            }
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

    function createLookAllCommentDOM(pp){
        var template = '<li class="toLookAll" >' +
                            '<a href="#">查看全部 <span></span> 条评论</a>' +
                        '</li>',
            ele  = $(template);

        var tweet_id = pp.id,
            owner_key = pp.owner.global_key,
            comment_count = pp.comments;

        var url = '/u/' + owner_key + '/pp/' + tweet_id;

        ele.find('span').text(comment_count);
        ele.find('a').attr('href', url);

        return ele;
    }

    function createLikedUsersDOM(user){
        var template = '<a style="padding: 0 3px 0" href="#">' +
                            '<img src="#" height="15" width="15" />' +
                        '</a>',
            ele = $(template);

        ele.attr('href', '/friends/' + user.global_key);
        ele.find('img').attr('src', assetPath(user.avatar));

        return ele;
    }

    function loadMore(path){

        var loadMoreBtn = $('#load_more');

        loadMoreBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');

        path += '?last_id=' + last_id;

        if(sort === 'friends'){
            var key = router.current_user ? router.current_user.global_key : '';
            path += '&' + 'global_key=' + key;
        }else{
            path += '&' + 'sort=' + sort
        }

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                if(data.data){
                    assembleDOM(data.data);
                    last_id = data.data[data.data.length - 1]['id']; //id of last item in list
                }
            },
            error: function(xhr, type){
                alert('Failed to load pp');
            },
            complete: function(){
                loadMoreBtn.text('更多泡泡');
            }
        });
    }

    function tweetFailed(){
        alert('Failed to post pp');
    }

    function tweetSuccess(data){
        if(data.msg){
            for(var key in data.msg){
                alert(data.msg[key]);
            }
        }else if(data.data){
            var tweet = data.data;
            tweet['owner'] = router.current_user;
            var ele   = createTweetDOM(tweet);
            $('#pp_content').val('');//clear the data in form
            $('#pp_input').modal('hide');//close the modal
            elements[tweet['id']] = tweet;
            list.insertBefore(ele[0], list.childNodes[0])
        }
    }

    function commentSuccess(data){
        if(data.msg){
            for(var key in data.msg){
                alert(data.msg[key]);
            }
        }
        if(data.data){
            var id = data.data.tweet_id;
            var commentsList = $('#'+id).find('.actionBox > .commentList');

            data.data['owner'] = router.current_user; //current user
            elements[id]['comment_list'] = elements[id]['comment_list'] || [];//elements 是全局变量
            elements[id]['comment_list'].unshift(data.data);
            elements[id]['comments'] += 1;

            var commentEle = createCommentDOM(data.data);
            commentsList.prepend(commentEle);//commentList 是局部变量
        }
    }

    function commentFailed(){
        alert('Failed to send comment');
    }

    function openInputModal(params){

        var $inputModal = $('#pp_input');

        var path = params.path,
            post_success = params.success || function(){},
            post_failed = params.failed || function(){};

        //配置弹窗基本信息
        $inputModal.find('#myModalLabel').html( params.title || '发冒泡' );

        $inputModal.removeClass('small').removeClass('large');
        $inputModal.addClass( params.size || 'large' );

        $('html').removeClass('pp-modaling-small').removeClass('pp-modaling-large');
        $('html').addClass( 'pp-modaling-' + (params.size || 'large') );

        $('#pp_content').val( params.precontent || '' );
        $('#pp_content').attr('placeholder', params.placeholder || '来，冒个泡吧...');

        //关键部分处理
        $('#pp_form').off('submit').on('submit', function(){

            var content = $('#pp_content').val().trim();
       
            //如果有图片，拽上图片咯
            var images = '';
            $('#image_board > .image').each(function(){
                var url = $(this).attr('url');
                if(url){
                    images += '\n![图片](' + url + ')\n';
                }
            });
            content += images;

            if(!content){
                return;
            }

            var data = {
                content: content,
                device: 'm.coding.net'
            };

            //确定地理位置
            var locationInfo = {};
            if( $('#pp_location').hasClass('success') ){
                locationInfo = $('#pp_location')[0].locationInfo;
                data['address'] = locationInfo['address'];
                data['location'] = locationInfo['location'];
                data['coord'] = locationInfo['coord'];
            }

            $inputModal.removeClass('failed').removeClass('success').addClass('sending');

            $.ajax({
                url: API_DOMAIN + path,
                type: 'POST',
                dataType: 'json',
                data: data,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    window.history.replaceState(null,null, window.location.pathname );
                    $inputModal.modal('hide');
                    window.postMessage('scrollToOpenning', '*');
                    $('html').removeClass('pp-modaling-small').removeClass('pp-modaling-large');
                    typeof post_success == 'function' && post_success(data);
                },
                error: function(){
                    typeof post_failed == 'function' && post_failed(data);
                },
                complete: function(){
                    $inputModal.removeClass('sending');
                }
            });

            return false;
        });

        // fucking html5 history api
        window.location.hash = "#pp_input"; //这里设置这个是为了增加空白历史记录，防止后面的 hash 直接返回到 /pp 引起的页面刷新
        window.postMessage('ppModelOpenning','*');
        $inputModal.modal('show');
    }

    function assetPath(path){
        if(path.substr(0,1) === '/'){
            path = API_DOMAIN + path;
        }
        return path;
    }       

    function reset(){
        elements = {};
        last_id = 99999999;
    }

    function fetchMoreComments(pp){
        var deferred = $.Deferred();

        if(pp['comments'] > 5){
            var comments_path = "/api/tweet/" + pp['id'] + "/comments?page=1&pageSize=500";
            $.ajax({
                url: API_DOMAIN + comments_path,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    if(data.data){
                        var comments = data.data.list;
                        pp['comment_list'] = comments;
                        deferred.resolve(comments);
                    }else{
                        deferred.resolve(pp['comment_list']);
                    }
                },
                error: function(){
                    deferred.resolve(pp['comment_list']);
                    alert("Failed to load more comments");
                }
            });
        }else{
            deferred.resolve(pp['comment_list'])
        }

        return deferred.promise();
    }

    return {
        template_url: '/views/pp.html',
        context: ".container",
        before_enter: function(type){

            //active this page link
            $('#navigator').find(".li-pp").addClass('active');
            $('#navigator').find(".li-pp img").attr('src','/images/icons/pp_active.png');

            var pp_nav =  '<div class="row project_header">' +
                                '<div class="col-xs-4">' +
                                    '<a href="#">最新</a>' +
                                '</div>' +
                                '<div class="col-xs-4">' +
                                    '<a href="#">热门</a>' +
                                '</div>' +
                                '<div class="col-xs-4">' +
                                     '<a href="#">朋友圈</a>' +
                                '</div>' +
                            '</div>',
                nav_ele = $(pp_nav);

            nav_ele.find('div').eq(0).children('a').attr('href', '/pp');
            nav_ele.find('div').eq(1).children('a').attr('href',  '/pp/hot');
            nav_ele.find('div').eq(2).children('a').attr('href',  '/pp/friends');

            $("nav.main-navbar").after(nav_ele);

            if(type === 'hot'){
                nav_ele.find('div').eq(1).addClass('active');
            }else if(type === 'friends'){
                nav_ele.find('div').eq(2).addClass('active');
            }else{
                nav_ele.find('div').eq(0).addClass('active');
            }

        },
        on_enter: function(type){

            list = document.getElementById('pp_list');

            //decide if this is hot page
            if(type === 'hot'){
                sort = 'hot';
            }else if(type === 'friends'){
                sort = 'friends';
            }else{
                sort = 'time';
            }

            var uri = ( sort === 'friends') ? '/api/activities/user_tweet' : '/api/tweet/public_tweets';

            loadMore(uri);

            $('#load_more').on('click', function(e){
                e.preventDefault();
                loadMore(uri);
            });

            //加载调用组件，加载完成广播事件
            $('[include]').each(function(){
                var walker = $(this);
                var msg = $(this).attr('loaded-msg') || '';
                var path = walker.attr('include');
                $.get(path,function(html){
                    msg && window.postMessage(msg,'*');
                    walker.replaceWith( html );
                });
            });

            $(window).on('message',function(event){
                event.data  == 'input-modal-ready' && inputModalLoaded();
            });

            function inputModalLoaded(){

                //插入模板所关联的代码
                $('<script>').attr('src', '/scripts/pp.modal.js').appendTo( $('body') );

                $('#pp_content').on('keyup', function(e){
                    e.preventDefault();
                    checkCouldSend();
                });

                $('#emoji_board').on('click', function(e){
                    checkCouldSend();
                });

                $(window).on('message',function(event){
                    event.data == 'checkModalCouldSend' && checkCouldSend();
                });

                function checkCouldSend(){
                    if( $('#pp_content').val() !== '' || ($('#image_board .upload-success').length)){
                        $('#pp_submit').removeAttr('disabled');
                    }else{
                        $('#pp_submit').attr('disabled', 'disabled');
                    }

                    //有图片正在上传，不能提交
                    if( $('#image_board .upload-ing').length ){
                        $('#pp_submit').attr('disabled', 'disabled');
                    }
                }

                $('#pp_add').on('click', function(e){
                    openInputModal({
                        path: '/api/tweet',
                        success: tweetSuccess,
                        failed: tweetFailed,
                        title: '发冒泡',
                        precontent: '',
                        placeholder: '来，冒个泡吧...',
                        size: 'large'
                    });
                    return false;
                });

                $('#pp_list').on('click', '.commentSubmit,.comment', function(){
                    var id = $(this).closest('.detailBox').attr('id');
                    openInputModal({
                        path: '/api/tweet/' + id + '/comment',
                        success: commentSuccess,
                        failed: commentFailed,
                        title: '评论冒泡',
                        precontent: '',
                        placeholder: '来，冒个泡吧...',
                        size: 'small'
                    });
                    return false;
                });

                $('#pp_list').on('click', '.reply', function(){
                    var id = $(this).closest('.detailBox').attr('id');
                    var owner_name = $(this).closest('.commentText').find('.comment-meta').html();
                    openInputModal({
                        path: '/api/tweet/' + id + '/comment',
                        success: commentSuccess,
                        failed: commentFailed,
                        title: '评论冒泡',
                        precontent: '@' + owner_name + ' ',
                        placeholder: '来，冒个泡吧...',
                        size: 'small'
                    });
                    return false;
                });
            }
        },
        on_exit: function(){
            
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-pp img").attr('src','/images/icons/pp.png');
            $('.project_header').remove();

            reset();
        }
    }

})();
