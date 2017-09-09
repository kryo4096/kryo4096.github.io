var grid;
var grid_l;

var random_grid;

var canvas;
var gfx;

var SCALE = 15;
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
  cactus_grid = {};





  canvas = document.getElementById("frame");
  gfx = canvas.getContext("2d");

  HEIGHT = Math.ceil(document.body.scrollHeight / SCALE);
  WIDTH = Math.ceil(document.body.scrollWidth / SCALE);

  canvas.width = WIDTH * SCALE;
  canvas.height = WIDTH * SCALE;



  grid = Array2D(WIDTH*HEIGHT);
  random_grid = Array2D(WIDTH*HEIGHT);

  for(x = 0; x<WIDTH; x++){
    for(y = 0; y<HEIGHT; y++){
      random_grid[x][y]=Math.random();
    }
  }




  canvas.addEventListener('click', function(e) {
      var mouse = {
          x: e.pageX - canvas.getBoundingClientRect().left,
          y: e.pageY - canvas.getBoundingClientRect().top,
      }

      grid_l = true;
      var x = Math.ceil(mouse.x/SCALE);
      var y = Math.ceil(mouse.y/SCALE);
      for(var xx = -BRUSH_SIZE/2; xx <= BRUSH_SIZE/2; xx++){
        for(var yy = -BRUSH_SIZE/2; yy <= BRUSH_SIZE/2; yy++){
          grid[x+xx][y+yy]=true;
        }
      }

      grid_l = false;
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
        gfx.fillStyle= blendColors("#b1a070","#c2b180",random_grid[x][y]);
        if(!cell(x,y-1)&&cell(x,y+1)&&random_grid[x][Math.floor(y/10)]<0.1){
          gfx.fillStyle="#002900";
          gfx.fillRect(x*SCALE+SCALE/4,(y-1.5)*SCALE,SCALE/2,SCALE*1.5);
          gfx.fillStyle = "#b1a070";
        }
      } else {
        gfx.fillStyle="#8090C2"
      }
      gfx.fillRect(x*SCALE,y*SCALE,SCALE,SCALE);
    }
  }
}

function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
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
