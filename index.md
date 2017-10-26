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

<!-- <div class='sidebar'> -->
<!--   <div class='heading'> -->
<!--     <h1>Information</h1> -->
<!--   </div> -->
<!--   <div id='info' class='info'></div> -->
<!-- </div> -->

<!-- <div id='map' class='map pad2'></div> -->

<div id='map'></div>

<div class='map-overlay'>
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
