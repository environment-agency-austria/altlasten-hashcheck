import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import  proj4  from 'proj4/dist/proj4';
import { register } from 'ol/proj/proj4';
import XYZ from 'ol/source/XYZ';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

proj4.defs("EPSG:31287","+proj=lcc +lat_0=47.5 +lon_0=13.3333333333333 +lat_1=49 +lat_2=46 +x_0=400000 +y_0=400000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs +type=crs");
proj4.defs("EPSG:3035","+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
register(proj4); 

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source : new XYZ({
        url : "https://mapproxy.rest-gdi.geo-data.space/tiles/osm/webmercator/{z}/{x}/{y}.png",
        maxZoom : 19
      })
    })
  ],
  view: new View({
    center: [401306 , 423398],
    zoom: 8,
    projection: 'EPSG:31287'
  })
});


const calcBtn = document.getElementById("calcBtn");
const geomField = document.getElementById("geomInput");

async function sha256Base64(str) {
  // Encode the string as a Uint8Array
  const encodedString = new TextEncoder().encode(str);

  // Calculate the SHA-256 hash using the SubtleCrypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedString);

  // Convert the ArrayBuffer to a Base64 string
  const base64Hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

  return base64Hash.replace(/\+/g, '-').replace(/\//g, '_');
}


calcBtn.onclick = async function(e) {
  // const hash = "abc";
  // const hashedGeometry = geomField.value;

  const voData = JSON.parse(geomField.value)
  let hashedGeometry = voData.hashedGeometry;
  const hash = voData.hash;

  let displayGeometry;
  if(!Array.isArray(JSON.parse(hashedGeometry))) {
    displayGeometry = '[' + hashedGeometry + ']';
  } else {
    displayGeometry = hashedGeometry;
  }

  const geometry = '{"type": "FeatureCollection", "features": ' + displayGeometry + '}';

  const ft = new GeoJSON().readFeatures(geometry)

  if(map.getLayers().getLength() > 1) {
    map.getLayers().pop();
  }

  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features : ft
    }),
    style : new Style({
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.5)' // Red with 50% opacity
      }),
      stroke: new Stroke({
        color: 'red',
        width: 2
      })})
  });
  map.addLayer(vectorLayer);

  const extent = vectorLayer.getSource().getExtent();
  map.getView().fit(extent, { padding: [50, 50, 50, 50] });

  const hashResult = await sha256Base64(hashedGeometry);
  const result = hashResult === hash ? "equal" : "not equal";
  setTimeout(() => {
    alert("The calculated hash-code of the provided geometry is: \n" + hashResult + "\nThe provided hash code was: \n"+ hash+"\nHash-codes are "+result);
  }, 500)
};