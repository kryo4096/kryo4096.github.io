class Vec2 {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  static zero(){
    return new Vec2(0,0);
  }

  static add(v1, v2) {
    return new Vec2(v1.x+v2.x,v1.y+v2.y);
  }

  static subtract(v1, v2) {
    return new Vec2(v1.x-v2.x,v1.y-v2.y);
  }

  static scalarMul(v, s){
    return new Vec2(v.x*s,v.y*s);
  }

  static copy(v){
    return new Vec2(v.x,v.y);
  }

  static distance(v1,v2) {
    return v1.subtract(v2).magnitude();
  }

  logClamp(magnitude){
    return Vec2.scalarMul(this.normalized(),Math.log(this.magnitude())/Math.log(magnitude));
  }

  negative(){
    return new Vec2(-this.x, -this.y);
  }

  isWithin(l,t,w,h){
    return(this.x>l&&this.x<w&&this.y>t&&this.y<h);
  }

  normalized(){
    return Vec2.scalarMul(this,1/this.magnitude());
  }

  magnitude(){
    return Math.sqrt(this.x*this.x+this.y*this.y);
  }

  mult(s){
    return Vec2.scalarMul(this,s);
  }

  add(v){
    return Vec2.add(this,v);
  }

  subtract(v){
    return Vec2.subtract(this,v);
  }

  round(){
    return new Vec2(Math.round(this.x),Math.round(this.y));
  }

}

class Mat2 {
  constructor(a11,a12,a21,a22){
    this.a11 = a11; this.a12 = a12;
    this.a21 = a21; this.a22 = a22;
  }

  static rot(angle){
    return new Mat2(Math.cos(angle), -Math.sin(angle),
                    Math.sin(angle),  Math.cos(angle));
  }

  static scale(scale){
    return new Mat2(scale, 0    ,
                    0    , scale);
  }

  transform(vec){
    return new Vec2(this.a11*vec.x+this.a12*vec.y,this.a21*vec.x+this.a22*vec.y);
  }
}

class Transform {
  constructor(position,scale,angle){
    this.position = position;
    this.scale = scale;
    this.scale_m = Mat2.scale(scale);
    this.angle = angle;
    this.angle_m = Mat2.rot(angle);
  }

  static neutral(){
    return new Transform(Vec2.zero(),1,0);
  }

  setPosition(pos){
    this.position = position;
  }
  setAngle(angle){
    this.angle = angle;
    this.angle_m = Mat2.rot(angle);
  }
  setScale(scale) {
    this.scale = scale;
    this.scale_m = Mat2.scale(scale);
  }

  displace(d){
    setPosition(this.position.add(d));
  }

  rotate(a){
    setAngle(this.angle+a);
  }

  scale(s){
    setScale(this.scale*s);
  }
}

function Grid2D(width,height){
  var grid;
  grid = new Array(width);
  for(x = 0; x<width; x++){
    grid[x] = new Array(height);
  }

  return grid;
}
