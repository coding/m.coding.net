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
            $('#navigator').find("li:eq(1)").addClass('active');
        },
        on_enter: function(){

        },
        on_exit: function(){
            $('title').text('');
            $('#page_name').text('');
            $('#navigator').find('li').removeClass('active');
        }
    }

})();
