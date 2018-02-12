---
layout: default
custom_css:
- main
custom_js:
- func_general
- func_popup
- func_event
- func_mapping
- settings
- objects_arrays
- icon_array
- index_map
---

<div class='container'>
	<div class='col-sidebar col-sidebar-tablet'>
		<div class='col-header col-header-tablet'>
			<h2 class='side'>College Advising Resource Map</h2>	
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
		<div class='col-list col-list-tablet'>
		
			<div>
			<fieldset>
				<input id='feature-filter' type='text' placeholder='Filter results by name' />
			</fieldset>
			</div>
		
			<div id='feature-listing' class='listing'></div>
		</div>
		<div class='col-footer col-footer-tablet'>
			<a href='{{ site.github }}'><i class='fas fa-code fa-lg
		ft'></i></a>&nbsp;&nbsp;<i class='fas fa-info fa-lg ft'></i>
		</div>
	</div>
	<div class='col-map col-map-tablet'>
		<nav id='toggle'></nav>
		<div id='map'></div>
	</div>
</div>
