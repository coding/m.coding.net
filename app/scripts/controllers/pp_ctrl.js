/**
 * Created by simonykq on 21/12/2014.
 */
var PP_ROUTE  = (function(){

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
