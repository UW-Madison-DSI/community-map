/******************************************************************************\
|                                                                              |
|                               microsoft-map.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for rendering maps using tiles from Microsoft.      |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import Map from "./map.js";

//
// constructor
//

export default function MSMap(longitude, latitude, zoomLevel) {

	// set attributes
	//
	this.longitude = longitude;
	this.latitude = latitude;
	this.zoomLevel = zoomLevel;

	// set map server attributes
	//
	this.mapTileServer = "http://r3.ortho.tiles.virtualearth.net";
	this.satelliteTileServer = "http://a0.ortho.tiles.virtualearth.net";
	this.hybridTileServer = "http://h1.ortho.tiles.virtualearth.net";

	// set paths
	//
	this.mapTilePath = "tiles";
	this.satelliteTilePath = "tiles";
	this.hybridTilePath = "tiles";
	
	return this;
}

// inherit prototype from "superclass"
//
MSMap.prototype = _.extend(new Map(), {

	//
	// querying methods
	//

	getTileLocation: function(offsetX, offsetY, zoomOffset) {
		let x = this.getX() + (offsetX || 0);
		let y = 1 - this.getY() - (offsetY || 0);
		let xmin = 0, xmax = 1;
		let ymin = 0, ymax = 1;
		let location = "";

		for (let i = 0; i < this.zoomLevel - (zoomOffset || 0); i++) {
			let xmid = (xmin + xmax) / 2;
			let ymid = (ymin + ymax) / 2;

			if (y > ymid) {

				// upper part ("0" or "1" quadrants)
				//
				ymin = ymid;
				if (x < xmid) {

					// upper left quadrant - "0"
					//
					location += "0";
					xmax = xmid;
				} else {

					// upper right quadrant - "1"
					//
					location += "1";
					xmin = xmid;
				}
			} else {

				// lower part ("2" or "3" quadrants)
				//
				ymax = ymid;
				if (x < xmid) {

					// lower left quadrant - "2"
					//
					location += "2";
					xmax = xmid;
				} else {

					// lower right quadrant - "3"
					//
					location += "3";
					xmin = xmid;
				}
			}
		}

		return location;
	},

	getNeighborTileLocation: function(location, direction) {
		let parent = location.substring(0, location.length - 1);
		let quadrant = location.charAt(location.length - 1);

		if (direction == "left") {
			if (quadrant == "0") {
				parent = this.getNeighborTileLocation(parent, direction);
				quadrant = "1";
			} else if (quadrant == "1")
				quadrant = "0";
			else if (quadrant == "3")
				quadrant = "2";
			else if (quadrant == "2") {
				parent = this.getNeighborTileLocation(parent, direction); 
				quadrant = "3";
			}

		} else if (direction == "right") {
			if (quadrant == "0")
				quadrant = "1";
			else if (quadrant == "1") {
				parent = this.getNeighborTileLocation(parent, direction);
				quadrant = "0";
			} else if (quadrant == "3") {
				parent = this.getNeighborTileLocation(parent, direction); 
				quadrant = "2";
			} else if (quadrant == "2")
				quadrant = "3";

		} else if (direction == "upper") {
			if (quadrant == "0") {
				parent = this.getNeighborTileLocation(parent, direction);
				quadrant = "2";
			} else if (quadrant == "1") {
				parent = this.getNeighborTileLocation(parent, direction);
				quadrant = "3";
			} else if (quadrant == "3")
				quadrant = "1";
			else if (quadrant == "2")
				quadrant = "0";

		} else if (direction == "lower") {
			if (quadrant == "0")
				quadrant = "2";
			else if (quadrant == "1")
				quadrant = "3";
			else if (quadrant == "3") {
				parent = this.getNeighborTileLocation(parent, direction);
				quadrant = "1";
			} else if (quadrant == "2") {
				parent = this.getNeighborTileLocation(parent, direction);
				quadrant = "0";
			}

		} else if (direction == "upper left") {
			if (quadrant == "0") {
				parent = this.getNeighborTileLocation(parent, direction);
				quadrant = "3";
			} else if (quadrant == "1") {
				parent = this.getNeighborTileLocation(parent, "upper");
				quadrant = "2";
			} else if (quadrant == "3")
				quadrant = "0";
			else if (quadrant == "2") {
				parent = this.getNeighborTileLocation(parent, "left");
				quadrant = "1";
			}

		} else if (direction == "upper right") {
			if (quadrant == "0") {
				parent = this.getNeighborTileLocation(parent, "upper");
				quadrant = "3";
			} else if (quadrant == "1") {
				parent = this.getNeighborTileLocation(parent, direction);
				quadrant = "2";
			} else if (quadrant == "3") {
				parent = this.getNeighborTileLocation(parent, "right");
				quadrant = "0";
			} else if (quadrant == "2")
				quadrant = "1";

		} else if (direction == "lower left") {
			if (quadrant == "0") {
				parent = this.getNeighborTileLocation(parent, "left");
				quadrant = "3";
			} else if (quadrant == "1")
				quadrant = "2";
			else if (quadrant == "3") {
				parent = this.getNeighborTileLocation(parent, "lower");
				quadrant = "0";
			} else if (quadrant == "2") {
				parent = this.getNeighborTileLocation(parent, direction);
				quadrant = "1";
			}

		} else if (direction == "lower right") {
			if (quadrant == "0")
				quadrant = "3";
			else if (quadrant == "1") {
				parent = this.getNeighborTileLocation(parent, "right");
				quadrant = "2";
			} else if (quadrant == "3") {
				parent = this.getNeighborTileLocation(parent, direction);
				quadrant = "0";
			} else if (quadrant == "2") {
				parent = this.getNeighborTileLocation(parent, "lower");
				quadrant = "1";
			}
		}

		return parent + quadrant;
	},

	//
	// map tile URL querying methods
	//

	getLocationTileUrl: function(view, location) {
		if (view == "map" || view == "roads")
			return this.mapTileServer + "/" + this.mapTilePath + "/" + "r" + location + ".png" + "?g=45";
		else if (view == "aerial" || view == "satellite")
			return this.satelliteTileServer + "/" + this.satelliteTilePath + "/" + "a" + location + ".png" + "?g=45";
		else
			return this.hybridTileServer + "/" + this.hybridTilePath + "/" + "h" + location + ".png" + "?g=45";
	},

	getTileURL: function(view, latitude, longitude, zoomLevel) {
		return this.getLocationTileUrl(view, this.getTileLocation(latitude, longitude, zoomLevel));
	}
});