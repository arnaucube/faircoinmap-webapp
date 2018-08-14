var urlroutes = "https://api.routes.fair.coop/api/";

var routes = [];
var routesMarkers = L.markerClusterGroup();

function getRoute(id) {
  for(var i=0; i<routes.length; i++) {
    console.log(routes[i]._id);
    console.log(id);
    if(routes[i]._id==id) {
      return(routes[i]);
    }
  }
  return("not found");
}
function showRouteRightCard(route) {
  console.log(route);
  document.getElementById("rightCard-title").innerHTML = route.title;

  if(route.description!=null) {
    document.getElementById("rightCard-text").innerHTML = "<i>"+route.description+"</i>";
  }else{
    document.getElementById("rightCard-text").innerHTML = "";
  }
  var html = `<img style='width:30px;height:30px;'
      src='statics/img/categories/transport_black.svg'
      title="CommonRoute"/>`;
  document.getElementById("rightCard-categories").innerHTML = html;

  document.getElementById("rightCard-img").src="";
  document.getElementById("rightCard-img").className = "card-img-top hidden";
  document.getElementById("rightCard-web").href= "https://routes.fair.coop";
  document.getElementById("rightCard-web").innerHTML = "CommonRoutes website";
  document.getElementById("rightCard-mastodon").href="#";
  document.getElementById("rightCard-mastodon").innerHTML="";
  document.getElementById("rightCard-twitter").href="#";
  document.getElementById("rightCard-twitter").innerHTML="";
  document.getElementById("rightCard-facebook").href="#";
  document.getElementById("rightCard-facebook").innerHTML="";
  document.getElementById("rightCard-telegram").href="#";
  document.getElementById("rightCard-telegram").innerHTML="";
  document.getElementById("rightCard-email").href="#";
  document.getElementById("rightCard-email").innerHTML="";
  html = `
    <p>
      From: <b>` + route.from.name + `</b>
    </p>
    <p>
      To: <b>` + route.to.name + `</b>
    </p>
    <div class='float-right'>` + route.date + `</div>
  `;
  document.getElementById("rightCard-text").innerHTML += html;
  document.getElementById("rightCard").className+=" rightCard-show";
}

function updateRoutesMarkers() {
  routesMarkers.clearLayers();
  for(var i=0; i<routes.length; i++) {
    console.log(routes[i]);
    var lat = routes[i].from.lat;
    var lon = routes[i].from.long;
    var icon = L.divIcon({
        className: 'markerInvisible',
        iconAnchor:   [20, 10],
        popupAnchor:  [-4, 0], // point from which the popup should open relative to the iconAnchor
        html: "<img src='statics/img/gps.svg' style='width:30px;height:30px;' class='routeMarker' />"
    });
    var marker = L.marker([lat, lon], {icon: icon});
    marker.id = routes[i]._id;
    marker.bindPopup("From: <b>"+routes[i].from.name+"</b><br>" + routes[i].date);
    marker.on('mouseover', function(e) {
      this.openPopup();
    });
    marker.on('mouseout', function(e) {
      this.closePopup();
    });
    marker.on('click', function(e) {
      var route = getRoute(this.id);
      showRouteRightCard(JSON.parse(JSON.stringify(route)));
    });
    routesMarkers.addLayer(marker);


    var lat = routes[i].to.lat;
    var lon = routes[i].to.long;
    var icon = L.divIcon({
        className: 'markerInvisible',
        iconAnchor:   [20, 10],
        popupAnchor:  [-4, 0], // point from which the popup should open relative to the iconAnchor
        html: "<img src='statics/img/gps.svg' style='width:30px;height:30px;' class='routeMarker' />"
    });
    var marker = L.marker([lat, lon], {icon: icon});
    marker.id = routes[i]._id;
    marker.bindPopup("To: <b>"+routes[i].to.name+"</b><br>" + routes[i].date);
    marker.on('mouseover', function(e) {
      this.openPopup();
    });
    marker.on('mouseout', function(e) {
      this.closePopup();
    });
    marker.on('click', function(e) {
      var route = getRoute(this.id);
      showRouteRightCard(JSON.parse(JSON.stringify(route)));
    });
    routesMarkers.addLayer(marker);

    var polyline = L.polyline([
            [routes[i].from.lat, routes[i].from.long],
            [routes[i].to.lat, routes[i].to.long]
            ],
            {
                color: '#9575CD',
                weight: 5,
                opacity: .7,
                dashArray: '20,15',
                lineJoin: 'round'
            }
          ).addTo(routesMarkers);
  }
  map.addLayer(routesMarkers);
}
function showCommonRoutes() {
  $.get(urlroutes+"travels?page=", function(data){
    console.log(data);
    routes = data;
    console.log(routes);
    updateRoutesMarkers();
    // document.getElementById("loadingbar").innerHTML="";
  });
}
