var allitems = []; // array with all the items before filtering
var items = []; // the items showed in the map, after the categories
var categories = [];
var allCheckbox = {checked: true};

function hexToRGBA(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity+')';
    return result;
}
function printFiltersList() {
  var html = "";

  for (var property in categories) {
    if (categories.hasOwnProperty(property)) {
      html += `<div class='checkbox'>
                <label><input id="check` + property + `" onclick="updateFilter('`+property+`')" type='checkbox' value='' checked='`+categories[property].checked+`' >
                  <img style='width:30px;height:30px;
                  border: 2px solid `+categories[property].icon_marker_color+`;'
                  class="marker"
                  src='statics/img/categories/` + categories[property].icon_name + `_black.svg' />
                  `+categories[property].name+`</label>
              </div>`;
    }
  }

  document.getElementById("filtersList").innerHTML = html;
}
function getItem(id) {
  for(var i=0; i<items.length; i++) {
    if(items[i].properties.slug==id) {
      return(items[i]);
    }
  }
  return("not found");
}
function showRightCard(item) {
  document.getElementById("rightCard-title").innerHTML = item.properties.name;
  if(item.properties.description!=null) {
    document.getElementById("rightCard-text").innerHTML = "<i>"+item.properties.description+"</i>";
  }else{
    document.getElementById("rightCard-text").innerHTML = "";
  }
  // gallery images
  if(item.properties.gallery_images.length>0) {
    var html = "";
    html += `<br>
      <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">`;

    for(var i=0; i<item.properties.gallery_images.length; i++) {
      if(i===0) {
        html += `<li data-target="#carouselExampleIndicators" data-slide-to="`+i+`" class="active"></li>`;
      } else {
        html += `<li data-target="#carouselExampleIndicators" data-slide-to="`+i+`"></li>`;
      }
    }
    html += `
      </ol>
        <div class="carousel-inner">`;
    for(var i=0; i<item.properties.gallery_images.length; i++) {
      if(i===0) {
        html += `<div class="carousel-item active">`;
      } else {
        html += `<div class="carousel-item">`;
      }
      html += `
        <a href="` + item.properties.gallery_images[i].original_url + `" target="_blank">
          <img class="d-block w-100" src="` + item.properties.gallery_images[i].thumb_url + `"
            alt="` + item.properties.gallery_images[i].caption + `"
            title="` + item.properties.gallery_images[i].caption + `">
        </a>
      </div>`;
    }
    html += `
      </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>`;
    document.getElementById("rightCard-text").innerHTML += html;
  }


  html = "";
  for (var property in item.properties.categories) {
    if (item.properties.categories.hasOwnProperty(property)) {
        html += `<img style='width:30px;height:30px;'
            src='statics/img/categories/` + item.properties.categories[property].icon_name + `_black.svg'
            title="` + item.properties.categories[property].icon_name + `"/>`;
    }
  }
  document.getElementById("rightCard-categories").innerHTML = html;
  if(item.properties.pictureUrl) {
    document.getElementById("rightCard-img").src="https://map.komun.org/" + item.properties.pictureUrl;
    document.getElementById("rightCard-img").className = "card-img-top";
  } else {
    document.getElementById("rightCard-img").src="";
    document.getElementById("rightCard-img").className = "card-img-top hidden";
  }

  if(item.properties.web) {
    document.getElementById("rightCard-web").href= item.properties.web;
    document.getElementById("rightCard-web").innerHTML = "Web";
  } else {
    document.getElementById("rightCard-web").href="#";
    document.getElementById("rightCard-web").innerHTML="";
  }
  if(item.properties.mastodon) {
    document.getElementById("rightCard-mastodon").href= item.properties.mastodon;
    document.getElementById("rightCard-mastodon").innerHTML = "<i class='fab fa-mastodon-f'></i>";
  } else {
    document.getElementById("rightCard-mastodon").href="#";
    document.getElementById("rightCard-mastodon").innerHTML="";
  }
  if(item.properties.twitter) {
    document.getElementById("rightCard-twitter").href= item.properties.twitter;
    document.getElementById("rightCard-twitter").innerHTML = "<i class='fab fa-twitter'></i>";
  } else {
    document.getElementById("rightCard-twitter").href="#";
    document.getElementById("rightCard-twitter").innerHTML="";
  }
  if(item.properties.facebook) {
    document.getElementById("rightCard-facebook").href= item.properties.facebook;
    document.getElementById("rightCard-facebook").innerHTML = "<i class='fab fa-facebook-f'></i>";
  } else {
    document.getElementById("rightCard-facebook").href="#";
    document.getElementById("rightCard-facebook").innerHTML="";
  }
  if(item.properties.telegram) {
    document.getElementById("rightCard-telegram").href= item.properties.telegram;
    document.getElementById("rightCard-telegram").innerHTML = "<i class='fab fa-telegram-f'></i>";
  } else {
    document.getElementById("rightCard-telegram").href="#";
    document.getElementById("rightCard-telegram").innerHTML="";
  }
  if(item.properties.email) {
    document.getElementById("rightCard-email").href= "mailto:" + item.properties.email;
    document.getElementById("rightCard-email").innerHTML = "<i class='fa fa-envelope'></i>";
  } else {
    document.getElementById("rightCard-email").href="#";
    document.getElementById("rightCard-email").innerHTML="";
  }
  document.getElementById("rightCard-text").innerHTML += "<p>"+item.properties.body+"</p>";
  document.getElementById("rightCard").className+=" rightCard-show";
}
function hideRightCard() {
  document.getElementById("rightCard").className ="card";
}
function updateMarkers() {
  markers.clearLayers();
  for(var i=0; i<items.length; i++) {
    var lat = items[i].geometry.coordinates[1];
    var lon = items[i].geometry.coordinates[0];
    var icon = L.divIcon({
        className: 'markerInvisible',
        popupAnchor:  [10, 0], // point from which the popup should open relative to the iconAnchor
        html: `<img style='width:30px;height:30px;border: 2px solid `+items[i].properties.icon_marker_color+`;
        box-shadow: 0 0 5px 4px ` + hexToRGBA(items[i].properties.icon_marker_color, 0.2) + `
          ;' class='marker' src='statics/img/categories/` + items[i].properties.icon_name + `_black.svg' />`
        // html: "<img style='width:30px;height:30px;border: 2px solid " + hexToRGBA(items[i].properties.icon_marker_color, 0.2) + ";' class='marker marker-" + items[i].properties.icon_marker_color + "' src='statics/img/categories/" + items[i].properties.icon_name + "_black.svg' />"
    });
    var marker = L.marker([lat, lon], {icon: icon});
    marker.id = items[i].properties.slug;
    if(items[i].properties.description!=null) {
      marker.bindPopup("<b>"+items[i].properties.name+"</b><br><i>"+items[i].properties.description+"</i>");
    } else {
      marker.bindPopup("<b>"+items[i].properties.name+"</b>");
    }
    marker.on('mouseover', function(e) {
      this.openPopup();
    });
    marker.on('mouseout', function(e) {
      this.closePopup();
    });
    marker.on('click', function(e) {
      var item = getItem(this.id);
      placeid = this.id;
      console.log(item.properties.gallery_images);
      showRightCard(item);
      window.history.pushState({},"", "?lang="+lang+"&lat=" + lat + "&lon=" + lon + "&zoom=" + zoom + "&placeid=" + placeid);
    });
    markers.addLayer(marker);
  }
  map.addLayer(markers);
  if (placeid!=="none") {
    var item = getItem(placeid);
    showRightCard(item);
    window.history.pushState({},"", "?lang="+lang+"&lat=" + lat + "&lon=" + lon + "&zoom=" + zoom + "&placeid=" + placeid);
  }
}
function updateFilter(selectedFilter) {
  if(categories[selectedFilter].checked===true) {
    categories[selectedFilter].checked = false;
    document.getElementById('check' + selectedFilter).checked = false;
  } else {
    categories[selectedFilter].checked = true;
    document.getElementById('check' + selectedFilter).checked = true;
  }
  applyFilters();
}
function selectAllFilters() {
  if(allCheckbox.checked===true) {
    items = [];
    allCheckbox.checked = false;
    for (var property in categories) {
      if (categories.hasOwnProperty(property)) {
        categories[property].checked=false;
        document.getElementById('check' + property).checked = false;
      }
    }
  } else {
    items = JSON.parse(JSON.stringify(allitems));
    allCheckbox.checked= true;

    for (var property in categories) {
      if (categories.hasOwnProperty(property)) {
        categories[property].checked=true;
        document.getElementById('check' + property).checked = true;
      }
    }
  }
  updateMarkers();
}
function itemInItems(array, el) {
  for(var i=0;i<array.length; i++) {
    if(array[i].properties.slug===el.properties.slug) {
      return true;
    }
  }
  return false;
}
function applyFilters() {
  items = [];
  for(var i=0; i<allitems.length; i++) {
    for (var property in allitems[i].properties.categories) {
      if (allitems[i].properties.categories.hasOwnProperty(property)) {
          if(categories[property].checked===true) {
            // check if item is not yet in items array
            if(itemInItems(items, allitems[i])===false) {
              items.push(JSON.parse(JSON.stringify(allitems[i])));
            }
          }
        }
      }
  }
  updateMarkers();
}
function changeLanguage() {
  lang = document.getElementById("lang").value;
  window.history.pushState({},"", "?lang="+lang+"&lat=" + lat + "&lon=" + lon + "&zoom=" + zoom + "&placeid=" + placeid);
  location.reload();
}
function printSearchResults(items) {
  var html = "";
  html += "<div class='list-group'>";
  for(var i=0; i<items.length; i++) {
    html += `
      <div onclick="goToItem('` + items[i].properties.slug + `')" class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">` + items[i].properties.name + `</h5>
          <small>3 days ago</small>
        </div>`;
      if(items[i].properties.description!=null) {
        html += `<p class="mb-1">` + items[i].properties.description + `</p>`;
      }
      html += `
      </div>
    `;
  }
  html += "</div>";
  document.getElementById("searchResults").innerHTML = html;
}
function search() {
  var searchResults = [];
  var key = document.getElementById("searchinput").value.toUpperCase();
  if(key=="") {
    document.getElementById("searchResults").innerHTML = "";
    return;
  }
  for(var i=0; i<allitems.length; i++) {
    if(allitems[i].properties.name.toUpperCase().includes(key)) {
      searchResults.push(allitems[i]);
    }
  }
  printSearchResults(searchResults);
}
function showInMap(item) {
  lat = item.geometry.coordinates[1];
  lon = item.geometry.coordinates[0];
  window.history.pushState({},"", "?lang="+lang+"&lat=" + lat + "&lon=" + lon + "&zoom=" + zoom);
  map.setView([lat, lon], 16);
}
function goToItem(id) {
  var item = getItem(id);
  showRightCard(item);
  showInMap(item);
}

// -----
// init
// -----

// get url parameters
var url = new URL(window.location.href);
var lang = url.searchParams.get("lang");
var lat = url.searchParams.get("lat");
var lon = url.searchParams.get("lon");
var zoom = url.searchParams.get("zoom");
var placeid = url.searchParams.get("placeid");
if(lang==undefined) {
  lang = "en";
}
if((lat==undefined)||(lon==undefined)) {
  lat = 40.007;
  lon = -2.488;
}
if(zoom==undefined) {
  zoom=7;
}
if(placeid==undefined) {
  placeid = "none";
}


// var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// var tiles = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
// var tiles = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang='+lang, {
var tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; OpenStreetMap contributors'
});

var map = L.map('map', {layers: [tiles]});
map.setView([lat, lon], zoom);
map.addEventListener('dragend', function(ev) {
  var coord = map.getCenter();
   lat = Math.round(coord.lat * 10000) / 10000;
   lon = Math.round(coord.lng * 10000) / 10000;
   window.history.pushState({},"", "?lang="+lang+"&lat=" + lat + "&lon=" + lon + "&zoom=" + zoom + "&placeid=" + placeid);
});
map.on('zoomend', function(ev) {
    zoom = ev.target._zoom;
    window.history.pushState({},"", "?lang="+lang+"&lat=" + lat + "&lon=" + lon + "&zoom=" + zoom + "&placeid=" + placeid);
});
var markers = L.markerClusterGroup();

$.get("https://map.komun.org/showCategories/lang/"+lang, function(data){
  console.log(data);
  categories = data;
  printFiltersList();
  // get items data
  $.get("https://map.komun.org/searchMapPoints/lang/"+lang+"/", function(data){
    console.log(data.response[0]);
    allitems = data.response;
    items = JSON.parse(JSON.stringify(allitems));
    updateMarkers();
    document.getElementById("loadingbar").innerHTML="";
  });
});

var sidebar = L.control.sidebar('sidebar').addTo(map);
