var urlln = "https://fairplayground.info/datasources/FCLN/FCLN.json";

var lns = [];
var lnMarkers = L.markerClusterGroup();


function getLocalNode(id) {
  for(var i=0; i<lns.length; i++) {
    if(lns[i].id==id) {
      return(lns[i]);
    }
  }
  return("not found");
}

function showLocalNodeRightCard(ln) {
  console.log(ln);
  document.getElementById("rightCard-title").innerHTML = ln.name;
  if(ln.description!=null) {
    document.getElementById("rightCard-text").innerHTML = ln.description;
  }else{
    document.getElementById("rightCard-text").innerHTML = "";
  }
  var html = `<img style='width:30px;height:30px;'
      src='`+ ln.icon + `'
      title="LocalNode"/>`;
  document.getElementById("rightCard-categories").innerHTML = html;
  // if(ln.img!=null) {
    document.getElementById("rightCard-img").src="";
    document.getElementById("rightCard-img").className = "card-img-top hidden";
  // } else {
  //   document.getElementById("rightCard-img").src=ln.icon;
  //   document.getElementById("rightCard-img").className = "card-img-top";
  // }
  document.getElementById("rightCard-web").href= "#";
  document.getElementById("rightCard-web").innerHTML = "";
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
  document.getElementById("rightCard").className+=" rightCard-show";
}
function updateLocalNodesMarkers() {
  lnMarkers.clearLayers();
  for(var i=0; i<lns.length; i++) {
    var lat = lns[i].latitude;
    var lon = lns[i].longitude;
    var icon = L.divIcon({
        className: 'markerInvisible',
        popupAnchor:  [10, 0], // point from which the popup should open relative to the iconAnchor
        html: "<img style='width:30px;height:30px;' class='marker lnMarker' src='statics/img/categories/faircoop_black.svg' />"
    });
    var marker = L.marker([lat, lon], {icon: icon});
    marker.id = lns[i].id;
    if(lns[i].description!=null) {
      marker.bindPopup("<b>"+lns[i].name+"</b><br><i>"+lns[i].description+"</i>");
    } else {
      marker.bindPopup("<b>"+lns[i].name+"</b>");
    }
    marker.on('mouseover', function(e) {
      this.openPopup();
    });
    marker.on('mouseout', function(e) {
      this.closePopup();
    });
    marker.on('click', function(e) {
      var ln = getLocalNode(this.id);
      showLocalNodeRightCard(ln);
    });
    lnMarkers.addLayer(marker);
  }
  map.addLayer(lnMarkers);
}
function showLocalNodes() {
  $.get(urlln, function(data){
    console.log(data);
    lns = data;
    console.log(routes);
    updateLocalNodesMarkers();
  });
}
