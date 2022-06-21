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
//     } else if (direction == 'toleft') {
//         next = slidePointer[slideclass] + 1;
//         if (next > $(selector).length - 1) next -= $(selector).length;
//         anim = '-=' + width;
//     } else {
//         next = direction;
//         anim = '-=' + width;
//     }
//     slidePointer[slideclass] = next;
//     $(selector + '.active').addClass('eliminate');
//     $(selector).eq(next).css('left', width + 'px').addClass('active');
//     $(selector + '.active').animate({left: anim}, 1000, function() {
//         $(selector + '.eliminate').removeClass('active').removeClass('eliminate');
//         $('.slider_points span').removeClass('active').eq(next).addClass('active');
//         slideFlag[slideclass] = false;
//     });
// }

function lightbox(aim) {
    let src = $(aim).attr('src').split('/');
    src = src[0] + '/big_' + src[1];
    let w = document.documentElement.clientWidth - 64;
    let h = document.documentElement.clientHeight - 64;
    let sides = aim.clientWidth / aim.clientHeight;
    if (w > sides * h) {
        w = sides * h;
    } else if (w < sides * h) {
        h = Math.floor(w / sides);
    }
    let topfix = h / 2 + 16;
    let leftfix = w / 2 + 16;
    hlpstr = '<div class="lightbox" style="margin-left:-' + leftfix + 'px;margin-top:-' + topfix + 'px;"><button type="button">&times;</button><img src="' + src + '" style="width:' + w + 'px;height:' + h + 'px;"></div>';
    $('body').append('<div class="screen"></div>');
    $('body').append(hlpstr);
    $('.lightbox button, .screen').click(function(){
        $('.lightbox').animate({opacity:0}, 500, function(){
            $('.lightbox').remove();
            $('.screen').remove();
        });
    });
    $('.lightbox').animate({opacity:1}, 500);
}

function galSlide(direction) {
    if (galFlag) return;
    galFlag = true;
    let hlpstr = parseInt($('.rail').css('left'));
    if (direction == 'left') {
        hlpstr -= 60;
    } else {
        hlpstr += 60;
    }
    $('.rail').animate({
        left: hlpstr
    }, 500, function(){
        let l = parseInt($('.rail').css('left'));
        if (l == 0) {
            $('.gal_right').addClass('disabled');
        } else {
            $('.gal_right').removeClass('disabled');
        }
        if ($('.rail').width() + l == 410) {
            $('.gal_left').addClass('disabled');
        } else {
            $('.gal_left').removeClass('disabled');
        }
        galFlag = false;
    });
}

function writeTable() {
    if (!tovardata.length) {
        $('.table, .form').remove();
        $('h1').after('<div class="empty">Ваша корзина пуста!</div>');
        return;
    }
    let tab = $('.table');
    let hlpstr = '<div class="tr top"><div class="id">№</div><div class="name">Наименование</div><div class="price">Цена</div><div class="quantity">Количество</div><div class="summa">Сумма</div><div class="delete"></div></div>';
    let sum = 0;
    for (item of tovardata) {
        sum += (item.qty * item.price);
        hlpstr += '<div class="tr"><div class="id" id="tovar_' + item.id + '">1</div><div class="name">' + item.name + '</div><div class="price">' + item.price + '</div><div class="quantity"><button type="button">&minus;</button><span class="number">' + item.qty + '</span><button type="button">&plus;</button></div><div class="summa">' + (item.qty * item.price) + '</div><div class="delete"><button type="button">&times;</button></div></div>';
    }
    hlpstr += '<div class="tr bottom"><div class="text">Итого:</div><div class="itog">' + sum + '</div></div>';
    tab.html(hlpstr);
}

function removeTovar(id) {
    for (let i = 0; i < tovardata.length; i++) {
        if (tovardata[i].id == id) {
            tovardata.splice(i, 1);
            return true;
        }
    }
    return false;
}

function getCurrency1() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.cbr-xml-daily.ru/daily_json.js');
    xhr.onreadystatechange = function() {
        if ((xhr.readyState == 4) && (xhr.status == 200)) {
            $('#currency1').html(JSON.parse(xhr.response).Valute.USD.Value.toFixed(2) + ' рублей за доллар');
        }
    };
    xhr.send();
}

function getCurrency2() {
    $.get('https://www.cbr-xml-daily.ru/daily_json.js', function(response){
        $('#currency2').html(JSON.parse(response).Valute.EUR.Value.toFixed(2) + ' рублей за евро');
    });
}

function getCurrency3() {
    fetch("https://www.cbr-xml-daily.ru/daily_json.js").then(response => response.json()).then(response => $('#currency3').html(response.Valute.CNY.Value.toFixed(2) + ' рублей за юань'));
}

function formValidate(form) {
    let name = $('#name').val();
    if (!name) {
        alert('Не заполнено имя!');
        return false;
    }
    let phone = $('#phone').val();
    if (!phone.match(/^((\+7)|(8))?\s?\(?\d{3}\)?\s?\d{3}\-?\d{2}\-?\d{2}$/)) {
        alert('Не заполнен номер телефона!');
        return false;
    }
    let mail = $('#mail').val();
    if (!mail.match(/^.+@.+\..+$/)) {
        alert('Не заполнен адрес почты!');
        return false;
    }
    let date = $('#date').val();
    if (!date.match(/^\d{2}\-\d{2}\-\d{4}$/)) {
        alert('Не выбрана дата!');
        return false;
    }
    let comment = $('#comment').val();
    let formData = {
        name,
        phone,
        mail,
        date,
        comment
    }
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        data: formData,
        method: 'POST',
        success: function(response) {
            makeAlert(response);
        }
    });
}

function makeAlert(response) {
    let hlpstr = '<div class="alertbox"><button type="button">&times;</button><p>Ваш заказ оформлен под номером ' + response.id + '.</p></div>';
    $('body').append('<div class="screen"></div>');
    $('body').append(hlpstr);
    $('.alertbox button, .screen').click(function(){
        $('.alertbox').animate({opacity:0}, 500, function(){
            location.reload(true);
        });
    });
    $('.alertbox').animate({opacity:1}, 500);
}

// function makeCalendar(fieldDate) {
//     let hlpdate = new Date();
//     let curyear, curmonth, curday;
//     if (fieldDate.match(/^\d{2}\-\d{2}\-\d{4}$/)) {
//         [curday, curmonth, curyear] = fieldDate.split('-');
//         curmonth--;
//         hlpdate = new Date(curyear, curmonth, curday);
//     }
//     curyear = hlpdate.getFullYear();
//     curmonth = hlpdate.getMonth();
//     curday = hlpdate.getDate();
//     /*


//     if (fieldDate.match(/^\d{2}\-\d{2}\-\d{4}$/)) {
//         [curday, curmonth, curyear] = fieldDate.split('-');
//         curmonth--;
//         if ((curday < 1) || (curmonth < 0) || (curyear < 2020) || (curmonth > 11) || (curyear > 2023) || (curday > 31) || ((curmonth in [3, 5, 8, 10]) && (curday > 30)) || ((curmonth == 1) && ((curyear % 400 == 0) || ((curyear % 4 == 0) && (curyear % 100 != 0))) && (curday > 29)) || ((curmonth == 1) && (curday > 28))) {
//             curyear = now.getFullYear();
//             curmonth = now.getMonth();
//             curday = now.getDate();
//         }
//     }
//     */
//     hlpdate = new Date(curyear, curmonth);
//     let prevdays = ((hlpdate.getDay() + 6) % 7); // пн - 0, вт - 1 ... сб - 5, вс - 6
//     hlpdate = new Date(curyear, curmonth + 1, 0);
//     let lastday = hlpdate.getDate() + prevdays; // последний день месяца + дни до начала месяца
//     let weeks = Math.ceil(lastday / 7);
//     let hlpstr = '<div class="dp_header"><span class="bigprev"><<</span><span class="prev"><</span><strong>' + russMonth[curmonth] + ' ' + curyear + '</strong><span class="next">></span><span class="bignext">>></span></div>';
//     hlpstr += '<div class="dp_grid"><span class="headday">Пн</span><span class="headday">Вт</span><span class="headday">Ср</span><span class="headday">Чт</span><span class="headday">Пт</span><span class="headday holiday">Сб</span><span class="headday holiday">Вс</span>';
//     for (let i = 0; i < weeks * 7; i++) {
//         if ((i >= prevdays) && (i < lastday)) {
//             let getdate = addChar(i - prevdays + 1) + '-' + addChar(curmonth + 1) + '-' + curyear;
//             hlpstr += '<span class="getter';
//             if ((i % 7 == 5) || (i % 7 == 6)) hlpstr += ' holiday';
//             hlpstr += '" data-get="' + getdate + '">' + (i - prevdays + 1) + '</span>';
//         } else {
//             hlpstr += '<span class="empty"></span>';
//         }
//     }
//     hlpstr += '</div>';
//     $('#calendar').html(hlpstr);
//     $('#calendar .prev').click(function(){
//         makeCalendar(`01-${addChar(curmonth)}-${curyear}`);
//     })
//     $('#calendar .next').click(function(){
//         makeCalendar(`01-${addChar(curmonth + 2)}-${curyear}`);
//     })
//     $('#calendar .bigprev').click(function(){
//         makeCalendar(`01-${addChar(curmonth + 1)}-${curyear - 1}`);
//     })
//     $('#calendar .bignext').click(function(){
//         makeCalendar(`01-${addChar(curmonth + 1)}-${curyear + 1}`);
//     })
//     $('#calendar .getter').click(function(){
//         $('#date').val(this.dataset.get);
//         $('.calendarbox').animate({opacity:0}, 500, function(){
//             $('.calendarbox').remove();
//             $('.screen').remove();
//         });
//     });
// }

function getCalendar(fieldDate) {
    if ($('.calendarbox').length) return;
    $('body').append('<div class="screen"></div>');
    $('body').append('<div class="calendarbox"><div id="calendar"></div></div>');
    $('.screen').click(function(){
        $('.calendarbox').animate({opacity:0}, 500, function(){
            $('.calendarbox').remove();
            $('.screen').remove();
        });
    });
    makeCalendar(fieldDate);
    $('.calendarbox').animate({opacity:1}, 500);
}

function addTovar(tovar){
    let basket = JSON.parse(localStorage.getItem('addTovar'));
    let flag = false;
    if (basket) {
        for (let i of basket) {
            if (i.id = tovar.id) {
                i.qty += tovar.qty;
                flag = true;
            }
        }
        if (!flag) basket.push(tovar);
    } else {
        basket = [tovar];
    }
    localStorage.setItem('addTovar', JSON.stringify(basket));
}
// cлайдер
const WRAPPER_SELECTOR = '.slider__wrapper';
const ITEMS_SELECTOR = '.slider__items';
const ITEM_SELECTOR = '.slider__item';
const CONTROL_CLASS = 'slider__control';
const SELECTOR_PREV = '.slider__control[data-slide="prev"]';
const SELECTOR_NEXT = '.slider__control[data-slide="next"]';
const SELECTOR_INDICATOR = '.slider__indicators>li';
const SLIDER_TRANSITION_OFF = 'slider_disable-transition';
const CLASS_CONTROL_HIDE = 'slider__control_hide';
const CLASS_ITEM_ACTIVE = 'slider__item_active';
const CLASS_INDICATOR_ACTIVE = 'active';

class ChiefSlider {
  constructor(selector, config) {
    // элементы слайдера
    const $root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this._$root = $root;
    this._$wrapper = $root.querySelector(WRAPPER_SELECTOR);
    this._$items = $root.querySelector(ITEMS_SELECTOR);
    this._$itemList = $root.querySelectorAll(ITEM_SELECTOR);
    this._$controlPrev = $root.querySelector(SELECTOR_PREV);
    this._$controlNext = $root.querySelector(SELECTOR_NEXT);
    this._$indicatorList = $root.querySelectorAll(SELECTOR_INDICATOR);
    // экстремальные значения слайдов
    this._minOrder = 0;
    this._maxOrder = 0;
    this._$itemWithMinOrder = null;
    this._$itemWithMaxOrder = null;
    this._minTranslate = 0;
    this._maxTranslate = 0;
    // направление смены слайдов (по умолчанию)
    this._direction = 'next';
    // determines whether the position of item needs to be determined
    this._balancingItemsFlag = false;
    this._activeItems = [];
    // текущее значение трансформации
    this._transform = 0;
    // swipe параметры
    this._hasSwipeState = false;
    this.__swipeStartPos = 0;
    // slider properties
    this._transform = 0; // текущее значение трансформации
    this._intervalId = null;
    // configuration of the slider
    this._config = {
      loop: true,
      autoplay: false,
      interval: 5000,
      refresh: true,
      swipe: true,
    };
    this._config = Object.assign(this._config, config);
    // create some constants
    const $itemList = this._$itemList;
    const widthItem = $itemList[0].offsetWidth;
    const widthWrapper = this._$wrapper.offsetWidth;
    const itemsInVisibleArea = Math.round(widthWrapper / widthItem);
    // initial setting properties
    this._widthItem = widthItem;
    this._widthWrapper = widthWrapper;
    this._itemsInVisibleArea = itemsInVisibleArea;
    this._transformStep = 100 / itemsInVisibleArea;
    // initial setting order and translate items
    for (let i = 0, length = $itemList.length; i < length; i++) {
      $itemList[i].dataset.index = i;
      $itemList[i].dataset.order = i;
      $itemList[i].dataset.translate = 0;
      if (i < itemsInVisibleArea) {
        this._activeItems.push(i);
      }
    }
    if (this._config.loop) {
      // перемещаем последний слайд перед первым
      const count = $itemList.length - 1;
      const translate = -$itemList.length * 100;
      $itemList[count].dataset.order = -1;
      $itemList[count].dataset.translate = -$itemList.length * 100;
      $itemList[count].style.transform = `translateX(${translate}%)`;
      this.__refreshExtremeValues();
    } else if (this._$controlPrev) {
      this._$controlPrev.classList.add(CLASS_CONTROL_HIDE);
    }
    this._setActiveClass();
    this._addEventListener();
    this._updateIndicators();
    this._autoplay();
  }
  _addEventListener() {
    const $root = this._$root;
    const $items = this._$items;
    const config = this._config;

    function onClick(e) {
      const $target = e.target;
      this._autoplay('stop');
      if ($target.classList.contains(CONTROL_CLASS)) {
        e.preventDefault();
        this._direction = $target.dataset.slide;
        this._move();
      } else if ($target.dataset.slideTo) {
        const index = parseInt($target.dataset.slideTo, 10);
        this._moveTo(index);
      }
      if (this._config.loop) {
        this._autoplay();
      }
    }

    function onMouseEnter() {
      this._autoplay('stop');
    }

    function onMouseLeave() {
      this._autoplay();
    }

    function onTransitionStart() {
      if (this._balancingItemsFlag) {
        return;
      }
      this._balancingItemsFlag = true;
      window.requestAnimationFrame(this._balancingItems.bind(this));
    }

    function onTransitionEnd() {
      this._balancingItemsFlag = false;
    }

    function onResize() {
      window.requestAnimationFrame(this._refresh.bind(this));
    }

    function onSwipeStart(e) {
      this._autoplay('stop');
      const event = e.type.search('touch') === 0 ? e.touches[0] : e;
      this._swipeStartPos = event.clientX;
      this._hasSwipeState = true;
    }

    function onSwipeEnd(e) {
      if (!this._hasSwipeState) {
        return;
      }
      const event = e.type.search('touch') === 0 ? e.changedTouches[0] : e;
      const diffPos = this._swipeStartPos - event.clientX;
      if (diffPos > 50) {
        this._direction = 'next';
        this._move();
      } else if (diffPos < -50) {
        this._direction = 'prev';
        this._move();
      }
      this._hasSwipeState = false;
      if (this._config.loop) {
        this._autoplay();
      }
    }

    function onDragStart(e) {
      e.preventDefault();
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        this._autoplay('stop');
      } else if (document.visibilityState === 'visible') {
        if (this._config.loop) {
          this._autoplay();
        }
      }
    }

    $root.addEventListener('click', onClick.bind(this));
    $root.addEventListener('mouseenter', onMouseEnter.bind(this));
    $root.addEventListener('mouseleave', onMouseLeave.bind(this));
    // on resize
    if (config.refresh) {
      window.addEventListener('resize', onResize.bind(this));
    }
    // on transitionstart and transitionend
    if (config.loop) {
      $items.addEventListener('transition-start', onTransitionStart.bind(this));
      $items.addEventListener('transitionend', onTransitionEnd.bind(this));
    }
    // on touchstart and touchend
    if (config.swipe) {
      $root.addEventListener('touchstart', onSwipeStart.bind(this));
      $root.addEventListener('mousedown', onSwipeStart.bind(this));
      document.addEventListener('touchend', onSwipeEnd.bind(this));
      document.addEventListener('mouseup', onSwipeEnd.bind(this));
    }
    $root.addEventListener('dragstart', onDragStart.bind(this));
    // при изменении активности вкладки
    document.addEventListener('visibilitychange', onVisibilityChange.bind(this));
  }
  __refreshExtremeValues() {
    const $itemList = this._$itemList;
    this._minOrder = +$itemList[0].dataset.order;
    this._maxOrder = this._minOrder;
    this._$itemByMinOrder = $itemList[0];
    this._$itemByMaxOrder = $itemList[0];
    this._minTranslate = +$itemList[0].dataset.translate;
    this._maxTranslate = this._minTranslate;
    for (let i = 0, length = $itemList.length; i < length; i++) {
      const $item = $itemList[i];
      const order = +$item.dataset.order;
      if (order < this._minOrder) {
        this._minOrder = order;
        this._$itemByMinOrder = $item;
        this._minTranslate = +$item.dataset.translate;
      } else if (order > this._maxOrder) {
        this._maxOrder = order;
        this._$itemByMaxOrder = $item;
        this._maxTranslate = +$item.dataset.translate;
      }
    }
  }
  _balancingItems() {
    if (!this._balancingItemsFlag) {
      return;
    }
    const $wrapper = this._$wrapper;
    const $wrapperClientRect = $wrapper.getBoundingClientRect();
    const widthHalfItem = $wrapperClientRect.width / this._itemsInVisibleArea / 2;
    const count = this._$itemList.length;
    let translate;
    let clientRect;
    if (this._direction === 'next') {
      const wrapperLeft = $wrapperClientRect.left;
      const $min = this._$itemByMinOrder;
      translate = this._minTranslate;
      clientRect = $min.getBoundingClientRect();
      if (clientRect.right < wrapperLeft - widthHalfItem) {
        $min.dataset.order = this._minOrder + count;
        translate += count * 100;
        $min.dataset.translate = translate;
        $min.style.transform = `translateX(${translate}%)`;
        // update values of extreme properties
        this.__refreshExtremeValues();
      }
    } else {
      const wrapperRight = $wrapperClientRect.right;
      const $max = this._$itemByMaxOrder;
      translate = this._maxTranslate;
      clientRect = $max.getBoundingClientRect();
      if (clientRect.left > wrapperRight + widthHalfItem) {
        $max.dataset.order = this._maxOrder - count;
        translate -= count * 100;
        $max.dataset.translate = translate;
        $max.style.transform = `translateX(${translate}%)`;
        // update values of extreme properties
        this.__refreshExtremeValues();
      }
    }
    // updating...
    requestAnimationFrame(this._balancingItems.bind(this));
  }
  _setActiveClass() {
    const activeItems = this._activeItems;
    const $itemList = this._$itemList;
    for (let i = 0, length = $itemList.length; i < length; i++) {
      const $item = $itemList[i];
      const index = +$item.dataset.index;
      if (activeItems.indexOf(index) > -1) {
        $item.classList.add(CLASS_ITEM_ACTIVE);
      } else {
        $item.classList.remove(CLASS_ITEM_ACTIVE);
      }
    }
  }
  _updateIndicators() {
    const $indicatorList = this._$indicatorList;
    const $itemList = this._$itemList;
    if (!$indicatorList.length) {
      return;
    }
    for (let index = 0, length = $itemList.length; index < length; index++) {
      const $item = $itemList[index];
      if ($item.classList.contains(CLASS_ITEM_ACTIVE)) {
        $indicatorList[index].classList.add(CLASS_INDICATOR_ACTIVE);
      } else {
        $indicatorList[index].classList.remove(CLASS_INDICATOR_ACTIVE);
      }
    }
  }
  _move() {
    const step = this._direction === 'next' ? -this._transformStep : this._transformStep;
    let transform = this._transform + step;
    if (!this._config.loop) {
      const endTransformValue = this._transformStep * (this._$itemList.length - this._itemsInVisibleArea);
      transform = Math.round(transform * 10) / 10;
      if (transform < -endTransformValue || transform > 0) {
        return;
      }
      this._$controlPrev.classList.remove(CLASS_CONTROL_HIDE);
      this._$controlNext.classList.remove(CLASS_CONTROL_HIDE);
      if (transform === -endTransformValue) {
        this._$controlNext.classList.add(CLASS_CONTROL_HIDE);
      } else if (transform === 0) {
        this._$controlPrev.classList.add(CLASS_CONTROL_HIDE);
      }
    }
    const activeIndex = [];
    let i = 0;
    let length;
    let index;
    let newIndex;
    if (this._direction === 'next') {
      for (i = 0, length = this._activeItems.length; i < length; i++) {
        index = this._activeItems[i];
        index += 1;
        newIndex = index;
        if (newIndex > this._$itemList.length - 1) {
          newIndex -= this._$itemList.length;
        }
        activeIndex.push(newIndex);
      }
    } else {
      for (i = 0, length = this._activeItems.length; i < length; i++) {
        index = this._activeItems[i];
        index -= 1;
        newIndex = index;
        if (newIndex < 0) {
          newIndex += this._$itemList.length;
        }
        activeIndex.push(newIndex);
      }
    }
    this._activeItems = activeIndex;
    this._setActiveClass();
    this._updateIndicators();
    this._transform = transform;
    this._$items.style.transform = `translateX(${transform}%)`;
    this._$items.dispatchEvent(new CustomEvent('transition-start', {
      bubbles: true,
    }));
  }
  _moveToNext() {
    this._direction = 'next';
    this._move();
  }
  _moveToPrev() {
    this._direction = 'prev';
    this._move();
  }
  _moveTo(index) {
    const $indicatorList = this._$indicatorList;
    let nearestIndex = null;
    let diff = null;
    let i;
    let length;
    for (i = 0, length = $indicatorList.length; i < length; i++) {
      const $indicator = $indicatorList[i];
      if ($indicator.classList.contains(CLASS_INDICATOR_ACTIVE)) {
        const slideTo = +$indicator.dataset.slideTo;
        if (diff === null) {
          nearestIndex = slideTo;
          diff = Math.abs(index - nearestIndex);
        } else if (Math.abs(index - slideTo) < diff) {
          nearestIndex = slideTo;
          diff = Math.abs(index - nearestIndex);
        }
      }
    }
    diff = index - nearestIndex;
    if (diff === 0) {
      return;
    }
    this._direction = diff > 0 ? 'next' : 'prev';
    for (i = 1; i <= Math.abs(diff); i++) {
      this._move();
    }
  }
  _autoplay(action) {
    if (!this._config.autoplay) {
      return;
    }
    if (action === 'stop') {
      clearInterval(this._intervalId);
      this._intervalId = null;
      return;
    }
    if (this._intervalId === null) {
      this._intervalId = setInterval(() => {
        this._direction = 'next';
        this._move();
      }, this._config.interval);
    }
  }
  _refresh() {
    // create some constants
    const $itemList = this._$itemList;
    const widthItem = $itemList[0].offsetWidth;
    const widthWrapper = this._$wrapper.offsetWidth;
    const itemsInVisibleArea = Math.round(widthWrapper / widthItem);

    if (itemsInVisibleArea === this._itemsInVisibleArea) {
      return;
    }

    this._autoplay('stop');

    this._$items.classList.add(SLIDER_TRANSITION_OFF);
    this._$items.style.transform = 'translateX(0)';

    // setting properties after reset
    this._widthItem = widthItem;
    this._widthWrapper = widthWrapper;
    this._itemsInVisibleArea = itemsInVisibleArea;
    this._transform = 0;
    this._transformStep = 100 / itemsInVisibleArea;
    this._balancingItemsFlag = false;
    this._activeItems = [];

    // setting order and translate items after reset
    for (let i = 0, length = $itemList.length; i < length; i++) {
      const $item = $itemList[i];
      const position = i;
      $item.dataset.index = position;
      $item.dataset.order = position;
      $item.dataset.translate = 0;
      $item.style.transform = 'translateX(0)';
      if (position < itemsInVisibleArea) {
        this._activeItems.push(position);
      }
    }

    this._setActiveClass();
    this._updateIndicators();
    window.requestAnimationFrame(() => {
      this._$items.classList.remove(SLIDER_TRANSITION_OFF);
    });

    // hide prev arrow for non-infinite slider
    if (!this._config.loop) {
      if (this._$controlPrev) {
        this._$controlPrev.classList.add(CLASS_CONTROL_HIDE);
      }
      return;
    }

    // translate last item before first
    const count = $itemList.length - 1;
    const translate = -$itemList.length * 100;
    $itemList[count].dataset.order = -1;
    $itemList[count].dataset.translate = -$itemList.length * 100;
    $itemList[count].style.transform = 'translateX('.concat(translate, '%)');
    // update values of extreme properties
    this.__refreshExtremeValues();
    // calling _autoplay
    this._autoplay();
  }
  next() {
    this._moveToNext();
  }
  prev() {
    this._moveToPrev();
  }
  moveTo(index) {
    this._moveTo(index);
  }
  refresh() {
    this._refresh();
  }
}

document.addEventListener('DOMContentLoaded', function () {
    const slider = new ChiefSlider('.slider', {
      loop: true,
      autoplay: true,
      interval: 7000,
    });
  });