/**
 * Created by annaqin on 21/07/2015.
 */
var FRIENDS_INFO_ROUTE = (function() {

    var userName, userData;

    function loadUser(user) {

        var uri = '/api/user/key/' + user;

        $.ajax({
            url: API_DOMAIN + uri,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                if (data.data) {
                    userData = data.data;
                    updateUser(userData);
                } else {
                    alert('Failed to load user' + user);
                    $('#user-heading').html('');
                }
            },
            error: function(xhr, type) {
                alert('Failed to load user' + user);
                $('#user-heading').html('');
            }
        });
    }

    function updateUser(data) {
        console.log(data);
        var user = data || {},
        heading = '<h4 class="panel-title">' + '<img src="#" height="25" width="25" />' + '<a class="panel-title" data-toggle="collapse" href="#accordion" data-target="#user-details" aria-expanded="true" aria-controls="user-details">' + '</a>' + '<span href="#" class="pull-right watched"></span>' + '<span href="#" class="pull-right followed"></span>' + '</h4>',
        body = '<div class="user-info">' + '<div class="info-img pull-left text-center"><img src="#"  width="57" height="57" class="img-bords"/></div>' + '<div class="info-det pull-left">' + '<h4 class="panel-font">' + '</h4>' + '<label></label>' + '</div>' + '<div class="info-right pull-right">' +
        //'<img src="#" width="72" height="32"  style="margin-right:10px;" id="watched"/>'+
        '</div>' + '</div>' +

        '<div class="user-det">' + '<span class="fans text-center"></span>' + '<span class="fllow text-center"></span>' + '</div>' + '<div class="user-dro">' + '<div class="user-project dro-pro myproject"><font color="#666" class="friends-info">所在地</font><label class="location" style="font-weight:200"></label></div>' + '<div class="user-pp dro-pro"><font color="#666" class="friends-info">个性标签</font><label class="tags_str" style="font-weight:200"></label></div>' + '</div>' + '<div class="user-dro">' + '<a href="/info/' + user.global_key + '" class="dro-pro myproject"><div class="user-project pull-left">详细信息</div>' +

        '<span class="pull-right dro-right1"></span>' +

        '</a>' + '<a href="/user/' + user.global_key + '/projects/public" class="dro-pro myproject"><div class="user-pp pull-left">Ta的项目</div>' + '<span class="pull-right dro-right2"></span>' +

        '</a>' + '<a href="/active/' + user.global_key + '" class="dro-pro"><div class="user-pp pull-left">Ta的冒泡</div>' + '<span class="pull-right  dro-right3"></span>' +

        '</a>' + '</div>',
        heading_ele = $(heading),
        body_ele = $(body);
        var locations = user.location.split(' ');
        body_ele.find('.img-bords').attr('src', assetPath(user.avatar));
        body_ele.find('.panel-font').text(truncateText(user.name, 6));
        body_ele.find('label').text(truncateText(user.slogan, 10));
        body_ele.find('.fans').html('<font class="user-bule"> ' + user.fans_count + '</font> 粉丝');
        body_ele.find('.fllow').html('<font class="user-bule"> ' + user.follows_count + '</font> 关注 ');
        body_ele.find('.location').text(locations[1]);
        body_ele.find('.tags_str').text(truncateText(user.tags_str, 11));
        if (typeof user.sex !== 'undefined' && user.sex !== '') {
            var man = $("#user-man").html();
            var woman = $("#user-woman").html();
            var sex = (user.sex === 0) ? man: (user.sex === 1) ? woman: '未知';
            body_ele.find('.panel-font').append(sex);
        }

        var right1 = $("#user-right1").html();
        body_ele.find('.dro-right1').html(right1);
        body_ele.find('.dro-right2').html(right1);
        body_ele.find('.dro-right3').html(right1);

        var fansconcerned = $("#fans-concerned").html();
        var fanseachconcerned = $("#fans-eachconcerned").html();
        var fanswatched = $("#fans-watched").html();

        if (user.followed == true && user.follow == false) { //已关注
            body_ele.find('.info-right').html(fansconcerned);
        } else if (user.followed == true && user.follow == true) { //互相关注
            body_ele.find('.info-right').html(fanseachconcerned);
        } else if (user.followed == false) { //关注
            body_ele.find('.info-right').html(fanswatched);
        }
        var follow_btn = body_ele.find('#watched');
        //if(user.followed){
        //    follow_btn.text('取消关注
        //}else{
        //    follow_btn.text('关注');
        //}
        //body_ele.find('.description').text(user.slogan);;
        body_ele.on('click', '#watched',function(e) {
            e.preventDefault();
            //follow_btn.attr('disabled','disabled');
            var path = user.followed ? '/api/social/unfollow': '/api/social/follow';
            $.ajax({
                url: API_DOMAIN + path,
                dataType: 'json',
                type: 'POST',
                data: {
                    users: user.global_key
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    if (data.code == 0) {
                        user.followed = !user.followed;
                        var fansconcerned1 = $("#fans-concerned").html();
                        var fanseachconcerned1 = $("#fans-eachconcerned").html();
                        var fanswatched1 = $("#fans-watched").html();

                        if (user.followed == true && user.follow == false) { //已关注
                            body_ele.find('.info-right').html(fansconcerned1);
                        } else if (user.followed == true && user.follow == true) { //互相关注
                            body_ele.find('.info-right').html(fanseachconcerned1);
                        } else if (user.followed == false) { //关注
                            body_ele.find('.info-right').html(fanswatched1);
                        }
                        //user.follow = !user.follow;
                    } else {
                        for (var key in data.msg) {
                            alert(data.msg[key]);
                        }
                    }
                },
                error: function(xhr, type) {
                    alert('error');

                },
            });

        });

        $('#user-details > .user-content').html(body_ele);
        //$('#user-heading').html(heading_ele);
    }

    function assetPath(path) {
        if (path.substr(0, 1) === '/') {
            path = API_DOMAIN + path;
        }
        return path;
    }
    function truncateText(text, length) {
        return text.length < length ? text: text.substr(0, length) + '';

    }
    return {
        template_url: '/views/user_item.html',
        context: '.container',
        before_enter: function(user) {

            var path = '/user/' + user;

            //if the user has logged in and he is viewing the current user, active the link on navigation bar
            $(".container").css("padding", "0");
            $(".container").css("width", "100%");
            $(".container").css("margin-top", "0");
            $(".main").css("background-color", "#e5e5e5");
        },
        on_enter: function(user) {
            loadUser(user);
        },
        on_exit: function(user) {
            $('#navigator').find('li').removeClass('active');
            $('.project_header').remove();
        }
    }
})();