//CSRF protection
$(function () {
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function (e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });
});

//default init
(function ($) {
    "use strict";

    // init feather icons
    feather.replace();

    //twitter emojis
    twemoji.parse(document.body);

    //tooltip
    $("[data-toggle='tooltip']").tooltip();

    //popover
    $('[data-toggle="popover"]').popover();

    //sticky sidebar
    jQuery('.content, .sidebar').theiaStickySidebar({
        // Settings
        additionalMarginTop: 50
    });

    //intialize WOW plugin
//    new WOW().init();

    //init select2
    $('.select2').select2({
        placeholder: 'Please select value',
        allowClear: true
    });

    // Initialize footable 
    $('.footable-responsive').footable();

    //init maxlength
    $('.show-maxlength').maxlength({
        alwaysShow: true,
        warningClass: "tag tag-primary",
        limitReachedClass: "tag tag-danger"
    });
    $('.show-maxlength-threshold').maxlength({
        alwaysShow: false,
        threshold: 100,
        warningClass: "tag tag-primary",
        limitReachedClass: "tag tag-danger"
    });

    //init autosize
    autosize($('textarea'));
    //FIX: maxlength
    $('textarea').on('autosize.resized', function () {
        $(this).trigger('maxlength.reposition');
    });

    //init switchery
    var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
    elems.forEach(function (html) {
        var switchery = new Switchery(html, {color: '#0275d8'});
    });

    //init file input
    $('.file-input').fileinput({
        browseLabel: 'Browse',
        browseIcon: '<i class="ion-ios-browsers-outline"></i>',
        uploadIcon: '<i class="fa fa-upload"></i>',
        removeIcon: '<i class="fa fa-times"></i>',
        initialCaption: "No file selected",
        layoutTemplates: {progress: ''},
        showPreview: false,
        showRemove: false,
        showCancel: false,
        showUpload: false,
    });

    //intialize summernote
    $('.summernote').summernote({
        height: 180,
        linkNoFollow: false,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['media', 'link']],
        ]
    });

    $('.summernote-full').summernote({
        height: 180,
        linkNoFollow: false,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['media', 'link', 'picture']],
            ['codeview', ['codeview', 'fullscreen']],
        ]
    });

    //initialize Slick
    $('.slick-nav').slick({
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });//initialize Slick

    //slick featured startups
    $('.slick-featured-startups').slick({
        infinite: true,
        dots: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    });

    //live search
    $('#search-query').keypress(function (e) {
        //ignore Enter key
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });

    $('#search-query').keyup(function (e) {
        var q = $(this).val().trim();
        //check for empty string
        if (q.length === 0) {
            $('#loader').hide();
            $('#results').html('');
            $('#results').hide();
            return;
        } else {
            $('#loader').show();
            $('#results').hide();
            //fetch search results from server
            $.post(
                "/startup/search",
                {q: q},
                function (html) {
                    $('#results').html(html);
                    $('#loader').hide();
                    $('#results').show();
                }, 'html');
        }
    });
})(jQuery);

//toggle search
function toggleSearch() {
    $('#search-popup').toggleClass('d-none');
    $('body').toggleClass('popup-open');
    $('#search-query').focus();
    $('#search-query').val('');
    $('#loader').hide();
    $('#results').hide();
    $('#results').html('');
}

//events handling
(function ($) {
//    //detect comment-{id} hash and navigate
//    if (window.location.hash.startsWith('#comment-')) {
//        scroll(window.location.hash);
//    }

    //resend verification email
    $('.send-verification-email').click(function (e) {
        e.preventDefault();
        $.post(
            "/user/resend-verification-email",
            {},
            function (data) {
                pnotifyNow(data.details, pnotifyType(data.type));
            }, 'json');
    });

    /*
     * Open share link
     */
    $(document).on('click', '.social-share', function (e) {
        e.preventDefault();
        window.open($(this).attr('data-href'), '', 'height=450,width=600');
    });

    //event upvote
    $(document).on('click', '.event-upvote', function (e) {
        e.preventDefault();
        //check for login
        if ($('#loginModal').length > 0) {
            $('#loginModal').modal('toggle');
        } else {
            var obj = $(this);
            var id = $(this).attr('data-id');
            var placeholder = $(this).attr('data-placeholder');
            var count = parseInt($(this).find('.upvote-count').text());
            $.post(
                "/ajax/startup/upvote",
                {id: id},
                function (data) {
                    if (!data.status) { //only notify errors
                        pnotifyNow(data.details, pnotifyType(data.type));
                    } else {
                        $('.event-upvote[data-id=' + id + ']').each(function (i) {
                            if (data.data) {
                                placeholder === undefined ? $(this).removeClass('btn-light').addClass('btn-primary') :
                                    $(this).addClass('text-primary');
                                $(this).find('.upvote-count').text(count + 1);
                            } else {
                                placeholder === undefined ? $(this).removeClass('btn-primary').addClass('btn-light') :
                                    $(this).removeClass('text-primary');
                                $(this).find('.upvote-count').text(count - 1);
                            }
                        });
                    }
                }, 'json');
        }
        return false;
    });

    //event upvote comment
    $(document).on('click', '.event-upvote-comment', function (e) {
        e.preventDefault();
        //check for login
        if ($('#loginModal').length > 0) {
            $('#loginModal').modal('toggle');
        } else {
            var obj = $(this);
            var id = $(this).attr('data-id');
            var count = $(this).find('.upvote-count').text();
            $.post(
                "/ajax/startup/upvote-comment",
                {id: id},
                function (data) {
                    if (!data.status) { //only notify errors
                        pnotifyNow(data.details, pnotifyType(data.type));
                    } else {
                        //upvoted
                        count = count === 'Upvote' ? 0 : parseInt(count);
                        if (data.data) {
                            obj.removeClass('text-muted').addClass('text-success');
                            obj.find('.upvote-count').text(count + 1);
                        } else {
                            obj.removeClass('text-success').addClass('text-muted');
                            obj.find('.upvote-count').text((count - 1) === 0 ? 'Upvote' : count - 1);
                        }
                    }
                }, 'json');
        }
        return false;
    });

    //load more startups
    $(document).on('click', '#load-more', function (e) {
        e.preventDefault();
        //load params
        var page = parseInt($(this).attr('data-page'));
        var pages = parseInt($(this).attr('data-pages'));
        var type = $(this).attr('data-type');
        var id = $(this).attr('data-id');
        var obj = $(this);
        if (page === pages || pages === 1) {
            $(this).hide();
        } else {
            //change button text
            obj.find('.button-text').text('Loading ...');
            $.post(
                "/startups/load-more",
                {id: id, type: type, page: page + 1},
                function (html) {
                    $('#startup-deck').append(html);
                    //update meta
                    obj.attr('data-page', page + 1);
                    if (page + 1 === pages) {
                        obj.hide(); //hide when all pages are loaded
                    }
                    imgix.init();
                    obj.find('.button-text').text('Load More');
                }, 'html');
        }
    });

    //newsletter subscription
    $(document).on('click', '#subscribe-newsletter', function (e) {
        e.preventDefault();
        //load params
        var email = $("#newsletter-email").val().trim();
        var obj = $(this);
        if (email.length !== 0) {
            blockUI();
            $.post(
                "/newsletter/subscribe",
                {email: email},
                function (json) {
                    pnotifyNow(json.details, pnotifyType(json.type), 5000);
                    unblockUI();
                    if (json.status) {
                        $("#newsletter-email").val('');
                    }
                }, 'json');
        }
    });

    //user follower
    $(document).on('click', '.user-follow', function (e) {
        e.preventDefault();
        //check for login
        if ($('#loginModal').length > 0) {
            $('#loginModal').modal('toggle');
        } else {
            var obj = $(this);
            var id = $(this).attr('data-id');
            $.post(
                "/ajax/user/follow",
                {id: id},
                function (data) {
                    if (!data.status) { //only notify errors
                        pnotifyNow(data.details, pnotifyType(data.type));
                    } else {
                        //followed
                        if (data.data) {
                            obj.removeClass('btn-light').addClass('btn-primary');
                            obj.text('Following');
                        } else {
                            obj.removeClass('btn-primary').addClass('btn-light');
                            obj.text('Follow');
                        }
                    }
                }, 'json');
        }
        return false;
    });

    //market follower
    $(document).on('click', '.market-follow', function (e) {
        e.preventDefault();
        //check for login
        if ($('#loginModal').length > 0) {
            $('#loginModal').modal('toggle');
        } else {
            var obj = $(this);
            var id = $(this).attr('data-id');
            $.post(
                "/ajax/market/follow",
                {id: id},
                function (data) {
                    if (!data.status) { //only notify errors
                        pnotifyNow(data.details, pnotifyType(data.type));
                    } else {
                        //followed
                        if (data.data) {
                            obj.removeClass('btn-light').addClass('btn-primary');
                            obj.text('Following');
                        } else {
                            obj.removeClass('btn-primary').addClass('btn-light');
                            obj.text('Follow');
                        }
                    }
                }, 'json');
        }
        return false;
    });

    //bind popover
    $('.bind-popover').each(function () {
        $(this).popover({
            html: true,
            container: 'body',
            placement: 'bottom',
            content: function () {
                return $('#' + $(this).attr('data-id')).html();
            },
            template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content p-0"></div></div></div>'
        });
    });
    //auto hide popover on click
    $(document).on('click', function (e) {
        $('[data-type="popover"],[data-original-title]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false;  // fix for BS 3.3.6
            }

        });
    });
})(jQuery);

/*
 * PNotify notifications
 */
PNotify.prototype.options.styling = "bootstrap3";
//PNotify.prototype.options.styling = "fontawesome";
var NotifyNow = {
    DEFAULT: {value: 'default', title: 'Important', class: 'bg-primary'},
    SUCCESS: {value: 'success', title: 'Success', class: 'bg-success'},
    INFO: {value: 'info', title: 'Information', class: 'bg-info'},
    WARNING: {value: 'warning', title: 'Warning', class: 'bg-warning'},
    ERROR: {value: 'error', title: 'Error', class: 'bg-danger'}
};
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

function pnotifyType(str) {
    if (str === 'default')
        return NotifyNow.DEFAULT;
    if (str === 'success')
        return NotifyNow.SUCCESS;
    if (str === 'info')
        return NotifyNow.INFO;
    if (str === 'warning')
        return NotifyNow.WARNING;
    if (str === 'danger')
        return NotifyNow.ERROR;
}

function pnotifyNow(value, type, delay) {
    if (type === undefined) {
        type = NotifyNow.DEFAULT;
    }
    if (delay === undefined) {
        delay = 2000;
    }
    new PNotify({
        title: type.title,
        type: type.value,
        text: value,
        addclass: type.class,
        delay: delay
    });
}

/*
 * Block / Unblock UI
 */
function blockUI() {
//    $.blockUI({
//        message: '<img src="/img/loading.gif" alt="Loading ..." />',
//        overlayCSS: {
//            backgroundColor: '#1B2024',
//            opacity: 0.55,
//            cursor: 'wait'
//        },
//        css: {
//            border: '4px #999 solid',
//            padding: 15,
//            backgroundColor: '#fff',
//            color: 'inherit'
//        }
//    });
}

function unblockUI() {
//    $.unblockUI();
}

/*
 * Refresh/Redirect Page
 */
function refreshPage(duration) {
    if (duration === undefined) {
        duration = 2000;
    }
    setTimeout(function () {
        window.location.reload();
    }, duration);
}

function redirectPage(url, duration) {
    if (duration === undefined) {
        duration = 2000;
    }
    setTimeout(function () {
        window.location.href = url;
    }, duration);
}

/* convert text into slug */
function convertToSlug(Text) {
    return Text
        .toLowerCase()
        //        .replace(/[^\w ]+/g,'')
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .replace(/ +/g, '-')
        ;
}

/* convert name into url */
function convertToURL(Text) {
    return 'http://' + Text.toLowerCase();
}

/*
 * Generate a unique HEX number
 */
function guid(md) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return md === undefined ? s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4() : s4() + s4() + '-' + s4();
}

//scroll to top
function scroll(selector, offset) {
    if (offset === undefined) {
        offset = 100;
    }
    $('html, body').stop().animate({
        scrollTop: $(selector).offset().top - offset
    }, 1500, 'easeInOutExpo');
}