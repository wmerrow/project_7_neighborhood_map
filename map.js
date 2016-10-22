
var locations = [
          {name: 'Zaytinya', burrito: '0', location: {lat: 38.8987445, lng: -77.023684}},
          {name: 'Chipotle', burrito: '1', location: {lat: 38.905847, lng: -77.043081}},
          {name: 'Rito Loco', burrito: '1', location: {lat: 38.9154082, lng: -77.0203243}},
          {name: "McDonald's", burrito: '0', location: {lat: 38.8970215, lng: -77.0288163}},
          {name: 'Shake Shack', burrito: '0', location: {lat: 38.906329, lng: -77.041915}},
          {name: 'Buredo', burrito: '1', location: {lat: 38.9010049, lng: -77.0317761}}
          ];

function Location(data) {
    this.name        = data.name;
    this.burrito     = data.burrito;
    this.location    = data.location;
    this.marker      = null;
    this.apiResponse = null;
    this.apiError    = false;
}

var options = [
          new Option("All Food", ""),
          new Option("Burritos", "1"),
          new Option("Non-burritos", "0")
          ];

function Option(menuLabel, menuValue){
    var self = this;
    self.menuLabel = menuLabel;
    self.menuValue =  menuValue;    
}


var map;

var markers = [];

function initMap() {

  var largeInfowindow = new google.maps.InfoWindow();

  function ViewModel() {
      var self = this;

    // create observable array for filter menu options
    self.filterOptions = ko.observableArray([]);
    self.filterOptions(options);

    // property to store the selected option (bound to select menu through event change binding)
    self.selectedOption = ko.observable(self.filterOptions()[0]); // default value is item 0 (All)

    // When user changes filter menu selection, set filter to current menuValue 
    // and filter (update) the markers displayed on the map 
    self.onChange = function() {
        //self.selectedOption().menuValue;
        self.filterMarkers();
    };

    // create an observable array of the location data
    self.locations = ko.observableArray([]);
    self.locations(locations);

    // gets called by the foreach binding on list div
    self.filteredLocations = ko.computed(function () {
        if (!self.selectedOption().menuValue) {
            return self.locations(); // return all items
        } else {
            // arrayFilter takes array and filtering function 
            return ko.utils.arrayFilter(self.locations(), function (loc) {
                return loc.burrito == self.selectedOption().menuValue; // return just the array items matching the current filter
            });
        }
    });

    // listClick is called when a list item is clicked, and calls populateInfoWindow
    self.listClick = function(location) {
      populateInfoWindow(location, largeInfowindow);
    };

    // filters markers on map
    self.filterMarkers = function() {
        // Remove all markers
        for (var i = 0; i < vm.locations().length; i++) {
          vm.locations()[i].marker.setMap(null);
        }
        // Loop through filteredLocations (array of filtered markers) and display each marker
        for (var i = 0; i < self.filteredLocations().length; i++) {
          self.filteredLocations()[i].marker.setMap(map);
        }
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
			center: {lat: 38.907, lng: -77.035},
			zoom: 13,
			styles: styles
		});

    var defaultIcon = makeMarkerIcon('e85113');

    // Loop over the observable locations array and create markers for each
    for (var i = 0; i < vm.locations().length; i++) {
      initLocation(vm.locations()[i]);
    } 

  // Create a new marker icon of the specified color
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

  // create markers (wrap in initLocation function in order to create a separate scope for each iteration of the for loop)
  function initLocation(locationObj) {
            // Get the position from the location array.
            var position = locationObj.location;
            var title = locationObj.name;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
              position: position,
              title: title,
              animation: google.maps.Animation.DROP,
              icon: defaultIcon,
              id: i
            });

            // Store the marker inside the observable locations array (creates a new marker property in array items)
            locationObj.marker = marker;

            // Create a listener to open the large infowindow at each marker.
            marker.addListener('click', toggleWindow);
            
            function toggleWindow() {
              populateInfoWindow(locationObj, largeInfowindow);
            }

          }

          //Initial display of markers - loop through observable locations array and display all markers
          for (var i = 0; i < vm.locations().length; i++) {
            vm.locations()[i].marker.setMap(map);
          }

}

// open an infowindow and animate marker
function populateInfoWindow(locationObj, infowindow) {
  
  var marker = locationObj.marker;
  
  // bounce once (bounce for 720 ms)
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {marker.setAnimation(null);}, 720);
  // and open infowindow
  infowindow.marker = marker;
  infowindow.setContent('<div>Loading...</div>'); // content to appear until API data is populated
  infowindow.open(map, marker);

  // If this data has not yet been retrieved...
  if(!locationObj.apiResponse) {
    $.ajax('https://api.darksky.net/forecast/ad14b62b4763855039f02f4e22ea07dd/'+locationObj.location.lat+','+locationObj.location.lng, {
       dataType: "jsonp",
       // if success, store the result on locationObj and populate the info box
       success: function(result) {
        locationObj.apiResponse = result;
        populateInfoBox(locationObj, infowindow);
       },
       // if failure, set error to true and populate the info box (with error message)
       error: function(err) {
        locationObj.apiError = true;
        populateInfoBox(locationObj, infowindow);
       }
    });
  }
  // Otherwise (if data has been retrieved) populate box with the cached data
  else {
    populateInfoBox(locationObj, infowindow);
  }

}

// populate the info box with eatery name (or error message)
function populateInfoBox(locationObj, infowindow) {
  var marker = locationObj.marker;
  var name = locationObj.name; // name of eatery (from location data)
  if(locationObj.apiResponse) {
    var weatherTemp = locationObj.apiResponse.currently.apparentTemperature; // temperature
    var weatherSummary = locationObj.apiResponse.currently.summary; // weather summary
    // set infowindow text content to eatery name and weather info
    infowindow.setContent(
    '<div>' + '<strong>' + name + '</strong>' + '</div>' + 
    '<div>' + weatherTemp + " degrees" + '</div>' + 
    '<div>' + weatherSummary + '</div>'
    );
  }
  else if(locationObj.apiError) {
    // set infowindow text content to eatery name and weather info
    infowindow.setContent(
    '<div>' + '<strong>' + name + '</strong>' + '</div>' + 
    // message to display on API error
    '<div>' + '<em>' + "Error retrieving weather information" + '</em>' + '</div>'
    );
  }

}

