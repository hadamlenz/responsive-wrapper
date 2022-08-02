# Responsive Wrappers
supply functionality for making a div wrap child elements at responsive breakpoints.  
This repo is a work in progress and should not be used in production just yet

starts with bootstrap 5 breakpoints
you can  add the dist files to the page you are working on 

```
<link rel='stylesheet' id='responsive-wrapper' href="./src/js/responsive-wrapper/dist/responsive-wrapper.css"></script>
<script src="./src/js/responsive-wrapper/dist/responsive-wrapper.js"></script>
```

you can apply the functionality by setting some attributes on the wrapper and children you want to change.  Its really important that all of the elements that you are using have an id attribute.  The script will look for the `responsive-wrapper` class.  The wrapper will wrap the child elements when the current breakpoint up is in the `data-rw-breakpoints`

```
<div id="row-sm" class="responsive-wrapper" data-rw-breakpoints="xs,sm">
    <div id="site-identity">Site itentity</div>
    <div id="site-controls">Site Controls</div>
</div>
```

all the functions are available with responsiveWrapper class

## functions

```
wrap()
```


```
wraps()
```

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
```
import ResponsiveWrapper from './responsive-wrapper/src/classes/class-responsive-wrapper'
```