define(["esri/core/declare", "esri/Graphic"], function (declare, graphic) {
    return declare([graphic], {
        declaredClass: "CustomGraphic",
        constructor: function (options) {
            // this.inherited(arguments);
            var ring = options.geometry.rings;
            if(ring)
            {
                if(this.ringCounterClockwise(ring[0]))
                {
                    options.geometry.rings[0] = ring[0].reverse();
                }
            }
        },
        ringCounterClockwise: function (vertices) {
            var area = 0;
            for (var i = 0; i < vertices.length; i++) {
                j = (i + 1) % vertices.length;
                area += vertices[i][0] * vertices[j][1];
                area -= vertices[j][0] * vertices[i][1];
            }
            return area  > 0;
        }
    })

});