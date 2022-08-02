# Responsive Wrappers
supply functionality for making a div wrap child elements at responsive breakpoints

starts with bootstrap 5 breakpoints
you can  add the dist files to the page you are working on 
`<link rel='stylesheet' id='responsive-wrapper' href="./src/js/responsive-wrapper/dist/responsive-wrapper.css"></script>`
`<script src="./src/js/responsive-wrapper/dist/responsive-wrapper.js"></script>`

all the functions are available with responsiveWrapper

## functions

```wrap()```


```wraps()```

you can build it with whatever you like using $grid-breakpoints building into your project

```
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

you can also import the dist css file into scss
`@import '../js/responsive-wrapper/dist/responsive-wrapper.css';`

this adds the responsive breaks points on the root like


```
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
which is really all that's needed for the library to detect where the breakpoints are set


you can use the JavaScript class directly by importing it into you project
`import ResponsiveWrapper from './responsive-wrapper/src/classes/class-responsive-wrapper'`


```
let smPlusWrapper = new ResponsiveWrapper( topContainer, [siteIdentity, siteControls] );
let topRowWrapper = new ResponsiveWrapper( topRow );
let topContainerWrapper = new ResponsiveWrapper( topContainer );
```

```
new responsiveWrapper([siteIdentity, siteControls], 'top-row', {
    wrapper_classes: ["theme-row"],
    breakpoints: ['xs', 'sm'],
});
```

```
 new responsiveWrappers({
        breakpoints: ['all'],
        make: true,
        elements: ['#theme-header.header-varient-hamburger #search', '#theme-header.header-varient-hamburger #primary-nav', '#theme-header.header-varient-hamburger #secondary-nav'],
        wrapper_ids: ['bottom-row','bottom-container'],
        wrapper_classes: [["theme-row"],["theme-container"]]       
    });
```


```
<div id="<?php echo $varient ?>-top-row-sm" class="theme-row responsive-wrapper" data-rw-group="top-sm" data-rw-breakpoints="xs,sm">
    <div id="site-identity" data-rw-child-group="top-sm">Site itentity</div>
    <div id="site-controls" data-rw-child-group="top-sm">Site Controls</div>
</div>
```