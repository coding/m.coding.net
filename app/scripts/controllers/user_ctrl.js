/**
 * Created by simonykq on 20/03/2015.
 */
var USER_ROUTE = (function() {

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
        var user = data || {},
        heading = '<h4 class="panel-title">' + '<img src="#" height="25" width="25" />' + '<a class="panel-title" data-toggle="collapse" href="#accordion" data-target="#user-details" aria-expanded="true" aria-controls="user-details">' + '</a>' + '<span href="#" class="pull-right watched"></span>' + '<span href="#" class="pull-right followed"></span>' + '</h4>',
        body = '<a href="/info/' + user.global_key + '"><div class="user-info">' + '<div class="info-img pull-left text-center"><img src="#"  width="57" height="57" class="img-bords"/></div>' + '<div class="info-det pull-left">' + '<h4 class="panel-font">' + '</h4>' + '<label></label>' + '</div>' + '<div class="info-right pull-right">' +

        '</div>' + '<div style="clear:both;"></div>' + '</div></a>' +

        '<div class="user-det">' + '<a href="/social/' + user.global_key + '/followers"><span class="fans text-center"></span></a>' + '<a href="/social/' + user.global_key + '/friends"><span class="fllow text-center"></span></a>' + '</div>' + '<div class="user-dro">' + '<a href="/user/' + user.global_key + '/projects/public" class="dro-pro myproject"><div class="user-project pull-left">我的项目</div>' +

        '<span class="pull-right dro-right1"></span>' +

        '</a>' + '<a href="/active/' + user.global_key + '" class="user-mypp"><div class="user-pp pull-left">我的冒泡</div>' + '<span class="pull-right dro-right2"></span>' +

        '</a>' + '</div>',
        heading_ele = $(heading),
        body_ele = $(body);

        body_ele.find('.img-bords').attr('src', assetPath(user.avatar));
        body_ele.find('.panel-font').text(truncateText(user.name, 7));
        body_ele.find('label').text(truncateText(user.slogan, 10));

        body_ele.find('.fans').html('<font class="user-bule"> ' + user.fans_count + '</font> 粉丝');
        body_ele.find('.fllow').html('<font class="user-bule"> ' + user.follows_count + '</font> 关注 ');
        var right = $("#user-right").html();
        body_ele.find('.info-right').html(right);
        var right1 = $("#user-right1").html();
        body_ele.find('.dro-right1').html(right1);
        body_ele.find('.dro-right2').html(right1);

        body_ele.find('table .join td:eq(1)').text(moment(user.created_at).format("YYYY-MM-DD"));
        body_ele.find('table .activity td:eq(1)').text(moment(user.last_activity_at).format("YYYY年MMMD号 ah点mm分"));
        body_ele.find('table .sufix td:eq(1)').text(user.global_key);

        var slogan = (typeof user.slogan === 'undefined' || user.slogan === '') ? '座右铭未填写': user.slogan;
        body_ele.find('label').text(truncateText(slogan, 9));
        if (typeof user.sex !== 'undefined' && user.sex !== '') {
            var man = $("#user-man").html();
            var woman = $("#user-woman").html();
            var sex = (user.sex === 0) ? man: (user.sex === 1) ? woman: '未知';
            body_ele.find('.panel-font').append(sex)
        }

        if (typeof user.job_str !== 'undefined' && user.job_str !== '') {
            body_ele.find('table tbody').append('<tr class="job"><td>工作</td><td>' + user.job_str + '</td></tr>')
        }

        if (typeof user.location !== 'undefined' && user.location !== '') {
            body_ele.find('table tbody').append('<tr class="location"><td>地点</td><td>' + user.location + '</td></tr>')
        }

        if (typeof user.tags_str !== 'undefined' && user.tags_str !== '') {
            var tags = user.tags_str.split(','),
            tags_ele = [];

            for (var i = 0; i < tags.length; i++) {
                var obj = tags[i],
                ele = '<span>' + obj + '</span>';
                tags_ele.push(ele);
            }
            body_ele.find('table tbody').append('<tr class="tags"><td>标签</td><td>' + tags_ele.join() + '</td></tr>')
        }

        //body_ele.on('click', 'button.follow', function(e){
        //    e.preventDefault();
        //    follow_btn.attr('disabled','disabled');
        //    var path = user.followed ? '/api/user/unfollow' : '/api/user/follow';
        //    $.post(API_DOMAIN + path + '?users=' + user.global_key, function(data){
        //        //fail
        //        if(data.msg){
        //            for(var key in data.msg){
        //                alert(data.msg[key]);
        //            }
        //        }//success
        //        else{
        //            user.followed = !user.followed;
        //            if(user.followed){
        //                user.follows_count = user.follows_count + 1;
        //            }else{
        //                user.follows_count = user.follows_count - 1;
        //            }
        //            updateUser(user);
        //        }
        //        follow_btn.removeAttr('disabled');
        //    })
        //});
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
            $(".main").css("background-color", "#e5e5e5 !important");

        },
        on_enter: function(user) {
            var src = $(".navbar-header-coding").find(".adds").attr("src");
            if (src == undefined) {
                $(".navbar-header").append($(".addfriend").html());
            }
            if (router.current_user) {
                if (user === router.current_user['global_key']) {
                    $('#navigator').find('.li-login').addClass('active');
                    var template;
                    loadUser(user);
                    var mylogout = '<button  class="user-logout" id="mylogout">退出登录</button>';
                    template = $(mylogout);
                    $('#user-details > .user-mylogout').html(template);
                }
            }
            $('#mylogout').click(function(e) {
                e.preventDefault();
                $.ajax({
                    url: API_DOMAIN + '/api/logout',
                    type: 'POST',
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data, status, xhr) {
                        //if login success
                        if (data.code === 0) {
                            window.location = '/';
                        }
                        if (data.msg) {
                            alert('Failed to logout');
                        }
                    },
                    error: function() {
                        alert('Failed to login');
                    }
                });
            });
        },
        on_exit: function(user) {
            $('#navigator').find('li').removeClass('active');
            $('.project_header').remove();
            $(".adds").remove();
            $(".main").css("background-color", "#f6f6f6 !important");
        }
    }
})();