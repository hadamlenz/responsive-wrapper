'use strict';
/**
 * 
 * Author: H. Adam Lenz
 * wrap an element based on the current resposnive breakpoint
 * inspired a bit by jQuery wrapAll and unwrap
 * 
 */
import ResponsiveWrapperBootstrapDetectBreakpoint  from './class-bootstrap-detect-breakpoint';
import EventDispatcher from './class-event-dspatcher';

export default class ResponsiveWrapperSingle {

    /**
     * breakpoints that we are going to break at
     */
    breakpoints = null;

    /**
     * the children elements that are going to go into the wrapper
     * this is an array of dom elements
     */
    childElements = [];

    /**
     * from the bootstrapDetectBreakpoint class
     */
    detector = null;

    /**
     * bool, if we are going to dispatch events
     */
    dispatchEvents = true;

    /**
     * the dispatcher object
     */
    dispatcher = null;

    /**
     * the dom object of an iframe that we will be using for window context
     */
    iframe = null;

    /**
     * if the elements are wrapped in the wrapper
     */
    isWrapped = false;

    /**
     * a dom object used to wrap the children elements
     */
    wrapper = null;

    /**
     * the wrapper classes
     */
    wrapperClasses = null;

    /**
     * the ID of this responsive wrapper on the page so we can target it if we need to 
     */
    wrapperId = null;

    /**
     * Set up the class params and maybe toggle() the wrapper on
     * @param {domObject or String} wrapper (required) we are making the wrapper we need an ID, if we are using one on the page we need the domObject
     * @param {domObject or domObject list} objects a dom object or list of objects that will get wrapped
     * @param {object} options the options used for building the wrapper
     * @param {String or Array} options.breakpoints (optional) the mobile first breakpoint at which to do the wrap
     * @param {Boolen} options.toggle (optional) toggle without having to call it, you can also call it later if you need it made at a different time
     * @param {String or Array} options.wrapper_classes (optional) array or string of classes to apply to the wrapper,
     */
    constructor(wrapper, objects = null, options = []) {
        //console.log( wrapper );
        //make the wrapper
        if (false === this.makeWrapper(wrapper, options)) {
            //return false if we could not make the wrapper
            console.error('could not make the wrapper ' + wrapper);
            return false
        }

        //we should have a wrapperID if we get here
        //console.log(this.wrapperId);

        if (false === this.makeChildren(objects)) {
            //return false if we could not make the childElements  array
            console.error('we need elements to wrap for ' + this.wrapperId);
            return false;
        }

        //we should have childElements if we get here
        //console.log(this.childElements);
        
        //setup a bootstrap breakpoint detector
        let detectorSettings = { dispatchEvent: true };
        if( options.iframe ){
            detectorSettings.iframe = options.iframe;
            //console.log( 'using an iframe for window context');
        }
        this.detector = new ResponsiveWrapperBootstrapDetectBreakpoint( detectorSettings );

        //maybe setup an event dispatcher
        if (this.dispatchEvents) {
            this.dispatcher = new EventDispatcher();
        }

        //if we are gonna make it, lets make it!!
        if (options.toggle !== false) {
            //console.log( 'calling make on initialization for ' + this.wrapperId )
            this.toggle();

            //when the bootstrap detector sends a change
            this.detector.on('change', function (event) {
                //console.log( 'calling make on change for ' + this.wrapperId )
                this.toggle();
            }.bind(this))
        }
        //console.log(this.wrapperId + 'isWrapped:' + this.isWrapped);
        return this;
    }

    /**
    * do the work
    * most dom manipulation should stem from here
    * you can also call this function later if you set make:false in the options
    */
    toggle() {
        //console.log( 'make for:' + this.wrapperId + ' shoudWrap:' + this.shouldWrap() + ' && isWrapped:' + this.isWrapped);
        if (this.shouldWrap() == true && this.isWrapped == false ) { //if it's the right size to wrap and it's not already wrapped we wrap it
            //console.log( 'toggle() wrap' );
            this.wrap();

        } else if (this.shouldWrap() == false && this.isWrapped == true) {//if its not the right size to wrap and its wrapped we unwrap it
            //console.log( 'toggle() unwrap' );
            this.unwrap();

        } else{
           //console.log( 'make failed for:' + this.wrapperId + ' shoudWrap:' + this.shouldWrap() + ' && isWrapped:' + this.isWrapped);
        }
    }

    /**
     * Build the wrapper
     * @param {*} wrapper 
     * @param {*} options 
     * @returns 
     */
    makeWrapper(wrapper, options) {
        //set up the wrapper
        if (typeof wrapper === 'string' || wrapper instanceof String) {
            //the value of wrapper is a string, 

            //make sure the wrapper isn't already on the page, this will cause issues with 2 elemenets with the same ID
            let possibleWrapper = document.querySelector('#' + wrapper);
            if (possibleWrapper) {
                //console.log('wrapper already on page');
                return false;
            }

            //we are going to make this wrapper from scratch
            this.wrapper = document.createElement('div');
            //the string is the ID of the new wrapper
            this.wrapperId = wrapper;
            //maybe set wrapper classes parameter
            this.wrapperClasses = options.wrapper_classes ? options.wrapper_classes : null;
            //maybe set the breakpoints parameter
            this.breakpoints = options.breakpoints ? options.breakpoints : null;
        } else if (wrapper instanceof Element || wrapper instanceof HTMLDivElement || typeof wrapper === 'object' ) {
            //we already have the wrapper on the page, lets use those values for the object
            //make sure it has an ID
            if (wrapper.id) {
                this.wrapperId = wrapper.id;
            } else {
                //if not bail
                console.error('the wrapper element needs an ID for this to work')
                return false;
            }
            //set the wrapper as this.wrapper
            this.wrapper = wrapper;
            this.isWrapped = true;

            //maybe set the breakpoints parameter
            this.breakpoints = options.breakpoints ? options.breakpoints : null;

        } else {
            //we need an ID as a string or Element!!!
            console.error('id is not a string or a dom element: ' + typeof wrapper);

            return false;
        }

        //set wrapper id to the wrapper(s),
        this.setWrapperId();
        //set the wrapper classes
        this.setWrapperClasses();
        //set data-brekaponts attributes, these must be the same for all wrapopers
        this.setBreakpoints();
    }

    /**
     * build the children array
     * @param {array} objects 
     * @returns 
     */
    makeChildren(objects) {
        //we need the elements to wrap or this isn't going to work
        //if objects isnt set
        //console.log( objects );
        if (objects === null || objects.length == 0) {
            //check to see if there is a data-rw-child-group set on the element 
            if (this.wrapper.dataset.rwGroup) {
                let group = this.wrapper.dataset.rwGroup;
                let groupedChildren = []
                //get all the elements with data-rw-child-group
                let possibleGroupedChildren = document.querySelectorAll('[data-rw-child-group]');

                //loop thru and see if they have the group name there
                possibleGroupedChildren.forEach(post => {
                    if (post.getAttribute('data-rw-child-group').indexOf(group) > -1) {
                        groupedChildren.push(post);
                    }
                });

                //if the groupedChildren array has elements those are what we are after
                if (groupedChildren.length > 0) {
                    this.childElements = [...groupedChildren];
                }

            } else if (this.wrapper.hasChildNodes()) {  //check to see if the element has child nodes
                //get the children
                let children = this.wrapper.children;
                //convert the children node list to an array with the spread operator.
                this.childElements = [...children];
            } else {
                return false
            }

        } else {

            //if it's not an array put it into an array
            if (!Array.isArray(objects)) {
                objects = [objects];
            }

            //ensuring the elements are on the page are the job of the user
            for (var i in objects) {
                if (objects[i] == null) {
                    //console.log('the element ' + options.elements[i] + ' is not here, failing quietly');
                    return false;
                }

                //set the children into the array
                //we could maybe save the position of the child here so that we can put it back in place when we unwrap
                this.childElements = [...this.childElements, objects[i]];
            }

        }
        //console.log( this.childElements );
        //return if we got some children elements
        if (this.childElements.length > 0) {
            return true
        } else {
            return false;
        }
    }


    /**
     * wraps the elements
     * @returns {boolean} true or false if the wrapped elements were added to the page
     */
    wrap() {
        //its already wrapped
        //we dont need to wrap it any further
        if (this.isWrapped) {
            //console.log('we dont need to wrap it any further');
            return false;
        } else {
            //console.log('wrapping: ' + this.wrapperId);
        }

        //make sure we have elements here 
        //this is a double check
        if (this.childElements === null || this.childElements.length <= 0) {
            //console.log('no elements');;
            return false;
        }

        //get the elements to be wrapped
        let els = this.childElements; //console.log( this.childElements.length );
        //the first element to be wrapped
        //console.log( els );
        let first = Array.isArray(els) && els.length > 0 ? els[0] : els;
        //console.log( first );
        //console.log( first );
        //check to see if the first has siblings
        let sibling = first.nextElementSibling;
        //console.log( sibling );
        //the parent div
        let parent = first.parentNode;
        //console.log( parent );

        //dont insert or append if it's already there
        //it was probably alredy on the page onload
        if (!this.wrapper.contains(parent)) {
            //we need the parent
            //if we have siblings we need to insert the wrapper before the siblings
            if (sibling !== false && sibling !== null && parent !== false && parent !== null) {
                parent.insertBefore(this.wrapper, sibling);
                //console.log( 'wrapper ' + this.wrapperId + ' inserted in parent before sibling' );
            } else if (parent !== false && parent !== null) {
                //add the wrapper as the first thing in the element
                parent.appendChild(this.wrapper);
                //console.log( 'wrapper ' + this.wrapperId + ' inserted in parent' );
            } else {
                //console.log( 'wrapper ' + this.wrapperId + ' not inserted.  parent and sibling are null' );
                //console.log( parent );
                //console.log( sibling );
                return false;
            }
        } else {
            console.error( 'the wrapper contains the parent, sanity is lost' );
            return false;
        }




        //the wrapper is placed, move the els into it
        for (var i in els) {
            let elContent = els[i];
            //console.log( 'adding the child' + elContent);
            this.wrapper.appendChild(elContent);
        }

        this.isWrapped = true;

        //dispatch the wrap.rw.wrapper event
        if (this.dispatchEvents && this.dispatcher !== null) {
            this.dispatcher.dispatch('wrap.rw.wrapper', this.wrapperId);
        }

        return true;
    }

    /**
     * unwraps the element
     */
    unwrap() {
        //its already unwrapped
        //we dont need to unwrap it any further
        if (!this.isWrapped) {
            //console.log('we dont need to unwrap it any further');
            return false;
        } else {
            //console.log('unwrapping:' + this.wrapperId);
        }

        //get the wrapper's parent
        let parent = this.wrapper.parentNode;

        //add the children before the wrapper
        //this might need some more conditionas later to deal with ordering of elements
        while (this.wrapper.firstChild) {
            parent.insertBefore(this.wrapper.firstChild, this.wrapper);
        }

        //remove the wrapper
        this.wrapper.remove();

        //we are not wrapped now
        this.isWrapped = false;

        //dispatch the unwrap.rw.wrapper event
        if (this.dispatchEvents && this.dispatcher !== null) {
            this.dispatcher.dispatch('unwrap.rw.wrapper', this.wrapperId);
        }

        return true;

    }

    /**
    * sets the ID of the wrapper
    */
    setWrapperId() {

        //check if the wrapper doesn't already have an ID
        if (this.wrapper.id) {
            //console.log( 'already has an id of ' + this.wrapperId );
            return;
        }

        //double check that the ID is a string
        if (this.wrapperId && (typeof this.wrapperId === 'string' || this.wrapperId instanceof String)) {
            this.wrapper.setAttribute('id', this.wrapperId);
        } else {
            //console.log('id is not a string');
        }
    }

    /**
     * add classes to the wrapper
     * @param {array or string} classes optional to add to the wrapper after defining the class
     */
    setWrapperClasses(classes = []) {
        let classes_array = []
        //make sure the wrapper has the responsive-wrapper class
        if (!this.wrapper.classList.contains('responsive-wrapper')) {
            this.wrapper.classList.add('responsive-wrapper');
        }

        //maybe add the wrapper classes
        if (this.wrapperClasses && Array.isArray(this.wrapperClasses)) {
            classes_array = [...classes_array, ...this.wrapperClasses];
        }

        //if we added any extra classes later
        if (classes.length > 0) {
            classes_array = [...classes, ...classes_array];
        }

        //loop thru the classes_array and add the classes to the element if we dont already have them
        if (classes_array.length > 0) {
            classes_array.forEach(function (thisClass) {
                if (!this.wrapper.classList.contains(thisClass)) {
                    this.wrapper.classList.add(thisClass);
                }
            }.bind(this));
        }
    }

    /**
     * sets the data-breakpoint attribute of the wrapper to be used to destroy the wrap later
     */
    setBreakpoints() {
        //get the breakpoints from the element if it has them set
        //console.log( this.wrapper.dataset );
        if (this.wrapper.dataset.rwBreakpoints) {
            if (this.wrapper.dataset.rwBreakpoints == 'all') {
                this.breakpoints = 'all'
            } else {
                this.breakpoints = this.wrapper.dataset.rwBreakpoints.split(',');
            }
        } else {
            //if they are not set in the element
            //we need to set the breakpoints based on the options array
            if (Array.isArray(this.breakpoints) && this.breakpoints.length > 0) {
                this.wrapper.setAttribute('data-rw-breakpoints', this.breakpoints.join());
            } else if (typeof this.breakpoints === 'string' || this.breakpoints instanceof String) {
                this.wrapper.setAttribute('data-rw-breakpoints', this.breakpoints);
            } else {
                this.wrapper.setAttribute('data-rw-breakpoints', 'all');
            }
        }
    }

    /**
     * 
     * @returns if we should wrap or not depending on the breakpoints set
     */
    shouldWrap() {
        //if no breakpoints are set or breakpoints are set to all we always wrap
        if (this.breakpoints == null || this.breakpoints == 'all') {
            return true;
        }

        //return true
        //if the current breakpoint fromt he detector
        //is in the array of breakpoints set in the wrapper
        //console.log( this.detector.breakpoints.up.name );
        if (this.breakpoints.includes(this.detector.breakpoints.up.name)) {
            return true;
        }

        //we satisfied no condition, return false
        return false;

    }

    /**
     * Pass the on method onto the dispatcher
     * @param {*} event 
     * @param {*} callback  
     */
    on(event, callback) {
        if (this.dispatchEvents && this.dispatcher !== null) {
            this.dispatcher.on(event, callback)
        }
    }

    /**
    * Pass the off method onto the dispatcher
    * @param {*} event 
    * @param {*} callback  
    */
    off(event, callback) {
        if (this.dispatchEvents && this.dispatcher !== null) {
            this.dispatcher.off(event, callback)
        }
    }

}