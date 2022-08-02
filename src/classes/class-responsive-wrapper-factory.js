'use strict';
/**
 * 
 * Author: H. Adam Lenz
 * wrap elements in multiple responsive wrappers
 * 
 */

import ResponsiveWrapperSingle from "./class-responsive-wrapper-single";

export default class ResponsiveWrapperFactory {

    /**
     * An array the ids that are going to be counted and used to make the wrappers
     */
    wrapperIds = [];

    /**
     * An array of arrays or just a plain old array that will become the classes for the wrappers
     */
    wrapperClasses = [];

    /**
     * an array of the wrapper elements that will be used for wrapped around in each element
     */
    wrapperElements = [];

    /**
     * int as wrappers are made, count where we are
     */
    wrapperCount = 0;

    wrapperOptions = [];

    /**
     * an array of wrapper dom elements
     */
    wrappers = [];

    /**
     * an array of ResponsiveWrapperSingle
     */
    wrapperObjects = [];

    /**
     * Set up the class params to make multiple wrappers
     * most of the options are taken from the single class
     * 
     * @param {Array} wrappers - (required) the wrapper will need an ID.  must be an array of strings or Array of dom elements
     * @param {Array} elements - (required) the elements we are going to be wrapping
     * @param {Array of Arrays} options (optional) 
     */
    constructor(wrappers, elements = null, options = []) {

        //we need wrappers
        if (!Array.isArray(wrappers) || !wrappers.length > 0) {
            console.error('wrappers are not here or are not an array')
            return false;
        }

        //if the elements were set we need them here
        if (elements !== null && Array.isArray(elements) && elements.length > 0) {
            //Sanity check: loop thru the elements that are set and return false if one of them is not here
            for (var i in elements) {
                var element = false;
                if (typeof elements[i] === 'string' || elements[i] instanceof String) {
                    //console.log( 'its a string ' + element[i] );
                    element = document.querySelector(elements[i]);
                } else if (elements[i] instanceof Element) {
                    //console.log( element[i] );
                    element = elements[i];
                }

                if (!element) {
                    console.error('element for wrapping ' + elements[i] + ' is not here');
                    return false;
                }
            }

            //elements sanity should be good
            this.wrapperElements = elements;
        }
       

        //loop thru the wrapper and create the wrapper options array and wrapperIds array
        for (var i in wrappers) {

            //setup the wrapperIds to be used int he single function
            if (typeof wrappers[i] === 'string' || wrappers[i] instanceof String) {
                //if its a string it's the ID we are going to need
                //console.log( 'string' )
                this.wrapperIds[i] = wrappers[i];
            } else if (wrappers[i] instanceof Element) {
                //console.log( 'element' )
                //if it's an element it needs an ID
                if (wrappers[i].id) {
                    this.wrapperIds[i] = wrappers[i].id;
                    this.wrappers[i] = wrappers[i];
                } else {
                    return false;
                }
            } else {
                console.error('the wrapper is of type ' + typeof wrappers[i] + ' and cannot be used to wrap');
                return false
            }

            this.wrapperOptions[i] = [];

            //if these are set in options use them, they are optional so no required
            if (options) {
                if (options.breakpoints) {
                    this.wrapperOptions[i]['breakpoints'] = options.breakpoints;
                }

                if (options.wrapper_classes) {
                    this.wrapperOptions[i]['wrapper_classes'] = options.wrapper_classes[i];
                }
            }
        }




        //console.log(this);
        //if we should make and shoudWrap()
        if (options.make !== false) {
            this.make();
        }

        return this;
    }

    /**
     * make the next wrapper
     */
    make() {
        if (this.wrapperIds.length > 0 && this.wrapperCount < this.wrapperIds.length) {
            for (var i in this.wrapperIds) {
                //bail even earlier cause the previous wrapper hasnt been made
                //console.log( this.wrapper_count != i );
                if (this.wrapperCount != i) {
                    console.log('the last wrapper failed to make()');
                    return false;
                }

                let elements = null;
                if (this.wrapperCount == 0 && this.wrapperElements) {
                    //the wrapper elements were set in the function
                    //on the first wrap, we use the child elements
                    elements = this.wrapperElements;
                } else if (this.wrapperCount > 0 && this.wrapperObjects[i - 1]) {
                    //on all the wraps after the first we get the elements from the previously built wrapperObject
                    elements = [this.wrapperObjects[i - 1].wrapper];
                }

                //if we've made it here we should be able to make the wrapper
                //console.log( this.wrappers[i] );
                let thisWrapper = null
                if (this.wrappers.length > 0) {//if we have wrappers
                    thisWrapper = new ResponsiveWrapperSingle(this.wrappers[i], elements, this.wrapperOptions[i]);
                } else if (this.wrapperIds.length > 0) {//we have wrapper IDs
                    thisWrapper = new ResponsiveWrapperSingle(this.wrapperIds[i], elements, this.wrapperOptions[i]);
                }

                if (thisWrapper !== null) {
                    this.wrapperObjects.push(thisWrapper);
                } else {
                    //console.error('wrapper could not be made in the factory');
                    return false;
                }


                //we could probably pass these events on 
                // thisWrapper.on('unwrap.rw.wrapper', function (e) {
                //     console.log(this.wrapper_options[i].wrapper_id + ' has been unwrapped');
                // }.bind(this));

                // thisWrapper.on('wrap.rw.wrapper', function (e) {
                //     console.log(this.wrapper_options[i].wrapper_id + ' has been unwrapped');
                // }.bind(this));

                this.wrapperCount++

                //console.log( this.wrapper_count );

            }



            //console.log( this.wrapper_options[i].wrapper_id )
            // thisWrapper.on('wrap.bs.wrapper', function(e){
            //     console.log(this.wrapper_options[i].wrapper_id + ' has been wrapped' );
            // }.bind(this));

            // thisWrapper.on('unwrap.bs.wrapper', function(e){
            //     console.log(this.wrapper_options[i].wrapper_id + ' has been unwrapped' );
            // }.bind(this));
            //console.log( thisWrapper.isWrapped );

        }
    }
}
