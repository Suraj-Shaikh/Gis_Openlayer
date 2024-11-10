window.onload = populateDistrictDropdown;

var map;
var nbssOCData, nbssAWCData, nbssSDData, nbssTextureData, nbsbBidVillData;

// Initialize the map and layers
function initMap() {
  var mapView = new ol.View({
    center: ol.proj.fromLonLat([76.994967, 20.702250]),
    zoom: 10,
  });

  map = new ol.Map({
    target: "map",
    view: mapView,
  });

  var osmTile = new ol.layer.Tile({
    title: "Open Street Map",
    visible: true,
    source: new ol.source.OSM(),
  });

  map.addLayer(osmTile);

  // NBSS Soil AWC Layer
  nbssAWCData = new ol.layer.Tile({
    title: "Soil AWC",
    source: new ol.source.TileWMS({
      url: "http://localhost:8080/geoserver/postgres/wms",
      params: {
        LAYERS: "postgres:nbss_all_soil_data",
        STYLES: "NBSS_AWC_class",
        TILED: true,
        viewparams: `dtncode:0`, // Default viewparams; updated on district change
      },
      serverType: "geoserver",
    }),
  });
  map.addLayer(nbssAWCData);

  // Initialize NBSS Soil Organic Carbon Layer
  nbssOCData = new ol.layer.Tile({
    title: "Soil Organic Carbon",
    source: new ol.source.TileWMS({
      url: "http://localhost:8080/geoserver/postgres/wms",
      params: {
        LAYERS: "postgres:nbss_all_soil_data",
        STYLES: "NBSS_OC_class",
        TILED: true,
        viewparams: `dtncode:0`, // Default viewparams; updated on district change
      },
      serverType: "geoserver",
    }),
  });

  map.addLayer(nbssOCData);



  // NBSS Soil Depth Layer
  nbssSDData = new ol.layer.Tile({
    title: "Soil Depth",
    source: new ol.source.TileWMS({
      url: "http://localhost:8080/geoserver/postgres/wms",
      params: {
        LAYERS: "postgres:nbss_all_soil_data",
        STYLES: "NBSS_Depth_class",
        TILED: true,
        viewparams: `dtncode:0`, // Default viewparams; updated on district change
      },
      serverType: "geoserver",
    }),
  });
  map.addLayer(nbssSDData);

  // NBSS Soil Texture Layer
  nbssTextureData = new ol.layer.Tile({
    title: "Soil Texture",
    source: new ol.source.TileWMS({
      url: "http://localhost:8080/geoserver/postgres/wms",
      params: {
        LAYERS: "postgres:nbss_all_soil_data",
        STYLES: "NBSS_Texture_class",
        TILED: true,
        viewparams: `dtncode:0`, // Default viewparams; updated on district change
      },
      serverType: "geoserver",
    }),
  });
  map.addLayer(nbssTextureData);

  // Bid Villages Layer
  nbsbBidVillData = new ol.layer.Tile({
    title: "Bid Villages",
    source: new ol.source.TileWMS({
      url: "http://localhost:8080/geoserver/postgres/wms",
      params: {
        LAYERS: "postgres:nbss_all_soil_data",
        STYLES: "mh_villages_sld",
        TILED: true,
        viewparams: `dtncode:0`, // Default viewparams; updated on district change
      },
      serverType: "geoserver",
    }),
  });
  map.addLayer(nbsbBidVillData);
}

// Update the layer's viewparams when district changes
function updateLayer(distCode) {
  // Update viewparams for each layer dynamically based on district code
  nbssOCData.getSource().updateParams({
    viewparams: `dtncode:${distCode}`,
  });

  nbssAWCData.getSource().updateParams({
    viewparams: `dtncode:${distCode}`,
  });

  nbssSDData.getSource().updateParams({
    viewparams: `dtncode:${distCode}`,
  });

  nbssTextureData.getSource().updateParams({
    viewparams: `dtncode:${distCode}`,
  });

  nbsbBidVillData.getSource().updateParams({
    viewparams: `dtncode:${distCode}`,
  });
}


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
// Populate district dropdown
async function populateDistrictDropdown() {
  try {
    const response = await fetch("http://127.0.0.1:5000/get_all_districts");
    const data = await response.json();
    const districtDropdown = document.getElementById("districtDropdown");

    districtDropdown.innerHTML = "<option>Select District</option>";
    data.forEach((district) => {
      const option = document.createElement("option");
      option.value = district.dtncode;
      option.textContent = district.dtname;
      districtDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching district data:", error);
  }
}

// Populate taluka dropdown based on selected district
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

// Populate village dropdown based on selected district and taluka
async function populateVillageDropdown(distCode, talukaCode) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/get_villages/${distCode}/${talukaCode}`);
    const data = await response.json();
    const villageDropdown = document.getElementById("villageDropdown");

    villageDropdown.innerHTML = "<option>Select Village</option>";
    data.forEach((village) => {
      const option = document.createElement("option");
      option.value = village.vincode;
      option.textContent = village.vlname;
      villageDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching village data:", error);
  }
}

// Define the function to zoom and pan to a specific extent
function zoomToExtent(extent) {
  var view = map.getView();
  view.fit(extent, {
    size: map.getSize(),  // Fit to the current map size
    maxZoom: 12,          // Optional: Maximum zoom level
  });
}

async function getDistrictExtent(distCode) {
  try {
    // Fetch extent from API
    const response = await fetch(`http://127.0.0.1:5000/get_all_districts/${distCode}`);
    const data = await response.json();
    console.log(data);

    // Assuming the API returns an array of districts and each district has a "extent" string
    const district = data[0];  // Get the first district, assuming data is an array
    const extentString = district.extent;  // Example: "76.20712134300001, 18.749738211000057, 77.192660942, 19.83061516700011"
    
    // Split the extent string into individual coordinates
    const extentArray = extentString.split(', ').map(coord => parseFloat(coord));

    // Transform the extent from EPSG:4326 (WGS84) to EPSG:3857 (Web Mercator)
    const extent = ol.proj.transformExtent(extentArray, 'EPSG:4326', 'EPSG:3857');
    
    // Zoom to the extent
    zoomToExtent(extent);
    console.log(extent);
  } catch (error) {
    console.error("Error fetching district extent:", error);
  }
}


// Event listener for district dropdown change
document.getElementById("districtDropdown").addEventListener("change", (event) => {
  const distCode = event.target.value;
  populateTalukaDropdown(distCode);
  updateLayer(distCode);  // Update layers based on selected district
  getDistrictExtent(distCode); // Zoom to district extent
});

// Event listener for taluka dropdown change
document.getElementById("talukaDropdown").addEventListener("change", (event) => {
  const talukaCode = event.target.value;
  const distCode = document.getElementById("districtDropdown").value;
  populateVillageDropdown(distCode, talukaCode);
});



// Initialize map on page load
initMap();
