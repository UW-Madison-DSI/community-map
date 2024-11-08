/******************************************************************************\
|                                                                              |
|                                 map-tiles.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility to draw a grid of regularly spaced tiles.           |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import Tiles from './tiles.js';
import Units from '../../../utilities/math/units.js';

export default function MapTiles(viewport, element, tileSize, map) {

	// set attributes
	//
	this.viewport = viewport;
	this.tileSize = tileSize;
	this.element = element;
	this.map = map;
	this.tiles = [];

	return this;
}

// extend prototype from "superclass"
//
MapTiles.prototype = _.extend(new Tiles(), {

	//
	// attributes
	//

	fadeDuration: 500,

	//
	// tile set querying methods
	//

	sameAs: function(tile1, tile2) {
		return $(tile1).attr('href') == $(tile2).attr('href');
	},

	contains: function(tiles, tile) {
		for (let i = 0; i < tiles.length; i++) {
			if (this.sameAs(tiles[i], tile)) {
				return true;
			}
		}
	},

	getUnion: function(tiles1, tiles2) {
		let  tiles = [];
		for (let i = 0; i < tiles1.length; i++) {
			let  tile = tiles1[i];
			if (this.contains(tiles2, tile)) {
				tiles.push(tile);
			}
		}
		return tiles;
	},

	getDifference: function(tiles1, tiles2) {
		let  tiles = [];
		for (let i = 0; i < tiles1.length; i++) {
			let  tile = tiles1[i];
			if (!this.contains(tiles2, tile)) {
				tiles.push(tile);
			}
		}
		return tiles;
	},

	//
	// rendering methods
	//

	getTiles: function() {
		let  tiles = [];
		let  namespace = 'http://www.w3.org/2000/svg';

		// find zoom level
		//
		let  zoom = Math.round(Math.log2(this.viewport.scale));
		zoom = Math.min(zoom, this.map.maxZoomLevel - this.map.zoomLevel);

		// find map parameters
		//
		let  scale = Math.pow(2, -zoom);
		let  tileSize = this.tileSize * scale;
		let  tileX = Math.round(this.viewport.offset.x / Units.pixelsPerMillimeter / tileSize);
		let  tileY = Math.round(this.viewport.offset.y / Units.pixelsPerMillimeter / tileSize);

		// find center tile
		//
		let  numTiles = this.map.getNumTiles();
		let  offsetX = tileX * scale / numTiles;
		let  offsetY = tileY * scale / numTiles;
		let  location = this.map.getTileLocation(-offsetX, -offsetY, -zoom);

		// find center tile offset
		//
		let  numTiles2 = this.map.getNumTiles(zoom);
		let  x = this.map.getX() * numTiles2;
		let  y = this.map.getY() * numTiles2;
		let  xOffset = (x - Math.trunc(x));
		let  yOffset = (y - Math.trunc(y));

		// find rows and columns
		//
		let  width = this.viewport.width / this.viewport.scale / Units.pixelsPerMillimeter;
		let  height = this.viewport.height / this.viewport.scale / Units.pixelsPerMillimeter;
		let  rows = Math.ceil(height / tileSize / 2) * 2 + 2;
		let  columns = Math.ceil(width / tileSize / 2) * 2 + 2;

		// go to upper left corner
		//
		let  rowOffset = Math.floor(rows / 2);
		for (let i = 0; i < rowOffset; i++) {
			location = this.map.getNeighborTileLocation(location, 'upper');
		}
		let  columnOffset = Math.floor(columns / 2);
		for (let j = 0; j < columnOffset; j++) {
			location = this.map.getNeighborTileLocation(location, 'left');
		}

		let  rowLocation = location;
		let  tileSize2 = tileSize + 1 * scale / Units.pixelsPerMillimeter;
		// let  tileSize2 = tileSize;
		for (let row = 0; row < rows; row++) {
			let  columnLocation = rowLocation;
			for (let column = 0; column < columns; column++) {
				let  tile = document.createElementNS(namespace, 'image');
				let  url = this.map.getLocationTileUrl(columnLocation);

				tile.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
				tile.setAttribute('width', tileSize2+ 'mm');
				tile.setAttribute('height', tileSize2 + 'mm');
				tile.setAttribute('x', ((column - columnOffset - tileX - xOffset) * tileSize) + 'mm');
				tile.setAttribute('y', ((row - rowOffset - tileY - yOffset) * tileSize) + 'mm');
				// tile.setAttribute('image-rendering', 'pixelated');
				// tile.setAttribute('shape-rendering', 'crisp-edges');
				tiles.push(tile);
				columnLocation = this.map.getNeighborTileLocation(columnLocation, 'right');
			}
			rowLocation = this.map.getNeighborTileLocation(rowLocation, 'lower');
		}

		return tiles;
	},

	toGroup: function(tiles) {
		let  namespace = 'http://www.w3.org/2000/svg';
		let  group = document.createElementNS(namespace, 'g');

		for (let i = 0; i < tiles.length; i++) {
			group.appendChild(tiles[i]);
		}

		return group;
	},

	render: function() {
		let  tiles = this.getTiles();
		let  existingTiles = $(this.element).children();
		let  newTiles = this.getDifference(tiles, existingTiles);
		let  oldTiles = this.getDifference(existingTiles, tiles);

		// remove no longer needed tiles
		//
		for (let i = 0; i < oldTiles.length; i++) {
			$(oldTiles[i]).fadeOut(self.fadeDuration, function() {
				$(this).remove();
			});
		}

		// add new tiles
		//
		for (let j = 0; j < newTiles.length; j++) {
			let  newTile = $(newTiles[j]).hide().fadeIn(self.fadeDuration);
			$(this.element).append(newTile);
		}
	},

	clear: function() {
		$(this.element).children().remove();
	}
});