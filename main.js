var mapView = new ol.View({
    center:ol.proj.fromLonLat([75.746998, 18.996469]),
    zoom:8
});

var map = new ol.Map({
    target:'map',
    view:mapView
});

var osmTile = new ol.layer.Tile({
    title:'Open Street Map',
    visible:true,
    source:new ol.source.OSM()
});

map.addLayer(osmTile);

// // NBSS AWC Layer
// var nbssAWCData = new ol.layer.Tile({
//     title:'Nbss Data',
//     source: new ol.source.TileWMS({
//         url: 'http://localhost:8080/geoserver/postgres/wms',
//         params: {
//           LAYERS: "postgres:soil_data_nbss_layer",
//           STYLES: "soil_AWC",
//           TILED: true,
//         },
//         serverType: "geoserver",
//     })
// })

// map.addLayer(nbssAWCData);

// // NBSS AWC Layer
// var nbssAWCData = new ol.layer.Tile({
//     title:'Nbss Data',
//     source: new ol.source.TileWMS({
//         url: 'http://localhost:8080/geoserver/postgres/wms',
//         params: {
//           LAYERS: "postgres:soil_data_nbss_layer",
//           STYLES: "soil_AWC",
//           TILED: true,
//         },
//         serverType: "geoserver",
//     })
// })

// map.addLayer(nbssAWCData);

// var nbssAWCData = new ol.layer.Tile({
//     title:'Nbss Data',
//     source: new ol.source.TileWMS({
//         url: 'http://localhost:8080/geoserver/postgres/wms',
//         params: {
//           LAYERS: "postgres:soil_data_nbss_layer",
//           STYLES: "soil_AWC",
//           TILED: true,
//         },
//         serverType: "geoserver",
//     })
// })

// map.addLayer(nbssAWCData);

var nbsbBidVillData = new ol.layer.Tile({
    title:'Nbss Data',
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/postgres/wms',
        params: {
          LAYERS: "postgres:mh_villages_layer",
          STYLES: "mh_villages_sld",
          TILED: true,
        },
        serverType: "geoserver",
    })
})

map.addLayer(nbsbBidVillData);
