/******************************************************************************\
|                                                                              |
|                                    tiles.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility to draw a grid of regularly spaced tiles.           |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import Units from '../../../utilities/math/units.js';

export default function Tiles(viewport, element, tileSize, url) {

	// set attributes
	//
	this.viewport = viewport;
	this.tileSize = tileSize;
	this.element = element;
	this.url = url;

	return this;
}

// extend prototype from "superclass"
//
Tiles.prototype = _.extend(Object.create(Object.prototype), {

	//
	// rendering methods
	//

	toGroup: function() {
		let overdraw = 1;
		let width = this.viewport.width / this.viewport.scale / Units.pixelsPerMillimeter;
		let height = this.viewport.height / this.viewport.scale / Units.pixelsPerMillimeter;
		let scale = Math.pow(2, Math.round(Math.log2(1 / this.viewport.scale)));
		let tileSize = this.tileSize * scale;
		let rows = Math.ceil(height / tileSize) * overdraw + 2;
		let columns = Math.ceil(width / tileSize) * overdraw + 2;
		let namespace = 'http://www.w3.org/2000/svg';
		let group = document.createElementNS(namespace, 'g');

		let rowOffset = Math.floor(this.viewport.offset.y / Units.pixelsPerMillimeter / tileSize + 1);
		let columnOffset = Math.floor(this.viewport.offset.x / Units.pixelsPerMillimeter / tileSize + 1);

		for (let row = 0; row < rows; row++) {
			for (let column = 0; column < columns; column++) {
				let tile = document.createElementNS(namespace, 'image');
				let xOffset = -Math.floor(columns / 2) * tileSize;
				let yOffset = -Math.floor(rows / 2) * tileSize;
				let x = xOffset + (column - columnOffset) * tileSize;
				let y = yOffset + (row - rowOffset) * tileSize;

				tile.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.url);
				tile.setAttribute('width', tileSize + 'mm');
				tile.setAttribute('height', tileSize + 'mm');
				tile.setAttribute('x', x + 'mm');
				tile.setAttribute('y', y + 'mm');
				group.appendChild(tile);
			}
		}

		return group;
	},

	render: function() {
		let tiles = this.toTiles();
		let group = this.toGroup(tiles);

		$(this.element).append(group);
		if (this.group) {
			this.group.remove();
		}

		this.group = group;
	}
});