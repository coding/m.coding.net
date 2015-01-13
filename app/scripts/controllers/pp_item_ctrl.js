/**
 * Created by simonykq on 13/01/2015.
 */
var PP_ITEM_ROUTE = (function(){
    return {
        template_url: '/views/pp_item.html',
        context: ".container",
        before_enter: function(user,pp){

            $('title').text('冒泡');
            $('#page_name').text('冒泡');

            //add those extra items in nav menu
            $("#navigator").append( '<li class="nav-divider"></li>' +
                '<li><a href="/pp/hot' + '">热门</a></li>'
            );

            ////add actions in pp page
            $('<div id="pp_actions" class="btn-group btn-group-justified" role="group" aria-label="...">' +
                '<div class="btn-group" role="group">' +
                    '<a class="btn btn-default glyphicon glyphicon-heart" data-toggle="modal" data-target="#pp_input"> 喜欢 </a>' +
                '</div>' +
            '</div>'
            ).insertAfter($('#bs-example-navbar-collapse-1'));


        },
        on_enter: function(user,pp){
            //
            ////decide if this is hot page
            //if(hot === 'hot'){
            //    sort = 'hot';
            //}else{
            //    sort = 'time';
            //}
            //
            //refresh();
            //
            //$('#load_more').on('click', function(e){
            //    e.preventDefault();
            //    loadMore('/api/tweet/public_tweets');
            //});
            //
            //$('#refresh').on('click', function(e){
            //    e.preventDefault();
            //    refresh();
            //});
            //
            //$('#pp_input').on('click', '#pp_submit', function(e){
            //    e.preventDefault();
            //
            //    var content = $('#pp_content'),
            //        btn     = $(this);
            //
            //    if(content.val() !== ''){
            //
            //        btn.attr('disabled', 'disabled');
            //
            //        $.post('/api/tweet', {content: content.val()}, function(data){
            //            //fail
            //            if(data.msg){
            //                for(var key in data.msg){
            //                    alert(data.msg[key]);
            //                }
            //            }
            //            //successful
            //            if(data.data){
            //                data.data['owner'] = {}; //current user
            //                var commentEle = createTweetDOM(data.data);
            //                list.prepend(commentEle);
            //
            //                content.val('');
            //                $('#pp_input').modal('hide');
            //            }
            //            btn.removeAttr('disabled');
            //        });
            //    }
            //
            //    return false
            //});
        },
        on_exit: function(){
            $('title').text('');
            $('#page_name').text('');
            $('#navigator > li').slice(-1).remove();
            $('#pp_actions').remove();
        }
    }
})();
