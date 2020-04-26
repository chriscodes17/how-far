//MAP START------------------------------------------
function initMap() {
  var bounds = new google.maps.LatLngBounds();
  var markersArray = [];

  var origin = document.getElementById("start").value;
  var destination = document.getElementById("end").value;

  var destinationIcon =
    "https://chart.googleapis.com/chart?" +
    "chst=d_map_pin_letter&chld=B|FF0000|000000";
  var originIcon =
    "https://chart.googleapis.com/chart?" +
    "chst=d_map_pin_letter&chld=A|FFFF00|000000";
  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 49.28273, lng: -123.120735 },
    zoom: 8,
    mapTypeControl: false,
    streetViewControl: false,
    fullScreenControl: false,
  });
  var geocoder = new google.maps.Geocoder();

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    },
    function (response, status) {
      if (status !== "OK") {
        alert("Error was: " + status);
      } else {
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;
        // outputDiv.innerHTML = "";
        deleteMarkers(markersArray);

        var showGeocodedAddressOnMap = function (asDestination) {
          var icon = asDestination ? destinationIcon : originIcon;
          return function (results, status) {
            if (status === "OK") {
              map.fitBounds(bounds.extend(results[0].geometry.location));
              markersArray.push(
                new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location,
                  icon: icon,
                })
              );
            } else {
              console.log("Geocode was not successful due to: " + status);
            }
          };
        };

        for (var i = 0; i < originList.length; i++) {
          //origin
          var results = response.rows[i].elements;
          geocoder.geocode(
            { address: originList[i] },
            showGeocodedAddressOnMap(false)
          );
          for (var j = 0; j < results.length; j++) {
            //destination
            let element = results[j];
            calc(element.distance.value); //applys distance into to the calc function
            let disTxt = element.distance.text; //distance in KM
            let durationTxt = element.duration.text; //duration text
            geocoder.geocode(
              { address: destinationList[j] },
              showGeocodedAddressOnMap(true)
            );
            outputStart.innerHTML =
              '<i class="far fa-dot-circle"></i> ' + originList[i];
            outputEnd.innerHTML =
              '<i class="fas fa-map-marker-alt"></i> ' + destinationList[j];
            disDur.innerHTML = "Duration: " + durationTxt + "(" + disTxt + ")";
          }
        }
      }
    }
  );
}

function deleteMarkers(markersArray) {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}
//MAP END-----------------------------------------------------------------

//displays
var outputStart = document.getElementById("output-start");
var outputEnd = document.getElementById("output-end");
var disDur = document.getElementById("dis-dur");
var calcResult = document.getElementById('calc-result');
// //calculation function
let dis = 0;

function calc(d) {
  let milage = document.getElementById("lKm").value;
  let carTank = document.getElementById("tank").value;
  let tankPercent = document.getElementById("percent").value;

  const literUsed = Math.floor((milage / 100) * (d / 1000));
  const actutalTank = carTank * (tankPercent / 100);
  const rangeKm = (100/milage) * actutalTank; //range km
  const fillInKm = Math.floor(rangeKm - 60);
  console.log(literUsed);

  if (literUsed > actutalTank) {
    calcResult.innerHTML = 'Total liters consumed: ' + literUsed+'L' + '<br>' + 'Fill up in ' + fillInKm+'KM' + ' from start point';
  } else if (literUsed < actutalTank && literUsed != 0) {
    calcResult.innerHTML = 'Total liters consumed ' +literUsed+'L,' + ' you will not have to fill up';
  }
}

//main button
const btn = document.getElementById("button");
//main event
window.onload = function () {
  btn.addEventListener("click", function () {
    calc();
    initMap();
  });
};

//form slide
$("#main-form").on("submit", function () {
  $(this).slideUp("slow");
});

$("#slide-down").click(function () {
  $("#main-form").slideDown("slow");
});

//hide arrow
$("#slide-down").hide();

//show arrow on submit
$("#main-form").on("submit", function () {
  $("#slide-down").fadeIn(500);
});
