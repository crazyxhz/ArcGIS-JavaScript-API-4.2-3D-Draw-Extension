# ArcGIS JavaScript API 4.2 绘图扩展
[Demo](https://crazyxhz.github.io/ArcGIS-JavaScript-API-4.2-3D-Draw-Extension/src/draw.html)
##概览
自定义了一个Draw类，支持三维场景下点、线、面、圆形、圆弧、贝塞尔曲线、贝塞尔曲面、箭头、多头箭头的绘制。支持立方体化多边形，支持通过Three.js扩展绘制虚线（不完善，由于Windows上WebGL的限制，不支持自定义线宽）



 
##说明

可以直接通过相对路径引用script文件夹下的draw类（其他脚本也需要放在script目录下，Draw类内部会引用）
```
require(["./script/Draw"], function(Draw) { /* code goes here */ });	
```

###**构造函数**:
```
new Draw({view: viewInstance, gl: graphicsLayerInstance})
```
Draw的构造函数接受一个含有view和gl属性的Object.其中view属性需要指向一个SceneView实例，gl属性需要指向一个GraphicsLayer实例

###**静态属性**

| 静态属性        | 含义           | 
| ------------- |:-------------:| 
| Draw.POINT     | 点 | 
| Draw.LINE     | 线| 
| Draw.POLYGON | 面|  
|            Draw.CIRCLE| 圆|
|            Draw.CURVE|圆弧|
|Draw.FREELINE|自由线|
|Draw.BEZIER_CURVE|贝塞尔曲线|
|Draw.BEZIER_POLYGON|贝塞尔曲面|
|Draw.FREEHAND_ARROW|箭头|
|Draw.MULTIHEAD|多头箭头|
|Draw.DASHLINE|虚线|
|Draw.CUBE|立方体化|
###实例属性和方法
| 属性        | 含义           | 
| ------------- |:-------------:| 
|view|SceneView的实例|
|gl|GraphicsLayer的实例|
|map|Map的实例|
|pointSymbol|用于点绘制的符号|
|lineSymbol|用于线绘制的符号|
|fillSymbol|用于面和立方体绘制的符号|

###绘制方法
`draw.activate(Draw.CURVE)` 使用相应的方法可以激活相应的图形绘制。

`draw.activate(Draw.CUBE)` 稍微特殊，激活之后，下一次所点击的多边形，上下移动鼠标，会把该多边形立方体化。

`draw.deactivate()` 结束绘制

##系统需求：

**浏览器版本**：最新版本的Chrome,FireFox,IE,Edge






