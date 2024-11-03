var mapView = new ol.View({
  center: ol.proj.fromLonLat([75.746998, 18.996469]),
  zoom: 8,
});

var map = new ol.Map({
  target: "map",
  view: mapView,
});

var osmTile = new ol.layer.Tile({
  title: "Open Street Map",
  visible: true,
  source: new ol.source.OSM(),
});

map.addLayer(osmTile);

// NBSS AWC Layer
var nbssAWCData = new ol.layer.Tile({
  title: "Soil AWC",
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/postgres/wms",
    params: {
      LAYERS: "postgres:soil_data_nbss_layer",
      STYLES: "soil_AWC",
      TILED: true,
    },
    serverType: "geoserver",
  }),
});

map.addLayer(nbssAWCData);

// NBSS AWC Layer
var nbssSDData = new ol.layer.Tile({
  title: "Soil Depth",
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/postgres/wms",
    params: {
      LAYERS: "postgres:soil_data_nbss_layer",
      STYLES: "soil_SD",
      TILED: true,
    },
    serverType: "geoserver",
  }),
});

map.addLayer(nbssSDData);

var nbssOCData = new ol.layer.Tile({
  title: "Soil Organic Carbon",
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/postgres/wms",
    params: {
      LAYERS: "postgres:soil_data_nbss_layer",
      STYLES: "soil_OC",
      TILED: true,
    },
    serverType: "geoserver",
  }),
});

map.addLayer(nbssOCData);

var nbssTextureData = new ol.layer.Tile({
  title: "Soil Texture",
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/postgres/wms",
    params: {
      LAYERS: "postgres:soil_data_nbss_layer",
      STYLES: "soil_Texture",
      TILED: true,
    },
    serverType: "geoserver",
  }),
});

map.addLayer(nbssTextureData);

var nbsbBidVillData = new ol.layer.Tile({
  title: "MH_Villages",
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/postgres/wms",
    params: {
      LAYERS: "postgres:mh_villages_layer",
      STYLES: "mh_villages_sld",
      TILED: true,
    },
    serverType: "geoserver",
  }),
});

map.addLayer(nbsbBidVillData);

// var layerSwitcher = new ol.control.layerSwitcher({
//   activationMode: 'click',
//   startActive: true,
//   groupSelectStyle: "children",
// });

// map.addControl(layerSwitcher);


var layerSwitcher = new LayerSwitcher({
    activationMode: 'click',
    startActive: true,
    groupSelectStyle: "children",
  });
  
  map.addControl(layerSwitcher);
  