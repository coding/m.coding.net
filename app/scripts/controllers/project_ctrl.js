var PROJECT_ROUTE = (function(){

    var HOST_URL  =  window.HOST_URL || "",
        pageSize  = 10,
        pageCount = 0,
        list      = null,
        elements  = [];

    function assembleDOM(data){
        var data = data || {"code":0,"data":{"list":[{"backend_project_path":"/user/demo/project/node-2048","created_at":1403062201000,"current_user_role_id":0,"depot_path":"/u/demo/p/node-2048/git","description":"NodeJS + 2048 + MySQL","fork_count":249,"forked":false,"git_url":"git://coding.net/demo/node-2048.git","groupId":0,"https_url":"https://coding.net/demo/node-2048.git","icon":"/static/project_icon/scenery-20.png","id":124,"is_public":true,"last_updated":1417075124000,"max_member":10,"name":"node-2048","owner_id":26,"owner_user_home":"<a href=\"https://coding.net/u/demo\">demo</a>","owner_user_name":"demo","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/eb160ca8-9bb9-4df1-a577-c712e45b2882.jpg?imageMogr2/auto-orient/format/jpeg/crop/!323x323a8a0","pin":false,"project_path":"/u/demo/p/node-2048","recommended":3,"ssh_url":"git@coding.net:demo/node-2048.git","star_count":87,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1403062370000,"watch_count":123,"watched":false},{"backend_project_path":"/user/larus/project/CourseMgr","created_at":1418050577000,"current_user_role_id":0,"depot_path":"/u/larus/p/CourseMgr/git","description":"课程管理系统","fork_count":3,"forked":false,"git_url":"git://coding.net/larus/CourseMgr.git","groupId":0,"https_url":"https://coding.net/larus/CourseMgr.git","icon":"/static/project_icon/scenery-16.png","id":37457,"is_public":true,"last_updated":1418783957000,"max_member":10,"name":"CourseMgr","owner_id":36572,"owner_user_home":"<a href=\"https://coding.net/u/larus\">larus</a>","owner_user_name":"larus","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/f91b67ba68c5aba1436adf1cc3500c2b.png","pin":false,"project_path":"/u/larus/p/CourseMgr","recommended":1,"ssh_url":"git@coding.net:larus/CourseMgr.git","star_count":0,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1418050577000,"watch_count":1,"watched":false},{"backend_project_path":"/user/chenwj233/project/jekyll-demo","created_at":1417751364000,"current_user_role_id":0,"depot_path":"/u/chenwj233/p/jekyll-demo/git","description":"迷の博客","fork_count":20,"forked":false,"git_url":"git://coding.net/chenwj233/jekyll-demo.git","groupId":0,"https_url":"https://coding.net/chenwj233/jekyll-demo.git","icon":"/static/project_icon/scenery-13.png","id":36386,"is_public":true,"last_updated":1418812716532,"max_member":10,"name":"jekyll-demo","owner_id":31960,"owner_user_home":"<a href=\"https://coding.net/u/chenwj233\">chenwj233</a>","owner_user_name":"chenwj233","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/68e08a21-2363-42e4-8548-493560945c1c.jpg?imageMogr2/auto-orient/format/jpeg/crop/!180x180a0a0","pin":false,"project_path":"/u/chenwj233/p/jekyll-demo","recommended":1,"ssh_url":"git@coding.net:chenwj233/jekyll-demo.git","star_count":3,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1418201461000,"watch_count":3,"watched":false},{"backend_project_path":"/user/TooBug/project/ToogleAuth","created_at":1417670450000,"current_user_role_id":0,"depot_path":"/u/TooBug/p/ToogleAuth/git","description":"基于Atom-Shell的Google Authenticator实现","fork_count":0,"forked":false,"git_url":"git://coding.net/TooBug/ToogleAuth.git","groupId":0,"https_url":"https://coding.net/TooBug/ToogleAuth.git","icon":"/static/project_icon/scenery-8.png","id":35975,"is_public":true,"last_updated":1417672090000,"max_member":10,"name":"ToogleAuth","owner_id":10351,"owner_user_home":"<a href=\"https://coding.net/u/TooBug\">TooBug</a>","owner_user_name":"TooBug","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/5a0c6cd9a25667dd170fb4bfae972b17.png","pin":false,"project_path":"/u/TooBug/p/ToogleAuth","recommended":1,"ssh_url":"git@coding.net:TooBug/ToogleAuth.git","star_count":0,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1417670450000,"watch_count":2,"watched":false},{"backend_project_path":"/user/edit/project/BeijingTPI","created_at":1417597350000,"current_user_role_id":0,"depot_path":"/u/edit/p/BeijingTPI/git","description":"北京交通指数 http://bjtpi.codingapp.com/","fork_count":3,"forked":false,"git_url":"git://coding.net/edit/BeijingTPI.git","groupId":0,"https_url":"https://coding.net/edit/BeijingTPI.git","icon":"/static/project_icon/scenery-19.png","id":35705,"is_public":true,"last_updated":1417942800000,"max_member":10,"name":"BeijingTPI","owner_id":35536,"owner_user_home":"<a href=\"https://coding.net/u/edit\">edit</a>","owner_user_name":"edit","owner_user_picture":"/static/fruit_avatar/Fruit-1.png","pin":false,"project_path":"/u/edit/p/BeijingTPI","recommended":1,"ssh_url":"git@coding.net:edit/BeijingTPI.git","star_count":0,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1417741774000,"watch_count":1,"watched":false},{"backend_project_path":"/user/xin/project/coding_preview","created_at":1417592780000,"current_user_role_id":0,"depot_path":"/u/xin/p/coding_preview/git","description":"coding 项目挂件","fork_count":0,"forked":false,"git_url":"git://coding.net/xin/coding_preview.git","groupId":0,"https_url":"https://coding.net/xin/coding_preview.git","icon":"https://dn-coding-net-production-static.qbox.me/9ceaf3b8-b2ad-4875-8d68-4c7c32f9a93f.png","id":35670,"is_public":true,"last_updated":1418083221000,"max_member":10,"name":"coding_preview","owner_id":2552,"owner_user_home":"<a href=\"https://coding.net/u/xin\">xin</a>","owner_user_name":"xin","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/669e1714-e6d7-47d6-8984-8de4e5c3d5c1.png?imageMogr2/auto-orient/format/png/crop/!450x450a0a0","pin":false,"project_path":"/u/xin/p/coding_preview","recommended":1,"ssh_url":"git@coding.net:xin/coding_preview.git","star_count":6,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1417592780000,"watch_count":7,"watched":false},{"backend_project_path":"/user/arkins/project/happy_birthday","created_at":1417238313000,"current_user_role_id":0,"depot_path":"/u/arkins/p/happy_birthday/git","description":"祝你生日快乐！简单web版。","fork_count":2,"forked":false,"git_url":"git://coding.net/arkins/happy_birthday.git","groupId":0,"https_url":"https://coding.net/arkins/happy_birthday.git","icon":"https://dn-coding-net-production-static.qbox.me/863d1326-c027-4d14-832a-c82fa06a6265.jpg","id":34248,"is_public":true,"last_updated":1417778642000,"max_member":10,"name":"happy_birthday","owner_id":740,"owner_user_home":"<a href=\"https://coding.net/u/arkins\">ArkiN</a>","owner_user_name":"arkins","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/22485ad7-e1d2-471d-9b36-441a65867deb.jpg?imageMogr2/auto-orient/format/jpeg/crop/!488x488a10a10","pin":false,"project_path":"/u/arkins/p/happy_birthday","recommended":1,"ssh_url":"git@coding.net:arkins/happy_birthday.git","star_count":3,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1417238313000,"watch_count":2,"watched":false},{"backend_project_path":"/user/hwgq2005/project/qiniu-js-sdk","created_at":1417075771000,"current_user_role_id":0,"depot_path":"/u/hwgq2005/p/qiniu-js-sdk/git","description":"七牛云存储 - JavaScript SDK","fork_count":3,"forked":false,"git_url":"git://coding.net/hwgq2005/qiniu-js-sdk.git","groupId":0,"https_url":"https://coding.net/hwgq2005/qiniu-js-sdk.git","icon":"/static/project_icon/scenery-4.png","id":33573,"is_public":true,"last_updated":1417246313000,"max_member":10,"name":"qiniu-js-sdk","owner_id":32760,"owner_user_home":"<a href=\"https://coding.net/u/hwgq2005\">Gen</a>","owner_user_name":"hwgq2005","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/256b9105-f923-4467-9993-a9a09009b623.png?imageMogr2/auto-orient/format/png/crop/!650x650a0a3","pin":false,"project_path":"/u/hwgq2005/p/qiniu-js-sdk","recommended":1,"ssh_url":"git@coding.net:hwgq2005/qiniu-js-sdk.git","star_count":1,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1417075771000,"watch_count":3,"watched":false},{"backend_project_path":"/user/myrobot/project/coding_pp_robot","created_at":1416674141000,"current_user_role_id":0,"depot_path":"/u/myrobot/p/coding_pp_robot/git","description":"coding_pp_robot","fork_count":7,"forked":false,"git_url":"git://coding.net/myrobot/coding_pp_robot.git","groupId":0,"https_url":"https://coding.net/myrobot/coding_pp_robot.git","icon":"/static/project_icon/scenery-20.png","id":31590,"is_public":true,"last_updated":1417655158000,"max_member":10,"name":"coding_pp_robot","owner_id":47176,"owner_user_home":"<a href=\"https://coding.net/u/myrobot\">猴子</a>","owner_user_name":"myrobot","owner_user_picture":"/static/fruit_avatar/Fruit-11.png","pin":false,"project_path":"/u/myrobot/p/coding_pp_robot","recommended":1,"ssh_url":"git@coding.net:myrobot/coding_pp_robot.git","star_count":11,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1416674141000,"watch_count":12,"watched":false},{"backend_project_path":"/user/waruqi/project/itrace","created_at":1416538999000,"current_user_role_id":0,"depot_path":"/u/waruqi/p/itrace/git","description":"trace ios objc-method","fork_count":0,"forked":false,"git_url":"git://coding.net/waruqi/itrace.git","groupId":0,"https_url":"https://coding.net/waruqi/itrace.git","icon":"/static/project_icon/scenery-15.png","id":30903,"is_public":true,"last_updated":1418795970000,"max_member":10,"name":"itrace","owner_id":41027,"owner_user_home":"<a href=\"https://coding.net/u/waruqi\">waruqi</a>","owner_user_name":"waruqi","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/de30b4c1-7c44-4c2f-bda2-82ebe888971f.jpg?imageMogr2/auto-orient/format/jpeg/crop/!640x640a0a0","pin":false,"project_path":"/u/waruqi/p/itrace","recommended":1,"ssh_url":"git@coding.net:waruqi/itrace.git","star_count":0,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1416538999000,"watch_count":0,"watched":false}],"page":1,"pageSize":10,"totalPage":1540,"totalRow":15398}}


        var projects = data.data.list,
            fragment = document.createDocumentFragment(),
            pro,
            ele;

        list = document.getElementById('projects_list');

        for (var i = 0; i < projects.length; i++) {
            pro = projects[i];
            ele = createTemplate();

            ele.attr('href', pro['project_path']);
            ele.find('h4 > img').attr('src', pro['icon']);
            ele.find('h4 > span:first').text(pro['name']);
            ele.find('h4 > span:eq(1)').text(pro['fork_count']);
            ele.find('h4 > span:eq(2)').text(pro['watch_count']);
            ele.find('p > span:first').text(pro['description']);
            ele.find('p img').attr('src', pro['owner_user_picture']);
            ele.find('p b').text(pro['owner_user_name']);


            ele.on('swipe click', function(e){
                e.preventDefault();
                $(list).find('a').removeClass('active');
                $(this).addClass('active');
            });

            elements.push(ele);
            fragment.appendChild(ele[0]);

        }

        list.appendChild(fragment);
    }

    function createTemplate(){
        var template = '<a href="#" class="list-group-item">' +
                            '<h4 class="list-group-item-heading">' +
                                '<img src="#" width="40" height="40"> ' +
                                '<span></span>' +
                                '<span class="glyphicon glyphicon-eye-open pull-right icon-small" aria-hidden="true"> </span>' +
                                '<span class="glyphicon glyphicon-random pull-right icon-small" aria-hidden="true"> </span>' +
                            '</h4>' +
                            '<p class="list-group-item-text">' +
                                '<span></span>' +
                                '<span class="pull-right">' +
                                    '<img src="#" height="20" width="20" src="#">' +
                                    '<b></b>' +
                                '</span>' +
                            '</p>' +
                        '</a>';

        return $(template).clone();
    }

    function loadMore(path){

        pageCount++;
        var _ = this;
        _.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');
        setTimeout(function(){
            assembleDOM();
            _.text('更多项目');
        },2000);

//        pageCount++;
//        var _ = this;
//        _.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');
//        path += '?page=' + pageCount + '&' + 'pageSize=' + pageSize;
//        $.getJSON(HOST_URL + path, function(data, status, xhr){
//            console.log(data, status, xhr);
//            this.text('更多项目');
//            assembleDOM(data);
//        });

    }

    function showAll(){
        var fragment = document.createDocumentFragment(),
            list     = document.getElementById('projects_list'),
            ele;
        for (var i = 0; i < elements.length; i++) {
            ele = elements[i];

            ele.on('swipe tap click', function(e){
                e.preventDefault();
                $(list).find('a').removeClass('active');
                $(this).addClass('active');
            });

            fragment.appendChild(ele[0]);
        }
        list.appendChild(fragment)
    }

    return {
        before: function(){
            //set up the page information in the banner
            $('title').text('精彩项目');
            $('#page_name').text('精彩项目');

        },
        ctrl: function(){
            //check if it has previous loaded element
            if(elements.length == 0){
                var element = $("#load_more");
                loadMore.call(element,"/api/public/all");
            }
            //otherwise just show the cached result
            else{
                showAll();
            }

            var element = $("#load_more");
            element.on('click', function(e){
                e.preventDefault();
                loadMore.call($(this), "/api/public/all");
            });
        },
        exit: function(){
            //clean up the banner
            $('title').text('');
            $('#page_name').text('');

        }
    }

})();
