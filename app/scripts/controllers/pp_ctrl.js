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
            owner_key  = pp.owner.global_key,
            device = pp.device;

        //add the delete button if this comment is made by the current logged in user
        if(router.current_user){
            var global_key = router.current_user.global_key;
            if(global_key === owner_key){
                ele.find('.commentedAt').after('<a href="#" class="close pull-right" aria-label="Close"><span aria-hidden="true">&times;</span></a>');
            }
        }

        ele.find('.titleBox > .commenterImage > a').attr('href', '/user/' + owner_key);
        ele.find('.titleBox > .commenterImage > a > img').attr('src', assetPath(pp.owner.avatar));
        ele.find('.titleBox > a.commenterName').attr('href', '/user/' + owner_key);
        ele.find('.titleBox > a.commenterName').text(owner_name);
        ele.find('.titleBox > div.commentedAt').text(moment(pp.created_at).fromNow());

        if(device !== ''){
            ele.find('.detailBox > div.commenterDetail').text("来自" + device);
        }

        if(pp.liked){
            ele.find('.detailBox > a.star > span').css('color','#D95C5C');
        }

        //create liked users
        var likeUsers   = pp.like_users || [],
            userList    = ele.find('.actionBox .like_users'),
            userEle;

        for (var i = 0; i < likeUsers.length; i++) {
            userEle = createLikedUsersDOM(likeUsers[i]);
            userList.append(userEle);
        }

        var $element = $(pp.content),
            $images  = $element.find('a.bubble-markdown-image-link');

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

            ele.find('.commentBox > .taskDescription').html($element);
            ele.find('.commentBox > .taskDescription > p:last').after($new_images)
        }else{
            ele.find('.commentBox > .taskDescription').html($element);
        }


        //create tweet comments
        var comments     = pp.comment_list || [],
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

            $.ajax({
                url: API_DOMAIN + path,
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    console.log('stared');
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
                        console.log(pp);
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

        ele.on('submit', '.commentSubmit', function(e){
            e.preventDefault();

            var id    = pp.id,
                input = $(this).find('input'),
                button= $(this).find('button'),
                path  = '/api/tweet/' + id + '/comment';

            $.ajax({
                url: API_DOMAIN + path,
                type: 'POST',
                dataType: 'json',
                data: {content: input.val()},
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
                        data.data['owner'] = router.current_user; //current user
                        elements[id]['comment_list'] = elements[id]['comment_list'] || [];
                        elements[id]['comment_list'].unshift(data.data);
                        var commentEle = createCommentDOM(data.data);
                        commentsList.prepend(commentEle);
                        input.val('');
                    }
                },
                error: function(){
                    alert('Failed to send comment');
                },
                complete: function(){
                    input.removeAttr('disabled');
                    button.removeAttr('disabled');
                }
            });

            input.attr('disabled','disabled');
            button.attr('disabled','disabled');

            return false
        });


        return ele;
    }

    function createCommentDOM(comment){
        var template = '<li>' +
                            '<div class="commenterImage">' +
                                 '<a href="#"><img src="#" /></a>' +
                            '</div>' +
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

        ele.find('.commenterImage img').attr('src', assetPath(comment.owner.avatar));
        ele.find('a.commenterName').attr('href', '/user/' + owner_key);
        ele.find('a.commenterName > span').text(owner_name);
        ele.find('.commentText > p').html(comment.content);
        ele.find('.commentText > .date').text(moment(comment.created_at).fromNow());
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
                                if( elements[ppId]['comment_list'][i]['id'] === commentId) elements[ppId]['comment_list'].splice(i,1);
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

    function createLikedUsersDOM(user){
        var template = '<a class="pull-left" style="padding: 0 3px 0" href="#">' +
                            '<img src="#" height="15" width="15" />' +
                        '</a>',
            ele = $(template);

        ele.attr('href', '/u/' + user.global_key);
        ele.find('img').attr('src', assetPath(user.avatar));

        return ele;
    }

    function loadMore(path){

        var loadMoreBtn = $('#load_more');

        loadMoreBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');

        path += '?last_id=' + last_id;

        if(sort === 'mine'){
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

    function submitTweet(path, content){
        var $button = $("#pp_submit");
        $button.attr('disabled','disabled');

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            type: 'POST',
            data: {'content': content},
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
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
            },
            error: function(xhr, type){
                alert('Failed to post pp');
            },
            complete: function(){
                $button.removeAttr('disabled');
            }
        })
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

    return {
        template_url: '/views/pp.html',
        context: ".container",
        before_enter: function(type){

            //active this page link
            $('#navigator').find("li:eq(1)").addClass('active');

            var pp_nav =  '<div class="row project_header">' +
                                '<div class="col-xs-4">' +
                                    '<a href="#">最新</a>' +
                                '</div>' +
                                '<div class="col-xs-4">' +
                                    '<a href="#">热门</a>' +
                                '</div>' +
                                '<div class="col-xs-4">' +
                                     '<a href="#">我的</a>' +
                                '</div>' +
                            '</div>',
                nav_ele = $(pp_nav);

            nav_ele.find('div').eq(0).children('a').attr('href', '/pp');
            nav_ele.find('div').eq(1).children('a').attr('href',  '/pp/hot');
            nav_ele.find('div').eq(2).children('a').attr('href',  '/pp/mine');

            $("nav.main-navbar").after(nav_ele);

            if(type === 'hot'){
                nav_ele.find('div').eq(1).addClass('active');
            }else if(type === 'mine'){
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
            }else if(type === 'mine'){
                sort = 'mine';
            }else{
                sort = 'time';
            }

            var uri = ( sort === 'mine') ? '/api/tweet/user_public' : '/api/tweet/public_tweets';

            loadMore(uri);

            $('#load_more').on('click', function(e){
                e.preventDefault();
                loadMore(uri);
            });

            $('#pp_content').on('keyup', function(e){
                e.preventDefault();
                if($(this).val() !== ''){
                    $('#pp_submit').removeAttr('disabled');
                }else{
                    $('#pp_submit').attr('disabled', 'disabled');
                }
            });

            $('#pp_submit').click(function(e){
                e.preventDefault();
                var content = $('#pp_content').val();
                submitTweet('/api/tweet', content);
            });

        },
        on_exit: function(){

            $('#navigator').find('li').removeClass('active');
            $('.project_header').remove();

            reset();
        }
    }

})();
