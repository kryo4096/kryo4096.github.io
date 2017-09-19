var canvas = document.getElementById('canvas');

var width = document.body.scrollWidth;
var height = document.body.scrollHeight;

canvas.width = width;
canvas.height = height;

var center_w = width/2;
var center_h = height/2;



var ctx = canvas.getContext("2d");

// End of Boilerplate

// pixels per meter;
scale = 100;

// start position
x = new Vec2(0,0);

// start velocity
v = Vec2.zero();

// spring stiffness
k = 100;

// spring length
l = 1;

// mass
m = 1;

// gravity
g = new Vec2(0,9.81);

// damping
beta = 0.1;

// timestep
delta_t = 1/60;

paused = true;

function toggle() {
  paused = !paused;
}

function loop() {

  if(!paused) {
    x = x.add(v.mult(delta_t));

    let F_res = Vec2.zero();

    F_res = F_res.add(x.normalized().mult(k*(l-x.magnitude())));
    F_res = F_res.add(g.mult(-m));
    F_res = F_res.add(v.mult(-beta));

    v = v.add(F_res.mult(delta_t / m));
  }


  ctx.fillStyle = "#2f3f3f";

  ctx.strokeStyle = "#fbfafa44";
  ctx.fillRect(0,0,width,height);

  let x_pos = center_w + x.x*scale;
  let y_pos = center_h - x.y*scale;

  ctx.beginPath();
  ctx.moveTo(center_w,center_h);
  ctx.lineTo(x_pos,y_pos);
  ctx.stroke();
  ctx.closePath();

  ctx.fillStyle = "#fbfafa";
  ctx.beginPath();
  ctx.arc(x_pos,y_pos,scale/4,0,2*Math.PI);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(center_w,center_h,l*scale,0,2*Math.PI);
  ctx.stroke();
  ctx.closePath();

}

canvas.addEventListener("mousedown", e => {
  v = Vec2.zero();
  xx = e.pageX - center_w;
  yy = e.pageY - center_h;
  x = new Vec2(xx/scale,-yy/scale);
});



setInterval(loop, delta_t*1000);
