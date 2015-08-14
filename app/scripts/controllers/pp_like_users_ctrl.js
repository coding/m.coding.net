/**
 * Created by simonykq on 21/12/2014.
 */
var PP_LIKE_USERS_ROUTE  = (function(){
    var list,
        page = 1,
        pageSize = 10;

    function assembleDOM(data){
        var users     = data || [];
        var fragment  = document.createDocumentFragment();
        var ele;

        users.reverse();
        for (var i = 0; i < users.length; i++) {
            ele = createUserDOM(users[i]);
            fragment.appendChild(ele[0]);
        }

        list.appendChild(fragment);
    }

    function createUserDOM(user){
        var template = '<li>' +
                            '<a>' + 
                                '<img class="avatar">' +
                                '<span class="name"></span>' +
                                '<span class="relation">关注</span>' +
                            '</a>'
                        '</li>';
        var ele  = $(template);

        user.avatar = user.avatar.replace(/(?=^\/)/,'https://coding.net');
        ele.find('a').attr('href', '/friends/' + user.global_key);
        ele.find('.name').text(user.name);
        ele.find('.avatar').attr('src', user.avatar);

        var current_user_key = router.current_user && router.current_user['global_key'];

        if( user['global_key'] == current_user_key ){
            ele.find('.relation').addClass('myself');
        }else{
            if(user.follow){
                ele.find('.relation').addClass('follow');
            }
            setFollowedState();
        }
        

        function setFollowedState(){
            if(user.followed){
                ele.find('.relation').addClass('followed').text('已关注');
            }else{
                ele.find('.relation').removeClass('followed').text('关注');
            }
        }

        ele.on('click','.relation:not(.myself)',function(e){
            e.preventDefault();

            // var users = $(this).attr('global_key');
            var users = user.global_key;
                path = '/api/social/unfollow';

            if(user.followed){
                path = '/api/social/unfollow';

                $.ajax({
                    url: API_DOMAIN + path,
                    type: 'POST',
                    data: {
                        users: users
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.code==0){
                            user.followed = false;
                            setFollowedState();
                        }else{
                            alert('Failed to unfollow');
                        }
                    },
                    error: function(){
                        alert('Failed to unfollow');
                    }
                });
            }else{
                path = '/api/social/follow';

                $.ajax({
                    url: API_DOMAIN + path,
                    type: 'POST',
                    data: {
                        users: users
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if(data.code==0){
                            user.followed = true;
                            setFollowedState();
                        }else{
                            alert('Failed to follow');
                        }
                    },
                    error: function(){
                        alert('Failed to follow');
                    }
                });
            }

            return false;
        });

        return ele;
    }

    function loadMore(path){

        var loadMoreBtn = $('#load_more');

        loadMoreBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');

        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            type: 'GET',
            data: {
                page: page ++,
                pageSize: pageSize
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                if(data.data && data.data.list){
                    assembleDOM(data.data.list);

                    if(data.data.totalPage <= page){
                        loadMoreBtn.remove();
                    }else{
                        loadMoreBtn.text('加载更多');
                    }
                }
            },
            error: function(xhr, type){
                alert('Failed to load like users');
            }
        });
    }

    function reset(){
        page = 1;
    }

    return {
        template_url: '/views/pp_like_users.html',
        context: ".container",
        before_enter: function(user, tweet_id){

            //active this page link
            $('#navigator').find(".li-pp").addClass('active');
            $('#navigator').find(".li-pp img").attr('src','/images/icons/pp_active.png');
        },
        on_enter: function(user, tweet_id){

            list = document.getElementById('friends_list');

            var uri = '/api/social/tweet/' + tweet_id + '/likes';

            loadMore(uri);

            $('#load_more').on('click', function(e){
                e.preventDefault();
                loadMore(uri);
            });
        },
        on_exit: function(){
            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-pp img").attr('src','/images/icons/pp.png');
            $('.project_header').remove();

            reset();
        }
    }
})();