/**
 * Created by annaqin on 21/07/2014.
 */
var USER_PROJECT_ROUTE = (function() {

    var pageSize = 10,
    pageCount = 0,
    list = null,
    pros = [],
    lastType = 'public',
    currentType = '';

    function assembleDOM(data) {
        var data = data || {};

        var projects = data.list,
        fragment = document.createDocumentFragment(),
        pro,
        ele;

        list = document.getElementById('projects_list');

        for (var i = 0; i < projects.length; i++) {
            pro = projects[i];
            ele = createTemplate(pro);

            fragment.appendChild(ele[0]);

            pros.push(pro);

        }

        list.appendChild(fragment);
    }

    function createTemplate(pro) {
        var template = '<a href="#" class="needsclick list-public-project" style="height: 90px">' + '<img class="pull-left project_icon public-img" src="#" width="64" height="68">' + '<span class="project_title"></span>' + '<span class="public_description"></span>' + '<span class="pull-icons">' + '<span class="glyphicon glyphicon-star star_count"></span>' + '<span class="glyphicon glyphicon-eye-open watch_count"></span>' + '<span class="glyphicon user-fork fork_count"></span>' + '</span>' + '<span class="right"></span>' +
        //'<img src="/images/icons/acaa9d8d.right_arrow.png" width="24"  class="pull-right public-right" />'+
        '</a>',
        ele = $(template);
        ele.attr('href', pro['project_path']);
        ele.find('img.project_icon').attr('src', assetPath(pro['icon']));
        ele.find('span.project_title').text(pro['name']);
        ele.find('span.public_description').text(pro['description']);
        ele.find('span.star_count').html('<font class="icons-set">' + pro['star_count'] + '</font>');
        ele.find('span.watch_count').html('<font class="icons-set">' + pro['watch_count'] + '</font>');
        ele.find('span.fork_count').html('<font class="icons-set icons-fork">' + pro['fork_count'] + '</font>');
        ele.find('.right').html($("#user-right").html());
        ele.find('.user-fork').prepend($("#user-fork").html());
        //ele.find('div.project_owner > img').attr('src', assetPath(pro['owner_user_picture']));
        //ele.find('div.project_owner > span').text(' 最后更新于' + moment(pro['updated_at']).fromNow());
        //ele.on('touchstart', function(e){
        //    $("#projects_list").find('a').removeClass('active');
        //    ele.addClass('active');
        //});
        return ele;
    }

    function loadMore(path) {

        pageCount++;
        var element = $("#load_more");
        element.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');
        path += '?page=' + pageCount + '&' + 'pageSize=' + pageSize;
        if (currentType === 'mine') {
            path += '&type=stared';
        } else {
            path += '&type=joined';
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
                }
            },
            error: function(xhr, type) {
                alert('Failed to load projects');
            },
            complete: function() {
                element.text('更多项目');
            }
        });

    }

    function showAll() {
        var fragment = document.createDocumentFragment(),
        list = document.getElementById('projects_list'),
        ele;
        for (var i = 0; i < pros.length; i++) {
            ele = createTemplate(pros[i]);
            fragment.appendChild(ele[0]);
        }
        list.appendChild(fragment)
    }

    function reset() {
        pros = [];
        pageCount = 0;
    }

    function assetPath(path) {
        if (path.substr(0, 1) === '/') {
            path = API_DOMAIN + path;
        }
        return path;
    }

    function truncateText(text, length) {
        return text.length < length ? text: text.substr(0, length) + '...';
    }

    return {
        template_url: '/views/user_projects.html',
        context: ".container",
        before_enter: function(data, type) {
            //active the project navbar item
            $('#navigator').find('li:first').addClass('active');
            $(".main").css("background-color", "#e5e5e5 !important");
            var project_nav = '<div class="row project_header">' + '<div class="col-xs-6">' + '<a href="/user/' + data + '/projects/public">我参与的</a>' + '</div>' + '<div class="col-xs-6">' + '<a href="/user/' + data + '/projects/mine" style="opacity: 1;">我收藏的</a>' + '</div>',
            nav_ele = $(project_nav);

            //nav_ele.find('div').eq(0).children('a').attr('href', '/user/' + data + '/projects/public');
            //nav_ele.find('div').eq(1).children('a').attr('href', '/user/' + data + '/projects/mine');
            $("nav.main-navbar").after(nav_ele);

            if (type === 'mine') {
                nav_ele.find('div').eq(1).addClass('active');
            } else {
                nav_ele.find('div').eq(0).addClass('active');
            }

        },
        on_enter: function(data, type) {

            currentType = type;
            //if the type has changed, clear all the contents
            if (currentType != lastType) {
                reset();
            }

            if (currentType === 'mine') {
                $('#projects_list > a.projects_title').text('我参与的');
            } else {
                $('#projects_list > a.projects_title').text('我收藏的');
            }

            if (!router.current_user && currentType === 'mine') {
                alert('You are not logged in');
                return;
            }
            // var uri = (currentType === 'public') ? '/api/public/all' : '/api/user/' + router.current_user['name'] + '/public_projects';
            //check if it has previous loaded element
            var uri = '/api/user/' + data + '/public_projects';
            //var uri='/api//user/'+data+'/projects/public';
            //var uri='/account/activities/projects_last';
            if (pros.length === 0) {
                loadMore(uri);
            }
            //otherwise just show the cached result
            else {
                showAll();
            }
            var element = $("#load_more");
            element.on('click',
            function(e) {
                e.preventDefault();
                loadMore(uri);
            });
        },
        on_exit: function() {
            $('#navigator').find('li').removeClass('active');
            $('.project_header').remove();
            lastType = currentType; //remember the type set last time;
            $(".main").css("background-color", "#f6f6f6 !important");
        }
    }

})();