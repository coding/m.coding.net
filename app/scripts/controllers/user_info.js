/**
 * Created by annaqin on 20/07/2015.
 */
var USER_INFO_ROUTE = (function() {

    var userName, userData;
    function loadUserinfo(user) {

        var url = '/api/user/key/' + user;
        $.ajax({
            url: API_DOMAIN + url,
            dataType: 'json',
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                if (data.data) {
                    userData = data.data;
                    console.log(userData);
                    updateUser(userData);
                } else {
                    alert('Failed to load user' + user);
                    $('#accordion').html('');
                }
            },
            error: function(xhr, type) {
                alert('Failed to load user' + user);
                $('#accordion').html('');
            }
        });
    }

    function updateUser(data) {
        var user = data || {},
        body = '<div style="background-color:#fff;padding-left:15px;" class="border-color">' + '<table class="userinfotable">' + '<tr class="avatar">' +

        '<td width="85"> 头像</td>' + '<td><img src="＃" width="60" height="60" class="avatarimg"/></td>' + '</tr>' + '<tr class="name">' +

        '<td> 昵称</td>' + '<td></td>' + '</tr>' + '<tr class="sex">' +

        '<td> 性别</td>' + '<td></td>' + '</tr>' + '<tr class="brithday">' +

        '<td> 生日</td>' + '<td></td>' + '</tr>' + '<tr class="location">' +

        '<td> 所在地</td>' + '<td></td>' + '</tr>' + '<tr class="motto">' +

        '<td> 座右铭</td>' + '<td></td>' + '</tr>' + '</table>' + '</div>' + '<div style="background-color:#fff;padding-left:15px" class="border-color tablecom">' + '<table class="userinfotable ">' + '<tr class="company">' +

        '<td width="85">公司</td>' + '<td></td>' + '</tr>' + '<tr class="job">' +

        '<td>职位</td>' + '<td></td>' + '</tr>' + '</table>' + '</div>',

        body_ele = $(body);
        body_ele.find('img').attr('src', assetPath(user.avatar));
        body_ele.find('.name td:eq(1)').text(user.name);

        if (typeof user.sex !== 'undefined' && user.sex !== '') {
            var sex = (user.sex === 0) ? '男': (user.sex === 1) ? '女': '未知';
            body_ele.find('.sex td:eq(1)').text(sex);
        }

        var brithday = (typeof user.brithday === 'undefined' || user.brithday === '') ? '未填写': user.brithday;
        body_ele.find('.brithday td:eq(1)').text(brithday);

        var location = (typeof user.location === 'undefined' || user.location === '') ? '未填写': user.location;
        body_ele.find('.location td:eq(1)').text(location);

        var slogan = (typeof user.slogan === 'undefined' || user.slogan === '') ? '未填写': user.slogan;
        body_ele.find('.motto td:eq(1)').text(slogan);

        var company = (typeof user.company === 'undefined' || user.company === '') ? '未填写': user.company;
        body_ele.find('.company td:eq(1)').text(company);

        var jobs = ['未填写', '开发', '产品', '设计', '运维', '运营', '打杂', '测试', '市场'];
        var job = (typeof user.job === 'undefined' || user.job === '') ? '未填写': user.job;
        var job = jobs[user.job];
        body_ele.find('.job td:eq(1)').text(job);
        $('#user-details > .user-content').html(body_ele);
    }

    function assetPath(path) {
        if (path.substr(0, 1) === '/') {
            path = API_DOMAIN + path;
        }
        return path;
    }

    return {
        template_url: '/views/user_info.html',
        context: '.container',
        before_enter: function(user) {
            //if the user has logged in and he is viewing the current user, active the link on navigation bar
            if (router.current_user) {
                if (user === router.current_user['global_key']) {
                    $('#navigator').find('.li-login').addClass('active');
                }
            }
            $(".main").css("background-color", "#e5e5e5 !important");
        },
        on_enter: function(user) {
            userName = user;
            loadUserinfo(user);
        },
        on_exit: function(user) {
            $('#navigator').find('li').removeClass('active');
            $('.project_header').remove();
            $(".main").css("background-color", "#f6f6f6 !important");
        }
    }
})();