# Responsive Wrappers
supply functionality for making a div wrap child elements at responsive breakpoints.   It defaults to the bootstrap 5 breakpoints.  
This repo is a work in progress and should not be used in production just yet.

Todo:
* Make it available with NPM
* Testing testing testing
* Test if this works without bootstrap
* build examples for https://htmlpreview.github.io/

you can include the distribution files to the page you are working on 

```js
<link rel='stylesheet' id='responsive-wrapper' href="./src/js/responsive-wrapper/dist/responsive-wrapper.css"/>
<script src="./src/js/responsive-wrapper/dist/responsive-wrapper.js"></script>
```

you can apply the functionality by setting some attributes on the wrapper and children you want to change.  Its really important that all of the elements that you are using have an id attribute.  The script will look for the `responsive-wrapper` class.  The wrapper will wrap the child elements when the current breakpoint up is in the `data-rw-breakpoints`.  For the below example the wrapper will wrap the 2 elements when `0 < width < 768px` because xs is 0 - 576 and sm is 577 to 768.

```html
<div id="row-sm" class="responsive-wrapper" data-rw-breakpoints="xs,sm">
    <div id="site-identity">Site itentity</div>
    <div id="site-controls">Site Controls</div>
</div>
```

todo: add more here descibing grouping without having to use the children of a wrapper

## functions

The functions are available with `responsiveWrapper` object if you added the scripts and styles to the page.

```js
/**
 * create a new ResponsiveWrapperSingle object and return it
 * @param {HTMLElement or String} wrapper.  if its an HTMLElement 
 * it is expected that the element is on the page, if it's a string, the element will be created
 * @param {Array of HTMLElement} elements that will be wrapped
 * @param {Object} options see options for the class in class-responsive-wrapper-single.js
 * @returns ResponsiveWrapperSingle
 */
responsiveWrapper.wrap(wrapper, objects, options = [])
```

```js
/**
 * create a new ResponsiveWrapperFactory object and return it.  
 * This allows you to double wrap things like you have to do with bootstrap
 * @param {Array of HTMLElement} wrappers 
 * @param {Array of HTMLElement} objects 
 * @param {Object} options 
 * @returns ResponsiveWrapperFactory
 */
responsiveWrapper.wraps(wrappers, elements, options=[])
```

## Building Styles
you can build the styles with whatever breakpoints you like using the $grid-breakpoints css var like bootstrap 5 does

```scss
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
)

@import './responsive-wrapper/src/sass/_responsive-wrapper.scss';
```

you can also import the dist css file into you scss if you are good with the defaults
`@import './responsive-wrapper/dist/responsive-wrapper.css';`

this adds the responsive breaks points as css variables on the root which is really all that's needed for the library to detect where the breakpoints are set.  I'm hoping this can somehow work with the WordPress block editor when breakpoints are added to theme.json

```css
root {
    --bs-breakpoint-xs: 0;
    --bs-breakpoint-sm: 576px;
    --bs-breakpoint-md: 768px;
    --bs-breakpoint-lg: 992px;
    --bs-breakpoint-xl: 1200px;
    --bs-breakpoint-xxl: 1400px;
    --bs-breakpoints: xs, sm, md, lg, xl, xxl;
}
```

## Building and working with the scripts

you can use the JavaScript class directly by importing it into you project
```js
import { ResponsiveWrapper } from './responsive-wrapper/responsive-wrapper'
let responsiveWrapper = new ResponsiveWrapper();
```
if you've linked the distribution files to the page you can skip this part... a new `responsiveWrapper` is available at `window.responsiveWrapper`

if you want to use the scripts directly you should get and verify all your elements on the page
```js
//make sure the dom is loaded
document.addEventListener("DOMContentLoaded", function () {
    //get the elements for wrapping
    let el1 = document.querySelector('#element-one');
    let el2 = document.querySelector('#element-two');

    //make sure the elements exist
    if( el1 && el2 ){
        //build a wrapper, making a new div with the id #my-new-wrapper using the 2 elements from above
        responsiveWrapper.wrap('my-new-wrapper',[el1,el2]{
            breakpoints: ['md', 'lg', 'xl', 'xxl'],
        })
    }
});
```

You can also directly import the different classes and work with the functionality that way

```js
import { ResponsiveWrapperSingle } from './responsive-wrapper/responsive-wrapper';
let rwSingle = new ResponsiveWrapperSingle( wrapper, objects = null, options = [] );
```

Look to the class files for more explination on using the classes directly.  they are documented well

## Building
the project is built with [@wordpress/scripts](https://github.com/WordPress/gutenberg/blob/9e3767cc217542d4e4926280a91feb584b3f7a7b/packages/scripts/README.md) because this is ulimatly meant for WordPress and it makes life simple...  Just one entry devDependencies and a lite webpack.config.js file.  

to build the dist `npm install` and then `npm run build` .  please contribute

...more to come