


THREE.BIMEngine = function () {

};


/**
功能：绘制长方体基础
方法名称：draw_cuboid_foundation(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,distance,angle, bottom_elevation,cuboid_parameter_list)
参数说明：
sn-图形编号
name-名称
center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
center_stake_H-中心桩号高程（即 Z坐标）
azimuth-中心桩号切线方位角
distance-道路中心桩到基础中心之间的距离
angle-直线与切线方向夹角，左侧为负，右侧为正
bottom_elevation-底面中心点高程(Z值)
cuboid_parameter_list-长方体参数列表，采用json格式，可绘制多层
{
“cuboid”:[
    {
“length”:长度
“width”:宽度
“height”:高度
},
    {
    “length”:长度
“width”:宽度
“height”:高度
    }
]
}
*/

/**
 * 绘制长方体基础
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param distance 道路中心桩到基础中心之间的距离
 * @param angle 直线与切线方向夹角，左侧为负，右侧为正
 * @param bottom_elevation 底面中心点高程(Z值)
 * @param cuboid_parameter_list 长方体参数列表，采用json格式，可绘制多层
 */
THREE.BIMEngine.prototype.draw_cuboid_foundation = function (sn,name,center_stake_N,
                                                             center_stake_E,center_stake_H,
                                                             azimuth,distance,angle, bottom_elevation,
                                                             cuboid_parameter_list) {

    //算方位角
    var Az = get_azimuth(azimuth,angleToArc(angle));

    //算中心坐标
    var points = get_coordinates(center_stake_N,center_stake_E,distance,Az);
    // 画图
    var listdata = cuboid_parameter_list.cuboid;
    var position_z = bottom_elevation;
    var _3dObj = new THREE.Object3D();
    for (var i = 0; i < listdata.length; i++) {
        var obj = listdata[i];
        var box = new THREE.BoxGeometry(obj.length,obj.width,obj.height);
        var meshGeo = new THREE.MeshPhongMaterial({
            color:new THREE.Color(Math.random()%255,Math.random()%255,Math.random()%255),
            side:THREE.DoubleSide,
            wireframe:false

        });
        var mesh = new THREE.Mesh(box,meshGeo);


        mesh.position.z = position_z + obj.height*0.5 ;
        position_z = position_z + obj.height;
        mesh.position.x = points[0];
        mesh.position.y = points[1];
        mesh.rotateZ(Az);
        _3dObj.add(mesh);

    }
    _3dObj.name = name;
    return _3dObj;

};

/**
 * 功能：绘制圆柱体桩基
 方法名称：draw_cylinder_pile(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,distance1,angle1, distance2,angle2, bottom_elevation, diameter,height)
 参数说明：
 sn-图形编号
 name-名称
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 distance1-道路中心桩与桩基中心之间的距离
 angle1-直线与切线方向夹角，左侧为负，右侧为正
 distance2-距离2
 angle2-第二段直线与第一段直线间夹角
 bottom_elevation-底面中心点高程(Z值)
 diameter-桩直径
 height-高度
 */

/**
 * 功能：绘制圆柱体桩基
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param distance1 道路中心桩与桩基中心之间的距离
 * @param angle1 直线与切线方向夹角，左侧为负，右侧为正
 * @param distance2 距离2
 * @param angle2 第二段直线与第一段直线间夹角
 * @param bottom_elevation 底面中心点高程(Z值)
 * @param diameter 桩直径
 * @param height 高度
 */
THREE.BIMEngine.prototype.draw_cylinder_pile = function(sn,name,center_stake_N,center_stake_E,
                                                      center_stake_H,azimuth,distance1,angle1,
                                                      distance2,angle2, bottom_elevation,
                                                      diameter,height) {
    // var _3dObj = new THREE.Object3D();
    //算方位角
    var Az1 = get_azimuth(azimuth,angleToArc(angle1));


    //算中心坐标
    var points = get_coordinates(center_stake_N,center_stake_E,distance1,Az1);


    var cyl = new THREE.CylinderGeometry(diameter/2,diameter/2,height,30,30);

    var meshGeo = new THREE.MeshPhongMaterial({
        color:0xd0d0d0,
        side:THREE.DoubleSide,
        wireframe:false
    });
    var meshe = new THREE.Mesh(cyl,meshGeo);
    meshe.position.x = points[0];
    meshe.position.y = points[1];
    meshe.position.z = bottom_elevation;

    meshe.rotateX(Math.PI * 0.5);
    meshe.name = name;
    return meshe;

} ;
/**
 * 功能：绘制组合体承台
 方法名称：draw_combine_cap(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,distance,angle, cap_parameter_list)
 参数说明：
 sn-图形编号
 name-名称
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 distance-道路中心桩到基础中心之间的距离
 angle-直线与切线方向夹角，左侧为负，右侧为正
 cap_parameter_list-长方体参数列表，采用json格式，可绘制组合体
 {
“cuboid”:[
{
“length”:长度
“width”:宽度
“height”:高度
“bottom_elevation”:底面中心点高程(Z值)
},
{
“length”:长度
“width”:宽度
“height”:高度
“bottom_elevation”:底面中心点高程(Z值)
},
{
“length”:长度
“width”:宽度
“height”:高度
“bottom_elevation”:底面中心点高程(Z值)
}
]
}

 */

/**
 * 功能：绘制组合体承台
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param distance 道路中心桩到基础中心之间的距离
 * @param angle 直线与切线方向夹角，左侧为负，右侧为正
 * @param cap_parameter_list 长方体参数列表，采用json格式，可绘制组合体
 */

THREE.BIMEngine.prototype.draw_combine_cap = function (sn,name,
                                                       center_stake_N,center_stake_E,center_stake_H,
                                                       azimuth,distance,angle,cap_parameter_list) {
    //算方位角
    var Az = get_azimuth(azimuth,angleToArc(angle+90));
    // console.log(Az);
    //算中心坐标
    var centerDistance = distance;
    var _3Dobj = new THREE.Object3D();
    var points;
    for (var i = 0; i < cap_parameter_list.cuboid.length; i++) {
        var cap = cap_parameter_list.cuboid[i];
        //算中心坐标
        points = get_coordinates(center_stake_N,center_stake_E,centerDistance + cap.length*0.5 ,Math.PI*0.5);


        centerDistance = centerDistance + cap.length;

        var box = new THREE.BoxGeometry(cap.length,cap.width,cap.height);
        var meshGeo = new THREE.MeshLambertMaterial({
            color:0xd0d0d0,
            side:THREE.DoubleSide,
            wireframe:false
        });
        var mesh = new THREE.Mesh(box,meshGeo);
        mesh.position.x = points[0];
        mesh.position.y = points[1];
        mesh.position.z = cap.bottom_elevation;
        // mesh.rotateZ(Az);
        _3Dobj.add(mesh);
    }
    _3Dobj.rotateZ(Az);
    return _3Dobj;

};

/**
 * 花瓶墩参数说明：
 sn-图形编号
 name-名称
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 distance-道路中心桩到基础中心之间的距离
 angle-直线与切线方向夹角，左侧为负，右侧为正
 vase_pier_parameter_list –花瓶墩参数列表，采用json格式，可绘制组合体
 {
 "cuboid":[
 {
 "postion":"bottom"
 "length":长度
 "width":宽度
 "height":高度
"bottom_elevation":底面中心点高程(Z值)
 },
 {
 "postion":"top"
 "length":长度
 "width":宽度
 "height":高度
 "top_elevation":顶面中心点高程(Z值)
 }
 ]
 "varysection":{
       “interpolation”:”ARC”(“LINE”) 插值方法：线性或者非线性
       “varydirection”:”LeftAndRight”(“Left” 、”Right”、” FrontAndBack” 、”All”) //要插值得位置
       “R”:300 半径
}
 }
 */

/**
 * 绘制花瓶墩
 * 参数说明：
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param distance 道路中心桩到基础中心之间的距离
 * @param angle 直线与切线方向夹角，左侧为负，右侧为正
 * @param vase_pier_parameter_list 花瓶墩参数列表，采用json格式，可绘制组合体
 */

THREE.BIMEngine.prototype.draw_vase_pier = function (sn,name,
                                                     center_stake_N,
                                                     center_stake_E,
                                                     center_stake_H,
                                                     azimuth,distance,angle,
                                                     vase_pier_parameter_list) {

    //计算方位角
    var Az = get_azimuth(azimuth,angleToArc(angle));

    //计算中心点
    var points = get_coordinates(center_stake_N,center_stake_E,distance,Az);

    //top和bottom对象
    var topObj = {
        "position" : null,
        "data" : null
    };
    var bottomObj = {
        "position" : null,
        "data" : null
    };
    var _3Dobj = new THREE.Object3D();
    var cuboids = vase_pier_parameter_list.cuboid;

    var meshGeo = new THREE.MeshLambertMaterial({
        color:0xd0d0d0,
        side:THREE.DoubleSide,
        wireframe:true
    });
    for (var i = 0; i < cuboids.length; i++) {
        var box = new THREE.BoxGeometry(cuboids[i].length,cuboids[i].width,cuboids[i].height);
        if (cuboids[i].postion == "top"){
            var mesh = new THREE.Mesh(box,meshGeo);
            mesh.position.x = points[0];
            mesh.position.y = points[1];
            mesh.position.z = parseFloat(cuboids[i].top_elevation)-cuboids[i].height/2 ;
            mesh.rotateZ(Az);
            topObj.position = mesh.position;
            topObj.data = cuboids[i];

            _3Dobj.add(mesh);

        }else {
            var mesh = new THREE.Mesh(box,meshGeo);
            mesh.position.x = points[0];
            mesh.position.y = points[1];
            mesh.position.z = parseFloat(cuboids[i].bottom_elevation) + center_stake_H+cuboids[i].height/2;
            mesh.rotateZ(Az);
            bottomObj.position = mesh.position;
            bottomObj.data = cuboids[i];

            _3Dobj.add(mesh);
        }

    }

    var varysection = vase_pier_parameter_list.varysection;

    //画中间部分
    var centerHeight = topObj.data.top_elevation - bottomObj.data.bottom_elevation-topObj.data.height-bottomObj.data.height;//中心块的z方向高度
    var segX=1,segY=1,segH=5;//x,y,z方向的细分度，细分度越大，弧线越接近真实情况

    var cBox =  new THREE.BoxGeometry(topObj.data.length,topObj.data.width,centerHeight,segX,segY,segH);
    var mesh = new THREE.Mesh(cBox,meshGeo);


    // 非线性插值得到圆弧面
    if (varysection.interpolation=="ARC"){
        //非线性插值分多种情况
        /*
        * 1.LeftAndRight,左右两个面插值
        * 2.Left,单独左边插值
        * 3.Right,单独右边插值
        * 4.FrontAndBack,前后插值
        * 5.All 前后左右同时插值
        * */
        if (varysection.varydirection == "LeftAndRight"){
            //求圆心
            var R = parseFloat(varysection.R);
            var p1x = 0 + parseFloat(centerHeight)*0.5 ;
            var p1y = 0 + parseFloat(topObj.data.length) * 0.5  ;
            var p2x = 0 - parseFloat(centerHeight) * 0.5 ;
            var p2y = 0 + parseFloat(bottomObj.data.length) * 0.5;
            //内插
            ARC_leftAndRight(p1x,p1y,p2x,p2y,R,cBox.vertices,"x_z");
            mesh.position.x = points[0];
            mesh.position.y = points[1];
            mesh.position.z = bottomObj.data.bottom_elevation + bottomObj.data.height + centerHeight * 0.5 ;
            mesh.rotateZ(Az);
            _3Dobj.add(mesh);
            return _3Dobj;
        }
        if(varysection.varydirection == "Left"){

            return ;
        }
        if(varysection.varydirection == "Right"){
            return ;
        }
        if(varysection.varydirection == "FrontAndBack"){
            return ;
        }
        if(varysection.varydirection == "All"){
            return ;
        }

    } else {//线性插值得到斜面
        //线性插值分多种情况
        /*
        * 1.LeftAndRight,左右两个面插值
        * 2.Left,单独左边插值
        * 3.Right,单独右边插值
        * 4.FrontAndBack,前后插值
        * 5.All 前后左右同时插值
        * */
        if (varysection.varydirection == "LeftAndRight"){
            return ;
        }
        if(varysection.varydirection == "Left"){
            return ;
        }
        if(varysection.varydirection == "Right"){
            return ;
        }
        if(varysection.varydirection == "FrontAndBack"){
            return ;
        }
        if(varysection.varydirection == "All"){
            return ;
        }
    }


};



//拉伸变截面得到花瓶墩
//不建议使用

THREE.BIMEngine.prototype.draw_vase_pier_tensile = function (sn,name,
                                                     center_stake_N,
                                                     center_stake_E,
                                                     center_stake_H,
                                                     azimuth,distance,angle,
                                                     vase_pier_parameter_list) {

    //计算方位角
    var Az = get_azimuth(azimuth,angleToArc(angle));

    //计算中心点
    var points = get_coordinates(center_stake_N,center_stake_E,distance,Az);

    var py0, py1,px0, px1;
    var centerTop,centerBottom;//中间部分的顶部和底部高程
    var topPoints = [];
    var _3Dobj = new THREE.Object3D();
    for (var i = 0; i < vase_pier_parameter_list.cuboid.length; i++) {
        var parList = vase_pier_parameter_list.cuboid[i];
        var elevation = 0;//高程

        var box = new THREE.BoxGeometry(parList.length,parList.width,parList.height);
        var meshGeo = new THREE.MeshLambertMaterial({
            color:0xd0d0d0,
            side:THREE.DoubleSide,
            wireframe:false
        });
        var mesh = new THREE.Mesh(box,meshGeo);
        if (parList.postion == "bottom"){
            elevation = parseFloat(parList.bottom_elevation) + parList.height * 0.5;
            mesh.position.x = points[0];
            mesh.position.y = points[1];
            mesh.position.z = elevation;
            py0 = mesh.position.y + parList.width;
            py1 = mesh.position.y + parList.width;
            px0 = mesh.position.x + parList.length * 0.5;
            px1 = mesh.position.x - parList.length * 0.5;
            centerBottom = elevation;

        }else if (parList.postion == "top") {
            elevation = parseFloat(parList.top_elevation) - parList.height * 0.5;
            mesh.position.x = points[0];
            mesh.position.y = points[1];
            mesh.position.z = elevation;
            py0 = mesh.position.y - parList.width;
            py1 = mesh.position.y - parList.width;
            px0 = mesh.position.x - parList.length * 0.5;
            px1 = mesh.position.x + parList.length * 0.5;
            centerTop = elevation;

        }

        mesh.rotateZ(Az);
        _3Dobj.add(mesh);
        topPoints.push(px0,py0,px1,py1);

    }
    var varysection = vase_pier_parameter_list.varysection;
    //变左右
    if (varysection.varydirection == "LeftAndRight") {
        //曲线渐变
        if(varysection.interpolation == "ARC"){
            // var centP1 = getCircleCenterCoordinates(topPoints[2],topPoints[3],topPoints[4],topPoints[5],varysection.R);
            // var centP2 = getCircleCenterCoordinates(topPoints[0],topPoints[1],topPoints[6],topPoints[7],varysection.R);

            var centP1 = getCircleCenterCoordinates(topPoints[2],topPoints[3],topPoints[4],topPoints[5],varysection.R);
            var centP2 = getCircleCenterCoordinates(topPoints[0],topPoints[1],topPoints[6],topPoints[7],varysection.R);
            // console.log(centP1);
            var shap = new THREE.Shape();
            shap.moveTo(topPoints[0],topPoints[1]);//1点
            shap.lineTo(topPoints[2],topPoints[3]);//2点
            shap.quadraticCurveTo(centP1[1].x,centP1[1].y,topPoints[4],topPoints[5]);
            shap.lineTo(topPoints[6],topPoints[7]);
            shap.quadraticCurveTo(centP2[0].x,centP2[0].y,topPoints[0],topPoints[1]);
            var tmesh = getShapeMesh(shap,setExtrudeSetting(),0xd0d0d0,false);
            tmesh.position.x = points[0];
            tmesh.position.y = points[1];
            tmesh.position.z = (centerTop - centerBottom)* 0.5 + centerBottom;
            tmesh.rotateZ(Az);
            _3Dobj.add(tmesh);
        }else {

        }
    }

return _3Dobj;

};


/**
 * 功能：绘制两端劣弧系梁
 方法名称：draw_arc_tie_team(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,distance,angle, bottom_elevation,tie_team_parameter_list)
 参数说明：
 sn-图形编号
 name-名称
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 distance-道路中心桩到基础中心之间的距离
 angle-直线与切线方向夹角，左侧为负，右侧为正
 bottom_elevation-底面中心点高程(Z值)
 tie_team_parameter_list -两端劣弧系梁参数列表，采用json格式
 {
 “tieteam”:[
 {
 “length”:长度
 “width”:宽度
 “height”:高度
 “R”：半径
 }
 ]
 }
 */

/**
 * (未完成)功能：绘制两端劣弧系梁
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param distance 道路中心桩到基础中心之间的距离
 * @param angle 直线与切线方向夹角，左侧为负，右侧为正
 * @param bottom_elevation 底面中心点高程(Z值)
 * @param tie_team_parameter_list 两端劣弧系梁参数列表，采用json格式
 */
THREE.BIMEngine.prototype.draw_arc_tie_team = function(sn,name,
                                                       center_stake_N,
                                                       center_stake_E,
                                                       center_stake_H,
                                                       azimuth,distance,angle,
                                                       bottom_elevation,
                                                       tie_team_parameter_list){


    //计算方位角
    var Az = get_azimuth(azimuth,angleToArc(angle));

    //计算中心点
    var points = get_coordinates(center_stake_N,center_stake_E,distance,Az);


    var tieteam = tie_team_parameter_list.tieteam;
    //创建一个box
    var box = new THREE.BoxGeometry(tieteam.length,tieteam.width,tieteam.height,10,10,10);

    var meshgeo = new THREE.MeshLambertMaterial({
        color:0xd0d0d0,
        side:THREE.DoubleSide,
        wireframe:false
    });

    var mesh = new THREE.Mesh(box,meshgeo);
    mesh.position.x = points[0];
    mesh.position.y = points[1];
    mesh.position.z = bottom_elevation;
    mesh.rotateZ(Az);

    return mesh;



};

/**
 *  左右曲线内插
 * @param p1x 圆弧经过的第一个点X坐标
 * @param p1y 圆弧经过的第一个点Y坐标
 * @param p2x 圆弧经过的第二个点X坐标
 * @param p2y 圆弧经过的第二个点Y坐标
 * @param R 半径
 * @param vertices 要内插的box.vertices 的点
 * @constructor
 */
function ARC_leftAndRight(p1x,p1y,p2x,p2y,R,vertices,axial){
    //求圆心坐标
    var leftCenter = getCircleCenterCoordinates(p1x,p1y,p2x,p2y,R)[0];
    vertices.forEach(function (item) {
        //左右内插，x沿着Z轴方向内插
        if (axial == "x_z"){
            if (item.x > 0){
                item.x = -Math.sqrt(R*R - (item.z - leftCenter.x)*(item.z - leftCenter.x)) + leftCenter.y;
            }else if (item.x < 0) {
                item.x = Math.sqrt(R*R - (item.z - leftCenter.x)*(item.z - leftCenter.x)) - leftCenter.y;
            }else if (item.x == 0) {
                item.x = 0;
            }
        }
        //左右内插，x沿着Z轴方向内插
        if (axial == "y_x") {

        }

    });
}


/**
 * 功能：绘制长方体或组合体
 方法名称：draw_cuboid_entity(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,entity_parameter_list)
 参数说明：
 sn-图形编号
 name-名称
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 entity_parameter_list-长方体参数列表，采用json格式，可绘制组合体
 */

/**
 * 功能：绘制长方体或组合体
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param entity_parameter_list 长方体参数列表，采用json格式，可绘制组合体
 */
THREE.BIMEngine.prototype.draw_cuboid_entity = function(sn,name,
                                                        center_stake_N,
                                                        center_stake_E,
                                                        center_stake_H,
                                                        azimuth,
                                                        entity_parameter_list){

    //方位角,//中心坐标
    var Az,points;
    var _3dObj = new THREE.Object3D();

    var cuboid = entity_parameter_list.cuboid;
    for (var i = 0; i < cuboid.length; i++) {
        //算方位角
         Az = get_azimuth(azimuth,angleToArc(cuboid[i].angle));
        //算中心坐标
         points = get_coordinates(center_stake_N,center_stake_E,cuboid[i].distance,Az);
        var box = new THREE.BoxGeometry(cuboid[i].length,cuboid[i].width,cuboid[i].height);
        var meshGeo = new THREE.MeshPhongMaterial({
            color:new THREE.Color(Math.random()%255,Math.random()%255,Math.random()%255),
            side:THREE.DoubleSide,
            wireframe:false

        });
        var mesh = new THREE.Mesh(box,meshGeo);

        mesh.position.z = cuboid[i].bottom_elevation + cuboid[i].height*0.5 ;
        mesh.position.x = points[0];
        mesh.position.y = points[1];
        mesh.rotateZ(Az);
        mesh.name = name;
        mesh.sn = sn;
        _3dObj.add(mesh);

    }
    return _3dObj;

};



/**
 * 功能：绘制截面形式图形
 方法名称：draw_section_entity(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,entity_parameter_list)
 参数说明：
 sn-图形编号
 name-名称
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 entity_parameter_list-圆柱体参数列表，采用json格式，可绘制组合体
 {
“sections”:[
{
“sn”:1
“distance”:100
“angle”:90
“out_section_parameter”:[“line”,dx1,dy1], [“arc”,dx2,dy2],[“arc”,dx3,dy3], [“line”,i%,dx], [“line”,n:m,dy]……
说明：line、arc表示该点与下一点相连的方式，dx，dy是两点间的坐标增量；i%代表坡度，一般与水平距离搭配求纵坐标增量；n:m两点间坡比，一般与垂直方向距离搭配求横坐标增量。
“innersections”:[
	{
“inner_section_parameter”: [“line”,dx1,dy1], [“arc”,dx2,dy2],[“arc”,dx3,dy3], [“line”,i%,dx], [“line”,n:m,dy]……
},
{
“inner_section_parameter”: [“line”,dx1,dy1], [“arc”,dx2,dy2],[“arc”,dx3,dy3], [“line”,i%,dx], [“line”,n:m,dy]……
}
]
},
{
“sn”:2
“distance”:100
“angle”:90
“out_section_parameter”: [“line”,dx1,dy1], [“arc”,dx2,dy2],[“arc”,dx3,dy3], [“line”,i%,dx], [“line”,n:m,dy]……
 “innersections”:[
	{
“inner_section_parameter”: [“line”,dx1,dy1], [“arc”,dx2,dy2],[“arc”,dx3,dy3], [“line”,i%,dx], [“line”,n:m,dy]……
},
{
“inner_section_parameter”: [“line”,dx1,dy1], [“arc”,dx2,dy2],[“arc”,dx3,dy3], [“line”,i%,dx], [“line”,n:m,dy]……
}
]
},
……
]
}

 */
/**
 * 功能：绘制截面形式图形
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param entity_parameter_list 圆柱体参数列表，采用json格式，可绘制组合体
 */
THREE.BIMEngine.prototype.draw_section_entity = function(sn,name,
                                                         center_stake_N,
                                                         center_stake_E,
                                                         center_stake_H,
                                                         azimuth,
                                                         entity_parameter_list){


    //先拿到顶点数据
    var sections = entity_parameter_list.sections;
    //方位角,//中心坐标
    var Az,points;
    var _3Dobj =  new THREE.Object3D();
    for (var i = 0; i < sections.length; i++) {
        var shape = new THREE.Shape();

       if (sections[i].out_section_parameter!= null){
           var outPoints = sections[i].out_section_parameter;//外围点
           var currentOP = [];//当前外围点
           var arcPs = [];//外围圆点
           //外围
           for (var j = 0; j < outPoints.length; j++) {
               var outP = outPoints[j];
               if (j == 0){
                   shape.moveTo(parseFloat(outP[1]),parseFloat(outP[2]));
                   currentOP = [parseFloat(outP[1]),parseFloat(outP[2])];

               } else if (j > 0) {
                   //算出下一点坐标
                   var nextOP = get_localCoordinates(currentOP[0],currentOP[1],outP[1],parseFloat(outP[2]));
                   //直线点
                   if (outP[0] == "line") {
                       if (arcPs.length>=3){
                           console.log(arcPs);
                           shape.splineThru(arcPs);

                       }
                       arcPs = [];
                       shape.lineTo(nextOP.x,nextOP.y);

                   }
                   //曲线点
                   else if (outP[0] == "arc"){
                       arcPs.push(new THREE.Vector2(nextOP.x,nextOP.y));
                   }
                   currentOP = [nextOP.x,nextOP.y];
               }

           }
           //镂空
           var currentInP = [];//当前镂空点
           var arcInPs = [];//镂空圆点
           var intPoints = sections[i].innersections;//镂空数据
           for (var j = 0; j < intPoints.length ; j++) {
               var holsPath = new THREE.Path();
               var innerSection ;
               for (var k = 0; k < intPoints[j].inner_section_parameter.length; k++) {
                   innerSection = intPoints[j].inner_section_parameter[k];
                   if (innerSection.length>0){
                       if (k == 0){
                           holsPath.moveTo(parseFloat(innerSection[1]),innerSection[2]);
                           currentInP = [parseFloat(innerSection[1]),innerSection[2]];
                       } else if (k > 0) {
                           //算出下一点坐标
                           var nextInP = get_localCoordinates(currentInP[0],currentInP[1],innerSection[1],parseFloat(innerSection[2]));
                           if (innerSection[0] == "line"){
                               holsPath.lineTo(nextInP.x,nextInP.y);
                               currentInP = [nextInP.x,nextInP.y];
                               if (arcInPs.length>=3){
                                   holsPath.splineThru(arcInPs);
                               }
                               arcInPs = [];

                           } else if (innerSection[0] == "arc"){
                               arcPs.push(new THREE.Vector2(nextInP.x,nextInP.y));
                               currentInP = [nextInP.x,nextInP.y];
                           }
                       }
                   }
               }
               shape.holes.push(holsPath);
           }
       }

        var mesh = getShapeMesh(shape,setExtrudeSetting(20),0xd0d0d0,false);
        Az = get_azimuth(azimuth,angleToArc(sections[i].angle));
        points = get_coordinates(center_stake_N,center_stake_E,sections[i].distance,azimuth);
        mesh.position.z = center_stake_H;
        mesh.position.x = points[0];
        mesh.position.y = points[1];
        mesh.rotateZ(Az);
        _3Dobj.add(mesh);

    }
    return _3Dobj;

};

/**
 * 说明：本绘图接口实现管线图形的绘制，主要应用于水管等图形绘制。
 功能：绘制管线
 方法名称：draw_tube(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,distance,angle,bottom_elevation,tuble_parameter_list)
 参数说明：
 sn-图形编号
 name-名称
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 distance-道路中心桩到基础中心之间的距离
 angle-直线与切线方向夹角，左侧为负，右侧为正
 bottom_elevation-底面中心点高程(Z值)
 tuble_parameter_list-管道参数列表
 {
     “trackpoints”:[
         [x1,y1,z1], [x2,y2,z2], [x3,y3,z3], ……
]
“radius”:100
}
 */

/**
 * 说明：本绘图接口实现管线图形的绘制，主要应用于水管等图形绘制
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param distance 道路中心桩到基础中心之间的距离
 * @param angle 直线与切线方向夹角，左侧为负，右侧为正
 * @param bottom_elevation 底面中心点高程(Z值)
 * @param tuble_parameter_list 管道参数列表
 */
THREE.BIMEngine.prototype.draw_tube = function(sn,name,
                                               center_stake_N,
                                               center_stake_E,
                                               center_stake_H,
                                               azimuth,
                                               distance,
                                               angle,
                                               bottom_elevation,
                                               tuble_parameter_list){
    //算方位角
    var Az = get_azimuth(azimuth,angleToArc(angle));

    //算中心坐标
    var points = get_coordinates(center_stake_N,center_stake_E,distance,Az);
    var paths = [];
    for (var i = 0; i < tuble_parameter_list.trackpoints.length; i++) {
        var trackpoint = tuble_parameter_list.trackpoints[i];
        paths.push(new THREE.Vector3(parseFloat(trackpoint[0]),parseFloat(trackpoint[1]),parseFloat(trackpoint[2])));
    }
    console.log(paths);
    var path = new THREE.SplineCurve3(paths);
    var geometry = new THREE.TubeGeometry( path,20,tuble_parameter_list.radius,20,false);
    var material = new THREE.MeshPhongMaterial({
        color:new THREE.Color(Math.random()%255,Math.random()%255,Math.random()%255),
        side:THREE.DoubleSide,
        wireframe:false

    });//材质对象
    var mesh=new THREE.Mesh(geometry,material);//管道网格模型对象
    mesh.position.x = points[0];
    mesh.position.y = points[1];
    mesh.position.z = bottom_elevation;
    mesh.rotateZ(Az);

    var _3Dobj = new THREE.Object3D();
    _3Dobj.add(mesh);
    return _3Dobj;
};

/**
 * 说明：本绘图接口实现圆环的绘制，主要应用于环形物体绘制。
 功能：绘制圆环
 方法名称：draw_torus(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,distance,angle,elevation, torus_parameter_list)
 参数说明：
 sn-图形编号
 name-名称
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 distance-道路中心桩到基础中心之间的距离
 angle-直线与切线方向夹角，左侧为负，右侧为正
 elevation-高程(Z值)
 torus_parameter_list-管道参数列表
 {
     “radius”:100 圆环半径
     “tube_radius”:管半径
     “start_angle”:起始角度
     “end_angle”:结束角度

}
 */

/**
 * 绘制圆环
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param distance 道路中心桩到基础中心之间的距离
 * @param angle 直线与切线方向夹角，左侧为负，右侧为正
 * @param elevation 高程(Z值)
 * @param torus_parameter_list 管道参数列表
 */
THREE.BIMEngine.prototype.draw_torus = function(sn,name,
                                                center_stake_N,
                                                center_stake_E,
                                                center_stake_H,
                                                azimuth,
                                                distance,
                                                angle,
                                                elevation,
                                                torus_parameter_list){

    //算方位角
    var Az = get_azimuth(azimuth,angleToArc(angle));

    //算中心坐标
    var points = get_coordinates(center_stake_N,center_stake_E,distance,Az);

    var listData = torus_parameter_list;

    //画圆环
    //参数 圆环半径，管道半径，细分度，细分度，弧度
    var torus = new THREE.TorusGeometry(listData.radius,listData.tube_radius,20,20,listData.end_angle-listData.start_angle);
    var meshGeo = new THREE.MeshLambertMaterial({
        color: new THREE.Color(Math.random()%255,Math.random()%255,Math.random()%255),
        side:THREE.DoubleSide,
        wireframe:false
    });
    var mesh = new THREE.Mesh(torus,meshGeo);
    mesh.position.x = points[0];
    mesh.position.y = points[1];
    mesh.position.z = elevation;
    mesh.rotateZ(Az);
    mesh.name = name;
    mesh.sn = sn;
    var _3Dobj = new THREE.Object3D();
    _3Dobj.add(mesh);

    return _3Dobj;
};

/**
 * 说明：本接口实现对文本的标注。
 功能：绘制文本
 方法名称：draw_text(sn,text,center_stake_N,center_stake_E,center_stake_H,azimuth,distance,angle,bottom_elevation)
 参数说明：
 sn-图形编号
 text-文本
 font-字体
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 distance-道路中心桩到基础中心之间的距离
 angle-直线与切线方向夹角，左侧为负，右侧为正
 bottom_elevation-底面中心点高程(Z值)
 */

/**
 * 绘制文本 （缺中文字体库）
 * @param sn 图形编号
 * @param text 文本
 * @param font_url 字体
 * @param fontSize 字体大小
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param distance 道路中心桩到基础中心之间的距离
 * @param angle 直线与切线方向夹角，左侧为负，右侧为正
 * @param bottom_elevation 底面中心点高程(Z值)
 */

THREE.BIMEngine.prototype.draw_text = function(sn,text,font_url,fontSize,
                                               center_stake_N,
                                               center_stake_E,
                                               center_stake_H,
                                               azimuth,
                                               distance,
                                               angle,
                                               bottom_elevation) {
    var textLoader = new THREE.FontLoader();
    textLoader.load(font_url,function (fonts) {
        fontFamily = fonts;
    });
    var options = {
        size: fontSize,
        height: 0,
        font: fontFamily, // “引用js字体必须换成英文”
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1,
        curveSegments: 50,
        steps: 1
    };
    var textGeo = new THREE.TextGeometry(text, options);
    var textMesh = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial());

};

/**
功能：绘制长方体
方法名称：draw_single_cuboid_entity(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,entity_parameter_list)
参数说明：
	sn-图形编号
name-名称
center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
center_stake_H-中心桩号高程（即 Z坐标）
azimuth-中心桩号切线方位角
entity_parameter_list-长方体参数列表，采用json格式，可绘制组合体
{
“cuboid”:
    {
    “sn”:1
“name”:XXX承台
“distance”:100
“angle”:90
“length”:长度
“width”:宽度
“height”:高度
“dx”:倒角横向距离
“dy”:倒角纵向距离
“arcR”:倒角半径（如果按圆弧倒角时出现）
    “bottom_elevation”:底面中心点高程(Z值)
    }
}
 */
/**
 * 功能：绘制单个长方体 （带倒角）
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param entity_parameter_list 长方体参数列表，采用json格式，可绘制组合体
 */
THREE.BIMEngine.prototype.draw_single_cuboid_entity = function(sn,name,
                                                               center_stake_N,
                                                               center_stake_E,
                                                               center_stake_H,
                                                               azimuth,
                                                               entity_parameter_list){

    var cuboid = entity_parameter_list.cuboid;
    //算方位角
    var Az = get_azimuth(azimuth,angleToArc(cuboid.angle));

    //算中心坐标
    var points = get_coordinates(center_stake_N,center_stake_E,cuboid.distance,Az);

    var shap = new THREE.Shape();
    //判断是否有倒角
    if (cuboid.dx&&cuboid.dy){
        //如果是直线倒角
        shap.moveTo(cuboid.dx,0);
        shap.lineTo(cuboid.length - cuboid.dx,0);
        shap.lineTo(cuboid.length,cuboid.dy);
        shap.lineTo(cuboid.length,cuboid.width-cuboid.dy);
        shap.lineTo(cuboid.length-cuboid.dx,cuboid.width);
        shap.lineTo(cuboid.dx,cuboid.width);
        shap.lineTo(0,cuboid.width-cuboid.dy);
        shap.lineTo(0,cuboid.dy);

        shap.lineTo(cuboid.dx,0);
    } else if (cuboid.arcR){
        // 如果是半径圆弧倒角
        shap.moveTo(cuboid.arcR,0);
        shap.lineTo(cuboid.length - cuboid.arcR,0);
        shap.quadraticCurveTo(cuboid.length,0,cuboid.length,cuboid.arcR);
        shap.lineTo(cuboid.length,cuboid.width - cuboid.arcR);
        shap.quadraticCurveTo(cuboid.length,cuboid.width,cuboid.length - cuboid.arcR,cuboid.width);
        shap.lineTo(cuboid.arcR,cuboid.width);
        shap.quadraticCurveTo(0,cuboid.width,0,cuboid.width-cuboid.arcR);
        shap.lineTo(0,cuboid.arcR);
        shap.quadraticCurveTo(0,0,cuboid.arcR,0);
    } else {
        //不倒角
        shap.moveTo(0,0);
        shap.lineTo(cuboid.length,0);
        shap.lineTo(cuboid.length,cuboid.width);
        shap.lineTo(0,cuboid.width);
        shap.lineTo(0,0);
    }

    var mesh = getShapeMesh(shap,setExtrudeSetting(cuboid.height),0xd0d0d0,false);
    mesh.position.z = cuboid.bottom_elevation;
    mesh.position.x = points[0];
    mesh.position.y = points[1];
    mesh.rotateZ(Az);
    mesh.name = name;
    mesh.sn = sn;
    var _3Dobj = new THREE.Object3D();
    _3Dobj.add(mesh);
    return _3Dobj;

};

/**
 * 功能：绘制横向长方体组合
 方法名称：draw_horizontal_cuboid_combine_entity(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,entity_parameter_list)
 */
/**
 * 绘制横向长方体组合
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param entity_parameter_list 长方体参数列表，采用json格式，可绘制组合体
 */
THREE.BIMEngine.prototype.draw_horizontal_cuboid_combine_entity = function(sn,name,
                                                                           center_stake_N,
                                                                           center_stake_E,
                                                                           center_stake_H,
                                                                           azimuth,angle,
                                                                           entity_parameter_list){
    var cuboids = entity_parameter_list.cuboid;
    var _3Dobj = new THREE.Object3D();
    var lastDistance = 0;
    var Az = get_azimuth(azimuth,angleToArc(angle+90));

    for (var i = 0; i < cuboids.length; i++) {
        var cuboid = cuboids[i];

        var shap = new THREE.Shape();
        //判断是否有倒角
        if (cuboid.dx&&cuboid.dy){
            //如果是直线倒角
            shap.moveTo(cuboid.dx,0);
            shap.lineTo(cuboid.height - cuboid.dx,0);
            shap.lineTo(cuboid.height,cuboid.dy);
            shap.lineTo(cuboid.height,cuboid.width-cuboid.dy);
            shap.lineTo(cuboid.height-cuboid.dx,cuboid.width);
            shap.lineTo(cuboid.dx,cuboid.width);
            shap.lineTo(0,cuboid.width-cuboid.dy);
            shap.lineTo(0,cuboid.dy);
            shap.lineTo(cuboid.dx,0);
        } else if (cuboid.arcR){
            // 如果是半径圆弧倒角
            shap.moveTo(cuboid.arcR,0);
            shap.lineTo(cuboid.height - cuboid.arcR,0);
            shap.quadraticCurveTo(cuboid.height,0,cuboid.height,cuboid.arcR);
            shap.lineTo(cuboid.height,cuboid.width - cuboid.arcR);
            shap.quadraticCurveTo(cuboid.height,cuboid.width,cuboid.height - cuboid.arcR,cuboid.width);
            shap.lineTo(cuboid.arcR,cuboid.width);
            shap.quadraticCurveTo(0,cuboid.width,0,cuboid.width-cuboid.arcR);
            shap.lineTo(0,cuboid.arcR);
            shap.quadraticCurveTo(0,0,cuboid.arcR,0);
        } else {
            //不倒角
            shap.moveTo(0,0);
            shap.lineTo(cuboid.height,0);
            shap.lineTo(cuboid.height,cuboid.width);
            shap.lineTo(0,cuboid.width);
            shap.lineTo(0,0);
        }

        lastDistance = lastDistance + cuboid.distance;
        //算方位角


        //算中心坐标

        var points = get_coordinates(center_stake_N,center_stake_E,lastDistance,Math.PI*0.5);
        var path = new THREE.SplineCurve3([
            new THREE.Vector3(0,-cuboid.width * 0.5,cuboid.height*0.5),
            new THREE.Vector3(cuboid.length,-cuboid.width * 0.5,cuboid.height*0.5),
        ]);
        //拉伸参数
        var extrudeSetting = {
            bevelEnabled: false,//允许倒角？
            steps: 2,
            extrudePath:path

        };
        var mesh = getShapeMesh(shap,extrudeSetting,0xd0d0d0,true);
        mesh.position.set(0,0,0);
        mesh.position.z = cuboid.bottom_elevation;
        mesh.position.x = points[0];
        mesh.position.y = points[1];
        // mesh.rotateZ(Az);//不能每个都旋转
        mesh.name = name;
        mesh.sn = sn;
        _3Dobj.add(mesh);
        
    }
    _3Dobj.rotateZ(Az);//整体旋转
    return _3Dobj;


};


/**
 * 功能：绘制纵向长方体组合图形
 方法名称：draw_vertical_cuboid_combine_entity(sn,name,center_stake_N,center_stake_E,center_stake_H,azimuth,entity_parameter_list)
 参数说明：
 sn-图形编号
 name-名称
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 entity_parameter_list-长方体参数列表，采用json格式，可绘制组合体
 */

/**
 * 功能：绘制纵向长方体组合图形
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param entity_parameter_list 长方体参数列表，采用json格式，可绘制组合体
 */

THREE.BIMEngine.prototype.draw_vertical_cuboid_combine_entity = function(sn,name,
                                                                         center_stake_N,
                                                                         center_stake_E,
                                                                         center_stake_H,
                                                                         azimuth,
                                                                         entity_parameter_list){

    var cuboids = entity_parameter_list.cuboid;
    var _3Dobj = new THREE.Object3D();

    for (var i = 0; i < cuboids.length; i++) {
        var cuboid = cuboids[i];
        var shap = new THREE.Shape();
        //判断是否有倒角
        if (cuboid.dx&&cuboid.dy){
            //如果是直线倒角
            shap.moveTo(cuboid.dx,0);
            shap.lineTo(cuboid.length - cuboid.dx,0);
            shap.lineTo(cuboid.length,cuboid.dy);
            shap.lineTo(cuboid.length,cuboid.width-cuboid.dy);
            shap.lineTo(cuboid.length-cuboid.dx,cuboid.width);
            shap.lineTo(cuboid.dx,cuboid.width);
            shap.lineTo(0,cuboid.width-cuboid.dy);
            shap.lineTo(0,cuboid.dy);

            shap.lineTo(cuboid.dx,0);
        } else if (cuboid.arcR){
            // 如果是半径圆弧倒角
            shap.moveTo(cuboid.arcR,0);
            shap.lineTo(cuboid.length - cuboid.arcR,0);
            shap.quadraticCurveTo(cuboid.length,0,cuboid.length,cuboid.arcR);
            shap.lineTo(cuboid.length,cuboid.width - cuboid.arcR);
            shap.quadraticCurveTo(cuboid.length,cuboid.width,cuboid.length - cuboid.arcR,cuboid.width);
            shap.lineTo(cuboid.arcR,cuboid.width);
            shap.quadraticCurveTo(0,cuboid.width,0,cuboid.width-cuboid.arcR);
            shap.lineTo(0,cuboid.arcR);
            shap.quadraticCurveTo(0,0,cuboid.arcR,0);
        } else {
            //不倒角
            shap.moveTo(0,0);
            shap.lineTo(cuboid.length,0);
            shap.lineTo(cuboid.length,cuboid.width);
            shap.lineTo(0,cuboid.width);
            shap.lineTo(0,0);
        }
        //算方位角
        var Az = get_azimuth(azimuth,angleToArc(cuboid.angle));

        //算中心坐标
        var points = get_coordinates(center_stake_N,center_stake_E,cuboid.distance,Az);

        //拉伸参数
        var extrudeSetting = {
            bevelEnabled: false,//允许倒角？
            steps: 10,
            amount:cuboid.height
        };
        var mesh = getShapeMesh(shap,extrudeSetting,new THREE.Color(Math.random()%255,Math.random()%255,Math.random()%255),false);
        mesh.position.z = cuboid.bottom_elevation + cuboid.bottom_elevation*0.5;
        mesh.position.x = points[0];
        mesh.position.y = points[1];
        mesh.rotateZ(Az);
        mesh.name = name;
        mesh.sn = sn;
        _3Dobj.add(mesh);

    }
    return _3Dobj;

};

/**
 * 功能：绘制圆柱体或组合体
 方法名称：draw_cylinder_entity(sn,name,center_stake_N,center_stake_E,center_stake_H,
 azimuth,entity_parameter_list)
 参数说明：
 sn-图形编号
 name-名称
 center_stake_N-中心桩号N坐标(X，数学坐标系对应Y方向)
 center_stake_E-中心桩号E坐标(Y，数学坐标系对应X方向)
 center_stake_H-中心桩号高程（即 Z坐标）
 azimuth-中心桩号切线方位角
 entity_parameter_list-圆柱体参数列表，采用json格式，可绘制组合体
 */
/**
 *
 * @param sn 图形编号
 * @param name 名称
 * @param center_stake_N 中心桩号N坐标(X，数学坐标系对应Y方向)
 * @param center_stake_E 中心桩号E坐标(Y，数学坐标系对应X方向)
 * @param center_stake_H 中心桩号高程（即 Z坐标）
 * @param azimuth 中心桩号切线方位角
 * @param entity_parameter_list 圆柱体参数列表，采用json格式，可绘制组合体
 */
THREE.BIMEngine.prototype.draw_cylinder_entity = function(sn,name,
                                                          center_stake_N,
                                                          center_stake_E,
                                                          center_stake_H,
                                                          azimuth,
                                                          entity_parameter_list){

    var cylinder = entity_parameter_list.cylinder;
    var _3dObj = new THREE.Object3D();
    //方位角,//中心坐标
    var Az,points;
    for (var i = 0; i < cylinder.length; i++) {
        //算方位角
        Az = get_azimuth(azimuth,angleToArc(cylinder[i].angle));
        //算中心坐标
        points = get_coordinates(center_stake_N,center_stake_E,cylinder[i].distance,Az);
        var cyl = new THREE.CylinderGeometry(cylinder[i].diameter * 0.5,cylinder[i].diameter * 0.5,cylinder[i].height,20);
        var meshGeo = new THREE.MeshPhongMaterial({
            color:new THREE.Color(Math.random()%255,Math.random()%255,Math.random()%255),
            side:THREE.DoubleSide,
            wireframe:false

        });
        var mesh = new THREE.Mesh(cyl,meshGeo);

        mesh.position.z = cylinder[i].bottom_elevation + cylinder[i].height*0.5 ;
        mesh.position.x = points[0];
        mesh.position.y = points[1];
        mesh.rotateZ(Az);
        mesh.rotateX(Math.PI * 0.5);
        mesh.name = name;
        mesh.sn = sn;
        _3dObj.add(mesh);

    }
    return _3dObj;

};

//构造器方法
THREE.BIMEngine.prototype.constructor = THREE.BIMEngine;