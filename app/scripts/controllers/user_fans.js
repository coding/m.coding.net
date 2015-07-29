/**
 * Created by annaqin on 20/07/2015.
 */
var USER_FANS_ROUTE = (function() {

    var fansName, fansData, url, pageSize = 10,
    pageCount = 0,
    list = null,
    pros = [],
    lastType = 'public',
    currentType = '';

    function assembleDOM(data) {
        var data = data || {};
        var fans = data,
        fragment = document.createDocumentFragment(),
        pro,
        ele;
        list = document.getElementById('fans_list');
        for (var i = 0; i < fans.length; i++) {
            pro = fans[i];
            ele = updateFans(pro);
            fragment.appendChild(ele[0]);
            pros.push(pro);
        }
        list.appendChild(fragment);
    }
    function loadFans(path) {
        pageCount++;
        //var uri = '/api/social/followers';
        path += '?page=' + pageCount + '&' + 'pageSize=' + pageSize;
        var fanslist;
        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                if (data.data) {
                    fanslist = data.data;
                    fansData = fanslist.list;
                    if (fanslist.totalPage == pageCount) {
                        $("#load_more").remove();
                    }
                    assembleDOM(fansData);

                } else {
                    alert('Failed to load fans');

                }
            },
            error: function(xhr, type) {
                alert('Failed to load fans');
            },
        });
    }
    function search(path, key) {
        $("#fans_list").html("");
        var searchlist;
        $.ajax({
            url: API_DOMAIN + path,
            dataType: 'json',
            type: 'get',
            data: {
                key: key
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                if (data.data) {
                    searchlist = data.data ;
                    assembleDOM(searchlist);
                } else {
                    alert('Failed to load fans');
                }
            },
            error: function(xhr, type) {
                alert('Failed to load fans');

            },
        });
    }

    function updateFans(data) {
        var fans = data || {},
        template = '<tr>' + '<td class="fans_watch" width="70" height="68"><a href="/friends/' + fans.global_key + '"><img src="#" class="avatar fans_avatar" width="50" height="50"></a></ td>' + '<td class="name fans_name"></td>' + '<td class="fans_img" width="72" ></td>' + '</tr>',

        body_ele = $(template);
        body_ele.find('.avatar').attr('src', fans.avatar);
        body_ele.find('.name').html('<a href="/friends/' + fans.global_key + '" style="color:#222 !important;">' + fans.name + '</a>');
        var fansconcerned = $("#fans-concerned").html();
        var fanseachconcerned = $("#fans-eachconcerned").html();
        var fanswatched = $("#fans-watched").html();
        if (fans.followed == true && fans.follow == false) { //已关注
            body_ele.find('.fans_img').html(fansconcerned);
        } else if (fans.followed == true && fans.follow == true) { //互相关注
            body_ele.find('.fans_img').html(fanseachconcerned);
        } else if (fans.followed == false) { //关注
            body_ele.find('.fans_img').html(fanswatched);
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
            var path = fans.followed ? '/api/social/unfollow': '/api/social/follow';
            $.ajax({
                url: API_DOMAIN + path,
                dataType: 'json',
                type: 'POST',
                data: {
                    users: fans.global_key
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    if (data.code == 0) {
                        fans.followed = !fans.followed;
                        var fansconcerned1 = $("#fans-concerned").html();
                        var fanseachconcerned1 = $("#fans-eachconcerned").html();
                        var fanswatched1 = $("#fans-watched").html();

                        if (fans.followed == true && fans.follow == false) { //已关注
                            body_ele.find('.fans_img').html(fansconcerned1);
                        } else if (fans.followed == true && fans.follow == true) { //互相关注
                            body_ele.find('.fans_img').html(fanseachconcerned1);
                        } else if (fans.followed == false) { //关注
                            body_ele.find('.fans_img').html(fanswatched1);
                        }
                        //fans.follow = !fans.follow;
                        updateFans(fans);
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
        return body_ele;
    }

    function assetPath(path) {
        if (path.substr(0, 1) === '/') {
            path = API_DOMAIN + path;
        }
        return path;
    }

    return {
        template_url: '/views/user_fans.html',
        context: '.container',
        before_enter: function(type) {
            $(".container").css("padding", "0");
            $(".container").css("width", "100%");
            $(".container").css("margin-top", "0");
            $(".main").css("background-color", "#e5e5e5");

        },
        on_enter: function(type) {
            if (type == 'followers' || type == 'friends') {
                var src = $(".navbar-header-coding").find(".adds").attr("src");
                if (src == undefined) {
                    $(".navbar-header").append($(".addfriend").html());
                }
            }
            $(".user-back").css("padding-top", "60px");
            var head = '<div class="header-search">' + '<input type="text" name="search" id="search" placeholder="姓名/个性后缀"/>' + '<span class="searchicon"></span>' + '</div>';
            $("#user-heading").html(head);
            /***$("#search").click(function(){
         	  $(".searchicon").css("left","7%"); 
         	   $("#search").css("text-align","left");
         	   $("#search").css("padding-left","8%");
            });****/
            $("#search").bind("keypress",
            function(event) {
                if (event.keyCode == '13') { // 回车按键的代码 	
                    var key = $("#search").val();
                    url = '/api/user/search';
                    $(".more-fans").css("display", "none");
                    search(url, key);

                }
            });
            if (type == 'followers') {
                $(".more-fans").css("display", "block");
                pageCount = 0,
                url = '/api/social/followers';
                loadFans(url);
            }
            if (type == 'friends') {
                $(".more-fans").css("display", "block");
                pageCount = 0,
                url = '/api/social/friends';
                loadFans(url);
            }
            if (type == 'addfriend') {
                $(".more-fans").css("display", "none");
            }
            var element = $("#load_more");
            element.on('click',
            function(e) {
                e.preventDefault();
                loadFans(url);
            });

        },
        on_exit: function(user) {
            $('#navigator').find('li').removeClass('active');
            $('.project_header').remove();
            $(".adds").remove();
        }
    }
})();