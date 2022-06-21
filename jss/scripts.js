// // let slideFlag = {};
// // let slidePointer = {};

// function retimer() {
//     let limit = new Date($('.retaimer').data('fordate'));
//     let now = new Date();
//     let delta = Math.floor((limit.getTime() - now.getTime()) / 1000);
//     if (delta < 0) delta = 0;
//     let sec = delta % 60;
//     $('.retaimer .num').eq(3).html(`${addChar(sec)}<span class="subnum">${multiple(sec, ['секунда', 'секунды', 'секунд'])}</span>`);
//     delta = Math.floor(delta / 60);
//     let minute = delta % 60;
//     $('.retaimer .num').eq(2).html(`${addChar(minute)}<span class="subnum">${multiple(minute, ['минута', 'минуты', 'минут'])}</span>`);
//     delta = Math.floor(delta / 60);
//     let hour = delta % 24;
//     $('.retaimer .num').eq(1).html(`${addChar(hour)}<span class="subnum">${multiple(hour, ['час', 'часа', 'часов'])}</span>`);
//     delta = Math.floor(delta / 24);
//     $('.retaimer .num').eq(0).html(`${delta}<span class="subnum">${multiple(delta, ['день', 'дня', 'дней'])}</span>`);
// }

// function addChar(c) {
//     c += '';
//     if (c.length < 2) {
//         c = '0' + c;
//     }
//     return c;
// }

// function multiple(num, words) {
//     num = num % 100;
//     if (Math.floor(num / 10) != 1) {
//         if (num % 10 == 1) {
//             return words[0];
//         } else if ((num % 10 > 1) && (num % 10 < 5)) {
//             return words[1];
//         }
//     }
//     return words[2];
// }

// function sliderRun(slideclass, direction) {
//     if (slideFlag[slideclass]) return;
//     slideFlag[slideclass] = true;
//     let selector = '.' + slideclass + '_block';
//     let width = $(selector + '.active').width();
//     let next, anim;
//     if (direction == 'toright') {
//         next = slidePointer[slideclass] - 1;
//         if (next < 0) next += $(selector).length;
//         anim = '+=' + width;
//         width = -width;
//     } else {
//         next = slidePointer[slideclass] + 1;
//         if (next > $(selector).length - 1) next -= $(selector).length;
//         anim = '-=' + width;
//     }
//     slidePointer[slideclass] = next;
//     $(selector + '.active').addClass('eliminate');
//     $(selector).eq(next).css('left', width + 'px').addClass('active');
//     $(selector + '.active').animate({left: anim}, 1000, function() {
//         $(selector + '.eliminate').removeClass('active').removeClass('eliminate');
//         slideFlag[slideclass] = false;
//     });
// } 
let slideFlag = {};
let slidePointer = {};
let galFlag = false;
const russMonth = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

function retimer() {
    let limit = new Date($('.retaimer').data('fordate'));
    let now = new Date();
    let delta = Math.floor((limit.getTime() - now.getTime()) / 1000);
    if (delta < 0) delta = 0;
    let sec = delta % 60;
    $('.retaimer .num').eq(3).html(`${addChar(sec)}<span class="subnum">${multiple(sec, ['секунда', 'секунды', 'секунд'])}</span>`);
    delta = Math.floor(delta / 60);
    let minute = delta % 60;
    $('.retaimer .num').eq(2).html(`${addChar(minute)}<span class="subnum">${multiple(minute, ['минута', 'минуты', 'минут'])}</span>`);
    delta = Math.floor(delta / 60);
    let hour = delta % 24;
    $('.retaimer .num').eq(1).html(`${addChar(hour)}<span class="subnum">${multiple(hour, ['час', 'часа', 'часов'])}</span>`);
    delta = Math.floor(delta / 24);
    $('.retaimer .num').eq(0).html(`${delta}<span class="subnum">${multiple(delta, ['день', 'дня', 'дней'])}</span>`);
}

function addChar(c) {
    c += '';
    if (c.length < 2) {
        c = '0' + c;
    }
    return c;
}

function multiple(num, words) {
    num = num % 100;
    if (Math.floor(num / 10) != 1) {
        if (num % 10 == 1) {
            return words[0];
        } else if ((num % 10 > 1) && (num % 10 < 5)) {
            return words[1];
        }
    }
    return words[2];
}

function sliderRun(slideclass, direction) {
    if (slideFlag[slideclass]) return;
    slideFlag[slideclass] = true;
    let selector = '.' + slideclass + '_block';
    let width = $(selector + '.active').width();
    let next, anim;
    if (direction == 'toright') {
        next = slidePointer[slideclass] - 1;
        if (next < 0) next += $(selector).length;
        anim = '+=' + width;
        width = -width;
    } else if (direction == 'toleft') {
        next = slidePointer[slideclass] + 1;
        if (next > $(selector).length - 1) next -= $(selector).length;
        anim = '-=' + width;
    } else {
        next = direction;
        anim = '-=' + width;
    }
    slidePointer[slideclass] = next;
    $(selector + '.active').addClass('eliminate');
    $(selector).eq(next).css('left', width + 'px').addClass('active');
    $(selector + '.active').animate({left: anim}, 1000, function() {
        $(selector + '.eliminate').removeClass('active').removeClass('eliminate');
        $('.slider_points span').removeClass('active').eq(next).addClass('active');
        slideFlag[slideclass] = false;
    });
}