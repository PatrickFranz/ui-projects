var caro_items = Array.prototype.slice.call(document.querySelectorAll(".c-item"));
var tm_carousel = document.getElementById('tm-carousel');
var tm_caro_width = 0;
var tm_caro_height = 10;
var tm_opacity_start = 0.75;

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
     if(caro_items[caro_items.indexOf(element) - clickOnImageUpperHalf] !== undefined){
      caro_items.forEach( item =>{
          item._pos -= clickOnImageUpperHalf;
        });
     }
    
  } else{
    while(element._pos !== 0){
      let dir = element._pos < 0 ? 1 : -1;
      caro_items.forEach(function(item){
        item._pos += dir;
        console.log(caro_items);
      });
    }
  }
  relayout();
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
        item.removeAttribute('style');
        item.firstElementChild.removeAttribute('style');
        item.classList.add('transition-newImg');
        item.firstElementChild.classList.add('show-image');
      }
    }); 
  }

onload = function init(){
  var currentPos = caro_items.length -1;
  tm_caro_width = caro_items[0].offsetWidth;

  caro_items.forEach(function(element, index) {
    element._pos = currentPos--; //Reverse positioning order
    element.addEventListener("click", function(event){
      click(event, element);
    });
  });
  relayout();
}

