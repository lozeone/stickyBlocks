# sickyBlocks

* Sticks sidebar blocks with a variable height and width to the available space within their parent container.
* Similar to the right sidebar on facebook.
* Works with fluid layouts.
* Requires jquery Waypoints.js

## demo
http://codepen.io/lozeone/pen/evMpyy

## usage and defaults
```
$(element).stickMultipleBlocks({
  blockElements: '.block', // the elements inside this container element to make sticky
  stuckClass: 'stickyBlock', // class to add to stuck elements should have css position: fixed.
  offset: 0, // offset pixels from the top of the page useful when there is a static top navigation.
  topTrigger: $(element), // the top of this element is the trigger point
  heightEl: 'body', // the element used to determine the available height, typicaly this is the center column of the page.
  threshold: 200 // ammount of pixels to subtract from the height element when determining stickability
});
```
