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
	<div class='col-sidebar-header col-tablet-sidebar-header'>
	<h2 class='side'>College Advising Resource Map</h2>	
	</div>
	<div class='col-sidebar col-tablet-sidebar'>
		<div id='instructions'>
			<p>Use this interactive map to explore college advising resources
				available in high schools and communities across the country.</p>
			<h3>Instructions</h3>
			<p><i class='fas fa-search fa-lg fa-fw' style='padding-right:.5rem;'></i>
				<b>Search</b> using place name ("Charlottesville, VA") or zip code ("22901")</p>
			<p><i class='fas fa-crosshairs fa-lg fa-fw' style='padding-right:.5rem;'></i>
				<b>Use the location button</b> to zoom to your current location.</p>
			<p><i class='far fa-hand-pointer fa-lg fa-fw' style='padding-right:.5rem;'></i>
				<b>Drag, click, and zoom</b> to manually explore.</p>
			<p><i class='fas fa-mouse-pointer fa-lg fa-fw' style='padding-right:.5rem;'></i>
				<b>Click the toggle button</b> in the upper left to hide / show college icons</p>
			</div>
		<div>
		<fieldset>
			<input id='feature-filter' type='text' placeholder='Filter results by name' />
		</fieldset>
		</div>
		<div id='feature-listing' class='listing'></div>
		</div>
	<div class='col-sidebar-footer col-tablet-sidebar-footer'>
		<div id='footer'>Test</div>
	</div>
	<div class='col-map col-tablet-map'>
		<nav id='toggle'></nav>
		<div id='map'></div>
	</div>
</div>
