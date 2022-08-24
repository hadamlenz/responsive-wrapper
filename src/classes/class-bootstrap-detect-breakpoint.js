'use strict';
/**
 * Author: H. Adam Lenz
 * Inspired by: https://github.com/shaack/bootstrap-detect-breakpoint
 * 
 */

/* for this to work with bootstrap 5 you need to add the following to scss that has access to the bootstrap vars
:root {
    $breakpoints: ();
    @each $name,$value in $grid-breakpoints {
        --bs-breakpoint-#{$name}: #{$value};
        $breakpoints: append($breakpoints,$name,$separator: comma);
    }
    --bs-breakpoints:#{$breakpoints};
}
*/

import ResponsiveWrapperEventDispatcher from './class-event-dspatcher';

export default class ResponsiveWrapperBootstrapDetectBreakpoint {

    breakpointValues = null;

    dispatchTheEvent = false;

    dispatcher = null;

    breakpoints = { up: null, down: null };

    events = [];

    iframe = null;

    window = null;

    /**
     * 
     * @param {object} options the options used for building the object
     * @param {bool} options.dispatchEvent - if we want to dispact the events, dont make the dispatcher if you aren't going to dispatch events
     * @param {bool} options.setBodyClasses - if want to change the body class to represent the current breakpoint, you should only be setting the body class 
     * @param {Element} options.iframe - if we are looking at the iframe instead of the window, add the iframe dom object
     */
    constructor(options) {

        //if we are setting the iframe eleement we are changing te context of window to be the iframe window conteext
        if( options.iframe ){
            //console.log( options.iframe );
            this.iframe = options.iframe;
            this.window = options.iframe.contentWindow;
        } 

        if( this.window == null ){
            this.window = window;
        }

        this.dispatchTheEvent = options.dispatchEvent === true ? true : false;

        if( this.dispatchTheEvent ){
            this.dispatcher = new ResponsiveWrapperEventDispatcher();
        }
        // this.setBodyClasses = options.setBodyClasses === true ? true : false;

        // cache the breakpoint values and detect opening values on first call
        if (this.breakpointValues == null) {
            this.setBreakpointValuesObject();
        }

        this.detectBreakpoints();
    }

    /**
     * build the object that defines the current breakpoints
     * this is all grabbed from the :root element
     */
    setBreakpointValuesObject() {
        this.breakpointValues = []

        //get the breakpoint names from the css vars
        let breakpointNamesString = window.getComputedStyle(document.documentElement).getPropertyValue('--bs-breakpoints');

        if (!breakpointNamesString) {
            console.error('--bs-breakpoints have not been set correctly');
            return false;
        } else {
            //console.log(breakpointNamesString);
        }
        let breakpointNames = breakpointNamesString.split(',');
        let i = breakpointNames.length
        //console.log( breakpointNames );
        //build the array of breakpoints
        //the array is built from large to small
        for (const breakpointName of breakpointNames) {
            i--;
            let cssVar = "--bs-breakpoint-" + breakpointName.trim();
            //console.log(cssVar);
            const value =  this.window.getComputedStyle(document.documentElement).getPropertyValue(cssVar)
            //console.log(value);
            if (value) {
                this.breakpointValues[i] = { name: breakpointName.trim(), index: i, value: value }
            }
        }

        //console.log(this.breakpointValues);
    }

    /**
     * set the initial breakpoint
     * https://webdevetc.com/blog/matchmedia-events-for-window-resizes/
     */
    detectBreakpoints() {
        let _self = this;
        let length = Object.keys(this.breakpointValues).length;

        if (this.breakpointValues && length > 0) {

            //set the value for breakpoints.up
            if (this.breakpoints.up == null) {
                //console.log('set the up breakpoint, window is larger than this');
                for (let i = 0; i < length; i++) {
                    const upMediaQuery = '(min-width: ' + this.breakpointValues[i].value + ')';
                    const upMediaQueryList = this.window.matchMedia(upMediaQuery);
                    //we found a match
                    if (upMediaQueryList.matches === true) {
                        //console.log('window is larger than ' + this.breakpointValues[i].value)
                        this.breakpoints.up = this.breakpointValues[i];
                        break;
                    }
                }
            }


            //set the value for breakpoints.down
            if (this.breakpoints.down == null) {
                //console.log('set the down breakpoint. window is smaller than this');
                for (let i = length - 1; i >= 0; i--) {
                    const downMediaQuery = '(max-width: ' + this.breakpointValues[i].value + ')';
                    const downMediaQueryList = this.window.matchMedia(downMediaQuery);
                    //we found a match
                    if (downMediaQueryList.matches === true) {
                        //console.log('window is smaller than ' + this.breakpointValues[i].value)
                        this.breakpoints.down = this.breakpointValues[i];
                        i = 0;
                    }
                }
                if (this.breakpoints.down == null) {
                    //console.log('window is larger than any breakpoints');
                    this.breakpoints.down = {name:'max'};
                }
            }

            //dispatcht the change event if you set it that way when making the object
            //console.log( this.dispatchTheEvent );
            if( this.dispatchTheEvent && this.dispatcher !== null ){
                this.dispatcher.dispatch('change', _self.breakpoints);
            }
            

            //set a matchMedia for when the screen is smaller than the breakpoints.up
            const mediaQueryChangeUp = '(min-width: ' + this.breakpoints.up.value + ')';
            const mediaQueryListChangeUp = this.window.matchMedia(mediaQueryChangeUp);

            //set a matchMedia for when the screen is larger than the breakpoints.down
            const mediaQueryChangeDown = '(min-width: ' + this.breakpoints.down.value + ')';
            const mediaQueryListChangeDown = this.window.matchMedia(mediaQueryChangeDown);

            //this needs to be it's own function so we can remove it
            function crossMediaQueryThreshold(event) {
                _self.breakpoints = { up: null, down: null };
                //remove the listeners that use the old values
                //they will be added back when the function is run again
                mediaQueryListChangeDown.removeEventListener('change', crossMediaQueryThreshold);
                mediaQueryListChangeUp.removeEventListener('change', crossMediaQueryThreshold);
                //redetect the breakpoints
                _self.detectBreakpoints();
            }

            //listen for the changes
            mediaQueryListChangeUp.addEventListener('change', crossMediaQueryThreshold);
            mediaQueryListChangeDown.addEventListener('change', crossMediaQueryThreshold);

        }
    }

    /**
     * Pass the on method onto the dispatcher
     * @param {*} event 
     * @param {*} callback  
     */
    on(event, callback){
        if( this.dispatchTheEvent && this.dispatcher !== null ){
            this.dispatcher.on(event, callback)
        }
    }

     /**
     * Pass the off method onto the dispatcher
     * @param {*} event 
     * @param {*} callback  
     */
    off(event, callback) {
        if( this.dispatchTheEvent && this.dispatcher !== null ){
            this.dispatcher.off(event, callback)
        }
    }
}