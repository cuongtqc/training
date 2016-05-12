/**
 * Create custom jQuery event for scrolling
 */
(function() {

    var special = jQuery.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);

    special.scrollstart = {
        setup: function() {

            var timer;
            var handler = function(evt) {
                var _self = this,
                    _args = arguments;

                if (timer) {
                    clearTimeout(timer);
                } else {
                    evt.type = 'scrollstart';
                    jQuery.event.handle.apply(_self, _args);
                }

                timer = setTimeout(function() {
                    timer = null;
                }, special.scrollstop.latency);

            };

            jQuery(this).bind('scroll', handler).data(uid1, handler);

        },
        teardown: function() {
            jQuery(this).unbind('scroll', jQuery(this).data(uid1));
        }
    };

    special.scrollstop = {
        latency: 300,
        setup: function() {

            var timer;
            var handler = function(evt) {
                var _self = this,
                    _args = arguments;

                if (timer) {
                    clearTimeout(timer);
                }

                timer = setTimeout(function() {

                    timer = null;
                    evt.type = 'scrollstop';
                    jQuery.event.handle.apply(_self, _args);

                }, special.scrollstop.latency);

            };

            jQuery(this).bind('scroll', handler).data(uid2, handler);

        },
        teardown: function() {
            jQuery(this).unbind('scroll', jQuery(this).data(uid2));
        }
    };

})();

/**
 * Detect if the device is touch device
 * @returns {Boolean}
 */
function is_touch_device() {
    if (navigator.appVersion.indexOf("Win") != -1) {
        return false;
    }

    return window.navigator.msMaxTouchPoints > 0	// Works on Internet Explorer 8
        || !!('ontouchstart' in window) // works on most browsers
        || !!('onmsgesturechange' in window); // works on ie10
}

var lastScrollTop = 0;

jQuery(document).ready(function() {

    // Show back to top button
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() > 200) {
            jQuery('#back-to-top').fadeIn(200);
        } else {
            jQuery('#back-to-top').fadeOut(200);
        }
    });

    jQuery('#back-to-top').click(function(event) {
        event.preventDefault();

        jQuery('html, body').animate({scrollTop: 0}, 300);
    });
    // End of Show back to top button

    jQuery('#email-button').on('click', function(e) {
        e.preventDefault();

        jQuery('html, body').stop().animate({
            scrollTop: jQuery('#contact-subject').offset().top - 80
        }, 1000);

        jQuery('input[name="contact_name"]').focus();
    });

    // Scroll on iPad
    if (is_touch_device()) {
		jQuery(window).scroll(function(event){
		   var st = jQuery(this).scrollTop();
		   if (st > lastScrollTop && lastScrollTop != 0){
				if(!jQuery('#site-navigation').is(":visible")) {
					jQuery('.site-header .header-menu').stop().show().animate({opacity: 0}).hide();
				}
		   } else {
				jQuery('.site-header .header-menu').stop().show().animate({opacity: 1, position: 'fixed'});
		   }
		   lastScrollTop = st;
		});
		
		/* cache dom references */ 
		var my_body = jQuery('body'); 

		/* bind events */
		jQuery(document)
		.on('focus', 'input, textarea, select', function(e) {
			my_body.addClass('fixfixed');
		})
		.on('blur', 'input, textarea, select', function(e) {
			my_body.removeClass('fixfixed');
		});
    }

    // primary nav toggle
    jQuery('.site-header .btn-nav').on('click', function(e) {
        e.preventDefault();
        jQuery(this).siblings('.main-navigation').slideToggle(200);
    });

    // Social buttons
    jQuery('.social-button').on('click', function(e) {
        e.preventDefault();
        var url = jQuery(this).attr('href');
        var title = jQuery(this).attr('title');
        popupwindow(url, title, 550, 450);
    });

    // Stop the page scroll animation if the user scrolls
    jQuery('html, body').bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e) {
        if (e.which > 0 || e.type === "mousedown" || e.type === "mousewheel") {
            jQuery('html, body').stop();
        }
    });
	
	// Inject YouTube API script
	var tag = document.createElement('script');
	tag.src = "//www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

});

function clearContactForm() {
    if (confirm("Are you sure you want to clear all input fields?")) {
        jQuery('#frm-contact')[0].reset();
    }
}

function popupwindow(url, title, w, h) {
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

var homeVideoPlayer;

function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  homeVideoPlayer = new YT.Player('home-video');
}

jQuery(document).on('click', '#home-video-thumbnail', function() {
	jQuery(this).hide();
	var videoContainer = jQuery(this).siblings('.home-video-container');
	videoContainer.show();
	homeVideoPlayer.playVideo();
});
	
