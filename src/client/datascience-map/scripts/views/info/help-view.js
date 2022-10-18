/******************************************************************************\
|                                                                              |
|                                   help-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the help/information view of the application.            |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//
	
	template: _.template(`
		<h1><i class="fa fa-question-circle"></i>Help</h1>

		<ol class="breadcrumb">
			<li><a href=""><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-question-circle"></i>Help</li>
		</ol>

		<h2>Techical Help</h2>
		<p>For help with technical problems, please use the <a href="#contact">contact form</a>.</p>

		<h2>The User Interface</h2>

		<h3><i class="fa fa-search"></i>The Search Bar</h3>
		<p>At the top of the screen you will see a search bar.  You can type in the name of a topic that you are interested in searching for or the name of a person. </p>

		<div class="figure">
			<img src="images/search-bar.png" width="500px" />
			<div class="caption">The Search Bar</div>
		</div>

		<p>To search, enter your search terms and then press the enter key or click the search button with the magnifying class icon.  To perform a more exact search, surround the search term that you would like to match with double quotes.</p>

		<div class="row">
			<div class="figure col-sm-8" style="float:none; margin:auto">
				<a href="images/search-by-name.png" target="_blank" class="lightbox" title="Search By Name"><img src="images/search-by-name.png" /></a>
				<div class="caption">Search By Name</div>
			</div>
		</div>

		<div class="row">
			<div class="figure col-sm-8" style="float:none; margin:auto">
				<a href="images/search-by-topic.png" target="_blank" class="lightbox" title="Search By Topic"><img src="images/search-by-topic.png" /></a>
				<div class="caption">Search By Topic</div>
			</div>
		</div>

		<div style="display:none">
		<h3><i class="fa fa-gear"></i>The Settings Bar</h3>
		<p>On the right side of the screen, you will see the the settings bar which contains buttons for showing or hiding different user interface elements. </p>
		<div class="figure">
			<img src="images/settings-bar.png" width="50px" />
			<div class="caption">The Settings Bar</div>
		</div>
		</div>

		<h3><i class="fa fa-map"></i>The Map Bar</h3>
		<p>The map bar contains buttons for configuring the map. </p>
		<div class="figure">
			<img src="images/map-bar.png" width="50px" />
			<div class="caption">The Map Bar</div>
		</div>

		<h3><i class="fa fa-plus"></i>The Zoom Bar</h3>
		<p>In the lower right corner, you will see your zoom controls. This provides buttons for zooming in or zooming out.  You can also zoom by dragging towards or away from you using your computer's trackpad. </p>
		<div class="figure">
			<img src="images/zoom-bar.png" width="50px" />
			<div class="caption">The Zoom Bar</div>
		</div>

		<div style="display:none">
		<h3><i class="fa fa-calendar"></i>The Date Bar</h3>
		<p>When you click on a person's icon, the date bar will be displayed.  The date bar allows you to select a date or date range to use when displaying information about that person. </p>
		<div class="figure">
			<img src="images/date-bar.png" width="500px" />
			<div class="caption">The Date Bar</div>
		</div>
		</div>
	`)
});
