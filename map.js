			

// VIEWMODEL

      // function markersViewModel() {
      //   var self = this;
      //   self.locationsTEST = ko.observableArray(["test","test2","test3"]);
      // }

      // ko.applyBindings(new markersViewModel());

// var viewModel = {
//         shouldShowMessage: ko.observable(false) // Message initially visible
//     };

//     // viewModel.shouldShowMessage(false); // ... now it's hidden
// //    viewModel.shouldShowMessage(true); // ... now it's visible again
// ko.applyBindings(new viewModel());


function Location(data) {
    this.name = data.name;
    this.burrito = data.burrito;
    // this.position = data.position;
}

var testLocations = [
          {name: 'Park Ave Penthouse', burrito: '1'},
          {name: 'Chelsea Loft', burrito: '0'},
          {name: 'Union Square Open Floor Plan', burrito: '1'}
          ];

/// empty array for location info
var testArray = [];

/// add locations items to array
for (var i=0; i<testLocations.length; i++) {
          var testLoc = new Location(testLocations[i]);
          /// Push to array
          testArray.push(testLoc);
}


function ViewModel() {
    var self = this;

    self.currentFilter = ko.observable(); // property to store the filter

    // creates an observable array of the data
    self.locations = ko.observableArray([]);
    self.locations(testArray)

    // gets called by the foreach binding on list div
    self.filterLocations = ko.computed(function () {
        if (!self.currentFilter()) {
            return self.locations(); // return all items
        } else {
            // arrayFilter takes array and filtering function 
            return ko.utils.arrayFilter(self.locations(), function (loc) {
                return loc.burrito == self.currentFilter(); // return just the items matching the current filter
            });
        }
    });

    // sets current filter 
    self.filter = function (burrito) {
        self.currentFilter(burrito);
    }





}

ko.applyBindings(new ViewModel())









      var map;

			var markers = [];

			function initMap() {

			var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }
        ];

				map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: 38.916767, lng: -77.005899},
					zoom: 13,
					styles: styles
				});

        var locations = [
          {title: 'Park Ave Penthouse', location: {lat: 38.916767, lng: -77.005899}},
          {title: 'Chelsea Loft', location: {lat: 38.926767, lng: -77.015899}},
          {title: 'Union Square Open Floor Plan', location: {lat: 38.906767, lng: -77.035899}}
          //,
          // {title: 'East Village Hip Studio', location: {lat: 38.916767, lng: -77.005899}},
          // {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 38.816767, lng: -77.005899}},
          // {title: 'Chinatown Homey Space', location: {lat: 38.916767, lng: -77.005899}},
          // {title: 'Park Ave Penthouse', location: {lat: 38.916767, lng: -77.005899}},
          // {title: 'Chelsea Loft', location: {lat: 38.926767, lng: -77.015899}},
          // {title: 'Union Square Open Floor Plan', location: {lat: 38.906767, lng: -77.035899}},
          // {title: 'East Village Hip Studio', location: {lat: 38.916767, lng: -77.005899}},
          // {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 38.816767, lng: -77.005899}},
          // {title: 'Chinatown Homey Space', location: {lat: 38.916767, lng: -77.005899}}
        ];

        var largeInfowindow = new google.maps.InfoWindow();

        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('e85113');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        //var highlightedIcon = makeMarkerIcon('ed8358');

        var clickedIcon = makeMarkerIcon('ffffff');

        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);

          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
            //set all markers to default color (previously selected marker does not stay white)
            for (var i = 0; i < markers.length; i++) {
              markers[i].setIcon(defaultIcon); 
            };
            populateInfoWindow(this, largeInfowindow);
            //setTimeout(this.setIcon(highlightedIcon), 3000);
          });

          // marker.addListener('click', function() {
          //   this.setIcon(clickedIcon);
          // });

          // marker.addListener('click', function() {
          //   setTimeout(this.setIcon(highlightedIcon), 1000);
          // });

          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          // marker.addListener('mouseover', function() {
          //   this.setIcon(highlightedIcon);
          // });
          // marker.addListener('mouseout', function() {
          //   this.setIcon(defaultIcon);
          // });
        }

        function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          marker.setIcon(clickedIcon);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            marker.setIcon(defaultIcon);
            infowindow.marker = null;
          });
        }
      }


        //var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and 
        //display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          //bounds.extend(markers[i].position);
        }
        //map.fitBounds(bounds);


				// var home = {lat: 38.916767, lng: -77.005899};
				// var marker = new google.maps.Marker({
				// 	position: home,
				// 	map: map,
				// 	title: 'my marker'
				// });
				// var infowindow = new google.maps.InfoWindow({
				// 	content: "content about infowindow" + " ready to start?"
				// });
				// marker.addListener('click', function() {
				// 	infowindow.open(map, marker);
				// });

			} /// end initMap

      // This function takes in a COLOR, and then creates a new marker
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34)
          );
        return markerImage;
      }

