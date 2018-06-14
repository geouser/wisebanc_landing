// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
     *
     * Check if element exist on page
     *
     * @param el {string} jQuery object (#popup)
     *
     * @return {bool}
     *
*/
function exist(el){
    if ( $(el).length > 0 ) {
        return true;
    } else {
        return false;
    }
}

function ajust_page_height() {
    var footer_height = jQuery('.footer').outerHeight();
    var window_height = jQuery(window).height();

    jQuery('.offer').css('min-height', window_height - footer_height );
}
ajust_page_height();


jQuery(document).ready(function($) {

    $(".header").headroom();
    
    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.toggle-menu'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function() {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });



    $('.js-toggle-signup-form').on('click', function(event) {
        event.preventDefault();
        $('.signup-form').addClass('active');

        if ( $(window).width() <= 991 ) {
            openPopup('#modal-popup');
        }
    });
    



    $(window).on('resize', function(event) {
        event.preventDefault();
        ajust_page_height();
    });


    /*---------------------------
                                  File input logic
    ---------------------------*/
    $('input[type=file]').each(function(index, el) {
        $(this).on('change', function(event) {
            event.preventDefault();
            var placeholder = $(this).siblings('.placeholder');
        
            if ( this.files.length > 0 ) {
                if ( this.files[0].size < 5000000 ) {
                    var filename = $(this).val().split('/').pop().split('\\').pop();
                    if ( filename == '' ) {
                        filename = placeholder.attr('data-label');
                    }
                    placeholder.text(filename);
                } else {
                    alert('Maximum file size is 5Mb');
                }    
            } else {
                placeholder.text( placeholder.attr('data-label') );
            }
            
        });
    });
    
    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.page-menu a, .anchor').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.js-toggle-menu').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $(this).siblings('header').toggleClass('open');
    });



    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox').fancybox({
        
    });


    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.fancybox.open([
            {
                src  : popup,
                type: 'inline',
                opts : {}
            }
        ], {
            loop : false
        });
    }



    function update_widget( from, to, display, raw ) {

            var widget_id = '.' + from + to;

            var fallClass = 'falling';
            var riseClass = 'rising'

            var widget = $(widget_id);

            //console.log( raw );

            var widgetPrice = widget.find('.price');
            var widgetChange = widget.find('.change-price');
            var widgetChangePt = widget.find('.cahnge-percent');

            // widget price
            var oldPrice = widgetPrice.attr('data-price');
            var newPrice = raw[to].PRICE;

            widgetPrice.attr( 'data-price', newPrice );
            widgetPrice.text( display[to].PRICE );

            if ( oldPrice ) {
                if ( oldPrice > newPrice ) {
                    widgetPrice.addClass(fallClass);
                    setTimeout(function () { 
                        widgetPrice.removeClass(fallClass);
                    }, 1500);

                } else if ( oldPrice < newPrice ) {
                    widgetPrice.addClass(riseClass);
                    setTimeout(function () { 
                        widgetPrice.removeClass(riseClass);
                    }, 1500);
                }
            }

            var change = display[to].CHANGEDAY;

            widgetChange.text( change );

            if ( raw[to].CHANGEDAY > 0 ) {
                widgetChange.addClass( riseClass );
                widgetChange.removeClass( fallClass );
            } else if ( raw[to].CHANGEDAY < 0 ) {
                widgetChange.addClass( fallClass );
                widgetChange.removeClass( riseClass );
            } else {
                widgetChange.removeClass( fallClass );
                widgetChange.removeClass( riseClass );
            }

            widgetChangePt.text( display[to].CHANGEPCTDAY + '%' );

            if ( raw[to].CHANGEPCTDAY > 0 ) {
                widgetChangePt.addClass( riseClass );
                widgetChangePt.removeClass( fallClass );
            } else if ( raw[to].CHANGEPCTDAY < 0 ) {
                widgetChangePt.addClass( fallClass );
                widgetChangePt.removeClass( riseClass );
            } else {
                widgetChangePt.removeClass( fallClass );
                widgetChangePt.removeClass( riseClass );
            }    


        


        //console.log(display);

    }



    function load_data( pairs ) {

        var from = [];
        var to = [];

        $.each( pairs, function( index, val ) {
            from.push( val.from );
            to.push( val.to );
        });

        //console.log('dsf')
        $.ajax({
            type: 'GET',
            url: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + from.join() + '&tsyms=' + to.join(),
            data: null,
            cache: false,
            success: function (data, textStatus, jQxhr) {
                //console.log( data );
                $.each( pairs, function( index, val ) {
                    update_widget( val.from, val.to, data.DISPLAY[val.from], data.RAW[val.from] );
                });
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(jqXhr);
            }
        })

    }


    setInterval(function(){
       load_data( pairs );
    }, 5000);

    load_data( pairs );

}); // end file