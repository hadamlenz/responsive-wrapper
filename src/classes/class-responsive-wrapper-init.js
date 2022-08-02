/**
 * initialize the responsive wrapper if there are elements on the page that can be used for it
 * we are looking for elemnts with the .responsive-wrapper class that have children or use the data props
 */

import ResponsiveWrapperSingle from "./class-responsive-wrapper-single";
import ResponsiveWrapperFactory from "./class-responsive-wrapper-factory";

export default class ResponsiveWrapperInit {

    constructor() {
        //console.log( 'ResponsiveWrapperInit' );
        //get the possible wrappers that are on the page
        let possibleWrappers = document.querySelectorAll('.responsive-wrapper');
        possibleWrappers = [...possibleWrappers];
        let singleWrappers = [];
        let factoryWrappers = [];

        //for (var i = possibleWrappers.length - 1 ; i >= 0; i--) {
        for (var i in possibleWrappers) {
            //sanity check for all the possible wrappers
            //make sure we have IDs
            if (!possibleWrappers[i].id) {
                continue;
            }

            //make sure we have some kind of children
            //console.log( 'hasChildNodes:' + possibleWrappers[i].hasChildNodes() )
            //console.log( 'hasData' + possibleWrappers[i].hasAttribute('data-rw-group') );
            if (!possibleWrappers[i].hasChildNodes() && !possibleWrappers[i].hasAttribute('data-rw-group')) {
                console.error('we dont have children to wrap');
                continue;
            }

            //the first thing to wrap will always go to singleWrappers
            if (i == 0) {
                singleWrappers[i] = possibleWrappers[0];
            } else {
                //if the last wrapper contains this wrapper
                //we have nested wrappers, we can send these to the factory
                //console.log( "the last wrapper contains this wrapper:" + possibleWrappers[i-1].contains(possibleWrappers[i]) );
                if (singleWrappers[i - 1] && singleWrappers[i - 1].contains(possibleWrappers[i])) {
                    //add the wrappers to the factory array
                    factoryWrappers.push([possibleWrappers[i], possibleWrappers[i - 1]]);
                    //remove the last wrapper from the single warppers array
                    singleWrappers[i - 1] = null;

                } else {
                    singleWrappers[i] = possibleWrappers[i];
                }
            }

        };

        //make single wrappers
        for (var i in singleWrappers) {
            //console.log(singleWrappers[i].id);
            if( singleWrappers[i] && singleWrappers[i] !== null  ){
                //console.log( 'making single wrapper' );
                //console.log( singleWrappers[i] );
                new ResponsiveWrapperSingle(singleWrappers[i]);
            }
        }

        //make wrapper factories
        for (var i in factoryWrappers) {
            //console.log(factoryWrappers[i]);
            new ResponsiveWrapperFactory(factoryWrappers[i]);
        }

    }

}