/**
 * Created by simonykq on 08/03/2015.
 */
var LOGIN_ROUTE = (function(){

    return {
        template_url: '/views/login.html',
        context: '.container',
        before_enter: function() {
            if (router.current_user) {
                location.href = '/';
            }
        },
        on_enter: function(){
            $.ajax({
                url: API_DOMAIN + '/api/captcha/login',
                dataType: 'json',
                success: function(data){
                    if(data.data){
                        var template = '<div class="form-group">' +
                                            '<div class="input-group">' +
                                                '<input type="text" class="form-control" name="j_captcha" placeholder="验证码">' +
                                                '<div class="input-group-addon" style="padding: 0">' +
                                                    '<img class="captcha" height="30" src="https://coding.net/api/getCaptcha">' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>',
                            captcha  = $(template);
                        $('div.checkbox').before(captcha);
                    }
                }
            });

            $('#login_form').submit(function(e){
                e.preventDefault();
                var $password =  $('input[name="password"]'),
                    hash = CryptoJS.SHA1($password.val());
                $password.val(hash);
                $.ajax({
                    url: API_DOMAIN + '/api/login',
                    type: 'POST',
                    dataType: 'json',
                    data: $(this).serialize(),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data,status,xhr){
                        //if login success
                        if(data.code === 0){
                            router.run.call(router, '/')
                        } else if (data.code === 3205) {
                            // 2fa
                            $("#login_form").hide();
                            $("#two_factor_auth_form").show();
                            return ;
                        }
                        if(data.msg){
                            for(var key in data.msg){
                                alert(data.msg[key]);
                            }
                        }
                    },
                    error: function(){
                        alert('Failed to login');
                    }
                });
            });

            $('#two_factor_auth_form').submit(function(e){
                e.preventDefault();
                $.ajax({
                    url: API_DOMAIN + '/api/check_two_factor_auth_code',
                    type: 'POST',
                    dataType: 'json',
                    data: $(this).serialize(),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data,status,xhr){
                        //if login success
                        if(data.code === 0){
                            router.run.call(router, '/')
                        }
                        if(data.msg){
                            for(var key in data.msg){
                                alert(data.msg[key]);
                            }
                        }
                    },
                    error: function(){
                        alert('Failed to login');
                    }
                });
            })
        }
    }

})();
