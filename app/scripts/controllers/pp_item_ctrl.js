/**
 * Created by simonykq on 13/01/2015.
 */
var PP_ITEM_ROUTE = (function(){

    var user,
        tweet;

    function loadUser(user){

        var uri = '/api/user/key/' + user;

        $.ajax({
            url: uri,
            dataType: 'json',
            success: function(data){
                //TODO: change this back later to call with data;
                updateUser();
            },
            error: function(xhr, type){
                alert('Failed to load user' + user);
            }
        });
    }

    function loadTweet(tweet){

    }


    return {
        template_url: '/views/pp_item.html',
        context: ".container",
        before_enter: function(user,pp){

            $('title').text(user + '的冒泡');
            $('#page_name').text(user + '的冒泡');

            //add those extra items in nav menu
            $("#navigator").append( '<li class="nav-divider"></li>' +
                '<li><a href="/pp/hot' + '">热门</a></li>'
            );

        },
        on_enter: function(user,pp){
            //set up accordion
            $("#user-heading .panel-title").click(function(e){
                e.preventDefault();
                var ele = $('#user-details');
                if(ele.hasClass('in')){
                    ele.collapse('hide');
                }else{
                    ele.collapse('show');
                }
                return false;
            });

            loadUser(user);
            loadTweet(pp);
        },
        on_exit: function(){
            $('title').text('');
            $('#page_name').text('');
            $('#navigator > li').slice(-1).remove();
        }
    }
})();
