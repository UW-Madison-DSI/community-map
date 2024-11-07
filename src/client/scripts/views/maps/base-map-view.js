/******************************************************************************\
|                                                                              |
|                             base-map-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a basic map view.                                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Vector2 from '../../utilities/math/vector2.js';
import Units from '../../utilities/math/units.js';
import BaseView from '../../views/base-view.js';
import SVGViewport from '../../views/svg/viewports/svg-viewport.js';
import MultiGrid from '../../views/svg/viewports/grids/multi-grid.js';
import MouseDragPanBehavior from '../../views/svg/viewports/behaviors/navigation/mouse-drag-pan-behavior.js';
import MouseDragZoomBehavior from '../../views/svg/viewports/behaviors/navigation/mouse-drag-zoom-behavior.js';
import MouseWheelZoomBehavior from '../../views/svg/viewports/behaviors/navigation/mouse-wheel-zoom-behavior.js';
import BingMap from '../../views/maps/tiles/bing-map.js';
import MapTiles from '../../views/maps/tiles/map-tiles.js';
import ZoomBarView from '../../views/toolbars/zoom-bar-view.js';
import FullScreenable from '../../views/behaviors/layout/full-screenable.js';
import Browser from '../../utilities/web/browser.js';

export default BaseView.extend(_.extend({}, FullScreenable, {

	//
	// attributes
	//

	template: _.template(`
		<svg id="viewport">
			<defs>
				<filter id="outlined" color-interpolation-filters="sRGB">
					<feMorphology in="SourceAlpha" result="MORPH" operator="dilate" radius="1" />
					<feColorMatrix in="MORPH" result="WHITENED" type="matrix" values="-1 0 0 0 1, 0 -1 0 0 1, 0 0 -1 0 1, 0 0 0 1 0"/>
					<feMerge>
						<feMergeNode in="WHITENED"/>
						<feMergeNode in="SourceGraphic"/>
					</feMerge>
				</filter>
				<filter id="selected-text" x="-.025" y="0.15" width="1.05" height="0.75">
					<feFlood flood-color="black"/>
					<feComposite in="SourceGraphic"/>
				</filter>
			</defs>
			<g id="tiles"></g>
			<g id="departments" style="display:none"></g>
		</svg>

		<div id="user-interface">
			<div id="zoom-bar"></div>
		</div>
	`),

	regions: {
		zoom: {
			el: '#zoom-bar',
			replaceElement: true
		}
	},

	autohideLabels: Browser.is_mobile,
	duration: 500,

	//
	// constructor
	//

	initialize: function(options) {

		// set attributes
		//
		this.options = options || {};
		this.scale = 1;
		this.offset = new Vector2(0, 0);
		this.grid = this.options.grid !== undefined? this.options.grid : new MultiGrid();
		this.layers = this.options.layers || ['overlays'];
		this.stack = [];
		this.parent = this.options.parent;
	},

	//
	// converting methods
	//

	latLongToPoint: function(latitude, longitude) {
		let scale = this.getScale();
		let point = new Vector2(-longitude, latitude);
		point = point.minus(new Vector2(this.map.longitude, this.map.latitude));
		point.x = -point.x;
		point = point.times(new Vector2(11650, 15950).scaledBy(scale));
		return point;
	},

	//
	// getting methods
	//

	getLocation: function() {
		return new Vector2(-this.viewport.offset.x, this.viewport.offset.y);
	},

	getZoomLevel: function() {
		return this.viewport.getZoomLevel();
	},

	getScale: function() {
		return Math.pow(2, this.options.zoom_level - 14);
	},

	getMapMode: function() {
		return this.mapMode;
	},

	//
	// setting methods
	//

	setToolbarVisible: function(toolbar, visible) {
		if (visible) {
			this.getChildView(toolbar).show();
		} else {
			this.getChildView(toolbar).hide();
		}
	},

	//
	// navigation methods
	//

	panTo: function(location, options) {
		let duration = options && options.duration? options.duration : this.duration;

		// start animation
		//
		this.onPanStart();

		// stop previous animation
		//
		if (this.animation) {
			this.animation.stop();
		}

		this.animation = this.getChildView('zoom').panTo(location, {
			duration: duration,

			// callbacks
			//
			done: () => {
				this.animation = null;

				// end animation
				//
				this.onPanEnd();

				// perform callback
				//
				if (options && options.done) {
					options.done();
				}
			}
		});
	},

	zoomTo: function(zoomLevel, options) {
		let duration = options && options.duration? options.duration : this.duration;

		// start animation
		//
		this.onZoomStart();

		// stop previous animation
		//
		if (this.animation) {
			this.animation.stop();
		}

		this.animation = this.getChildView('zoom').panTo(location, {
			duration: duration,

			// callbacks
			//
			done: () => {
				this.animation = null;

				// end animation
				//
				this.onZoomEnd();

				// perform callback
				//
				if (options && options.done) {
					options.done();
				}
			}
		});	
	},

	panAndZoomTo: function(location, zoomLevel, options) {
		let duration = options && options.duration? options.duration : this.duration;

		// start animation
		//
		this.onPanStart();
		this.onZoomStart();

		// stop previous animation
		//
		if (this.animation) {
			this.animation.stop();
		}

		this.animation = this.getChildView('zoom').panAndZoomTo(location, zoomLevel, {
			duration: duration,

			// callbacks
			//
			done: () => {
				this.animation = null;

				// end animation
				//
				this.onPanEnd();
				this.onZoomEnd();

				// perform callback
				//
				if (options && options.done) {
					options.done();
				}
			}
		});
	},

	zoomAndPanTo: function(location, zoomLevel, options) {
		let duration = options && options.duration? options.duration : this.duration;

		// start animation
		//
		this.onZoomStart();
		this.onPanStart();

		// stop previous animation
		//
		if (this.animation) {
			this.animation.stop();
		}

		this.animation = this.getChildView('zoom').zoomAndPanTo(location, zoomLevel, {
			duration: duration,

			// callbacks
			//
			done: () => {
				this.animation = null;

				// end animation
				//
				this.onZoomEnd();
				this.onPanEnd();

				// perform callback
				//
				if (options && options.done) {
					options.done();
				}
			}
		});
	},

	goTo: function(location, zoomLevel, options) {
		if (location && zoomLevel != undefined) {
			if (this.getZoomLevel() < zoomLevel) {
				this.panAndZoomTo(location, zoomLevel, options);
			} else {
				this.zoomAndPanTo(location, zoomLevel, options);
			}
		} else if (location) {
			this.panTo(location);
		} else if (zoomLevel != undefined) {
			this.zoomTo(zoomLevel, options);
		}
	},

	zoomToLocations: function(locations, options) {
		let center = Vector2.center(locations);
		let zoomLevel = locations.length > 1? this.getVerticesZoomLevel(locations): 1;

		if (!locations || locations.length == 0) {
			return;
		}

		if (zoomLevel < -2) {
			zoomLevel = -2;
		}
		if (zoomLevel > 2) {
			zoomLevel = 2;
		}

		if (zoomLevel != undefined) {
			if (zoomLevel < -2) {
				zoomLevel = -2;
			}
		}

		// no need to zoom
		//
		if (Math.abs(this.getZoomLevel() - zoomLevel) < 0.01) {
			zoomLevel = undefined;
		}

		this.goTo(center, zoomLevel, options);
	},

	pushView: function() {
		this.stack.push({
			location: this.getLocation(),
			zoomLevel: this.getZoomLevel()
		});
	},

	popView: function() {
		if (this.stack.length > 0) {
			let view = this.stack.pop();
			this.goTo(view.location, view.zoomLevel);
		}
	},

	//
	// map methods
	//

	setMapMode: function(mapMode) {

		// check if current mode matches desired mode
		//
		if (this.mapMode == mapMode) {
			return;
		}

		// update map tiles
		//
		this.map.view = mapMode;
		this.tiles.render();

		// set attributes
		//
		this.mapMode = mapMode;
	},

	showMapLabels: function() {
		this.map.labels = true;
		this.tiles.render();
	},

	hideMapLabels: function() {
		this.map.labels = false;
		this.tiles.render();
	},

	//
	// zoom methods
	//

	updateZoomLevel: function() {
		let zoomLevel = this.viewport.getZoomLevel() + 2;

		// update display
		//
		if (this.hasChildView('zoom')) {
			this.getChildView('zoom').showZoomLevel(zoomLevel);
		}

		// update labels and tiles
		//
		window.clearTimeout(window.timeout);
		window.timeout = window.setTimeout(() => {
			this.update();
			this.timeout = null;
		}, 100);
	},

	//
	// navigation methods
	//

	zoomToLocation: function(location, options) {
		if (Math.abs(location.x + this.viewport.offset.x) < 0.01 && 
			Math.abs(location.y - this.viewport.offset.y) < 0.01) {
			return;
		}

		// start animation
		//
		this.onZoomStart();

		$({
			y: this.viewport.offset.y
		}).animate({
			x: -location.x,
			y: location.y
		}, {
			duration: this.duration,
			step: () => { 
				this.viewport.setOffset(new Vector2(this.x, this.y));
			},
			complete: () => {

				// end animation
				//
				this.onZoomEnd();

				// perform callback
				//
				if (options && options.done) {
					options.done();
				}
			}
		});
	},

	resetView: function(options) {
		this.goTo(new Vector2(0, 0), 0, options);
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// create viewport
		//
		this.viewport = new SVGViewport({
			el: this.$el.find('#viewport')[0],
			scale: this.scale,
			offset: this.offset,
			grid: this.grid,
			layers: this.layers,
			parent: this,

			// callbacks
			//
			onchange: (attribute) => {
				if (attribute == 'scale') {
					this.updateZoomLevel();
				}
			}
		});

		// render map
		//
		this.showBaseMap();

		// render overlay toolbars
		//
		this.showToolbars();
	},

	showBaseMap: function() {

		// create scene
		//
		this.map = new BingMap(this.options.longitude, this.options.latitude, this.options.zoom_level, this.options.map_kind);
		this.tiles = new MapTiles(this.viewport, $('#tiles'), 256 * Units.millimetersPerPixel, this.map);

		// render initial map
		//
		this.tiles.render();

		// add mouse interaction behaviors
		//
		this.addBehaviors();
	},

	showToolbars: function() {

		// render toolbars
		//
		this.showZoomBar();
	},

	showZoomBar: function() {
		this.showChildView('zoom', new ZoomBarView({
			parent: this,

			// callbacks
			//
			onzoomstart: () => {
				this.onZoomStart();
			},
			onzoomend: () => {
				this.onZoomEnd();
			}	
		}));
	},

	update: function() {
		if (this.tiles) {
			this.tiles.render();
		}
		if (this.labelsView) {
			this.labelsView.update();
		}
	},

	updateScale: function() {
		this.viewport.setScale(this.viewport.scale);
	},

	redraw: function() {
		if (this.tiles) {
			this.tiles.render();
		}
		if (this.labelsView) {
			this.labelsView.redraw();
		}
	},

	fadeOut: function() {
		this.viewport.$el.find('#tiles').fadeOut();
		$('#background').fadeIn();
	},

	fadeIn: function() {
		this.viewport.$el.find('#tiles').fadeIn();
		$('#background').fadeOut();
	},

	addBehaviors: function() {
		this.panBehavior = new MouseDragPanBehavior(this.viewport, {
			button: 1,

			// callbacks
			//
			ondragstart: (startx, starty) => {
				this.onDragStart(startx, starty);
			},
			ondrag: (startx, starty) => {
				this.onDrag(startx, starty);
			},
			ondragend: (dragx, dragy) => {
				this.onDragEnd(dragx, dragy);
			}
		});

		this.zoomBehavior = new MouseDragZoomBehavior(this.viewport, {
			button: 2,

			// callbacks
			//
			onzoomstart: () => {
				this.onZoomStart();
			},
			onzoomend: () => {
				this.onZoomEnd();
			}
		});
		this.zoomBehavior2 = new MouseWheelZoomBehavior(this.viewport, {

			// callbacks
			//
			onzoom: () => {
				this.onWheelZoomStart();
			}
		});
	},

	clearOverlays: function() {
		$('.tooltip').remove();
	},

	//
	// hiding methods
	//

	showMap: function() {
		this.viewport.$el.removeClass('hide-map');
	},

	hideMap: function() {
		this.viewport.$el.addClass('hide-map');
	},

	showGrid: function() {
		this.viewport.$el.removeClass('hide-grid');
	},

	hideGrid: function() {
		this.viewport.$el.addClass('hide-grid');
	},

	//
	// navigation event handling methods
	//

	onPanStart: function() {
		this.clearOverlays();
	},

	onPanEnd: function() {

		// update map
		//
		this.redraw();
	},

	onZoomStart: function() {
		this.clearOverlays();
		if (this.autohideLabels && this.labelsView) {
			this.labelsView.hide();
		}
	},

	onZoomEnd: function() {
		if (this.autohideLabels && this.labelsView) {
			this.labelsView.show();
		}
	},

	//
	// mouse event handling methods
	//

	onDragStart: function() {

		// clear tooltips / popups
		//
		this.clearOverlays();
	},

	onDrag: function() {
		if (this.autohideLabels && this.labelsView) {
			this.labelsView.hide();
		}
	},

	onDragEnd: function(dragx, dragy) {
		if (this.autohideLabels && this.labelsView) {
			this.labelsView.show();
		}

		if (dragx != 0 || dragy != 0) {
			if (this.tiles) {
				this.tiles.render();
			}
			if (this.labelsView) {
				this.labelsView.redraw();
			}
		}
	},

	onWheelZoomStart: function() {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			this.onWheelZoomEnd();
		}, 100);
		this.clearOverlays();
	},

	onWheelZoomEnd: function() {
		this.update();
	},

	onResize: function() {
		if (this.viewport) {
			this.viewport.onResize();
		}
	}
}));