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
var lId;
window.addEventListener("keydown", e => {
  if(!started) {
    lId = setInterval(loop,16);
    started = true;
  }
  switch(e.key){
    case "ArrowLeft": d_angle = -turn;
    break;
    case "ArrowRight": d_angle = turn;
    break;
  }
});



var rId = setInterval(render,1);

var position = new Vec2(width/2,height/2);
var angle = 0;

var turn = Math.PI/16;

var d_angle = turn;
var speed = 12;
var score = 0;

positions = new Array(0);

function loop() {
  angle+=d_angle;
  position = position.add(new Vec2(Math.cos(angle)*speed,Math.sin(angle)*speed));
  var collision = false;

  positions.forEach(p => {
    if(Vec2.distance(position,p)<=4) collision = true;
  })

  if(!position.isWithin(0,0,width,height)){
    positions.push(-1);
  }

  if(position.x<0) position.x = width;
  if(position.y<0) position.y = height;
  if(position.x>width) position.x = 0;
  if(position.y>height) position.y = 0;



  if(collision){
    gfx.fillStyle = "#1a2a2a";
    gfx.fillRect(0,0,canvas.width,canvas.height);
    clearInterval(lId);
    clearInterval(rId);
    gfx.font = "30px Arial";
    gfx.textAlign = "center";
    gfx.fillStyle = "#fdfafa";
    gfx.fillText("Game Over!",width/2,100);
    gfx.fillText("Score: " + score, width/2,140);
    gfx.fillText("Press any key to restart!",width/2,180);

    gfx.strokeStyle = "#cdcaca";
    for(var i = 1; i<positions.length; i++){
      gfx.beginPath();
      gfx.moveTo(positions[i-1].x,positions[i-1].y);
      gfx.lineTo(positions[i].x,positions[i].y);
      gfx.stroke();
      gfx.beginPath();
    }

    window.setTimeout(function(){
      window.addEventListener("keydown", e => {
        location.reload();
      });
    },1000);

  }
  positions.push(position);

  //if(positions.length>30)
  //positions[positions.length-30] = -1;

  score++;

}

function render() {
  gfx.fillStyle = "#1a2a2a";
  gfx.fillRect(0,0,width,height);

  gfx.beginPath();
  gfx.arc(position.x,position.y,5,0,Math.PI*2);
  gfx.fillStyle = "#fdfafa";
  gfx.fill();
  gfx.closePath();

  gfx.strokeStyle = "#cdcaca";
  for(var i = 1; i<positions.length; i++){
    if(positions[i]!=-1){
      gfx.beginPath();
      gfx.moveTo(positions[i-1].x,positions[i-1].y);
      gfx.lineTo(positions[i].x,positions[i].y);
      gfx.stroke();
      gfx.closePath();
    }
  }

  gfx.font = "30px Arial";
  gfx.textAlign = "center";
  gfx.fillStyle = "#fdfafa";
  if(started){
    gfx.fillText(score,width/2,100);
  }else{
    gfx.fillText("Press any key to begin,",width/2,100);
    gfx.fillText("use the arrow keys to steer!",width/2,140);
  }


}
