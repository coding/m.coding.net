/**
 * Created by jiong on 07/05/2015.
 */
var REGISTER_ROUTE = (function() {

    function refreshCaptcha(){
         $.ajax({
            url: API_DOMAIN + '/api/captcha/register',
            dataType: 'json',
            success: function(data){
                if(data.data){
                    if (!addCaptcha()){
                        $('img.captcha').attr('src', API_DOMAIN + '/api/getCaptcha?code=' + Math.random());
                    }
                }else{
                    $('#div-captcha').remove();
                }
            }
        });
    }

    function changeStyle(){
        var controls = new Array('email','global_key');
        if ($('#captcha').length === 1){
            controls.push('captcha');
        }
        var flag = true;
        for (var i = controls.length - 1; i >= 0; i--) {
            var value = $.trim($('#' + controls[i]).val());
            if (value == ''){
                flag = false;
            }
        };

        var elem_btn = $('.btn-register');
        if (flag){
            elem_btn.removeAttr('disabled');
            elem_btn.css('color','#ffffff');
        }else{
            elem_btn.attr('disabled','disabled');
            elem_btn.css('color','rgba(255,255,255,0.5)');
        }
    }

    function addCaptcha(){
        var captcha = $('#captcha');
        if (captcha.length === 1){
            return false;
        }

        var template = '<div class="form-group" id="div-captcha">' +
                            '<input type="text" class="form-control input-right" name="j_captcha" id="captcha" placeholder="验证码">' +
                            '<span class="btn-clear x-j_captcha">&nbsp;</span>' +
                            '<img class="captcha" height="30" src="https://coding.net/api/getCaptcha">' +
                        '</div>',
        captchaHtml = $(template);
        $('button.btn-register').before(captchaHtml);
        $('img.captcha').on('click',refreshCaptcha);
        $('#captcha').on('input',changeStyle);
        bindClearInput('j_captcha');

        var elem_btn = $('.btn-register');
        elem_btn.attr('disabled','disabled');
        elem_btn.css('color','rgba(255,255,255,0.5)');
        return true;
    }

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
                url: API_DOMAIN + '/api/captcha/register',
                dataType: 'json',
                success: function(data){
                    if(data.data){
                        addCaptcha();
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
                            return;
                        }

                        refreshCaptcha();

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
            });

            $('#email').on('input',changeStyle);
            $('#global_key').on('input',changeStyle);
            bindClearInput('email');
            bindClearInput('global_key');
        }
    }
})();
