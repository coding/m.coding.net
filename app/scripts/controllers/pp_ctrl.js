/**
 * Created by simonykq on 21/12/2014.
 */
var PP_ROUTE  = (function(){

    var last_id  = 99999999,
        sort     = 'time',
        list     = null,
        elements = [],
        path     = '/api/tweet/public_tweets';

    function assembleDOM(data){
        var data = data || {"code":0,"data":[]};

        var pps       = data.data,
            fragment  = document.createDocumentFragment(),
            ele;

        list = document.getElementById('pp_list');

        for (var i = 0; i < pps.length; i++) {
            ele = createTweetDOM(pps[i]);

            elements.push(ele);
            fragment.appendChild(ele[0]);
        }

        list.appendChild(fragment);
    }

    function createTweetDOM(pp){
        var template = '<div class="detailBox">' +
                            '<div class="titleBox">' +
                                '<div class="commenterImage">' +
                                    '<a href="#"><img src="#" height="30" width="30" /></a>' +
                                '</div>' +
                                '<a class="commenterName" href="#"><label></label></a>' +
                                <!--this would only be shown if this comment belongs to current user-->
                                '<a class="close" aria-label="Close"><span aria-hidden="true">&times;</span></a>' +
                                '<a href="#" class="pull-right star">' +
                                    '<span class="glyphicon glyphicon-heart"></span>' +
                                '</a>' +
                                '<a href="#" class="pull-right comment">' +
                                    '<span class="glyphicon glyphicon-comment"></span>' +
                                '</a>' +
                            '</div>' +
                            '<div class="commentBox">' +
                                '<p class="taskDescription"></p>' +
                            '</div>' +
                            '<div class="actionBox">' +
                                '<ul class="commentList">' +
                                '</ul>' +
                                '<form class="form-inline" role="form">' +
                                     '<div class="input-group">' +
                                        '<input type="text" class="form-control" placeholder="在此输入评论内容">' +
                                        '<span class="input-group-btn">' +
                                            '<button class="btn btn-default" type="button"><span class="glyphicon glyphicon-arrow-right"></span></button>' +
                                        '</span>' +
                                    '</div>' +
                                '</form>' +
                            '</div>' +
                        '</div>',
            ele = $(template);

        ele.attr('id', pp.id);

        var owner_name = pp.owner.name;
        ele.find('.titleBox > .commenterImage > a').attr('href', '/u/' + owner_name);
        ele.find('.titleBox > .commenterImage > a > img').attr('src', pp.owner.avatar);
        ele.find('.titleBox > a.commenterName').attr('href', '/u/' + owner_name);
        ele.find('.titleBox > a.commenterName > label').text(owner_name);

        ele.find('.titleBox > a.star > span').text(pp.likes);
        if(pp.liked){
            ele.find('.titleBox > a.star > span').css('color','#D95C5C');
        }
        ele.find('.titleBox > a.comment').attr('href', '/u/' + owner_name + '/pp/' + pp.id);
        ele.find('.titleBox > a.comment > span').text(pp.comments);

        ele.find('.commentBox > .taskDescription').html(pp.content);

        var comments = pp.comment_list,
            fragment = document.createDocumentFragment(),
            commentEle;

        for(var j = 0; j < comments.length; j++){
            commentEle = createCommentDOM(comments[j]);
            fragment.appendChild(commentEle[0]);
        }

        ele.find('.actionBox > .commentList')[0].appendChild(fragment);


        return ele;
    }

    function createCommentDOM(comment){
        var template = '<li>' +
                            '<div class="commenterImage">' +
                                 '<a href="#"><img src="#" /></a>' +
                            '</div>' +
                            '<a class="commenterName" href="#"><span class="comment-meta"></span></a>' +
                            '<div class="commentText">' +
                                '<p></p>' +
                                '<span class="date sub-text"></span>' +
                                '<a href="#" class="comment-hash">回复</a>' +
                            '</div>' +
                        '</li>',
            ele  = $(template);

        var owner_name = comment.owner.name;

        ele.find('.commenterImage > a').attr('href', '/u/' + owner_name);
        ele.find('.commenterImage img').attr('src', comment.owner.avatar);
        ele.find('a.commenterName').attr('href', '/u/' + owner_name);
        ele.find('a.commenterName > span').text(owner_name);
        ele.find('.commentText > p').html(comment.content);
        ele.find('.commentText > .date').text("on March 5th, 2014");
        ele.find('.commentText > a').attr('id', comment.owner_id);

        return ele
    }

    function showAll(){
        var fragment = document.createDocumentFragment(),
            list     = document.getElementById('pp_list'),
            ele;
        for (var i = 0; i < elements.length; i++) {
            ele = elements[i];

            fragment.appendChild(ele[0]);
        }
        list.appendChild(fragment)
    }

    function refresh(){

        elements = [];
        last_id  = 99999999;
        //remove all existing elements in DOM
        $('#pp_list > .detailBox').remove();
        loadMore(path);
    }

    function loadMore(path){

        var loadMoreBtn = $('#load_more'),
            refreshBtn  = $('#refresh');

        loadMoreBtn.html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 读取中...');
        refreshBtn.children('span').addClass('glyphicon-refresh-animate');

        path += '?last_id=' + last_id + '&' + 'sort=' + sort;

        $.ajax({
            url: path,
            dataType: 'json',
            success: function(data){
                assembleDOM(data);
                last_id = data.data[data.data.length - 1]['id']; //id of last item in list
            },
            error: function(xhr, type){
                alert('Failed to load pp');
            },
            complete: function(){
                loadMoreBtn.text('更多泡泡');
                refreshBtn.children('span').removeClass('glyphicon-refresh-animate');
            }
        });
    }

    return {
        template_url: '/views/pp.html',
        context: ".container",
        before_enter: function(){
            $('title').text('冒泡');
            $('#page_name').text('冒泡');

            //add those extra items in nav menu
            $("#navigator").append( '<li class="nav-divider"></li>' +
            '<li><a href="/pp/hot' + '">热门</a></li>'
            );

            //add actions in pp page
            $(
            '<div id="pp_actions" class="btn-group btn-group-justified" role="group" aria-label="...">' +
                '<div class="btn-group" role="group">' +
                    '<a class="btn btn-default glyphicon glyphicon-edit"> 来，冒个泡吧！ </a>' +
                '</div>' +
                '<div class="btn-group" role="group">' +
                    '<a class="btn btn-default glyphicon glyphicon glyphicon-camera"> 发图片 </a>' +
                '</div>' +
                //'<div class="btn-group" role="group">' +
                //   '<a class="btn btn-default glyphicon glyphicon-eye-open"> 发代码 </a>' +
                //'</div>' +
            '</div>'
            ).insertAfter($('#bs-example-navbar-collapse-1'));

            //active this page link
            $('#navigator').find("li:eq(1)").addClass('active');
        },
        on_enter: function(){

            if(elements.length === 0){
                loadMore(path);
            }else{
                showAll();
            }

            $('#load_more').on('click', function(e){
                e.preventDefault();
                loadMore(path);
            });

            $('#refresh').on('click', function(e){
                e.preventDefault();
                refresh();
            });
        },
        on_exit: function(){
            $('title').text('');
            $('#page_name').text('');

            $('#navigator > li').slice(-1).remove();
            $('#pp_actions').remove();
            $('#navigator').find('li').removeClass('active');
        }
    }

})();
