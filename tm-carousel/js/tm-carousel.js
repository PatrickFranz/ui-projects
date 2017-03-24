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

function click(ev, element){
  var dir = element._pos >= 0 ? 1 : -1;
  console.log(dir);
  
  while(element._pos !== 0){
    caro_items.forEach(function(item){
      item._pos -= dir;
      console.log(caro_items);
    });
  }
  
  relayout();
}

function relayout(){
  caro_items.forEach(function(item){
    if(item._pos !== 0){
      item.classList.add('hide-away');
      item.style.width = `${tm_caro_width - Math.abs(item._pos * caro_items.length)}px`;
      item.style.maxHeight = `${tm_caro_height - Math.abs(item._pos / 2)}px`;
      item.style.opacity = tm_opacity_start - Math.abs(item._pos) / 10;
    } else {
      item.classList.remove('hide-away');
      item.style.width = "100%";
      item.style.maxHeight = "100%";
      item.style.opacity = 1;
    }
  });
}

onload = function init(){
  tm_caro_width = caro_items[0].offsetWidth
  caro_items.forEach(function(element, index) {
    element._pos = index;
    element.addEventListener("click", function(ev){
      click(ev, element);
    });
  });
  relayout();
}

