/*global console:false */
/*
 * jQuery paged scroll  - different approach for infinite scroll
 *
 * Copyright (c) 2013 Dmitry Mogilko
 * Licensed under the MIT license.
 */

/*

 TODO : qunit ,simulate scroll - http://stackoverflow.com/questions/6761659/simulate-scroll-event-using-javascript
 TODO  : parameters validation  - step and target are required.
 TODO : think about  giving option of calculating trigger on last element of the binder.
 TODO : make order in package.json
 TODO  : create page with examples,aka demo page in github.
 TODO  :  check bug with scrolling in elements why not called callback ?

 */

(function ($, window, document, undefined) {
    'use strict';

        /*
           Constructor
        */
        $.ajax_scroll = function (element,options) {
            this.timerInterval = -1;
            this.lastDocHeight = 0;
            this.lastScrollPosition = 0;
            this.settings = $.extend($.ajax_scroll.defaults, options);
            var $this = this;
            //bind on scroll
            $(element).on('scroll', function () {
                if ($this.settings.useScrollOptimization) {
                    if ($this.timerInterval === -1) {
                        //$this.debug("Setting timeout:",settings.optimizationTimeout);
                        $this.timerInterval = setTimeout(function () {
                            //$this.debug("Running after timeout:");
                            $this._checkScroll(element, $, window, document, $this.settings);
                            $this.timerInterval = -1;

                        }, $this.settings.checkScrollChange);
                    }
                    else {
                        $this._debug('Ignore this scroll...And saving all the DOM access and calculations');
                    }

                }
                else {
                    $this._checkScroll(element, $, window, document, $this.settings);
                }


            });
        }

        /*
            Plugin defaults
        */
        $.ajax_scroll.defaults = {

            /*
             required
             your  callback which called which will be called with current page number
             */
            handleScroll:function (page, container) {
                return true;
            },

            /*
             required
             amount of pixels or amount of percent of container (calculated to pixel by plugin) from bottom, to start scroll
             */
            triggerFromBottom:'10%',

            /*
             required
             element where content will be inserted
             */
            targetElement:null,

            /*
             optional,default is 0
             page number to start with
             */
            startPage:0,

            /*
             optional
             null means infinite scroll
             */
            pagesToScroll:null,

            /*  optional
             before page hook ,if returns false execution stops
             */
            beforePageChanged:function (page, container) {
                return true;
            },

            /*
             optional
             after page scroll calback
             */
            afterPageChanged:function (page, container) {
                return true;
            },

            /*
             optional
             NOT RECOMMENDED to CHANGE!!!
             default : true
             if scroll optimization used ,plugin will not access DOM each time scroll is triggered and will save a lot of overhead,because of not calling callback logic each time
             */
            useScrollOptimization:true,

            /*
             timeout in milliseconds to use in order to check  if scroll change is significant enough to call the "handleScroll" callback
             */
            checkScrollChange:500,

            /*
                if use debug
             */
            debug : true
        }

        /*
         Use prototype to optimize multiple instances
        */
        $.ajax_scroll.prototype = {

            /*
                plugin logic which check if we need to call the callback    
           */
           _checkScroll:function (element, $, window, document, settings) {
                var $this  = this;
                //if element on which content is inserted became not visible don't do exit
                if (settings.targetElement && !$(settings.targetElement).is(":visible")) {
                    $this._debug("Ignoring the call because binder is not  visible");
                    return;
                }

                var elemHeight = parseFloat($(element).height()) , elemScroll = parseFloat($(element).scrollTop()),
                    isWindow = (element.self === window) , docHeight = isWindow ? parseFloat($(document).height()) : elemHeight,
                    step = (settings.triggerFromBottom.toString().indexOf('%') > -1) ? docHeight / parseFloat(settings.triggerFromBottom.replace('%', '')) : parseFloat(settings.triggerFromBottom);

//                $this._debug("Elem height", elemHeight);
//                $this._debug("Elem scroll", elemScroll);
//                $this._debug("Step is :", step);
//                $this._debug("DocHeight", docHeight);
//                $this._debug("Last element height", $this.lastDocHeight);

                /*
                    calculate  window height + scroll  + step
                */
                var position = isWindow ? elemHeight + elemScroll + step : elemScroll + step;
                var isPos = (position > $this.lastScrollPosition) && (docHeight > $this.lastDocHeight);

                /*
                 understand if we have infinite pages number to scroll and if not, understand we are still not scrolled maximum o page requested.
                 */
                var isPageMax = !settings.pagesToScroll || (settings.pagesToScroll && (settings.startPage < settings.pagesToScroll));
                /*
                 check that we are at the requested scroll position
                 */
                if (position >= docHeight) {
                    /*
                        don't handle scrolling back to top and also check if we got to maximum pages to scroll
                    */
                    if (isPos && isPageMax) {
                        this.lastScrollPosition = position;
                        this.lastDocHeight = docHeight;
                        settings.startPage = settings.startPage + 1;
                        if (settings.beforePageChanged(settings.startPage, element)) {
                            $this._debug("Calling 'handleScroll' callback");
                            if (settings.handleScroll(settings.startPage, element)) {
                                settings.afterPageChanged(settings.startPage, element);
                            }
                        }

                    }

                }
            },///check scroll

            /*
                borrowed from  paul irish infinite scroll : hhttps://github.com/paulirish/infinite-scroll - make use of console safe
            */
            _debug : function(){
                if(!this.settings.debug){return};
                if (typeof console !== 'undefined' && typeof console.log === 'function') {
                    // Modern browsers
                    // Single argument, which is a string
                    if ((Array.prototype.slice.call(arguments)).length === 1 && typeof Array.prototype.slice.call(arguments)[0] === 'string') {
                        console.log( (Array.prototype.slice.call(arguments)).toString() );
                    } else {
                        console.log( Array.prototype.slice.call(arguments) );
                    }
                } else if (!Function.prototype.bind && typeof console !== 'undefined' && typeof console.log === 'object') {
                    // IE8
                    Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
                }
            }


        }

    /*
        create scroll instances
     */
    $.fn.ajax_scroll = function (options) {
        return this.each(function () {
             var instance = new $.ajax_scroll(this,options);
        });
    };


}(jQuery, window, document));
