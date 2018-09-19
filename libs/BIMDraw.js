/**
 * Create by Jiang Li
 * Create date 2018/09/06
 * BIMDray
 * 居于Three.js进行的二次封装
 */

/**
 *
 * @param material 指定材质，为空时默认材质
 * @constructor
 */
THREE.BIMDraw = function () {

};
//设置材质
THREE.BIMDraw.prototype.material  = {
    color:0xd0d0d0,
    wireframe:false,
    side:THREE.DoubleSide
};

//拉伸参数
THREE.BIMDraw.prototype.extrudeSetting = {
    amount:30,
    bevelEnabled: false,//允许倒角？
    bevelSegments: 100,
    steps: 1,
    bevelSize: 1,//倒角宽度
    bevelThickness: 1//倒角厚度
};

/**
 * 画长方体、正方体
 * @param width     长
 * @param height    宽
 * @param depth     高
 * @param centerX   中心的x轴坐标
 * @param centerY   中心点y轴坐标
 * @param centerZ   中心点z轴坐标
 * @returns {Mesh}  返回一个模型对象
 */
THREE.BIMDraw.prototype.DrawBox = function(width,height,depth,centerX,centerY,centerZ){
  var box = new THREE.BoxGeometry(width,height,depth);
  var materail = new THREE.MeshLambertMaterial(this.material);
  var mesh = new THREE.Mesh(box,materail);
  mesh.position.set(centerX,centerY,centerZ);
  return mesh;
};

/**
 * 画圆柱、圆台
 * @param radiusTop     顶部半径
 * @param radiusBottom  底部半径
 * @param height        高度
 * @param centerX       中心的x轴坐标
 * @param centerY       中心的y轴坐标
 * @param centerZ       中心的z轴坐标
 * @returns {Mesh}      返回一个模型对象
 */
THREE.BIMDraw.prototype.DrawCylinder = function (radiusTop,radiusBottom,height,centerX,centerY,centerZ) {
    var cylinder = new THREE.CylinderGeometry(radiusTop,radiusBottom,height,(30 > radiusBottom ? 30 : radiusBottom),2);
    var materail = new THREE.MeshLambertMaterial(this.material);
    var mesh = new THREE.Mesh(cylinder,materail);
    mesh.position.set(centerX,centerY,centerZ);
    return mesh;
};

/**
 * 截面方式画模型，不带镂空，非曲线
 * @param points  数据点
 * @param centerX 中心点x轴坐标
 * @param centerY 中心点y轴坐标
 * @param centerZ 中心点z轴坐标
 * @returns {Mesh}
 * @constructor
 */
THREE.BIMDraw.prototype.DrawByTopPoints = function (points,centerX,centerY,centerZ){

  var group = new THREE.Group();
    for (var i = 0; i < points.length; i++) {
        var shape = new THREE.Shape(points[i]);
        var mesh = new THREE.Mesh(
            new THREE.ExtrudeGeometry(shape,this.extrudeSetting),
            new THREE.MeshLambertMaterial(this.material)
        );
        group.add(mesh);
    }

    group.position.set(centerX,centerY,centerZ);

  return group;
};

/**
 * 画带多个镂空洞的模型 非曲线
 * @param topPoints
 * @param centerX
 * @param centerY
 * @param centerZ
 * @returns {Group}
 * @constructor
 */
THREE.BIMDraw.prototype.DrawByTopPoints_Hols = function (topPoints,centerX,centerY,centerZ){
  var group = new THREE.Group();
    for (var i = 0; i < topPoints.length; i++) {
        var shape = new THREE.Shape(topPoints[i].topPoint);
        for (var j = 0; j < topPoints[i].hostPoints.length ; j++) {
            var path = new THREE.Path(topPoints[i].hostPoints[j]);
            shape.holes.push(path);
        }
        var mesh = new THREE.Mesh(
            new THREE.ExtrudeGeometry(shape,this.extrudeSetting),
            new THREE.MeshPhongMaterial(this.material)
        );
        group.add(mesh);
    }
    group.position.set(centerX,centerY,centerZ);
    return group;
};

THREE.BIMDraw.prototype.DrawByTopPoints_quadraticCurve = function (data) {
    var group = new THREE.Group();

    return group;
};


//
THREE.BIMDraw.prototype.constructor = THREE.BIMDraw;
