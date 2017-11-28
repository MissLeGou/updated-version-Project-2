var placeMarkers = [];
var map;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.471343,
            lng: -0.452070
        },
        zoom: 13
    });
    var input = /** @type {!HTMLInputElement} */ (
        document.getElementById('zoom-to-area-text'));

    var inputBox = document.getElementById('places-search');

    var types = document.getElementById('type-selector');
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    //Create a searchbox in order to execute a places search
    var searchBox = new google.maps.places.SearchBox(
        document.getElementById('places-search'));
    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }
        marker.setIcon( /** @type {google.maps.Icon} */ ({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
    });

    //    searchBox.addListener('places_changed', function () {
    //        searchBoxPlaces(this);
    //    });
    //    // Listen for the event fired when the user selects a prediction and clicks
    //    // "go" more details for that place.
    //    document.getElementById('go-places').addEventListener('click', textSearchPlaces);
    //
    //    // This function fires when the user selects a searchbox picklist item.
    //    // It will do a nearby search using the selected query string or place.
    //    function searchBoxPlaces(searchBox) {
    //        hideMarkers(placeMarkers);
    //        var places = searchBox.getPlaces();
    //        if (places.length == 0) {
    //            window.alert('We did not find any places matching that search!');
    //        } else {
    //            // For each place, get the icon, name and location.
    //            createMarkersForPlaces(places);
    //        }
    //    }
    //    // This function firest when the user select "go" on the places search.
    //    // It will do a nearby search using the entered query string or place.
    //    function textSearchPlaces() {
    //        var bounds = map.getBounds();
    //        hideMarkers(placeMarkers);
    //        var placesService = new google.maps.places.PlacesService(map);
    //        placesService.textSearch({
    //            query: document.getElementById('places-search').value,
    //            bounds: bounds
    //        }, function (results, status) {
    //            if (status === google.maps.places.PlacesServiceStatus.OK) {
    //                createMarkersForPlaces(results);
    //            }
    //        });
    //    }
    //
    //    // This function creates markers for each place found in either places search.
    //    function createMarkersForPlaces(places) {
    //        var bounds = new google.maps.LatLngBounds();
    //        for (var i = 0; i < places.length; i++) {
    //            var place = places[i];
    //            var icon = {
    //                url: place.icon,
    //                size: new google.maps.Size(35, 35),
    //                origin: new google.maps.Point(0, 0),
    //                anchor: new google.maps.Point(15, 34),
    //                scaledSize: new google.maps.Size(25, 25)
    //            };
    //            // Create a marker for each place.
    //            var marker = new google.maps.Marker({
    //                map: map,
    //                icon: icon,
    //                title: place.name,
    //                position: place.geometry.location,
    //                id: place.place_id
    //            });
    //            // Create a single infowindow to be used with the place details information
    //            // so that only one is open at once.
    //            var placeInfoWindow = new google.maps.InfoWindow();
    //            // If a marker is clicked, do a place details search on it in the next function.
    //            marker.addListener('click', function () {
    //                if (placeInfoWindow.marker == this) {
    //                    console.log("This infowindow already is on this marker!");
    //                } else {
    //                    getPlacesDetails(this, placeInfoWindow);
    //                }
    //            });
    //            placeMarkers.push(marker);
    //            if (place.geometry.viewport) {
    //                // Only geocodes have viewport.
    //                bounds.union(place.geometry.viewport);
    //            } else {
    //                bounds.extend(place.geometry.location);
    //            }
    //        }
    //        map.fitBounds(bounds);
    //    }

    //    function initAutocomplete() {
    //        var map = new google.maps.Map(document.getElementById('map'), {
    //            center: {
    //                lat: 51.471343,
    //                lng: -0.452070
    //            },
    //            zoom: 13,
    //            //            mapTypeId: 'roadmap'
    //        });

    // Create the search box and link it to the UI element.
    //        var searchBox = new google.maps.places.SearchBox(document.getElementById('places-search'));
    //        //        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    //
    //        // Bias the SearchBox results towards current map's viewport.
    //        map.addListener('bounds_changed', function () {
    //            searchBox.setBounds(map.getBounds());
    //        });

   
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        console.log(bounds);
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

     //Bias the SearchBox results towards places that are within the bounds of the
     //current map's viewport.
        google.maps.event.addListener(map, 'bounds_changed', function () {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });


}

