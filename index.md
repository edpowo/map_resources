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
	<div class='col-sidebar col-tablet-sidebar'>
	<h2 class='side'>College Advising Resource Map</h2>
		<div id='instructions'>
		<p>Use this interactive map to explore college advising resources
	available in high schools and communities across the country.</p>
		<h3>Instructions</h3>
		<p><img src='{{ site.baseurl }}{{ site.images }}/search.png' class='icon'>
			<b>Search</b> using place name ("Charlottesville, VA") or zip code ("22901")</p>
		<p><img src='{{ site.baseurl }}{{ site.images }}/locate.png' class='icon'>
			<b>Use the location button</b> to zoom to your current location.</p>
		<p><i class='far fa-hand-pointer fa-lg' style='padding-right:.5rem;'></i>
			<b>Drag, click, and zoom</b> to manually explore.</p>
		<p>Click the toggle buttons in the upper left to: </p>
		<ul>
		<li>Hide / show college icons</li>
		<li>Resize high school icon size by student/counselor ratio (SCR)</li>
		</ul>
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
