/**
 * Created by wenki on 18/07/2015.
 */
var ACTIVATE_ROUTE = (function(){

    function refreshCaptcha(){
        $('img.captcha').attr('src', API_DOMAIN + '/api/getCaptcha?code=' + Math.random());
    }

    function changeStyle(){
        var controls = new Array('email','captcha');
        if ($("#activate").length != 0){
            controls = new Array('password','confirm-password');
        }

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

    function userActivate(){
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

    function activate(email, key){
        $('form#activate #email').val(email);
        $('form#activate #email_hidden').val(email);
        $('form#activate #key').val(key);

        $.ajax({
            url: API_DOMAIN + '/api/beforeactivate?confirm_password=&email='+email+'&key='+key+'&password=',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                if (data.code == 1) {
                     router.run.call(router, '/');
                }
                if (data.msg) {
                    for(var key in data.msg) {
                        alert(data.msg[key]);
                    }
                }
            },
            error: function() {
                alert('Failed to beforeactivate');
            }
        });

        $('form#activate').submit(function(e) {
            e.preventDefault();

            var password = $('#password').val(),
                confirm_password = $('#confirm-password').val();
            var $password =  $('input[name="password"]'),
                $confirm_password = $('input[name="confirm_password"]'),
                    hash_password = CryptoJS.SHA1($password.val()),
                    hash_confirm_password = CryptoJS.SHA1($confirm_password.val());

                $password.val(hash_password);
                $confirm_password.val(hash_confirm_password);

            $.ajax({
                url: API_DOMAIN + '/api/activate',
                type: 'POST',
                dataType: 'json',
                data: $(this).serialize(),
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    if (data.code == 0) {
                        router.run.call(router, '/');
                    }

                    if (data.msg) {
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

        $('#password').on('input',changeStyle);
        $('#confirm-password').on('input',changeStyle);
    }

    function remove_template(){
        $('template').remove();
    }

    return {
        template_url: '/views/activate.html',
        context: '.container',
        before_enter: function(email, key){
            if (router.current_user) {
                location.href = '/';
            } 
        },
        on_enter: function(email, key){
            if (typeof email != 'undefined'){
                $('div.slogon').after($('#activate-template').html());
                remove_template();
                activate(email,key);
            }else{
                var html = $('#user-activate-template').html();
                $('div.slogon').after(html);
                remove_template();
                userActivate();
            }
        }
    }
})();
