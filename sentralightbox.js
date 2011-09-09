(function($){

	
    $.fn.sentralightbox = function (options) {

        var 
        active = false,
        speed = 'slow',
        defaults = {},
        elements = [],
        data = [],
        prefix = 'clbx',
        navClass = prefix + '_nav',
        navHtml = '<div class="'+navClass+'" style="display:none;top:0;left:0;right:0;"><a href="#" class="p">&laquo;</a><a href="#" class="n">&raquo;</a><a href="#" class="x">Close</a></div>',
        overlayClass = prefix + '_overlay',
        overlayHtml = '<div class="'+overlayClass+'" style="display:none;"></div>',
        containerClass = prefix + '_container',
        containerHtml = '<div class="'+containerClass+'" style="display:none;top:0;left:0;"></div>',
        bodyClass = overlayClass + 'ed',
        winSize = {w:null,h:null},
        winScroll = {t:null,l:null},
        center = {t:null,l:null},
        itemSize = {h:540,w:720},
        defaultPosition = {
            prev : {t:-270,l:0,o:1},
            curr : {t:-270,l:-360,o:1},
            next : {t:-270,l:0,o:1}
        },
        currIndex = 0
        ;


        function openLightbox() {

            var animatePos = false;

            if ($('body > .'+overlayClass).length == 1 && $('body > .'+overlayClass).css('display') == 'none') {
                $('body > .'+overlayClass).show();
                $('body > .'+navClass).show();
                $('body > .'+containerClass).fadeIn();
                animatePos = true;
            } else {
                $('body').prepend(containerHtml);
                $('body').prepend(overlayHtml);
                $('body').prepend(navHtml);
                $('body > .'+overlayClass).show();
                $('body > .'+navClass).show();
                $('body > .'+containerClass).fadeIn();
                $('.'+overlayClass).click(callbacks.overlayClick);
            }
            $('body').addClass(bodyClass);

            active = true;

            winScroll.t = $(window).scrollTop();
            winScroll.l = $(window).scrollLeft();

            updatePosition(animatePos);

            $('body > .'+containerClass).html('');

            $('body > .'+navClass).find('a.p').click(prev);
            $('body > .'+navClass).find('a.n').click(next);
            $('body > .'+navClass).find('a.x').click(closeLightbox);
            createPrev();
            createCurr();
            createNext();

            //console.log(currIndex);
        }


        function closeLightbox() {
            $('body > .'+containerClass).hide();
            $('body > .'+navClass).hide();
            $('body > .'+overlayClass).fadeOut(200);
            $('body').removeClass(bodyClass);
            active = false;
        }


        function next() {
            
            // hapus yang ada di kiri
            var cont = $('body > .'+containerClass);
            cont.find('.item.prev').remove();

            // pindahkan curr ke kiri
            cont.find('.item.curr').animate({
                left    : defaultPosition.prev.l
            }, speed).removeClass('curr').addClass('prev');

            // pindahkan next ke tengah
            cont.find('.item.next').animate({
                left    : defaultPosition.curr.l
            }, speed).removeClass('next').addClass('curr');

            
            // incerement currIndex
            currIndex = currIndex == data.length - 1 ? 0 : currIndex + 1;


            // buat next baru di kanan
            createNext();
        
        }


        function prev() {

            // hapus yang ada di kanan
            var cont = $('body > .'+containerClass);
            cont.find('.item.next').remove();


            // pindahkan curr ke kanan
            cont.find('.item.curr').animate({
                left    : defaultPosition.next.l
            }, speed).removeClass('curr').addClass('next');

            // pindahkan prev ke tengah
            cont.find('.item.prev').animate({
                left    : defaultPosition.curr.l
            }, speed).removeClass('prev').addClass('curr');

            // decrement currIndex
            currIndex = currIndex == 0 ? data.length - 1 : currIndex - 1;
        
            // buat prev baru di kiri
            createPrev();


        }


        function createCurr() {
            var html = '<div class="item curr" style="background-image:url(\''+data[currIndex].img+'\');"><!--div class="name">'+data[currIndex].name+'</div><div class="desc">'+data[currIndex].desc+'</div--></div>';
            $('body > .'+containerClass).append(html);
            $('body > .'+containerClass).find('.item.curr')
            .css('top',defaultPosition.curr.t)
            .css('left',defaultPosition.curr.l)
            .css('opacity',defaultPosition.curr.o);
        }


        function createPrev() {
            var index = currIndex == 0 ? data.length - 1 : currIndex - 1;
            var html = '<div class="item prev" style="background-image:url(\''+data[index].img+'\');"><!--div class="name">'+data[index].name+'</div><div class="desc">'+data[index].desc+'</div--></div>';
            $('body > .'+containerClass).append(html);
            $('body > .'+containerClass).find('.item.prev')
            .css('top',defaultPosition.prev.t)
            .css('left',defaultPosition.prev.l)
            .css('opacity',defaultPosition.prev.o);
        }


        function createNext() {
            var index = currIndex == data.length - 1 ? 0 : currIndex + 1;
            var html = '<div class="item next" style="background-image:url(\''+data[index].img+'\');"><!--div class="name">'+data[index].name+'</div><div class="desc">'+data[index].desc+'</div--></div>';
            $('body > .'+containerClass).append(html);
            $('body > .'+containerClass).find('.item.next')
            .css('top',defaultPosition.next.t)
            .css('left',defaultPosition.next.l)
            .css('opacity',defaultPosition.next.o);
        }


        function init(thisObj) {

            elements = thisObj;

            $(thisObj).each(function(index, element) {
                el = jQuery(element);
                var obj = {
                    name  : el.attr('title'),
                    desc  : el.attr('desc'),
                    img   : el.attr('href'),
                    price : el.attr('price')
                };

                data.push(obj);
            });

            // main event handling
            $(thisObj).click(callbacks.listClick);
            $(document).bind('keydown.'+prefix, callbacks.keyDown);
            $(window).resize(callbacks.windowResize);
        }


        function updatePosition(animate) {
            winSize.h = $(window).height();
            winSize.w = $(window).width();
            center.t = (winSize.h/2)+winScroll.t;
            center.l = (winSize.w/2)+winScroll.l;

            defaultPosition.prev.l = 0-(winSize.w/2)-itemSize.w-15;
            defaultPosition.next.l = (winSize.w/2)+15;

            $('body > .'+navClass).find('a.p').css('top',(winSize.h/2)-20);
            $('body > .'+navClass).find('a.n').css('top',(winSize.h/2)-20);


            if (animate) {
                $('body > .'+containerClass).animate({
                    top:center.t,
                    left:center.l
                }, 'fast');
            } else {
                $('body > .'+containerClass).css('top',center.t).css('left',center.l);
            }
        }


        var callbacks = {

            keyDown: function (e){
                if (active) {
                    console.log(e.keyCode);
                    if (e.keyCode === 27) {
                        e.preventDefault();
                        closeLightbox();
                    }
                    if (e.keyCode === 37) {
                        e.preventDefault();
                        prev();
                    }
                    if (e.keyCode === 39) {
                        e.preventDefault();
                        next();
                    }
                }
            },

            listClick : function(e){
                currIndex = $(elements).index($(e.target));
                e.preventDefault();
                e.stopPropagation();
                openLightbox();
            },

            overlayClick : function (e) {
                e.stopPropagation();
                //alert('hey');
                closeLightbox();
            },

            windowResize : function (e) {
                updatePosition(true);
            }

        }


        init(this);


    }



})(jQuery);
