var BMapLib = window.BMapLib = BMapLib || {};
(function() {
    var getExtendedBounds = function(map, bounds, gridSize) {
        bounds = cutBoundsInRange(bounds);
        var pixelNE = map.pointToPixel(bounds.getNorthEast());
        var pixelSW = map.pointToPixel(bounds.getSouthWest());
        pixelNE.x += gridSize;
        pixelNE.y -= gridSize;
        pixelSW.x -= gridSize;
        pixelSW.y += gridSize;
        var newNE = map.pixelToPoint(pixelNE);
        var newSW = map.pixelToPoint(pixelSW);
        return new BMap.Bounds(newSW, newNE)
    };
    var cutBoundsInRange = function(bounds) {
        var maxX = getRange(bounds.getNorthEast().lng, -180, 180);
        var minX = getRange(bounds.getSouthWest().lng, -180, 180);
        var maxY = getRange(bounds.getNorthEast().lat, -74, 74);
        var minY = getRange(bounds.getSouthWest().lat, -74, 74);
        return new BMap.Bounds(new BMap.Point(minX, minY), new BMap.Point(maxX, maxY))
    };
    var getRange = function(i, mix, max) {
        mix && (i = Math.max(i, mix));
        max && (i = Math.min(i, max));
        return i
    };
    var isArray = function(source) {
        return '[object Array]' === Object.prototype.toString.call(source)
    };
    var indexOf = function(item, source) {
        var index = -1;
        if (isArray(source)) {
            if (source.indexOf) {
                index = source.indexOf(item)
            } else {
                for (var i = 0,
                         m; m = source[i]; i++) {
                    if (m === item) {
                        index = i;
                        break
                    }
                }
            }
        }
        return index
    };
    var MarkerClusterer = BMapLib.MarkerClusterer = function(map, options) {
        if (!map) {
            return
        }
        this._map = map;
        this._markers = [];
        this._clusters = [];
        var opts = options || {};
        this._gridSize = opts["gridSize"] || 60;
        this._maxZoom = opts["maxZoom"] || 18;
        this._minClusterSize = opts["minClusterSize"] || 2;
        this._isAverageCenter = false;
        if (opts['isAverageCenter'] != undefined) {
            this._isAverageCenter = opts['isAverageCenter']
        }
        this._styles = opts["styles"] || [];
        var that = this;
        this._map.addEventListener("zoomend",
            function() {
                that._redraw()
            });
        this._map.addEventListener("moveend",
            function() {
                that._redraw()
            });
        var mkrs = opts["markers"];
        isArray(mkrs) && this.addMarkers(mkrs)
    };
    MarkerClusterer.prototype.addMarkers = function(markers) {
        for (var i = 0,
                 len = markers.length; i < len; i++) {
            this._pushMarkerTo(markers[i])
        }
        this._createClusters()
    };
    MarkerClusterer.prototype._pushMarkerTo = function(marker) {
        var index = indexOf(marker, this._markers);
        if (index === -1) {
            marker.isInCluster = false;
            this._markers.push(marker)
        }
    };
    MarkerClusterer.prototype.addMarker = function(marker) {
        this._pushMarkerTo(marker);
        this._createClusters()
    };
    MarkerClusterer.prototype._createClusters = function() {
        var mapBounds = this._map.getBounds();
        var extendedBounds = getExtendedBounds(this._map, mapBounds, this._gridSize);
        for (var i = 0,
                 marker; marker = this._markers[i]; i++) {
            if (!marker.isInCluster && extendedBounds.containsPoint(marker.getPosition())) {
                this._addToClosestCluster(marker)
            }
        }
        /**
        *   修改1
        * */
        var len = this._markers.length;
        for (var i = 0; i < len; i++) {
            if (this._clusters[i]) {
                this._clusters[i].render();
            }
        }
    };
    MarkerClusterer.prototype._addToClosestCluster = function(marker) {
        var distance = 4000000;
        var clusterToAddTo = null;
        var position = marker.getPosition();
        for (var i = 0,
                 cluster; cluster = this._clusters[i]; i++) {
            var center = cluster.getCenter();
            if (center) {
                var d = this._map.getDistance(center, marker.getPosition());
                if (d < distance) {
                    distance = d;
                    clusterToAddTo = cluster
                }
            }
        }
        if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
            clusterToAddTo.addMarker(marker)
        } else {
            var cluster = new Cluster(this);
            cluster.addMarker(marker);
            this._clusters.push(cluster)
        }
    };
    MarkerClusterer.prototype._clearLastClusters = function() {
        for (var i = 0,
                 cluster; cluster = this._clusters[i]; i++) {
            cluster.remove()
        }
        this._clusters = [];
        this._removeMarkersFromCluster()
    };
    MarkerClusterer.prototype._removeMarkersFromCluster = function() {
        for (var i = 0,
                 marker; marker = this._markers[i]; i++) {
            marker.isInCluster = false
        }
    };
    MarkerClusterer.prototype._removeMarkersFromMap = function() {
        for (var i = 0,
                 marker; marker = this._markers[i]; i++) {
            marker.isInCluster = false;
            tmplabel = marker.getLabel();
            this._map.removeOverlay(marker);
            marker.setLabel(tmplabel)
        }
    };
    MarkerClusterer.prototype._removeMarker = function(marker) {
        var index = indexOf(marker, this._markers);
        if (index === -1) {
            return false
        }
        tmplabel = marker.getLabel();
        this._map.removeOverlay(marker);
        marker.setLabel(tmplabel);
        this._markers.splice(index, 1);
        return true
    };
    MarkerClusterer.prototype.removeMarker = function(marker) {
        var success = this._removeMarker(marker);
        if (success) {
            this._clearLastClusters();
            this._createClusters()
        }
        return success
    };
    MarkerClusterer.prototype.removeMarkers = function(markers) {
        var success = false;
        for (var i = 0; i < markers.length; i++) {
            var r = this._removeMarker(markers[i]);
            success = success || r
        }
        if (success) {
            this._clearLastClusters();
            this._createClusters()
        }
        return success
    };
    MarkerClusterer.prototype.clearMarkers = function() {
        this._clearLastClusters();
        this._removeMarkersFromMap();
        this._markers = []
    };
    MarkerClusterer.prototype._redraw = function() {
        this._clearLastClusters();
        this._createClusters()
    };
    MarkerClusterer.prototype.getGridSize = function() {
        return this._gridSize
    };
    MarkerClusterer.prototype.setGridSize = function(size) {
        this._gridSize = size;
        this._redraw()
    };
    MarkerClusterer.prototype.getMaxZoom = function() {
        return this._maxZoom
    };
    MarkerClusterer.prototype.setMaxZoom = function(maxZoom) {
        this._maxZoom = maxZoom;
        this._redraw()
    };
    MarkerClusterer.prototype.getStyles = function() {
        return this._styles
    };
    MarkerClusterer.prototype.setStyles = function(styles) {
        this._styles = styles;
        this._redraw()
    };
    MarkerClusterer.prototype.getMinClusterSize = function() {
        return this._minClusterSize
    };
    MarkerClusterer.prototype.setMinClusterSize = function(size) {
        this._minClusterSize = size;
        this._redraw()
    };
    MarkerClusterer.prototype.isAverageCenter = function() {
        return this._isAverageCenter
    };
    MarkerClusterer.prototype.getMap = function() {
        return this._map
    };
    MarkerClusterer.prototype.getMarkers = function() {
        return this._markers
    };
    MarkerClusterer.prototype.getClustersCount = function() {
        var count = 0;
        for (var i = 0,
                 cluster; cluster = this._clusters[i]; i++) {
            cluster.isReal() && count++
        }
        return count
    };
    function Cluster(markerClusterer) {
        this._markerClusterer = markerClusterer;
        this._map = markerClusterer.getMap();
        this._minClusterSize = markerClusterer.getMinClusterSize();
        this._isAverageCenter = markerClusterer.isAverageCenter();
        this._center = null;
        this._markers = [];
        this._gridBounds = null;
        this._isReal = false;
        this._clusterMarker = new BMapLib.TextIconOverlay(this._center, this._markers.length, {
            "styles": this._markerClusterer.getStyles()
        })
    }
    Cluster.prototype.addMarker = function(marker) {
        if (this.isMarkerInCluster(marker)) {
            return false
        }
        if (!this._center) {
            this._center = marker.getPosition();
            this.updateGridBounds()
        } else {
            if (this._isAverageCenter) {
                var l = this._markers.length + 1;
                var lat = (this._center.lat * (l - 1) + marker.getPosition().lat) / l;
                var lng = (this._center.lng * (l - 1) + marker.getPosition().lng) / l;
                this._center = new BMap.Point(lng, lat);
                this.updateGridBounds()
            }
        }
        marker.isInCluster = true;
        this._markers.push(marker);
        /**
        * 修改2
        *
        * */
        // var len = this._markers.length;
        // if (len < this._minClusterSize) {
        //     this._map.addOverlay(marker);
        //     return true
        // } else if (len === this._minClusterSize) {
        //     for (var i = 0; i < len; i++) {
        //         tmplabel = this._markers[i].getLabel();
        //         this._markers[i].getMap() && this._map.removeOverlay(this._markers[i]);
        //         this._markers[i].setLabel(tmplabel)
        //     }
        // }
        // this._map.addOverlay(this._clusterMarker);
        // this._isReal = true;
        // this.updateClusterMarker();
        // return true
    };
    /**
     * 修改3
     *
     * 进行dom操作
     * @return 无返回值
     */
    Cluster.prototype.render = function () {
        var len = this._markers.length;

        if (len < this._minClusterSize) {
            for (var i = 0; i < len; i++) {
                this._map.addOverlay(this._markers[i]);
            }
        } else {
            this._map.addOverlay(this._clusterMarker);
            this._isReal = true;
            this.updateClusterMarker();
        }
    }
    Cluster.prototype.isMarkerInCluster = function(marker) {
        if (this._markers.indexOf) {
            return this._markers.indexOf(marker) != -1
        } else {
            for (var i = 0,
                     m; m = this._markers[i]; i++) {
                if (m === marker) {
                    return true
                }
            }
        }
        return false
    };
    Cluster.prototype.isMarkerInClusterBounds = function(marker) {
        return this._gridBounds.containsPoint(marker.getPosition())
    };
    Cluster.prototype.isReal = function(marker) {
        return this._isReal
    };
    Cluster.prototype.updateGridBounds = function() {
        var bounds = new BMap.Bounds(this._center, this._center);
        this._gridBounds = getExtendedBounds(this._map, bounds, this._markerClusterer.getGridSize())
    };
    /**
     * 修改4
     * addLabel替代 updateClusterMarker里的addOverlay
     * 进行dom操作
     * @return 无返回值
     */
    Cluster.prototype.addLabel = function (marker) {
        //获取marker的坐标
        var position = marker.getPosition();
        //创建label
        var label = new BMap.Label({position : position});
        console.log('this._styles',this._styles)
        label.setStyle({
            height : '25px',
            color : "#fff",
            backgroundColor : this._styles[0].backgroundColor,
            border : 'none',
            borderRadius : "25px",
            fontWeight : 'bold',
            opacity : 0.9
        });
        var content = '<span style="color: #ffffff"><i class="fa fa-map-marker"></i></span>'
            + '<p style="padding:0px 13px;text-align:center;margin-top:5px;cursor:pointer;">'+marker.getTitle()+'</p>';
        label.setContent(content)
        label.setPosition(position);
        this._labels.push(label);
        this._map.addOverlay(label);
    }
    Cluster.prototype.updateClusterMarker = function() {
        if (this._map.getZoom() > this._markerClusterer.getMaxZoom()) {
            this._clusterMarker && this._map.removeOverlay(this._clusterMarker);
            for (var i = 0,
                     marker; marker = this._markers[i]; i++) {
                this._map.addOverlay(marker);
                // this._map.addLabel(marker)
            }
            return
        }
        if (this._markers.length < this._minClusterSize) {
            this._clusterMarker.hide();
            return
        }
        this._clusterMarker.setPosition(this._center);
        this._clusterMarker.setText(this._markers.length);
        var thatMap = this._map;
        var thatBounds = this.getBounds();
        this._clusterMarker.addEventListener("click",
            function(event) {
                thatMap.setViewport(thatBounds)
            })
    };
    Cluster.prototype.remove = function() {
        for (var i = 0,
                 m; m = this._markers[i]; i++) {
            var tmplabel = this._markers[i].getLabel();
            this._markers[i].getMap() && this._map.removeOverlay(this._markers[i]);
            this._markers[i].setLabel(tmplabel)
        }
        this._map.removeOverlay(this._clusterMarker);
        this._markers.length = 0;
        delete this._markers
    }
    Cluster.prototype.getBounds = function() {
        var bounds = new BMap.Bounds(this._center, this._center);
        for (var i = 0,
                 marker; marker = this._markers[i]; i++) {
            bounds.extend(marker.getPosition())
        }
        return bounds
    };
    Cluster.prototype.getCenter = function() {
        return this._center
    }
})();
