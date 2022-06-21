$(function(){
    if ($('.retaimer').length) {
        retimer();
        setInterval(retimer, 500);
    }

    // $('.retaimer').each(function() {
        // retimer();
        // setInterval(retimer, 500);
    // });

    if ($('.slider_block').length) {
        slideFlag['slider'] = false;
        slidePointer['slider'] = 0;
        setInterval(function(){
            sliderRun('slider', 'toleft');
        }, 2000);
        /*
        $('.slider .to_left').click(function(){
            sliderRun('slider', 'toleft');
        });
        $('.slider .to_right').click(function(){
            sliderRun('slider', 'toright');
        });
        */
    }
}); 