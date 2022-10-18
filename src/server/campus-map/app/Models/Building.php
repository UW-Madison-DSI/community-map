<?php
/******************************************************************************\
|                                                                              |
|                                 Building.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a building.                                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

namespace App\Models;

use App\Models\BaseModel;

class Building extends BaseModel
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'buildings';

	/**
	 * Indicates if the IDs are auto-incrementing.
	 *
	 * @var bool
	 */
	public $incrementing = false;

	/**
	 * The "type" of the primary key ID.
	 *
	 * @var string
	 */
	protected $keyType = 'integer';
	
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'id',
		'name',
		'building_number',
		'department_ids',
		'description',
		'hours',
		'geojson_id',
		'medium_image',
		'thumb_image',
		'description',
		'latitude',
		'longitude',
		'object_type',
		'street_address',
		'tag_ids',
		'thumbnail'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'name',
		'building_number',
		'departments',
		'description',
		'hours',
		'geojson',
		'medium_image',
		'thumb_image',
		'description',
		'latlng',
		'object_type',
		'street_address',
		'tags',
		'thumbnail'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'departments',
		'geojson',
		'latlng',
		'tags'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'id' => 'integer',
		'building_number' => 'integer'
	];

	//
	// accessor methods
	//

	/**
	 * Get this building's departments attribute.
	 *
	 * @return object
	 */
	public function getDepartmentsAttribute() {
		return [];
	}

	/**
	 * Get this building's geojson attribute.
	 *
	 * @return object
	 */
	public function getGeoJsonAttribute() {
		return GeoJson::find($this->geojson_id);
	}

	/**
	 * Get this building's latlng attribute.
	 *
	 * @return object
	 */
	public function getLatLngAttribute() {
		return [$this->latitude, $this->longitude];
	}

	/**
	 * Get this buildings tags attribute.
	 *
	 * @return object
	 */
	public function getTagsAttribute() {
		return [];
	}
}
