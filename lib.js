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
