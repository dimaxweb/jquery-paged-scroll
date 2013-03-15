# jquery-paged-scroll  - different approach for infinite scroll.

## Inspiration
Today we have a couple of good jquery "infinite scroll" plugins ,so why I wrote another one ?
###Different approach - for different use case
Most of existing plugins rely on the fact that you already have some numeric paging implemented in order to query it through provided selector for current,next and previous page and loading this page inside some element or calling callback.
For [my project](www.keentour.com) such approach was overhead, because I wanted only to display paged result set,(json returned from public youtube and flickr api's) using the "infinite scroll" interaction design pattern,where plugin will be responsible for calculation of current page according to scroll progress.
I think the plugin will help to easily adopt infinite scroll especially in cases  when working with paged result retrieved through ajax call.

###Perfomance
Performance optimizations -  attaching the handlers to scroll event need to be handled carefully by developer,because it can easily take the browser down.
Don't believe me ? Just take a look on the  [John Resig article](http://ejohn.org/blog/learning-from-twitter),where he explains how Twitter became unusable because of primitive handling of scroll event.

### Multiple plugin instances
Support for multiple plugins on the page listening on the scroll event of the same element,but preserving their own pagination state.
[Example](http://www.keentour.com/content/North-America/United-States/New-York)
On the page we can see 2 tabs ("Videos" and "Photos"),each tab subscribes to window scroll event via the plugin and provides the callback ,but only the the callback of "visible" tab is called.

### Scroll inside element
Support scrolling inside different elements,not only window scroll.
div,p,iframe -  are supported for now.

## Getting Started
Download the [production version][min] or the [development version][max].
[min]: https://raw.github.com//jquery-ajax-scroll/master/dist/ajax-scroll.min.js
[max]: https://raw.github.com//jquery-ajax-scroll/master/dist/jquery-ajax-scroll.js

## Documentation
### Options :
```html
$('.selector').pagedScroll{

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

            //after page scroll callback
            afterPageChanged:function (page, container) {
            //
                return true;
            },
            //amount of pixels or amount of percent of container (calculated to pixels by plugin) from bottom, to start scroll
            step:'10%',
            //if scroll optimization used ,plugin will not access DOM each time scroll is triggered (a lot of times,even when you scroll 200px distance),
            //but will calculate after some timeout.
            useScrollOptimization : false,
            //timeout in milliseconds to use
            optimizationTimeout  : 1000

        }
```

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
