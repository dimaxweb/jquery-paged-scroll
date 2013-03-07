/*global console:false */
/*
 * Ajax- Scroll
 *
 * Copyright (c) 2013 Dmitry Mogilko
 * Licensed under the MIT license.
 */

/*

 TODO : qunit ,simulate scroll - http://stackoverflow.com/questions/6761659/simulate-scroll-event-using-javascript
 TODO  : parameters validation  - step.
 TODO  : limit callbacks by time  - don't run more than 1 callback during some interval of time.
 TODO : handleScroll can be asynchronous ,so plugin need some identification that request is running  : when scroll callback is
 TODO  : handle multiple plugins listening on window
 TODO  : insert debug function
 TODO  : use prototype because multiple instances can be on page
 TODO : think about  giving option of calculating trigger on last element of the binder

 */

(function ($, window, document, undefined) {
     'use strict';
    // Collection method.
    $.fn.ajax_scroll = function (options) {
            var settings = $.extend({

            /*
                element where final content is inserted
                used to :
                monitor changes to height in order to understand that handleScroll function is done
            */

            binderElement :null,

            /*
             page number to start with
            */
            startPage:0,
            //null means infinite scroll
            pagesToScroll:null,
            //callback
            handleScroll:function (page, container,pageProccesed) {
               return true;
            },
            //before page scroll callback
            beforePageChanged:function (page, container) {
                return true;
            },

            //after page scroll calback
            afterPageChanged:function (page, container) {
//                console.log("After page:", page);
                return true;
            },
            //amount of pixels or amount of percent of container (calculated to pixel by plugin) from bottom, to start scroll
            step:'10%',
            //if scroll optimization used ,plugin will not access DOM each time scroll is triggered (a lot of times,even when you scroll 200px distance),
            //but will calculate after some timeout.
            useScrollOptimization : false,
            //timeout in milliseconds to use
            optimizationTimeout  : 1000

        }, options);



        return this.each(function () {
            //internal check scroll function
            function _checkScroll(element,$,window, document, settings) {
                //if element on which content is inserted became not visible don't do exit
                if(settings.binderElement && !$(settings.binderElement).is(":visible")){
                    console.log("Ignoring call binder is visible");
                    return;
                }

                var elemHeight =  parseFloat($(element).height()) , elemScroll = parseFloat($(element).scrollTop()),
                    isWindow = (element.self === window) , docHeight = isWindow ? parseFloat($(document).height()) : elemHeight,
                    step = (settings.step.toString().indexOf('%') > -1) ? docHeight / parseFloat(settings.step.replace('%', '')) : parseFloat(settings.step);

//                console.log("Elem height", elemHeight);
//                console.log("Elem scroll", elemScroll);
//                console.log("Step is :", step);
//                console.log("DocHeight", docHeight);
//                console.log("Last element height", lastDocHeight);

                 /*
                    calculate  window height + scroll  + step
                 */


                var position = isWindow ? elemHeight + elemScroll + step : elemScroll + step;
                var isPos = (position > lastScrollPosition) && (docHeight  > lastDocHeight);

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
                        lastScrollPosition = position;
                        lastDocHeight  = docHeight;
                        settings.startPage = settings.startPage + 1;
                        if (settings.beforePageChanged(settings.startPage, element)) {
                            console.log("Calling 'handleScroll' callback");
                            if (settings.handleScroll(settings.startPage, element)) {
                                settings.afterPageChanged(settings.startPage, element);
                            }
                        }

                    }

                }
            }///check scroll

            var timerInterval  = -1;
            var lastDocHeight = 0;
            var lastScrollPosition = 0;
            //bind onscroll
            $(this).on('scroll', function () {

                    var element  = this;
                    if(settings.useScrollOptimization){
                        if(timerInterval === -1){
                            //console.log("Setting timeout:",settings.optimizationTimeout);
                            timerInterval = setTimeout(function () {
                                //console.log("Running after timeout:");
                                _checkScroll(element, $, window, document, settings);
                                timerInterval = -1;

                            }, settings.optimizationTimeout);
                        }
                        else{
                            //console.log('Ignore this scroll...And saving all the DOM access and calculations');
                        }

                    }
                    else{
                        _checkScroll(element, $, window, document, settings);
                    }



            });
        });
    };


}(jQuery, window, document));
