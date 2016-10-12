			

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

// MODEL

function Location(data) {
    this.name = data.name;
    this.burrito = data.burrito;
    this.location = data.location;
}

var locations = [
          {name: 'Park Ave Penthouse', burrito: '1', location: {lat: 38.916767, lng: -77.005899}},
          {name: 'Chelsea Loft', burrito: '0', location: {lat: 38.926767, lng: -77.015899}},
          {name: 'Union Square Open Floor Plan', burrito: '1', location: {lat: 38.906767, lng: -77.035899}}
          ];

// /// empty array for location info
// var testArray = [];

// /// add locations items to array
// for (var i=0; i<locations.length; i++) {
//           var loc = new Location(locations[i]);
//           /// Push to array
//           testArray.push(loc);
// }

// VIEWMODEL

      var map;

      var markers = [];

      function initMap() {

function ViewModel() {
    var self = this;

    self.currentFilter = ko.observable(); // property to store the filter

    // creates an observable array of the data
    self.locations = ko.observableArray([]);
    self.locations(locations) /// this used to pass in testArray instead of locations - but it seems like testArray is an unnecessary step

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

    self.listClick = function(location) {
      console.log(location.marker);
      toggleWindow(location.marker);
      //console.log(location);
    };

}

var vm = new ViewModel();
ko.applyBindings(vm);



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

        //OLD LOCATIONS - PROB SHOULD DELETE
        // var locations = [
        //   {title: 'Park Ave Penthouse', location: {lat: 38.916767, lng: -77.005899}},
        //   {title: 'Chelsea Loft', location: {lat: 38.926767, lng: -77.015899}},
        //   {title: 'Union Square Open Floor Plan', location: {lat: 38.906767, lng: -77.035899}}
        //   //,
        //   // {title: 'East Village Hip Studio', location: {lat: 38.916767, lng: -77.005899}},
        //   // {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 38.816767, lng: -77.005899}},
        //   // {title: 'Chinatown Homey Space', location: {lat: 38.916767, lng: -77.005899}},
        //   // {title: 'Park Ave Penthouse', location: {lat: 38.916767, lng: -77.005899}},
        //   // {title: 'Chelsea Loft', location: {lat: 38.926767, lng: -77.015899}},
        //   // {title: 'Union Square Open Floor Plan', location: {lat: 38.906767, lng: -77.035899}},
        //   // {title: 'East Village Hip Studio', location: {lat: 38.916767, lng: -77.005899}},
        //   // {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 38.816767, lng: -77.005899}},
        //   // {title: 'Chinatown Homey Space', location: {lat: 38.916767, lng: -77.005899}}
        // ];

        var largeInfowindow = new google.maps.InfoWindow();

        var defaultIcon = makeMarkerIcon('e85113');
        // // Create a "highlighted location" marker color for when the user
        // // mouses over the marker.
        // //var highlightedIcon = makeMarkerIcon('ed8358');
        // var clickedIcon = makeMarkerIcon('ffffff');

        // Loop over the observable locations array
        for (var i = 0; i < vm.locations().length; i++) {
          console.log(vm.locations()[i].location);
          // Get the position from the location array.
          var position = vm.locations()[i].location;
          var title = vm.locations()[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
          });

          // Store the marker inside the observable locations array (creates a new marker property in array items)
          vm.locations()[i].marker = marker;
          // Push the marker to our array of markers (no longer need this??)
          // markers.push(marker);

          // Create an onclick event to open the large infowindow at each marker.
          // marker.addListener('click', toggleBounce);
          marker.addListener('click', toggleWindow);

          
          function toggleWindow() {
            console.log(this); // THESE THIS'S ARE NOT WORKING FOR THE VIEWMODEL (ONLY WORKING FOR MAP MAPRKER CLICKS)
            //REPLACING THESE THIS'S WITH "MARKER" MAKES A POPUP WINDOW SHOW UP, BUT ONLY ON ONE 
            populateInfoWindow(this, largeInfowindow);
          }

          // function toggleBounce() {
          //   bounce(this);
          //   console.log(this);
          // }

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




        
        // Loop through observable locations array and display markers
        for (var i = 0; i < vm.locations().length; i++) {
          vm.locations()[i].marker.setMap(map);
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


        function populateInfoWindow(marker, infowindow) {
          // if it's already animated, clear animation and close the infowindow
          if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
              console.log("stop");
              //infowindow.marker = null; // (may need to keep this?)
              infowindow.close();
            } else {
              console.log("start");
              // otherwise, start bounce animation and end after 670 ms
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function() {marker.setAnimation(null);}, 720);
              // and open infowindow
              infowindow.marker = marker;
              infowindow.setContent('<div>' + marker.title + '</div>');
              infowindow.open(map, marker);
            }
        }

        // function bounce(marker) {
        //   // Check to make sure the infowindow is not already opened on this marker.
        //   if (marker.getAnimation() !== null) {
        //         marker.setAnimation(null);
        //       } else {
        //         marker.setAnimation(google.maps.Animation.BOUNCE);
        //       }
        // }

      } ////// end initMap

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

