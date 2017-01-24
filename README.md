# ArcGIS JavaScript API 4.2 Draw extension

##Introduction
Customized a drawing utility class which supports graphic drawing in the sceneview. Supported geometry types includes: point, line, polygon, circle, circle segments, bezier polygon, bezier line, arrow and multi-head arrow. It also supports turn a polygon geometry type into a cubic. The support for drawing dashed line is experimental (it is implemented using three.js) it does not support customize of the line width.


 
##Introduction
You can reference the Draw class using relative path(the other scripts all needed to be included in the script/ folder, which draw class referenced using relative path in ths internal implementation)

```
require(["./script/Draw"], function(Draw) { /* code goes here */ });	
```

###**Constructor**:
```
new Draw({view: viewInstance, gl: graphicsLayerInstance})
```
The Draw class's constructor accept a object which contains a `view` property and `gl` property. The `view` property needs to point to the SceneView instance, the `gl` property need to point to a GraphicsLayer instance.

###**Static Properties**

| Static Properties        | Meaning           | 
| ------------- |:-------------:| 
| Draw.POINT     | point | 
| Draw.LINE     | line| 
| Draw.POLYGON | polygon|  
|            Draw.CIRCLE| circle|
|            Draw.CURVE|circle segment|
|Draw.FREELINE|freehand line|
|Draw.BEZIER_CURVE|bezier line|
|Draw.BEZIER_POLYGON|bezier polygon|
|Draw.FREEHAND_ARROW|arrow|
|Draw.MULTIHEAD|multi-head arrow|
|Draw.DASHLINE|dash line|
|Draw.CUBE|turn a polygon to a cubic|
###Instance properties and methods
| Properties        | Meaning           | 
| ------------- |:-------------:| 
|view|SceneView instance|
|gl|GraphicsLayer instance|
|map|Map instance|
|pointSymbol|the point symbol for point geometry|
|lineSymbol|the line symbol for line geometry|
|fillSymbol|the fill symbol for polygon geometry and cubic|

###Drawing method
`draw.activate(Draw.CURVE)` calling the corresponding method can active the drawing of the specified geometry.

`draw.activate(Draw.CUBE)` after calling this method, the next click on the polygon will turn the polygon into a cubic (move the mouse up and down to adjust the height of the cubic).

`draw.deactivate()` End drawing.

##System Requirements:

**浏览器版本**：Latest version of Chrome,FireFox,IE and Edge






