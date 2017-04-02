var caro_items = Array.prototype.slice.call(document.querySelectorAll(".c-item"));
var tm_caro_width = 0;
var tm_caro_height = 10;
var tm_opacity_start = 0.75;
let slideDirection = 1;

function compare(a,b) {
  if (a._pos < b._pos)
    return 1;
  if (a._pos > b._pos)
    return -1;
  return 0;
}


/* 
 Checks to see if a click was made on the top-half of the Image
 If the click was in the upper-half return -1
*/
function isClickOnUpperHalf(ev, element){
  var imgBox = element.getBoundingClientRect();
  var imgHalf = imgBox.top + ((imgBox.bottom - imgBox.top ) / 2);
  return ev.clientY < imgHalf ? 1 : -1;
}

/* 
  Reassigns positions of the elements (_pos) depending on where/what the user clicked.
*/
function click(ev, element){
  let clickOnImageUpperHalf = undefined;
  let clickedElement = element;
  let oldEl = caro_items.find( el => { return el._pos === 0});
  if(element._pos === 0){
    clickOnImageUpperHalf = isClickOnUpperHalf(ev, element);
    next(clickOnImageUpperHalf, element);
  } else{
    while(element._pos !== 0){
      let dir = element._pos < 0 ? 1 : -1;
      caro_items.forEach(function(item){
        item._pos += dir;
      });
    }
  }
  relayout();
}

function next(direction, element){
   if(caro_items[caro_items.indexOf(element) - direction] !== undefined){
    caro_items.forEach( item =>{
      item._pos -= direction;
    });
    relayout();
   }
}

function keyHandler(event){
  const slideUp = 1;
  const slideDown = -1;

  switch(event.keyCode)
  {
    case 37: //Right Arrow
    case 38: //Up Arrow
      next(slideUp, event.target);
      break;
    case 39: //Left Arrow
    case 40: //Down Arrow
      next(slideDown, event.target);
      break;
    case 13: //Enter key
    case 32: //Space key
      if(slideDirection === slideDown && !event.target.nextElementSibling){
        slideDirection = slideUp;
      } else
      if(slideDirection === slideUp && !event.target.previousElementSibling){
        slideDirection = slideDown;
      }
      next(slideDirection, event.target);
      break;
  }
}

/**
 * Re-lays out the page by add/removing classes and attributes.
 */
function relayout(){
    caro_items.forEach(function(item){
      if(item._pos !== 0){
        //Style the 'hidden' elements
        item.classList.remove('transition-newImg');
        item.firstElementChild.style.opacity = 0;
        item.style.width = `${tm_caro_width - Math.abs(item._pos * caro_items.length)}px`;
        item.style.maxHeight = `${tm_caro_height - Math.abs(item._pos / 2)}px`;
        item.style.opacity = tm_opacity_start - Math.abs(item._pos) / 10;
      } else {
        item.focus();
        item.removeAttribute('style');
        item.firstElementChild.removeAttribute('style');
        item.classList.add('transition-newImg');
        item.firstElementChild.classList.add('show-image');
      }
    }); 
  }

onload = function init(){
  var currentPos = caro_items.length -1;
  tm_caro_width = caro_items[0].offsetWidth < window.innerWidth ? caro_items[0].offsetWidth : window.innerWidth;

  caro_items.forEach(function(element, index) {
    element._pos = currentPos--; //Reverse positioning order
    element.setAttribute('tabindex', 0);
    element.firstElementChild.setAttribute('width', tm_caro_width);
    element.addEventListener("click", function(event){
      click(event, element);
    });
    element.addEventListener('keyup', keyHandler);
  });
  relayout();
}

