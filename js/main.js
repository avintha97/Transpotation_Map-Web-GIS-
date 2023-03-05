var scaleLineControl = new ol.control.ScaleLine();

var BaseMapLyr = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

var view = new ol.View({
  projection: "EPSG:4326",
  center: [80.3265, 7.96584],
  zoom: 7,
});

var layerArray = [BaseMapLyr];

var map = new ol.Map({
  target: "map",
  view: view,
  layers: layerArray,
  controls: ol.control.defaults().extend([scaleLineControl]),
});

var clickedCoor = [];

var drawSrc = new ol.source.Vector();

var drawLayer = new ol.layer.Vector({
  source: drawSrc,
});

map.addLayer(drawLayer);

var draw = new ol.interaction.Draw({
  type: "Point",
  source: drawSrc,
});

draw.on("drawstart", function (evt) {
  drawSrc.clear();
});

draw.on("drawend", function (evt) {
  clickedCoor = evt.feature.getGeometry().getFlatCoordinates();
  map.removeInteraction(draw);
  $("#addPoint").modal("show");
});

function startDrawing() {
  map.addInteraction(draw);
}

//save data from form to db

function saveDataToDb() {
  var name = document.getElementById("userName").value;
  var condition = document.getElementById("userCondition").value;
  var lon = clickedCoor[0];
  var lat = clickedCoor[1];

  if (name != "" && condition != "" && lon != "" && lat != "") {
    $.ajax({
      url: "save.php",
      type: "POST",
      data: {
        username: name,
        userCon: condition,
        UsrLon: lon,
        UserLat: lat,
      },
      success: function (dataresult) {
        var dataresult = JSON.parse(dataresult);
       
        if (dataresult) {
          $("#addPoint").modal("hide");
        } else {
          alert("something went wrong");
        }
      },
    });
  } else {
    alert("please enter complete informations");
  }
}

function showTevelMode(val) {
  if (val === "") {
    alert("empty value");
  } else {
    $.ajax({
      url: "data.php",
      type: "GET",
      data: {
        value: val,
      },
      success: function (dataresult) {
        var dataresult = JSON.parse(dataresult);
        var val = dataresult;

        addData(val);
      },
      error: function () {
        alert("AJAX error");
      },
    });
  }
}

var dataLyr;
var geojson = {};

function addData(arrayData) {
  var fea = arrayData[0].json_build_object;

  map.removeLayer(dataLyr);

  var dataSrc = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(fea),
  });
  var clusterLyr = new ol.source.Cluster({
    source: dataSrc,
  });
  var style1 = new ol.style.Icon(
    /** @type {olx.style.IconOptions} */ ({
      anchor: [0.5, 66],
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      opacity: 0.85,
      src: "https://upload.wikimedia.org/wikipedia/commons/1/15/BSicon_TRAIN2.svg",
      scale: 0.05,
    })
  );
  var style2 = new ol.style.Icon(
    /** @type {olx.style.IconOptions} */ ({
      anchor: [0.5, 66],
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      opacity: 0.85,
      src: "https://cdn-icons-png.flaticon.com/512/6556/6556303.png",
      scale: 0.075,
    })
  );
  var style3 = new ol.style.Icon(
    /** @type {olx.style.IconOptions} */ ({
      anchor: [0.5, 66],
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      opacity: 0.85,
      src: "https://cdn-icons-png.flaticon.com/512/870/870143.png",
      scale: 0.05,
    })
  );
  dataLyr = new ol.layer.Vector({
    source: clusterLyr,
    style: function myStyleFunction(feature) {
      let features = feature.get("features");
      for (i = 0; i < features.length; i++) {
        console.log(features[i].A.fclass);
        if (features[i].A.fclass == "bus_stop") {
          return new ol.style.Style({ image: style2 });
        } else if (features[i].A.fclass == "railway_station") {
          return new ol.style.Style({ image: style1 });
        } else if (features[i].A.fclass == "airport") {
          return new ol.style.Style({ image: style3 });
        }
      }
    },
  });

  map.addLayer(dataLyr);
}
