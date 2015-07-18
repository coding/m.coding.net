/**
 * Created by wenki on 18/07/2015.
 */
var ACTIVATE_ROUTE = (function(){

    return {
        template_url: '/views/activate.html',
        context: '.container',
        before_enter: function(){
            if (router.current_user) {
                location.href = '/';
            } 
        },
        on_enter: function(){
            var refreshCaptcha = function(){
                $('img.captcha').attr('src', API_DOMAIN + '/api/getCaptcha?code=' + Math.random());
            }

            var changeStyle = function (){
                var controls = new Array('email','captcha');

                var flag = true;
                for (var i = controls.length - 1; i >= 0; i--) {
                    var value = $.trim($('#' + controls[i]).val());
                    var elem = $('.label-' + controls[i]);
                    if (value == ''){
                        elem.css('color','#999999');
                        flag = false;
                    }else{
                        elem.css('color','#222222');
                    }
                };

                var elem_btn = $('.btn-activate');
                if (flag){
                    elem_btn.removeAttr('disabled');
                    elem_btn.css('color','#ffffff');
                }else{
                    elem_btn.attr('disabled','disabled');
                    elem_btn.css('color','rgba(255,255,255,0.5)');
                }
            }

            $('form.activate').submit(function(e) {
                e.preventDefault();

                var email = $.trim($("#email").val()),
                    j_captcha = $.trim($("#captcha").val());

                $.ajax({
                    url: API_DOMAIN + '/api/activate?email='+email+'&j_captcha='+j_captcha,
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            router.run.call(router, '/login');
                            alert(' 已经发送邮件。');
                        }
                        if (data.msg) {
                            refreshCaptcha();
                            for(var key in data.msg) {
                                alert(data.msg[key]);
                            }
                        }
                    },
                    error: function() {
                        alert('Failed to activate');
                    }
                });
            });

            $('#email').on('input',changeStyle);
            $('#captcha').on('input',changeStyle);
            $('img.captcha').on('click',refreshCaptcha);
        }
    }
})();
