let caro_items = Array.prototype.slice.call(document.querySelectorAll(".c-item"));
var tm_caro_width = 0;
var tm_caro_height = 10;
var tm_opacity_start = 0.75;
let slideDirection = 1;
let oldItem,
    newItem
    slideDirection;
let is3d = true;

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
function isClickOnUpperHalf(event){
  var imgBox = event.currentTarget.getBoundingClientRect();
  var imgHalf = imgBox.top + ((imgBox.bottom - imgBox.top ) / 2);
  return event.clientY < imgHalf ? 1 : -1;
}

/* 
  Reassigns positions of the elements (_pos) depending on where/what the user clicked.
*/
function clickHandler(event){
  let clickOnImageUpperHalf = undefined;
  newItem = event.currentTarget;
  oldItem = caro_items.find( el => { return el._pos === 0});
  let clonedNode = (document.getElementById(oldItem.id)).cloneNode(true);
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
  is3d ? relayout3d(clonedNode) : relayout(clonedNode);
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
  let clonedNode = (document.getElementById(element.id)).cloneNode(true);
   if(caro_items[caro_items.indexOf(element) - slideDirection] !== undefined){
    caro_items.forEach( item =>{
      item._pos -= slideDirection;
    });
    is3d ? relayout3d(clonedNode) : relayout(clonedNode);
   }
}

function mousemoveHandler(event){
  //Change cursor based on location of mouse on shown img.
  let target = event.currentTarget;
  if(target._pos === 0){
    if(isClickOnUpperHalf(event) === 1){
      target.style.cursor='url("img/scrolldn.svg"), auto';
    } else {
      target.style.cursor='url("img/scrollup.svg"), auto';
    }
  } else {
    target.style.cursor = "pointer";
  }
}

function mouseoverHandler(event){
  let target = event.currentTarget;
  if(target._pos !== 0){
    target.classList.add("hover-select");
  }
}

function mouseleaveHandler(event){
  let target = event.currentTarget;
  if(target._pos !== 0){
    target.classList.remove("hover-select");
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
          transitionAnim2d(clonedNode, item);
        }
      }
    });  
  }



  function relayout3d(clonedNode){
    let item = caro_items.find( anItem => anItem._pos === 0);
    caro_items.forEach(function(item){
      //Calculate new values for translate3d and zIndex
      let translate3d = `0, ${(-40 * item._pos)}px, ${Math.abs(item._pos) * -50}px`;
      let zIndex = `${Math.abs(item._pos) * -1}`;
      let bgOpacity = 1 - (Math.abs(item._pos) / 10);

      item.firstElementChild.classList.remove('fadeIn');
      item.firstElementChild.style.opacity = 0;
      // item.style.opacity = bgOpacity;
      item.style.transform = `translate3d(${translate3d})`;
      item.style.zIndex = `${zIndex}`;
      if(item._pos === 0){
        item.firstElementChild.style.opacity = 1;
        item.style.opacity = 1;
        if(clonedNode){
          transitionAnim3d(clonedNode, item);
        }
      }
    });         
  }

function transitionAnim2d(clonedNode, item){
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

function transitionAnim3d(clonedNode, item){
  item.insertBefore(clonedNode, item.firstElementChild)
  item.style.opacity = '1';
  item.lastElementChild.style.opacity = '0';
  setTimeout(function(){
    item.lastElementChild.style.opacity = 1;
    clonedNode.remove();
  }, 1000)
  if(slideDirection === 1){
    item.firstElementChild.firstElementChild.classList.add('slide-up--img');
  } else {
    item.firstElementChild.firstElementChild.classList.add('slide-down--img');
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
    item.addEventListener('mousemove', mousemoveHandler);
    item.addEventListener('mouseenter', mouseoverHandler);
    item.addEventListener('mouseleave', mouseleaveHandler);
  });
  is3d ? relayout3d() : relayout();
}


