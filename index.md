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
				<input id='feature-filter' type='text' placeholder='Filter results by name' />
			</fieldset>
		</div>	
		<div id='feature-listing' class='listing'></div>
	</div>	
	<div class='col-map col-tablet-map'>
		<div id='map'></div>
	</div>
</div>
