import './src/sass/index.scss';

//set the wrapper class on the window
import ResponsiveWrapper from './src/classes/class-responsive-wrapper';
let responsiveWrapper = new ResponsiveWrapper();
window.responsiveWrapper = responsiveWrapper;

//export the usable classes for those that want to build with the library
export { default as ResponsiveWrapper } from './src/classes/class-responsive-wrapper';
export { default as ResponsiveWrapperInit } from './src/classes/class-responsive-wrapper-init';
export { default as ResponsiveWrapperFactory } from './src/classes/class-responsive-wrapper-factory';
export { default as ResponsiveWrapperSingle } from './src/classes/class-responsive-wrapper-single';