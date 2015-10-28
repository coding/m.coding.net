/**
 * Created by phy on 15-10-23.
 */
//上传图片模块
Zepto(function(){
    var images = {};
    var uploader;

    initialize();

    function initialize(){
        eventAndHandlers();
        setUploader();
    }

    function eventAndHandlers(){
        //删除图片
        $('#image_board').off('click').on('click','i.icon-delete',function(){
            removeImage( $(this).closest('.image[key]').attr('key') );
        });
    }

    function setUploader(){
        uploaderPrepare( uploaderReady );

        function uploaderReady( Uploader ){
            uploader = new Uploader({
                target: $('#feedback_image'),
                path: API_DOMAIN + '/api/tweet/insert_image',
                filefiled: 'tweetImg',
                multiple: true,
                multipleSize: 6,
                start: start,
                uploading: uploading,
                success: success,
                failed: failed,
                appenddata: {},
                ajaxconfig: {
                    xhrFields: {
                        withCredentials: true
                    }
                }
            });
        }

        function start( url, key ){
            uploader.multipleSize --;
            var imageurl = '';
            var image = $('<div class="image"><i class="icon icon-delete"></i></div>');

            if(url){
                imageurl = url;
                image.css('background-image', 'url(' + imageurl + ')');
            }
            image.addClass('upload-start').attr('key', key);

            $('#feedback_image').before( image );

            images[key] = {
                imageurl: imageurl,
                image: image
            }
        }

        function uploading( persent, key ){
            images[key]['image'].removeClass('upload-start').addClass('upload-ing');
            window.postMessage('checkModalCouldSend','*');
        }

        function success( data, key ){
            typeof data == 'string' && ( data=JSON.parse(data) );

            if( !data.code ){
                if(!images[key]['imageurl']){
                    images[key]['imageurl'] = data.data;
                    images[key]['image'].css('background-image', 'url(' + imageurl + ')');
                }
                images[key]['image'].attr('url', data.data);

                images[key]['image'].removeClass('upload-start').removeClass('upload-ing').addClass('upload-success');
                window.postMessage('checkModalCouldSend','*');
            }else{
                failed( '上传失败', key );
            }
        }

        function failed( err, key ){
            alert( err || '上传失败' );
            removeImage(key);
        }
    }

    function removeImage(key){
        if(!images[key]) return;
        uploader.multipleSize ++;
        images[key]['image'].remove();
        window.postMessage('checkModalCouldSend','*');
        delete images[key];
    }

    function uploaderPrepare( success ){
        if(window.rangoUploader){
            callSuccessOnce();
            return;
        }

        var script = $('<script>');
        script.on('load', function(){
            setTimeout(function(){
                if( window.rangoUploader ){
                    callSuccessOnce();
                }
            },0);
        });

        script.attr('src', '/scripts/rangoUploader.js').appendTo( $('body') );

        function callSuccessOnce(){
            success && success( window.rangoUploader );
            callSuccessOnce = function(){};
        }
    }
});

