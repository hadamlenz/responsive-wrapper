/**
 * core class for building responsive wrappers
 */

import ResponsiveWrapperSingle from "./class-responsive-wrapper-single";
import ResponsiveWrapperFactory from "./class-responsive-wrapper-factory";
import ResponsiveWrapperInit from "./class-responsive-wrapper-init";
export default class ResponsiveWrapper {

    init = null

    constructor( options = []) {
        //detect responsive-wrapper classes
        if( options.init !== false ){
            this.init = new ResponsiveWrapperInit();
        }
    }

    /**
     * create a new ResponsiveWrapperSingle object and return it
     * @param {*} wrapper 
     * @param {*} objects 
     * @param {*} options 
     * @returns ResponsiveWrapperSingle
     */
    wrap( wrapper, objects, options = [] ){
        return new ResponsiveWrapperSingle( wrapper, objects, options );
    }

    /**
     * create a new ResponsiveWrapperFactory object and return it
     * @param {*} wrapper 
     * @param {*} objects 
     * @param {*} options 
     * @returns ResponsiveWrapperFactory
     */
    wraps(wrappers, elements, options=[]){
        return new ResponsiveWrapperFactory(wrappers, elements, options);
    }

}