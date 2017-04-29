
function initMap(coords) {
	var map;
	var zoom = 12;

	coords = {lat:40.4790512, lng:-74.4314396};

	map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: coords.lat, lng: coords.lng},
	    zoom: zoom,
		styles: [
					{
						"featureType": "administrative",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#444444"
							}
						]
					},
					{
						"featureType": "landscape",
						"elementType": "all",
						"stylers": [
							{
								"color": "#f2f2f2"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "all",
						"stylers": [
							{
								"saturation": -100
							},
							{
								"lightness": 45
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "simplified"
							}
						]
					},
					{
						"featureType": "road.arterial",
						"elementType": "labels.icon",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "transit",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "all",
						"stylers": [
							{
								"color": "#0EBFE9"
							},
							{
								"visibility": "on"
							}
						]
					}
				]
		});
        var marker = new google.maps.Marker({
          position: coords,
          map: map
	});

	//setMarkers(map, nearby, projects);
}


function setMarkers(map, events, projects){
	map.setCenter(marker.getPosition());
}

