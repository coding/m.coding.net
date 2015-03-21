/**
 * Created by simonykq on 20/03/2015.
 */
var USER_ROUTE = (function(){

    var userName,
        userData;

    function loadUser(user){

        var uri = '/api/user/key/' + user;

        $.ajax({
            url: API_DOMAIN + uri,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
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
                        //'<p>' +
                        //    '<button type="button" class="btn btn-primary follow"></button>' +
                        //    '<button type="button" class="btn btn-default message">给TA私信</button>' +
                        //'</p>' +
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
                                '<td style="width: 30%;">个性后缀</td>' +
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
        //
        //var follow_btn = body_ele.find('button.follow');
        //if(user.followed){
        //    follow_btn.text('取消关注');
        //}else{
        //    follow_btn.text('关注');
        //}
        body_ele.find('.description').text(user.slogan);
        body_ele.find('table .join td:eq(1)').text(moment(user.created_at).format("YYYY-MM-DD"));
        body_ele.find('table .activity td:eq(1)').text(moment(user.last_activity_at).format("YYYY年MMMD号 ah点mm分"));
        body_ele.find('table .sufix td:eq(1)').text(user.global_key);

        if(typeof user.sex !== 'undefined' && user.sex !== ''){
            var sex = (user.sex === 0) ? '男' : '女';
            body_ele.find('table tbody').append('<tr class="sex"><td>性别</td><td>'+ sex +'</td></tr>')
        }

        if(typeof user.job_str !== 'undefined' && user.job_str !== ''){
            body_ele.find('table tbody').append('<tr class="job"><td>工作</td><td>'+ user.job_str + '</td></tr>')
        }

        if(typeof user.location !== 'undefined' && user.location !== ''){
            body_ele.find('table tbody').append('<tr class="location"><td>地点</td><td>'+ user.location + '</td></tr>')
        }

        if(typeof user.tags_str !== 'undefined' && user.tags_str !== ''){
            var tags = user.tags_str.split(','),
                tags_ele = [];

            for (var i = 0; i < tags.length; i++) {
                var obj = tags[i],
                    ele = '<a href="/tags/search/' + obj + '">' + obj + '</a>';
                tags_ele.push(ele);
            }
            body_ele.find('table tbody').append('<tr class="tags"><td>标签</td><td>'+ tags_ele.join() + '</td></tr>')
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

        $('#user-details > .panel-body').html(body_ele);
        $('#user-heading').html(heading_ele);
    }

    function assetPath(path){
        if(path.substr(0,1) === '/'){
            path = API_DOMAIN + path;
        }
        return path;
    }


    return {
        template_url: '/views/user_item.html',
        context: '.container',
        before_enter: function(user){

            var path =  '/user/' + user;

            //add the project header and navigation bar
            var project_nav =  '<div class="row project_header">' +
                                    '<div class="col-xs-12">' +
                                        '<a href="#"></a>' +
                                    '</div>' +
                               '</div>',
                nav_ele     = $(project_nav);

            nav_ele.find('div').eq(0).children('a').attr('href', path);
            nav_ele.find('div').eq(0).children('a').text("个人中心");

            $("nav.main-navbar").after(nav_ele);
        },
        on_enter: function(user){

            userName = user;
            loadUser(user);

        },
        on_exit: function(user){

            $('.project_header').remove();
        }
    }
})();
