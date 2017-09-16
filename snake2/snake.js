cos = Math.cos;
sin = Math.sin;
floor = Math.floor;
PI = Math.PI;

var canvas = document.getElementById("frame");

var gfx = canvas.getContext("2d");
var t = 0;

var width;
var height;

width = document.body.scrollWidth;
height = document.body.scrollHeight;

canvas.width = width;
canvas.height = height;

window.addEventListener("resize", e => {
  width = document.body.scrollWidth;
  height = document.body.scrollHeight;

  canvas.width = width;
  canvas.height = height;
});


var started = false;
let lId = setInterval(loop,8);

let arrow_left = false;
let arrow_right = false;

window.addEventListener("keydown", e => {
  if(!started) {
    started = true;
  }
  switch(e.key){
    case "ArrowLeft": arrow_left = true;
    break;
    case "ArrowRight": arrow_right = true;
    break;
  }
});

window.addEventListener("keyup", e => {
  switch(e.key){
    case "ArrowLeft": arrow_left = false;
    break;
    case "ArrowRight": arrow_right = false;
    break;
  }
});

var position = new Vec2(width/2,height/2);
var angle = -PI/2;

var turn = PI/64;
var speed = 4;
var score = 0;
var ticks = 0;
var grid = Grid2D(width,height);
var ray_width = 8;
var ray_res = 1;

var game_over = false;
for(var x = 0; x++; x <= width){
  for(var y = 0; y++; y <= height){
    grid[x][y]=0;
  }
}

var positions = new Array(0);

function loop() {
  render();

  if(arrow_left) angle -= turn;
  if(arrow_right) angle += turn;

  if(!started) return;

  ticks++;

  position = position.add(new Vec2(cos(angle)*speed,sin(angle)*speed));

  if(!position.isWithin(0,0,width,height)) positions.push(-1);
  if(position.x<0) position.x = width-1;
  if(position.y<0) position.y = height-1;
  if(position.x>width) position.x = 0;
  if(position.y>height) position.y = 0;

  let collision = false;

  let offx = cos(angle)*speed;
  let offy = sin(angle)*speed;

  for(let xx = -ray_width/2; xx<=ray_width/2; xx+=ray_res){
    for(let yy = -ray_width/2; yy<=ray_width/2; yy+=ray_res){
      let x = position.x + offx + xx;
      let y = position.y + offy + yy;
      if(grid[floor(x)][floor(y)]==1) collision = true;
    }
  }

  positions.push(position);
  grid[floor(position.x)][floor(position.y)] = 1;

  score++;

  if(collision) {
    gameOver();
  }

}

function gameOver(){
  clearInterval(lId);

  document.cookie=score;

  location.reload();
}

function render() {
  gfx.font = "30px Arial";
  gfx.textAlign = "center";
  gfx.fillStyle = "#1a2a2a";
  gfx.fillRect(0,0,width,height);
  gfx.fillStyle = "#fdfafa";

  if(started){
    gfx.fillText(score, width/2,100);
    gfx.fillText(document.cookie, width/2, 60);
  } else {
    gfx.fillText("Press any key to begin,",width/2,100);
    gfx.fillText("use the arrow keys to steer!",width/2,140);
  }

  gfx.beginPath();
  gfx.arc(position.x,position.y,5,angle-PI,angle+PI);
  gfx.fillStyle = "#fdfafa";
  gfx.fill();
  gfx.closePath();

  positions.forEach(p=>{
    if(p == -1) return;
    gfx.fillRect(p.x-1,p.y-1,2,2);
  });

}
