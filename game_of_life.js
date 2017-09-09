var grid;
var grid_l;
var canvas;
var gfx;

var SCALE =5;
var WIDTH = 160;
var HEIGHT = 90;

var BRUSH_SIZE = 2;

function Array2D(width,height){
  var g;
  g = new Array(width);
  for(x = 0; x<width; x++){
    g[x] = new Array(height);
  }

  return g;
}

function init(){

  canvas = {};
  grid = {};
  gfx = {};



  canvas = document.getElementById("frame");
  gfx = canvas.getContext("2d");

  HEIGHT = Math.ceil(document.body.scrollHeight / SCALE);
  WIDTH = Math.ceil(document.body.scrollWidth / SCALE);

  canvas.width = WIDTH * SCALE;
  canvas.height = WIDTH * SCALE;



  grid = Array2D(WIDTH*HEIGHT);



  canvas.addEventListener('click', function(e) {

      // use pageX and pageY to get the mouse position
      // relative to the browser window

      var mouse = {
          x: e.pageX - canvas.getBoundingClientRect().left,
          y: e.pageY - canvas.getBoundingClientRect().top,
      }

      grid_l = true;
      var x = Math.ceil(mouse.x/SCALE);
      var y = Math.ceil(mouse.y/SCALE);
      for(var xx = -BRUSH_SIZE/2; xx <= BRUSH_SIZE/2; xx++){
        for(var yy = -BRUSH_SIZE/2; yy <= BRUSH_SIZE/2; yy++){
          grid[x+xx*2][y+yy*2]=true;
        }
      }

      grid_l = false;

      // now you have local coordinates,
      // which consider a (0,0) origin at the
      // top-left of canvas element
  }, false);

}


function cell(x, y){
  if(x == WIDTH){
      return true;
  }
  if(y == HEIGHT){
      return true;
  }
  if(x == -1){
       return true;
  }
  if(y == -1) {
       return true;
  }

  return grid[x][y];
}


//randomly populate grid
function generate(density) {
  grid_l = true; // signalise that the grid is being manipulated

  // grid populataion
  for(x = 0; x<WIDTH; x++){
    for(y = 0; y<HEIGHT; y++){
      grid[x][y]=Math.random() < density;
    }
  }

  grid_l = false; // signalise that the grid is no longer manipulated
}

//render grid
function renderGrid() {

  if(grid_l){
    return; // dont render if grid is being manipulated
  }

  gfx.clearRect(0,0,WIDTH*SCALE,HEIGHT*SCALE); //clear the canvas

  // iterate through grid
  for(x = 0; x<WIDTH; x++){
    for(y = 0; y<HEIGHT; y++){
      // draw filled out cells as black
      if(cell(x,y)){
        if(cell(x,y-1)){
          gfx.fillStyle="#00aaaa"
        } else {
          gfx.fillStyle="#00fafa"
        }
      } else {
        gfx.fillStyle="#000000"
      }
      gfx.fillRect(x*SCALE,y*SCALE,SCALE,SCALE);
    }
  }
}

function iterate() {
  var grid_n = Array2D(WIDTH,HEIGHT);

  for(x = 0; x<WIDTH; x++){
    for(y = 0; y<HEIGHT; y++){

      if(cell(x,y)){
        if(!cell(x,y+1)) grid_n[x][y+1] = true;
        else if(!cell(x+1,y+1)&&!cell(x-1,y+1)){
          if(Math.random() > 0.5) grid_n[x+1][y+1] = true;
          else grid_n[x-1][y+1] = true;
        } else if(!cell(x+1,y+1)){
          grid_n[x+1][y+1] = true;
        } else if(!cell(x-1,y+1)){
          grid_n[x-1][y+1] = true;
        } else {
          grid_n[x][y] = true;
        }
      }

    }
  }


  grid_l= true;
  for(x = 0; x<WIDTH; x++){
    for(y = 0; y<HEIGHT; y++){
        grid[x][y]=grid_n[x][y];
    }
  }
  grid_l=false;
}

window.addEventListener('resize', init, true);

init();
setInterval(iterate,10);
setInterval(renderGrid,10);
