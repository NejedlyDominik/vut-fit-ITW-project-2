$(document).ready(function() {
    var menu = $("nav > ul");
    var menuIcon = $("#dropdownBtn i");
    var menuButton = $("#dropdownBtn");
    var menuLinks = $("nav a:not(#dropdownBtn)");
    var secLinks = $(".menu > li > a");
    var sections = $($("header, section, footer").get().reverse());
    var subsecLinks = $(".submenu > li > a");
    var subsections = $($(".records > div, #skills .content > div").get().reverse());

    var secLinkDict = {};
    var subsecLinkDict = {};

    // Map segment id to specific link and store it in dictionary.
    function mapLinks(segment, dict, selector){
         id = $(segment).attr("id");
         dict[id] = $(selector + "[href=\\#" + id + "]");
    }

    // Map sections and subsections to their links.
    sections.each(function() {mapLinks(this, secLinkDict, ".menu > li > a")});
    subsections.each(function() {mapLinks(this, subsecLinkDict, ".submenu > li > a")});


    // Remove class from specified element and add another class to next given element.
    function changeClasses(removeFrom, addTo, removeClass, addClass){
        removeFrom.removeClass(removeClass);
        addTo.addClass(addClass);
    }


    // Open or close dropdown menu.
    function dropdownMenuBtn(){
        menu.slideToggle();

        // change icon
        if(menuIcon.hasClass("fa-bars")){
            changeClasses(menuIcon, menuIcon, "fa-bars", "fa-times")
        }
        else{
            changeClasses(menuIcon, menuIcon, "fa-times", "fa-bars")
        }
    }


    // Smooth scroll to specified anchor.
    function smoothScroll(event){
        var hash = this.hash;

        if(hash !== ""){
            event.preventDefault();
            var offsetTop = $(hash).offset().top;

            // close dropdown menu and correct segment offset for sticky navigation bar
            if(menuButton.css("display") !== "none"){
                menu.slideUp();
                changeClasses(menuIcon, menuIcon, "fa-times", "fa-bars");
                offsetTop -= 50;
            }

            // animate scrolling and update hash
            $("html, body").animate({
                scrollTop: offsetTop
            }, 1000, function(){
                window.location.hash = hash;
            });
        }
    }


    // Find current segment and do specified action.
    function checkSegments(windowOffset, segments, links, segmentLinkDict, activeHandler){
        var link = null;

        segments.each(function(){
            var curSec = $(this);

            if(windowOffset > curSec.offset().top){
                // get link relate to current segment
                link = segmentLinkDict[curSec.attr("id")];

                if(!link.hasClass("active")){
                    activeHandler(links, link, "active", "active");
                }

                // break loop
                return false;
            }
        });

        if(link == null){
            links.removeClass("active");
        }
    }


    // Change active section, close previous submenu and open current submenu.
    function handleSubmenu(removeFrom, addTo, removeClass, addClass){
        removeFrom.next(".submenu").slideUp();
        changeClasses(removeFrom, addTo, removeClass, addClass);
        addTo.next(".submenu").slideDown();
    }
    

    // Activate link related to current segment(section, subsection).
    function activeLinks(){
        var windowOffset = $(window).scrollTop() + 1;

        // correct window offset for sticky navigation bar
        if(menuButton.css("display") !== "none"){
            windowOffset += 50;
        }
        
        checkSegments(windowOffset, sections, secLinks, secLinkDict, handleSubmenu);
        checkSegments(windowOffset, subsections, subsecLinks, subsecLinkDict, changeClasses);
    }


    // Set interval on function call and prevent its frequent calls.
    function timer(func, interval){
        var timeoutId;
        var nextCall = 0;

        return function(){
            // get current time
            var now = new Date().getTime();

            // set timeout to function call if it was to early, or call the function immediately
            if(now < nextCall){
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function(){
                    nextCall += interval;                
                    func();
                }, nextCall - now);
            }
            else{
                nextCall = now + interval;
                func();
            }
        };
    }


    menuButton.click(dropdownMenuBtn);
    menuLinks.click(smoothScroll);
    $(window).scroll(timer(activeLinks, 200));
});