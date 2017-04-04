var caro_items = Array.prototype.slice.call(document.querySelectorAll(".c-item"));
var tm_caro_width = 0;
var tm_caro_height = 10;
var tm_opacity_start = 0.75;
let slideDirection = 1;
let oldItem,
    newItem
    slideDirection;

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
function clickHandler(event){
  let clickOnImageUpperHalf = undefined;
  newItem = event.currentTarget;
  oldItem = caro_items.find( el => { return el._pos === 0});
  if(newItem._pos === 0){
    slideDirection = isClickOnUpperHalf(event, newItem);
    next(newItem);
    return;
  } else{
    while(newItem._pos !== 0){
      slideDirection = newItem._pos < 0 ? -1 : 1;
      caro_items.forEach(function(item){
        item._pos -= slideDirection;
      });
    }
  }
  relayout((document.getElementById(oldItem.id)).cloneNode(true));
}

/**
 * 
 * @param {mouseevent} event 
 */
function keyHandler(event){
  const slideUp = 1;
  const slideDown = -1;

  switch(event.keyCode)
  {
    case 37: //Right Arrow
    case 38: //Up Arrow
      slideDirection = slideUp
      next(event.target);
      break;
    case 39: //Left Arrow
    case 40: //Down Arrow
      slideDirection = slideDown;
      next(event.target);
      break;
    case 13: //Enter key
    case 32: //Space key
      if(slideDirection === slideDown && !event.target.nextElementSibling){
        slideDirection = slideUp;
      } else
      if(slideDirection === slideUp && !event.target.previousElementSibling){
        slideDirection = slideDown;
      }
      next(event.target);
      break;
  }
}


/** Move the carousel ahead/back by one.
 *
 * @param {node} element 
 */
function next(element){
   if(caro_items[caro_items.indexOf(element) - slideDirection] !== undefined){
    caro_items.forEach( item =>{
      item._pos -= slideDirection;
    });
    relayout((document.getElementById(element.id)).cloneNode(true));
   }
}


/**
 * Re-lays out the carousel.
 */
function relayout(clonedNode){
    caro_items.forEach(function(item){
      if(item._pos !== 0){
        //Style the 'hidden' elements
        item.firstElementChild.classList.remove('fadeIn');
        item.firstElementChild.style.opacity = 0;
        item.style.width = `${tm_caro_width - Math.abs(item._pos * caro_items.length)}px`;
        item.style.maxHeight = `${tm_caro_height - Math.abs(item._pos / 2)}px`;
        item.style.opacity = tm_opacity_start - Math.abs(item._pos) / 10;
      } else {
        item.focus();
        if(clonedNode){
          transitionAnim(clonedNode, item);
        }
      }
    });  
  }

function transitionAnim(clonedNode, item){
  item.appendChild(clonedNode);
  item.firstElementChild.style.position = 'absolute';
  item.style.opacity = '1';
  item.firstElementChild.style.opacity = '1';
  item.style.width = '100%';
  item.style.maxHeight = '100%';
  setTimeout(function(){
    item.firstElementChild.style.position = 'relative';
    clonedNode.remove();
  }, 1500);
  item.firstElementChild.classList.add('fadeIn');
  if(slideDirection === -1){
    item.lastElementChild.classList.add('slide-up--img');
  } else {
    item.lastElementChild.classList.add('slide-down--img');
  }
}


onload = function init(){
  var currentPos = caro_items.length -1;
  tm_caro_width = caro_items[0].offsetWidth < window.innerWidth ? caro_items[0].offsetWidth : window.innerWidth;

  caro_items.forEach(function(item, index) {
    item._pos = currentPos--; //Reverse positioning order
    item.setAttribute('tabindex', 0);
    item.firstElementChild.setAttribute('width', tm_caro_width);
    item.addEventListener("click", function(event){
      clickHandler(event);
    });
    item.addEventListener('keyup', keyHandler);
  });
  relayout();
}

