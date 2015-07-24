function bindClearInput(name){
    var $input = $('input[name="' + name +'"]');

    $input.on('focus input',function(){
        var span = $(this).next('span')[0];
        if ($(this).val()  != ''){
            if ($(span).css('display') == 'none'){
                $(span).show();
                $(span).one('click',function(){
                    var input = $(this).prev("input")[0];
                    $(input).val('');
                    $(input).trigger('focus');
                    $(this).hide();
                });
            }
        }else{
            $(span).hide();
        }
    });
}