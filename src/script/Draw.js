define([
        "esri/core/declare",
        'dojo/_base/lang',
        "./script/Graphic.js",
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/layers/GraphicsLayer",
        'dojo/_base/array', './script/MathStuff.js', "esri/geometry/geometryEngine", './script/three.min.js', "esri/views/3d/externalRenderers"
    ],
    function (declare, lang, Graphic, Point, Polyline, Polygon, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, GraphicsLayer, Array, MathStuff, geometryEngine, THREE, externalRenderers) {
        var draw = declare(null, {
            declaredClass: "Draw",
            constructor: function (options) {
                this.view = options.view
                this.gl = options.gl
                this.map = options.map
                this.pointSymbol = options.pointSymbol || new SimpleMarkerSymbol({
                        color: [226, 119, 40],

                        outline: {
                            color: [255, 255, 255],
                            width: 2
                        }
                    })
                this.lineSymbol = options.lineSymbol || new SimpleLineSymbol({
                        color: [226, 119, 40],
                        width: 4
                    })
                this.fillSymbol = options.fillSymbol || new SimpleFillSymbol({
                        color: [227, 139, 79, 0.8],
                        outline: {
                            color: [255, 255, 255],
                            width: 1
                        }
                    })
                this._points = []
                this._preGra = null
                this._currGra = null
                this._newHead = false
                this._headerCollection = []
                this._handlers = {}
            },
            reset: function (mode) {
                // for (var key in this._handlers) {
                //     console.log(this._handlers[key])
                //     this._handlers[key].remove()
                // }
                this.gl.elevationInfo = {mode: mode}
                this._points.length = 0
                this._preGra = null
                this._currGra = null
            },
            addGraphic2Map: function (geometry, symbol) {
                this._preGra = this._currGra
                this._currGra = new Graphic({
                    geometry: geometry,
                    symbol: symbol
                })
                //console.log('addGraphic2Map')
                this.gl.remove(this._preGra);
                this.gl.add(this._currGra);
            },
            activate: function (options) {
                switch (options) {
                    case draw.POINT:
                        this.reset('on-the-ground')
                        this._handlers.click = this.view.on('click', this.drawPoint.bind(this));
                        break;
                    case draw.LINE:
                        this.reset('on-the-ground')
                        this._handlers.click = this.view.on('click', this.drawLine_click.bind(this));
                        this._handlers.pointer_move = this.view.on('pointer-move', this.drawLine_pt_move.bind(this))
                        this._handlers.doubleClick = this.view.on('double-click', this.drawDoubleClick.bind(this))
                        break;
                    case draw.FREELINE:
                        this.reset('on-the-ground')
                        this._handlers.click = this.view.on('click', this.drawFreeLine_click.bind(this));
                        this._handlers.pointer_move = this.view.on('pointer-move', this.drawFreeLine_pt_move.bind(this))
                        this._handlers.doubleClick = this.view.on('double-click', this.drawDoubleClick.bind(this))
                        break;
                    case draw.POLYGON:
                        this.reset('on-the-ground')
                        this._handlers.click = this.view.on('click', this.drawPolygon.bind(this));
                        this._handlers.pointer_move = this.view.on('pointer-move', this.drawPolygon_pt_move.bind(this))
                        this._handlers.doubleClick = this.view.on('double-click', this.drawDoubleClick.bind(this))
                        break;
                    case draw.CIRCLE:
                        this.reset('on-the-ground')
                        this._handlers.click = this.view.on('click', this.drawCircle.bind(this));
                        this._handlers.pointer_move = this.view.on('pointer-move', this.drawCircle_pt_move.bind(this))
                        this._handlers.doubleClick = this.view.on('double-click', this.drawDoubleClick.bind(this))
                        break;
                    case draw.CURVE:
                        this.reset('on-the-ground')
                        this._handlers.click = this.view.on('click', this.drawCurve.bind(this));
                        this._handlers.pointer_move = this.view.on('pointer-move', this.drawCurve_pt_move.bind(this))
                        this._handlers.doubleClick = this.view.on('double-click', this.drawDoubleClick.bind(this))
                        break;
                    case draw.FREEHAND_ARROW:
                        this.reset('on-the-ground')
                        this._handlers.click = this.view.on('click', this.drawFreeHandArrow.bind(this));
                        this._handlers.pointer_move = this.view.on('pointer-move', this.drawFreeHandArrow_pt_move.bind(this))
                        this._handlers.doubleClick = this.view.on('double-click', this.drawDoubleClick.bind(this))
                        break;
                    case draw.BEZIER_POLYGON:
                        this.reset('on-the-ground')
                        this._handlers.click = this.view.on('click', this.drawFreePolygon.bind(this));
                        this._handlers.pointer_move = this.view.on('pointer-move', this.drawFreePolygon_pt_move.bind(this))
                        this._handlers.doubleClick = this.view.on('double-click', this.drawDoubleClick.bind(this))
                        break;
                    case draw.BEZIER_CURVE:
                        this.reset('on-the-ground')
                        this._handlers.click = this.view.on('click', this.drawbezierLine.bind(this));
                        this._handlers.pointer_move = this.view.on('pointer-move', this.drawbezierLine_pt_move.bind(this))
                        this._handlers.doubleClick = this.view.on('double-click', this.drawDoubleClick.bind(this))
                        break;
                    case draw.MULTIHEAD:
                        this.reset('on-the-ground')
                        this._handlers.click = this.view.on('click', this.drawMultiHead.bind(this));
                        this._handlers.pointer_move = this.view.on('pointer-move', this.drawMultiHead_pt_move.bind(this))
                        this._handlers.doubleClick = this.view.on('double-click', this.drawDoubleClick.bind(this))
                        break;
                    case draw.DASHLINE:
                        this.reset('on-the-ground')
                        this.drawHandler = this.view.on('click', this.drawDash.bind(this));
                        break;
                    case draw.CUBE:
                        this.reset('on-the-ground')
                        draw.activate(Draw.POLYGON)
                        this._handlers.pointer_move = this.view.on('pointer-move', this.drawCube_pt_move.bind(this))
                        this._handlers.doubleClick = this.view.on('double-click', this.drawDoubleClick.bind(this))
                        break;
                }
            },
            deactivate: function () {
                for (var key in this._handlers) {
                    this._handlers[key].remove()
                }
                // this.drawHandler.remove()
                this._preGra = null
                this._currGra = null
            },
            drawPoint: function (e) {
                var point = new Point({
                    x: e.mapPoint.x,
                    y: e.mapPoint.y,
                    z: e.mapPoint.z,
                    spatialReference: this.view.spatialReference
                })
                this.addGraphic2Map(point, this.pointSymbol)
                this.deactivate()
                // this.reset('on-the-ground')
            },
            drawLine_click: function (e) {

                var pt = [e.mapPoint.x, e.mapPoint.y, e.mapPoint.z]
                this._points.push(pt)
                if (this._points.length >= 2) {
                    var line = new Polyline({
                        paths: [this._points],
                        spatialReference: this.view.spatialReference
                    })
                    this.addGraphic2Map(line, this.lineSymbol)
                }
            },
            drawLine_pt_move: function (e) {

                if (this._points.length == 0) return
                //if (e.x == this.clickx && e.y == this.clicky) return
                var mp = this.view.toMap({x: e.x, y: e.y})
                // console.log(mp)
                var pt = [mp.x, mp.y, mp.z]
                if (this._points.length == 1) this._points.push(pt)
                else {
                    // if (this._points.length <= this.clickCount)
                    // {
                    //     console.log('小于！')
                    //     return
                    // }
                    this._points.pop()
                    this._points.push(pt)
                }
                // console.log(this._points.length)
                // this._points.splice(this._points.length - 1, 1, pt);
                if (this._points.length >= 2) {
                    var line = new Polyline({
                        paths: [this._points],
                        spatialReference: this.view.spatialReference
                    })
                    this.addGraphic2Map(line, this.lineSymbol)

                }
            },
            drawDoubleClick: function (e) {
                e.stopPropagation()
                this.deactivate()
            },

            drawFreeLine_click: function (e) {

                var pt = [e.mapPoint.x, e.mapPoint.y, e.mapPoint.z]
                this._points.push(pt)
                if (this._points.length >= 2) {
                    var line = new Polyline({
                        paths: [this._points],
                        spatialReference: this.view.spatialReference
                    })
                    this.addGraphic2Map(line, this.lineSymbol)
                }
            },
            drawFreeLine_pt_move: function (e) {
                if (this._points.length == 0) return
                var mp = this.view.toMap({x: e.x, y: e.y})

                // console.log(mp)
                var pt = [mp.x, mp.y, mp.z]
                this._points.push(pt)
                if (this._points.length >= 2) {
                    var line = new Polyline({
                        paths: [this._points],
                        spatialReference: this.view.spatialReference
                    })
                    this.addGraphic2Map(line, this.lineSymbol)

                }
            },

            drawPolygon: function (e) {
                var pt = [e.mapPoint.x, e.mapPoint.y, e.mapPoint.z]
                this._points.push(pt)
                if (this._points.length >= 3) {
                    var r = JSON.parse(JSON.stringify(this._points))
                    r.push(r[0])

                    var polygon = new Polygon({
                        rings: r,
                        spatialReference: this.view.spatialReference
                    })
                    this.addGraphic2Map(polygon, this.fillSymbol)

                }

            },
            drawPolygon_pt_move: function (e) {
                if (this._points.length <= 1) return
                var mp = this.view.toMap({x: e.x, y: e.y})
                var pt = [mp.x, mp.y, mp.z]
                if (this._points.length == 2) this._points.push(pt)
                else {
                    this._points.splice(this._points.length - 1, 1, pt)
                }
                var r = JSON.parse(JSON.stringify(this._points))
                r.push(r[0])

                var polygon = new Polygon({
                    rings: r,
                    spatialReference: this.view.spatialReference
                })
                this.addGraphic2Map(polygon, this.fillSymbol)
            },
            drawCircle: function (e) {
                var pt = {x: e.mapPoint.x, y: e.mapPoint.y, z: e.mapPoint.z}
                this._points.push(pt)
                if (this._points.length >= 2) {
                    var geometry = new Polygon({
                        rings: [MathStuff.circle(this._points[0], this._points[this._points.length - 1])],
                        spatialReference: this.view.spatialReference
                    });
                    this.addGraphic2Map(geometry, this.fillSymbol)
                }
            },
            drawCircle_pt_move: function (e) {
                if (this._points.length == 0) return
                var mp = this.view.toMap({x: e.x, y: e.y})
                var pt = {x: mp.x, y: mp.y, z: mp.z}
                this._points.push(pt)
                if (this._points.length >= 1) {
                    var geometry = new Polygon({
                        rings: [MathStuff.circle(this._points[0], this._points[this._points.length - 1])],
                        spatialReference: this.view.spatialReference
                    });
                    this.addGraphic2Map(geometry, this.fillSymbol)
                }
            },


            drawCurve: function (e) {
                var pt = [e.mapPoint.x, e.mapPoint.y, e.mapPoint.z]
                this._points.push(pt)
                if (this._points.length >= 3) {
                    var r = JSON.parse(JSON.stringify(this._points));
                    var geometry = new Polyline({
                        paths: [MathStuff.curve(r[0], r[1], r[r.length - 1])],
                        spatialReference: this.view.spatialReference
                    });
                    this.addGraphic2Map(geometry, this.lineSymbol)
                }
            },
            drawCurve_pt_move: function (e) {
                if (this._points.length < 2) return
                var mp = this.view.toMap({x: e.x, y: e.y})
                var pt = [mp.x, mp.y, mp.z]
                this._points.push(pt)
                if (this._points.length >= 3) {
                    var r = JSON.parse(JSON.stringify(this._points));
                    var geometry = new Polyline({
                        paths: [MathStuff.curve(r[0], r[1], r[r.length - 1])],
                        spatialReference: this.view.spatialReference
                    });
                    this.addGraphic2Map(geometry, this.lineSymbol)
                }
            },
            drawFreeHandArrow: function (e) {
                var pt = {x: e.mapPoint.x, y: e.mapPoint.y, z: e.mapPoint.z}
                this._points.push(pt)
                var polygon
                if (this._points.length == 2) {

                    polygon = new Polygon({
                        rings: [MathStuff.arrow2(this._points[0], this._points[1])],
                        spatialReference: this.view.spatialReference
                    })

                    this.addGraphic2Map(polygon, this.fillSymbol)

                }
                else if (this._points.length > 2) {

                    polygon = new Polygon({
                        rings: [MathStuff.arrow3(this._points)],
                        spatialReference: this.view.spatialReference
                    })

                    this.addGraphic2Map(polygon, this.fillSymbol)
                }
            },
            drawFreeHandArrow_pt_move: function (e) {
                if (this._points.length < 1) return
                var mp = this.view.toMap({x: e.x, y: e.y})
                var pt = {x: mp.x, y: mp.y, z: mp.z}

                var polygon
                this._points.push(pt)
                if (this._points.length == 2) {
                    this._points.splice(1, 1, pt)
                    polygon = new Polygon({
                        rings: [MathStuff.arrow2(this._points[0], this._points[1])],
                        spatialReference: this.view.spatialReference
                    })

                    this.addGraphic2Map(polygon, this.fillSymbol)

                }
                else if (this._points.length > 2) {
                    this._points.splice(this._points.length - 2, 1)
                    polygon = new Polygon({
                        rings: [MathStuff.arrow3(this._points)],
                        spatialReference: this.view.spatialReference
                    })

                    this.addGraphic2Map(polygon, this.fillSymbol)
                }
            },

            drawFreePolygon: function (e) {
                var pt = {x: e.mapPoint.x, y: e.mapPoint.y, z: e.mapPoint.z}
                this._points.push(pt)
                if (this._points.length >= 3) {
                    var geometry = new Polygon({
                        rings: [MathStuff.bezierPoly(this._points)],
                        spatialReference: this.view.spatialReference
                    });
                    this.addGraphic2Map(geometry, this.fillSymbol)
                }
            },
            drawFreePolygon_pt_move: function (e) {
                if (this._points.length <= 1) return
                var mp = this.view.toMap({x: e.x, y: e.y})
                var pt = {x: mp.x, y: mp.y, z: mp.z}
                if (this._points.length == 2) this._points.push(pt)
                else {
                    this._points.splice(this._points.length - 1, 1, pt)
                }
                var geometry = new Polygon({
                    rings: [MathStuff.bezierPoly(this._points)],
                    spatialReference: this.view.spatialReference
                });
                this.addGraphic2Map(geometry, this.fillSymbol)

            },
            drawbezierLine: function (e) {
                var pt = {x: e.mapPoint.x, y: e.mapPoint.y, z: e.mapPoint.z}
                this._points.push(pt)
                if (this._points.length >= 3) {
                    var geometry = new Polyline({
                        paths: [MathStuff.bezierLine(this._points)],
                        spatialReference: this.view.spatialReference
                    });
                    this.addGraphic2Map(geometry, this.lineSymbol)
                }
            },
            drawbezierLine_pt_move: function (e) {
                if (this._points.length <= 1) return
                var mp = this.view.toMap({x: e.x, y: e.y})
                var pt = {x: mp.x, y: mp.y, z: mp.z}
                if (this._points.length == 2) this._points.push(pt)
                else {
                    this._points.splice(this._points.length - 1, 1, pt)
                }
                var geometry = new Polyline({
                    paths: [MathStuff.bezierLine(this._points)],
                    spatialReference: this.view.spatialReference
                });
                this.addGraphic2Map(geometry, this.lineSymbol)
            },
            drawMultiHead: function (e) {
                if (e.native.which == 3) {
                    this.newHead()
                    return
                }
                var pt = {x: e.mapPoint.x, y: e.mapPoint.y, z: e.mapPoint.z}
                this._points.push(pt)
                if (this._points.length == 1) return
                var polygon
                if (this._newHead) {
                    this._newHead = false
                    this._points = [this._points[0], pt]
                }
                if (this._points.length == 2) {
                    polygon = new Polygon({
                        rings: [MathStuff.arrow2(this._points[0], this._points[1])],
                        spatialReference: this.view.spatialReference
                    })
                }
                else if (this._points.length > 2) {
                    polygon = new Polygon({
                        rings: [MathStuff.arrow3(this._points)],
                        spatialReference: this.view.spatialReference
                    })
                }
                if (this._headerCollection.length == 0)
                    this._headerCollection.push(polygon)
                else
                    this._headerCollection[this._headerCollection.length - 1] = polygon
                var union = geometryEngine.union(this._headerCollection);
                this.addGraphic2Map(union, this.fillSymbol)



            },
            drawMultiHead_pt_move: function (e) {
                if (this._points.length <= 0) return
                var mp = this.view.toMap({x: e.x, y: e.y})
                var pt = {x: mp.x, y: mp.y, z: mp.z}


                if (this._newHead) {
                    this._newHead = false
                    this._points = [this._points[0], pt]
                }
                if (this._points.length == 1) {
                    this._points.push(pt)
                    this._points.splice(this._points.length - 1, 1, pt)
                    polygon = new Polygon({
                        rings: [MathStuff.arrow2(this._points[0], this._points[1])],
                        spatialReference: this.view.spatialReference
                    })
                }
                else if (this._points.length > 1) {
                    this._points.splice(this._points.length - 1, 1, pt)
                    polygon = new Polygon({
                        rings: [MathStuff.arrow3(this._points)],
                        spatialReference: this.view.spatialReference
                    })
                }
                if (this._headerCollection.length == 0)
                    this._headerCollection.push(polygon)
                else
                    this._headerCollection[this._headerCollection.length - 1] = polygon
                var union = geometryEngine.union(this._headerCollection);
                this.addGraphic2Map(union, this.fillSymbol)
            },
            _y:0,
            drawCube_pt_move:function (e) {
                this._y = e.y
            },
            drawDash: function (e) {
                this._points.push(e.mapPoint.x)
                this._points.push(e.mapPoint.y)
                this._points.push(e.mapPoint.z)
                var pre = curr = null
                if (this._points.length > 5) {
                    var geo = this.buildThreeGeometry(this._points)
                    pre = curr
                    if (pre)
                        externalRenderers.remove(view, pre);
                    var curr = this.extRenderInstance(geo, this)
                    externalRenderers.add(view, curr);
                }
            },
            newHead: function () {
                this._newHead = true
                this._headerCollection.push(null)

            },
            buildThreeGeometry: function (x) {
                var renderCoordinates = [];

                externalRenderers.toRenderCoordinates(view,
                    x, 0, null,
                    renderCoordinates, 0,
                    x.length / 3);


                var geometry = new THREE.Geometry();

                for (var i = 0; i < renderCoordinates.length / 3; i++) {

                    geometry.vertices.push(new THREE.Vector3(renderCoordinates[3 * i], renderCoordinates[3 * i + 1], renderCoordinates[3 * i + 2] + 30000))
                    if (i > 0)
                        geometry.vertices.push(new THREE.Vector3(renderCoordinates[3 * i], renderCoordinates[3 * i + 1], renderCoordinates[3 * i + 2] + 30000))
                }
                geometry.vertices.pop()
                return geometry

            }
            ,
            extRenderInstance: function (geometry, drawInstance) {
                return {
                    renderer: null,     // three.js renderer
                    camera: null,       // three.js camera
                    scene: null,        // three.js scene

                    ambient: null,      // three.js ambient light source
                    sun: null,          // three.js sun light source

                    iss: null,                                                          // ISS model
                    issScale: 40000,                                                    // scale for the iss model
                    issMaterial: new THREE.MeshLambertMaterial({color: 0x38F8FF}),    // material for the ISS model

                    cameraPositionInitialized: false, // we focus the view on the ISS once we receive our first data point
                    positionHistory: [],              // all ISS positions received so far

                    markerMaterial: null,    // material for the markers left by the ISS
                    markerGeometry: null,    // geometry for the markers left by the ISS

                    setup: function (context) {
                        this.renderer = new THREE.WebGLRenderer({
                            context: context.gl,
                            premultipliedAlpha: false
                        });
                        this.renderer.setPixelRatio(window.devicePixelRatio);
                        this.renderer.setSize(context.camera.fullWidth, context.camera.fullHeight);

                        // prevent three.js from clearing the buffers provided by the ArcGIS JS API.
                        this.renderer.autoClearDepth = false;
                        this.renderer.autoClearStencil = false;
                        this.renderer.autoClearColor = false;

                        // The ArcGIS JS API renders to custom offscreen buffers, and not to the default framebuffers.
                        // We have to inject this bit of code into the three.js runtime in order for it to bind those
                        // buffers instead of the default ones.
                        var originalSetRenderTarget = this.renderer.setRenderTarget.bind(this.renderer);
                        this.renderer.setRenderTarget = function (target) {
                            originalSetRenderTarget(target);
                            if (target == null) {
                                context.bindRenderTarget();
                            }
                        }

                        // setup the three.js scene
                        ///////////////////////////////////////////////////////////////////////////////////////

                        this.scene = new THREE.Scene();

                        // setup the camera
                        var cam = context.camera;
                        this.camera = new THREE.PerspectiveCamera(cam.fovY, cam.aspect, cam.near, cam.far);

                        // setup scene lighting
                        this.ambient = new THREE.AmbientLight(0xffffff, 0.5);
                        this.scene.add(this.ambient);
                        this.sun = new THREE.DirectionalLight(0xffffff, 0.5);
                        this.scene.add(this.sun);

                        geometry.computeLineDistances();
                        var line = new THREE.LineSegments(geometry, new THREE.LineDashedMaterial({
                            color: drawInstance.lineSymbol.color.toHex(),
                            dashSize: 60000,
                            gapSize: 30000,
                            linewidth: 1
                        }));
                        var transform = new THREE.Matrix4();
                        this.scene.add(line);
                        context.resetWebGLState();
                    }
                    ,
                    render: function (context) {
                        var cam = context.camera;

                        this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
                        this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
                        this.camera.lookAt(new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2]));

                        // Projection matrix can be copied directly
                        this.camera.projectionMatrix.fromArray(cam.projectionMatrix);


                        this.renderer.resetGLState();
                        this.renderer.render(this.scene, this.camera);

                        // as we want to smoothly animate the ISS movement, immediately request a re-render
                        externalRenderers.requestRender(view);

                        // cleanup
                        context.resetWebGLState();
                    }
                }
            }


        })
        lang.mixin(draw, {
            POINT: "point",
            LINE: "line",
            POLYGON: "polygon",
            CIRCLE: "circle",
            CURVE: "curve",
            BEZIER_CURVE: "beziercurve",
            BEZIER_POLYGON: "bezierpolygon",
            FREEHAND_ARROW: "freehandarrow",
            MULTIHEAD: 'multihead',
            DASHLINE: 'dashline',
            FREELINE: 'freeline',
            CUBE:'cube'
        })
        return draw;

    })
