/**
 * 角度转弧度
 */
function angleToArc(ang) {
    if (typeof ang == "number"){
        ang = ang.toString();
    }
    var flag = 1;
    if (ang.substring(0,1)=="-"){
        flag = -1;
        ang = ang.substring(1,ang.length);

    }
    var degree=0,second=0,minutes=0;
    var pi = Math.PI / 180;
    if (ang.split(".").length == 1) {
        degree = parseFloat(ang);
        return degree*pi * flag;
    }

    if (ang.split(".").length == 2){
        degree = ang.split(".")[0];
        minutes = ang.split(".")[1].substring(0,2);
        var s = 0;
        if (ang.split(".")[1].length>2){
            s = ang.split(".")[1];
            second =s.substring(2,s.length);
        }

        return (parseFloat(degree)   + parseFloat(minutes) /60 + parseFloat(second)/3600)*pi* flag;
    }
    if (ang.split(".").length==3){
        degree = ang.split(".")[0];
        minutes = ang.split(".")[1].substring(0,2);
        var s = ang.split(".")[1];
        second = s.substring(2,s.length)+ang.split(".")[2];

        return (parseFloat(degree)  + parseFloat(minutes) /60 + parseFloat(second)/3600)*pi * flag;
    }

}

/**
 * 求方位角
 * 传入转成弧度制的角度
 * angleOA,angleB,已知的两个交
 */

function get_azimuth(angleOA,angleB) {

    angleOA =  angleOA.constructor == String ? parseFloat(angleOA): angleOA;
    angleB =  angleB.constructor == String ? parseFloat(angleB): angleB;


    var angleAB = 0;
    if (angleOA >= Math.PI){
        if (angleB<0){
            angleB = Math.PI + angleB;
            angleAB = angleOA - Math.PI + angleB;
        }else {
            angleB = Math.PI - angleB;
            angleAB = angleOA - Math.PI - angleB;
        }

    } else if (angleOA < Math.PI){
        if (angleB<0){
            angleB = Math.PI + angleB;
            angleAB = angleOA + Math.PI + angleB;
        } else {
            angleB = Math.PI - angleB;
            angleAB = angleOA + Math.PI - angleB;
        }

    }
    if (angleAB>=Math.PI*2){
        return angleAB - Math.PI * 2;
    } else if (angleAB < 0) {
        return angleAB + Math.PI * 2;
    }else {
        return angleAB;
    }
}

/**
 * 求中心坐标
 *
 */
function get_coordinates(N,E,distance,azimuth) {

    var n = N + distance*Math.cos(azimuth);
    var e = E + distance*Math.sin(azimuth);

    //返回x,y坐标
    return [e,n];
}


/**
 * 求局部坐标
 * 情况一：给出一个点，给出另一个点x，y方向增量
 * 情况二：给出一个点，给出坡度比（如：%5）和距离
 * 情况三：给出一个点，给出坡度比（如：1：2）和距离
 */
function get_localCoordinates(aX,aY,slope,distance) {
    var k = 0,b=0;
    var px = aX,py = aY;
    var points ;
    distance = parseFloat(distance);
    points = new THREE.Vector2(px,py);
    if (slope.indexOf("%")!= -1){
        k = parseFloat(slope.split("%")[0]) / 100;
        b = py - k * px;
        py = k * (px + distance) + b;
        px = px + distance;
        points = new THREE.Vector2(px,py);
    }else if (slope.indexOf(":") != -1){
        if (slope.split(":")[1] == 0){
            px = px +0;
            py = py + distance;
        } else if (slope.split(":")[0] == 0) {
            py = py + 0;
            px = px + distance;

        }else {
            k = parseFloat(slope.split(":")[0]) / parseFloat(slope.split(":")[1]);
            b = py - k * px;
            py = k * (px + distance) + b;
            px = px + distance;
        }
        points = new THREE.Vector2(px,py);


    } else {
        k = parseFloat(slope)/parseFloat(distance);
        b = py - k * px;
        py = k * (px + distance) + b;
        px = px + distance;
        points = new THREE.Vector2(px,py);
    }

    return points;
}


//拉伸生成实体
function getShapeMesh(shape, extrudeSettings, color, isWirwFrame) {

    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial(
        {
            color: color,
            side: THREE.DoubleSide,
            wireframe: isWirwFrame,  //轮廓线

        }));
    return mesh;

}
//拉伸参数
function setExtrudeSetting(H) {
    var extrudeSetting = {
        amount: parseFloat(H),
        // depth:parseFloat(H),
        bevelEnabled: false,//允许倒角？
        bevelSegments: 100,
        steps: 1,
        bevelSize: 1,//倒角宽度
        bevelThickness: 1//倒角厚度
    };
    return extrudeSetting;
}

//知道半径和圆上两点，求圆心
function Point( x, y)
{
    this.x = x;
    this.y = y;
    if( (typeof(x) == "undefined") || (typeof(y) == "undefined") ){
        this.x = 0;
        this.y = 0;
    }

    this.distance = function( otherPoint ) {
        var self = this;
        if (typeof(otherPoint) == "undefined") {
            return ; // The return obejct is undefined.
        }
        if( (typeof(self.x) == "undefined") || (typeof(self.y) == "undefined") ){
            return;
        }
        if( (typeof(otherPoint.x) == "undefined") || (typeof(otherPoint.y) == "undefined") ){
            return;
        }
        var dx =  parseFloat(self.x) - parseFloat(otherPoint.x);
        var dy =  parseFloat(self.y) - parseFloat(otherPoint.y);
        return ( Math.sqrt( parseFloat(dx) * parseFloat(dx) + parseFloat(dy) * parseFloat(dy) ) );
    }

    this.middle = function( otherPoint ) {
        var self = this;
        if (typeof(otherPoint) == "undefined") {
            return ; // The return obejct is undefined.
        }
        if( (typeof(self.x) == "undefined") || (typeof(self.y) == "undefined") ){
            return;
        }
        if( (typeof(otherPoint.x) == "undefined") || (typeof(otherPoint.y) == "undefined") ){
            return;
        }
        var thex = ( parseFloat(self.x) + parseFloat(otherPoint.x) ) / 2.0;
        var they = ( parseFloat(self.y) + parseFloat(otherPoint.y) ) / 2.0;
        return ( new Point( thex, they ) );
    }

    this.vector = function( otherPoint ) {
        var self = this;
        if (typeof(otherPoint) == "undefined") {
            return ; // The return obejct is undefined.
        }
        if( (typeof(self.x) == "undefined") || (typeof(self.y) == "undefined") ){
            return;
        }
        if( (typeof(otherPoint.x) == "undefined") || (typeof(otherPoint.y) == "undefined") ){
            return;
        }
        var dx =  parseFloat(otherPoint.x) - parseFloat(self.x);
        var dy =  parseFloat(otherPoint.y) - parseFloat(self.y);
        return ( new Point( dx, dy ) );
    }

    this.moveto = function( theVector ) {
        var self = this;
        if (typeof(theVector) == "undefined") {
            return ; // The return obejct is undefined.
        }
        if( (typeof(self.x) == "undefined") || (typeof(self.y) == "undefined") ){
            return;
        }
        if( (typeof(theVector.x) == "undefined") || (typeof(theVector.y) == "undefined") ){
            return;
        }
        var thex =  parseFloat(theVector.x) + parseFloat(self.x);
        var they =  parseFloat(theVector.y) + parseFloat(self.y);
        return ( new Point( thex, they ) );
    }
}



function getCircleCenterCoordinates( px1,py1, px2,py2, r )
{
    var p1 = new Point(px1,py1);
    var p2 = new Point(px2,py2);
    // Checking parameters
    if (typeof(p1) == "undefined") {
        console.error("Parameter point 1 is undefined");
        return;
    }
    if (typeof(p2) == "undefined") {
        console.error("Parameter point 2 is undefined");
        return;
    }
    if (typeof(r) == "undefined") {
        console.error("Parameter radius is undefined");
        return;
    }

    if( parseFloat(r) < 0 ) {
        console.error("Parameter radius is less than zero");
        return;
    }

    var distance = p1.distance( p2 );
    var half_dis = parseFloat(distance)/2.0;
    if( parseFloat(r) < half_dis ) {
        console.error("Parameter radius is too samll, please increass radius.");
        return;
    }
    if( parseFloat(half_dis) < 0.0001 ) {
        console.error("Distance between two point is too samll, please increase their distance.");
        return;
    }

    var v = p1.vector( p2 );
    if (typeof(v) == "undefined") {
        console.error("Vector p1p2 is undefined");
        return;
    }

    var middle_point = p1.middle( p2 );

    // Roating vector p1p2 90 degrees clockwise
    var new_v_x =  v.y;
    var new_v_y =  -v.x;

    // Unifing the new vector
    var origin = new Point( 0.0,  0.0);
    var new_v = new Point( new_v_x,  new_v_y );
    var l = origin.distance( new_v )
    var uni_v_x = parseFloat(new_v_x) / parseFloat(l);
    var uni_v_y = parseFloat(new_v_y) / parseFloat(l);


    var move_length = Math.sqrt( parseFloat(r) * parseFloat(r) - parseFloat(half_dis) * parseFloat(half_dis) ) ;
    var move_vector = new Point( parseFloat(uni_v_x) * parseFloat(move_length),  parseFloat(uni_v_y) * parseFloat(move_length) );

    var r_1 =  middle_point.moveto( move_vector );

    // Roating vector p1p2 90 degrees anti-clockwise
    move_vector = new Point( - parseFloat(uni_v_x) * parseFloat(move_length),  -parseFloat(uni_v_y) * parseFloat(move_length) );

    var r_2 =  middle_point.moveto( move_vector );

    return( [r_1, r_2] );
}















