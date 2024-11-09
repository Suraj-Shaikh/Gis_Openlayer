window.onload = populateDistrictDropdown;
function initMap(distCode) {
  var mapView = new ol.View({
    center: ol.proj.fromLonLat([76.994967, 20.702250]),
    zoom: 10,
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
  // var nbssAWCData = new ol.layer.Tile({
  //   title: "Soil AWC",
  //   source: new ol.source.TileWMS({
  //     url: "http://localhost:8080/geoserver/postgres/wms",
  //     params: {
  //       LAYERS: "postgres:soil_data_nbss_layer",
  //       STYLES: "soil_AWC",
  //       TILED: true,
  //     },
  //     serverType: "geoserver",
  //   }),
  // });

  // map.addLayer(nbssAWCData);

  // // NBSS AWC Layer
  // var nbssSDData = new ol.layer.Tile({
  //   title: "Soil Depth",
  //   source: new ol.source.TileWMS({
  //     url: "http://localhost:8080/geoserver/postgres/wms",
  //     params: {
  //       LAYERS: "postgres:nbss_all_soil_data",
  //       STYLES: "soil_SD",
  //       TILED: true,
  //     },
  //     serverType: "geoserver",
  //   }),
  // });

  // map.addLayer(nbssSDData);

  var nbssOCData = new ol.layer.Tile({
    title: "Soil Organic Carbon",
    source: new ol.source.TileWMS({
      url: "http://localhost:8080/geoserver/postgres/wms",
      params: {
        LAYERS: "postgres:nbss_all_soil_data",
        STYLES: "NBSS_OC_class",
        TILED: true,
        viewparams: `dtncode:${distCode}`, // Use distCode directly
      },
      serverType: "geoserver",
    }),
  });

  map.addLayer(nbssOCData);
}
// var nbssTextureData = new ol.layer.Tile({
//   title: "Soil Texture",
//   source: new ol.source.TileWMS({
//     url: "http://localhost:8080/geoserver/postgres/wms",
//     params: {
//       LAYERS: "postgres:nbss_all_soil_data",
//       STYLES: "soil_Texture",
//       TILED: true,
//     },
//     serverType: "geoserver",
//   }),
// });

// map.addLayer(nbssTextureData);

// var nbsbBidVillData = new ol.layer.Tile({
//   title: "Bid Villages",
//   source: new ol.source.TileWMS({
//     url: "http://localhost:8080/geoserver/postgres/wms",
//     params: {
//       LAYERS: "postgres:nbss_all_soil_data",
//       STYLES: "mh_villages_sld",
//       TILED: true,
//     },
//     serverType: "geoserver",
//   }),
// });

// map.addLayer(nbsbBidVillData);


// var layerSwitcher = new LayerSwitcher({
//     activationMode: 'click',
//     startActive: true,
//     groupSelectStyle: "children",
//   });

//   map.addControl(layerSwitcher);

// checkbox status
function toggleLayer(eve) {
  var larname = eve.target.value;
  var checkedStatus = eve.target.checked;
  var larList = map.getLayers();

  larList.forEach(function (element) {
    if (larname == element.get('title')) {
      element.setVisible(checkedStatus);
    }
  })
}

const distCode = document.getElementById("districtDropdown").value;

// create dropdown FOR District selection
async function populateDistrictDropdown() {
  try {
    // Fetch district data from API
    const response = await fetch("http://127.0.0.1:5000/get_all_districts");
    const data = await response.json();

    // Get the dropdown element
    const districtDropdown = document.getElementById("districtDropdown");

    // Clear existing options except default
    districtDropdown.innerHTML = "<option>Select District</option>";

    // Populate dropdown with district names
    data.forEach((district) => {
      const option = document.createElement("option");
      option.value = district.dtncode; // Set value as district code
      option.textContent = district.dtname; // Set displayed name
      districtDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching district data:", error);
  }
}

//create dropdown for Taluka selection

async function populateTalukaDropdown(districtCode) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/get_talukas/${districtCode}`);
    const data = await response.json();

    const talukaDropdown = document.getElementById("talukaDropdown");

    talukaDropdown.innerHTML = "<option>Select Taluka</option>";

    data.forEach((taluka) => {
      const option = document.createElement("option");
      option.value = taluka.thncode;
      option.textContent = taluka.thname;
      talukaDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching taluka data:", error);
  }
}

document.getElementById("districtDropdown").addEventListener("change", (event) => {
  const selectDistrict = event.target.value;
  const distCode = selectDistrict;
  populateTalukaDropdown(distCode);
  initMap(distCode)
});

// create dropdown for Village selection
async function populateVillageDropdown(distCode, talukaCode) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/get_villages/${distCode}/${talukaCode}`);
    const data = await response.json();

    const villageDropdown = document.getElementById("villageDropdown");

    villageDropdown.innerHTML = "<option>Select Village</option>";


    data.forEach((village) => {
      console.log(village);
      const option = document.createElement("option");
      option.value = village.vincode;
      option.textContent = village.vlname;
      villageDropdown.appendChild(option);
    })

  } catch (error) {
    console.error("Error fetching village data:", error);
  }
}

document.getElementById("talukaDropdown").addEventListener("change", (event) => {
  const talukaCode = event.target.value;
  const distCode = document.getElementById("districtDropdown").value;
  populateVillageDropdown(distCode, talukaCode);

});

