// ====================
// Navbar
// ====================
ScrollTrigger.create({
    trigger: ".page-wrapper",
    start: "top+=75 top",
    end: "+=0",
    onEnter: () => $(".navbar_layout").addClass("is-scrolling"),
    onEnterBack: () => $(".navbar_layout").removeClass("is-scrolling"),
});

// Footer Copywrite Year
$('[copyright-year]').text(new Date().getFullYear());

// Hide if collections is empty
$('.w-dyn-empty').parents('[hide-if-empty]').each(function () { $(this).hide() });

// Keep form height on success
$(window).bind("load resize submit", function (e) {
    $('form').each(function () {
        var formHeight = $(this).height();
        $(this).siblings('.w-form-done').css({ 'min-height': formHeight });
    });
});

// ====================
// HubSpot API
// ====================
let hsApiUrl = 'https://api.hsforms.com/submissions/v3/integration/submit/PORTAL-ID/';
let formData = {
    fields: [],
};
let UTMs = ['utm_medium', 'utm_source', 'utm_campaign', 'utm_term', 'utm_content'];

$('[hs-form]').on('submit', function (event) {
    let hsForm = $(this);
    let hsFormID = $(this).attr('hs-form');
    if (hsFormID == undefined) return;
    let hsEndPoint = hsApiUrl + hsFormID;
    let redirectURL = $(this).attr('redirect-url');
    // Add the form data to the formData object
    hsForm.find('[hs-form-field]').each(function () {
        let field = {
            name: $(this).attr('hs-form-field'),
            value: $(this).val(),
        };
        formData.fields.push(field);
    });
    // Add the UTM parameters to the formData object
    UTMs.forEach(utm => {
        let utmValue = new URLSearchParams(window.location.search).get(utm);
        if (utmValue != null) {
            let field = {
                name: `${utm}`,
                value: utmValue,
            };
            formData.fields.push(field);
        }
    });
    console.log('HubSpot Form Data:', formData);
    // Get page information
    let pageName = document.title; // Use the page title as the name
    let pageUrl = window.location.href; // Get the full URL of the page
    let hubspotCookie = document.cookie.match(/(?:^|;\s*)hubspotutk\s*=\s*([^;]*)/);
    let htuk = hubspotCookie ? hubspotCookie[1] : null;
    // Create the hs_context object
    if (htuk) {
        formData.context = {
            hutk: htuk,
            pageUri: pageUrl,
            pageName: pageName,
        };
    }
    // Make a POST request to HubSpot
    fetch(hsEndPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('HubSpot Form Submission Successful:', data);

            const { redirectUri } = data;

            if (redirectURL != undefined) {
                setTimeout(() => {
                    window.location = redirectURL;
                }, 1000);
            } else if (redirectUri != undefined) {
                setTimeout(() => {
                    window.location = redirectUri;
                }, 1000);
            }
        })
        .catch(error => {
            console.error('HubSpot Form Submission Error:', error);
            // Handle error, e.g., show an error message to the user
        });
});

// ====================
// Thumbail Players
// ====================
let thumbPlayers = Plyr.setup((".plyr_thumb"), {
    controls: [],
    blankVideo: "https://cdn.plyr.io/static/blank.mp4",
    resetOnEnd: true
});

$('.thumb-plyr_wrap').each(function (index) {
    // Add an attribute with the index value
    $(this).attr('thumb-plyr', `${index}`);
    // Stop by default
    $(thumbPlayers[index])[0].stop();
});

function playThumbPlyr(plyrWrap, index) {
    let thumbPlayer = $(thumbPlayers[index])[0];
    thumbPlayer.volume = 0;
    thumbPlayer.muted = true;
    thumbPlayer.loop = true;
    let promise = thumbPlayer.play();

    if (gsap.isTweening(plyrWrap)) {
        gsap.killTweensOf(plyrWrap);
    }
    gsap.to(plyrWrap, { opacity: 1, duration: 0.3 });

    if (promise !== undefined) {
        promise.catch(error => {
            console.log("Thumb Auto-play was prevented");
        }).then(() => {
            console.log("Thumb Auto-play started");
        });
    }
    thumbPlayer.play();
}

function stopThumbPlyr(plyrWrap, index) {
    if (gsap.isTweening(plyrWrap)) {
        gsap.killTweensOf(plyrWrap);
    }
    gsap.to(plyrWrap, {
        opacity: 0, duration: 0.3, onComplete: () => {
            $(thumbPlayers[index])[0].stop();
        }
    });
}

$('[plyr-play="scroll"]').each(function () {
    ScrollTrigger.create({
        trigger: $(this),
        start: "top bottom",
        end: "+=0",
        onEnter: () => {
            let thumbPlyrIndex = $(this).attr('thumb-plyr');
            playThumbPlyr($(this), thumbPlyrIndex);
        },
        onLeaveBack: () => {
            let thumbPlyrIndex = $(this).attr('thumb-plyr');
            stopThumbPlyr($(this), thumbPlyrIndex);
        },
    });
});

// ====================
// Swiper Slider
// ====================
$(".swiper_component").each(function () {
    let slidesPerView = $(this).attr("slides-per-view") !== undefined ? $(this).attr("slides-per-view") : "auto";
    if (slidesPerView != "auto") {
        slidesPerView = parseFloat(slidesPerView);
    }
    let followFinger = $(this).attr("follow-finger") !== undefined ? $(this).attr("follow-finger") === "true" : false;
    let speed = $(this).attr("speed") !== undefined ? parseInt($(this).attr("speed")) : 500;
    let autoHeight = $(this).attr("auto-height") !== undefined ? $(this).attr("auto-height") === "true" : false;
    let effect = $(this).attr("effect") !== undefined ? $(this).attr("effect") : "slide"; // slide, fade, flip, coverflow, cards, cube
    let loop = $(this).attr("set-loop") !== undefined ? $(this).attr("set-loop") === "true" : false;
    let loopAdditionalSlides = $(this).attr("loop-additional-slides") !== undefined ? parseInt($(this).attr("loop-additional-slides")) : 0;
    let centeredSlides = $(this).attr("centered-slides") !== undefined ? $(this).attr("centered-slides") === "true" : false;
    const swiper = new Swiper($(this).find(".swiper")[0], {
        effect: effect,
        // fadeEffect: {
        //     crossFade: true
        // },
        // flipEffect: {
        //     slideShadows: false,
        // },
        // coverflowEffect: {
        //     rotate: 30,
        //     slideShadows: false,
        // },
        // cardsEffect: {
        //     // ...
        // },
        // cubeEffect: {
        //     slideShadows: false,
        // },
        slidesPerView: slidesPerView,
        followFinger: followFinger,
        speed: speed,
        autoHeight: autoHeight,
        a11y: true,
        loop: loop,
        loopAdditionalSlides: loopAdditionalSlides,
        centeredSlides: centeredSlides,
        loopAddBlankSlides: true,
        pagination: {
            el: $(this).find(".swiper_bullets-wrapper")[0],
            bulletActiveClass: "is-active",
            bulletClass: "swiper_bullet",
            bulletElement: "button",
            clickable: true
        },
        navigation: {
            nextEl: $(this).find('[swiper-button="next"]')[0],
            prevEl: $(this).find('[swiper-button="prev"]')[0],
            disabledClass: "is-disabled"
        }
    });

    // Make sure the previous slide is visible when the loop is enabled
    if (loop) {
        swiper.slidePrev();
        swiper.slideToLoop(0, 0);
    }

    // Get the current slide and play the thumb video if it has one
    let currentSlide = swiper.slides[swiper.activeIndex];
    $(currentSlide).find('.thumb-plyr_wrap').each(function () {
        ScrollTrigger.create({
            trigger: $(this),
            start: "top bottom",
            end: "+=0",
            onEnter: () => {
                let thumbPlyrIndex = $(this).attr('thumb-plyr');
                playThumbPlyr($(this), thumbPlyrIndex);
            },
        });
    });

    swiper.on('slideChange', function () {
        let currentSlide = swiper.slides[swiper.activeIndex];
        let previousSlide = swiper.slides[swiper.previousIndex];

        // Stop previous slide
        $(previousSlide).find('.thumb-plyr_wrap').each(function () {
            let thumbPlyrIndex = $(this).attr('thumb-plyr');
            stopThumbPlyr($(this), thumbPlyrIndex);
        });

        // Play current slide
        $(currentSlide).find('.thumb-plyr_wrap').each(function () {
            let thumbPlyrIndex = $(this).attr('thumb-plyr');
            playThumbPlyr($(this), thumbPlyrIndex);
        });
    });
});

// Change all slides roles to prevent an accessibility issue
$(".swiper-slide").attr("role", "listitem");

// ====================
// Swiper Mobile
// ====================
function initMobileSwiper(swiperInstance, parent) {
    if (window.innerWidth <= 767 && !swiperInstance) {
        swiperInstance = new Swiper(parent.find('.swiper')[0], {
            slidesPerView: 'auto',
            speed: 500,
            autoHeight: false,
            a11y: true,
            pagination: {
                el: parent.find(".swiper_bullets-wrapper")[0],
                bulletActiveClass: "is-active",
                bulletClass: "swiper_bullet",
                bulletElement: "button",
                clickable: true
            },
            navigation: {
                nextEl: parent.find('[swiper-button="next"]')[0],
                prevEl: parent.find('[swiper-button="prev"]')[0],
                disabledClass: "is-disabled"
            }
        });
    }
    else if (window.innerWidth > 767 && swiperInstance) {
        swiperInstance.destroy(true, true); // Destroys the swiper instance
        swiperInstance = null;
    }
}

$(window).on('resize', function () {
    $(".mobile-swiper_component").each(function () {
        let swiperInstance;
        initMobileSwiper(swiperInstance, $(this));
    });
});

$(window).trigger('resize');

// ====================
// Animated Line
// ====================
$('.animated-line_component').each(function () {
    $(this).find('.animated-line_wrap').each(function () {
        let circle = $(this).find('[animated-line="circle"]');
        let line = $(this).find('[animated-line="line"]');
        let end = $(this).find('[animated-line="end"]');
        let drawFrom = "0%";
        let drawTo = "100%";
        let text = $(this).find('[animated-line="text"]');
        if (line.attr('animated-line-invert') !== undefined) {
            drawFrom = "100% 100%";
            drawTo = "0% 100%";
        }
        let animatedLineTl = gsap.timeline({
            paused: true,
            scrollTrigger: {
                trigger: $(this),
                start: "bottom bottom",
                end: "+=0",
                markers: false,
            }
        });

        animatedLineTl.from(circle, { opacity: 0, duration: 0.3, delay: 0.5 })
            .fromTo(line, { drawSVG: drawFrom }, { drawSVG: drawTo, duration: 0.5 }, ',-=0.15')
            .from(end, { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.3 })
            .from(text, { opacity: 0, duration: 0.3 });
    });
});

$(".accordion-automatic-list").each(function () {
    let items = $(this).find(".accordion-automatic");
    let layout = $(this).find(".accordion-automatic_description-wrap");
    let currentItem = 0;
    let progressFill;
    let timerStarted = false;
    let matchMedia = gsap.matchMedia();
    let isMobile = false;
    // If not first remove the active class
    items.removeClass("is-active");
    items.eq(currentItem).addClass("is-active");
    gsap.set(items.eq(currentItem).find(".accordion-automatic_description-wrap"), { height: "auto" });

    items.on("click", function () {
        if ($(this).hasClass("is-active")) return;
        changeActiveItem($(this).index());
        pauseTimer();
    });

    items.on("mouseenter", function () {
        if (!$(this).hasClass("is-active")) return;
        pauseTimer();
    });
    items.on("mouseleave", function (index) {
        startTimer();
    });

    function changeActiveItem(index) {
        items.removeClass("is-active");
        gsap.to(items.eq(currentItem).find(".accordion-automatic_description-wrap"), { height: "0rem", duration: 0.5, ease: "power2.out" });
        items.eq(index).addClass("is-active");
        currentItem = index;
        gsap.to(items.eq(currentItem).find(".accordion-automatic_description-wrap"), { height: "auto", duration: 0.5, ease: "power2.out" });
    }

    // To prevent the page from jump the timer will just start when the section scrolls into view
    ScrollTrigger.create({
        trigger: $(this),
        start: "top bottom",
        end: "bottom center",
        markers: false,
        onEnter: () => {
            startTimer();
        },
        onEnterBack: () => {
            startTimer();
        },
        onLeave: () => {
            pauseTimer();
        },
        onLeaveBack: () => {
            pauseTimer();
        },
    });

    // Timer
    function startTimer() {
        if (timerStarted || isMobile) return;
        timerStarted = true;
        progressFill = items.eq(currentItem).find(".accordion-automatic_progress-fill");
        gsap.fromTo(progressFill, { width: "0%" }, { width: "100%", duration: 20, ease: "none", onComplete: nextItem });
    }
    function nextItem() {
        let nextItem = currentItem + 1;
        if (nextItem >= items.length) nextItem = 0;
        changeActiveItem(nextItem);
        timerStarted = false;
        startTimer();
    }
    function pauseTimer() {
        timerStarted = false;
        gsap.killTweensOf(progressFill);
    }

    // Media Query
    matchMedia.add("(min-width: 992px)", () => {
        isMobile = false;
        startTimer();
    });

    matchMedia.add("(max-width: 991px)", () => {
        isMobile = true;
        pauseTimer();
    });
});

// ====================
// Inline Player
// ====================
let config = Plyr.setup(('.plyr-inline_video'), {
    controls: ['play', 'progress', 'current-time', 'mute', 'fullscreen'],
    blankVideo: "https://cdn.plyr.io/static/blank.mp4",
    // Disable on mobile
    enabled: !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
    resetOnEnd: false
});
if (config != null) {
    config.muted = false;
    config.volume = 1;
    // Hide thumbnail on click
    $('.inline-plyr').on('click', function () {
        gsap.to('.inline-plyr_thumbnail-wrap', { opacity: 0, duration: 0.3 });
    });
}

// ====================
// Automatic Tabs
// ====================
$(".automatic-tabs_tabs").each(function () {
    let tabLinks = $(this).find(".automatic-tabs_link");
    let currentTabLink = tabLinks.filter(".w--current");
    let progressFill;
    let timerStarted = false;
    let onHover = false;
    let duration = $(this).attr("duration") !== undefined ? parseFloat($(this).attr("duration")) : 10;

    if (tabLinks.length <= 1) return;

    $(this).on("mouseenter", function () {
        onHover = true;
        pauseTimer();
    });

    $(this).on("mouseleave", function () {
        onHover = false;
        startTimer();
    });

    tabLinks.on("click", function () {
        progressFill.width(0);
        currentTabLink = $(this);
        pauseTimer();
        startTimer();
    });

    function startTimer(params) {
        if (timerStarted || onHover) return;
        timerStarted = true;
        progressFill = currentTabLink.find(".automatic-tabs_tab-fill");
        gsap.fromTo(progressFill, { width: "0%" }, { width: "100%", duration: duration, ease: "none", onComplete: nextItem });
    }

    function pauseTimer() {
        timerStarted = false;
        gsap.killTweensOf(progressFill);
    }

    function nextItem() {
        progressFill.width(0);
        let currentTabIndex = currentTabLink.index();
        if (currentTabIndex === tabLinks.length - 1) {
            currentTabLink = tabLinks.first();
        } else {
            currentTabLink = tabLinks.eq(currentTabIndex + 1);
        }
        currentTabLink.trigger("click");
    }

    // To prevent the page from jump the timer will just start when the section scrolls into view
    ScrollTrigger.create({
        trigger: $(this),
        start: "top bottom",
        end: "bottom top",
        markers: false,
        onEnter: () => {
            startTimer();
        },
        onEnterBack: () => {
            startTimer();
        },
        onLeave: () => {
            pauseTimer();
        },
        onLeaveBack: () => {
            pauseTimer();
        },
    });
});

// ====================
// Scrub Marquee
// ====================
$('.scrub-marquee_component').each(function () {
    let list = $(this).find('.scrub-marquee_list');
    let track = $(this).find('.scrub-marquee_track');
    let posX = "-50%";
    list.clone().appendTo(list.parent());
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: $(this),
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
            markers: false
        }
    });

    if ($(this).hasClass('is-direction-reverse')) {
        posX = "50%";
    }

    tl.to(track, { x: posX, duration: 60, ease: "power2.out" });
});

// Static Logos
$('.static-logos_component').each(function () {
    let wrapperDesktop = $(this).find('.static-logos_wrapper');
    let wrapperMobile = wrapperDesktop.clone().appendTo($(this));
    let list = wrapperMobile.find('.static-logos_list');
    let duration = wrapperMobile.attr("am-duration") !== undefined ? parseFloat($(this).attr("am-duration")) : 60;

    list.attr('am-element', 'marquee');
    wrapperMobile.hide();

    list.clone().appendTo(wrapperMobile);
    list.clone().appendTo(wrapperMobile);

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: wrapperMobile,
            start: "top bottom",
            end: "+=0"
        }
    });

    tl.to(wrapperMobile.find('.static-logos_list'), { x: "-100%", duration: duration, ease: "none", repeat: -1 });

    let mm = gsap.matchMedia();
    mm.add("(max-width: 767px)", () => {
        wrapperMobile.css('display', 'flex');
        wrapperDesktop.hide();
        return () => {
            wrapperDesktop.css('display', 'flex');
            wrapperMobile.hide();
        };
    });
});

// ====================
// Sign In
// ====================
$('[sign-in]').on('click', function () {
    $('.navbar-dynamic-content.is-logged-out').hide();
    $('.navbar-dynamic-content.is-logged-in').css('display', 'flex');
});