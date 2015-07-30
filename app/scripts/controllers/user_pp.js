/**
 * Created by annaqin on 20/07/2014.
 */
var USER_PP_ROUTE = (function() {

    var last_id = 99999999,
    sort = 'time',
    list = null,
    elements = {},
    pagecount = 0,
    pagesize = 10,
    userkey;

    function assembleDOM(data) {

        var pps = data || [],
        fragment = document.createDocumentFragment(),
        ele;

        for (var i = 0; i < pps.length; i++) {
            ele = createTweetDOM(pps[i]);
            fragment.appendChild(ele[0]);
            elements[pps[i]['id']] = pps[i];

        }

        list.appendChild(fragment);

    }

    function createTweetDOM(pp) {
        var template = '<div class="userpp border-color" id="detailBox">' + '<div class="titleBox" style="padding:12px 15px;">' + '<div class="commenterImage userppimg" style="width:36px;">' + '<a href="#"><img src="#" height="36" width="36" /></a>' + '</div>' + '<a class="commenterName" href="#" style="color:#222 !important;font-size:16px;bottom:10px;margin-left:8px;"></a>' + '<div class="commentedAt" style="left:64px;font-size:11px"></div>' + '</div>' + '<div class="commentBox" style="border:none;padding:10px 15px;">' + '<p class="taskDescription" style="font-size:16px;"></p>' + '</div>' +

        '<div class="commenterDetail pull-left userpp-comm"></div>' + '<div class="userpp_comment" style="border-bottom:1px solid #e5e5e5;margin:0 10px;padding:10px 0">' + '<a href="#" class="pull-right comment" style="font-size:14px;right:-5px;color: #999 !important;">' + '<span class="glyphicon pp-comment" ></span><font class="comm-fon pp-font">评论</font>' + '</a>' + '<a href="#" class="pull-right star" style="font-size:15px;color: #999 !important;">' + '<span class="glyphicon" id="pp-star"></span><font class="comm-fon">赞</font>' + '</a>' + '<br />' + '</div>' + '<div class="actionBox" style="background: #fff none repeat scroll 0 0;border:none;">' + '<div class="row" style="margin-bottom:10px;">' + '<div class="col-sm-12 like_users">' + '</div>' + '</div>' + '<ul class="commentList">' + '</ul>' + '<form class="form-inline commentSubmit" role="form">' + '<div class="input-group">' + '<input type="text" class="form-control" placeholder="在此输入评论内容">' + '<span class="input-group-btn">' + '<button class="btn btn-default" type="submit"><span class="glyphicon glyphicon-arrow-right"></span></button>' + '</span>' + '</div>' + '</form>' + '</div>' + '</div>',
        ele = $(template);

        ele.attr('id', pp.id);
        var owner_name = pp.owner.name,
        owner_key = pp.owner.global_key,
        device = pp.device;

        //add the delete button if this comment is made by the current logged in user
        if (router.current_user) {
            var global_key = router.current_user.global_key;
            if (global_key === owner_key) {
                ele.find('.commentedAt').after('<a href="#" class="close pull-right" aria-label="Close"><span aria-hidden="true">&times;</span></a>');
            }
        }
        var address = pp.address.replace(",", ".");
        ele.find('.titleBox > .commenterImage > a').attr('href', '/user/' + owner_key);
        ele.find('.titleBox > .commenterImage > a > img').attr('src', assetPath(pp.owner.avatar));
        ele.find('.titleBox > a.commenterName').attr('href', '/user/' + owner_key);
        ele.find('.titleBox > a.commenterName').text(owner_name);
        ele.find('.titleBox > div.commentedAt').html(moment(pp.created_at).fromNow() + '<font> ' + address + '</font>');
        ele.find('.pp-comment').append($("#pp-comment").html());
        ele.find('#pp-star').append($("#pp-like1").html());
        if (device != '') {
            ele.find('.commenterDetail').text("来自" + device);
        }

        //create liked users
        var likeUsers = pp.like_users || [],
        userList = ele.find('.actionBox .like_users'),
        userEle;

        for (var i = 0; i < likeUsers.length; i++) {
            userEle = createLikedUsersDOM(likeUsers[i]);
            userList.append(userEle);
        }

        var $element = $('<div>').html(pp.content),
        $images = $element.find('a.bubble-markdown-image-link');

        //if this pp contains images
        if ($images.length !== 0) {

            $images.removeAttr('target'); //prevent opening new tab when clicking on images
            var $copy = $images.clone(),
            $new_images = $('<p></p>');
            $images.remove(); //remove the images in original content
            $element.find('br').remove(); //remove the </br>
            var images = $copy.map(function(index, ele) {
                return ele.outerHTML;
            }).get().join("");
            $new_images.html(images);

            //if there is more than one image, we need to set the width of image to 1/3 of the containing block
            if ($copy.length > 1) {
                var height = $('#pp_list').width() / 4;
                $new_images.addClass('thumbnail');
                $new_images.css('box-shadow', 'none');
            }

            ele.find('.commentBox > .taskDescription').html($element.html());
            ele.find('.commentBox > .taskDescription > p:last').after($new_images)
        } else {
            ele.find('.commentBox > .taskDescription').html($element.html());
        }

        var commentsList = ele.find('.actionBox > .commentList');

        fetchMoreComments(pp).then(function(comments) {
            var commentEle;
            comments = comments || [];
            for (var j = 0; j < comments.length; j++) {
                commentEle = createCommentDOM(comments[j]);
                commentsList.append(commentEle);
            }
        });
        if (pp['liked']) {
            ele.find("#pp-star").html($("#pp-like2").html());
            ele.find(".star font").text("赞了");
        }
        //event listeners for this element
        ele.on('click', '.star',
        function(e) {
            e.preventDefault();
            var id = pp.id,
            path = pp['liked'] ? '/api/tweet/' + id + '/unlike': '/api/tweet/' + id + '/like';

            $.ajax({
                url: API_DOMAIN + path,
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {

                    //success
                    if (data.code === 0) {

                        pp['liked'] = !pp['liked'];
                        pp['liked'] ? pp['likes'] += 1 : pp['likes'] -= 1;
                        //if user like it, add current user to like_users, otherwise, remove current user from like_users
                        pp['like_users'] = pp['like_users'] || [];
                        if (pp['liked']) {

                            pp['like_users'].push(router.current_user);

                        } else {

                            var index, obj;
                            for (var i = 0; i < pp['like_users'].length; i++) {
                                obj = pp['like_users'][i];
                                if (obj['global_key'] === router.current_user['global_key']) {
                                    index = i;
                                    break
                                }
                            }
                            //ele.find(".star span").css("color","#999");
                            pp['like_users'].splice(index, 1);

                        }
                        var newEle = createTweetDOM(pp);
                        ele.replaceWith(newEle);
                        elements[id] = pp;
                    }
                    if (data.msg) {
                        for (var key in data.msg) {
                            alert(data.msg[key]);
                        }
                    }
                },
                error: function(xhr, type) {
                    alert('Failed to lik_unlike pp');
                }

            });
            return false;
        });

        //event listeners for deleting pp
        ele.on('click', '.close',
        function(e) {
            e.preventDefault();

            var r = confirm("确认删除该泡泡？");
            if (r) {
                var id = pp.id,
                path = '/api/tweet/' + id;

                $.ajax({
                    url: API_DOMAIN + path,
                    type: 'DELETE',
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        if (data.msg) {
                            for (var key in data.msg) {
                                alert(data.msg[key]);
                            }
                        } else {
                            delete elements[id];
                            ele.remove();
                        }
                    },
                    error: function() {
                        alert('Failed to delete comment');
                    }
                });
            }

            return false
        });

        ele.on('submit', '.commentSubmit',
        function(e) {
            e.preventDefault();

            var id = pp.id,
            input = $(this).find('input'),
            button = $(this).find('button'),
            path = '/api/tweet/' + id + '/comment';

            $.ajax({
                url: API_DOMAIN + path,
                type: 'POST',
                dataType: 'json',
                data: {
                    content: input.val()
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    if (data.msg) {
                        for (var key in data.msg) {
                            alert(data.msg[key]);
                        }
                    }
                    if (data.data) {
                        data.data['owner'] = router.current_user; //current user
                        elements[id]['comment_list'] = elements[id]['comment_list'] || [];
                        elements[id]['comment_list'].unshift(data.data);
                        elements[id]['comments'] += 1;

                        var commentEle = createCommentDOM(data.data);
                        commentsList.prepend(commentEle);
                        input.val('');
                    }
                },
                error: function() {
                    alert('Failed to send comment');
                },
                complete: function() {
                    input.removeAttr('disabled');
                    button.removeAttr('disabled');
                }
            });

            input.attr('disabled', 'disabled');
            button.attr('disabled', 'disabled');

            return false
        });

        return ele;
    }

    function createCommentDOM(comment) {
        var template = '<li style="background-color: rgb(244,244,244);">' +
        //'<div class="commenterImage">' +
        //     '<a href="#"><img src="#" /></a>' +
        //'</div>' +
        '<div class="commentText" style="font-size:16px;">' + '<p></p>' + '<a class="commenterName" href="#" style="font-size:12px;color: #aaa !important;"><span class="comment-meta"></span></a>' + '<span class="glyphicon glyphicon-time userpp-time" style="top:2px;"></span>' + '<span class="date sub-text"></span>' + '<a class="reply" href="#" class="comment-hash" style="font-size:12px;"> 回复 </a>' + '</div>' + '</li>',
        ele = $(template);

        var owner_name = comment.owner.name,
        owner_key = comment.owner.global_key;

        //add the delete button if this comment is made by the current logged in user
        if (router.current_user) {
            var global_key = router.current_user.global_key;
            if (global_key === owner_key) {
                ele.find('.reply').after('<a class="delete" href="#" class="comment-hash"> 删除 </a>');
            }
        }

        //ele.find('.commenterImage img').attr('src', assetPath(comment.owner.avatar));
        ele.find('a.commenterName').attr('href', '/user/' + owner_key);
        ele.find('a.commenterName > span').text(owner_name);
        ele.find('.commentText > p').html(comment.content);
        ele.find('.commentText > .date').text(moment(comment.created_at).fromNow());
        //ele.find('.commentText > a').attr('id', comment.owner_id);
        ele.on('click', '.reply',
        function(e) {
            e.preventDefault();
            var input = ele.parents('.commentList').next('form').find('input');
            if (input.val() === '') {
                input.val('@' + owner_name)
            } else {
                var value = input.val();
                input.val(value + ', @' + owner_name);
            }
            return false
        });

        ele.on('click', '.delete',
        function(e) {
            e.preventDefault();

            var r = confirm('确认删除该评论？');

            if (r) {
                var ppId = ele.parents('.detailBox').attr('id'),
                commentId = comment.id,
                path = '/api/tweet/' + ppId + '/comment/' + commentId;

                $.ajax({
                    url: API_DOMAIN + path,
                    type: 'DELETE',
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        if (data.msg) {
                            for (var key in data.msg) {
                                alert(data.msg[key]);
                            }
                        } else {
                            elements[ppId]['comment_list'] = elements[ppId]['comment_list'] || [];
                            for (var i = elements[ppId]['comment_list'].length - 1; i >= 0; i--) {
                                if (elements[ppId]['comment_list'][i]['id'] === commentId) {
                                    elements[ppId]['comment_list'].splice(i, 1);
                                    elements[ppId]['comments'] -= 1;
                                }
                            }
                            ele.remove();
                        }
                    },
                    error: function() {
                        alert('Failed to delete comment');
                    }
                });
            }

            return false
        });

        return ele
    }

    function createLikedUsersDOM(user) {
        var template = '<a class="pull-left" style="padding: 0 3px 0" href="#">' + '<img src="#" height="24" width="24" />' + '</a>',
        ele = $(template);

        ele.attr('href', '/u/' + user.global_key);
        ele.find('img').attr('src', assetPath(user.avatar));

        return ele;
    }

    function loadMore(path) {

        var loadMoreBtn = $('#load_more');

        loadMoreBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');
        path += '?last_id=' + last_id;
        if (sort === 'mine') {
            //var key = router.current_user ? router.current_user.global_key : '';
            path += '&' + 'global_key=' + userkey + '&type=my';
        } else {
            path += '&' + 'sort=' + sort
        }

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                if (data.data) {
                    assembleDOM(data.data);
                    last_id = data.data[data.data.length - 1]['id']; //id of last item in list
                }
            },
            error: function(xhr, type) {
                alert('Failed to load pp');
            },
            complete: function() {
                loadMoreBtn.text('更多泡泡');
            }
        });
    }

    function submitTweet(path, content) {
        var $button = $("#pp_submit");
        $button.attr('disabled', 'disabled');

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            type: 'POST',
            data: {
                'content': content,
                'device': 'm.coding.net'
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                if (data.msg) {
                    for (var key in data.msg) {
                        alert(data.msg[key]);
                    }
                } else if (data.data) {
                    var tweet = data.data;
                    tweet['owner'] = router.current_user;
                    var ele = createTweetDOM(tweet);
                    $('#pp_content').val(''); //clear the data in form
                    $('#pp_input').modal('hide'); //close the modal
                    elements[tweet['id']] = tweet;
                    list.insertBefore(ele[0], list.childNodes[0])
                }
            },
            error: function(xhr, type) {
                alert('Failed to post pp');
            },
            complete: function() {
                $button.removeAttr('disabled');
            }
        })
    }

    function assetPath(path) {
        if (path.substr(0, 1) === '/') {
            path = API_DOMAIN + path;
        }
        return path;
    }

    function reset() {
        elements = {};
        last_id = 99999999;
    }

    function fetchMoreComments(pp) {
        var deferred = $.Deferred();

        if (pp['comments'] > 5) {
            var comments_path = "/api/tweet/" + pp['id'] + "/comments?page=1&pageSize=500";
            $.ajax({
                url: API_DOMAIN + comments_path,
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    if (data.data) {
                        var comments = data.data.list;
                        pp['comment_list'] = comments;
                        deferred.resolve(comments);
                    } else {
                        deferred.resolve(pp['comment_list']);
                    }
                },
                error: function() {
                    deferred.resolve(pp['comment_list']);
                    alert("Failed to load more comments");
                }
            });
        } else {
            deferred.resolve(pp['comment_list'])
        }

        return deferred.promise();
    }

    return {
        template_url: '/views/user_pp.html',
        context: ".container",
        before_enter: function() {
            $(".main").css("background-color", "#e5e5e5 !important");
            $(".addfriend").attr("src", "");
        },
        on_enter: function(user) {

            list = document.getElementById('pp_list');

            //decide if this is hot page
            /***if(type === 'hot'){
                sort = 'hot';
            }else if(type === 'mine'){
                sort = 'mine';
            }else{
                sort = 'time';
            }****/

            // var uri = ( sort === 'mine') ? '/api/tweet/user_public' : '/api/tweet/public_tweets';
            if (user) {
                var uri = '/api/tweet/user_public';
                sort = 'mine';
                userkey = user;
            } else {
                var uri = '/api/tweet/public_tweets';
            }
            loadMore(uri);

            $('#load_more').on('click',
            function(e) {
                e.preventDefault();
                loadMore(uri);
            });

            $('#pp_content').on('keyup',
            function(e) {
                e.preventDefault();
                if ($(this).val() !== '') {
                    $('#pp_submit').removeAttr('disabled');
                } else {
                    $('#pp_submit').attr('disabled', 'disabled');
                }
            });

            $('#pp_submit').click(function(e) {
                e.preventDefault();
                var content = $('#pp_content').val();
                submitTweet('/api/tweet', content);
            });

            $('div.toggle-modal').click(function(e) {
                e.preventDefault();
                $('#pp_input').modal('toggle');
            });

        },
        on_exit: function() {

            $('#navigator').find('li').removeClass('active');
            $('.project_header').remove();
            $(".main").css("background-color", "#f6f6f6 !important");
            reset();
        }
    }

})();