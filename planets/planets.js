

class Planet {
  constructor(position, radius, color) {
    this.position = new Vec2(position.x,position.y);
    this.velocity = Vec2.zero();
    this.radius = radius;
  }

  applyForce(f) {
    var a = Vec2.scalarMul(f,1/this.radius);
    this.velocity = Vec2.add(this.velocity,a);
  }

  update(){
    this.position = Vec2.add(this.position,this.velocity);
  }

}


var canvas = document.getElementById("frame");

var gfx = canvas.getContext("2d");
var mousePos = Vec2.zero();
var mouseDown = false;
var clickPos = Vec2.zero();
var mouseDelta = Vec2.zero();
var planets = new Array(0);
var t = 0;

var width;
var height;

width = document.body.scrollWidth;
height = document.body.scrollHeight;

canvas.width = width;
canvas.height = height;



window.addEventListener("mousemove", e =>{
  mousePos = new Vec2(e.pageX,e.pageY);
  mouseDelta = Vec2.subtract(mousePos,clickPos);
});

canvas.addEventListener("mousedown", e => {
  mouseDown = true;
  clickPos = new Vec2(e.pageX,e.pageY);
  mouseDelta = new Vec2(0.001,0.001);
});

canvas.addEventListener("mouseup", e => {
  mouseDown = false;
});

canvas.addEventListener("mouseleave", e => {
  mouseDown = false;
});

window.addEventListener("resize", e => {
  width = document.body.scrollWidth;
  height = document.body.scrollHeight;

  canvas.width = width;
  canvas.height = height;
});

setInterval(loop,16);
setInterval(render,1);

function loop() {

  if(mouseDown){
    t++;
    if(t%10==0||t%10==2){
      var planet = new Planet(clickPos,4+Math.random()*2,"#fdfafa");
      planet.applyForce(mouseDelta.logClamp(1.5).negative());
      planets.push(planet);
    }
  }
  planets = planets.filter(planet => {
    return planet.position.isWithin(-10,-10,width+10,height+10);
  });
  planets.forEach(planet => {
    planet.update();
    var delta_p = Vec2.subtract(new Vec2(width/2,height/2),planet.position);
    planet.applyForce(delta_p.normalized().mult(Math.pow(delta_p.magnitude(),-2)*10000));
    planets.forEach(s => {
      if(s.position != planet.position){
        var delta_p = Vec2.subtract(planet.position,s.position);
        s.applyForce(delta_p.normalized().mult(Math.pow(delta_p.magnitude(),-2)));
      }
    });

  });


}

function render() {

  gfx.fillStyle = "#1a2a2a";
  gfx.fillRect(0,0,canvas.width,canvas.height);
  gfx.strokeStyle = "#fdfafa";
  planets.forEach(planet => {
    gfx.beginPath();
    gfx.arc(planet.position.x,planet.position.y,planet.radius, 0, 2 * Math.PI, false);
    gfx.closePath();
    gfx.stroke();
  });
  gfx.beginPath();
  gfx.arc(width/2,height/2,20, 0, 2 * Math.PI, false);
  gfx.closePath();
  gfx.fillStyle = "#fdfafa";
  gfx.fill();
  gfx.beginPath();
  gfx.lineTo(clickPos.x,clickPos.y);
  logDelta = clickPos+mouseDelta.logClamp(100).mult(10000);
  gfx.lineTo(logDelta.x,logDelta.y);
  gfx.closePath();
  gfx.strokeStyle = "#fdfafa";
  gfx.stroke();

}
