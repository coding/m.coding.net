// 总的管控模块
Zepto(function(){

    //取消发/评论冒泡
    $('#pp_cancel').off('click').on('click',function(){
        closeModal();
    });

    //历史记录回滚监听，这里需要判断是 back 使然，还是浏览器操作使然
    // fucking html5 history api
    window.onpopstate = function(event){
        if( window.location.hash=='#pp_input' ){
            $('html').removeClass('chose-friend');
            $('#pp_input').removeClass('chose-friend').removeClass('chose-location');
        }

        if( !window.location.hash ){
            closeModal();
        }
    };

    function closeModal(){
        $("#pp_input").modal('hide');
        $('#pp_input').removeClass('chose-friend').removeClass('chose-location');
        $('html').removeClass('pp-modaling-small').removeClass('pp-modaling-large');
        window.history.replaceState(null,null, window.location.pathname );
    }
});

// 表情功能模块
Zepto(function(){

    var slide_emojis,
        slide_monkeys,
        slideWidth;

    var emojiMap = {
        emoji: [
            "smiley",
            "heart_eyes",
            "pensive",
            "flushed",
            "grin",
            "kissing_heart",
            "wink",
            "angry",
            "disappointed",
            "disappointed_relieved",
            "sob",
            "stuck_out_tongue_closed_eyes",
            "rage",
            "persevere",
            "unamused",
            "smile",
            "mask",
            "kissing_face",
            "sweat",
            "joy",
            "blush",
            "cry",
            "stuck_out_tongue_winking_eye",
            "fearful",
            "cold_sweat",
            "astonished",
            "smirk",
            "scream",
            "sleepy",
            "confounded",
            "relieved",
            "smiling_imp",
            "ghost",
            "santa",
            "dog",
            "pig",
            "cat",
            "+1",
            "-1",
            "facepunch",
            "fist",
            "v",
            "muscle",
            "clap",
            "point_left",
            "point_up_2",
            "point_right",
            "point_down",
            "ok_hand",
            "heart",
            "broken_heart",
            "sunny",
            "moon",
            "star2",
            "zap",
            "cloud",
            "lips",
            "rose",
            "coffee",
            "birthday",
            "clock10",
            "beer",
            "mag",
            "iphone",
            "house",
            "car",
            "gift",
            "soccer",
            "bomb",
            "gem",
            "alien",
            "100",
            "money_with_wings",
            "video_game",
            "hankey",
            "sos",
            "zzz",
            "microphone",
            "umbrella",
            "book",
            "pray",
            "rocket",
            "tea",
            "watermelon"
        ],
        coding: [
            {code: "哈哈", image: "coding-emoji-01"},
            {code: "吐", image: "coding-emoji-02"},
            {code: "压力山大", image: "coding-emoji-03"},
            {code: "忧伤", image: "coding-emoji-04"},
            {code: "坏人", image: "coding-emoji-05"},
            {code: "酷", image: "coding-emoji-06"},
            {code: "哼", image: "coding-emoji-07"},
            {code: "你咬我啊", image: "coding-emoji-08"},
            {code: "内急", image: "coding-emoji-09"},
            {code: "32个赞", image: "coding-emoji-10"},
            {code: "加油", image: "coding-emoji-11"},
            {code: "闭嘴", image: "coding-emoji-12"},
            {code: "wow", image: "coding-emoji-13"},
            {code: "泪流成河", image: "coding-emoji-14"},
            {code: "NO!", image: "coding-emoji-15"},
            {code: "疑问", image: "coding-emoji-16"},
            {code: "耶", image: "coding-emoji-17"},
            {code: "生日快乐", image: "coding-emoji-18"},
            {code: "求包养", image: "coding-emoji-19"},
            {code: "吹泡泡", image: "coding-emoji-20"},
            {code: "睡觉", image: "coding-emoji-21"},
            {code: "惊讶", image: "coding-emoji-22"},
            {code: "Hi", image: "coding-emoji-23"},
            {code: "打发点咯", image: "coding-emoji-24"},
            {code: "呵呵", image: "coding-emoji-25"},
            {code: "喷血", image: "coding-emoji-26"},
            {code: "Bug", image: "coding-emoji-27"},
            {code: "听音乐", image: "coding-emoji-28"},
            {code: "垒码", image: "coding-emoji-29"},
            {code: "我打你哦", image: "coding-emoji-30"},
            {code: "顶足球", image: "coding-emoji-31"},
            {code: "放毒气", image: "coding-emoji-32"},
            {code: "表白", image: "coding-emoji-33"},
            {code: "抓瓢虫", image: "coding-emoji-34"},
            {code: "下班", image: "coding-emoji-35"},
            {code: "冒泡", image: "coding-emoji-36"},
            {code: "2015", image: "coding-emoji-38"},
            {code: "拜年", image: "coding-emoji-39"},
            {code: "发红包", image: "coding-emoji-40"},
            {code: "放鞭炮", image: "coding-emoji-41"},
            {code: "求红包", image: "coding-emoji-42"},
            {code: "新年快乐", image: "coding-emoji-43"}
        ]
    }

    initialize();

    function initialize(){
        setEmoji();
        setSlide();
        justifyEmojis();

        eventAndHandlers();
    }

    function eventAndHandlers(){
        //表情卡片展示 状态切换
        $('#input_tool').on('click','.icon-emoji,.icon-keyboard',function(){
            window.postMessage('slideReset','*');
            $('#pp_input').toggleClass('chose-emoji');
        });

        //洋葱猴、经典表情 切换
        $('#input_tool').on('click','.emojis,.monkeys',function(){
            window.postMessage('slideReset','*');

            $('.emojiboard').removeClass('chose-emojis').removeClass('chose-monkeys');
            $('.emojiboard').addClass('chose-' + $(this).attr('class') );
        });

        //表情的添加和删除
        $('#emoji_board').on('click','i',function(){

            var emoji_code;
            var contentVal = $('#pp_content').val();

            if( $(this).hasClass('icon-delete') ){
                contentVal = contentVal.replace(/\:(\w)*?\:\s*$/,'');
            }else if( $(this).attr('code') ){
                emoji_code = $(this).attr('code');
                contentVal = contentVal + ':' + emoji_code + ':';
            }

            $('#pp_content').val( contentVal );
        });
        
        //滑动组件归位
        $(window).on('message', function(event){
            if( event.data == 'slideReset' ){
                $(window).resize();
            }
        });

        $(window).on('resize',function(){
            setTimeout(function(){
                slideWidth = $('#pp_form').width();
                reSetSlide();
                justifyEmojis();
                slide_emojis.goTo(0);
                slide_monkeys.goTo(0);
            },160);
        });
    }

    function setEmoji(){

        setEmojis();

        setMonkeys();

        function setEmojis(){
            var emojis = emojiMap.emoji;

            emojis.length = 80; //限制，只需要 80 个表情，刚好四屏

            var str = '';
            var x,y,cols;

            for( i in emojis ){
                if( i%20 == 0 ){

                    if( i!=0 ){
                        str += '<i class="icon-delete"></i>';
                    }

                    str += '</li><li>'
                    cols = 0;

                    $('#slide_emojis').find('.dot').append('<span></span>');

                }else{
                    cols ++;
                }

                if( cols>0 && cols%7==0 ){
                    str += '<br/>';
                }

                //根据表情id 调整表情的位置
                x = -24*i;
                y = 0;

                str += '<i code="' + emojis[i] + '" index="' + i + '" style="background-position: ' + x + 'px ' + y + 'px;"></i>';

            }

            str += '<i class="icon-delete"></i>';

            str = str.replace(/^(\<(\/)?li\>)*|(\<(\/)?li\>)*$/g,'');
            str = '<li>' + str + '</li>';

            $('.emoji-emojis').append( $(str) );

            $('#slide_emojis').find('.dot').find('span').first().addClass('cur');

        }

        function setMonkeys(){
            var monkeys = emojiMap.coding;

            monkeys.length = 40; //限制数量，刚好五屏

            var str = '';
            var x,y,cols;

            for( i in monkeys ){
                if( i%8 == 0 ){
                    str += '</li><li>'
                    cols = 0;

                    $('#slide_monkeys').find('.dot').append('<span></span>');

                }else{
                    cols ++;
                }

                if( cols>0 && cols%4==0 ){
                    str += '<br/>';
                }

                //根据表情id 调整表情的位置
                x = -50*i;
                y = 0;

                str += '<i code="' + monkeys[i]['code'] + '" index="' + i + '" style="background-position: ' + x + 'px ' + y + 'px;"></i>';

            }

            str = str.replace(/^(\<(\/)?li\>)*|(\<(\/)?li\>)*$/g,'');
            str = '<li>' + str + '</li>';

            $('.emoji-monkeys').append( $(str) );

            $('#slide_monkeys').find('.dot').find('span').first().addClass('cur');
        }
    }

    function setSlide(){
        
        slide_emojis = $('#slide_emojis').swipeSlide({
            transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
            callback : function(i){
                $('#slide_emojis').find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
                // callback手动设置目标值，为啥啊，坑爹的插件
                $('#slide_emojis').find('ul').css({
                    left: '-' + i * slideWidth + 'px'
                });
            }
        });
        
        slide_monkeys = $('#slide_monkeys').swipeSlide({
            transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
            callback : function(i){
                $('#slide_monkeys').find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
                //callback手动设置目标值，为啥啊，坑爹的插件
                $('#slide_monkeys').find('ul').css({
                    left: '-' + i * slideWidth + 'px'
                });
            }
        });
    }

    function reSetSlide(){
        //宽度预处理，swipeSlide 完全没有考虑开始拿不到宽度的情况啊
        console.log(slideWidth);
        $('#slide_emojis').find('ul').css({
            width: ($('#pp_form').width()) +'px'
        });

        $('#slide_monkeys').find('ul').css({
            width: ($('#pp_form').width()) +'px'
        });

        //初始化滑块的位置，修复手机 swipeSlide  端位置初始化失败的情况
        $('#slide_emojis').find('ul > li').each(function(index, li){
            $(this).css({
                left: index * ($('#pp_form').width()) + 'px'
            })
        });

        $('#slide_emojis').find('ul > li').each(function(index, li){
            $(this).css({
                left: index * ($('#pp_form').width()) + 'px'
            })
        });
    }

    function justifyEmojis(){
        var board_padding = 10;
        var board_width = slideWidth;

        var emoji_width = 24;
        var monkey_width = 50;

        var emojis_margin_horizontal = ( ( board_width - board_padding*2 )/7 - emoji_width)/2;
        var monkeys_margin_horizontal = ( ( board_width - board_padding*2 )/4 - monkey_width)/2;

        $('#slide_emojis').find('i').css({
            marginLeft: emojis_margin_horizontal + 'px',
            marginRight: emojis_margin_horizontal + 'px'
        })

        $('#slide_monkeys').find('i').css({
            marginLeft: monkeys_margin_horizontal + 'px',
            marginRight: monkeys_margin_horizontal + 'px'
        })
    }
});

// @好友功能模块
Zepto(function(){
    var friends = [],
        at_friends = [];

    initialize();

    function initialize(){
        eventAndHandlers();
        setAt();
    }

    function addHistory(state){
        // fucking html5 history api
        window.location.hash = '#' + state;
    }

    function eventAndHandlers(){
        //展开关闭好友列表 切换 
        $('#input_tool').on('click','.icon-at', openFriendList);
        $('#cancel_at').on('click', closeFriendsList);

        //@好友
        $('#friends_list').on('click', 'li[name]' ,function(){
            var name = $(this).attr('name');
            var content = $('#pp_content').val();
            content = content + '@' + name + ' ';

            $('#pp_content').val( content );
            at_friends.push( name );

            closeFriendsList();
        });

        //删除@好友，通过正则和 at_friends 列表协同判断
        $('#pp_content').on('keyup', function(event){
            if( !at_friends.length ) return;
            if( event.keyCode !== 8 ) return;

            var content = $('#pp_content').val();

            var last_at = at_friends[ at_friends.length -1 ];
            var match = content.match(/\@([^\@]*)$/);
            if( match && match[1] === last_at.slice(0,-1) ){
                content = content.replace(/\@[^\@]*$/,'');
                $('#pp_content').val( content );
                at_friends.pop();
            }
        });
    }

    function setAt(){
        var uri,
            page,
            pageSize,
            totalRow,
            totalPage;

        init();
        getFriends();

        function init(){
            uri = '/api/user/friends';
            page = 1;
            pageSize = 1000; //这里需要一次把好友数据加载完

            //事件绑定
            $('#friend_search').on('keyup change', searchFriends);
        }

        function getFriends(){
            $.ajax({
                url: API_DOMAIN + uri,
                dataType: 'json',
                data: {
                    page: page ++, //page 是从 1 开始的，每用一次递增
                    pageSize: pageSize
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    if(data.data){
                        success(data.data);
                    }else{
                        failed(data);
                    }
                },
                error: function(xhr, type){
                    failed();
                }
            });
        }

        function success(data){
            totalPage = data.totalPage;
            totalRow = data.totalRow;
            Array.prototype.push.apply(friends, data.list);
            showFriends( friends );
        }

        function failed(){
            alert('Failed to load friends');
        }

        function searchFriends(){
            var keyword = $('#friend_search').val().trim();
            var searched_friends = [];

            if( !keyword ) return showFriends( friends );

            friends.forEach(function(friend){
                // name 权值 8分*匹配字符数
                // name_pinyin 权值 4分*匹配字符数
                // tags_str 权值 2分*匹配字符数
                // slogan 权值 1分*匹配字符数
                friend.zIndex = 0;

                if( friend.name.indexOf( keyword ) > -1 ){
                    friend.zIndex += 8;
                }
                if( friend.name_pinyin.indexOf( keyword ) > -1 ){
                    friend.zIndex += 4;
                }
                if( friend.tags_str.indexOf( keyword ) > -1 ){
                    friend.zIndex += 2;
                }
                if( friend.slogan.indexOf( keyword ) > -1 ){
                    friend.zIndex += 1;
                }

                friend.zIndex && searched_friends.push( friend );
            });

            searched_friends.sort(function(x,y){
                return x.zIndex > x.zIndex ? 1 : -1;
            });

            showFriends( searched_friends );
        }
    }

    function showFriends(friends){
        var liStr = '';
        
        friends.forEach(function(friend){

            //对于没有设置头像的用户，手动补全相对随机头像地址
            friend.avatar = friend.avatar.replace(/(?=^\/)/,'https://coding.net');

            liStr += '<li name=' + friend.name + '><img src="' + friend.avatar + '"><span>' + friend.name + '</span></li>';
        });

        $('#friends_list').html( liStr || '<p class="nothing">没有找到相关用户</p>' );
    }

    function closeFriendsList(){
        $('html').removeClass('chose-friend');
        $('#pp_input').removeClass('chose-friend');
        window.history.back();
    }

    function openFriendList(){
        $('#friend_search').val('');
        showFriends(friends);
        $('html').addClass('chose-friend'); //小弹窗的时候朋友列表对 modal背景的影响，所以需要通知到全局 html
        $('#pp_input').removeClass('chose-location').addClass('chose-friend');

        //历史记录管控，在 DOM 操作完成后再操作历史记录，防止意外刷新
        addHistory('chose_friends');
    }
});

// 上传图片功能模块
Zepto(function(){
    var images = [];

    initialize();

    function initialize(){
        eventAndHandlers();
        setUploader();
    }

    function eventAndHandlers(){
        //删除图片
        $('#image_board').on('click','i.icon-delete',function(){
            removeImage( $(this).closest('.image') );
        });
    }

    function setUploader(){
        var image;
        var imageurl;

        uploaderPrepare( uploaderReady );

        function uploaderReady( Uploader ){
            new Uploader({
                target: $('#pp_image'),
                path: API_DOMAIN + '/api/tweet/insert_image',
                filefiled: 'tweetImg',
                start: start,
                uploading: uploading,
                success: success,
                failed: failed,
                appenddata: {},
                ajaxconfig: {
                    xhrFields: {
                        withCredentials: true
                    }
                }
            });
        }

        function start( url ){
            imageurl = '';
            image = $('<div class="image"><i class="icon icon-delete"></i></div>');
            $('#pp_image').before( image );
            if(url){
                imageurl = url;
                image.css('background-image', 'url(' + imageurl + ')');
            }
            image.addClass('upload-start');
        }

        function uploading( persent ){
            image.removeClass('upload-start').addClass('upload-ing');
        }

        function success( data ){
            typeof data == 'string' && ( data=JSON.parse(data) );

            if( !data.code ){
                if(!imageurl){
                    imageurl = data.data;
                    image.css('background-image', 'url(' + imageurl + ')');
                }
                image.attr('url', data.data);
                addImageToContent( data.data );
            }else{
                alert( data.msg || '上传失败' );
            }

            image.removeClass('upload-start').removeClass('upload-ing').addClass('upload-success');
        }

        function failed( err ){
            alert( err || '上传失败' );
            image.remove();
        }
    }

    function addImageToContent(url){
        images.push( url );
    }

    function removeImage(image){
        var url = $(image).attr('url');
        $(image).remove();
        removeImageToContent(url);
    }

    function removeImageToContent(url){
        var index = images.indexOf(url);
        images.splice(index,1);
    }

    function uploaderPrepare( success ){
        var script = $('<script>');

        //这里可能会有代码冗余
        script.on('load', function(){

            setTimeout(function(){
                if( window.rangoUploader ){
                    callSuccessOnce();
                }
            },0);
        });

        script.attr('src', '/scripts/rangoUploader.js').appendTo( $('body') );

        //这里可能会有代码冗余
        function callSuccessOnce(){
            success && success( window.rangoUploader );
            callSuccessOnce = function(){};
        }
    }
});

// 地理位置功能模块
Zepto(function(){
    var location = {};

    initialize();

    function initialize(){
        eventAndHandlers();
        setLocation();
    }

    function addHistory(state){
        // fucking html5 history api
        window.location.hash = '#' + state;
    }

    function eventAndHandlers(){

        //定位，展开关闭位置列表 切换，
        $('#pp_location').on('click','.icon-right',function(){
            $('#pp_input').removeClass('chose-friend').addClass('chose-location');
            addHistory('chose_location');
        });

        $('#cancel_location').on('click',function(){
            $('#pp_input').removeClass('chose-location');
            window.history.back();
        });
    }

    function setLocation(){
        var BAIDU_MAP_AK = 'mlGflW2HdV47hAFTsmxGvGrH'; //上线烦请换成 coding 的百度地图 ak
        var lo,la,
            fastAddress,
            locations = [],
            userRejected = false;

        init();

        function init(){

            //用户触发主动定位需求
            $('#pp_location').on('click',function(){
                if( !$(this).hasClass('show-location') ){
                    $(this).addClass('show-location');
                    getLocationByGPS();
                }
            });

            $('#location_list').on('click', 'li' ,function(){
                var name = $(this).attr('name');
                $('#location_name').html(name);
                $('#pp_input').removeClass('chose-location');
                setLocation( name );
            });
        }

        //通过 GPS 定位
        function getLocationByGPS(){
            if(navigator.geolocation){
                gettingLocation();
                navigator.geolocation.getCurrentPosition(function(position){
                    lo = position.coords.longitude;
                    la = position.coords.latitude;
                    showPosition();
                },function(error){
                    switch(error.code){
                        case error.PERMISSION_DENIED:
                          getLocationFailed();
                          break;
                        case error.POSITION_UNAVAILABLE:
                          break;
                        case error.TIMEOUT:
                          break;
                        case error.UNKNOWN_ERROR:
                          break;
                    }
                    getLocationByIP();
                });
                
                setTimeout(getLocationByIP,2000);
            }else{
                getLocationFailed();
            }
        }

        //通过 ip 定位候选方案，只要不是用户主动拒绝，但是因为其他原因获取失败的，一律采用候选方案
        function getLocationByIP(){

            //这段代码也只能执行一次
            getLocationByIP = function(){};

            if(userRejected) return;

            $.ajaxJSONP({
                url: API_DOMAIN + '/api/map/location/ip?callback=?',
                data: {
                    ak: BAIDU_MAP_AK
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function(data){
                    if(data.status) return;
                    var content = data.content;
                    lo = content.point.x;
                    la = content.point.y;
                    address = content.address_detail;
                    fastShowAddress();
                    showPosition();
                },
                error: function(err){
                }
            });
        }

        function fastShowAddress(){
            if(!fastAddress) return;
            $('#location_name').html( location.name );
            $('#pp_location').removeClass('getting').removeClass('failed').addClass('success');
        }

        //只要不是用户主动拒绝，此段代码都会强制执行一次
        function showPosition(){
            if(userRejected) return;

            //只此执行一次
            showPosition = function(){};

            getLocationImage();
            getLocationList();

            function getLocationImage(){
                var minX = +la - .001,
                    minY = +lo - .001,
                    maxX = +la + .001,
                    maxY = +lo + .001;
                var src = 'http://api.map.baidu.com/staticimage' + 
                          '?width=' + 620 +
                          '&heigth=' + 320 +
                          '&center=' + lo + ',' + la +
                          '&copyright=' + 1 +
                          '&bbox=' + minX + ',' + minY + ';' + maxX + ',' + maxY;
                $('#location_image').attr('src', src);
            }

            function getLocationList(){
                ['大厦','楼','餐厅','街','公园','学校'].forEach(getPOI);

                function getPOI( keyword ){
                    $.ajaxJSONP({
                        url: API_DOMAIN + '/api/map/place/v2/search?callback=?',
                        data: {
                            ak: BAIDU_MAP_AK,
                            query: keyword,
                            page_size: 10,
                            page_num: 0,
                            scope: 1,
                            location: la + ',' + lo,
                            radius: 2000,
                            output: 'json'
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function(data){
                            if(!data.status) return;
                            collectLocations( data.results );
                        },
                        error: function(err){
                        }
                    });
                }

                function collectLocations( lists ){
                    locations = locations.concat( lists );
                    locations.sort(function(x,y){
                        if( x == location ) return 1;
                        var Xdistance = Math.sqrt( Math.pow(x.location.lng - lo,2) + Math.pow(x.location.lat - la,2) );
                        var Ydistance = Math.sqrt( Math.pow(y.location.lng - lo,2) + Math.pow(y.location.lat - la,2) );
                        return Xdistance < Ydistance ? 1 : -1;
                    });
                    locations.length = 10;

                    //如果是第一次获取到地理位置
                    if( !location.name ){
                        location = locations[0];
                        getLocationSuccess();
                    }

                    listLocations();
                }
            }
        }

        function setLocation( name ){
            locations = locations.filter(function(loc){
                location = loc;
                if(loc.name === name) return false;
                return true;
            });
            locations.unshift( location );
            listLocations();
        }

        function listLocations(){
            var domStr = '';
            locations.forEach(function(location){
                domStr += '<li name="' + location.name + '">' + location.name + '</li>';
            });
            $('#location_list').html( domStr );
        }

        function getLocationFailed(){
            userRejected = true;
            $('#location_name').html('地理位置获取失败');
            $('#pp_location').removeClass('success').removeClass('getting').addClass('failed');
        }

        function gettingLocation(){
            $('#location_name').html('正在获取地理位置...');
            $('#pp_location').removeClass('success').removeClass('failed').addClass('getting');
        }

        function getLocationSuccess(){
            if( $('#pp_location').hasClass('success') ) return;
            $('#location_name').html( location.name );
            $('#pp_location').removeClass('getting').removeClass('failed').addClass('success');
        }
    }
});