/**
 * Created by jiong on 15/5/6.
 */
$(function () {

    //play video
    //video modal
    videojs.options.flash.swf = "/static/video-js.swf"
    var modal = $('.modal');
    var videoWidth = Math.floor($(window).width() * 0.8);
    var videoHeight = Math.floor(videoWidth/16*9);
    var coding_video = null;

    var playVideo = function(){
        setTimeout(function(){
            coding_video && coding_video.play();
        },300);
    };

    var stopVideo = function(){
        coding_video && coding_video.pause();
    };

    videojs('coding-video', {width: videoWidth, height: videoHeight}, function(){
        coding_video = this;
        $('#coding-video').css('margin', 'auto');
        if(location.hash.indexOf('#video')>=0){
            modal.css({'visibility': 'visible'}).fadeIn();
            playVideo();
        }
    });

    var play = $('.play-video').on('click', function(){
        modal.css({'visibility': 'visible'}).fadeIn();
        playVideo();
    });

    modal.on('click', 'a.close', function(){
        $(this).parent().fadeOut();
        stopVideo();
    });

    //press esc to close video
    $(window).on('keyup', function(event){
        if(event.keyCode === 27 && modal.is(':visible')){
            modal.fadeOut();
            stopVideo();
        }
    });
});
