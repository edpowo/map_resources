---
layout: default
custom_css:
- main
custom_js:
- index.map
- functions
- settings
- school_array
---

<div class='container'>
	<div class='col-sidebar col-tablet-sidebar'>
		<div>
			<fieldset>
				<input id='search-filter' type='text' placeholder='TODO: Search for schools by name or location' />
			</fieldset>
			<fieldset style='background-color:#E57200;'>
				<input id='feature-filter' type='text' placeholder='Filter results by name' />
			</fieldset>
		</div>	
		<div id='feature-listing' class='listing'></div>
	</div>	
	<div class='col-map col-tablet-map'>
		<div id='map'></div>
	</div>
</div>
