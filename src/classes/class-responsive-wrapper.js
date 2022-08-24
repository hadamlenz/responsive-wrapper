/**
 * core class for building responsive wrappers
 */

import ResponsiveWrapperSingle from "./class-responsive-wrapper-single";
import ResponsiveWrapperFactory from "./class-responsive-wrapper-factory";
import ResponsiveWrapperInit from "./class-responsive-wrapper-init";
export default class ResponsiveWrapper {

    init = null;

    iframe = null;

    constructor( options = []) {
        this.iframe = options.iframe ? options.iframe : null;
        
        //detect responsive-wrapper classes in the dom
        if( options.init !== false ){
            let initOptions = [];
            initOptions.iframe ? options.iframe : null;
            this.init = new ResponsiveWrapperInit( initOptions );
        }
    }

    /**
     * create a new ResponsiveWrapperSingle object and return it
     * @param {HTMLElement or String}  if its an HTMLElement it is expected that the element is on the page, 
     * if it's a string, the element will be created
     * @param {Array of HTMLElement} elements that will be wrapped
     * @param {Object} options see options for the class in class-responsive-wrapper-single.js
     * @returns ResponsiveWrapperSingle
     */
    wrap( wrapper, objects, options = [] ){
        if( this.iframe !== null ){
            options.iframe = this.iframe;
        }
        return new ResponsiveWrapperSingle( wrapper, objects, options );
    }

    /**
     * create a new ResponsiveWrapperFactory object and return it.  
     * This allows you to double wrap things like you have to do with bootstrap
     * @param {Array of HTMLElement} wrappers 
     * @param {Array of HTMLElement} objects 
     * @param {Object} options 
     * @returns ResponsiveWrapperFactory
     */
    wraps(wrappers, elements, options=[]){
        if( this.iframe !== null ){
            options.iframe = this.iframe;
        }
        return new ResponsiveWrapperFactory(wrappers, elements, options);
    }

}