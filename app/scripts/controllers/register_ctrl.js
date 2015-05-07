/**
 * Created by jiong on 07/05/2015.
 */
var REGISTER_ROUTE = (function() {

    return {
        template_url: '/views/register.html',
        context: '.container',
        before_enter: function() {
            if (router.current_user) {
                location.href = '/';
            }
        },
        on_enter: function() {
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
                        $('input[name=global_key]').parent().after(captcha);
                    }
                }
            });

            $('form.register').submit(function(e) {
                e.preventDefault();

                $.ajax({
                    url: API_DOMAIN + '/api/register',
                    type: 'POST',
                    dataType: 'json',
                    data: $(this).serialize(),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data, status, xhr) {
                        if (data.data) {
                            router.run.call(router, '/');
                            alert(' 欢迎注册 Coding，请尽快去邮箱查收邮件并激活账号。如若在收件箱中未看到激活邮件，请留意一下垃圾邮件箱(T_T)。');
                        }
                        if (data.msg) {
                            for(var key in data.msg) {
                                alert(data.msg[key]);
                            }
                        }
                    },
                    error: function() {
                        alert('Failed to reigster');
                    }
                });
            })
        }
    }
})();
