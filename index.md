---
layout: default
custom_css:
- main
custom_js:
- func_general
- settings
- icon_array
- objects_arrays
- func_popup
- func_event
- func_mapping
- index_map
---

<div class='container'>
	<div class='col-sidebar'>
		<div class='col-header'>
			<h2>College Advising Resource Map</h2>	
		</div>
		<div id='instructions'>
			<p>Use this interactive map to explore college advising resources
				available in high schools and communities across the country.</p>
			<h3>Instructions</h3>
			<p><i class='fas fa-search fa-lg fa-fw'></i>
				<b>Search</b> using place name ("Charlottesville, VA") or zip code ("22901")</p>
			<p><i class='fas fa-crosshairs fa-lg fa-fw'></i>
				<b>Use the location button</b> to zoom to your current location.</p>
			<p><i class='far fa-hand-pointer fa-lg fa-fw'></i>
				<b>Drag, click, and zoom</b> to manually explore.</p>
			<p><i class='fas fa-mouse-pointer fa-lg fa-fw'></i>
				<b>Click the toggle button</b> in the upper left to hide / show college icons</p>
	    </div>
		<div class='col-list'>
		
			<div>
			<fieldset>
				<input id='feature-filter' type='text' placeholder='Filter results by name' />
			</fieldset>
			</div>
		
			<div id='feature-listing' class='listing'></div>
		</div>
		<div class='col-footer'>
		<div class='ftspace'></div>
		<div class='ft'> 
			<a href='{{ site.baseurl }}/about'>About</a> | 
			<a href='{{ site.baseurl }}/corrections'>Corrections</a> | 
			<a href='{{ site.github }}'>Code</a> 
		</div>
		</div>
	</div>
	<div class='col-map'>
		<nav id='toggle'></nav>
		<div id='map'></div>
	</div>
</div>
