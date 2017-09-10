//Size of one block
var BLOCK_SIZE = 15;
//Size of the sand blobs
var BLOB_SIZE = 2;
//RNG density
var DENSITY = 0.1;

// global variables
var width; // width of the world
var height; //height of the world

// brush mode
var brush_mode = true;

var worldGrid; // world grid of size width*height
var worldGridInUse; // locking mechanism

var randomGrid; // grid filled with random numbers at initialization, used for cacti and sand texturing

// Canvas and 2d context for convenient access
var canvas;
var gfx;

// Creates a new 2-dimensional grid with the specified height and width
function Grid2D(width,height){
  var grid;
  grid = new Array(width);
  for(x = 0; x<width; x++){
    grid[x] = new Array(height);
  }

  return grid;
}

function init(){

  //clear everything
  canvas = {};
  gfx = {};
  worldGrid = {};
  cactus_grid = {};

  // get canvas
  canvas = document.getElementById("frame");

  // get 2d graphics context
  gfx = canvas.getContext("2d");

  // calculate world dimensions, by dividing document size by BLOCK_SIZE
  width = Math.ceil(document.body.scrollWidth / BLOCK_SIZE);
  height = Math.ceil(document.body.scrollHeight / BLOCK_SIZE);


  // set canvas dimensions
  canvas.width = width * BLOCK_SIZE;
  canvas.height = height * BLOCK_SIZE;

  //create grids
  worldGrid = Grid2D(width*height);
  randomGrid = Grid2D(width*height);

  // fill randomGrid with random values
  for(x = 0; x<width; x++){
    for(y = 0; y<height; y++){
      randomGrid[x][y]=Math.random();
    }
  }



}

// cell-probing
function getBlock(x, y){
  if(x >= width){
      return false;
  }
  // add fixed ground
  if(y >= height - 1){
      return true;
  }
  if(x < 0){
       return false;
  }
  if(y < 0) {
       return false;
  }

  return worldGrid[x][y];
}

// set block at (x,y) to bool specified by solid
function setBlock(x, y, solid){
  if(x >= width){
      return;
  }
  // add fixed ground
  if(y >= height - 1){
      return;
  }
  if(x < 0){
       return;
  }
  if(y < 0) {
       return;
  }

  worldGrid[x][y] = solid;
}


//randomly populate worldGrid
function generate() {
  if(worldGridInUse) return;
  worldGridInUse=true;

  // grid population
  for(x = 0; x<width; x++){
    for(y = 0; y<height; y++){
    if(Math.random() < DENSITY)
      setBlock(x,y,true);
    }
  }
  worldGridInUse=false;

}

// does one simulation step
function iterate() {
  if(worldGridInUse) return;
  worldGridInUse=true;

  var grid_n = Grid2D(width,height);

  for(x = 0; x<width; x++){
    for(y = 0; y<height; y++){

      if(getBlock(x,y)){
        if(!getBlock(x,y+1)) grid_n[x][y+1] = true;
        else if(!getBlock(x+1,y+1) && !getBlock(x-1,y+1) && y < height-1){
          if(Math.random() > 0.5 && x < width-1) grid_n[x+1][y+1] = true;
          else if(x > 0) grid_n[x-1][y+1] = true;
        } else if(!getBlock(x+1,y+1) && y < height-1 && x < width-1){
          grid_n[x+1][y+1] = true;
        } else if(!getBlock(x-1,y+1) && y < height-1 && x > 0){
          grid_n[x-1][y+1] = true;
        } else {
          grid_n[x][y] = true;
        }
      }

    }
  }
  for(x = 0; x<width; x++){
    for(y = 0; y<height; y++){
        worldGrid[x][y]=grid_n[x][y];
    }
  }

  worldGridInUse=false;
}

//renders the world
function render() {
  if(worldGridInUse) return;
  worldGridInUse=true;

  gfx.clearRect(0,0,width*BLOCK_SIZE,height*BLOCK_SIZE); //clear the canvas

  // iterate through grid
  for(x = 0; x<width; x++){
    for(y = 0; y<height; y++){
      if(getBlock(x,y)){
        gfx.fillStyle= blendColors("#b1a070","#c2b180",randomGrid[x][y]);

        // if the conditions for a cactus are fulfilled, draw one
        if(!getBlock(x,y-1)&&getBlock(x,y+1)&&randomGrid[x][Math.floor(y/10)]<0.1){
          gfx.fillStyle="#002900";
          gfx.fillRect(x*BLOCK_SIZE+BLOCK_SIZE/4,(y-1.5)*BLOCK_SIZE,BLOCK_SIZE/2,BLOCK_SIZE*1.5);
          gfx.fillStyle = "#b1a070";
        }
      } else {
        gfx.fillStyle="#8090C2"
      }
      // draw the block
      gfx.fillRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
    }
  }

  worldGridInUse=false;
}

// blends two colors
function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}

init();
//reinitialize world on resize
window.addEventListener('resize', init, true);
//mouse-listener for sand-spawning
canvas.addEventListener('click', function(e) {

    // calculate mouse position
    var mouse = {
        x: e.pageX,
        y: e.pageY,
    }
    if(mouse.x==0) return;

    var x = Math.ceil(mouse.x/BLOCK_SIZE);
    var y = Math.ceil(mouse.y/BLOCK_SIZE);
    for(var xx = -BLOB_SIZE/2; xx <= BLOB_SIZE/2; xx++){
      for(var yy = -BLOB_SIZE/2; yy <= BLOB_SIZE/2; yy++){
        setBlock(x+xx,y+yy,brush_mode);
      }
    }
}, false);


setInterval(iterate,15);
setInterval(render,1);
setInterval(function() {
  world_grid_lock = false;
},1000);
