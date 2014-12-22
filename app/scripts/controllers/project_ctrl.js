/**
 * Created by simonykq on 21/12/2014.
 */
var PROJECT_ROUTE = (function(){

    var HOST_URL  =  window.HOST_URL || "",
        pageSize  = 10,
        pageCount = 0,
        list      = null,
        elements  = [];

    function assembleDOM(data){
        var data = data || {"code":0,"data":{"list":[{"backend_project_path":"/user/demo/project/node-2048","created_at":1403062201000,"current_user_role_id":0,"depot_path":"/u/demo/p/node-2048/git","description":"NodeJS + 2048 + MySQL","fork_count":254,"forked":false,"git_url":"git://coding.net/demo/node-2048.git","groupId":0,"https_url":"https://coding.net/demo/node-2048.git","icon":"/static/project_icon/scenery-20.png","id":124,"is_public":true,"last_updated":1417075124000,"max_member":10,"name":"node-2048","owner_id":26,"owner_user_home":"<a href=\"https://coding.net/u/demo\">demo</a>","owner_user_name":"demo","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/eb160ca8-9bb9-4df1-a577-c712e45b2882.jpg?imageMogr2/auto-orient/format/jpeg/crop/!323x323a8a0","pin":false,"project_path":"/u/demo/p/node-2048","recommended":3,"ssh_url":"git@coding.net:demo/node-2048.git","star_count":91,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1403062370000,"watch_count":127,"watched":false},{"backend_project_path":"/user/trigged/project/PowCloud","created_at":1418899802000,"current_user_role_id":0,"depot_path":"/u/trigged/p/PowCloud/git","description":"一个强力,灵活的后端服务, 可以在弹指间完成的你后端服务","fork_count":3,"forked":false,"git_url":"git://coding.net/trigged/PowCloud.git","groupId":0,"https_url":"https://coding.net/trigged/PowCloud.git","icon":"https://dn-coding-net-production-static.qbox.me/320af98b-f9f5-4244-8cad-c86ecc9c1c4e.jpg","id":40891,"is_public":true,"last_updated":1418971439000,"max_member":10,"name":"PowCloud","owner_id":7109,"owner_user_home":"<a href=\"https://coding.net/u/trigged\">trigged</a>","owner_user_name":"trigged","owner_user_picture":"/static/fruit_avatar/Fruit-10.png","pin":false,"project_path":"/u/trigged/p/PowCloud","recommended":1,"ssh_url":"git@coding.net:trigged/PowCloud.git","star_count":2,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1418900406000,"watch_count":2,"watched":false},{"backend_project_path":"/user/elevenchen/project/FlyBlock","created_at":1418572826000,"current_user_role_id":0,"depot_path":"/u/elevenchen/p/FlyBlock/git","description":"使用Cocos2d-js编写的小游戏","fork_count":1,"forked":false,"git_url":"git://coding.net/elevenchen/FlyBlock.git","groupId":0,"https_url":"https://coding.net/elevenchen/FlyBlock.git","icon":"https://dn-coding-net-production-static.qbox.me/e2d88367-56c8-4d90-94eb-4ce994e2ed4f.png","id":39338,"is_public":true,"last_updated":1419082505000,"max_member":10,"name":"FlyBlock","owner_id":52953,"owner_user_home":"<a href=\"https://coding.net/u/elevenchen\">ElevenChen</a>","owner_user_name":"elevenchen","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/c1caa543-f158-41c4-a74a-6ccbf7b7f36c.jpeg?imageMogr2/auto-orient/format/jpeg/crop/!180x180a0a0","pin":false,"project_path":"/u/elevenchen/p/FlyBlock","recommended":1,"ssh_url":"git@coding.net:elevenchen/FlyBlock.git","star_count":2,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1418964542000,"watch_count":3,"watched":false},{"backend_project_path":"/user/bluishoul/project/coding-plus","created_at":1418570094000,"current_user_role_id":0,"depot_path":"/u/bluishoul/p/coding-plus/git","description":"为 Coding.net 添加更多酷炫的特性的 Chrome 插件！","fork_count":3,"forked":false,"git_url":"git://coding.net/bluishoul/coding-plus.git","groupId":0,"https_url":"https://coding.net/bluishoul/coding-plus.git","icon":"https://dn-coding-net-production-static.qbox.me/a4b4cb47-3aa0-4316-9b17-a1f29d633cb9.png","id":39333,"is_public":true,"last_updated":1419149256541,"max_member":10,"name":"coding-plus","owner_id":7,"owner_user_home":"<a href=\"https://coding.net/u/bluishoul\">彭博</a>","owner_user_name":"bluishoul","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/e3438bf4-8e93-4a6d-b116-683b9a30c992.jpg?imageMogr2/auto-orient/format/jpeg/crop/!640x640a0a0","pin":false,"project_path":"/u/bluishoul/p/coding-plus","recommended":1,"ssh_url":"git@coding.net:bluishoul/coding-plus.git","star_count":3,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1418699514000,"watch_count":8,"watched":false},{"backend_project_path":"/user/kalcaddle/project/kodexplorer","created_at":1418545968000,"current_user_role_id":0,"depot_path":"/u/kalcaddle/p/kodexplorer/git","description":"web文件管理；在线解压缩；在线文件编辑；","fork_count":1,"forked":false,"git_url":"git://coding.net/kalcaddle/kodexplorer.git","groupId":0,"https_url":"https://coding.net/kalcaddle/kodexplorer.git","icon":"https://dn-coding-net-production-static.qbox.me/624df796-2c38-405a-a39b-b5f953da4c4c.png","id":39270,"is_public":true,"last_updated":1419088528000,"max_member":10,"name":"kodexplorer","owner_id":5683,"owner_user_home":"<a href=\"https://coding.net/u/kalcaddle\">kalcaddle</a>","owner_user_name":"kalcaddle","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/1add750b405dc64270558a6c35edf56c.jpg","pin":false,"project_path":"/u/kalcaddle/p/kodexplorer","recommended":1,"ssh_url":"git@coding.net:kalcaddle/kodexplorer.git","star_count":2,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1419088289000,"watch_count":5,"watched":false},{"backend_project_path":"/user/ryu/project/Fork-me-on-Coding","created_at":1418275270000,"current_user_role_id":0,"depot_path":"/u/ryu/p/Fork-me-on-Coding/git","description":"给你的网页添加“Fork me on Coding”彩带，让访客链接进你的Coding主页，添加以下代码于你的网页中","fork_count":4,"forked":false,"git_url":"git://coding.net/ryu/Fork-me-on-Coding.git","groupId":0,"https_url":"https://coding.net/ryu/Fork-me-on-Coding.git","icon":"/static/project_icon/scenery-23.png","id":38405,"is_public":true,"last_updated":1418449982000,"max_member":10,"name":"Fork-me-on-Coding","owner_id":3118,"owner_user_home":"<a href=\"https://coding.net/u/ryu\">ryu</a>","owner_user_name":"ryu","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/5ab3a5847f1b20f65c756cab476fc8f9.jpg","pin":false,"project_path":"/u/ryu/p/Fork-me-on-Coding","recommended":1,"ssh_url":"git@coding.net:ryu/Fork-me-on-Coding.git","star_count":6,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1418284382000,"watch_count":3,"watched":false},{"backend_project_path":"/user/phpbin/project/jiache","created_at":1418188450000,"current_user_role_id":0,"depot_path":"/u/phpbin/p/jiache/git","description":"欢迎使用驾车！请输入您的车辆信息～\n最专业，最稳定的违章查询服务平台","fork_count":1,"forked":false,"git_url":"git://coding.net/phpbin/jiache.git","groupId":0,"https_url":"https://coding.net/phpbin/jiache.git","icon":"https://dn-coding-net-production-static.qbox.me/c571e157-771f-41ae-87ce-dee637dc39df.png","id":38064,"is_public":true,"last_updated":1418354447000,"max_member":10,"name":"jiache","owner_id":24966,"owner_user_home":"<a href=\"https://coding.net/u/phpbin\">phpbin</a>","owner_user_name":"phpbin","owner_user_picture":"/static/fruit_avatar/Fruit-18.png","pin":false,"project_path":"/u/phpbin/p/jiache","recommended":1,"ssh_url":"git@coding.net:phpbin/jiache.git","star_count":0,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1418198301000,"watch_count":0,"watched":false},{"backend_project_path":"/user/larus/project/CourseMgr","created_at":1418050577000,"current_user_role_id":0,"depot_path":"/u/larus/p/CourseMgr/git","description":"课程管理系统","fork_count":4,"forked":false,"git_url":"git://coding.net/larus/CourseMgr.git","groupId":0,"https_url":"https://coding.net/larus/CourseMgr.git","icon":"/static/project_icon/scenery-16.png","id":37457,"is_public":true,"last_updated":1418783957000,"max_member":10,"name":"CourseMgr","owner_id":36572,"owner_user_home":"<a href=\"https://coding.net/u/larus\">larus</a>","owner_user_name":"larus","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/f91b67ba68c5aba1436adf1cc3500c2b.png","pin":false,"project_path":"/u/larus/p/CourseMgr","recommended":1,"ssh_url":"git@coding.net:larus/CourseMgr.git","star_count":2,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1418050577000,"watch_count":2,"watched":false},{"backend_project_path":"/user/chenwj233/project/jekyll-demo","created_at":1417751364000,"current_user_role_id":0,"depot_path":"/u/chenwj233/p/jekyll-demo/git","description":"迷の博客","fork_count":27,"forked":false,"git_url":"git://coding.net/chenwj233/jekyll-demo.git","groupId":0,"https_url":"https://coding.net/chenwj233/jekyll-demo.git","icon":"/static/project_icon/scenery-13.png","id":36386,"is_public":true,"last_updated":1418958799000,"max_member":10,"name":"jekyll-demo","owner_id":31960,"owner_user_home":"<a href=\"https://coding.net/u/chenwj233\">chenwj233</a>","owner_user_name":"chenwj233","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/68e08a21-2363-42e4-8548-493560945c1c.jpg?imageMogr2/auto-orient/format/jpeg/crop/!180x180a0a0","pin":false,"project_path":"/u/chenwj233/p/jekyll-demo","recommended":1,"ssh_url":"git@coding.net:chenwj233/jekyll-demo.git","star_count":6,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1418201461000,"watch_count":5,"watched":false},{"backend_project_path":"/user/TooBug/project/ToogleAuth","created_at":1417670450000,"current_user_role_id":0,"depot_path":"/u/TooBug/p/ToogleAuth/git","description":"基于Atom-Shell的Google Authenticator实现","fork_count":0,"forked":false,"git_url":"git://coding.net/TooBug/ToogleAuth.git","groupId":0,"https_url":"https://coding.net/TooBug/ToogleAuth.git","icon":"/static/project_icon/scenery-8.png","id":35975,"is_public":true,"last_updated":1417672090000,"max_member":10,"name":"ToogleAuth","owner_id":10351,"owner_user_home":"<a href=\"https://coding.net/u/TooBug\">TooBug</a>","owner_user_name":"TooBug","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/5a0c6cd9a25667dd170fb4bfae972b17.png","pin":false,"project_path":"/u/TooBug/p/ToogleAuth","recommended":1,"ssh_url":"git@coding.net:TooBug/ToogleAuth.git","star_count":0,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1417670450000,"watch_count":2,"watched":false},{"backend_project_path":"/user/edit/project/BeijingTPI","created_at":1417597350000,"current_user_role_id":0,"depot_path":"/u/edit/p/BeijingTPI/git","description":"北京交通指数 http://bjtpi.codingapp.com/","fork_count":3,"forked":false,"git_url":"git://coding.net/edit/BeijingTPI.git","groupId":0,"https_url":"https://coding.net/edit/BeijingTPI.git","icon":"/static/project_icon/scenery-19.png","id":35705,"is_public":true,"last_updated":1417942800000,"max_member":10,"name":"BeijingTPI","owner_id":35536,"owner_user_home":"<a href=\"https://coding.net/u/edit\">edit</a>","owner_user_name":"edit","owner_user_picture":"/static/fruit_avatar/Fruit-1.png","pin":false,"project_path":"/u/edit/p/BeijingTPI","recommended":1,"ssh_url":"git@coding.net:edit/BeijingTPI.git","star_count":0,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1417741774000,"watch_count":1,"watched":false},{"backend_project_path":"/user/xin/project/coding_preview","created_at":1417592780000,"current_user_role_id":0,"depot_path":"/u/xin/p/coding_preview/git","description":"coding 项目挂件","fork_count":0,"forked":false,"git_url":"git://coding.net/xin/coding_preview.git","groupId":0,"https_url":"https://coding.net/xin/coding_preview.git","icon":"https://dn-coding-net-production-static.qbox.me/9ceaf3b8-b2ad-4875-8d68-4c7c32f9a93f.png","id":35670,"is_public":true,"last_updated":1418083221000,"max_member":10,"name":"coding_preview","owner_id":2552,"owner_user_home":"<a href=\"https://coding.net/u/xin\">xin</a>","owner_user_name":"xin","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/669e1714-e6d7-47d6-8984-8de4e5c3d5c1.png?imageMogr2/auto-orient/format/png/crop/!450x450a0a0","pin":false,"project_path":"/u/xin/p/coding_preview","recommended":1,"ssh_url":"git@coding.net:xin/coding_preview.git","star_count":7,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1417592780000,"watch_count":8,"watched":false},{"backend_project_path":"/user/arkins/project/happy_birthday","created_at":1417238313000,"current_user_role_id":0,"depot_path":"/u/arkins/p/happy_birthday/git","description":"祝你生日快乐！简单web版。","fork_count":3,"forked":false,"git_url":"git://coding.net/arkins/happy_birthday.git","groupId":0,"https_url":"https://coding.net/arkins/happy_birthday.git","icon":"https://dn-coding-net-production-static.qbox.me/863d1326-c027-4d14-832a-c82fa06a6265.jpg","id":34248,"is_public":true,"last_updated":1417778642000,"max_member":10,"name":"happy_birthday","owner_id":740,"owner_user_home":"<a href=\"https://coding.net/u/arkins\">ArkiN</a>","owner_user_name":"arkins","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/22485ad7-e1d2-471d-9b36-441a65867deb.jpg?imageMogr2/auto-orient/format/jpeg/crop/!488x488a10a10","pin":false,"project_path":"/u/arkins/p/happy_birthday","recommended":1,"ssh_url":"git@coding.net:arkins/happy_birthday.git","star_count":5,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1417238313000,"watch_count":4,"watched":false},{"backend_project_path":"/user/hwgq2005/project/qiniu-js-sdk","created_at":1417075771000,"current_user_role_id":0,"depot_path":"/u/hwgq2005/p/qiniu-js-sdk/git","description":"七牛云存储 - JavaScript SDK","fork_count":5,"forked":false,"git_url":"git://coding.net/hwgq2005/qiniu-js-sdk.git","groupId":0,"https_url":"https://coding.net/hwgq2005/qiniu-js-sdk.git","icon":"/static/project_icon/scenery-4.png","id":33573,"is_public":true,"last_updated":1417246313000,"max_member":10,"name":"qiniu-js-sdk","owner_id":32760,"owner_user_home":"<a href=\"https://coding.net/u/hwgq2005\">Gen</a>","owner_user_name":"hwgq2005","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/256b9105-f923-4467-9993-a9a09009b623.png?imageMogr2/auto-orient/format/png/crop/!650x650a0a3","pin":false,"project_path":"/u/hwgq2005/p/qiniu-js-sdk","recommended":1,"ssh_url":"git@coding.net:hwgq2005/qiniu-js-sdk.git","star_count":5,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1417075771000,"watch_count":4,"watched":false},{"backend_project_path":"/user/myrobot/project/coding_pp_robot","created_at":1416674141000,"current_user_role_id":0,"depot_path":"/u/myrobot/p/coding_pp_robot/git","description":"coding_pp_robot","fork_count":7,"forked":false,"git_url":"git://coding.net/myrobot/coding_pp_robot.git","groupId":0,"https_url":"https://coding.net/myrobot/coding_pp_robot.git","icon":"/static/project_icon/scenery-20.png","id":31590,"is_public":true,"last_updated":1417655158000,"max_member":10,"name":"coding_pp_robot","owner_id":47176,"owner_user_home":"<a href=\"https://coding.net/u/myrobot\">猴子</a>","owner_user_name":"myrobot","owner_user_picture":"/static/fruit_avatar/Fruit-11.png","pin":false,"project_path":"/u/myrobot/p/coding_pp_robot","recommended":1,"ssh_url":"git@coding.net:myrobot/coding_pp_robot.git","star_count":11,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1416674141000,"watch_count":12,"watched":false},{"backend_project_path":"/user/waruqi/project/itrace","created_at":1416538999000,"current_user_role_id":0,"depot_path":"/u/waruqi/p/itrace/git","description":"trace ios objc-method","fork_count":0,"forked":false,"git_url":"git://coding.net/waruqi/itrace.git","groupId":0,"https_url":"https://coding.net/waruqi/itrace.git","icon":"/static/project_icon/scenery-15.png","id":30903,"is_public":true,"last_updated":1418795970000,"max_member":10,"name":"itrace","owner_id":41027,"owner_user_home":"<a href=\"https://coding.net/u/waruqi\">waruqi</a>","owner_user_name":"waruqi","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/de30b4c1-7c44-4c2f-bda2-82ebe888971f.jpg?imageMogr2/auto-orient/format/jpeg/crop/!640x640a0a0","pin":false,"project_path":"/u/waruqi/p/itrace","recommended":1,"ssh_url":"git@coding.net:waruqi/itrace.git","star_count":0,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1416538999000,"watch_count":0,"watched":false},{"backend_project_path":"/user/trotri/project/trotri-public","created_at":1416479285000,"current_user_role_id":0,"depot_path":"/u/trotri/p/trotri-public/git","description":"包含两部分，核心框架：TFC、基于TFC开发的CMS系统：Trotri。TFC功能全面、Trotri功能丰富。","fork_count":7,"forked":false,"git_url":"git://coding.net/trotri/trotri-public.git","groupId":0,"https_url":"https://coding.net/trotri/trotri-public.git","icon":"/static/project_icon/scenery-8.png","id":30581,"is_public":true,"last_updated":1416913582000,"max_member":10,"name":"trotri-public","owner_id":46549,"owner_user_home":"<a href=\"https://coding.net/u/trotri\">trotri</a>","owner_user_name":"trotri","owner_user_picture":"/static/fruit_avatar/Fruit-10.png","pin":false,"project_path":"/u/trotri/p/trotri-public","recommended":1,"ssh_url":"git@coding.net:trotri/trotri-public.git","star_count":3,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1416800783000,"watch_count":3,"watched":false},{"backend_project_path":"/user/useLess/project/Angularjs-Player","created_at":1416414879000,"current_user_role_id":0,"depot_path":"/u/useLess/p/Angularjs-Player/git","description":"用Angularjs做的h5音乐播放器\n\n正在开发中，还有很多bug.....","fork_count":21,"forked":false,"git_url":"git://coding.net/useLess/Angularjs-Player.git","groupId":0,"https_url":"https://coding.net/useLess/Angularjs-Player.git","icon":"/static/project_icon/scenery-11.png","id":30146,"is_public":true,"last_updated":1418540374000,"max_member":10,"name":"Angularjs-Player","owner_id":8988,"owner_user_home":"<a href=\"https://coding.net/u/useLess\">ellyLiang</a>","owner_user_name":"useLess","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/3198fe56-a416-4308-9136-58cda8e39ab2.jpg?imageMogr2/auto-orient/format/jpeg/crop/!551x551a8a125","pin":false,"project_path":"/u/useLess/p/Angularjs-Player","recommended":1,"ssh_url":"git@coding.net:useLess/Angularjs-Player.git","star_count":12,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1416414879000,"watch_count":16,"watched":false},{"backend_project_path":"/user/xialei/project/Lubbi","created_at":1416408211000,"current_user_role_id":0,"depot_path":"/u/xialei/p/Lubbi/git","description":"一个完整的APP项目，适合学习","fork_count":6,"forked":false,"git_url":"git://coding.net/xialei/Lubbi.git","groupId":0,"https_url":"https://coding.net/xialei/Lubbi.git","icon":"/static/project_icon/scenery-12.png","id":30116,"is_public":true,"last_updated":1418864848000,"max_member":10,"name":"Lubbi","owner_id":258,"owner_user_home":"<a href=\"https://coding.net/u/xialei\">xialei</a>","owner_user_name":"xialei","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/57a95e17-40c8-4152-86ec-c18c4091b725.jpg","pin":false,"project_path":"/u/xialei/p/Lubbi","recommended":1,"ssh_url":"git@coding.net:xialei/Lubbi.git","star_count":4,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1416413434000,"watch_count":8,"watched":false},{"backend_project_path":"/user/xadillax/project/public-file-house","created_at":1416221665000,"current_user_role_id":0,"depot_path":"/u/xadillax/p/public-file-house/git","description":"A temporary file store net disk.","fork_count":0,"forked":false,"git_url":"git://coding.net/xadillax/public-file-house.git","groupId":0,"https_url":"https://coding.net/xadillax/public-file-house.git","icon":"/static/project_icon/scenery-10.png","id":29037,"is_public":true,"last_updated":1416221684000,"max_member":10,"name":"public-file-house","owner_id":8895,"owner_user_home":"<a href=\"https://coding.net/u/xadillax\">機巧死月不會碼代碼</a>","owner_user_name":"xadillax","owner_user_picture":"https://dn-coding-net-production-static.qbox.me/564d6bd6e577a0e1859a58a0aaf82c5f.jpg","pin":false,"project_path":"/u/xadillax/p/public-file-house","recommended":1,"ssh_url":"git@coding.net:xadillax/public-file-house.git","star_count":0,"stared":false,"status":1,"type":1,"un_read_activities_count":0,"updated_at":1416221665000,"watch_count":0,"watched":false}],"page":1,"pageSize":20,"totalPage":803,"totalRow":16045}};


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
            //ele.find('p img').attr('src', pro['owner_user_picture']);
            //ele.find('p b').text(pro['owner_user_name']);


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
                                '<span class="glyphicon glyphicon-eye-open pull-right icon-small" aria-hidden="true"></span>' +
                                '<span class="glyphicon glyphicon-random pull-right icon-small" aria-hidden="true"></span>' +
                            '</h4>' +
                            '<p class="list-group-item-text">' +
                                '<span></span>' +
                                //'<span class="pull-right">' +
                                //    '<img src="#" height="20" width="20" src="#">' +
                                //    '<b></b>' +
                                //'</span>' +
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
        template_url: '/views/projects.html',
        context: ".container",
        before_enter: function(){
            //set up the page information in the banner
            $('title').text('精彩项目');
            $('#page_name').text('精彩项目');

            $('#navigator').find('li:first').addClass('active');

        },
        on_enter: function(){
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
        on_exit: function(){
            //clean up the banner
            $('title').text('');
            $('#page_name').text('');
            $('#navigator').find('li').removeClass('active');

        },
        default: true
    }

})();
