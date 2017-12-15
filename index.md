---
layout: default
custom_css:
- main
custom_js:
- index.map
- func_general
- func_popup
- func_event
- func_mapping
- objects
- settings
- school_array
---

<div class='container'>
	<div class='col-sidebar col-tablet-sidebar'>
	<h2 class='side'>College Advising Resource Map</h2>
		<div id='instructions'>
		<p>Use this interactive map to explore college advising resources
	available at high schools across the country.</p>
		<h3>Instructions</h3>
		<p><b>Search</b> for specific location using place name or zip code.</p>
		<p><b>Use location button</b> button to explore current
	location.</p>
		<p><b>Drag and zoom</b> using buttons or on map itself.</p>
		</div>
		<div>
			<fieldset>
				<input id='feature-filter' type='text' placeholder='Filter results by name' />
			</fieldset>
		</div>	
		<div id='feature-listing' class='listing'></div>
	</div>	
	<div class='col-map col-tablet-map'>
		<nav id='toggle'></nav>
		<div id='map'></div>
	</div>
</div>
