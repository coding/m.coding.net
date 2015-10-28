/**
 * Created by phy on 15-10-22.
 */

var FEEDBACK_ROUTE  = (function(){

        return {
        template_url: '/views/feedback.html',
        context: ".container",
        before_enter: function(){

            $('#navigator').find(".li-feedback").addClass('active');
            $('#navigator').find(".li-feedback img").attr('src','/images/icons/feedback_active.png');

        },
        on_enter: function(){

            $('#feedback_title').on('keyup', function(e){
                e.preventDefault();
                checkCouldSend();
            });

            $('#feedback_content').on('keyup', function(e){
                e.preventDefault();
                checkCouldSend();
            });

            $(window).on('message',function(event){
                event.data == 'checkModalCouldSend' && checkCouldSend();
            });


            //检查反馈内容的表格是否满足提交条件
            function checkCouldSend(){
                //反馈的标题和内容不能为空
                if( (($('#feedback_title').val() !== '') && ($('#feedback_content').val() !== '')) ){
                    $('#feedback_submit').removeAttr('disabled');
                }else{
                    $('#feedback_submit').attr('disabled', 'disabled');
                }

                //有图片正在上传，不能提交
                if( $('#image_board .upload-ing').length ){
                    $('#feedback_submit').attr('disabled', 'disabled');
                }

                //正在发送中，不能提交
                if( $('#feedback_input').hasClass('sending') ){
                    $('#feedback_submit').attr('disabled', 'disabled');
                }
            }

            //提交反馈
            $('#feedback_submit').off('click').on('click', function(){

                var title = $('#feedback_title').val().trim();
                var content = $('#feedback_content').val().trim();

                var images = '';
                $('#image_board > .image').each(function(){
                    var url = $(this).attr('url');
                    if(url){
                        images += '\n![图片](' + url + ')\n';
                    }
                });
                content += images;

                if(!content || !title){
                    return;
                }

                //附带反馈者的 UA 信息
                var ua = '\n> UA: ' + navigator.userAgent;
                content += ua;

                var data = {
                    type: 1,
                    title: title,
                    content: content,
                };


                var $inputModal = $('#feedback_modal_wrap');
                $inputModal.addClass('sending');
                $inputModal.find('#myModalLabel').html('发送中...');
                $('#feedback_submit').attr('disabled', 'disabled');

                $.ajax({

                    //反馈内容提交到 https://coding.net/u/guoguo/p/m.coding.net/git 项目里的讨论中
                    url: API_DOMAIN +  "/api/project/85767/topic",
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data){
                        if (data.code == 0){
                            $inputModal.find('#myModalLabel').html('意见反馈');
                            alert("反馈成功");
                        } else {
                            alert("反馈失败");
                        }

                    },
                    error: function() {
                        alert("反馈失败")
                    },
                    complete: function(){
                        router.run.call(router, '/user/projects')
                    }
                });
            });

            //插入上传图片模板所关联的代码
            $('<script>').attr('src', '/scripts/feedbackUploadImage.js').appendTo( $('body') );


        },
        on_exit: function(){

            $('#navigator').find('li').removeClass('active');
            $('#navigator').find(".li-feedback img").attr('src','/images/icons/feedback.png');

        }
    }

})();

