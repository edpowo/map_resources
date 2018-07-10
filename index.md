---
layout: default
custom_css:
- main
custom_js:
- func_general
- settings
- all_icon_array
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
		<div class='col-subheader'>
			<a href='{{ site.baseurl }}/about'>About this map</a>	
		</div>
		<div id='instructions'>
		<div id='subinstructions'>
		<br/>
			<p>Use this interactive map to explore college advising resources
				available in high schools and communities across the
	country.</p>
	<br/>
			<h3>How to use this map</h3>
			<p><i class='fas fa-search fa-lg fa-fw'></i>
				<b>Search</b> using place name ("Charlottesville, VA") or zip code ("22901")</p>
			<p><i class='fas fa-crosshairs fa-lg fa-fw'></i>
				<b>Use the location button</b> to zoom to your current location.</p>
			<p><i class='far fa-hand-pointer fa-lg fa-fw'></i>
				<b>Drag, click, and zoom</b> to manually explore.</p>
			<p><i class='fas fa-mouse-pointer fa-lg fa-fw'></i>
				<b>Click the toggle button</b> in the upper left to
	hide / show college icons</p>	
	
	</div>
	<br/>
	<div class='legend top'>
		<h3>Legend</h3>
		<p><img src='{{ site.images }}/school-512.png'>High school</p>
		<p><img src='{{ site.images }}/school-adv-512.png'>High school with advising resource</p>
		<p><img src='{{ site.images }}/college-2-512.png'>Two-year college</p>
		<p><img src='{{ site.images }}/college-4-512.png'>Four-year college</p>
		<p><img src='{{ site.images }}/community-512.png'>Community-based advising organization</p>
	</div>
	<br/>
	<div class='legend bottom'>
	<p><i>High school icon size increases as <b>counselor to student ratio</b> increases</i></p>
	    <table>
		<tr>
		<td><img src='{{ site.images }}/school-512.png' style="width:30%"></td> 
		<td><img src='{{ site.images }}/school-512.png' style="width:40%"></td>
		<td><img src='{{ site.images }}/school-512.png' style="width:50%"></td>
		<td><img src='{{ site.images }}/school-512.png' style="width:60%"></td> 
		<td><img src='{{ site.images }}/school-512.png' style="width:70%"></td>
		<td><img src='{{ site.images }}/school-512.png' style="width:80%"></td> 
		<td><img src='{{ site.images }}/school-512.png' style="width:90%"></td> 
		</tr> 
		</table>
	</div>
		<!-- Hack to make sure scroll for full legend -->
	<br/>
	<br/>
	<br/>	
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
		<a href='{{ site.github }}' title='Get map code'>Code</a> |
		<a href='{{ site.mapdata }}' title='Get map data' download='mapdata.csv'>Data</a> |
		<a href='{{ site.form }}' title='Suggest improvements'>Suggest improvements</a> 
		</div>
		</div>
	</div>
	<div class='col-map'>
		<nav id='toggle'></nav>
		<div id='map'></div>
	</div>
</div>
