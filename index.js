let map;

function initMap() {
  // set up the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(0, 0),
    zoom: 4,
  });
}

function loadGeoJsonString(geoString) {
  try {
    const geojson = JSON.parse(geoString);

    map.data.addGeoJson(geojson);
  } catch (e) {
    alert("Not a GeoJSON file!");
  }

  zoom(map);
}

/**
 * Update a map's viewport to fit each geometry in a dataset
 */
function zoom(map) {
  const bounds = new google.maps.LatLngBounds();

  map.data.forEach((feature) => {
    const geometry = feature.getGeometry();

    if (geometry) {
      processPoints(geometry, bounds.extend, bounds);
    }
  });
  map.fitBounds(bounds);
}

/**
 * Process each point in a Geometry, regardless of how deep the points may lie.
 */
function processPoints(geometry, callback, thisArg) {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry);
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get());
  } else {
    geometry.getArray().forEach((g) => {
      processPoints(g, callback, thisArg);
    });
  }
}

/* DOM (drag/drop) functions */
function initEvents() {
  [...document.getElementsByClassName("file")].forEach((fileElement) => {
    fileElement.addEventListener(
      "dragstart",
      (e) => {
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify(files[Number(e.target.dataset.value)])
        );
        console.log(e);
      },
      false
    );
  });

  // set up the drag & drop events
  const mapContainer = document.getElementById("map");

  mapContainer.addEventListener("dragenter", addClassToDropTarget, false);
  mapContainer.addEventListener("dragover", addClassToDropTarget, false);
  mapContainer.addEventListener("drop", handleDrop, false);
  mapContainer.addEventListener("dragleave", removeClassFromDropTarget, false);
}

function addClassToDropTarget(e) {
  e.stopPropagation();
  e.preventDefault();
  document.getElementById("map").classList.add("over");
  return false;
}

function removeClassFromDropTarget(e) {
  document.getElementById("map").classList.remove("over");
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  removeClassFromDropTarget(e);

  const files = e.dataTransfer.files;

  if (files.length) {
    // process file(s) being dropped
    // grab the file data from each file
    for (let i = 0, file; (file = files[i]); i++) {
      const reader = new FileReader();

      reader.onload = function (e) {
        loadGeoJsonString(reader.result);
      };

      reader.onerror = function (e) {
        console.error("reading failed");
      };

      reader.readAsText(file);
    }
  } else {
    // process non-file (e.g. text or html) content being dropped
    // grab the plain text version of the data
    const plainText = e.dataTransfer.getData("text/plain");

    console.log(plainText);
    if (plainText) {
      loadGeoJsonString(plainText);
    }
  }
  // prevent drag event from bubbling further
  return false;
}

function initialize() {
  initMap();
  initEvents();
}

const files = [
  {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-99.49218749999999, -11.867350911459294],
              [24.960937499999996, -11.867350911459294],
              [24.960937499999996, 47.517200697839414],
              [-99.49218749999999, 47.517200697839414],
              [-99.49218749999999, -11.867350911459294],
            ],
          ],
        },
      },
    ],
  },
  {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [81.2109375, 50.064191736659104],
        },
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [103.35937499999999, -47.98992166741417],
        },
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [-46.05468749999999, 64.01449619484472],
        },
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [-113.203125, 37.996162679728116],
        },
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [-73.828125, -32.249974455863295],
        },
      },
    ],
  },
  {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [147.65625, -5.266007882805485],
            [118.47656249999999, 43.83452678223682],
            [80.85937499999999, -30.145127183376115],
            [35.15625, 51.83577752045248],
            [-15.468749999999998, -23.563987128451217],
            [-29.53125, 44.33956524809713],
            [-73.47656249999999, -32.842673631954305],
            [-104.765625, 35.460669951495305],
          ],
        },
      },
    ],
  },
  {
    "features": [
        {
            "feature_type": "address",
            "geometry": null,
            "id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
            "properties": {
                "address": "150 W San Carlos St",
                "country": "US",
                "locality": "San Jose",
                "postal_code": "95113",
                "postal_code_ext": null,
                "province": "US-CA",
                "unit": null
            },
            "type": "Feature"
        }
    ],
    "name": "address",
    "type": "FeatureCollection"
  },
  {
    "type": "FeatureCollection",
    "name": "amenity",
    "features": [
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "6fa7e68e-4d97-4ec8-996a-2afe8bb3e7df",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "elevator",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "a2bf457a-5379-4d46-836f-1ff0f0e7074e",
            "ddaca3f3-abd8-41f7-9359-d0e93858e378"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8888997,
            37.3285715
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "53b07635-fcbf-4169-81c1-be200c396044",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "escalator",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "d0ffd55a-9b99-4ebd-ac08-97a3d448c0f7",
            "40370a65-cfc8-4673-afe5-31482b2a5828"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8890422,
            37.3296916
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "7c347d3b-0095-4e3b-8035-46577eeffea4",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "escalator",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "9dc445f5-c465-4a18-9ba3-2c9cb6908cbc",
            "f62c4296-aa0c-4f03-9b75-e09a30178ebe"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8890426,
            37.3296912
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "bcb982c3-c94b-4c5c-8ddb-a553ec0e9088",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "escalator",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "65987a75-1c44-45a0-b44c-82ae88ab3f4c",
            "234625ee-9f40-4fae-980a-6bdf9fca0a87"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8890106,
            37.3297032
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "641d7a58-cb32-42df-849e-19397828fb1a",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "stairs",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "8ade1f78-5841-4b57-8386-75355c7e0252",
            "f1e17183-0fed-47b8-878e-1f888b7e9099"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8882474,
            37.3296594
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "8acd6573-b91a-44e0-9365-72ed6c8c941f",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "stairs",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "b6f13719-4210-48d5-846a-62e7f0519b1b",
            "1697abfa-7b60-4ccf-bfd6-74807406c2f7"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8878280,
            37.3297908
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "aa51c09a-84e1-4bce-afaf-ac02d3997d8b",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "elevator",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "8f3e39e8-af00-4ee2-8502-3de7f9165e00",
            "ca36667a-07b6-4f13-ae44-101efe218bfc"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8888991,
            37.3285690
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "b2c4c909-1cf8-427a-bda6-0eebea2ed5b3",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "stairs",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "93c6060f-dd4d-4946-9d56-b88a7f395ae0",
            "1dd7ea28-eae5-4f9a-a7a2-21a74e03f2ef"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8902384,
            37.3290152
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "f08ed00f-0f17-4596-817c-e77cd02f0f1d",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "stairs",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "01fa64c6-cdc1-48e9-8c48-4c0cfd1c657d",
            "91285dbc-bade-4438-a59c-2ef88e97528f"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8903485,
            37.3289621
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "734946bc-80b6-443e-9c00-39d2b42ad667",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "escalator",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "269236f4-b17b-45bf-bd31-820dee3807a2",
            "412f88b8-d469-43a4-99d3-1d71a92d2ea3"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8890048,
            37.3296946
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "4ada741f-1c54-4fd2-aec4-e5ef040c6c27",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "elevator",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "32c0a4b5-9675-407f-a8e8-8e13e2f21f7c",
            "ced955bd-4fd6-477b-b62a-8690449d9814"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8888991,
            37.3285690
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "f0e59fe9-f7f7-4f0d-999b-fbaeeee3ce7e",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "restroom",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "9fb407af-982e-43a5-bfce-12aac9378925",
            "54650f3b-c895-4873-a733-3bf2a6e0a331"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8892246,
            37.3292444
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "d2864a83-a73e-4299-a3c6-7cbb2406bf6d",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "restroom",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "4500a0fa-ca5c-4056-ab78-0799806aa0a6",
            "2e1f6751-9f22-444e-847b-2da650064940"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8885441,
            37.3294589
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "5697d51b-c271-4cfd-89d4-9e1b84b92822",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "restroom",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "4874118e-38a8-4f5e-bb28-8020d4448f36",
            "676771c0-8574-41ef-8d3c-36f446a9eb0a"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8899060,
            37.3290309
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "7a31f45a-ec53-4f50-a8fa-4d10f7241bba",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "restroom",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "3256546e-4f98-4a38-842a-d51ec1b948dc",
            "d5d1a2d1-4d14-44ca-88be-97e99faf13d0"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8897171,
            37.3293026
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "d4651cfe-bc9e-4c24-b01a-7e8edc5a05c8",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "restroom",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "f21aeff0-d46d-43c9-bf66-b5f3c78d957f",
            "ff26de56-0a31-445d-9922-1ac27969cb09"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8880080,
            37.3297042
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "7fa39fb9-718b-4113-abf2-d3e9ec6a7f67",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "restroom",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "5162423c-f22d-4196-bb51-e01ed6c40cd5",
            "bd3c989c-ca1c-45d8-830c-4b9597e770a2"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8877433,
            37.3298311
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "1df85816-8029-4a14-ba7f-abdf9f4a04d7",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "restroom",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "c3d9f038-08b1-4d22-bb09-dbc1ec6588be",
            "0b65c895-2faf-4154-bc60-60227754dc0d"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8877036,
            37.3291423
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "5471f400-1f4b-4ce3-83a5-e00d0376a64f",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "restroom",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "3a589851-264f-4d34-bfd0-aba8d7070551",
            "3a6ebefc-311d-4786-8ae8-70882f23c9c7"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8901558,
            37.3286138
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "f738180c-9bb7-406b-a759-8d768254dadf",
        "properties": {
          "accessibility": null,
          "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
          "alt_name": null,
          "category": "restroom",
          "correlation_id": null,
          "hours": null,
          "name": null,
          "phone": null,
          "unit_ids": [
            "80eb851b-47c6-432f-a6fa-27b006b4b14d",
            "43ec0a85-bdad-41d9-9b4f-99073b978386"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8891130,
            37.3294738
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "a89da5f4-6e16-495d-a982-27a31af751d4",
        "properties": {
          "accessibility": null,
          "address_id": null,
          "alt_name": null,
          "category": "exhibit",
          "correlation_id": null,
          "hours": null,
          "name": {
            "en": "T-Rex Exhibit"
          },
          "phone": null,
          "unit_ids": [
            "ff033dba-6b6e-47ee-88d4-94efd6f4c4e9"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -121.8890391,
            37.3289201
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "a89da5f4-6e16-495d-a982-27a31af751d5",
        "properties": {
          "accessibility": null,
          "address_id": null,
          "alt_name": null,
          "category": "exhibit",
          "correlation_id": null,
          "hours": null,
          "name": {
            "en": "Bone Hall"
          },
          "phone": null,
          "unit_ids": [
            "a517e630-182f-4552-91b6-882063eea03c"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
              -121.8883862,
              37.3291811
          ]
        }
      },
      {
        "type": "Feature",
        "feature_type": "amenity",
        "id": "a89da5f4-6e16-495d-a982-27a31af751d6",
        "properties": {
          "accessibility": null,
          "address_id": null,
          "alt_name": null,
          "category": "exhibit",
          "correlation_id": null,
          "hours": null,
          "name": {
            "en": "Sauropod Exhibit"
          },
          "phone": null,
          "unit_ids": [
            "f157b1d0-dd9c-4d59-a216-ad52893c2694"
          ],
          "website": null
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
              -121.8896503,
              37.3286909
          ]
        }
      }
  
  
    ]
  },
  {
    "features": [
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8896066,
                    37.329453
                ],
                "type": "Point"
            },
            "id": "f353425b-472c-4b80-aefb-98e03a3d3f11",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "57ecdbd5-bd78-4edb-87e5-678e5675a844"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8897926,
                    37.3296989
                ],
                "type": "Point"
            },
            "id": "83b975a6-6e63-46f6-b207-062e95260b0f",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "1cadfb36-5641-41ab-9a78-7a899b8541e9"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8898559,
                    37.3297825
                ],
                "type": "Point"
            },
            "id": "5ede5810-73f6-4c83-ac0a-122188c24280",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "3d1db391-084c-4226-ab3a-33c9f865f876"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8898609,
                    37.3290441
                ],
                "type": "Point"
            },
            "id": "353409b8-e740-4813-9b0f-44564f3cde7f",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "2981b8e9-2cbf-4bd3-af91-b3144823fe01"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8896686,
                    37.329535
                ],
                "type": "Point"
            },
            "id": "dcf31157-1278-423e-a407-142aacef972a",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "5c03301d-9a19-46db-a6c6-c4050cae303a"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8900381,
                    37.3289509
                ],
                "type": "Point"
            },
            "id": "ff96ac2a-598e-4842-af67-d9f27cb256c0",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "3ba1e121-6ef7-4136-974b-2eb376fc7dd3"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8897307,
                    37.329617
                ],
                "type": "Point"
            },
            "id": "4c9d5055-16e7-4321-b246-e35bf5fa5b94",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "05f7c2ab-e923-40ec-9ca3-0583755b5e24"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8874098,
                    37.3293015
                ],
                "type": "Point"
            },
            "id": "f86c33d1-0cb9-4fb5-ab28-75d96de6b706",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "c61efb19-969f-443e-b141-cc00780bc93b"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8885831,
                    37.3294301
                ],
                "type": "Point"
            },
            "id": "134d62a5-3e1a-4c2e-8b0c-04ed29878bb8",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "19673af6-080b-4c8a-a9ef-bf815769422f"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8895482,
                    37.3293758
                ],
                "type": "Point"
            },
            "id": "54e1700d-d4e2-412a-a15d-3c99d9a31276",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "9acd6573-b91a-44e0-9365-72ed6c8c941f"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8883862,
                    37.3291811
                ],
                "type": "Point"
            },
            "id": "214b0353-6163-48eb-96f1-00dc0f9cd5b5",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "a517e630-182f-4552-91b6-882063eea03c"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8900285,
                    37.3284249
                ],
                "type": "Point"
            },
            "id": "f60059dd-545a-48ff-b58f-fcf11aaa7d12",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "74a29cfa-f995-4ce2-aba8-b1c7f18d5d95"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8899478,
                    37.3283216
                ],
                "type": "Point"
            },
            "id": "db5db8b4-a802-4770-945e-ce409ff2838f",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "2b42921c-895b-4e2a-86dd-75915a28c987"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8878608,
                    37.3294221
                ],
                "type": "Point"
            },
            "id": "bc57ca27-c994-4cba-8fae-10c8a52032d1",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "37395f92-7865-48fc-9c92-927f31781db8"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8876465,
                    37.3297254
                ],
                "type": "Point"
            },
            "id": "1a6cc871-8c33-4db8-91b5-c312e3022cbe",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "ab5b5d50-60aa-4bb8-9f30-4ed4076ff1cd"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8900125,
                    37.3285318
                ],
                "type": "Point"
            },
            "id": "52485be7-7c86-406c-a67a-639736038972",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "3beb9daf-68fc-40b0-84d3-d5c42277e755"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8890395,
                    37.3289201
                ],
                "type": "Point"
            },
            "id": "75f971ca-90fe-46c4-b5f2-82d47a295717",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "ff033dba-6b6e-47ee-88d4-94efd6f4c4e9"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.890124,
                    37.3284783
                ],
                "type": "Point"
            },
            "id": "c5edc108-0093-46d1-a2ff-89da19d2c364",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "29e48c4d-da06-4a64-a810-9597adb4fc6b"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.887355,
                    37.3296419
                ],
                "type": "Point"
            },
            "id": "f2d18ede-a06e-4ac4-a09d-8b2e11999c04",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "899b5ff7-5fb3-4f73-ab9a-74015412b545"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8872943,
                    37.3295819
                ],
                "type": "Point"
            },
            "id": "35d2600b-ca3f-4483-86e1-58c9f3e481bc",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "306cf8de-3549-4920-a9e5-b57631d6b564"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8896503,
                    37.3286909
                ],
                "type": "Point"
            },
            "id": "525dff79-6c35-41c0-a328-beab44576da3",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "f157b1d0-dd9c-4d59-a216-ad52893c2694"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8901493,
                    37.3285264
                ],
                "type": "Point"
            },
            "id": "fb5319c0-de6d-4cb1-af8c-2603b59b5f9d",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "b6f87afb-358d-43d0-93c7-43336d5ba8a1"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.889609,
                    37.329678
                ],
                "type": "Point"
            },
            "id": "76336b53-81c9-4c93-8f81-a4c008d54ba1",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "9e0cdcd1-7b86-4f50-839d-d8e4a5ac9235"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8900459,
                    37.328576
                ],
                "type": "Point"
            },
            "id": "e59bb23d-3c0f-441c-97c6-c137819de184",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "8eeb7c6a-29d0-4822-9f1f-74ef80cfffd6"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8898697,
                    37.3282138
                ],
                "type": "Point"
            },
            "id": "2d52ff19-3c0f-441c-97c6-c137819de183",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "4cb6693e-1ddc-4ea0-8773-f17644e37249"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8875084,
                    37.3295423
                ],
                "type": "Point"
            },
            "id": "114b0353-6163-48eb-96f1-00dc0f9cd5b5",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "35f3ebb3-5e9d-4ae5-8117-cfea0877678b"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8877446,
                    37.3291243
                ],
                "type": "Point"
            },
            "id": "293cb072-fd02-4477-8e61-9e5fe94e5cb2",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "1cdbe58c-463f-42ad-8d06-788ce1e0ccbf"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8881187,
                    37.3289452
                ],
                "type": "Point"
            },
            "id": "1f97ee2d-de6d-4cb1-af8c-2603b59b5f9d",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "ab919be3-110b-4705-b30b-1de916918fd5"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8879294,
                    37.3298536
                ],
                "type": "Point"
            },
            "id": "1f97ee2d-4d1b-4211-8338-94dd01761855",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "422cff48-fa3c-48aa-843c-2c961277616e"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.890118,
                    37.3289209
                ],
                "type": "Point"
            },
            "id": "8c214a77-0915-404d-9b42-503a6a89c9f7",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "daf434cf-7ef7-47e9-bea1-b5e7dc681b6f"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8894468,
                    37.3283262
                ],
                "type": "Point"
            },
            "id": "6cfa33dc-9efb-41be-ab5e-a1a1115c4266",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "7358ad32-0b58-4566-bdb2-3c6479d3c417"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8877704,
                    37.3299516
                ],
                "type": "Point"
            },
            "id": "24a30b3b-cbec-4d01-aaa1-a603649e5741",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "a3442e09-9641-4913-bfe1-74c012d9f3be"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8888636,
                    37.3294835
                ],
                "type": "Point"
            },
            "id": "8415b161-8847-4b18-97a6-24a7d5621089",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "7b4ab115-0029-4d92-acce-84cd5ff57a0a"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8884528,
                    37.3287854
                ],
                "type": "Point"
            },
            "id": "fe0e5038-d0ab-45c9-97e9-90548b6ce7b8",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "7b2789ad-b254-46bc-9280-dbe8f41218ab"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8883755,
                    37.3296171
                ],
                "type": "Point"
            },
            "id": "5a6547f8-eebc-4b63-814c-0345157d3743",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "a38ba22a-c137-48b1-8090-d31bdd694e8f"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8882123,
                    37.3289171
                ],
                "type": "Point"
            },
            "id": "2da0f839-f18b-44d0-8815-1cea383fe5c2",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "5fa7e68e-4d97-4ec8-996a-2afe8bb3e7df"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8884447,
                    37.3297178
                ],
                "type": "Point"
            },
            "id": "c53c7987-9efb-41be-ab5e-a1a1115c4264",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "92171039-cf9b-4590-a406-43ca824c8418"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8888983,
                    37.3295293
                ],
                "type": "Point"
            },
            "id": "a60059dd-545a-48ff-b58f-fcf11aaa7d12",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "005eb3b8-c95d-4d35-a8a0-22d3cb4d6542"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.888351,
                    37.3297504
                ],
                "type": "Point"
            },
            "id": "e62c7987-9efb-41be-ab5e-a1a1115c4264",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "7c28c3a6-fd8c-4a87-a6f6-4c69a9d6174b"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8882836,
                    37.3297827
                ],
                "type": "Point"
            },
            "id": "6afac3b2-9efb-41be-ab5e-a1a1115c4265",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "66796807-6465-4882-b96a-e300a8135ba3"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8873997,
                    37.3293048
                ],
                "type": "Point"
            },
            "id": "d2031dda-20e3-4d21-b0b5-94f4bcb00024",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "4012e1ae-19dd-499a-9def-6e07c9f63d56"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8878578,
                    37.3298878
                ],
                "type": "Point"
            },
            "id": "4b9911bd-c3ca-4d90-8e74-10d302502487",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "a6a4df35-02fd-4a77-82da-7249a362590e"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.8880409,
                    37.3298222
                ],
                "type": "Point"
            },
            "id": "c400d6ad-41d4-480b-ba61-d24805a1ca9e",
            "properties": {
                "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
                "unit_id": "72849bc9-e6ad-4dd8-99ea-f5c89c11dac4"
            },
            "type": "Feature"
        },
        {
            "feature_type": "anchor",
            "geometry": {
                "coordinates": [
                    -121.88965,
                    37.328691
                ],
                "type": "Point"
            },
            "id": "1eb0c1f1-99b3-46a3-973a-33e5f92384a1",
            "properties": {
                "address_id": null,
                "unit_id": "f157b1d0-dd9c-4d59-a216-ad52893c2694"
            },
            "type": "Feature"
        }
    ],
    "name": "Anchor",
    "type": "FeatureCollection"
},
{
  "features": [
      {
          "feature_type": "building",
          "geometry": null,
          "id": "26f04b4f-9ae2-45e3-99d1-393c66d58eb4",
          "properties": {
              "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
              "alt_name": null,
              "category": "unspecified",
              "display_point": {
                  "coordinates": [
                      -121.889164,
                      37.32925
                  ],
                  "type": "Point"
              },
              "name": {
                  "en": "San Jose McEnery Convention Center"
              },
              "restriction": null
          },
          "type": "Feature"
      }
  ],
  "name": "building",
  "type": "FeatureCollection"
},
{
  "features": [
      {
          "feature_type": "footprint",
          "geometry": {
              "coordinates": [
                  [
                      [
                          -121.8898407,
                          37.3293601
                      ],
                      [
                          -121.8897741,
                          37.3292754
                      ],
                      [
                          -121.8900648,
                          37.3291363
                      ],
                      [
                          -121.890095,
                          37.3291218
                      ],
                      [
                          -121.8902186,
                          37.3290626
                      ],
                      [
                          -121.8902893,
                          37.3290288
                      ],
                      [
                          -121.890306,
                          37.3290208
                      ],
                      [
                          -121.8903241,
                          37.3290121
                      ],
                      [
                          -121.8903448,
                          37.3290023
                      ],
                      [
                          -121.8904115,
                          37.3289703
                      ],
                      [
                          -121.8905398,
                          37.3289089
                      ],
                      [
                          -121.8904671,
                          37.328813
                      ],
                      [
                          -121.8902989,
                          37.3285909
                      ],
                      [
                          -121.8903431,
                          37.3285698
                      ],
                      [
                          -121.8900849,
                          37.3282276
                      ],
                      [
                          -121.8899925,
                          37.3281051
                      ],
                      [
                          -121.8899801,
                          37.3280887
                      ],
                      [
                          -121.8897029,
                          37.3277213
                      ],
                      [
                          -121.8893932,
                          37.3278695
                      ],
                      [
                          -121.8893583,
                          37.3278234
                      ],
                      [
                          -121.889263,
                          37.3278691
                      ],
                      [
                          -121.8892979,
                          37.3279151
                      ],
                      [
                          -121.8889445,
                          37.3280843
                      ],
                      [
                          -121.8891129,
                          37.3283067
                      ],
                      [
                          -121.8883222,
                          37.3286852
                      ],
                      [
                          -121.8882612,
                          37.3286045
                      ],
                      [
                          -121.8881734,
                          37.3286454
                      ],
                      [
                          -121.8880921,
                          37.3285367
                      ],
                      [
                          -121.8880906,
                          37.3285348
                      ],
                      [
                          -121.8879295,
                          37.3286539
                      ],
                      [
                          -121.8879744,
                          37.3287081
                      ],
                      [
                          -121.8877977,
                          37.3287926
                      ],
                      [
                          -121.8878163,
                          37.3288172
                      ],
                      [
                          -121.8876396,
                          37.3289018
                      ],
                      [
                          -121.8876686,
                          37.3289402
                      ],
                      [
                          -121.887409,
                          37.3290644
                      ],
                      [
                          -121.8873186,
                          37.3291071
                      ],
                      [
                          -121.8870803,
                          37.3292828
                      ],
                      [
                          -121.8869393,
                          37.3293867
                      ],
                      [
                          -121.8870924,
                          37.3295107
                      ],
                      [
                          -121.8870567,
                          37.32954
                      ],
                      [
                          -121.887171,
                          37.3296325
                      ],
                      [
                          -121.8874491,
                          37.3298578
                      ],
                      [
                          -121.8875412,
                          37.3299323
                      ],
                      [
                          -121.8875605,
                          37.329948
                      ],
                      [
                          -121.8875651,
                          37.3299517
                      ],
                      [
                          -121.8876704,
                          37.3299012
                      ],
                      [
                          -121.8876825,
                          37.3299172
                      ],
                      [
                          -121.8877675,
                          37.3300294
                      ],
                      [
                          -121.8877788,
                          37.3300444
                      ],
                      [
                          -121.8877818,
                          37.3300483
                      ],
                      [
                          -121.887783,
                          37.3300499
                      ],
                      [
                          -121.8878052,
                          37.3300793
                      ],
                      [
                          -121.8878059,
                          37.3300802
                      ],
                      [
                          -121.8878094,
                          37.3300847
                      ],
                      [
                          -121.8878824,
                          37.3301812
                      ],
                      [
                          -121.8883325,
                          37.3299674
                      ],
                      [
                          -121.8883274,
                          37.3299606
                      ],
                      [
                          -121.8882947,
                          37.3299175
                      ],
                      [
                          -121.8884877,
                          37.3298251
                      ],
                      [
                          -121.8885365,
                          37.3298017
                      ],
                      [
                          -121.8885529,
                          37.3297939
                      ],
                      [
                          -121.8885707,
                          37.3298174
                      ],
                      [
                          -121.8885894,
                          37.3298421
                      ],
                      [
                          -121.8886311,
                          37.3298971
                      ],
                      [
                          -121.8886866,
                          37.3299706
                      ],
                      [
                          -121.888774,
                          37.3299287
                      ],
                      [
                          -121.8887889,
                          37.3299484
                      ],
                      [
                          -121.8887977,
                          37.3299442
                      ],
                      [
                          -121.8889657,
                          37.3298638
                      ],
                      [
                          -121.8889744,
                          37.3298596
                      ],
                      [
                          -121.8889595,
                          37.3298399
                      ],
                      [
                          -121.8890401,
                          37.3298013
                      ],
                      [
                          -121.8890469,
                          37.3297981
                      ],
                      [
                          -121.8890589,
                          37.3297923
                      ],
                      [
                          -121.8891236,
                          37.3297614
                      ],
                      [
                          -121.8891473,
                          37.3297928
                      ],
                      [
                          -121.8893961,
                          37.3299621
                      ],
                      [
                          -121.8894513,
                          37.3300349
                      ],
                      [
                          -121.8894531,
                          37.3300373
                      ],
                      [
                          -121.8900242,
                          37.329764
                      ],
                      [
                          -121.8901096,
                          37.3296945
                      ],
                      [
                          -121.8898523,
                          37.3293547
                      ],
                      [
                          -121.8898407,
                          37.3293601
                      ]
                  ]
              ],
              "type": "Polygon"
          },
          "id": "9748dc5b-3f08-407b-9a8d-f5ed626bf9e8",
          "properties": {
              "building_ids": [
                  "26f04b4f-9ae2-45e3-99d1-393c66d58eb4"
              ],
              "category": "ground",
              "name": null
          },
          "type": "Feature"
      },
      {
          "feature_type": "footprint",
          "geometry": {
              "coordinates": [
                  [
                    [
                      -121.8890925,
                      37.3297763
                    ],
                    [
                      -121.8890589,
                      37.3297923
                    ],
                    [
                      -121.8890469,
                      37.3297981
                    ],
                    [
                      -121.889040099999832,
                      37.329801300000085
                    ],
                    [
                      -121.8889595,
                      37.3298399
                    ],
                    [
                      -121.8889744,
                      37.3298596
                    ],
                    [
                      -121.8889657,
                      37.3298638
                    ],
                    [
                      -121.8887977,
                      37.3299442
                    ],
                    [
                      -121.8887889,
                      37.3299484
                    ],
                    [
                      -121.888774,
                      37.3299287
                    ],
                    [
                      -121.8886866,
                      37.3299706
                    ],
                    [
                      -121.888631,
                      37.3298971
                    ],
                    [
                      -121.8885638,
                      37.3298083
                    ],
                    [
                      -121.8885529,
                      37.3297939
                    ],
                    [
                      -121.8884341,
                      37.3298508
                    ],
                    [
                      -121.888417732957251,
                      37.329858597174869
                    ],
                    [
                      -121.8882947,
                      37.3299175
                    ],
                    [
                      -121.8883274,
                      37.3299606
                    ],
                    [
                      -121.8883325,
                      37.3299674
                    ],
                    [
                      -121.8878824,
                      37.3301812
                    ],
                    [
                      -121.8878453,
                      37.3301322
                    ],
                    [
                      -121.8878058,
                      37.3300801
                    ],
                    [
                      -121.8877822,
                      37.3300489
                    ],
                    [
                      -121.887695645166872,
                      37.329934551620276
                    ],
                    [
                      -121.8876825,
                      37.3299172
                    ],
                    [
                      -121.8876704,
                      37.3299012
                    ],
                    [
                      -121.8875651,
                      37.3299517
                    ],
                    [
                      -121.8875605,
                      37.329948
                    ],
                    [
                      -121.887554578163886,
                      37.329943182755073
                    ],
                    [
                      -121.8874491,
                      37.3298578
                    ],
                    [
                      -121.887171,
                      37.3296325
                    ],
                    [
                      -121.8870567,
                      37.32954
                    ],
                    [
                      -121.8870924,
                      37.3295107
                    ],
                    [
                      -121.8869393,
                      37.3293867
                    ],
                    [
                      -121.8873186,
                      37.3291071
                    ],
                    [
                      -121.8877757,
                      37.328768
                    ],
                    [
                      -121.8879295,
                      37.3286539
                    ],
                    [
                      -121.8880906,
                      37.3285348
                    ],
                    [
                      -121.8880921,
                      37.3285367
                    ],
                    [
                      -121.8881734,
                      37.3286454
                    ],
                    [
                      -121.8882612,
                      37.3286045
                    ],
                    [
                      -121.8883222,
                      37.3286852
                    ],
                    [
                      -121.8891129,
                      37.3283067
                    ],
                    [
                      -121.8889445,
                      37.3280843
                    ],
                    [
                      -121.8892979,
                      37.3279151
                    ],
                    [
                      -121.889263,
                      37.3278691
                    ],
                    [
                      -121.8893583,
                      37.3278234
                    ],
                    [
                      -121.8893932,
                      37.3278695
                    ],
                    [
                      -121.8897029,
                      37.3277213
                    ],
                    [
                      -121.8899421,
                      37.3280383
                    ],
                    [
                      -121.8899801,
                      37.3280887
                    ],
                    [
                      -121.8899925,
                      37.3281051
                    ],
                    [
                      -121.8900849,
                      37.3282276
                    ],
                    [
                      -121.8903431,
                      37.3285698
                    ],
                    [
                      -121.8902989,
                      37.3285909
                    ],
                    [
                      -121.8905014,
                      37.3288582
                    ],
                    [
                      -121.8905398,
                      37.3289089
                    ],
                    [
                      -121.890400109904689,
                      37.328975764513494
                    ],
                    [
                      -121.8903448,
                      37.3290023
                    ],
                    [
                      -121.890332760539977,
                      37.329007999840975
                    ],
                    [
                      -121.890298675443432,
                      37.329024308769618
                    ],
                    [
                      -121.8902893,
                      37.3290288
                    ],
                    [
                      -121.890278973022248,
                      37.329033737084139
                    ],
                    [
                      -121.890095,
                      37.3291218
                    ],
                    [
                      -121.8900648,
                      37.3291363
                    ],
                    [
                      -121.8897741,
                      37.3292754
                    ],
                    [
                      -121.8898407,
                      37.3293601
                    ],
                    [
                      -121.8898523,
                      37.3293547
                    ],
                    [
                      -121.889865,
                      37.3293486
                    ],
                    [
                      -121.8899233,
                      37.3294254
                    ],
                    [
                      -121.8899721,
                      37.3294899
                    ],
                    [
                      -121.8901227,
                      37.3296888
                    ],
                    [
                      -121.8901252,
                      37.3296922
                    ],
                    [
                      -121.8901189,
                      37.3296962
                    ],
                    [
                      -121.8901776,
                      37.3297732
                    ],
                    [
                      -121.890063,
                      37.3298278
                    ],
                    [
                      -121.8900709,
                      37.3298385
                    ],
                    [
                      -121.8900275,
                      37.3298593
                    ],
                    [
                      -121.8896217,
                      37.330054
                    ],
                    [
                      -121.889548,
                      37.3300894
                    ],
                    [
                      -121.8895457,
                      37.3300864
                    ],
                    [
                      -121.8895169,
                      37.3301073
                    ],
                    [
                      -121.8894605,
                      37.3301343
                    ],
                    [
                      -121.8893555,
                      37.3299955
                    ],
                    [
                      -121.8891152,
                      37.3298057
                    ],
                    [
                      -121.8890925,
                      37.3297763
                    ]
                  ]
              ],
              "type": "Polygon"
          },
          "id": "e69bb23d-8039-465d-93b5-64aaed6ec9ef",
          "properties": {
              "building_ids": [
                  "26f04b4f-9ae2-45e3-99d1-393c66d58eb4"
              ],
              "category": "aerial",
              "name": null
          },
          "type": "Feature"
      },
      {
          "feature_type": "footprint",
          "geometry": {
              "coordinates": [
                  [
                      [
                          -121.8898523,
                          37.3293547
                      ],
                      [
                          -121.8898407,
                          37.3293601
                      ],
                      [
                          -121.8897741,
                          37.3292754
                      ],
                      [
                          -121.8900105,
                          37.3291622
                      ],
                      [
                          -121.890091,
                          37.3291237
                      ],
                      [
                          -121.890095,
                          37.3291218
                      ],
                      [
                          -121.8905398,
                          37.3289089
                      ],
                      [
                          -121.8902989,
                          37.3285909
                      ],
                      [
                          -121.8903431,
                          37.3285698
                      ],
                      [
                          -121.8903065,
                          37.3285214
                      ],
                      [
                          -121.8899806,
                          37.3280894
                      ],
                      [
                          -121.8899421,
                          37.3280383
                      ],
                      [
                          -121.889898,
                          37.3280594
                      ],
                      [
                          -121.8894483,
                          37.3282746
                      ],
                      [
                          -121.8893678,
                          37.3283131
                      ],
                      [
                          -121.8891832,
                          37.3284015
                      ],
                      [
                          -121.8891087,
                          37.3284372
                      ],
                      [
                          -121.8888991,
                          37.3285375
                      ],
                      [
                          -121.8888637,
                          37.3285544
                      ],
                      [
                          -121.8888375,
                          37.3285669
                      ],
                      [
                          -121.8887413,
                          37.328613
                      ],
                      [
                          -121.8882115,
                          37.3288665
                      ],
                      [
                          -121.8881308,
                          37.3289052
                      ],
                      [
                          -121.8879463,
                          37.3289934
                      ],
                      [
                          -121.8878683,
                          37.3290308
                      ],
                      [
                          -121.8877983,
                          37.3289383
                      ],
                      [
                          -121.8877359,
                          37.3289681
                      ],
                      [
                          -121.887435,
                          37.3291121
                      ],
                      [
                          -121.8873588,
                          37.3291602
                      ],
                      [
                          -121.8873186,
                          37.3291071
                      ],
                      [
                          -121.8870799,
                          37.329283
                      ],
                      [
                          -121.8869393,
                          37.3293867
                      ],
                      [
                          -121.8870924,
                          37.3295107
                      ],
                      [
                          -121.8870567,
                          37.32954
                      ],
                      [
                          -121.8874491,
                          37.3298578
                      ],
                      [
                          -121.8875605,
                          37.329948
                      ],
                      [
                          -121.8875651,
                          37.3299517
                      ],
                      [
                          -121.8876516,
                          37.3299102
                      ],
                      [
                          -121.8876704,
                          37.3299012
                      ],
                      [
                          -121.8876825,
                          37.3299172
                      ],
                      [
                          -121.8877822,
                          37.3300489
                      ],
                      [
                          -121.8878824,
                          37.3301812
                      ],
                      [
                          -121.8883325,
                          37.3299674
                      ],
                      [
                          -121.8882947,
                          37.3299175
                      ],
                      [
                          -121.8885529,
                          37.3297939
                      ],
                      [
                          -121.8885638,
                          37.3298083
                      ],
                      [
                          -121.8886866,
                          37.3299706
                      ],
                      [
                          -121.888774,
                          37.3299287
                      ],
                      [
                          -121.8887889,
                          37.3299484
                      ],
                      [
                          -121.8889744,
                          37.3298596
                      ],
                      [
                          -121.8889595,
                          37.3298399
                      ],
                      [
                          -121.8890469,
                          37.3297981
                      ],
                      [
                          -121.889072,
                          37.3297861
                      ],
                      [
                          -121.8890896,
                          37.3297777
                      ],
                      [
                          -121.889102,
                          37.3297717
                      ],
                      [
                          -121.8891171,
                          37.3297645
                      ],
                      [
                          -121.8891236,
                          37.3297614
                      ],
                      [
                          -121.8891473,
                          37.3297928
                      ],
                      [
                          -121.8892804,
                          37.3298834
                      ],
                      [
                          -121.8893022,
                          37.3298982
                      ],
                      [
                          -121.8893961,
                          37.3299621
                      ],
                      [
                          -121.8894509,
                          37.3300344
                      ],
                      [
                          -121.8897682,
                          37.3298825
                      ],
                      [
                          -121.8897906,
                          37.3298718
                      ],
                      [
                          -121.8899857,
                          37.3297783
                      ],
                      [
                          -121.8900127,
                          37.3297654
                      ],
                      [
                          -121.890015,
                          37.3297634
                      ],
                      [
                          -121.8900246,
                          37.3297589
                      ],
                      [
                          -121.8900128,
                          37.3297438
                      ],
                      [
                          -121.8901008,
                          37.3297016
                      ],
                      [
                          -121.8901096,
                          37.3296945
                      ],
                      [
                          -121.8898523,
                          37.3293547
                      ]
                  ]
              ],
              "type": "Polygon"
          },
          "id": "8657dc5b-3f08-407b-9a8d-f5ed626bf9e8",
          "properties": {
              "building_ids": [
                  "26f04b4f-9ae2-45e3-99d1-393c66d58eb4"
              ],
              "category": "subterranean",
              "name": null
          },
          "type": "Feature"
      }
  ],
  "name": "footprint",
  "type": "FeatureCollection"
},
{
  "features": [
      {
          "feature_type": "level",
          "geometry": {
              "coordinates": [
                  [
                      [
                          -121.8898523,
                          37.3293547
                      ],
                      [
                          -121.8898407,
                          37.3293601
                      ],
                      [
                          -121.8897741,
                          37.3292754
                      ],
                      [
                          -121.8900105,
                          37.3291622
                      ],
                      [
                          -121.890091,
                          37.3291237
                      ],
                      [
                          -121.890095,
                          37.3291218
                      ],
                      [
                          -121.8905398,
                          37.3289089
                      ],
                      [
                          -121.8902989,
                          37.3285909
                      ],
                      [
                          -121.8903431,
                          37.3285698
                      ],
                      [
                          -121.8903065,
                          37.3285214
                      ],
                      [
                          -121.8899806,
                          37.3280894
                      ],
                      [
                          -121.8899421,
                          37.3280383
                      ],
                      [
                          -121.889898,
                          37.3280594
                      ],
                      [
                          -121.8894483,
                          37.3282746
                      ],
                      [
                          -121.8893678,
                          37.3283131
                      ],
                      [
                          -121.8891832,
                          37.3284015
                      ],
                      [
                          -121.8891087,
                          37.3284372
                      ],
                      [
                          -121.8888991,
                          37.3285375
                      ],
                      [
                          -121.8888637,
                          37.3285544
                      ],
                      [
                          -121.8888375,
                          37.3285669
                      ],
                      [
                          -121.8887413,
                          37.328613
                      ],
                      [
                          -121.8882115,
                          37.3288665
                      ],
                      [
                          -121.8881308,
                          37.3289052
                      ],
                      [
                          -121.8879463,
                          37.3289934
                      ],
                      [
                          -121.8878683,
                          37.3290308
                      ],
                      [
                          -121.8877983,
                          37.3289383
                      ],
                      [
                          -121.8877359,
                          37.3289681
                      ],
                      [
                          -121.887435,
                          37.3291121
                      ],
                      [
                          -121.8873588,
                          37.3291602
                      ],
                      [
                          -121.8873186,
                          37.3291071
                      ],
                      [
                          -121.8870799,
                          37.329283
                      ],
                      [
                          -121.8869393,
                          37.3293867
                      ],
                      [
                          -121.8870924,
                          37.3295107
                      ],
                      [
                          -121.8870567,
                          37.32954
                      ],
                      [
                          -121.8874491,
                          37.3298578
                      ],
                      [
                          -121.8875605,
                          37.329948
                      ],
                      [
                          -121.8875651,
                          37.3299517
                      ],
                      [
                          -121.8876516,
                          37.3299102
                      ],
                      [
                          -121.8876704,
                          37.3299012
                      ],
                      [
                          -121.8876825,
                          37.3299172
                      ],
                      [
                          -121.8877822,
                          37.3300489
                      ],
                      [
                          -121.8878824,
                          37.3301812
                      ],
                      [
                          -121.8883325,
                          37.3299674
                      ],
                      [
                          -121.8882947,
                          37.3299175
                      ],
                      [
                          -121.8885529,
                          37.3297939
                      ],
                      [
                          -121.8885638,
                          37.3298083
                      ],
                      [
                          -121.8886866,
                          37.3299706
                      ],
                      [
                          -121.888774,
                          37.3299287
                      ],
                      [
                          -121.8887889,
                          37.3299484
                      ],
                      [
                          -121.8889744,
                          37.3298596
                      ],
                      [
                          -121.8889595,
                          37.3298399
                      ],
                      [
                          -121.8890469,
                          37.3297981
                      ],
                      [
                          -121.889072,
                          37.3297861
                      ],
                      [
                          -121.8890896,
                          37.3297777
                      ],
                      [
                          -121.889102,
                          37.3297717
                      ],
                      [
                          -121.8891171,
                          37.3297645
                      ],
                      [
                          -121.8891236,
                          37.3297614
                      ],
                      [
                          -121.8891473,
                          37.3297928
                      ],
                      [
                          -121.8892804,
                          37.3298834
                      ],
                      [
                          -121.8893022,
                          37.3298982
                      ],
                      [
                          -121.8893961,
                          37.3299621
                      ],
                      [
                          -121.8894509,
                          37.3300344
                      ],
                      [
                          -121.8897682,
                          37.3298825
                      ],
                      [
                          -121.8897906,
                          37.3298718
                      ],
                      [
                          -121.8899857,
                          37.3297783
                      ],
                      [
                          -121.8900127,
                          37.3297654
                      ],
                      [
                          -121.890015,
                          37.3297634
                      ],
                      [
                          -121.8900246,
                          37.3297589
                      ],
                      [
                          -121.8900128,
                          37.3297438
                      ],
                      [
                          -121.8901008,
                          37.3297016
                      ],
                      [
                          -121.8901096,
                          37.3296945
                      ],
                      [
                          -121.8898523,
                          37.3293547
                      ]
                  ]
              ],
              "type": "Polygon"
          },
          "id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
          "properties": {
              "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
              "building_ids": [
                  "26f04b4f-9ae2-45e3-99d1-393c66d58eb4"
              ],
              "category": "unspecified",
              "display_point": {
                  "coordinates": [
                      -121.889164,
                      37.32925
                  ],
                  "type": "Point"
              },
              "name": {
                  "en": "Lower Level"
              },
              "ordinal": -1,
              "outdoor": false,
              "restriction": null,
              "short_name": {
                  "en": "LL"
              }
          },
          "type": "Feature"
      },
      {
          "feature_type": "level",
          "geometry": {
              "coordinates": [
                  [
                      [
                          -121.8891473,
                          37.3297928
                      ],
                      [
                          -121.8893961,
                          37.3299621
                      ],
                      [
                          -121.8894513,
                          37.3300349
                      ],
                      [
                          -121.8894531,
                          37.3300373
                      ],
                      [
                          -121.8900242,
                          37.329764
                      ],
                      [
                          -121.8901096,
                          37.3296945
                      ],
                      [
                          -121.8898523,
                          37.3293547
                      ],
                      [
                          -121.8898407,
                          37.3293601
                      ],
                      [
                          -121.8897741,
                          37.3292754
                      ],
                      [
                          -121.8900648,
                          37.3291363
                      ],
                      [
                          -121.890095,
                          37.3291218
                      ],
                      [
                          -121.8902186,
                          37.3290626
                      ],
                      [
                          -121.8902893,
                          37.3290288
                      ],
                      [
                          -121.890306,
                          37.3290208
                      ],
                      [
                          -121.8903241,
                          37.3290121
                      ],
                      [
                          -121.8903448,
                          37.3290023
                      ],
                      [
                          -121.8904115,
                          37.3289703
                      ],
                      [
                          -121.8905398,
                          37.3289089
                      ],
                      [
                          -121.8904671,
                          37.328813
                      ],
                      [
                          -121.8902989,
                          37.3285909
                      ],
                      [
                          -121.8903431,
                          37.3285698
                      ],
                      [
                          -121.8900849,
                          37.3282276
                      ],
                      [
                          -121.8899925,
                          37.3281051
                      ],
                      [
                          -121.8899801,
                          37.3280887
                      ],
                      [
                          -121.8897029,
                          37.3277213
                      ],
                      [
                          -121.8893932,
                          37.3278695
                      ],
                      [
                          -121.8893583,
                          37.3278234
                      ],
                      [
                          -121.889263,
                          37.3278691
                      ],
                      [
                          -121.8892979,
                          37.3279151
                      ],
                      [
                          -121.8889445,
                          37.3280843
                      ],
                      [
                          -121.8891129,
                          37.3283067
                      ],
                      [
                          -121.8883222,
                          37.3286852
                      ],
                      [
                          -121.8882612,
                          37.3286045
                      ],
                      [
                          -121.8881734,
                          37.3286454
                      ],
                      [
                          -121.8880921,
                          37.3285367
                      ],
                      [
                          -121.8880906,
                          37.3285348
                      ],
                      [
                          -121.8879295,
                          37.3286539
                      ],
                      [
                          -121.8879744,
                          37.3287081
                      ],
                      [
                          -121.8877977,
                          37.3287926
                      ],
                      [
                          -121.8878163,
                          37.3288172
                      ],
                      [
                          -121.8876396,
                          37.3289018
                      ],
                      [
                          -121.8876686,
                          37.3289402
                      ],
                      [
                          -121.887409,
                          37.3290644
                      ],
                      [
                          -121.8873186,
                          37.3291071
                      ],
                      [
                          -121.8870803,
                          37.3292828
                      ],
                      [
                          -121.8869393,
                          37.3293867
                      ],
                      [
                          -121.8870924,
                          37.3295107
                      ],
                      [
                          -121.8870567,
                          37.32954
                      ],
                      [
                          -121.887171,
                          37.3296325
                      ],
                      [
                          -121.8874491,
                          37.3298578
                      ],
                      [
                          -121.8875412,
                          37.3299323
                      ],
                      [
                          -121.8875605,
                          37.329948
                      ],
                      [
                          -121.8875651,
                          37.3299517
                      ],
                      [
                          -121.8876704,
                          37.3299012
                      ],
                      [
                          -121.8876825,
                          37.3299172
                      ],
                      [
                          -121.8877675,
                          37.3300294
                      ],
                      [
                          -121.8877788,
                          37.3300444
                      ],
                      [
                          -121.8877818,
                          37.3300483
                      ],
                      [
                          -121.887783,
                          37.3300499
                      ],
                      [
                          -121.8878052,
                          37.3300793
                      ],
                      [
                          -121.8878059,
                          37.3300802
                      ],
                      [
                          -121.8878094,
                          37.3300847
                      ],
                      [
                          -121.8878824,
                          37.3301812
                      ],
                      [
                          -121.8883325,
                          37.3299674
                      ],
                      [
                          -121.8883274,
                          37.3299606
                      ],
                      [
                          -121.8882947,
                          37.3299175
                      ],
                      [
                          -121.8884877,
                          37.3298251
                      ],
                      [
                          -121.8885365,
                          37.3298017
                      ],
                      [
                          -121.8885529,
                          37.3297939
                      ],
                      [
                          -121.8885707,
                          37.3298174
                      ],
                      [
                          -121.8885894,
                          37.3298421
                      ],
                      [
                          -121.8886311,
                          37.3298971
                      ],
                      [
                          -121.8886866,
                          37.3299706
                      ],
                      [
                          -121.888774,
                          37.3299287
                      ],
                      [
                          -121.8887889,
                          37.3299484
                      ],
                      [
                          -121.8887977,
                          37.3299442
                      ],
                      [
                          -121.8889657,
                          37.3298638
                      ],
                      [
                          -121.8889744,
                          37.3298596
                      ],
                      [
                          -121.8889595,
                          37.3298399
                      ],
                      [
                          -121.8890401,
                          37.3298013
                      ],
                      [
                          -121.8890469,
                          37.3297981
                      ],
                      [
                          -121.8890589,
                          37.3297923
                      ],
                      [
                          -121.8891236,
                          37.3297614
                      ],
                      [
                          -121.8891473,
                          37.3297928
                      ]
                  ]
              ],
              "type": "Polygon"
          },
          "id": "e537d463-475b-43c3-a650-184566c68bc9",
          "properties": {
              "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
              "building_ids": [
                  "26f04b4f-9ae2-45e3-99d1-393c66d58eb4"
              ],
              "category": "unspecified",
              "display_point": {
                  "coordinates": [
                      -121.889164,
                      37.32925
                  ],
                  "type": "Point"
              },
              "name": {
                  "en": "Parkway"
              },
              "ordinal": 0,
              "outdoor": false,
              "restriction": null,
              "short_name": {
                  "en": "P"
              }
          },
          "type": "Feature"
      },
      {
          "feature_type": "level",
          "geometry": {
              "coordinates": [
                  [
                      [
                          -121.8898523,
                          37.3293547
                      ],
                      [
                          -121.8898407,
                          37.3293601
                      ],
                      [
                          -121.8897741,
                          37.3292754
                      ],
                      [
                          -121.8897997,
                          37.3292631
                      ],
                      [
                          -121.8900395,
                          37.3291483
                      ],
                      [
                          -121.8900652,
                          37.329136
                      ],
                      [
                          -121.890095,
                          37.3291218
                      ],
                      [
                          -121.8902849,
                          37.3290309
                      ],
                      [
                          -121.8903453,
                          37.329002
                      ],
                      [
                          -121.8905398,
                          37.3289089
                      ],
                      [
                          -121.8905014,
                          37.3288582
                      ],
                      [
                          -121.8902989,
                          37.3285909
                      ],
                      [
                          -121.890251,
                          37.3285277
                      ],
                      [
                          -121.8901725,
                          37.3284239
                      ],
                      [
                          -121.8900958,
                          37.3283226
                      ],
                      [
                          -121.8900162,
                          37.3282175
                      ],
                      [
                          -121.889935,
                          37.3281103
                      ],
                      [
                          -121.889938,
                          37.3281088
                      ],
                      [
                          -121.8899801,
                          37.3280887
                      ],
                      [
                          -121.8899421,
                          37.3280383
                      ],
                      [
                          -121.8897029,
                          37.3277213
                      ],
                      [
                          -121.8893932,
                          37.3278695
                      ],
                      [
                          -121.8893583,
                          37.3278234
                      ],
                      [
                          -121.889263,
                          37.3278691
                      ],
                      [
                          -121.8892979,
                          37.3279151
                      ],
                      [
                          -121.8889445,
                          37.3280843
                      ],
                      [
                          -121.8891129,
                          37.3283067
                      ],
                      [
                          -121.8891566,
                          37.3283656
                      ],
                      [
                          -121.8883704,
                          37.328746
                      ],
                      [
                          -121.8883222,
                          37.3286852
                      ],
                      [
                          -121.8882612,
                          37.3286045
                      ],
                      [
                          -121.8881734,
                          37.3286454
                      ],
                      [
                          -121.8880921,
                          37.3285367
                      ],
                      [
                          -121.8880906,
                          37.3285348
                      ],
                      [
                          -121.8879295,
                          37.3286539
                      ],
                      [
                          -121.8877757,
                          37.328768
                      ],
                      [
                          -121.8873186,
                          37.3291071
                      ],
                      [
                          -121.8869393,
                          37.3293867
                      ],
                      [
                          -121.8870924,
                          37.3295107
                      ],
                      [
                          -121.8871745,
                          37.329577
                      ],
                      [
                          -121.8872125,
                          37.3295592
                      ],
                      [
                          -121.8872139,
                          37.329561
                      ],
                      [
                          -121.8872245,
                          37.329575
                      ],
                      [
                          -121.8872265,
                          37.3295777
                      ],
                      [
                          -121.8872673,
                          37.3296315
                      ],
                      [
                          -121.8872899,
                          37.3296207
                      ],
                      [
                          -121.8873484,
                          37.3296979
                      ],
                      [
                          -121.8873713,
                          37.3296867
                      ],
                      [
                          -121.8873866,
                          37.3297069
                      ],
                      [
                          -121.8874175,
                          37.3297478
                      ],
                      [
                          -121.8874263,
                          37.3297594
                      ],
                      [
                          -121.8874484,
                          37.3297489
                      ],
                      [
                          -121.8874696,
                          37.3297769
                      ],
                      [
                          -121.8874978,
                          37.3298141
                      ],
                      [
                          -121.8875047,
                          37.3298232
                      ],
                      [
                          -121.8874927,
                          37.329829
                      ],
                      [
                          -121.8875201,
                          37.3298512
                      ],
                      [
                          -121.8875616,
                          37.3298848
                      ],
                      [
                          -121.8876147,
                          37.3299279
                      ],
                      [
                          -121.8876704,
                          37.3299012
                      ],
                      [
                          -121.887763,
                          37.329857
                      ],
                      [
                          -121.8878495,
                          37.3298157
                      ],
                      [
                          -121.8878635,
                          37.3298341
                      ],
                      [
                          -121.8878741,
                          37.3298482
                      ],
                      [
                          -121.8878994,
                          37.3298816
                      ],
                      [
                          -121.8879209,
                          37.3299101
                      ],
                      [
                          -121.8879465,
                          37.3299438
                      ],
                      [
                          -121.8879574,
                          37.3299583
                      ],
                      [
                          -121.8879617,
                          37.329964
                      ],
                      [
                          -121.8879848,
                          37.3299944
                      ],
                      [
                          -121.8879772,
                          37.329998
                      ],
                      [
                          -121.8879586,
                          37.330007
                      ],
                      [
                          -121.8879366,
                          37.3300175
                      ],
                      [
                          -121.887813,
                          37.3300766
                      ],
                      [
                          -121.8878058,
                          37.3300801
                      ],
                      [
                          -121.8878453,
                          37.3301322
                      ],
                      [
                          -121.8878824,
                          37.3301812
                      ],
                      [
                          -121.8879927,
                          37.3301288
                      ],
                      [
                          -121.8881346,
                          37.3300614
                      ],
                      [
                          -121.8883325,
                          37.3299674
                      ],
                      [
                          -121.8882947,
                          37.3299175
                      ],
                      [
                          -121.8884108,
                          37.3298619
                      ],
                      [
                          -121.8884341,
                          37.3298508
                      ],
                      [
                          -121.8885529,
                          37.3297939
                      ],
                      [
                          -121.8885638,
                          37.3298083
                      ],
                      [
                          -121.888631,
                          37.3298971
                      ],
                      [
                          -121.8886866,
                          37.3299706
                      ],
                      [
                          -121.888774,
                          37.3299287
                      ],
                      [
                          -121.8887889,
                          37.3299484
                      ],
                      [
                          -121.8889744,
                          37.3298596
                      ],
                      [
                          -121.8889595,
                          37.3298399
                      ],
                      [
                          -121.8890384,
                          37.3298021
                      ],
                      [
                          -121.8890469,
                          37.3297981
                      ],
                      [
                          -121.8890589,
                          37.3297923
                      ],
                      [
                          -121.8890925,
                          37.3297763
                      ],
                      [
                          -121.8890996,
                          37.3297729
                      ],
                      [
                          -121.8891172,
                          37.3297645
                      ],
                      [
                          -121.8891236,
                          37.3297614
                      ],
                      [
                          -121.8891473,
                          37.3297928
                      ],
                      [
                          -121.8893961,
                          37.3299621
                      ],
                      [
                          -121.8894513,
                          37.3300349
                      ],
                      [
                          -121.8894531,
                          37.3300373
                      ],
                      [
                          -121.8894664,
                          37.3300309
                      ],
                      [
                          -121.8894853,
                          37.3300218
                      ],
                      [
                          -121.8894937,
                          37.3300178
                      ],
                      [
                          -121.8895457,
                          37.3300864
                      ],
                      [
                          -121.889548,
                          37.3300894
                      ],
                      [
                          -121.8896217,
                          37.330054
                      ],
                      [
                          -121.8900275,
                          37.3298593
                      ],
                      [
                          -121.8900064,
                          37.3298315
                      ],
                      [
                          -121.8899809,
                          37.329798
                      ],
                      [
                          -121.8899713,
                          37.3297852
                      ],
                      [
                          -121.8900127,
                          37.3297654
                      ],
                      [
                          -121.890015,
                          37.3297634
                      ],
                      [
                          -121.8901189,
                          37.3296962
                      ],
                      [
                          -121.8901252,
                          37.3296922
                      ],
                      [
                          -121.8901227,
                          37.3296888
                      ],
                      [
                          -121.8899721,
                          37.3294899
                      ],
                      [
                          -121.8899233,
                          37.3294254
                      ],
                      [
                          -121.889865,
                          37.3293486
                      ],
                      [
                          -121.8898523,
                          37.3293547
                      ]
                  ]
              ],
              "type": "Polygon"
          },
          "id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
          "properties": {
              "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
              "building_ids": [
                  "26f04b4f-9ae2-45e3-99d1-393c66d58eb4"
              ],
              "category": "unspecified",
              "display_point": {
                  "coordinates": [
                      -121.889164,
                      37.32925
                  ],
                  "type": "Point"
              },
              "name": {
                  "en": "Concourse"
              },
              "ordinal": 1,
              "outdoor": false,
              "restriction": null,
              "short_name": {
                  "en": "C"
              }
          },
          "type": "Feature"
      },
      {
          "feature_type": "level",
          "geometry": {
              "coordinates": [
                  [
                      [
                          [
                              -121.8870567,
                              37.32954
                          ],
                          [
                              -121.887171,
                              37.3296325
                          ],
                          [
                              -121.8874491,
                              37.3298578
                          ],
                          [
                              -121.8875651,
                              37.3299517
                          ],
                          [
                              -121.8876147,
                              37.3299279
                          ],
                          [
                              -121.8875616,
                              37.3298848
                          ],
                          [
                              -121.8875201,
                              37.3298512
                          ],
                          [
                              -121.8874927,
                              37.329829
                          ],
                          [
                              -121.8875047,
                              37.3298232
                          ],
                          [
                              -121.8874978,
                              37.3298141
                          ],
                          [
                              -121.8874696,
                              37.3297769
                          ],
                          [
                              -121.8874484,
                              37.3297489
                          ],
                          [
                              -121.8874263,
                              37.3297594
                          ],
                          [
                              -121.8874175,
                              37.3297478
                          ],
                          [
                              -121.8873866,
                              37.3297069
                          ],
                          [
                              -121.8873713,
                              37.3296867
                          ],
                          [
                              -121.8873484,
                              37.3296979
                          ],
                          [
                              -121.8872899,
                              37.3296207
                          ],
                          [
                              -121.8872673,
                              37.3296315
                          ],
                          [
                              -121.8872265,
                              37.3295777
                          ],
                          [
                              -121.8872245,
                              37.329575
                          ],
                          [
                              -121.8872139,
                              37.329561
                          ],
                          [
                              -121.8872125,
                              37.3295592
                          ],
                          [
                              -121.8871745,
                              37.329577
                          ],
                          [
                              -121.8870924,
                              37.3295107
                          ],
                          [
                              -121.8870567,
                              37.32954
                          ]
                      ]
                  ],
                  [
                      [
                          [
                              -121.8891152,
                              37.3298057
                          ],
                          [
                              -121.8893555,
                              37.3299955
                          ],
                          [
                              -121.8894605,
                              37.3301343
                          ],
                          [
                              -121.8895169,
                              37.3301073
                          ],
                          [
                              -121.8895457,
                              37.3300864
                          ],
                          [
                              -121.8894937,
                              37.3300178
                          ],
                          [
                              -121.8894853,
                              37.3300218
                          ],
                          [
                              -121.8894664,
                              37.3300309
                          ],
                          [
                              -121.8894531,
                              37.3300373
                          ],
                          [
                              -121.8894513,
                              37.3300349
                          ],
                          [
                              -121.8893961,
                              37.3299621
                          ],
                          [
                              -121.8891473,
                              37.3297928
                          ],
                          [
                              -121.8891236,
                              37.3297614
                          ],
                          [
                              -121.8891172,
                              37.3297645
                          ],
                          [
                              -121.8890996,
                              37.3297729
                          ],
                          [
                              -121.8890925,
                              37.3297763
                          ],
                          [
                              -121.8891152,
                              37.3298057
                          ]
                      ]
                  ],
                  [
                      [
                          [
                              -121.8878994,
                              37.3298816
                          ],
                          [
                              -121.8878741,
                              37.3298482
                          ],
                          [
                              -121.8878635,
                              37.3298341
                          ],
                          [
                              -121.8878495,
                              37.3298157
                          ],
                          [
                              -121.887763,
                              37.329857
                          ],
                          [
                              -121.8876704,
                              37.3299012
                          ],
                          [
                              -121.8877822,
                              37.3300489
                          ],
                          [
                              -121.8878058,
                              37.3300801
                          ],
                          [
                              -121.887813,
                              37.3300766
                          ],
                          [
                              -121.8879366,
                              37.3300175
                          ],
                          [
                              -121.8879586,
                              37.330007
                          ],
                          [
                              -121.8879772,
                              37.329998
                          ],
                          [
                              -121.8879848,
                              37.3299944
                          ],
                          [
                              -121.8879617,
                              37.329964
                          ],
                          [
                              -121.8879574,
                              37.3299583
                          ],
                          [
                              -121.8879465,
                              37.3299438
                          ],
                          [
                              -121.8879209,
                              37.3299101
                          ],
                          [
                              -121.8878994,
                              37.3298816
                          ]
                      ]
                  ],
                  [
                      [
                          [
                              -121.890015,
                              37.3297634
                          ],
                          [
                              -121.8900127,
                              37.3297654
                          ],
                          [
                              -121.8899713,
                              37.3297852
                          ],
                          [
                              -121.8899809,
                              37.329798
                          ],
                          [
                              -121.8900064,
                              37.3298315
                          ],
                          [
                              -121.8900275,
                              37.3298593
                          ],
                          [
                              -121.8900709,
                              37.3298385
                          ],
                          [
                              -121.890063,
                              37.3298278
                          ],
                          [
                              -121.8901776,
                              37.3297732
                          ],
                          [
                              -121.8901189,
                              37.3296962
                          ],
                          [
                              -121.890015,
                              37.3297634
                          ]
                      ]
                  ]
              ],
              "type": "MultiPolygon"
          },
          "id": "5a36be2d-4e7b-42b4-b30a-3a13ad399502",
          "properties": {
              "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
              "building_ids": [
                  "26f04b4f-9ae2-45e3-99d1-393c66d58eb4"
              ],
              "category": "unspecified",
              "display_point": {
                  "coordinates": [
                      -121.887831,
                      37.329959
                  ],
                  "type": "Point"
              },
              "name": {
                  "en": "Concourse Outdoor"
              },
              "ordinal": 1,
              "outdoor": true,
              "restriction": null,
              "short_name": {
                  "en": "C Outdoor"
              }
          },
          "type": "Feature"
      }
  ],
  "name": "level",
  "type": "FeatureCollection"
},
{
  "type": "FeatureCollection",
  "name": "unit",
  "features": [
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "6382938a-b59b-4631-b2ea-54ddd13562a3",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.890266,
            37.328848
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8903431,
              37.3285698
            ],
            [
              -121.8903065,
              37.3285214
            ],
            [
              -121.8900826,
              37.3286285
            ],
            [
              -121.890102,
              37.3286541
            ],
            [
              -121.8901318,
              37.3286398
            ],
            [
              -121.890149,
              37.3286626
            ],
            [
              -121.8901535,
              37.3286605
            ],
            [
              -121.8902035,
              37.3287265
            ],
            [
              -121.8902427,
              37.3287784
            ],
            [
              -121.8902086,
              37.3287949
            ],
            [
              -121.8902355,
              37.3288305
            ],
            [
              -121.8900549,
              37.3289169
            ],
            [
              -121.8900562,
              37.3289187
            ],
            [
              -121.8900837,
              37.328955
            ],
            [
              -121.8900931,
              37.3289673
            ],
            [
              -121.8900047,
              37.3290097
            ],
            [
              -121.890091,
              37.3291237
            ],
            [
              -121.890095,
              37.3291218
            ],
            [
              -121.8905398,
              37.3289089
            ],
            [
              -121.8902989,
              37.3285909
            ],
            [
              -121.8903431,
              37.3285698
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4e930925-3206-44d6-bf49-fc550296f8e4",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888801,
            37.329604
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897741,
              37.3292754
            ],
            [
              -121.8900105,
              37.3291622
            ],
            [
              -121.8899242,
              37.3290482
            ],
            [
              -121.8898358,
              37.3290904
            ],
            [
              -121.8898331,
              37.3290868
            ],
            [
              -121.8898003,
              37.3290435
            ],
            [
              -121.8897977,
              37.32904
            ],
            [
              -121.8897014,
              37.329086
            ],
            [
              -121.8897041,
              37.3290896
            ],
            [
              -121.8897369,
              37.3291329
            ],
            [
              -121.8897396,
              37.3291364
            ],
            [
              -121.8896556,
              37.3291766
            ],
            [
              -121.8896461,
              37.3291645
            ],
            [
              -121.8896861,
              37.3291453
            ],
            [
              -121.8896599,
              37.3291107
            ],
            [
              -121.8896573,
              37.3291072
            ],
            [
              -121.8896165,
              37.3291267
            ],
            [
              -121.8895908,
              37.3290927
            ],
            [
              -121.8895527,
              37.3290424
            ],
            [
              -121.8894932,
              37.3290709
            ],
            [
              -121.8895159,
              37.3291008
            ],
            [
              -121.8895313,
              37.3291212
            ],
            [
              -121.8895068,
              37.3291329
            ],
            [
              -121.8894186,
              37.3291752
            ],
            [
              -121.8894159,
              37.3291717
            ],
            [
              -121.8893831,
              37.3291283
            ],
            [
              -121.8893804,
              37.3291248
            ],
            [
              -121.8892921,
              37.3291671
            ],
            [
              -121.8892686,
              37.3291783
            ],
            [
              -121.889214,
              37.3292045
            ],
            [
              -121.8891997,
              37.3292113
            ],
            [
              -121.8891046,
              37.3292568
            ],
            [
              -121.8890805,
              37.3292684
            ],
            [
              -121.8890162,
              37.3292991
            ],
            [
              -121.8890189,
              37.3293026
            ],
            [
              -121.8890517,
              37.329346
            ],
            [
              -121.8890544,
              37.3293495
            ],
            [
              -121.8889724,
              37.3293888
            ],
            [
              -121.8889624,
              37.3293755
            ],
            [
              -121.8889712,
              37.3293713
            ],
            [
              -121.8890279,
              37.3293442
            ],
            [
              -121.8889998,
              37.329307
            ],
            [
              -121.8889342,
              37.3293384
            ],
            [
              -121.8889109,
              37.3293075
            ],
            [
              -121.8888728,
              37.3292572
            ],
            [
              -121.8888133,
              37.3292857
            ],
            [
              -121.8888159,
              37.3292892
            ],
            [
              -121.8888298,
              37.3293075
            ],
            [
              -121.888836,
              37.3293156
            ],
            [
              -121.8888514,
              37.329336
            ],
            [
              -121.888827,
              37.3293477
            ],
            [
              -121.8888044,
              37.3293585
            ],
            [
              -121.8887387,
              37.32939
            ],
            [
              -121.8887005,
              37.3293396
            ],
            [
              -121.8886043,
              37.3293857
            ],
            [
              -121.888607,
              37.3293892
            ],
            [
              -121.8886398,
              37.3294325
            ],
            [
              -121.8886424,
              37.329436
            ],
            [
              -121.8885619,
              37.3294746
            ],
            [
              -121.8885593,
              37.329471
            ],
            [
              -121.8885265,
              37.3294277
            ],
            [
              -121.8885238,
              37.3294242
            ],
            [
              -121.8883393,
              37.3295125
            ],
            [
              -121.8883419,
              37.329516
            ],
            [
              -121.8883747,
              37.3295594
            ],
            [
              -121.8883774,
              37.3295629
            ],
            [
              -121.8882934,
              37.329603
            ],
            [
              -121.8882835,
              37.3295898
            ],
            [
              -121.888348,
              37.329559
            ],
            [
              -121.8883226,
              37.3295253
            ],
            [
              -121.8883199,
              37.3295218
            ],
            [
              -121.8882554,
              37.3295526
            ],
            [
              -121.8881065,
              37.3296239
            ],
            [
              -121.8881292,
              37.3296539
            ],
            [
              -121.8881446,
              37.3296743
            ],
            [
              -121.8881212,
              37.3296855
            ],
            [
              -121.8881057,
              37.3296651
            ],
            [
              -121.888083,
              37.3296351
            ],
            [
              -121.8879247,
              37.3297109
            ],
            [
              -121.8879528,
              37.3297481
            ],
            [
              -121.888014,
              37.3297188
            ],
            [
              -121.888024,
              37.329732
            ],
            [
              -121.8879435,
              37.3297706
            ],
            [
              -121.8879053,
              37.3297202
            ],
            [
              -121.8876323,
              37.3298508
            ],
            [
              -121.8876704,
              37.3299012
            ],
            [
              -121.8876825,
              37.3299172
            ],
            [
              -121.8877822,
              37.3300489
            ],
            [
              -121.8878824,
              37.3301812
            ],
            [
              -121.8883325,
              37.3299674
            ],
            [
              -121.8882947,
              37.3299175
            ],
            [
              -121.8885529,
              37.3297939
            ],
            [
              -121.8885638,
              37.3298083
            ],
            [
              -121.8886866,
              37.3299706
            ],
            [
              -121.888774,
              37.3299287
            ],
            [
              -121.8887889,
              37.3299484
            ],
            [
              -121.8889744,
              37.3298596
            ],
            [
              -121.8889595,
              37.3298399
            ],
            [
              -121.8890469,
              37.3297981
            ],
            [
              -121.889072,
              37.3297861
            ],
            [
              -121.8890431,
              37.3297478
            ],
            [
              -121.8890606,
              37.3297395
            ],
            [
              -121.8889974,
              37.3296559
            ],
            [
              -121.8890107,
              37.3296495
            ],
            [
              -121.889024,
              37.3296431
            ],
            [
              -121.8890456,
              37.3296716
            ],
            [
              -121.8890567,
              37.329637
            ],
            [
              -121.8890399,
              37.3296337
            ],
            [
              -121.8890564,
              37.3295807
            ],
            [
              -121.8890734,
              37.3295839
            ],
            [
              -121.8890974,
              37.3295724
            ],
            [
              -121.8890758,
              37.329544
            ],
            [
              -121.8890862,
              37.3295391
            ],
            [
              -121.8890737,
              37.3295226
            ],
            [
              -121.8890565,
              37.3294999
            ],
            [
              -121.889023,
              37.3294556
            ],
            [
              -121.8891615,
              37.3293891
            ],
            [
              -121.889199,
              37.3294384
            ],
            [
              -121.8892296,
              37.3294788
            ],
            [
              -121.8892634,
              37.3294626
            ],
            [
              -121.8893517,
              37.3294203
            ],
            [
              -121.8893627,
              37.3294348
            ],
            [
              -121.8893699,
              37.3294314
            ],
            [
              -121.8893758,
              37.3294286
            ],
            [
              -121.8894117,
              37.3294114
            ],
            [
              -121.8894233,
              37.3294268
            ],
            [
              -121.8894456,
              37.3294161
            ],
            [
              -121.889423,
              37.3293863
            ],
            [
              -121.8896184,
              37.3292928
            ],
            [
              -121.8896733,
              37.3293653
            ],
            [
              -121.8897353,
              37.3294473
            ],
            [
              -121.8897973,
              37.3295293
            ],
            [
              -121.8898593,
              37.3296113
            ],
            [
              -121.8899212,
              37.3296932
            ],
            [
              -121.8899811,
              37.3297723
            ],
            [
              -121.8899857,
              37.3297783
            ],
            [
              -121.8900127,
              37.3297654
            ],
            [
              -121.890015,
              37.3297634
            ],
            [
              -121.8900246,
              37.3297589
            ],
            [
              -121.8900128,
              37.3297438
            ],
            [
              -121.8901008,
              37.3297016
            ],
            [
              -121.8901096,
              37.3296945
            ],
            [
              -121.8898523,
              37.3293547
            ],
            [
              -121.8898407,
              37.3293601
            ],
            [
              -121.8897741,
              37.3292754
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ef01472e-429c-4ddf-a024-2784e0bcc92f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.889396,
            37.32972
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891473,
              37.3297928
            ],
            [
              -121.8892804,
              37.3298834
            ],
            [
              -121.8893022,
              37.3298982
            ],
            [
              -121.8893961,
              37.3299621
            ],
            [
              -121.8894509,
              37.3300344
            ],
            [
              -121.8897682,
              37.3298825
            ],
            [
              -121.8897645,
              37.3298776
            ],
            [
              -121.8897318,
              37.3298339
            ],
            [
              -121.8897539,
              37.3298234
            ],
            [
              -121.8897513,
              37.3298199
            ],
            [
              -121.8897406,
              37.3298058
            ],
            [
              -121.889738,
              37.3298023
            ],
            [
              -121.8897156,
              37.329813
            ],
            [
              -121.8896818,
              37.3297683
            ],
            [
              -121.8897041,
              37.3297576
            ],
            [
              -121.8897006,
              37.3297529
            ],
            [
              -121.8896864,
              37.3297342
            ],
            [
              -121.8896829,
              37.3297295
            ],
            [
              -121.8896605,
              37.3297402
            ],
            [
              -121.8896335,
              37.3297045
            ],
            [
              -121.8896558,
              37.3296938
            ],
            [
              -121.8896532,
              37.3296903
            ],
            [
              -121.8896425,
              37.3296762
            ],
            [
              -121.8896399,
              37.3296727
            ],
            [
              -121.8896175,
              37.3296834
            ],
            [
              -121.8895422,
              37.3295839
            ],
            [
              -121.8895645,
              37.3295732
            ],
            [
              -121.8895619,
              37.3295697
            ],
            [
              -121.8895513,
              37.3295556
            ],
            [
              -121.8895486,
              37.3295521
            ],
            [
              -121.8895262,
              37.3295628
            ],
            [
              -121.8894974,
              37.3295248
            ],
            [
              -121.8895198,
              37.3295141
            ],
            [
              -121.8895162,
              37.3295094
            ],
            [
              -121.8895021,
              37.3294906
            ],
            [
              -121.8894985,
              37.329486
            ],
            [
              -121.8894762,
              37.3294967
            ],
            [
              -121.8894576,
              37.3294721
            ],
            [
              -121.889454,
              37.3294674
            ],
            [
              -121.8894392,
              37.3294479
            ],
            [
              -121.8894616,
              37.3294372
            ],
            [
              -121.8894589,
              37.3294337
            ],
            [
              -121.8894483,
              37.3294196
            ],
            [
              -121.8894456,
              37.3294161
            ],
            [
              -121.8894233,
              37.3294268
            ],
            [
              -121.8894117,
              37.3294114
            ],
            [
              -121.8893758,
              37.3294286
            ],
            [
              -121.8893699,
              37.3294314
            ],
            [
              -121.8893627,
              37.3294348
            ],
            [
              -121.8893517,
              37.3294203
            ],
            [
              -121.8892634,
              37.3294626
            ],
            [
              -121.8892296,
              37.3294788
            ],
            [
              -121.889199,
              37.3294384
            ],
            [
              -121.8891935,
              37.329441
            ],
            [
              -121.8891847,
              37.3294453
            ],
            [
              -121.8891727,
              37.329451
            ],
            [
              -121.8891812,
              37.3294623
            ],
            [
              -121.8891901,
              37.329474
            ],
            [
              -121.8891986,
              37.3294853
            ],
            [
              -121.8891278,
              37.3295192
            ],
            [
              -121.8891492,
              37.3295476
            ],
            [
              -121.8891301,
              37.3295567
            ],
            [
              -121.8891196,
              37.3295618
            ],
            [
              -121.8891111,
              37.3295658
            ],
            [
              -121.8890974,
              37.3295724
            ],
            [
              -121.8890734,
              37.3295839
            ],
            [
              -121.8891166,
              37.3295921
            ],
            [
              -121.8891005,
              37.3296456
            ],
            [
              -121.8890567,
              37.329637
            ],
            [
              -121.8890456,
              37.3296716
            ],
            [
              -121.8890787,
              37.3297152
            ],
            [
              -121.8890874,
              37.3297267
            ],
            [
              -121.8890739,
              37.3297331
            ],
            [
              -121.8890606,
              37.3297395
            ],
            [
              -121.8890431,
              37.3297478
            ],
            [
              -121.889072,
              37.3297861
            ],
            [
              -121.8890896,
              37.3297777
            ],
            [
              -121.889102,
              37.3297717
            ],
            [
              -121.8891171,
              37.3297645
            ],
            [
              -121.8891236,
              37.3297614
            ],
            [
              -121.8891473,
              37.3297928
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4bc098b9-8584-4d29-ab56-d78852ccfb3f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887316,
            37.329672
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8870567,
              37.32954
            ],
            [
              -121.8874491,
              37.3298578
            ],
            [
              -121.8875605,
              37.329948
            ],
            [
              -121.8875651,
              37.3299517
            ],
            [
              -121.8876516,
              37.3299102
            ],
            [
              -121.8876135,
              37.3298599
            ],
            [
              -121.8875622,
              37.3298844
            ],
            [
              -121.8875199,
              37.3298501
            ],
            [
              -121.8872044,
              37.3294333
            ],
            [
              -121.8872017,
              37.3294297
            ],
            [
              -121.8870924,
              37.3295107
            ],
            [
              -121.8870567,
              37.32954
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ad360167-3bf2-4273-842c-b7ca0ec5535e",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "parking",
        "display_point": {
          "coordinates": [
            -121.888769,
            37.329005
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.887435,
              37.3291121
            ],
            [
              -121.8873588,
              37.3291602
            ],
            [
              -121.8871777,
              37.3292943
            ],
            [
              -121.8870799,
              37.329283
            ],
            [
              -121.8869393,
              37.3293867
            ],
            [
              -121.8870924,
              37.3295107
            ],
            [
              -121.8872017,
              37.3294297
            ],
            [
              -121.8874331,
              37.3292584
            ],
            [
              -121.8874533,
              37.3292433
            ],
            [
              -121.8875048,
              37.3292047
            ],
            [
              -121.8875927,
              37.3291625
            ],
            [
              -121.8876892,
              37.3291165
            ],
            [
              -121.8877272,
              37.3291669
            ],
            [
              -121.8876309,
              37.329213
            ],
            [
              -121.8876246,
              37.329216
            ],
            [
              -121.8876152,
              37.3292205
            ],
            [
              -121.8875427,
              37.3292552
            ],
            [
              -121.8875412,
              37.3292559
            ],
            [
              -121.8875324,
              37.3292601
            ],
            [
              -121.8872044,
              37.3294333
            ],
            [
              -121.8875199,
              37.3298501
            ],
            [
              -121.8875622,
              37.3298844
            ],
            [
              -121.8876135,
              37.3298599
            ],
            [
              -121.8876164,
              37.3298584
            ],
            [
              -121.8876253,
              37.3298542
            ],
            [
              -121.8876323,
              37.3298508
            ],
            [
              -121.8879053,
              37.3297202
            ],
            [
              -121.8879134,
              37.3297163
            ],
            [
              -121.8879247,
              37.3297109
            ],
            [
              -121.888083,
              37.3296351
            ],
            [
              -121.8881065,
              37.3296239
            ],
            [
              -121.8882554,
              37.3295526
            ],
            [
              -121.8883199,
              37.3295218
            ],
            [
              -121.8883233,
              37.3295201
            ],
            [
              -121.8883326,
              37.3295157
            ],
            [
              -121.8883393,
              37.3295125
            ],
            [
              -121.8885238,
              37.3294242
            ],
            [
              -121.8885598,
              37.329407
            ],
            [
              -121.8885688,
              37.3294027
            ],
            [
              -121.8886043,
              37.3293857
            ],
            [
              -121.8887005,
              37.3293396
            ],
            [
              -121.8887076,
              37.3293362
            ],
            [
              -121.8887164,
              37.329332
            ],
            [
              -121.8887199,
              37.3293304
            ],
            [
              -121.8887889,
              37.3292973
            ],
            [
              -121.8888133,
              37.3292857
            ],
            [
              -121.8888728,
              37.3292572
            ],
            [
              -121.8889109,
              37.3293075
            ],
            [
              -121.8889342,
              37.3293384
            ],
            [
              -121.8889998,
              37.329307
            ],
            [
              -121.8890033,
              37.3293053
            ],
            [
              -121.8890121,
              37.3293011
            ],
            [
              -121.8890162,
              37.3292991
            ],
            [
              -121.8890805,
              37.3292684
            ],
            [
              -121.8891046,
              37.3292568
            ],
            [
              -121.8891997,
              37.3292113
            ],
            [
              -121.889214,
              37.3292045
            ],
            [
              -121.8892686,
              37.3291783
            ],
            [
              -121.8892921,
              37.3291671
            ],
            [
              -121.8893804,
              37.3291248
            ],
            [
              -121.8893875,
              37.3291215
            ],
            [
              -121.8893963,
              37.3291172
            ],
            [
              -121.8893986,
              37.3291161
            ],
            [
              -121.8894688,
              37.3290825
            ],
            [
              -121.8894932,
              37.3290709
            ],
            [
              -121.8895527,
              37.3290424
            ],
            [
              -121.8895908,
              37.3290927
            ],
            [
              -121.8896165,
              37.3291267
            ],
            [
              -121.8896573,
              37.3291072
            ],
            [
              -121.8896852,
              37.3290938
            ],
            [
              -121.8896941,
              37.3290896
            ],
            [
              -121.8897014,
              37.329086
            ],
            [
              -121.8897977,
              37.32904
            ],
            [
              -121.8898335,
              37.3290229
            ],
            [
              -121.8898423,
              37.3290186
            ],
            [
              -121.889886,
              37.3289977
            ],
            [
              -121.8899242,
              37.3290482
            ],
            [
              -121.8900105,
              37.3291622
            ],
            [
              -121.890091,
              37.3291237
            ],
            [
              -121.8900047,
              37.3290097
            ],
            [
              -121.8899665,
              37.3289592
            ],
            [
              -121.8899814,
              37.3289521
            ],
            [
              -121.8899902,
              37.3289478
            ],
            [
              -121.8899925,
              37.3289467
            ],
            [
              -121.8900182,
              37.3289345
            ],
            [
              -121.890027,
              37.3289302
            ],
            [
              -121.8900549,
              37.3289169
            ],
            [
              -121.8902355,
              37.3288305
            ],
            [
              -121.8902086,
              37.3287949
            ],
            [
              -121.8901693,
              37.328743
            ],
            [
              -121.8901387,
              37.3287026
            ],
            [
              -121.8901281,
              37.3286886
            ],
            [
              -121.8901192,
              37.3286769
            ],
            [
              -121.890102,
              37.3286541
            ],
            [
              -121.8900826,
              37.3286285
            ],
            [
              -121.8903065,
              37.3285214
            ],
            [
              -121.8899806,
              37.3280894
            ],
            [
              -121.8894869,
              37.3283255
            ],
            [
              -121.8894796,
              37.328329
            ],
            [
              -121.8894704,
              37.3283334
            ],
            [
              -121.8889375,
              37.3285882
            ],
            [
              -121.8889021,
              37.3286051
            ],
            [
              -121.8888759,
              37.3286176
            ],
            [
              -121.8888612,
              37.3286246
            ],
            [
              -121.888852,
              37.328629
            ],
            [
              -121.8887796,
              37.3286636
            ],
            [
              -121.8882497,
              37.328917
            ],
            [
              -121.8882471,
              37.3289182
            ],
            [
              -121.8882355,
              37.3289238
            ],
            [
              -121.888232,
              37.3289255
            ],
            [
              -121.8881689,
              37.3289556
            ],
            [
              -121.8879064,
              37.3290811
            ],
            [
              -121.8878683,
              37.3290308
            ],
            [
              -121.8877983,
              37.3289383
            ],
            [
              -121.8877359,
              37.3289681
            ],
            [
              -121.887435,
              37.3291121
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "388903cd-d5da-430c-8069-f5911debb6a7",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889715,
            37.328182
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889898,
              37.3280594
            ],
            [
              -121.8894483,
              37.3282746
            ],
            [
              -121.8894869,
              37.3283255
            ],
            [
              -121.8899806,
              37.3280894
            ],
            [
              -121.8899421,
              37.3280383
            ],
            [
              -121.889898,
              37.3280594
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "de2c1f28-217d-4b71-99b6-9270383f0055",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887232,
            37.329211
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8873588,
              37.3291602
            ],
            [
              -121.8873186,
              37.3291071
            ],
            [
              -121.8870799,
              37.329283
            ],
            [
              -121.8871777,
              37.3292943
            ],
            [
              -121.8873588,
              37.3291602
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "c61efb19-969f-443e-b141-cc00780bc93b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.88741,
            37.329302
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": {
          "en": "LL314"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8872044,
              37.3294333
            ],
            [
              -121.8875324,
              37.3292601
            ],
            [
              -121.8875412,
              37.3292559
            ],
            [
              -121.8875427,
              37.3292552
            ],
            [
              -121.8875147,
              37.3292179
            ],
            [
              -121.8875048,
              37.3292047
            ],
            [
              -121.8874533,
              37.3292433
            ],
            [
              -121.8874331,
              37.3292584
            ],
            [
              -121.8872017,
              37.3294297
            ],
            [
              -121.8872044,
              37.3294333
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "27fda7b2-612a-4412-8ec7-91bdf52b5884",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888044,
            37.328982
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879064,
              37.3290811
            ],
            [
              -121.8881689,
              37.3289556
            ],
            [
              -121.888232,
              37.3289255
            ],
            [
              -121.8882224,
              37.3289128
            ],
            [
              -121.8882036,
              37.328888
            ],
            [
              -121.8881406,
              37.3289182
            ],
            [
              -121.8881308,
              37.3289052
            ],
            [
              -121.8879463,
              37.3289934
            ],
            [
              -121.8878683,
              37.3290308
            ],
            [
              -121.8879064,
              37.3290811
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ddaca3f3-abd8-41f7-9359-d0e93858e378",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.88891,
            37.328584
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8889375,
              37.3285882
            ],
            [
              -121.8889182,
              37.3285627
            ],
            [
              -121.888899728587177,
              37.328571575259808
            ],
            [
              -121.8888828,
              37.3285796
            ],
            [
              -121.8888892,
              37.3285882
            ],
            [
              -121.888895,
              37.3285958
            ],
            [
              -121.8889021,
              37.3286051
            ],
            [
              -121.8889375,
              37.3285882
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a2bf457a-5379-4d46-836f-1ff0f0e7074e",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.888891,
            37.328559
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8889182,
              37.3285627
            ],
            [
              -121.8888991,
              37.3285375
            ],
            [
              -121.8888637,
              37.3285544
            ],
            [
              -121.8888696,
              37.3285622
            ],
            [
              -121.8888754,
              37.3285698
            ],
            [
              -121.8888828,
              37.3285796
            ],
            [
              -121.888899728587177,
              37.328571575259808
            ],
            [
              -121.8889182,
              37.3285627
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "c63768f4-5419-400d-b830-4cf321bd65f2",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.88887,
            37.328586
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888892,
              37.3285882
            ],
            [
              -121.8888828,
              37.3285796
            ],
            [
              -121.8888754,
              37.3285698
            ],
            [
              -121.8888696,
              37.3285622
            ],
            [
              -121.8888637,
              37.3285544
            ],
            [
              -121.8888375,
              37.3285669
            ],
            [
              -121.8888759,
              37.3286176
            ],
            [
              -121.8889021,
              37.3286051
            ],
            [
              -121.888895,
              37.3285958
            ],
            [
              -121.8888892,
              37.3285882
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "05c08016-4bea-4dcc-b4a0-a2cf72b1b993",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888835,
            37.328583
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888375,
              37.3285669
            ],
            [
              -121.8887413,
              37.328613
            ],
            [
              -121.8887509,
              37.3286257
            ],
            [
              -121.8888229,
              37.3285909
            ],
            [
              -121.888852,
              37.328629
            ],
            [
              -121.8888612,
              37.3286246
            ],
            [
              -121.8888759,
              37.3286176
            ],
            [
              -121.8888375,
              37.3285669
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b8d65dfe-09cb-41d2-965f-b83d526fad6a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888524,
            37.328752
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.888852,
              37.328629
            ],
            [
              -121.8888229,
              37.3285909
            ],
            [
              -121.8887509,
              37.3286257
            ],
            [
              -121.8887413,
              37.328613
            ],
            [
              -121.8882115,
              37.3288665
            ],
            [
              -121.8882497,
              37.328917
            ],
            [
              -121.8887796,
              37.3286636
            ],
            [
              -121.888852,
              37.328629
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "6fa94a0d-1beb-462f-92c6-56f69a765cac",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889178,
            37.328439
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8893773,
              37.3283256
            ],
            [
              -121.8893678,
              37.3283131
            ],
            [
              -121.8891832,
              37.3284015
            ],
            [
              -121.8891087,
              37.3284372
            ],
            [
              -121.8888991,
              37.3285375
            ],
            [
              -121.8889182,
              37.3285627
            ],
            [
              -121.8889375,
              37.3285882
            ],
            [
              -121.8894704,
              37.3283334
            ],
            [
              -121.8894413,
              37.3282949
            ],
            [
              -121.8893773,
              37.3283256
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "6ed93c81-3f17-45e7-8789-cc442d555d33",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889445,
            37.328288
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8893678,
              37.3283131
            ],
            [
              -121.8893773,
              37.3283256
            ],
            [
              -121.8894413,
              37.3282949
            ],
            [
              -121.8894704,
              37.3283334
            ],
            [
              -121.8894796,
              37.328329
            ],
            [
              -121.8894869,
              37.3283255
            ],
            [
              -121.8894483,
              37.3282746
            ],
            [
              -121.8893678,
              37.3283131
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3ee35e57-d894-4a16-b698-67aa933773df",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.890161,
            37.328702
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8901387,
              37.3287026
            ],
            [
              -121.8901693,
              37.328743
            ],
            [
              -121.89019,
              37.3287329
            ],
            [
              -121.8901988,
              37.3287287
            ],
            [
              -121.8902035,
              37.3287265
            ],
            [
              -121.8901535,
              37.3286605
            ],
            [
              -121.890149,
              37.3286626
            ],
            [
              -121.8901409,
              37.3286665
            ],
            [
              -121.8901254,
              37.3286739
            ],
            [
              -121.8901192,
              37.3286769
            ],
            [
              -121.8901281,
              37.3286886
            ],
            [
              -121.8901387,
              37.3287026
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3ba1e121-6ef7-4136-974b-2eb376fc7dd3",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.890038,
            37.328951
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": {
          "en": "LL205"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8900182,
              37.3289345
            ],
            [
              -121.8899925,
              37.3289467
            ],
            [
              -121.8899952,
              37.3289503
            ],
            [
              -121.8900214,
              37.3289849
            ],
            [
              -121.8900837,
              37.328955
            ],
            [
              -121.8900562,
              37.3289187
            ],
            [
              -121.8900549,
              37.3289169
            ],
            [
              -121.890027,
              37.3289302
            ],
            [
              -121.8900182,
              37.3289345
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "1552c810-1fde-4e2f-89ee-db96798f3ff7",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889991,
            37.328966
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8899814,
              37.3289521
            ],
            [
              -121.8899665,
              37.3289592
            ],
            [
              -121.8900047,
              37.3290097
            ],
            [
              -121.8900931,
              37.3289673
            ],
            [
              -121.8900837,
              37.328955
            ],
            [
              -121.8900214,
              37.3289849
            ],
            [
              -121.8899952,
              37.3289503
            ],
            [
              -121.8899925,
              37.3289467
            ],
            [
              -121.8899902,
              37.3289478
            ],
            [
              -121.8899814,
              37.3289521
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "2981b8e9-2cbf-4bd3-af91-b3144823fe01",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889861,
            37.329044
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": {
          "en": "LL206E"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8898423,
              37.3290186
            ],
            [
              -121.8898335,
              37.3290229
            ],
            [
              -121.8897977,
              37.32904
            ],
            [
              -121.8898003,
              37.3290435
            ],
            [
              -121.8898331,
              37.3290868
            ],
            [
              -121.8898358,
              37.3290904
            ],
            [
              -121.8899242,
              37.3290482
            ],
            [
              -121.889886,
              37.3289977
            ],
            [
              -121.8898423,
              37.3290186
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "991929e7-4aac-40e5-9e01-46ee67542e02",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889693,
            37.329129
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8896852,
              37.3290938
            ],
            [
              -121.8896573,
              37.3291072
            ],
            [
              -121.8896599,
              37.3291107
            ],
            [
              -121.8896861,
              37.3291453
            ],
            [
              -121.8896461,
              37.3291645
            ],
            [
              -121.8896556,
              37.3291766
            ],
            [
              -121.8897396,
              37.3291364
            ],
            [
              -121.8897369,
              37.3291329
            ],
            [
              -121.8897041,
              37.3290896
            ],
            [
              -121.8897014,
              37.329086
            ],
            [
              -121.8896941,
              37.3290896
            ],
            [
              -121.8896852,
              37.3290938
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "43ec0a85-bdad-41d9-9b4f-99073b978386",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.889128,
            37.329493
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891986,
              37.3294853
            ],
            [
              -121.8891901,
              37.329474
            ],
            [
              -121.8891812,
              37.3294623
            ],
            [
              -121.8891727,
              37.329451
            ],
            [
              -121.889169,
              37.3294461
            ],
            [
              -121.889113031436722,
              37.32947381211784
            ],
            [
              -121.8890565,
              37.3294999
            ],
            [
              -121.8890737,
              37.3295226
            ],
            [
              -121.8890862,
              37.3295391
            ],
            [
              -121.8891278,
              37.3295192
            ],
            [
              -121.8891986,
              37.3294853
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b852c807-02d5-425a-8a99-030883f61cc2",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.889113,
            37.329546
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890974,
              37.3295724
            ],
            [
              -121.8891111,
              37.3295658
            ],
            [
              -121.8891196,
              37.3295618
            ],
            [
              -121.8891301,
              37.3295567
            ],
            [
              -121.8891492,
              37.3295476
            ],
            [
              -121.8891278,
              37.3295192
            ],
            [
              -121.8890862,
              37.3295391
            ],
            [
              -121.8890758,
              37.329544
            ],
            [
              -121.8890974,
              37.3295724
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "80eb851b-47c6-432f-a6fa-27b006b4b14d",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.889111,
            37.329444
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891847,
              37.3294453
            ],
            [
              -121.8891935,
              37.329441
            ],
            [
              -121.889199,
              37.3294384
            ],
            [
              -121.8891615,
              37.3293891
            ],
            [
              -121.889023,
              37.3294556
            ],
            [
              -121.8890565,
              37.3294999
            ],
            [
              -121.889113031436722,
              37.32947381211784
            ],
            [
              -121.889169,
              37.3294461
            ],
            [
              -121.8891727,
              37.329451
            ],
            [
              -121.8891847,
              37.3294453
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "beb5d00f-cb2d-4ea3-b6ca-26c4ec26c49e",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.889492,
            37.329092
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8894932,
              37.3290709
            ],
            [
              -121.8894688,
              37.3290825
            ],
            [
              -121.8894914,
              37.3291126
            ],
            [
              -121.889498,
              37.3291094
            ],
            [
              -121.8895095,
              37.3291039
            ],
            [
              -121.8895159,
              37.3291008
            ],
            [
              -121.8894932,
              37.3290709
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b1b6e7c6-0ebc-415e-85f2-ef10e1c14670",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889448,
            37.329118
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8894688,
              37.3290825
            ],
            [
              -121.8893986,
              37.3291161
            ],
            [
              -121.8894013,
              37.3291197
            ],
            [
              -121.8894272,
              37.329154
            ],
            [
              -121.8894973,
              37.3291204
            ],
            [
              -121.8894914,
              37.3291126
            ],
            [
              -121.8894688,
              37.3290825
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f6fe3646-bf64-4072-a3e6-4ef8e5bbd68c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889423,
            37.329164
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8893875,
              37.3291215
            ],
            [
              -121.8893804,
              37.3291248
            ],
            [
              -121.8893831,
              37.3291283
            ],
            [
              -121.8894159,
              37.3291717
            ],
            [
              -121.8894186,
              37.3291752
            ],
            [
              -121.8895068,
              37.3291329
            ],
            [
              -121.8894973,
              37.3291204
            ],
            [
              -121.8894272,
              37.329154
            ],
            [
              -121.8894013,
              37.3291197
            ],
            [
              -121.8893986,
              37.3291161
            ],
            [
              -121.8893963,
              37.3291172
            ],
            [
              -121.8893875,
              37.3291215
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ad2cbf5d-a9da-4e2f-887b-75f429e24ca8",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889042,
            37.329347
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890033,
              37.3293053
            ],
            [
              -121.8889998,
              37.329307
            ],
            [
              -121.8890279,
              37.3293442
            ],
            [
              -121.8889712,
              37.3293713
            ],
            [
              -121.8889624,
              37.3293755
            ],
            [
              -121.8889724,
              37.3293888
            ],
            [
              -121.8890544,
              37.3293495
            ],
            [
              -121.8890517,
              37.329346
            ],
            [
              -121.8890189,
              37.3293026
            ],
            [
              -121.8890162,
              37.3292991
            ],
            [
              -121.8890121,
              37.3293011
            ],
            [
              -121.8890033,
              37.3293053
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "272c3adb-fb5f-4989-beaf-e2844b1445c8",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889761,
            37.329853
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897645,
              37.3298776
            ],
            [
              -121.8897682,
              37.3298825
            ],
            [
              -121.8897906,
              37.3298718
            ],
            [
              -121.889786,
              37.3298657
            ],
            [
              -121.8897539,
              37.3298234
            ],
            [
              -121.8897318,
              37.3298339
            ],
            [
              -121.8897645,
              37.3298776
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3d1db391-084c-4226-ab3a-33c9f865f876",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889856,
            37.329782
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": {
          "en": "LL21F"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897539,
              37.3298234
            ],
            [
              -121.889786,
              37.3298657
            ],
            [
              -121.8897906,
              37.3298718
            ],
            [
              -121.8899857,
              37.3297783
            ],
            [
              -121.8899811,
              37.3297723
            ],
            [
              -121.8899212,
              37.3296932
            ],
            [
              -121.8897261,
              37.3297866
            ],
            [
              -121.889738,
              37.3298023
            ],
            [
              -121.8897406,
              37.3298058
            ],
            [
              -121.8897513,
              37.3298199
            ],
            [
              -121.8897539,
              37.3298234
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "627f639d-d712-4063-a98c-9012615a5611",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.88971,
            37.329785
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889738,
              37.3298023
            ],
            [
              -121.8897261,
              37.3297866
            ],
            [
              -121.8897041,
              37.3297576
            ],
            [
              -121.8896818,
              37.3297683
            ],
            [
              -121.8897156,
              37.329813
            ],
            [
              -121.889738,
              37.3298023
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "1cadfb36-5641-41ab-9a78-7a899b8541e9",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889793,
            37.329699
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": {
          "en": "LL21E"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897041,
              37.3297576
            ],
            [
              -121.8897261,
              37.3297866
            ],
            [
              -121.8899212,
              37.3296932
            ],
            [
              -121.8898593,
              37.3296113
            ],
            [
              -121.889664,
              37.3297046
            ],
            [
              -121.8896829,
              37.3297295
            ],
            [
              -121.8896864,
              37.3297342
            ],
            [
              -121.8897006,
              37.3297529
            ],
            [
              -121.8897041,
              37.3297576
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "c584f7e8-a387-4b99-855b-af9a0e2e2ffa",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889658,
            37.329717
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8896829,
              37.3297295
            ],
            [
              -121.889664,
              37.3297046
            ],
            [
              -121.8896558,
              37.3296938
            ],
            [
              -121.8896335,
              37.3297045
            ],
            [
              -121.8896605,
              37.3297402
            ],
            [
              -121.8896829,
              37.3297295
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "05f7c2ab-e923-40ec-9ca3-0583755b5e24",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889731,
            37.329617
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": {
          "en": "LL21D"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8896558,
              37.3296938
            ],
            [
              -121.889664,
              37.3297046
            ],
            [
              -121.8898593,
              37.3296113
            ],
            [
              -121.8897973,
              37.3295293
            ],
            [
              -121.889602,
              37.3296227
            ],
            [
              -121.8896399,
              37.3296727
            ],
            [
              -121.8896425,
              37.3296762
            ],
            [
              -121.8896532,
              37.3296903
            ],
            [
              -121.8896558,
              37.3296938
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "20067840-a0cc-4af8-ab27-97789a4c04b7",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889591,
            37.329628
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8896399,
              37.3296727
            ],
            [
              -121.889602,
              37.3296227
            ],
            [
              -121.8895645,
              37.3295732
            ],
            [
              -121.8895422,
              37.3295839
            ],
            [
              -121.8896175,
              37.3296834
            ],
            [
              -121.8896399,
              37.3296727
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "5c03301d-9a19-46db-a6c6-c4050cae303a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889669,
            37.329535
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": {
          "en": "LL21C"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8895645,
              37.3295732
            ],
            [
              -121.889602,
              37.3296227
            ],
            [
              -121.8897973,
              37.3295293
            ],
            [
              -121.8897353,
              37.3294473
            ],
            [
              -121.88954,
              37.3295407
            ],
            [
              -121.8895486,
              37.3295521
            ],
            [
              -121.8895513,
              37.3295556
            ],
            [
              -121.8895619,
              37.3295697
            ],
            [
              -121.8895645,
              37.3295732
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "dacfe014-3dde-492f-90eb-4017f028914d",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889523,
            37.329538
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8895486,
              37.3295521
            ],
            [
              -121.88954,
              37.3295407
            ],
            [
              -121.8895198,
              37.3295141
            ],
            [
              -121.8894974,
              37.3295248
            ],
            [
              -121.8895262,
              37.3295628
            ],
            [
              -121.8895486,
              37.3295521
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "57ecdbd5-bd78-4edb-87e5-678e5675a844",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889607,
            37.329453
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": {
          "en": "LL21B"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8895198,
              37.3295141
            ],
            [
              -121.88954,
              37.3295407
            ],
            [
              -121.8897353,
              37.3294473
            ],
            [
              -121.8896733,
              37.3293653
            ],
            [
              -121.889478,
              37.3294588
            ],
            [
              -121.8894985,
              37.329486
            ],
            [
              -121.8895021,
              37.3294906
            ],
            [
              -121.8895162,
              37.3295094
            ],
            [
              -121.8895198,
              37.3295141
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "700726ca-0c0f-4ee4-a4b4-8eeba8168f3a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889469,
            37.329467
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8894985,
              37.329486
            ],
            [
              -121.889478,
              37.3294588
            ],
            [
              -121.8894616,
              37.3294372
            ],
            [
              -121.8894392,
              37.3294479
            ],
            [
              -121.889454,
              37.3294674
            ],
            [
              -121.8894576,
              37.3294721
            ],
            [
              -121.8894762,
              37.3294967
            ],
            [
              -121.8894985,
              37.329486
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9acd6573-b91a-44e0-9365-72ed6c8c941f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889548,
            37.329376
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": {
          "en": "LL21A"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8894616,
              37.3294372
            ],
            [
              -121.889478,
              37.3294588
            ],
            [
              -121.8896733,
              37.3293653
            ],
            [
              -121.8896184,
              37.3292928
            ],
            [
              -121.889423,
              37.3293863
            ],
            [
              -121.8894456,
              37.3294161
            ],
            [
              -121.8894483,
              37.3294196
            ],
            [
              -121.8894589,
              37.3294337
            ],
            [
              -121.8894616,
              37.3294372
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "d3e4db5a-9cfc-4bae-9802-aa02705b5a76",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.890206,
            37.328761
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902427,
              37.3287784
            ],
            [
              -121.8902035,
              37.3287265
            ],
            [
              -121.8901988,
              37.3287287
            ],
            [
              -121.89019,
              37.3287329
            ],
            [
              -121.8901693,
              37.328743
            ],
            [
              -121.8902086,
              37.3287949
            ],
            [
              -121.8902427,
              37.3287784
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f543fe1c-91d1-40bf-80b3-2ab996191d05",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.889511,
            37.329117
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8895159,
              37.3291008
            ],
            [
              -121.8895095,
              37.3291039
            ],
            [
              -121.889498,
              37.3291094
            ],
            [
              -121.8894914,
              37.3291126
            ],
            [
              -121.8894973,
              37.3291204
            ],
            [
              -121.8895068,
              37.3291329
            ],
            [
              -121.8895313,
              37.3291212
            ],
            [
              -121.8895159,
              37.3291008
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3287cbaa-e439-4e5b-8477-65a6faa821c6",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889078,
            37.329613
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890564,
              37.3295807
            ],
            [
              -121.8890399,
              37.3296337
            ],
            [
              -121.8890567,
              37.329637
            ],
            [
              -121.8891005,
              37.3296456
            ],
            [
              -121.8891166,
              37.3295921
            ],
            [
              -121.8890734,
              37.3295839
            ],
            [
              -121.8890564,
              37.3295807
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "d0ffd55a-9b99-4ebd-ac08-97a3d448c0f7",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.889036,
            37.329695
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890606,
              37.3297395
            ],
            [
              -121.8890739,
              37.3297331
            ],
            [
              -121.889042221229502,
              37.329691626323047
            ],
            [
              -121.8890107,
              37.3296495
            ],
            [
              -121.8889974,
              37.3296559
            ],
            [
              -121.8890606,
              37.3297395
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "40370a65-cfc8-4673-afe5-31482b2a5828",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.889049,
            37.329688
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889024,
              37.3296431
            ],
            [
              -121.8890107,
              37.3296495
            ],
            [
              -121.889042221229502,
              37.329691626323047
            ],
            [
              -121.8890739,
              37.3297331
            ],
            [
              -121.8890874,
              37.3297267
            ],
            [
              -121.8890787,
              37.3297152
            ],
            [
              -121.8890456,
              37.3296716
            ],
            [
              -121.889024,
              37.3296431
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "705dd3d8-1194-4142-ab93-ea66db58e811",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.888812,
            37.329306
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888159,
              37.3292892
            ],
            [
              -121.8888133,
              37.3292857
            ],
            [
              -121.8887889,
              37.3292973
            ],
            [
              -121.8887915,
              37.3293009
            ],
            [
              -121.8888116,
              37.3293273
            ],
            [
              -121.8888181,
              37.3293242
            ],
            [
              -121.8888297,
              37.3293186
            ],
            [
              -121.888836,
              37.3293156
            ],
            [
              -121.8888298,
              37.3293075
            ],
            [
              -121.8888159,
              37.3292892
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "19d3142e-6d5f-48ab-a50c-4cf1454b89a3",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888768,
            37.329332
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8887889,
              37.3292973
            ],
            [
              -121.8887199,
              37.3293304
            ],
            [
              -121.8887225,
              37.3293339
            ],
            [
              -121.888748,
              37.3293675
            ],
            [
              -121.888817,
              37.3293345
            ],
            [
              -121.8888116,
              37.3293273
            ],
            [
              -121.8887915,
              37.3293009
            ],
            [
              -121.8887889,
              37.3292973
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "73f92eec-12d2-4199-bc54-704473713864",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.888831,
            37.329332
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.888836,
              37.3293156
            ],
            [
              -121.8888297,
              37.3293186
            ],
            [
              -121.8888181,
              37.3293242
            ],
            [
              -121.8888116,
              37.3293273
            ],
            [
              -121.888817,
              37.3293345
            ],
            [
              -121.888827,
              37.3293477
            ],
            [
              -121.8888514,
              37.329336
            ],
            [
              -121.888836,
              37.3293156
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "efbd88fb-dc23-4b24-8a79-34e465ac1e2c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888743,
            37.329378
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8887387,
              37.32939
            ],
            [
              -121.8888044,
              37.3293585
            ],
            [
              -121.888827,
              37.3293477
            ],
            [
              -121.888817,
              37.3293345
            ],
            [
              -121.888748,
              37.3293675
            ],
            [
              -121.8887225,
              37.3293339
            ],
            [
              -121.8887199,
              37.3293304
            ],
            [
              -121.8887164,
              37.329332
            ],
            [
              -121.8887076,
              37.3293362
            ],
            [
              -121.8887005,
              37.3293396
            ],
            [
              -121.8887387,
              37.32939
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "19673af6-080b-4c8a-a9ef-bf815769422f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888583,
            37.32943
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": {
          "en": "LL303E"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.888607,
              37.3293892
            ],
            [
              -121.8886043,
              37.3293857
            ],
            [
              -121.8885688,
              37.3294027
            ],
            [
              -121.8885598,
              37.329407
            ],
            [
              -121.8885238,
              37.3294242
            ],
            [
              -121.8885265,
              37.3294277
            ],
            [
              -121.8885593,
              37.329471
            ],
            [
              -121.8885619,
              37.3294746
            ],
            [
              -121.8886424,
              37.329436
            ],
            [
              -121.8886398,
              37.3294325
            ],
            [
              -121.888607,
              37.3293892
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "fd0af99c-8628-4d79-bf9f-5e2ae54ff2ed",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888364,
            37.329561
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8883419,
              37.329516
            ],
            [
              -121.8883393,
              37.3295125
            ],
            [
              -121.8883326,
              37.3295157
            ],
            [
              -121.8883233,
              37.3295201
            ],
            [
              -121.8883199,
              37.3295218
            ],
            [
              -121.8883226,
              37.3295253
            ],
            [
              -121.888348,
              37.329559
            ],
            [
              -121.8882835,
              37.3295898
            ],
            [
              -121.8882934,
              37.329603
            ],
            [
              -121.8883774,
              37.3295629
            ],
            [
              -121.8883747,
              37.3295594
            ],
            [
              -121.8883419,
              37.329516
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "03de7849-d9ac-4119-af42-c5a3e17b3d73",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.888125,
            37.32967
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881446,
              37.3296743
            ],
            [
              -121.8881292,
              37.3296539
            ],
            [
              -121.8881235,
              37.3296566
            ],
            [
              -121.8881119,
              37.3296622
            ],
            [
              -121.8881057,
              37.3296651
            ],
            [
              -121.8881212,
              37.3296855
            ],
            [
              -121.8881446,
              37.3296743
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "040fb617-1cca-4f96-99af-532d97479c8c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.888106,
            37.329645
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881119,
              37.3296622
            ],
            [
              -121.8881235,
              37.3296566
            ],
            [
              -121.8881292,
              37.3296539
            ],
            [
              -121.8881065,
              37.3296239
            ],
            [
              -121.888083,
              37.3296351
            ],
            [
              -121.8881057,
              37.3296651
            ],
            [
              -121.8881119,
              37.3296622
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a22e255f-d2e4-48a4-b3b8-45ab6ce630d2",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887947,
            37.329759
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879528,
              37.3297481
            ],
            [
              -121.8879247,
              37.3297109
            ],
            [
              -121.8879134,
              37.3297163
            ],
            [
              -121.8879053,
              37.3297202
            ],
            [
              -121.8879435,
              37.3297706
            ],
            [
              -121.888024,
              37.329732
            ],
            [
              -121.888014,
              37.3297188
            ],
            [
              -121.8879528,
              37.3297481
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "046c0b99-457e-4d77-a504-3fefd4581e28",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887642,
            37.329881
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8876704,
              37.3299012
            ],
            [
              -121.8876323,
              37.3298508
            ],
            [
              -121.8876253,
              37.3298542
            ],
            [
              -121.8876164,
              37.3298584
            ],
            [
              -121.8876135,
              37.3298599
            ],
            [
              -121.8876516,
              37.3299102
            ],
            [
              -121.8876704,
              37.3299012
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f8692dfe-391b-4812-b590-fa3d8137087e",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.88766,
            37.329165
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8876892,
              37.3291165
            ],
            [
              -121.8875927,
              37.3291625
            ],
            [
              -121.8876309,
              37.329213
            ],
            [
              -121.8877272,
              37.3291669
            ],
            [
              -121.8876892,
              37.3291165
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "fa5e85dd-7a9c-4103-afd5-71936be08dc1",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887589,
            37.329174
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8875927,
              37.3291625
            ],
            [
              -121.8875048,
              37.3292047
            ],
            [
              -121.8875147,
              37.3292179
            ],
            [
              -121.8875859,
              37.3291829
            ],
            [
              -121.8876152,
              37.3292205
            ],
            [
              -121.8876246,
              37.329216
            ],
            [
              -121.8876309,
              37.329213
            ],
            [
              -121.8875927,
              37.3291625
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "cd162b4f-269d-448b-92ea-bbec45ef1c5c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887565,
            37.329219
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8876152,
              37.3292205
            ],
            [
              -121.8875859,
              37.3291829
            ],
            [
              -121.8875147,
              37.3292179
            ],
            [
              -121.8875427,
              37.3292552
            ],
            [
              -121.8876152,
              37.3292205
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a9da15aa-8026-456a-9b58-a9d49d05d26f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888209,
            37.328879
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8882115,
              37.3288665
            ],
            [
              -121.8881308,
              37.3289052
            ],
            [
              -121.8881406,
              37.3289182
            ],
            [
              -121.8882036,
              37.328888
            ],
            [
              -121.8882224,
              37.3289128
            ],
            [
              -121.888232,
              37.3289255
            ],
            [
              -121.8882355,
              37.3289238
            ],
            [
              -121.8882471,
              37.3289182
            ],
            [
              -121.8882497,
              37.328917
            ],
            [
              -121.8882115,
              37.3288665
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7deec287-3853-48d9-9c8b-2ed47e933766",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.890126,
            37.328658
          ],
          "type": "Point"
        },
        "level_id": "1f97ee2d-e09b-4737-8ccd-6eb15c1f5541",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8901318,
              37.3286398
            ],
            [
              -121.890102,
              37.3286541
            ],
            [
              -121.8901192,
              37.3286769
            ],
            [
              -121.8901254,
              37.3286739
            ],
            [
              -121.8901409,
              37.3286665
            ],
            [
              -121.890149,
              37.3286626
            ],
            [
              -121.8901318,
              37.3286398
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "8cb7ae31-e28a-4264-aadf-42056eec3b13",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.890102,
            37.32845
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8903431,
              37.3285698
            ],
            [
              -121.8900849,
              37.3282276
            ],
            [
              -121.8898612,
              37.3283342
            ],
            [
              -121.890103,
              37.3286536
            ],
            [
              -121.8901317,
              37.3286398
            ],
            [
              -121.8901491,
              37.3286627
            ],
            [
              -121.8902989,
              37.3285909
            ],
            [
              -121.8903431,
              37.3285698
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3efa4926-ec02-4dd1-bae4-fc930acd7eeb",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.889571,
            37.329641
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891473,
              37.3297928
            ],
            [
              -121.8893961,
              37.3299621
            ],
            [
              -121.8894513,
              37.3300349
            ],
            [
              -121.8894531,
              37.3300373
            ],
            [
              -121.8900242,
              37.329764
            ],
            [
              -121.8901096,
              37.3296945
            ],
            [
              -121.8898523,
              37.3293547
            ],
            [
              -121.8898407,
              37.3293601
            ],
            [
              -121.8897741,
              37.3292754
            ],
            [
              -121.8897415,
              37.3292914
            ],
            [
              -121.8897039,
              37.329243
            ],
            [
              -121.8891278,
              37.3295192
            ],
            [
              -121.8891492,
              37.3295476
            ],
            [
              -121.8890974,
              37.3295724
            ],
            [
              -121.8890734,
              37.3295839
            ],
            [
              -121.8891166,
              37.3295921
            ],
            [
              -121.8891005,
              37.3296456
            ],
            [
              -121.8890567,
              37.329637
            ],
            [
              -121.8890456,
              37.3296716
            ],
            [
              -121.8890874,
              37.3297267
            ],
            [
              -121.8890742,
              37.329733
            ],
            [
              -121.8890606,
              37.3297395
            ],
            [
              -121.8890443,
              37.3297473
            ],
            [
              -121.88903,
              37.3297541
            ],
            [
              -121.8890589,
              37.3297923
            ],
            [
              -121.8891236,
              37.3297614
            ],
            [
              -121.8891473,
              37.3297928
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "949e2504-044b-4f96-b40f-86f5da096aaf",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.888236,
            37.329917
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8883325,
              37.3299674
            ],
            [
              -121.8883274,
              37.3299606
            ],
            [
              -121.8882947,
              37.3299175
            ],
            [
              -121.8884877,
              37.3298251
            ],
            [
              -121.8885365,
              37.3298017
            ],
            [
              -121.8885529,
              37.3297939
            ],
            [
              -121.8885428,
              37.3297806
            ],
            [
              -121.8885217,
              37.3297527
            ],
            [
              -121.8885142,
              37.3297428
            ],
            [
              -121.8884817,
              37.3297583
            ],
            [
              -121.8884642,
              37.3297667
            ],
            [
              -121.888436,
              37.3297802
            ],
            [
              -121.8884224,
              37.3297623
            ],
            [
              -121.8883787,
              37.3297832
            ],
            [
              -121.8883608,
              37.3297917
            ],
            [
              -121.8883307,
              37.3298062
            ],
            [
              -121.8882876,
              37.3298268
            ],
            [
              -121.8882687,
              37.3298019
            ],
            [
              -121.8882564,
              37.3297855
            ],
            [
              -121.8882365,
              37.3297592
            ],
            [
              -121.8882134,
              37.3297288
            ],
            [
              -121.8882035,
              37.3297157
            ],
            [
              -121.8881648,
              37.3296646
            ],
            [
              -121.8881558,
              37.3296689
            ],
            [
              -121.8881472,
              37.3296731
            ],
            [
              -121.8881445,
              37.3296744
            ],
            [
              -121.8881349,
              37.3296789
            ],
            [
              -121.8881233,
              37.3296845
            ],
            [
              -121.8881135,
              37.3296892
            ],
            [
              -121.8880971,
              37.3296677
            ],
            [
              -121.8880752,
              37.3296389
            ],
            [
              -121.8880567,
              37.3296478
            ],
            [
              -121.88801,
              37.3296701
            ],
            [
              -121.8879932,
              37.3296782
            ],
            [
              -121.8880126,
              37.3297037
            ],
            [
              -121.8880158,
              37.329708
            ],
            [
              -121.8880212,
              37.3297151
            ],
            [
              -121.8880313,
              37.3297285
            ],
            [
              -121.888037,
              37.3297359
            ],
            [
              -121.8880434,
              37.3297445
            ],
            [
              -121.8881285,
              37.3298568
            ],
            [
              -121.8881427,
              37.3298756
            ],
            [
              -121.8881668,
              37.3299075
            ],
            [
              -121.8880716,
              37.329953
            ],
            [
              -121.8880084,
              37.3299833
            ],
            [
              -121.8879907,
              37.3299918
            ],
            [
              -121.8879826,
              37.3299956
            ],
            [
              -121.887965,
              37.3300041
            ],
            [
              -121.8879019,
              37.3300343
            ],
            [
              -121.8878059,
              37.3300802
            ],
            [
              -121.8878094,
              37.3300847
            ],
            [
              -121.8878824,
              37.3301812
            ],
            [
              -121.8883325,
              37.3299674
            ]
          ],
          [
            [
              -121.8881272,
              37.3300522
            ],
            [
              -121.8881904,
              37.3300219
            ],
            [
              -121.8881758,
              37.3300028
            ],
            [
              -121.8881128,
              37.3300331
            ],
            [
              -121.8881272,
              37.3300522
            ]
          ],
          [
            [
              -121.8878972,
              37.3301362
            ],
            [
              -121.8879117,
              37.3301553
            ],
            [
              -121.8879859,
              37.3301198
            ],
            [
              -121.8879716,
              37.3301006
            ],
            [
              -121.8878972,
              37.3301362
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ade730d2-696d-4740-a893-e6053d952b13",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887562,
            37.329891
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8876704,
              37.3299012
            ],
            [
              -121.8876323,
              37.3298509
            ],
            [
              -121.8875616,
              37.3298848
            ],
            [
              -121.8875201,
              37.3298512
            ],
            [
              -121.8874902,
              37.329827
            ],
            [
              -121.8874491,
              37.3298578
            ],
            [
              -121.8875412,
              37.3299323
            ],
            [
              -121.8875605,
              37.329948
            ],
            [
              -121.8875651,
              37.3299517
            ],
            [
              -121.8876704,
              37.3299012
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "126bc6ab-bc08-4044-886d-8a7d5779c013",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887132,
            37.329572
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8870567,
              37.32954
            ],
            [
              -121.887171,
              37.3296325
            ],
            [
              -121.8871745,
              37.3296295
            ],
            [
              -121.8872066,
              37.3296031
            ],
            [
              -121.8870924,
              37.3295107
            ],
            [
              -121.8870567,
              37.32954
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "355f5276-bf73-4c0b-9aff-b0e7cf1a50a0",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.887185,
            37.32934
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8870924,
              37.3295107
            ],
            [
              -121.8872017,
              37.3294298
            ],
            [
              -121.8872451,
              37.3293976
            ],
            [
              -121.8874293,
              37.3292613
            ],
            [
              -121.8873505,
              37.3291572
            ],
            [
              -121.8871666,
              37.329293
            ],
            [
              -121.8870803,
              37.3292828
            ],
            [
              -121.8869393,
              37.3293867
            ],
            [
              -121.8870924,
              37.3295107
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4722f19f-0ae7-429c-89fc-60385cdca29f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888599,
            37.328658
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8894484,
              37.3282746
            ],
            [
              -121.8894667,
              37.3282988
            ],
            [
              -121.8894838,
              37.3283214
            ],
            [
              -121.8894864,
              37.3283249
            ],
            [
              -121.8897564,
              37.3281957
            ],
            [
              -121.8899801,
              37.3280887
            ],
            [
              -121.8897029,
              37.3277213
            ],
            [
              -121.8893932,
              37.3278695
            ],
            [
              -121.8893583,
              37.3278234
            ],
            [
              -121.889263,
              37.3278691
            ],
            [
              -121.8892979,
              37.3279151
            ],
            [
              -121.8889445,
              37.3280843
            ],
            [
              -121.8891129,
              37.3283067
            ],
            [
              -121.8883222,
              37.3286852
            ],
            [
              -121.8882612,
              37.3286045
            ],
            [
              -121.8881734,
              37.3286454
            ],
            [
              -121.8880921,
              37.3285367
            ],
            [
              -121.8880906,
              37.3285348
            ],
            [
              -121.8879295,
              37.3286539
            ],
            [
              -121.8879744,
              37.3287081
            ],
            [
              -121.8877977,
              37.3287926
            ],
            [
              -121.8878163,
              37.3288172
            ],
            [
              -121.8876396,
              37.3289018
            ],
            [
              -121.8876686,
              37.3289402
            ],
            [
              -121.887409,
              37.3290644
            ],
            [
              -121.8873186,
              37.3291071
            ],
            [
              -121.8870803,
              37.3292828
            ],
            [
              -121.8871666,
              37.329293
            ],
            [
              -121.8873505,
              37.3291572
            ],
            [
              -121.8874293,
              37.3292613
            ],
            [
              -121.8874613,
              37.3292376
            ],
            [
              -121.8874928,
              37.3292791
            ],
            [
              -121.8875505,
              37.3292515
            ],
            [
              -121.8875124,
              37.3292011
            ],
            [
              -121.887593,
              37.3291626
            ],
            [
              -121.8876311,
              37.3292129
            ],
            [
              -121.8877196,
              37.3291706
            ],
            [
              -121.8876815,
              37.3291202
            ],
            [
              -121.8877697,
              37.329078
            ],
            [
              -121.8878078,
              37.3291283
            ],
            [
              -121.8880801,
              37.328998
            ],
            [
              -121.8881065,
              37.3289854
            ],
            [
              -121.8880684,
              37.328935
            ],
            [
              -121.888131,
              37.3289051
            ],
            [
              -121.8882114,
              37.3288666
            ],
            [
              -121.8882299,
              37.328891
            ],
            [
              -121.8882495,
              37.3289169
            ],
            [
              -121.8883192,
              37.3288836
            ],
            [
              -121.8883379,
              37.3288747
            ],
            [
              -121.8884341,
              37.3288286
            ],
            [
              -121.8884314,
              37.3288251
            ],
            [
              -121.8883986,
              37.3287818
            ],
            [
              -121.888396,
              37.3287783
            ],
            [
              -121.8884715,
              37.3287421
            ],
            [
              -121.8884742,
              37.3287456
            ],
            [
              -121.888507,
              37.3287889
            ],
            [
              -121.8885097,
              37.3287924
            ],
            [
              -121.8887875,
              37.3286595
            ],
            [
              -121.8887848,
              37.328656
            ],
            [
              -121.888752,
              37.3286126
            ],
            [
              -121.8887494,
              37.3286091
            ],
            [
              -121.8888146,
              37.3285779
            ],
            [
              -121.888825,
              37.3285915
            ],
            [
              -121.8887813,
              37.3286124
            ],
            [
              -121.8888092,
              37.328649
            ],
            [
              -121.8888757,
              37.3286172
            ],
            [
              -121.8888376,
              37.3285669
            ],
            [
              -121.8888636,
              37.3285544
            ],
            [
              -121.8888989,
              37.3285375
            ],
            [
              -121.8889167,
              37.328561
            ],
            [
              -121.888937,
              37.3285879
            ],
            [
              -121.8894059,
              37.3283635
            ],
            [
              -121.8894033,
              37.32836
            ],
            [
              -121.8893705,
              37.3283166
            ],
            [
              -121.8893678,
              37.3283131
            ],
            [
              -121.8894484,
              37.3282746
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b2ff5e53-3ab3-4361-a045-09a5bc45ac53",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.889076,
            37.329478
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8886568,
              37.3297768
            ],
            [
              -121.8886749,
              37.3298011
            ],
            [
              -121.8887127,
              37.329852
            ],
            [
              -121.8886564,
              37.3298786
            ],
            [
              -121.88866,
              37.3298833
            ],
            [
              -121.8886311,
              37.3298971
            ],
            [
              -121.8886866,
              37.3299706
            ],
            [
              -121.888774,
              37.3299287
            ],
            [
              -121.8887889,
              37.3299484
            ],
            [
              -121.8887977,
              37.3299442
            ],
            [
              -121.8889657,
              37.3298638
            ],
            [
              -121.8889744,
              37.3298596
            ],
            [
              -121.8889595,
              37.3298399
            ],
            [
              -121.8890401,
              37.3298013
            ],
            [
              -121.8889846,
              37.3297279
            ],
            [
              -121.8889624,
              37.3297385
            ],
            [
              -121.888907,
              37.3297654
            ],
            [
              -121.8889035,
              37.3297608
            ],
            [
              -121.8888653,
              37.3297112
            ],
            [
              -121.8888462,
              37.3296861
            ],
            [
              -121.8889245,
              37.3296484
            ],
            [
              -121.8889313,
              37.3296574
            ],
            [
              -121.88895,
              37.3296485
            ],
            [
              -121.8889634,
              37.3296661
            ],
            [
              -121.8889776,
              37.3296592
            ],
            [
              -121.8889911,
              37.3296528
            ],
            [
              -121.888994,
              37.3296514
            ],
            [
              -121.8889974,
              37.3296559
            ],
            [
              -121.889011,
              37.3296493
            ],
            [
              -121.889024,
              37.3296431
            ],
            [
              -121.8890456,
              37.3296716
            ],
            [
              -121.8890567,
              37.329637
            ],
            [
              -121.8890399,
              37.3296337
            ],
            [
              -121.8890564,
              37.3295807
            ],
            [
              -121.8890734,
              37.3295839
            ],
            [
              -121.8890974,
              37.3295724
            ],
            [
              -121.8890758,
              37.329544
            ],
            [
              -121.8890969,
              37.3295339
            ],
            [
              -121.8891085,
              37.3295284
            ],
            [
              -121.8891278,
              37.3295192
            ],
            [
              -121.8897039,
              37.329243
            ],
            [
              -121.8897415,
              37.3292914
            ],
            [
              -121.8897741,
              37.3292754
            ],
            [
              -121.8900648,
              37.3291363
            ],
            [
              -121.8900553,
              37.329123
            ],
            [
              -121.8900342,
              37.3290954
            ],
            [
              -121.8900266,
              37.3290854
            ],
            [
              -121.8900574,
              37.3290707
            ],
            [
              -121.8900493,
              37.3290598
            ],
            [
              -121.8900285,
              37.3290321
            ],
            [
              -121.8900097,
              37.3290071
            ],
            [
              -121.8899677,
              37.3290272
            ],
            [
              -121.8899438,
              37.3290386
            ],
            [
              -121.8899348,
              37.3290429
            ],
            [
              -121.8899242,
              37.329048
            ],
            [
              -121.889828,
              37.3290941
            ],
            [
              -121.8898093,
              37.329103
            ],
            [
              -121.889766,
              37.3291237
            ],
            [
              -121.8897473,
              37.3291327
            ],
            [
              -121.8896556,
              37.3291766
            ],
            [
              -121.8896176,
              37.3291263
            ],
            [
              -121.8896156,
              37.3291237
            ],
            [
              -121.8896102,
              37.3291166
            ],
            [
              -121.8895918,
              37.3290923
            ],
            [
              -121.8895434,
              37.3291154
            ],
            [
              -121.8895346,
              37.3291196
            ],
            [
              -121.8895314,
              37.3291212
            ],
            [
              -121.889521,
              37.3291262
            ],
            [
              -121.8895094,
              37.3291317
            ],
            [
              -121.889499,
              37.3291367
            ],
            [
              -121.8894908,
              37.3291406
            ],
            [
              -121.8894819,
              37.3291449
            ],
            [
              -121.8894448,
              37.3291626
            ],
            [
              -121.8894186,
              37.3291752
            ],
            [
              -121.8894107,
              37.3291789
            ],
            [
              -121.889392,
              37.3291879
            ],
            [
              -121.8893489,
              37.3292085
            ],
            [
              -121.8893302,
              37.3292175
            ],
            [
              -121.8891458,
              37.3293057
            ],
            [
              -121.889127,
              37.3293147
            ],
            [
              -121.8890838,
              37.3293353
            ],
            [
              -121.8890657,
              37.329344
            ],
            [
              -121.8890543,
              37.3293495
            ],
            [
              -121.889031,
              37.3293606
            ],
            [
              -121.888995,
              37.3293779
            ],
            [
              -121.8889861,
              37.3293821
            ],
            [
              -121.8889724,
              37.3293887
            ],
            [
              -121.8889624,
              37.3293755
            ],
            [
              -121.8889109,
              37.3293075
            ],
            [
              -121.8888619,
              37.329331
            ],
            [
              -121.8888513,
              37.3293361
            ],
            [
              -121.8888447,
              37.3293392
            ],
            [
              -121.8888331,
              37.3293448
            ],
            [
              -121.888827,
              37.3293477
            ],
            [
              -121.8888179,
              37.3293521
            ],
            [
              -121.888809,
              37.3293563
            ],
            [
              -121.8888044,
              37.3293585
            ],
            [
              -121.8888602,
              37.3294322
            ],
            [
              -121.8888722,
              37.329448
            ],
            [
              -121.888907,
              37.3294941
            ],
            [
              -121.8889082,
              37.3294956
            ],
            [
              -121.8889137,
              37.329503
            ],
            [
              -121.8889415,
              37.3295396
            ],
            [
              -121.8888895,
              37.3295644
            ],
            [
              -121.8888551,
              37.3295189
            ],
            [
              -121.8888538,
              37.3295172
            ],
            [
              -121.8888432,
              37.3295032
            ],
            [
              -121.8888202,
              37.3294729
            ],
            [
              -121.8888083,
              37.3294571
            ],
            [
              -121.8887618,
              37.3293957
            ],
            [
              -121.8887198,
              37.3294158
            ],
            [
              -121.8887111,
              37.3294043
            ],
            [
              -121.888706,
              37.3294067
            ],
            [
              -121.8886973,
              37.3294109
            ],
            [
              -121.8886509,
              37.3294331
            ],
            [
              -121.8884664,
              37.3295214
            ],
            [
              -121.8884302,
              37.3295387
            ],
            [
              -121.8884126,
              37.3295471
            ],
            [
              -121.8884063,
              37.3295502
            ],
            [
              -121.8884151,
              37.3295617
            ],
            [
              -121.8883729,
              37.3295819
            ],
            [
              -121.8883898,
              37.3296042
            ],
            [
              -121.8884003,
              37.329618
            ],
            [
              -121.8884134,
              37.3296354
            ],
            [
              -121.8884352,
              37.3296641
            ],
            [
              -121.8884495,
              37.3296573
            ],
            [
              -121.8884535,
              37.3296554
            ],
            [
              -121.8884577,
              37.3296608
            ],
            [
              -121.8884725,
              37.3296805
            ],
            [
              -121.8884834,
              37.3296948
            ],
            [
              -121.8885162,
              37.3297381
            ],
            [
              -121.8885182,
              37.3297408
            ],
            [
              -121.8885142,
              37.3297428
            ],
            [
              -121.8885217,
              37.3297527
            ],
            [
              -121.8885428,
              37.3297806
            ],
            [
              -121.8885529,
              37.3297939
            ],
            [
              -121.8885707,
              37.3298174
            ],
            [
              -121.8886568,
              37.3297768
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f3bf5119-79f3-4196-b128-ad3c03a9e19c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889078,
            37.329613
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891166,
              37.3295921
            ],
            [
              -121.8890734,
              37.3295839
            ],
            [
              -121.8890564,
              37.3295807
            ],
            [
              -121.8890399,
              37.3296337
            ],
            [
              -121.8890567,
              37.329637
            ],
            [
              -121.8891005,
              37.3296456
            ],
            [
              -121.8891166,
              37.3295921
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "12172e9f-8a59-48bb-ad2e-25611e392cad",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.889113,
            37.329546
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890974,
              37.3295724
            ],
            [
              -121.8891492,
              37.3295476
            ],
            [
              -121.8891278,
              37.3295192
            ],
            [
              -121.8891085,
              37.3295284
            ],
            [
              -121.8890969,
              37.3295339
            ],
            [
              -121.8890758,
              37.329544
            ],
            [
              -121.8890974,
              37.3295724
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f62c4296-aa0c-4f03-9b75-e09a30178ebe",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.889036,
            37.329694
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890606,
              37.3297395
            ],
            [
              -121.8890742,
              37.329733
            ],
            [
              -121.889042627257069,
              37.329691205176282
            ],
            [
              -121.889011,
              37.3296493
            ],
            [
              -121.8889974,
              37.3296559
            ],
            [
              -121.8890606,
              37.3297395
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9dc445f5-c465-4a18-9ba3-2c9cb6908cbc",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.889049,
            37.329688
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889024,
              37.3296431
            ],
            [
              -121.889011,
              37.3296493
            ],
            [
              -121.889042627257069,
              37.329691205176282
            ],
            [
              -121.8890742,
              37.329733
            ],
            [
              -121.8890874,
              37.3297267
            ],
            [
              -121.8890456,
              37.3296716
            ],
            [
              -121.889024,
              37.3296431
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "1e31dfe7-6f2a-4b6c-842a-b1d8991c6c3e",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888897,
            37.329681
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890589,
              37.3297923
            ],
            [
              -121.88903,
              37.3297541
            ],
            [
              -121.8889634,
              37.3296661
            ],
            [
              -121.88895,
              37.3296485
            ],
            [
              -121.8889313,
              37.3296574
            ],
            [
              -121.8889245,
              37.3296484
            ],
            [
              -121.8888462,
              37.3296861
            ],
            [
              -121.8888653,
              37.3297112
            ],
            [
              -121.8889214,
              37.3296844
            ],
            [
              -121.8889436,
              37.3296738
            ],
            [
              -121.8889846,
              37.3297279
            ],
            [
              -121.8890401,
              37.3298013
            ],
            [
              -121.8890469,
              37.3297981
            ],
            [
              -121.8890589,
              37.3297923
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "234625ee-9f40-4fae-980a-6bdf9fca0a87",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.889004,
            37.329707
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.88903,
              37.3297541
            ],
            [
              -121.8890443,
              37.3297473
            ],
            [
              -121.889010649786172,
              37.329703297497211
            ],
            [
              -121.8889776,
              37.3296592
            ],
            [
              -121.8889634,
              37.3296661
            ],
            [
              -121.88903,
              37.3297541
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "65987a75-1c44-45a0-b44c-82ae88ab3f4c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.889019,
            37.329699
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8889911,
              37.3296528
            ],
            [
              -121.8889776,
              37.3296592
            ],
            [
              -121.889010649786172,
              37.329703297497211
            ],
            [
              -121.8890443,
              37.3297473
            ],
            [
              -121.8890606,
              37.3297395
            ],
            [
              -121.8889974,
              37.3296559
            ],
            [
              -121.888994,
              37.3296514
            ],
            [
              -121.8889911,
              37.3296528
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3ae21c1d-7f30-4b42-b342-ad5bc85f89fc",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888914,
            37.329725
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8889214,
              37.3296844
            ],
            [
              -121.8888653,
              37.3297112
            ],
            [
              -121.8889035,
              37.3297608
            ],
            [
              -121.888907,
              37.3297654
            ],
            [
              -121.8889624,
              37.3297385
            ],
            [
              -121.8889214,
              37.3296844
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f805a5a8-74d7-4dd8-82c6-d58ba5069ffe",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.888953,
            37.329706
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8889214,
              37.3296844
            ],
            [
              -121.8889624,
              37.3297385
            ],
            [
              -121.8889846,
              37.3297279
            ],
            [
              -121.8889436,
              37.3296738
            ],
            [
              -121.8889214,
              37.3296844
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b8047210-15d7-4390-8407-2c5d1cd523c9",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.888625,
            37.329863
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8886564,
              37.3298786
            ],
            [
              -121.8886183,
              37.3298283
            ],
            [
              -121.8885894,
              37.3298421
            ],
            [
              -121.8886311,
              37.3298971
            ],
            [
              -121.88866,
              37.3298833
            ],
            [
              -121.8886564,
              37.3298786
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "593ffa1b-ac5b-4eb4-bd79-272c815a5922",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888666,
            37.32984
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8886564,
              37.3298786
            ],
            [
              -121.8887127,
              37.329852
            ],
            [
              -121.8886749,
              37.3298011
            ],
            [
              -121.8886183,
              37.3298283
            ],
            [
              -121.8886564,
              37.3298786
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "e72ae533-05f7-4731-8029-9851f219aab4",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888623,
            37.329809
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8886568,
              37.3297768
            ],
            [
              -121.8885707,
              37.3298174
            ],
            [
              -121.8885894,
              37.3298421
            ],
            [
              -121.8886183,
              37.3298283
            ],
            [
              -121.8886749,
              37.3298011
            ],
            [
              -121.8886568,
              37.3297768
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "005eb3b8-c95d-4d35-a8a0-22d3cb4d6542",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888898,
            37.329529
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "120.3"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8889415,
              37.3295396
            ],
            [
              -121.8889137,
              37.329503
            ],
            [
              -121.8889082,
              37.3294956
            ],
            [
              -121.888907,
              37.3294941
            ],
            [
              -121.8888551,
              37.3295189
            ],
            [
              -121.8888895,
              37.3295644
            ],
            [
              -121.8889415,
              37.3295396
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "35c82c74-428f-4472-aab0-4a5cfcfe8165",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888757,
            37.329382
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8887618,
              37.3293957
            ],
            [
              -121.8888083,
              37.3294571
            ],
            [
              -121.8888602,
              37.3294322
            ],
            [
              -121.8888044,
              37.3293585
            ],
            [
              -121.888772,
              37.329374
            ],
            [
              -121.8887618,
              37.3293606
            ],
            [
              -121.8888168,
              37.3293343
            ],
            [
              -121.8888107,
              37.3293262
            ],
            [
              -121.888835,
              37.3293145
            ],
            [
              -121.8888318,
              37.3293103
            ],
            [
              -121.8888836,
              37.3292855
            ],
            [
              -121.8888914,
              37.3292818
            ],
            [
              -121.8888728,
              37.3292572
            ],
            [
              -121.8886927,
              37.3293434
            ],
            [
              -121.8887281,
              37.3293902
            ],
            [
              -121.8887314,
              37.3293946
            ],
            [
              -121.8887111,
              37.3294043
            ],
            [
              -121.8887198,
              37.3294158
            ],
            [
              -121.8887618,
              37.3293957
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4e17330d-ce0d-4cf3-b941-5212dd147429",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888252,
            37.329588
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8884063,
              37.3295502
            ],
            [
              -121.8883859,
              37.32956
            ],
            [
              -121.8883826,
              37.3295556
            ],
            [
              -121.8883498,
              37.3295123
            ],
            [
              -121.8883471,
              37.3295088
            ],
            [
              -121.8880752,
              37.3296389
            ],
            [
              -121.8880971,
              37.3296677
            ],
            [
              -121.8881048,
              37.329664
            ],
            [
              -121.8881281,
              37.3296527
            ],
            [
              -121.8881251,
              37.3296487
            ],
            [
              -121.8881813,
              37.3296218
            ],
            [
              -121.8882007,
              37.3296475
            ],
            [
              -121.8882282,
              37.3296343
            ],
            [
              -121.8883013,
              37.3295993
            ],
            [
              -121.8882919,
              37.3295869
            ],
            [
              -121.8883342,
              37.3295667
            ],
            [
              -121.8883435,
              37.3295791
            ],
            [
              -121.8883283,
              37.3295864
            ],
            [
              -121.8883376,
              37.3295987
            ],
            [
              -121.8883729,
              37.3295819
            ],
            [
              -121.8884151,
              37.3295617
            ],
            [
              -121.8884063,
              37.3295502
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "92171039-cf9b-4590-a406-43ca824c8418",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888445,
            37.329718
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "120.14"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8884352,
              37.3296641
            ],
            [
              -121.8883999,
              37.329681
            ],
            [
              -121.8883976,
              37.3296821
            ],
            [
              -121.8883886,
              37.3296864
            ],
            [
              -121.8883712,
              37.3296947
            ],
            [
              -121.8884224,
              37.3297623
            ],
            [
              -121.888436,
              37.3297802
            ],
            [
              -121.8884642,
              37.3297667
            ],
            [
              -121.8884817,
              37.3297583
            ],
            [
              -121.8885142,
              37.3297428
            ],
            [
              -121.8885182,
              37.3297408
            ],
            [
              -121.8885162,
              37.3297381
            ],
            [
              -121.8884834,
              37.3296948
            ],
            [
              -121.8884725,
              37.3296805
            ],
            [
              -121.8884577,
              37.3296608
            ],
            [
              -121.8884535,
              37.3296554
            ],
            [
              -121.8884495,
              37.3296573
            ],
            [
              -121.8884352,
              37.3296641
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b36e6380-4e81-4f95-a126-3d60582d917d",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887842,
            37.330041
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8878052,
              37.3300793
            ],
            [
              -121.8878059,
              37.3300802
            ],
            [
              -121.8879019,
              37.3300343
            ],
            [
              -121.8878776,
              37.3300024
            ],
            [
              -121.8878708,
              37.3300057
            ],
            [
              -121.8877893,
              37.3300447
            ],
            [
              -121.8877818,
              37.3300483
            ],
            [
              -121.887783,
              37.3300499
            ],
            [
              -121.8878052,
              37.3300793
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b56b8e9e-d395-406e-af9f-415edce6357f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887942,
            37.330128
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879859,
              37.3301198
            ],
            [
              -121.8879716,
              37.3301006
            ],
            [
              -121.8878972,
              37.3301362
            ],
            [
              -121.8879117,
              37.3301553
            ],
            [
              -121.8879859,
              37.3301198
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "6b02a9d1-0d0c-4002-8553-55960ada4bac",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888152,
            37.330027
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881758,
              37.3300028
            ],
            [
              -121.8881128,
              37.3300331
            ],
            [
              -121.8881272,
              37.3300522
            ],
            [
              -121.8881904,
              37.3300219
            ],
            [
              -121.8881758,
              37.3300028
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "eaf09edb-f02b-4a3b-b180-affb89325299",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.887927,
            37.329915
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8878708,
              37.3300057
            ],
            [
              -121.8878776,
              37.3300024
            ],
            [
              -121.8879019,
              37.3300343
            ],
            [
              -121.887965,
              37.3300041
            ],
            [
              -121.8879826,
              37.3299956
            ],
            [
              -121.8879907,
              37.3299918
            ],
            [
              -121.8880084,
              37.3299833
            ],
            [
              -121.8880716,
              37.329953
            ],
            [
              -121.8880475,
              37.3299212
            ],
            [
              -121.8880543,
              37.3299179
            ],
            [
              -121.8881358,
              37.3298789
            ],
            [
              -121.8881427,
              37.3298756
            ],
            [
              -121.8881285,
              37.3298568
            ],
            [
              -121.8880383,
              37.3298999
            ],
            [
              -121.8880324,
              37.3298921
            ],
            [
              -121.8880218,
              37.329878
            ],
            [
              -121.888014,
              37.3298677
            ],
            [
              -121.8879602,
              37.3297964
            ],
            [
              -121.8879549,
              37.3297894
            ],
            [
              -121.8879535,
              37.3297875
            ],
            [
              -121.8880434,
              37.3297445
            ],
            [
              -121.888037,
              37.3297359
            ],
            [
              -121.8880313,
              37.3297285
            ],
            [
              -121.8879618,
              37.3297618
            ],
            [
              -121.8879435,
              37.3297706
            ],
            [
              -121.8878647,
              37.3298083
            ],
            [
              -121.8878558,
              37.3298125
            ],
            [
              -121.8878474,
              37.3298165
            ],
            [
              -121.8878304,
              37.3298247
            ],
            [
              -121.8878217,
              37.3298288
            ],
            [
              -121.8877588,
              37.3298589
            ],
            [
              -121.8876704,
              37.3299012
            ],
            [
              -121.8876825,
              37.3299172
            ],
            [
              -121.8877733,
              37.3298738
            ],
            [
              -121.8877749,
              37.3298759
            ],
            [
              -121.8877801,
              37.3298827
            ],
            [
              -121.8878339,
              37.3299539
            ],
            [
              -121.8878418,
              37.3299643
            ],
            [
              -121.8878525,
              37.3299785
            ],
            [
              -121.8878582,
              37.329986
            ],
            [
              -121.8877675,
              37.3300294
            ],
            [
              -121.8877788,
              37.3300444
            ],
            [
              -121.8877818,
              37.3300483
            ],
            [
              -121.8877893,
              37.3300447
            ],
            [
              -121.8878708,
              37.3300057
            ]
          ],
          [
            [
              -121.8878523,
              37.329945
            ],
            [
              -121.8878576,
              37.3299425
            ],
            [
              -121.8878753,
              37.329934
            ],
            [
              -121.887924,
              37.3299108
            ],
            [
              -121.8879725,
              37.3298875
            ],
            [
              -121.8879902,
              37.3298791
            ],
            [
              -121.8879955,
              37.3298765
            ],
            [
              -121.8879348,
              37.3297964
            ],
            [
              -121.8878759,
              37.3298246
            ],
            [
              -121.8878676,
              37.3298286
            ],
            [
              -121.8878633,
              37.3298306
            ],
            [
              -121.887859,
              37.3298327
            ],
            [
              -121.8878506,
              37.3298367
            ],
            [
              -121.8877917,
              37.3298649
            ],
            [
              -121.8878523,
              37.329945
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b802b55b-cd72-4319-9b7c-eb4d65a9f951",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888107,
            37.329914
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8880543,
              37.3299179
            ],
            [
              -121.8880475,
              37.3299212
            ],
            [
              -121.8880716,
              37.329953
            ],
            [
              -121.8881668,
              37.3299075
            ],
            [
              -121.8881427,
              37.3298756
            ],
            [
              -121.8881358,
              37.3298789
            ],
            [
              -121.8880543,
              37.3299179
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "422cff48-fa3c-48aa-843c-2c961277616e",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.887929,
            37.329854
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "112"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879348,
              37.3297964
            ],
            [
              -121.8878759,
              37.3298246
            ],
            [
              -121.8878676,
              37.3298286
            ],
            [
              -121.8878633,
              37.3298306
            ],
            [
              -121.887924,
              37.3299108
            ],
            [
              -121.8879725,
              37.3298875
            ],
            [
              -121.8879902,
              37.3298791
            ],
            [
              -121.8879955,
              37.3298765
            ],
            [
              -121.8879348,
              37.3297964
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a6a4df35-02fd-4a77-82da-7249a362590e",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.887858,
            37.329888
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "113"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8878523,
              37.329945
            ],
            [
              -121.8878576,
              37.3299425
            ],
            [
              -121.8878753,
              37.329934
            ],
            [
              -121.887924,
              37.3299108
            ],
            [
              -121.8878633,
              37.3298306
            ],
            [
              -121.887859,
              37.3298327
            ],
            [
              -121.8878506,
              37.3298367
            ],
            [
              -121.8877917,
              37.3298649
            ],
            [
              -121.8878523,
              37.329945
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "72849bc9-e6ad-4dd8-99ea-f5c89c11dac4",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888041,
            37.329822
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "111"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8880434,
              37.3297445
            ],
            [
              -121.8879535,
              37.3297875
            ],
            [
              -121.8879549,
              37.3297894
            ],
            [
              -121.8879602,
              37.3297964
            ],
            [
              -121.888014,
              37.3298677
            ],
            [
              -121.8880218,
              37.329878
            ],
            [
              -121.8880324,
              37.3298921
            ],
            [
              -121.8880383,
              37.3298999
            ],
            [
              -121.8881285,
              37.3298568
            ],
            [
              -121.8880434,
              37.3297445
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a3442e09-9641-4913-bfe1-74c012d9f3be",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.88777,
            37.329952
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "114"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8878582,
              37.329986
            ],
            [
              -121.8878525,
              37.3299785
            ],
            [
              -121.8878418,
              37.3299643
            ],
            [
              -121.8878339,
              37.3299539
            ],
            [
              -121.8877801,
              37.3298827
            ],
            [
              -121.8877749,
              37.3298759
            ],
            [
              -121.8877733,
              37.3298738
            ],
            [
              -121.8876825,
              37.3299172
            ],
            [
              -121.8877675,
              37.3300294
            ],
            [
              -121.8878582,
              37.329986
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f837aa7f-99cd-42db-9604-1edea1ee1791",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887959,
            37.329721
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879408,
              37.329767
            ],
            [
              -121.8879435,
              37.3297706
            ],
            [
              -121.8879618,
              37.3297618
            ],
            [
              -121.887951,
              37.3297475
            ],
            [
              -121.8879996,
              37.3297242
            ],
            [
              -121.8879917,
              37.3297137
            ],
            [
              -121.8880126,
              37.3297037
            ],
            [
              -121.8879932,
              37.3296782
            ],
            [
              -121.8879054,
              37.3297202
            ],
            [
              -121.887908,
              37.3297237
            ],
            [
              -121.8879408,
              37.329767
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "1697abfa-7b60-4ccf-bfd6-74807406c2f7",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.887876,
            37.329768
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879408,
              37.329767
            ],
            [
              -121.887908,
              37.3297237
            ],
            [
              -121.8879054,
              37.3297202
            ],
            [
              -121.8878093,
              37.3297662
            ],
            [
              -121.88782802079939,
              37.329790899644372
            ],
            [
              -121.8878474,
              37.3298165
            ],
            [
              -121.8878558,
              37.3298125
            ],
            [
              -121.8878647,
              37.3298083
            ],
            [
              -121.8879435,
              37.3297706
            ],
            [
              -121.8879408,
              37.329767
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "49c77a0c-bcaa-4f38-936b-40edc1373e66",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888981,
            37.329333
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8889109,
              37.3293075
            ],
            [
              -121.8889624,
              37.3293755
            ],
            [
              -121.889021,
              37.3293475
            ],
            [
              -121.889031,
              37.3293606
            ],
            [
              -121.8890543,
              37.3293495
            ],
            [
              -121.8890162,
              37.3292991
            ],
            [
              -121.8889667,
              37.3293229
            ],
            [
              -121.8889432,
              37.3292921
            ],
            [
              -121.8889109,
              37.3293075
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9fe08224-6cd1-4cad-80d8-4771ae71d97a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "parking",
        "display_point": {
          "coordinates": [
            -121.888792,
            37.329017
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890162,
              37.3292991
            ],
            [
              -121.8891077,
              37.3292554
            ],
            [
              -121.8892921,
              37.3291671
            ],
            [
              -121.8893804,
              37.3291248
            ],
            [
              -121.8895537,
              37.3290419
            ],
            [
              -121.8895723,
              37.3290664
            ],
            [
              -121.8895918,
              37.3290923
            ],
            [
              -121.8896102,
              37.3291166
            ],
            [
              -121.8896156,
              37.3291237
            ],
            [
              -121.8896176,
              37.3291263
            ],
            [
              -121.8897093,
              37.3290824
            ],
            [
              -121.8897899,
              37.3290438
            ],
            [
              -121.8900548,
              37.3289169
            ],
            [
              -121.8901431,
              37.3288747
            ],
            [
              -121.8901736,
              37.3288601
            ],
            [
              -121.8902109,
              37.3288422
            ],
            [
              -121.8902384,
              37.328829
            ],
            [
              -121.8901808,
              37.328753
            ],
            [
              -121.8901222,
              37.3286755
            ],
            [
              -121.8901203,
              37.3286764
            ],
            [
              -121.890103,
              37.3286536
            ],
            [
              -121.8898612,
              37.3283342
            ],
            [
              -121.8900849,
              37.3282276
            ],
            [
              -121.8899925,
              37.3281051
            ],
            [
              -121.8899801,
              37.3280887
            ],
            [
              -121.8897564,
              37.3281957
            ],
            [
              -121.8894864,
              37.3283249
            ],
            [
              -121.8894652,
              37.3283351
            ],
            [
              -121.8894565,
              37.3283393
            ],
            [
              -121.8894269,
              37.3283535
            ],
            [
              -121.8894239,
              37.3283549
            ],
            [
              -121.8894153,
              37.328359
            ],
            [
              -121.8894059,
              37.3283635
            ],
            [
              -121.888937,
              37.3285879
            ],
            [
              -121.8889017,
              37.3286048
            ],
            [
              -121.8888757,
              37.3286172
            ],
            [
              -121.8888092,
              37.328649
            ],
            [
              -121.8888055,
              37.3286508
            ],
            [
              -121.8887968,
              37.328655
            ],
            [
              -121.8887875,
              37.3286595
            ],
            [
              -121.8885097,
              37.3287924
            ],
            [
              -121.8884824,
              37.3288055
            ],
            [
              -121.8884738,
              37.3288096
            ],
            [
              -121.8884341,
              37.3288286
            ],
            [
              -121.8883379,
              37.3288747
            ],
            [
              -121.8883192,
              37.3288836
            ],
            [
              -121.8882495,
              37.3289169
            ],
            [
              -121.888208,
              37.3289368
            ],
            [
              -121.888208,
              37.3289368
            ],
            [
              -121.8881993,
              37.328941
            ],
            [
              -121.8881948,
              37.3289431
            ],
            [
              -121.8881875,
              37.3289466
            ],
            [
              -121.8881786,
              37.3289509
            ],
            [
              -121.8881691,
              37.3289554
            ],
            [
              -121.8881152,
              37.3289812
            ],
            [
              -121.8881065,
              37.3289854
            ],
            [
              -121.8880801,
              37.328998
            ],
            [
              -121.8878078,
              37.3291283
            ],
            [
              -121.8877895,
              37.3291371
            ],
            [
              -121.8877807,
              37.3291413
            ],
            [
              -121.8877196,
              37.3291706
            ],
            [
              -121.8876311,
              37.3292129
            ],
            [
              -121.8875735,
              37.3292405
            ],
            [
              -121.8875648,
              37.3292446
            ],
            [
              -121.8875505,
              37.3292515
            ],
            [
              -121.8874928,
              37.3292791
            ],
            [
              -121.8874911,
              37.3292799
            ],
            [
              -121.8874824,
              37.3292841
            ],
            [
              -121.8872451,
              37.3293976
            ],
            [
              -121.8872017,
              37.3294298
            ],
            [
              -121.8872047,
              37.3294337
            ],
            [
              -121.8875201,
              37.3298512
            ],
            [
              -121.8875616,
              37.3298848
            ],
            [
              -121.8876323,
              37.3298509
            ],
            [
              -121.8877207,
              37.3298086
            ],
            [
              -121.8878093,
              37.3297662
            ],
            [
              -121.8879054,
              37.3297202
            ],
            [
              -121.8879932,
              37.3296782
            ],
            [
              -121.88801,
              37.3296701
            ],
            [
              -121.8880567,
              37.3296478
            ],
            [
              -121.8880752,
              37.3296389
            ],
            [
              -121.8883471,
              37.3295088
            ],
            [
              -121.8884276,
              37.3294703
            ],
            [
              -121.8886122,
              37.3293819
            ],
            [
              -121.8886927,
              37.3293434
            ],
            [
              -121.8888728,
              37.3292572
            ],
            [
              -121.8888914,
              37.3292818
            ],
            [
              -121.8889109,
              37.3293075
            ],
            [
              -121.8889432,
              37.3292921
            ],
            [
              -121.8889667,
              37.3293229
            ],
            [
              -121.8890162,
              37.3292991
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a837f5a3-67cf-48c3-a03b-87e5f2c09848",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889081,
            37.329302
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890543,
              37.3293495
            ],
            [
              -121.8890657,
              37.329344
            ],
            [
              -121.8890838,
              37.3293353
            ],
            [
              -121.889127,
              37.3293147
            ],
            [
              -121.8891458,
              37.3293057
            ],
            [
              -121.8891077,
              37.3292554
            ],
            [
              -121.8890162,
              37.3292991
            ],
            [
              -121.8890543,
              37.3293495
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "21a40ae4-4744-4949-a856-e81e17410938",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889219,
            37.329236
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891458,
              37.3293057
            ],
            [
              -121.8893302,
              37.3292175
            ],
            [
              -121.8892921,
              37.3291671
            ],
            [
              -121.8891077,
              37.3292554
            ],
            [
              -121.8891458,
              37.3293057
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3531f43e-5d8a-4231-aa85-a9a62f3955ae",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889468,
            37.329107
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8893804,
              37.3291248
            ],
            [
              -121.8894186,
              37.3291752
            ],
            [
              -121.8894448,
              37.3291626
            ],
            [
              -121.8894349,
              37.3291494
            ],
            [
              -121.889489,
              37.3291235
            ],
            [
              -121.8894835,
              37.3291163
            ],
            [
              -121.8894914,
              37.3291126
            ],
            [
              -121.889516,
              37.3291008
            ],
            [
              -121.8895119,
              37.3290953
            ],
            [
              -121.8895723,
              37.3290664
            ],
            [
              -121.8895537,
              37.3290419
            ],
            [
              -121.8893804,
              37.3291248
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "64993256-4e98-4633-aa99-f5ae78ac0afb",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889355,
            37.329171
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8892921,
              37.3291671
            ],
            [
              -121.8893302,
              37.3292175
            ],
            [
              -121.8893489,
              37.3292085
            ],
            [
              -121.889392,
              37.3291879
            ],
            [
              -121.8894107,
              37.3291789
            ],
            [
              -121.8894186,
              37.3291752
            ],
            [
              -121.8893804,
              37.3291248
            ],
            [
              -121.8892921,
              37.3291671
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9a0262c9-f4ce-4aa4-8d55-3ceaf5adb94a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888997,
            37.329368
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889021,
              37.3293475
            ],
            [
              -121.8889624,
              37.3293755
            ],
            [
              -121.8889724,
              37.3293887
            ],
            [
              -121.8889861,
              37.3293821
            ],
            [
              -121.888995,
              37.3293779
            ],
            [
              -121.889031,
              37.3293606
            ],
            [
              -121.889021,
              37.3293475
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "2b466a5c-f990-45b5-befb-28c987b014ee",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888871,
            37.329309
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888318,
              37.3293103
            ],
            [
              -121.888835,
              37.3293145
            ],
            [
              -121.8888513,
              37.3293361
            ],
            [
              -121.8888619,
              37.329331
            ],
            [
              -121.8889109,
              37.3293075
            ],
            [
              -121.8888914,
              37.3292818
            ],
            [
              -121.8888836,
              37.3292855
            ],
            [
              -121.8888318,
              37.3293103
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "6af372b9-be95-4bcb-ba7e-cbc8d65e140e",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.888831,
            37.329331
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.888835,
              37.3293145
            ],
            [
              -121.8888107,
              37.3293262
            ],
            [
              -121.8888168,
              37.3293343
            ],
            [
              -121.888827,
              37.3293477
            ],
            [
              -121.8888331,
              37.3293448
            ],
            [
              -121.8888447,
              37.3293392
            ],
            [
              -121.8888513,
              37.3293361
            ],
            [
              -121.888835,
              37.3293145
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "0112c021-f424-422a-b640-4a06e8172cb2",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888794,
            37.329354
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888044,
              37.3293585
            ],
            [
              -121.888809,
              37.3293563
            ],
            [
              -121.8888179,
              37.3293521
            ],
            [
              -121.888827,
              37.3293477
            ],
            [
              -121.8888168,
              37.3293343
            ],
            [
              -121.8887618,
              37.3293606
            ],
            [
              -121.888772,
              37.329374
            ],
            [
              -121.8888044,
              37.3293585
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "0d664157-1ee1-46b2-b1e6-cf7eaae93e02",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888672,
            37.329388
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8886927,
              37.3293434
            ],
            [
              -121.8886122,
              37.3293819
            ],
            [
              -121.8886148,
              37.3293854
            ],
            [
              -121.8886476,
              37.3294288
            ],
            [
              -121.8886509,
              37.3294331
            ],
            [
              -121.8886973,
              37.3294109
            ],
            [
              -121.888706,
              37.3294067
            ],
            [
              -121.8887111,
              37.3294043
            ],
            [
              -121.8887314,
              37.3293946
            ],
            [
              -121.8887281,
              37.3293902
            ],
            [
              -121.8886927,
              37.3293434
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "bcbecb3f-a66e-4601-9ac2-1c78ceab00cf",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888539,
            37.329452
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8886148,
              37.3293854
            ],
            [
              -121.8886122,
              37.3293819
            ],
            [
              -121.8884276,
              37.3294703
            ],
            [
              -121.8884303,
              37.3294738
            ],
            [
              -121.8884484,
              37.3294978
            ],
            [
              -121.8884664,
              37.3295214
            ],
            [
              -121.8886509,
              37.3294331
            ],
            [
              -121.8886476,
              37.3294288
            ],
            [
              -121.8886148,
              37.3293854
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "889cfc5a-e28a-481a-bda0-03fd9c6769c0",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888407,
            37.329515
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8884303,
              37.3294738
            ],
            [
              -121.8884276,
              37.3294703
            ],
            [
              -121.8883471,
              37.3295088
            ],
            [
              -121.8883498,
              37.3295123
            ],
            [
              -121.8883826,
              37.3295556
            ],
            [
              -121.8883859,
              37.32956
            ],
            [
              -121.8884063,
              37.3295502
            ],
            [
              -121.8884126,
              37.3295471
            ],
            [
              -121.8884302,
              37.3295387
            ],
            [
              -121.8884664,
              37.3295214
            ],
            [
              -121.8884484,
              37.3294978
            ],
            [
              -121.8884303,
              37.3294738
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "e6aa941d-be37-4329-a784-ad986b2f8a14",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888318,
            37.329583
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8883106,
              37.3295948
            ],
            [
              -121.8883283,
              37.3295864
            ],
            [
              -121.8883435,
              37.3295791
            ],
            [
              -121.8883342,
              37.3295667
            ],
            [
              -121.8882919,
              37.3295869
            ],
            [
              -121.8883013,
              37.3295993
            ],
            [
              -121.8883106,
              37.3295948
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a38ba22a-c137-48b1-8090-d31bdd694e8f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888376,
            37.329617
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "120.7"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8883782,
              37.3296523
            ],
            [
              -121.8884134,
              37.3296354
            ],
            [
              -121.8884003,
              37.329618
            ],
            [
              -121.8883898,
              37.3296042
            ],
            [
              -121.8883729,
              37.3295819
            ],
            [
              -121.8883376,
              37.3295987
            ],
            [
              -121.8883398,
              37.3296016
            ],
            [
              -121.8883782,
              37.3296523
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7fba13cd-cad1-431b-b413-1b0874395dca",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.888318,
            37.329682
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8884134,
              37.3296354
            ],
            [
              -121.8883782,
              37.3296523
            ],
            [
              -121.8883398,
              37.3296016
            ],
            [
              -121.8883376,
              37.3295987
            ],
            [
              -121.8883283,
              37.3295864
            ],
            [
              -121.8883106,
              37.3295948
            ],
            [
              -121.8883013,
              37.3295993
            ],
            [
              -121.8883399,
              37.3296503
            ],
            [
              -121.8883261,
              37.3296569
            ],
            [
              -121.8883173,
              37.3296611
            ],
            [
              -121.8882667,
              37.3296853
            ],
            [
              -121.8882595,
              37.3296888
            ],
            [
              -121.8882507,
              37.329693
            ],
            [
              -121.8882035,
              37.3297157
            ],
            [
              -121.8882134,
              37.3297288
            ],
            [
              -121.8882365,
              37.3297592
            ],
            [
              -121.8882796,
              37.3297386
            ],
            [
              -121.8883098,
              37.3297241
            ],
            [
              -121.8883276,
              37.3297156
            ],
            [
              -121.8883712,
              37.3296947
            ],
            [
              -121.8883886,
              37.3296864
            ],
            [
              -121.8883976,
              37.3296821
            ],
            [
              -121.8883999,
              37.329681
            ],
            [
              -121.8884352,
              37.3296641
            ],
            [
              -121.8884134,
              37.3296354
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f1e17183-0fed-47b8-878e-1f888b7e9099",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.888216,
            37.329675
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8882035,
              37.3297157
            ],
            [
              -121.8882507,
              37.329693
            ],
            [
              -121.8882595,
              37.3296888
            ],
            [
              -121.8882667,
              37.3296853
            ],
            [
              -121.888247489976393,
              37.329659496423645
            ],
            [
              -121.8882282,
              37.3296343
            ],
            [
              -121.8882007,
              37.3296475
            ],
            [
              -121.8881648,
              37.3296646
            ],
            [
              -121.8882035,
              37.3297157
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "8ade1f78-5841-4b57-8386-75355c7e0252",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.888284,
            37.329642
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8883261,
              37.3296569
            ],
            [
              -121.8883399,
              37.3296503
            ],
            [
              -121.8883013,
              37.3295993
            ],
            [
              -121.8882282,
              37.3296343
            ],
            [
              -121.888247489976393,
              37.329659496423645
            ],
            [
              -121.8882667,
              37.3296853
            ],
            [
              -121.8883173,
              37.3296611
            ],
            [
              -121.8883261,
              37.3296569
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ff045317-8cfb-4c79-99e0-f9a751e80d43",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888163,
            37.329648
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881251,
              37.3296487
            ],
            [
              -121.8881281,
              37.3296527
            ],
            [
              -121.8881445,
              37.3296744
            ],
            [
              -121.8881472,
              37.3296731
            ],
            [
              -121.8881558,
              37.3296689
            ],
            [
              -121.8881648,
              37.3296646
            ],
            [
              -121.8882007,
              37.3296475
            ],
            [
              -121.8881813,
              37.3296218
            ],
            [
              -121.8881251,
              37.3296487
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7830d627-105b-4daa-a829-37152da127cb",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.888121,
            37.329671
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881281,
              37.3296527
            ],
            [
              -121.8881048,
              37.329664
            ],
            [
              -121.8880971,
              37.3296677
            ],
            [
              -121.8881135,
              37.3296892
            ],
            [
              -121.8881233,
              37.3296845
            ],
            [
              -121.8881349,
              37.3296789
            ],
            [
              -121.8881445,
              37.3296744
            ],
            [
              -121.8881281,
              37.3296527
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "2bc14a21-e130-4798-86b0-c94955c24bdc",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887994,
            37.329734
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879996,
              37.3297242
            ],
            [
              -121.887951,
              37.3297475
            ],
            [
              -121.8879618,
              37.3297618
            ],
            [
              -121.8880313,
              37.3297285
            ],
            [
              -121.8880212,
              37.3297151
            ],
            [
              -121.8880158,
              37.329708
            ],
            [
              -121.8880126,
              37.3297037
            ],
            [
              -121.8879917,
              37.3297137
            ],
            [
              -121.8879996,
              37.3297242
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4bf1057a-faac-41b7-9726-ff2dc72bbe10",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887696,
            37.329855
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8877588,
              37.3298589
            ],
            [
              -121.8877207,
              37.3298086
            ],
            [
              -121.8876323,
              37.3298509
            ],
            [
              -121.8876704,
              37.3299012
            ],
            [
              -121.8877588,
              37.3298589
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b6f13719-4210-48d5-846a-62e7f0519b1b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.887784,
            37.329813
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8877588,
              37.3298589
            ],
            [
              -121.8878217,
              37.3298288
            ],
            [
              -121.8878304,
              37.3298247
            ],
            [
              -121.8878474,
              37.3298165
            ],
            [
              -121.88782802079939,
              37.329790899644372
            ],
            [
              -121.8878093,
              37.3297662
            ],
            [
              -121.8877207,
              37.3298086
            ],
            [
              -121.8877588,
              37.3298589
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f75a328c-cf55-4d85-a211-a1b1b9726595",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.88729,
            37.32964
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8874902,
              37.329827
            ],
            [
              -121.8875201,
              37.3298512
            ],
            [
              -121.8872047,
              37.3294337
            ],
            [
              -121.8872017,
              37.3294298
            ],
            [
              -121.8870924,
              37.3295107
            ],
            [
              -121.8872066,
              37.3296031
            ],
            [
              -121.8871745,
              37.3296295
            ],
            [
              -121.887171,
              37.3296325
            ],
            [
              -121.8874491,
              37.3298578
            ],
            [
              -121.8874902,
              37.329827
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4012e1ae-19dd-499a-9def-6e07c9f63d56",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.8874,
            37.329305
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "2.5.01"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8872451,
              37.3293976
            ],
            [
              -121.8874824,
              37.3292841
            ],
            [
              -121.8874911,
              37.3292799
            ],
            [
              -121.8874928,
              37.3292791
            ],
            [
              -121.8874613,
              37.3292376
            ],
            [
              -121.8874293,
              37.3292613
            ],
            [
              -121.8872451,
              37.3293976
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3804920f-be39-45cc-bbfa-6c54b2dd0edf",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889682,
            37.32913
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8896556,
              37.3291766
            ],
            [
              -121.8897473,
              37.3291327
            ],
            [
              -121.8897093,
              37.3290824
            ],
            [
              -121.8896176,
              37.3291263
            ],
            [
              -121.8896556,
              37.3291766
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "5eb254ef-499c-4ae3-9f36-d0955861f563",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887572,
            37.329207
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.887593,
              37.3291626
            ],
            [
              -121.8875124,
              37.3292011
            ],
            [
              -121.8875505,
              37.3292515
            ],
            [
              -121.8875648,
              37.3292446
            ],
            [
              -121.8875735,
              37.3292405
            ],
            [
              -121.8876311,
              37.3292129
            ],
            [
              -121.887593,
              37.3291626
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "1cdbe58c-463f-42ad-8d06-788ce1e0ccbf",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.887745,
            37.329124
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "2.6.02"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8877196,
              37.3291706
            ],
            [
              -121.8877807,
              37.3291413
            ],
            [
              -121.8877895,
              37.3291371
            ],
            [
              -121.8878078,
              37.3291283
            ],
            [
              -121.8877697,
              37.329078
            ],
            [
              -121.8876815,
              37.3291202
            ],
            [
              -121.8877196,
              37.3291706
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ab919be3-110b-4705-b30b-1de916918fd5",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888119,
            37.328945
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "2.6.07"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881065,
              37.3289854
            ],
            [
              -121.8881152,
              37.3289812
            ],
            [
              -121.8881691,
              37.3289554
            ],
            [
              -121.888131,
              37.3289051
            ],
            [
              -121.8880684,
              37.328935
            ],
            [
              -121.8881065,
              37.3289854
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ff7770bc-e542-4c3e-b09d-7fc94a8fde97",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888178,
            37.328908
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881691,
              37.3289554
            ],
            [
              -121.8881786,
              37.3289509
            ],
            [
              -121.8881875,
              37.3289466
            ],
            [
              -121.8881948,
              37.3289431
            ],
            [
              -121.8881752,
              37.3289172
            ],
            [
              -121.8882299,
              37.328891
            ],
            [
              -121.8882114,
              37.3288666
            ],
            [
              -121.888131,
              37.3289051
            ],
            [
              -121.8881691,
              37.3289554
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "5fa7e68e-4d97-4ec8-996a-2afe8bb3e7df",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888212,
            37.328917
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "2.6.08"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881752,
              37.3289172
            ],
            [
              -121.8881948,
              37.3289431
            ],
            [
              -121.8881993,
              37.328941
            ],
            [
              -121.888208,
              37.3289368
            ],
            [
              -121.888208,
              37.3289368
            ],
            [
              -121.8882495,
              37.3289169
            ],
            [
              -121.8882299,
              37.328891
            ],
            [
              -121.8881752,
              37.3289172
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7358ad32-0b58-4566-bdb2-3c6479d3c417",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889447,
            37.328326
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "2.8.05"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8894838,
              37.3283214
            ],
            [
              -121.8894667,
              37.3282988
            ],
            [
              -121.8894071,
              37.3283274
            ],
            [
              -121.8894269,
              37.3283535
            ],
            [
              -121.8894565,
              37.3283393
            ],
            [
              -121.8894652,
              37.3283351
            ],
            [
              -121.8894864,
              37.3283249
            ],
            [
              -121.8894838,
              37.3283214
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b6d08029-5e10-4461-8802-b81606101a3a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889415,
            37.328315
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8894033,
              37.32836
            ],
            [
              -121.8894059,
              37.3283635
            ],
            [
              -121.8894153,
              37.328359
            ],
            [
              -121.8894239,
              37.3283549
            ],
            [
              -121.8894269,
              37.3283535
            ],
            [
              -121.8894071,
              37.3283274
            ],
            [
              -121.8894667,
              37.3282988
            ],
            [
              -121.8894484,
              37.3282746
            ],
            [
              -121.8893678,
              37.3283131
            ],
            [
              -121.8893705,
              37.3283166
            ],
            [
              -121.8894033,
              37.32836
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "8960b322-208d-46ab-a3f8-d5b6e6565d68",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.88887,
            37.328586
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888757,
              37.3286172
            ],
            [
              -121.8889017,
              37.3286048
            ],
            [
              -121.8888944,
              37.3285951
            ],
            [
              -121.8888874,
              37.3285859
            ],
            [
              -121.8888814,
              37.3285779
            ],
            [
              -121.8888753,
              37.3285699
            ],
            [
              -121.8888684,
              37.3285607
            ],
            [
              -121.8888636,
              37.3285544
            ],
            [
              -121.8888376,
              37.3285669
            ],
            [
              -121.8888757,
              37.3286172
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ca36667a-07b6-4f13-ae44-101efe218bfc",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.88889,
            37.328558
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888636,
              37.3285544
            ],
            [
              -121.8888684,
              37.3285607
            ],
            [
              -121.8888753,
              37.3285699
            ],
            [
              -121.8888814,
              37.3285779
            ],
            [
              -121.8889167,
              37.328561
            ],
            [
              -121.8888989,
              37.3285375
            ],
            [
              -121.8888636,
              37.3285544
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "8f3e39e8-af00-4ee2-8502-3de7f9165e00",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.888909,
            37.328583
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.888937,
              37.3285879
            ],
            [
              -121.8889167,
              37.328561
            ],
            [
              -121.8888814,
              37.3285779
            ],
            [
              -121.8888874,
              37.3285859
            ],
            [
              -121.8888944,
              37.3285951
            ],
            [
              -121.8889017,
              37.3286048
            ],
            [
              -121.888937,
              37.3285879
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "e651d64c-a3bc-4f13-80d7-a7bf17181dfd",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888767,
            37.328612
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8887813,
              37.3286124
            ],
            [
              -121.888825,
              37.3285915
            ],
            [
              -121.8888146,
              37.3285779
            ],
            [
              -121.8887494,
              37.3286091
            ],
            [
              -121.888752,
              37.3286126
            ],
            [
              -121.8887848,
              37.328656
            ],
            [
              -121.8887875,
              37.3286595
            ],
            [
              -121.8887968,
              37.328655
            ],
            [
              -121.8888055,
              37.3286508
            ],
            [
              -121.8888092,
              37.328649
            ],
            [
              -121.8887813,
              37.3286124
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7b2789ad-b254-46bc-9280-dbe8f41218ab",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888453,
            37.328785
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "2.7.06"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8884742,
              37.3287456
            ],
            [
              -121.8884715,
              37.3287421
            ],
            [
              -121.888396,
              37.3287783
            ],
            [
              -121.8883986,
              37.3287818
            ],
            [
              -121.8884314,
              37.3288251
            ],
            [
              -121.8884341,
              37.3288286
            ],
            [
              -121.8884738,
              37.3288096
            ],
            [
              -121.8884824,
              37.3288055
            ],
            [
              -121.8885097,
              37.3287924
            ],
            [
              -121.888507,
              37.3287889
            ],
            [
              -121.8884742,
              37.3287456
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "df323aac-68c5-416e-98ce-512f523f2f28",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.88884,
            37.329453
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888083,
              37.3294571
            ],
            [
              -121.8888202,
              37.3294729
            ],
            [
              -121.8888722,
              37.329448
            ],
            [
              -121.8888602,
              37.3294322
            ],
            [
              -121.8888083,
              37.3294571
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7b4ab115-0029-4d92-acce-84cd5ff57a0a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888864,
            37.329483
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "120.4"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888202,
              37.3294729
            ],
            [
              -121.8888432,
              37.3295032
            ],
            [
              -121.8888538,
              37.3295172
            ],
            [
              -121.8888551,
              37.3295189
            ],
            [
              -121.888907,
              37.3294941
            ],
            [
              -121.8888722,
              37.329448
            ],
            [
              -121.8888202,
              37.3294729
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "6df9ed51-031e-4c7f-adc6-4b3c7783fe94",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889467,
            37.329143
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8894349,
              37.3291494
            ],
            [
              -121.8894448,
              37.3291626
            ],
            [
              -121.8894819,
              37.3291449
            ],
            [
              -121.8894908,
              37.3291406
            ],
            [
              -121.889499,
              37.3291367
            ],
            [
              -121.889489,
              37.3291235
            ],
            [
              -121.8894349,
              37.3291494
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "12aff79b-eebe-408e-8735-c13ca7a9fcc0",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.889507,
            37.329119
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889499,
              37.3291367
            ],
            [
              -121.8895094,
              37.3291317
            ],
            [
              -121.889521,
              37.3291262
            ],
            [
              -121.8895314,
              37.3291212
            ],
            [
              -121.889516,
              37.3291008
            ],
            [
              -121.8894914,
              37.3291126
            ],
            [
              -121.8894835,
              37.3291163
            ],
            [
              -121.889489,
              37.3291235
            ],
            [
              -121.889499,
              37.3291367
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ea630126-a12b-419f-bd95-36800cfa75fe",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889552,
            37.329094
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8895314,
              37.3291212
            ],
            [
              -121.8895346,
              37.3291196
            ],
            [
              -121.8895434,
              37.3291154
            ],
            [
              -121.8895918,
              37.3290923
            ],
            [
              -121.8895723,
              37.3290664
            ],
            [
              -121.8895119,
              37.3290953
            ],
            [
              -121.889516,
              37.3291008
            ],
            [
              -121.8895314,
              37.3291212
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7c28c3a6-fd8c-4a87-a6f6-4c69a9d6174b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888351,
            37.32975
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "120.13"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8883712,
              37.3296947
            ],
            [
              -121.8883276,
              37.3297156
            ],
            [
              -121.8883098,
              37.3297241
            ],
            [
              -121.8882796,
              37.3297386
            ],
            [
              -121.8883307,
              37.3298062
            ],
            [
              -121.8883608,
              37.3297917
            ],
            [
              -121.8883787,
              37.3297832
            ],
            [
              -121.8884224,
              37.3297623
            ],
            [
              -121.8883712,
              37.3296947
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "66796807-6465-4882-b96a-e300a8135ba3",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888284,
            37.329783
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "120.12"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8882876,
              37.3298268
            ],
            [
              -121.8883307,
              37.3298062
            ],
            [
              -121.8882796,
              37.3297386
            ],
            [
              -121.8882365,
              37.3297592
            ],
            [
              -121.8882564,
              37.3297855
            ],
            [
              -121.8882687,
              37.3298019
            ],
            [
              -121.8882876,
              37.3298268
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "eb13a379-e11e-49cd-b04b-184f406c685b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889769,
            37.329088
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897473,
              37.3291327
            ],
            [
              -121.889766,
              37.3291237
            ],
            [
              -121.8898093,
              37.329103
            ],
            [
              -121.889828,
              37.3290941
            ],
            [
              -121.8897899,
              37.3290438
            ],
            [
              -121.8897093,
              37.3290824
            ],
            [
              -121.8897473,
              37.3291327
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "d08c8e05-e364-46c7-88fa-9f335307d077",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889935,
            37.329006
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889828,
              37.3290941
            ],
            [
              -121.8899242,
              37.329048
            ],
            [
              -121.8899062,
              37.3290243
            ],
            [
              -121.8899499,
              37.3290034
            ],
            [
              -121.8899677,
              37.3290272
            ],
            [
              -121.8900097,
              37.3290071
            ],
            [
              -121.8900365,
              37.3289943
            ],
            [
              -121.890027,
              37.3289818
            ],
            [
              -121.8900835,
              37.3289547
            ],
            [
              -121.8900548,
              37.3289169
            ],
            [
              -121.8897899,
              37.3290438
            ],
            [
              -121.889828,
              37.3290941
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b2bbf8d1-1c36-46f0-a26d-0c0af2e7ce3a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom",
        "display_point": {
          "coordinates": [
            -121.889937,
            37.329026
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8899499,
              37.3290034
            ],
            [
              -121.8899062,
              37.3290243
            ],
            [
              -121.8899242,
              37.329048
            ],
            [
              -121.8899348,
              37.3290429
            ],
            [
              -121.8899438,
              37.3290386
            ],
            [
              -121.8899677,
              37.3290272
            ],
            [
              -121.8899499,
              37.3290034
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "c58a0397-5d90-40a5-8769-6c8ce5873610",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.89006,
            37.328975
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8900835,
              37.3289547
            ],
            [
              -121.890027,
              37.3289818
            ],
            [
              -121.8900365,
              37.3289943
            ],
            [
              -121.8900768,
              37.328975
            ],
            [
              -121.8900855,
              37.3289708
            ],
            [
              -121.890093,
              37.3289672
            ],
            [
              -121.8900835,
              37.3289547
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "6dfd76a2-26ce-48bf-9f0b-b377bbc20b9e",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.890341,
            37.328882
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8900855,
              37.3289708
            ],
            [
              -121.8900768,
              37.328975
            ],
            [
              -121.8900365,
              37.3289943
            ],
            [
              -121.8900097,
              37.3290071
            ],
            [
              -121.8900285,
              37.3290321
            ],
            [
              -121.8900493,
              37.3290598
            ],
            [
              -121.8900574,
              37.3290707
            ],
            [
              -121.8900266,
              37.3290854
            ],
            [
              -121.8900342,
              37.3290954
            ],
            [
              -121.8900553,
              37.329123
            ],
            [
              -121.8900648,
              37.3291363
            ],
            [
              -121.890095,
              37.3291218
            ],
            [
              -121.8902186,
              37.3290626
            ],
            [
              -121.8901977,
              37.3290349
            ],
            [
              -121.8902094,
              37.3290292
            ],
            [
              -121.8901935,
              37.3290082
            ],
            [
              -121.8902525,
              37.32898
            ],
            [
              -121.8902607,
              37.328976
            ],
            [
              -121.8902585,
              37.3289731
            ],
            [
              -121.8902535,
              37.3289667
            ],
            [
              -121.8902885,
              37.32895
            ],
            [
              -121.8902934,
              37.3289564
            ],
            [
              -121.8902956,
              37.3289593
            ],
            [
              -121.8903079,
              37.3289535
            ],
            [
              -121.8903632,
              37.328927
            ],
            [
              -121.8904399,
              37.3288903
            ],
            [
              -121.8904042,
              37.3288431
            ],
            [
              -121.8904258,
              37.3288328
            ],
            [
              -121.8904671,
              37.328813
            ],
            [
              -121.8902989,
              37.3285909
            ],
            [
              -121.8901491,
              37.3286627
            ],
            [
              -121.8901403,
              37.3286668
            ],
            [
              -121.8901287,
              37.3286724
            ],
            [
              -121.8901222,
              37.3286755
            ],
            [
              -121.8901808,
              37.328753
            ],
            [
              -121.8902115,
              37.3287383
            ],
            [
              -121.8902693,
              37.3287107
            ],
            [
              -121.8902986,
              37.3287495
            ],
            [
              -121.8903473,
              37.3288139
            ],
            [
              -121.8903412,
              37.3288168
            ],
            [
              -121.8902589,
              37.3288561
            ],
            [
              -121.8902765,
              37.3288794
            ],
            [
              -121.890249,
              37.3288926
            ],
            [
              -121.8902109,
              37.3288422
            ],
            [
              -121.8901736,
              37.3288601
            ],
            [
              -121.8902117,
              37.3289104
            ],
            [
              -121.8901812,
              37.328925
            ],
            [
              -121.8901729,
              37.328929
            ],
            [
              -121.8901632,
              37.3289336
            ],
            [
              -121.890093,
              37.3289672
            ],
            [
              -121.8900855,
              37.3289708
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "daf434cf-7ef7-47e9-bea1-b5e7dc681b6f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.890118,
            37.328921
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": {
          "en": "130.5"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8900835,
              37.3289547
            ],
            [
              -121.890093,
              37.3289672
            ],
            [
              -121.8901632,
              37.3289336
            ],
            [
              -121.8901729,
              37.328929
            ],
            [
              -121.8901812,
              37.328925
            ],
            [
              -121.8901431,
              37.3288747
            ],
            [
              -121.8900548,
              37.3289169
            ],
            [
              -121.8900835,
              37.3289547
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "238c4141-910a-406e-b78c-c22dab28f76a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.890177,
            37.328893
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8901812,
              37.328925
            ],
            [
              -121.8902117,
              37.3289104
            ],
            [
              -121.8901736,
              37.3288601
            ],
            [
              -121.8901431,
              37.3288747
            ],
            [
              -121.8901812,
              37.328925
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "cb034945-9f83-47f7-818b-53dee4068415",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.890126,
            37.328658
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8901222,
              37.3286755
            ],
            [
              -121.8901287,
              37.3286724
            ],
            [
              -121.8901403,
              37.3286668
            ],
            [
              -121.8901491,
              37.3286627
            ],
            [
              -121.8901317,
              37.3286398
            ],
            [
              -121.890103,
              37.3286536
            ],
            [
              -121.8901203,
              37.3286764
            ],
            [
              -121.8901222,
              37.3286755
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a70e3e0a-2f7e-4317-a476-35a243b36d53",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.890267,
            37.328796
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902384,
              37.328829
            ],
            [
              -121.8902589,
              37.3288561
            ],
            [
              -121.8903412,
              37.3288168
            ],
            [
              -121.8903473,
              37.3288139
            ],
            [
              -121.8902986,
              37.3287495
            ],
            [
              -121.8902409,
              37.3287772
            ],
            [
              -121.8902115,
              37.3287383
            ],
            [
              -121.8901808,
              37.328753
            ],
            [
              -121.8902384,
              37.328829
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "326f5b07-e7e6-4265-afd3-41737b3da01a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.890255,
            37.328744
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902115,
              37.3287383
            ],
            [
              -121.8902409,
              37.3287772
            ],
            [
              -121.8902986,
              37.3287495
            ],
            [
              -121.8902693,
              37.3287107
            ],
            [
              -121.8902115,
              37.3287383
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "2aa45ab1-98e4-47d1-b22e-b2a357b9803d",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.890244,
            37.328861
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902384,
              37.328829
            ],
            [
              -121.8902109,
              37.3288422
            ],
            [
              -121.890249,
              37.3288926
            ],
            [
              -121.8902765,
              37.3288794
            ],
            [
              -121.8902589,
              37.3288561
            ],
            [
              -121.8902384,
              37.328829
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "e72319bc-fb4c-4fb7-a712-8da55e8f63d2",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "steps",
        "display_point": {
          "coordinates": [
            -121.890433,
            37.328862
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8904042,
              37.3288431
            ],
            [
              -121.8904399,
              37.3288903
            ],
            [
              -121.8904615,
              37.3288799
            ],
            [
              -121.8904258,
              37.3288328
            ],
            [
              -121.8904042,
              37.3288431
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3597a54d-90d5-4853-bf72-a0c807122643",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "steps",
        "display_point": {
          "coordinates": [
            -121.890275,
            37.328963
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902885,
              37.32895
            ],
            [
              -121.8902535,
              37.3289667
            ],
            [
              -121.8902585,
              37.3289731
            ],
            [
              -121.8902607,
              37.328976
            ],
            [
              -121.8902956,
              37.3289593
            ],
            [
              -121.8902934,
              37.3289564
            ],
            [
              -121.8902885,
              37.32895
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "1dd7ea28-eae5-4f9a-a7a2-21a74e03f2ef",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.890231,
            37.329005
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902094,
              37.3290292
            ],
            [
              -121.89023842343758,
              37.329015244436462
            ],
            [
              -121.8902684,
              37.3290011
            ],
            [
              -121.8902525,
              37.32898
            ],
            [
              -121.8901935,
              37.3290082
            ],
            [
              -121.8902094,
              37.3290292
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "93c6060f-dd4d-4946-9d56-b88a7f395ae0",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.890243,
            37.329032
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8901977,
              37.3290349
            ],
            [
              -121.8902186,
              37.3290626
            ],
            [
              -121.8902893,
              37.3290288
            ],
            [
              -121.8902684,
              37.3290011
            ],
            [
              -121.89023842343758,
              37.329015244436462
            ],
            [
              -121.8902094,
              37.3290292
            ],
            [
              -121.8901977,
              37.3290349
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "90b7d224-270c-4a64-a99d-4aa76859c650",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.890299,
            37.328991
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902525,
              37.32898
            ],
            [
              -121.8902684,
              37.3290011
            ],
            [
              -121.8902893,
              37.3290288
            ],
            [
              -121.890306,
              37.3290208
            ],
            [
              -121.8903241,
              37.3290121
            ],
            [
              -121.8903448,
              37.3290023
            ],
            [
              -121.8903235,
              37.3289741
            ],
            [
              -121.8903079,
              37.3289535
            ],
            [
              -121.8902956,
              37.3289593
            ],
            [
              -121.8902607,
              37.328976
            ],
            [
              -121.8902525,
              37.32898
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "91285dbc-bade-4438-a59c-2ef88e97528f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.890343,
            37.328951
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8903632,
              37.328927
            ],
            [
              -121.8903079,
              37.3289535
            ],
            [
              -121.8903235,
              37.3289741
            ],
            [
              -121.8903485,
              37.3289621
            ],
            [
              -121.8903789,
              37.3289476
            ],
            [
              -121.8903632,
              37.328927
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "01fa64c6-cdc1-48e9-8c48-4c0cfd1c657d",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.890367,
            37.328972
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8903485,
              37.3289621
            ],
            [
              -121.8903235,
              37.3289741
            ],
            [
              -121.8903448,
              37.3290023
            ],
            [
              -121.8904115,
              37.3289703
            ],
            [
              -121.8903902,
              37.3289422
            ],
            [
              -121.8903789,
              37.3289476
            ],
            [
              -121.8903485,
              37.3289621
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "74af3719-8b96-4937-ac00-09c10be05a48",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.890457,
            37.3289
          ],
          "type": "Point"
        },
        "level_id": "e537d463-475b-43c3-a650-184566c68bc9",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8903902,
              37.3289422
            ],
            [
              -121.8904115,
              37.3289703
            ],
            [
              -121.8905398,
              37.3289089
            ],
            [
              -121.8904671,
              37.328813
            ],
            [
              -121.8904258,
              37.3288328
            ],
            [
              -121.8904615,
              37.3288799
            ],
            [
              -121.8904399,
              37.3288903
            ],
            [
              -121.8903632,
              37.328927
            ],
            [
              -121.8903789,
              37.3289476
            ],
            [
              -121.8903902,
              37.3289422
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "81211d9e-9839-4cdb-989d-c985a4c5f531",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889901,
            37.329534
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897741,
              37.3292754
            ],
            [
              -121.8897412,
              37.3292911
            ],
            [
              -121.8897709,
              37.3293293
            ],
            [
              -121.8897034,
              37.3293616
            ],
            [
              -121.8896772,
              37.3293269
            ],
            [
              -121.8896533,
              37.3293384
            ],
            [
              -121.8898197,
              37.3295582
            ],
            [
              -121.8899797,
              37.3297696
            ],
            [
              -121.8899648,
              37.3297767
            ],
            [
              -121.8899713,
              37.3297852
            ],
            [
              -121.8900127,
              37.3297654
            ],
            [
              -121.890015,
              37.3297634
            ],
            [
              -121.8901189,
              37.3296962
            ],
            [
              -121.8901252,
              37.3296922
            ],
            [
              -121.8901227,
              37.3296888
            ],
            [
              -121.8899721,
              37.3294899
            ],
            [
              -121.8899233,
              37.3294254
            ],
            [
              -121.889865,
              37.3293486
            ],
            [
              -121.8898523,
              37.3293547
            ],
            [
              -121.8898407,
              37.3293601
            ],
            [
              -121.8897741,
              37.3292754
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "81d42240-5191-499b-bd41-06f0227d4016",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.888794,
            37.329482
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890543,
              37.3293495
            ],
            [
              -121.889031,
              37.3293606
            ],
            [
              -121.8889724,
              37.3293888
            ],
            [
              -121.8889624,
              37.3293755
            ],
            [
              -121.8889109,
              37.3293075
            ],
            [
              -121.8888625,
              37.3293307
            ],
            [
              -121.8888536,
              37.329335
            ],
            [
              -121.8888513,
              37.3293361
            ],
            [
              -121.8888447,
              37.3293392
            ],
            [
              -121.8888331,
              37.3293448
            ],
            [
              -121.888827,
              37.3293477
            ],
            [
              -121.8888191,
              37.3293514
            ],
            [
              -121.8887385,
              37.3293897
            ],
            [
              -121.8887517,
              37.3294074
            ],
            [
              -121.888663,
              37.3294499
            ],
            [
              -121.8886997,
              37.3294984
            ],
            [
              -121.8884278,
              37.3296286
            ],
            [
              -121.888378,
              37.3295637
            ],
            [
              -121.8883029,
              37.3295997
            ],
            [
              -121.8882852,
              37.3296082
            ],
            [
              -121.8878916,
              37.3290882
            ],
            [
              -121.8878156,
              37.3291246
            ],
            [
              -121.8878121,
              37.3291263
            ],
            [
              -121.8878068,
              37.3291288
            ],
            [
              -121.887798,
              37.3291331
            ],
            [
              -121.8877233,
              37.3291688
            ],
            [
              -121.8877184,
              37.3291711
            ],
            [
              -121.8877096,
              37.3291754
            ],
            [
              -121.8876311,
              37.3292129
            ],
            [
              -121.8875427,
              37.3292552
            ],
            [
              -121.887537,
              37.3292477
            ],
            [
              -121.8875317,
              37.3292407
            ],
            [
              -121.8875291,
              37.3292372
            ],
            [
              -121.8874482,
              37.3292759
            ],
            [
              -121.8874619,
              37.3292939
            ],
            [
              -121.8874728,
              37.3293083
            ],
            [
              -121.8875449,
              37.3294035
            ],
            [
              -121.8872768,
              37.3295291
            ],
            [
              -121.8872125,
              37.3295592
            ],
            [
              -121.8872139,
              37.329561
            ],
            [
              -121.8872245,
              37.329575
            ],
            [
              -121.8872265,
              37.3295777
            ],
            [
              -121.8872904,
              37.3295471
            ],
            [
              -121.8873213,
              37.3295323
            ],
            [
              -121.8873235,
              37.3295352
            ],
            [
              -121.8873342,
              37.3295493
            ],
            [
              -121.8873621,
              37.3295861
            ],
            [
              -121.8873632,
              37.3295877
            ],
            [
              -121.8873738,
              37.3296017
            ],
            [
              -121.88742,
              37.3296627
            ],
            [
              -121.8873892,
              37.3296779
            ],
            [
              -121.8873713,
              37.3296867
            ],
            [
              -121.8873866,
              37.3297069
            ],
            [
              -121.8874175,
              37.3297478
            ],
            [
              -121.8874263,
              37.3297594
            ],
            [
              -121.8874484,
              37.3297489
            ],
            [
              -121.8874696,
              37.3297769
            ],
            [
              -121.8874978,
              37.3298141
            ],
            [
              -121.8875047,
              37.3298232
            ],
            [
              -121.8874927,
              37.329829
            ],
            [
              -121.8875201,
              37.3298512
            ],
            [
              -121.8875616,
              37.3298848
            ],
            [
              -121.887568,
              37.3298817
            ],
            [
              -121.8875767,
              37.3298775
            ],
            [
              -121.8876323,
              37.3298509
            ],
            [
              -121.8877127,
              37.3298124
            ],
            [
              -121.8877215,
              37.3298082
            ],
            [
              -121.8877249,
              37.3298066
            ],
            [
              -121.8877304,
              37.329804
            ],
            [
              -121.8877392,
              37.3297997
            ],
            [
              -121.8878182,
              37.3297619
            ],
            [
              -121.8878565,
              37.3298124
            ],
            [
              -121.8878495,
              37.3298157
            ],
            [
              -121.8878635,
              37.3298341
            ],
            [
              -121.8878741,
              37.3298482
            ],
            [
              -121.8878994,
              37.3298816
            ],
            [
              -121.8879209,
              37.3299101
            ],
            [
              -121.8879465,
              37.3299438
            ],
            [
              -121.8879574,
              37.3299583
            ],
            [
              -121.8879617,
              37.329964
            ],
            [
              -121.8879787,
              37.3299558
            ],
            [
              -121.8880019,
              37.3299862
            ],
            [
              -121.8879848,
              37.3299944
            ],
            [
              -121.8879772,
              37.329998
            ],
            [
              -121.8879586,
              37.330007
            ],
            [
              -121.8879366,
              37.3300175
            ],
            [
              -121.887813,
              37.3300766
            ],
            [
              -121.8878058,
              37.3300801
            ],
            [
              -121.8878453,
              37.3301322
            ],
            [
              -121.8879558,
              37.3300791
            ],
            [
              -121.8879716,
              37.3301006
            ],
            [
              -121.8879859,
              37.3301198
            ],
            [
              -121.8879927,
              37.3301288
            ],
            [
              -121.8881346,
              37.3300614
            ],
            [
              -121.8881272,
              37.3300522
            ],
            [
              -121.8881128,
              37.3300331
            ],
            [
              -121.8880962,
              37.330012
            ],
            [
              -121.8882947,
              37.3299175
            ],
            [
              -121.888256,
              37.3298663
            ],
            [
              -121.8883716,
              37.3298105
            ],
            [
              -121.8884108,
              37.3298619
            ],
            [
              -121.8884341,
              37.3298508
            ],
            [
              -121.8883952,
              37.3297992
            ],
            [
              -121.888514,
              37.3297425
            ],
            [
              -121.8885529,
              37.3297939
            ],
            [
              -121.8885638,
              37.3298083
            ],
            [
              -121.8885932,
              37.3297943
            ],
            [
              -121.8886495,
              37.3297675
            ],
            [
              -121.8886322,
              37.3297446
            ],
            [
              -121.888643,
              37.3297466
            ],
            [
              -121.88866,
              37.3297497
            ],
            [
              -121.8886773,
              37.3297511
            ],
            [
              -121.8886947,
              37.3297507
            ],
            [
              -121.888712,
              37.3297487
            ],
            [
              -121.8887287,
              37.3297449
            ],
            [
              -121.8887448,
              37.3297395
            ],
            [
              -121.8887598,
              37.3297325
            ],
            [
              -121.8887737,
              37.3297241
            ],
            [
              -121.8887861,
              37.3297143
            ],
            [
              -121.8887968,
              37.3297034
            ],
            [
              -121.8888058,
              37.3296916
            ],
            [
              -121.8888128,
              37.3296789
            ],
            [
              -121.8888178,
              37.3296656
            ],
            [
              -121.8888221,
              37.3296542
            ],
            [
              -121.888839,
              37.3296766
            ],
            [
              -121.8888975,
              37.3296486
            ],
            [
              -121.8889156,
              37.32964
            ],
            [
              -121.8888996,
              37.3296188
            ],
            [
              -121.8889201,
              37.329609
            ],
            [
              -121.88895,
              37.3296485
            ],
            [
              -121.8889646,
              37.3296415
            ],
            [
              -121.8889807,
              37.3296338
            ],
            [
              -121.8889974,
              37.3296559
            ],
            [
              -121.8890606,
              37.3297395
            ],
            [
              -121.8890446,
              37.3297472
            ],
            [
              -121.88903,
              37.3297541
            ],
            [
              -121.8890589,
              37.3297923
            ],
            [
              -121.8890925,
              37.3297763
            ],
            [
              -121.8890996,
              37.3297729
            ],
            [
              -121.8891172,
              37.3297645
            ],
            [
              -121.8891236,
              37.3297614
            ],
            [
              -121.8891473,
              37.3297928
            ],
            [
              -121.8893961,
              37.3299621
            ],
            [
              -121.8894513,
              37.3300349
            ],
            [
              -121.8894531,
              37.3300373
            ],
            [
              -121.8894664,
              37.3300309
            ],
            [
              -121.8894853,
              37.3300218
            ],
            [
              -121.8894937,
              37.3300178
            ],
            [
              -121.8894875,
              37.3300096
            ],
            [
              -121.8895297,
              37.3299895
            ],
            [
              -121.8895288,
              37.3299883
            ],
            [
              -121.8895181,
              37.3299742
            ],
            [
              -121.8895107,
              37.329964
            ],
            [
              -121.8893745,
              37.329784
            ],
            [
              -121.8893684,
              37.329776
            ],
            [
              -121.8893333,
              37.3297296
            ],
            [
              -121.8892891,
              37.3297508
            ],
            [
              -121.8892873,
              37.3297516
            ],
            [
              -121.8892596,
              37.3297329
            ],
            [
              -121.8892695,
              37.3297237
            ],
            [
              -121.8892607,
              37.3297178
            ],
            [
              -121.8892092,
              37.3296828
            ],
            [
              -121.8892013,
              37.3296774
            ],
            [
              -121.8891862,
              37.3296671
            ],
            [
              -121.8891823,
              37.329662
            ],
            [
              -121.8891769,
              37.3296549
            ],
            [
              -121.8891677,
              37.3296427
            ],
            [
              -121.8891507,
              37.3296202
            ],
            [
              -121.8891524,
              37.3296194
            ],
            [
              -121.889168,
              37.3296122
            ],
            [
              -121.8891922,
              37.3296006
            ],
            [
              -121.8891825,
              37.3295878
            ],
            [
              -121.8891718,
              37.3295929
            ],
            [
              -121.8891583,
              37.3295994
            ],
            [
              -121.8891516,
              37.3295906
            ],
            [
              -121.8891352,
              37.3295983
            ],
            [
              -121.8891118,
              37.3295674
            ],
            [
              -121.8890997,
              37.3295732
            ],
            [
              -121.8890718,
              37.3295364
            ],
            [
              -121.8890909,
              37.3295273
            ],
            [
              -121.8891008,
              37.3295404
            ],
            [
              -121.8891029,
              37.3295394
            ],
            [
              -121.8891133,
              37.3295345
            ],
            [
              -121.8891222,
              37.3295302
            ],
            [
              -121.8891438,
              37.3295199
            ],
            [
              -121.8891617,
              37.3295435
            ],
            [
              -121.8892009,
              37.3295247
            ],
            [
              -121.8891967,
              37.3295191
            ],
            [
              -121.8891836,
              37.3295019
            ],
            [
              -121.8891712,
              37.3295079
            ],
            [
              -121.889125,
              37.3294467
            ],
            [
              -121.8891306,
              37.329444
            ],
            [
              -121.8892259,
              37.3293985
            ],
            [
              -121.8892325,
              37.3293953
            ],
            [
              -121.8892343,
              37.3293976
            ],
            [
              -121.8892678,
              37.3294419
            ],
            [
              -121.8892787,
              37.3294564
            ],
            [
              -121.8893008,
              37.3294459
            ],
            [
              -121.8893239,
              37.3294348
            ],
            [
              -121.8893465,
              37.329424
            ],
            [
              -121.8893356,
              37.3294096
            ],
            [
              -121.889302,
              37.3293652
            ],
            [
              -121.8893002,
              37.3293629
            ],
            [
              -121.8893073,
              37.3293595
            ],
            [
              -121.8894026,
              37.3293139
            ],
            [
              -121.8894092,
              37.3293107
            ],
            [
              -121.889411,
              37.3293131
            ],
            [
              -121.8894445,
              37.3293574
            ],
            [
              -121.8894554,
              37.3293718
            ],
            [
              -121.889478,
              37.329361
            ],
            [
              -121.8895011,
              37.32935
            ],
            [
              -121.8895236,
              37.3293392
            ],
            [
              -121.8895224,
              37.3293377
            ],
            [
              -121.889513,
              37.3293252
            ],
            [
              -121.8894773,
              37.3292781
            ],
            [
              -121.889484,
              37.3292749
            ],
            [
              -121.8895793,
              37.3292293
            ],
            [
              -121.8895819,
              37.3292281
            ],
            [
              -121.8896175,
              37.3292752
            ],
            [
              -121.8896281,
              37.3292892
            ],
            [
              -121.8896193,
              37.3292934
            ],
            [
              -121.8896306,
              37.3293083
            ],
            [
              -121.8896533,
              37.3293384
            ],
            [
              -121.8896772,
              37.3293269
            ],
            [
              -121.8896903,
              37.3293207
            ],
            [
              -121.8896992,
              37.3293164
            ],
            [
              -121.8897005,
              37.3293158
            ],
            [
              -121.8896976,
              37.329312
            ],
            [
              -121.8896844,
              37.3292946
            ],
            [
              -121.8896831,
              37.3292952
            ],
            [
              -121.8896744,
              37.3292994
            ],
            [
              -121.8896656,
              37.3293036
            ],
            [
              -121.8896645,
              37.3293022
            ],
            [
              -121.8896406,
              37.3292706
            ],
            [
              -121.8897021,
              37.3292407
            ],
            [
              -121.8897357,
              37.3292246
            ],
            [
              -121.8897741,
              37.3292754
            ],
            [
              -121.8897997,
              37.3292631
            ],
            [
              -121.8897613,
              37.3292124
            ],
            [
              -121.8900011,
              37.3290976
            ],
            [
              -121.8900395,
              37.3291483
            ],
            [
              -121.8900652,
              37.329136
            ],
            [
              -121.8900266,
              37.3290854
            ],
            [
              -121.8902465,
              37.3289802
            ],
            [
              -121.8902639,
              37.3290032
            ],
            [
              -121.8902804,
              37.3290249
            ],
            [
              -121.8902849,
              37.3290309
            ],
            [
              -121.8903453,
              37.329002
            ],
            [
              -121.8903408,
              37.328996
            ],
            [
              -121.8903243,
              37.3289743
            ],
            [
              -121.8903069,
              37.3289513
            ],
            [
              -121.8905014,
              37.3288582
            ],
            [
              -121.8902989,
              37.3285909
            ],
            [
              -121.8902662,
              37.3286066
            ],
            [
              -121.8901812,
              37.3286473
            ],
            [
              -121.8901491,
              37.3286627
            ],
            [
              -121.8901403,
              37.3286668
            ],
            [
              -121.8901287,
              37.3286724
            ],
            [
              -121.8901203,
              37.3286764
            ],
            [
              -121.8900906,
              37.3286906
            ],
            [
              -121.8900661,
              37.3287024
            ],
            [
              -121.8900182,
              37.3286391
            ],
            [
              -121.8900154,
              37.3286404
            ],
            [
              -121.8899849,
              37.328655
            ],
            [
              -121.889982,
              37.3286564
            ],
            [
              -121.8901981,
              37.3289419
            ],
            [
              -121.8901147,
              37.3289818
            ],
            [
              -121.8900178,
              37.3290282
            ],
            [
              -121.8900039,
              37.3290099
            ],
            [
              -121.8899203,
              37.3290499
            ],
            [
              -121.889828,
              37.3290941
            ],
            [
              -121.8898093,
              37.329103
            ],
            [
              -121.889766,
              37.3291237
            ],
            [
              -121.8897473,
              37.3291327
            ],
            [
              -121.8896643,
              37.3291724
            ],
            [
              -121.8896732,
              37.3291844
            ],
            [
              -121.8896547,
              37.3291932
            ],
            [
              -121.889627,
              37.3291567
            ],
            [
              -121.889637,
              37.3291519
            ],
            [
              -121.8895918,
              37.3290923
            ],
            [
              -121.8895434,
              37.3291154
            ],
            [
              -121.8895346,
              37.3291196
            ],
            [
              -121.8895314,
              37.3291212
            ],
            [
              -121.889521,
              37.3291262
            ],
            [
              -121.8895094,
              37.3291317
            ],
            [
              -121.889499,
              37.3291367
            ],
            [
              -121.8894186,
              37.3291752
            ],
            [
              -121.8894337,
              37.3291953
            ],
            [
              -121.8893367,
              37.3292414
            ],
            [
              -121.8893217,
              37.3292215
            ],
            [
              -121.8892378,
              37.3292617
            ],
            [
              -121.8891458,
              37.3293057
            ],
            [
              -121.8890543,
              37.3293495
            ]
          ],
          [
            [
              -121.8881589,
              37.3299093
            ],
            [
              -121.8881365,
              37.3298798
            ],
            [
              -121.8880556,
              37.3299192
            ],
            [
              -121.8880775,
              37.3299479
            ],
            [
              -121.8881589,
              37.3299093
            ]
          ],
          [
            [
              -121.8902583,
              37.328706
            ],
            [
              -121.8902303,
              37.3287194
            ],
            [
              -121.8902028,
              37.3287326
            ],
            [
              -121.8901764,
              37.3287452
            ],
            [
              -121.8901749,
              37.3287459
            ],
            [
              -121.8902158,
              37.3287999
            ],
            [
              -121.8902574,
              37.3288549
            ],
            [
              -121.8903408,
              37.328815
            ],
            [
              -121.8902992,
              37.32876
            ],
            [
              -121.8902583,
              37.328706
            ]
          ],
          [
            [
              -121.8875631,
              37.3298115
            ],
            [
              -121.8875737,
              37.3298255
            ],
            [
              -121.8875908,
              37.3298481
            ],
            [
              -121.8878038,
              37.3297462
            ],
            [
              -121.8878027,
              37.3297447
            ],
            [
              -121.887792,
              37.3297306
            ],
            [
              -121.8877123,
              37.3296252
            ],
            [
              -121.8877016,
              37.3296112
            ],
            [
              -121.8876961,
              37.3296038
            ],
            [
              -121.8876225,
              37.329639
            ],
            [
              -121.8876015,
              37.3296491
            ],
            [
              -121.8874831,
              37.3297057
            ],
            [
              -121.8875081,
              37.3297389
            ],
            [
              -121.8875188,
              37.3297529
            ],
            [
              -121.8875253,
              37.3297615
            ],
            [
              -121.8875613,
              37.3298091
            ],
            [
              -121.8875631,
              37.3298115
            ]
          ],
          [
            [
              -121.8876687,
              37.3295671
            ],
            [
              -121.8876634,
              37.3295601
            ],
            [
              -121.8876525,
              37.3295457
            ],
            [
              -121.8875735,
              37.3294414
            ],
            [
              -121.8875631,
              37.3294277
            ],
            [
              -121.887557,
              37.3294196
            ],
            [
              -121.8873437,
              37.3295216
            ],
            [
              -121.8873645,
              37.329549
            ],
            [
              -121.8873751,
              37.3295631
            ],
            [
              -121.8873762,
              37.3295645
            ],
            [
              -121.8874158,
              37.3296168
            ],
            [
              -121.8874205,
              37.3296231
            ],
            [
              -121.8874311,
              37.3296371
            ],
            [
              -121.8874554,
              37.3296692
            ],
            [
              -121.8875739,
              37.3296125
            ],
            [
              -121.8875948,
              37.3296025
            ],
            [
              -121.8876687,
              37.3295671
            ]
          ],
          [
            [
              -121.8879489,
              37.3297931
            ],
            [
              -121.8880065,
              37.3297656
            ],
            [
              -121.8879931,
              37.3297479
            ],
            [
              -121.8880154,
              37.3297373
            ],
            [
              -121.8880243,
              37.329733
            ],
            [
              -121.8880283,
              37.3297311
            ],
            [
              -121.8880325,
              37.3297291
            ],
            [
              -121.8880419,
              37.3297246
            ],
            [
              -121.8881218,
              37.3296863
            ],
            [
              -121.8881282,
              37.3296833
            ],
            [
              -121.8881398,
              37.3296777
            ],
            [
              -121.8881468,
              37.3296744
            ],
            [
              -121.8881565,
              37.3296698
            ],
            [
              -121.8882092,
              37.3296445
            ],
            [
              -121.8881891,
              37.3296181
            ],
            [
              -121.8881702,
              37.3295935
            ],
            [
              -121.8881597,
              37.3295795
            ],
            [
              -121.8881564,
              37.3295811
            ],
            [
              -121.8881202,
              37.3295334
            ],
            [
              -121.8881077,
              37.3295168
            ],
            [
              -121.888042,
              37.3294301
            ],
            [
              -121.8880297,
              37.3294138
            ],
            [
              -121.8879571,
              37.3293179
            ],
            [
              -121.8879449,
              37.3293018
            ],
            [
              -121.8878724,
              37.3292059
            ],
            [
              -121.8878597,
              37.3291892
            ],
            [
              -121.8878225,
              37.3291401
            ],
            [
              -121.8875717,
              37.3292601
            ],
            [
              -121.8875535,
              37.3292688
            ],
            [
              -121.8875803,
              37.3293043
            ],
            [
              -121.8876083,
              37.3293413
            ],
            [
              -121.8876643,
              37.3294152
            ],
            [
              -121.8876922,
              37.3294521
            ],
            [
              -121.8877474,
              37.329525
            ],
            [
              -121.8877754,
              37.329562
            ],
            [
              -121.8878314,
              37.3296359
            ],
            [
              -121.8878592,
              37.3296727
            ],
            [
              -121.8878979,
              37.3297238
            ],
            [
              -121.8879356,
              37.3297755
            ],
            [
              -121.8879489,
              37.3297931
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9d725acd-bdf5-417a-a7b5-13306e392541",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.888223,
            37.329984
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8882947,
              37.3299175
            ],
            [
              -121.8880962,
              37.330012
            ],
            [
              -121.8881128,
              37.3300331
            ],
            [
              -121.8881758,
              37.3300028
            ],
            [
              -121.8881904,
              37.3300219
            ],
            [
              -121.8881272,
              37.3300522
            ],
            [
              -121.8881346,
              37.3300614
            ],
            [
              -121.8883325,
              37.3299674
            ],
            [
              -121.8882947,
              37.3299175
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "947db578-5521-47ee-9938-07aa92a01659",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888764,
            37.328623
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8869393,
              37.3293867
            ],
            [
              -121.8870924,
              37.3295107
            ],
            [
              -121.8871745,
              37.329577
            ],
            [
              -121.8872125,
              37.3295592
            ],
            [
              -121.8872768,
              37.3295291
            ],
            [
              -121.8875449,
              37.3294035
            ],
            [
              -121.8874728,
              37.3293083
            ],
            [
              -121.8874619,
              37.3292939
            ],
            [
              -121.8874482,
              37.3292759
            ],
            [
              -121.8875291,
              37.3292372
            ],
            [
              -121.8875488,
              37.3292277
            ],
            [
              -121.8875521,
              37.329232
            ],
            [
              -121.8876206,
              37.3291992
            ],
            [
              -121.8875956,
              37.3291661
            ],
            [
              -121.887593,
              37.3291626
            ],
            [
              -121.8876852,
              37.3291185
            ],
            [
              -121.8877775,
              37.3290743
            ],
            [
              -121.8878156,
              37.3291246
            ],
            [
              -121.8878916,
              37.3290882
            ],
            [
              -121.8879845,
              37.3290438
            ],
            [
              -121.8879818,
              37.3290403
            ],
            [
              -121.887949,
              37.328997
            ],
            [
              -121.8879463,
              37.3289934
            ],
            [
              -121.8880425,
              37.3289474
            ],
            [
              -121.8880452,
              37.3289509
            ],
            [
              -121.888078,
              37.3289942
            ],
            [
              -121.8880807,
              37.3289978
            ],
            [
              -121.8881078,
              37.3289848
            ],
            [
              -121.888338,
              37.3288748
            ],
            [
              -121.8883352,
              37.3288711
            ],
            [
              -121.8883024,
              37.3288278
            ],
            [
              -121.8882998,
              37.3288243
            ],
            [
              -121.888396,
              37.3287783
            ],
            [
              -121.8884341,
              37.3288286
            ],
            [
              -121.888518,
              37.3287885
            ],
            [
              -121.8886029,
              37.3287478
            ],
            [
              -121.8885648,
              37.3286974
            ],
            [
              -121.8886613,
              37.3286513
            ],
            [
              -121.8886989,
              37.3287019
            ],
            [
              -121.8887373,
              37.3286835
            ],
            [
              -121.8888755,
              37.3286173
            ],
            [
              -121.8888377,
              37.3285668
            ],
            [
              -121.8888636,
              37.3285544
            ],
            [
              -121.8888989,
              37.3285375
            ],
            [
              -121.8889167,
              37.328561
            ],
            [
              -121.888937,
              37.3285879
            ],
            [
              -121.8889642,
              37.3285749
            ],
            [
              -121.8889261,
              37.3285245
            ],
            [
              -121.8890066,
              37.328486
            ],
            [
              -121.8890448,
              37.3285363
            ],
            [
              -121.8891375,
              37.328492
            ],
            [
              -121.8892213,
              37.3284518
            ],
            [
              -121.8891832,
              37.3284015
            ],
            [
              -121.8892794,
              37.3283555
            ],
            [
              -121.8893175,
              37.3284058
            ],
            [
              -121.8894059,
              37.3283635
            ],
            [
              -121.8894771,
              37.3283294
            ],
            [
              -121.8894602,
              37.3283075
            ],
            [
              -121.8893893,
              37.3283415
            ],
            [
              -121.8893678,
              37.3283131
            ],
            [
              -121.8894483,
              37.3282746
            ],
            [
              -121.8895445,
              37.3282286
            ],
            [
              -121.8895826,
              37.3282789
            ],
            [
              -121.8896661,
              37.3282389
            ],
            [
              -121.8897021,
              37.3282217
            ],
            [
              -121.889935,
              37.3281103
            ],
            [
              -121.889938,
              37.3281088
            ],
            [
              -121.8899801,
              37.3280887
            ],
            [
              -121.8899421,
              37.3280383
            ],
            [
              -121.8897029,
              37.3277213
            ],
            [
              -121.8893932,
              37.3278695
            ],
            [
              -121.8893583,
              37.3278234
            ],
            [
              -121.889263,
              37.3278691
            ],
            [
              -121.8892979,
              37.3279151
            ],
            [
              -121.8889445,
              37.3280843
            ],
            [
              -121.8891129,
              37.3283067
            ],
            [
              -121.8891566,
              37.3283656
            ],
            [
              -121.8883704,
              37.328746
            ],
            [
              -121.8883222,
              37.3286852
            ],
            [
              -121.8882612,
              37.3286045
            ],
            [
              -121.8881734,
              37.3286454
            ],
            [
              -121.8880921,
              37.3285367
            ],
            [
              -121.8880906,
              37.3285348
            ],
            [
              -121.8879295,
              37.3286539
            ],
            [
              -121.8877757,
              37.328768
            ],
            [
              -121.8873186,
              37.3291071
            ],
            [
              -121.8869393,
              37.3293867
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "427b3411-a15c-4443-acd9-87db084b2a70",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.888818,
            37.329823
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.888774,
              37.3299287
            ],
            [
              -121.8887889,
              37.3299484
            ],
            [
              -121.8889744,
              37.3298596
            ],
            [
              -121.8889595,
              37.3298399
            ],
            [
              -121.8890384,
              37.3298021
            ],
            [
              -121.8889827,
              37.3297286
            ],
            [
              -121.8889646,
              37.3297372
            ],
            [
              -121.888907,
              37.3297654
            ],
            [
              -121.888839,
              37.3296766
            ],
            [
              -121.8888221,
              37.3296542
            ],
            [
              -121.8888178,
              37.3296656
            ],
            [
              -121.8888128,
              37.3296789
            ],
            [
              -121.8888058,
              37.3296916
            ],
            [
              -121.8887968,
              37.3297034
            ],
            [
              -121.8887861,
              37.3297143
            ],
            [
              -121.8887737,
              37.3297241
            ],
            [
              -121.8887598,
              37.3297325
            ],
            [
              -121.8887448,
              37.3297395
            ],
            [
              -121.8887287,
              37.3297449
            ],
            [
              -121.888712,
              37.3297487
            ],
            [
              -121.8886947,
              37.3297507
            ],
            [
              -121.8886773,
              37.3297511
            ],
            [
              -121.88866,
              37.3297497
            ],
            [
              -121.888643,
              37.3297466
            ],
            [
              -121.8886322,
              37.3297446
            ],
            [
              -121.8886495,
              37.3297675
            ],
            [
              -121.8887162,
              37.3298566
            ],
            [
              -121.88866,
              37.3298833
            ],
            [
              -121.888631,
              37.3298971
            ],
            [
              -121.8886866,
              37.3299706
            ],
            [
              -121.888774,
              37.3299287
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "c302ea24-1a37-46c1-83e3-bf2733a81770",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.890239,
            37.32903
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902639,
              37.3290032
            ],
            [
              -121.8901977,
              37.3290349
            ],
            [
              -121.8902142,
              37.3290567
            ],
            [
              -121.8902804,
              37.3290249
            ],
            [
              -121.8902639,
              37.3290032
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "48735436-d583-4a62-8395-b00dc3543a52",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.890143,
            37.329062
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902849,
              37.3290309
            ],
            [
              -121.8902804,
              37.3290249
            ],
            [
              -121.8902142,
              37.3290567
            ],
            [
              -121.8901977,
              37.3290349
            ],
            [
              -121.8902639,
              37.3290032
            ],
            [
              -121.8902465,
              37.3289802
            ],
            [
              -121.8900266,
              37.3290854
            ],
            [
              -121.8900652,
              37.329136
            ],
            [
              -121.890095,
              37.3291218
            ],
            [
              -121.8902849,
              37.3290309
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f4a82cd0-c3ae-4c5f-95bb-07980bd4b83a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.890433,
            37.328923
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8905014,
              37.3288582
            ],
            [
              -121.8903069,
              37.3289513
            ],
            [
              -121.8903243,
              37.3289743
            ],
            [
              -121.8903906,
              37.3289425
            ],
            [
              -121.8904071,
              37.3289644
            ],
            [
              -121.8903408,
              37.328996
            ],
            [
              -121.8903453,
              37.329002
            ],
            [
              -121.8905398,
              37.3289089
            ],
            [
              -121.8905014,
              37.3288582
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9b94f399-5448-49a9-a942-2b375bab5899",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.890366,
            37.328969
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8903408,
              37.328996
            ],
            [
              -121.8904071,
              37.3289644
            ],
            [
              -121.8903906,
              37.3289425
            ],
            [
              -121.8903243,
              37.3289743
            ],
            [
              -121.8903408,
              37.328996
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "0592b699-ea50-4ba2-9218-cb9293e94023",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.8899,
            37.32918
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897613,
              37.3292124
            ],
            [
              -121.8897997,
              37.3292631
            ],
            [
              -121.8900395,
              37.3291483
            ],
            [
              -121.8900011,
              37.3290976
            ],
            [
              -121.8897613,
              37.3292124
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "cf026aa3-522e-4873-af56-712d17652170",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.889738,
            37.329258
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897357,
              37.3292246
            ],
            [
              -121.8897021,
              37.3292407
            ],
            [
              -121.8897039,
              37.329243
            ],
            [
              -121.8897412,
              37.3292911
            ],
            [
              -121.8897741,
              37.3292754
            ],
            [
              -121.8897357,
              37.3292246
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "d5d1a2d1-4d14-44ca-88be-97e99faf13d0",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.889692,
            37.329278
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897021,
              37.3292407
            ],
            [
              -121.8896406,
              37.3292706
            ],
            [
              -121.8896645,
              37.3293022
            ],
            [
              -121.8896656,
              37.3293036
            ],
            [
              -121.8896744,
              37.3292994
            ],
            [
              -121.8896831,
              37.3292952
            ],
            [
              -121.8896844,
              37.3292946
            ],
            [
              -121.8896976,
              37.329312
            ],
            [
              -121.889717110046433,
              37.329302672186735
            ],
            [
              -121.8897412,
              37.3292911
            ],
            [
              -121.8897039,
              37.329243
            ],
            [
              -121.8897021,
              37.3292407
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9e0cdcd1-7b86-4f50-839d-d8e4a5ac9235",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889609,
            37.329678
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "220A, 220B, 220C"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8898197,
              37.3295582
            ],
            [
              -121.8896533,
              37.3293384
            ],
            [
              -121.8896306,
              37.3293083
            ],
            [
              -121.8896193,
              37.3292934
            ],
            [
              -121.8895236,
              37.3293392
            ],
            [
              -121.8895011,
              37.32935
            ],
            [
              -121.889478,
              37.329361
            ],
            [
              -121.8894554,
              37.3293718
            ],
            [
              -121.8894012,
              37.3293978
            ],
            [
              -121.8893465,
              37.329424
            ],
            [
              -121.8893239,
              37.3294348
            ],
            [
              -121.8893008,
              37.3294459
            ],
            [
              -121.8892787,
              37.3294564
            ],
            [
              -121.8891836,
              37.3295019
            ],
            [
              -121.8891967,
              37.3295191
            ],
            [
              -121.8892009,
              37.3295247
            ],
            [
              -121.8892238,
              37.329555
            ],
            [
              -121.8892407,
              37.3295774
            ],
            [
              -121.8892932,
              37.3296467
            ],
            [
              -121.8893061,
              37.3296637
            ],
            [
              -121.8893204,
              37.3296568
            ],
            [
              -121.8893611,
              37.3297105
            ],
            [
              -121.8893643,
              37.3297148
            ],
            [
              -121.8893333,
              37.3297296
            ],
            [
              -121.8893684,
              37.329776
            ],
            [
              -121.8893745,
              37.329784
            ],
            [
              -121.8895107,
              37.329964
            ],
            [
              -121.8895181,
              37.3299742
            ],
            [
              -121.8895288,
              37.3299883
            ],
            [
              -121.8895297,
              37.3299895
            ],
            [
              -121.8895613,
              37.3299743
            ],
            [
              -121.8895661,
              37.3299806
            ],
            [
              -121.8895767,
              37.3299946
            ],
            [
              -121.8896028,
              37.3300291
            ],
            [
              -121.8896135,
              37.3300432
            ],
            [
              -121.8896217,
              37.330054
            ],
            [
              -121.8900275,
              37.3298593
            ],
            [
              -121.8900064,
              37.3298315
            ],
            [
              -121.8899809,
              37.329798
            ],
            [
              -121.8899713,
              37.3297852
            ],
            [
              -121.8899648,
              37.3297767
            ],
            [
              -121.8899797,
              37.3297696
            ],
            [
              -121.8898197,
              37.3295582
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "693b2fb2-3e03-4221-97fe-190e49701662",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.889553,
            37.329284
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8896175,
              37.3292752
            ],
            [
              -121.8895819,
              37.3292281
            ],
            [
              -121.8895793,
              37.3292293
            ],
            [
              -121.889484,
              37.3292749
            ],
            [
              -121.8894773,
              37.3292781
            ],
            [
              -121.889513,
              37.3293252
            ],
            [
              -121.8895224,
              37.3293377
            ],
            [
              -121.8895236,
              37.3293392
            ],
            [
              -121.8896193,
              37.3292934
            ],
            [
              -121.8896281,
              37.3292892
            ],
            [
              -121.8896175,
              37.3292752
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4e107e75-4ce3-498f-9496-d7c59e5863de",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889278,
            37.329692
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8893061,
              37.3296637
            ],
            [
              -121.8892932,
              37.3296467
            ],
            [
              -121.8892295,
              37.3296772
            ],
            [
              -121.8891939,
              37.3296301
            ],
            [
              -121.8891677,
              37.3296427
            ],
            [
              -121.8891769,
              37.3296549
            ],
            [
              -121.8891823,
              37.329662
            ],
            [
              -121.8891862,
              37.3296671
            ],
            [
              -121.8892013,
              37.3296774
            ],
            [
              -121.8892092,
              37.3296828
            ],
            [
              -121.8892607,
              37.3297178
            ],
            [
              -121.8892695,
              37.3297237
            ],
            [
              -121.8892596,
              37.3297329
            ],
            [
              -121.8892873,
              37.3297516
            ],
            [
              -121.8892891,
              37.3297508
            ],
            [
              -121.8893333,
              37.3297296
            ],
            [
              -121.8893643,
              37.3297148
            ],
            [
              -121.8893611,
              37.3297105
            ],
            [
              -121.8893204,
              37.3296568
            ],
            [
              -121.8893061,
              37.3296637
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "77179e92-f8ff-4a2b-80f5-0393c65be407",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889555,
            37.330032
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8895297,
              37.3299895
            ],
            [
              -121.8894875,
              37.3300096
            ],
            [
              -121.8894937,
              37.3300178
            ],
            [
              -121.8895457,
              37.3300864
            ],
            [
              -121.889548,
              37.3300894
            ],
            [
              -121.8896217,
              37.330054
            ],
            [
              -121.8896135,
              37.3300432
            ],
            [
              -121.8896028,
              37.3300291
            ],
            [
              -121.8895767,
              37.3299946
            ],
            [
              -121.8895661,
              37.3299806
            ],
            [
              -121.8895613,
              37.3299743
            ],
            [
              -121.8895297,
              37.3299895
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3256546e-4f98-4a38-842a-d51ec1b948dc",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.889724,
            37.329327
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897709,
              37.3293293
            ],
            [
              -121.8897412,
              37.3292911
            ],
            [
              -121.889717110046433,
              37.329302672186735
            ],
            [
              -121.8896976,
              37.329312
            ],
            [
              -121.8897005,
              37.3293158
            ],
            [
              -121.8896992,
              37.3293164
            ],
            [
              -121.8896903,
              37.3293207
            ],
            [
              -121.8896772,
              37.3293269
            ],
            [
              -121.8897034,
              37.3293616
            ],
            [
              -121.8897709,
              37.3293293
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "2c6367a9-75e8-4d05-b8f9-ba72dd293114",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.889378,
            37.329367
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8893073,
              37.3293595
            ],
            [
              -121.8893002,
              37.3293629
            ],
            [
              -121.889302,
              37.3293652
            ],
            [
              -121.8893356,
              37.3294096
            ],
            [
              -121.8893465,
              37.329424
            ],
            [
              -121.8894012,
              37.3293978
            ],
            [
              -121.8894554,
              37.3293718
            ],
            [
              -121.8894445,
              37.3293574
            ],
            [
              -121.889411,
              37.3293131
            ],
            [
              -121.8894092,
              37.3293107
            ],
            [
              -121.8894026,
              37.3293139
            ],
            [
              -121.8893073,
              37.3293595
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "55ab1a93-1177-4a9f-8bae-45a523039d74",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.889202,
            37.329452
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891306,
              37.329444
            ],
            [
              -121.889125,
              37.3294467
            ],
            [
              -121.8891712,
              37.3295079
            ],
            [
              -121.8891836,
              37.3295019
            ],
            [
              -121.8892787,
              37.3294564
            ],
            [
              -121.8892678,
              37.3294419
            ],
            [
              -121.8892343,
              37.3293976
            ],
            [
              -121.8892325,
              37.3293953
            ],
            [
              -121.8892259,
              37.3293985
            ],
            [
              -121.8891306,
              37.329444
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9f15ede2-240a-408d-bccc-c8c6d057fab6",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889092,
            37.329549
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890718,
              37.3295364
            ],
            [
              -121.8890997,
              37.3295732
            ],
            [
              -121.8891118,
              37.3295674
            ],
            [
              -121.8890939,
              37.3295437
            ],
            [
              -121.8891008,
              37.3295404
            ],
            [
              -121.8890909,
              37.3295273
            ],
            [
              -121.8890718,
              37.3295364
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f0ef70a1-3f07-442f-abf9-b487a37a790a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.889117,
            37.329549
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890939,
              37.3295437
            ],
            [
              -121.8891118,
              37.3295674
            ],
            [
              -121.8891401,
              37.3295538
            ],
            [
              -121.8891222,
              37.3295302
            ],
            [
              -121.8891133,
              37.3295345
            ],
            [
              -121.8891029,
              37.3295394
            ],
            [
              -121.8891008,
              37.3295404
            ],
            [
              -121.8890939,
              37.3295437
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "fa3b15e7-b113-42c7-9527-3074e2a0ddbd",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889142,
            37.329537
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891222,
              37.3295302
            ],
            [
              -121.8891401,
              37.3295538
            ],
            [
              -121.8891617,
              37.3295435
            ],
            [
              -121.8891438,
              37.3295199
            ],
            [
              -121.8891222,
              37.3295302
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "d63ad19d-a49c-42e1-b740-4285d76784a9",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.889168,
            37.32956
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891118,
              37.3295674
            ],
            [
              -121.8891352,
              37.3295983
            ],
            [
              -121.8891516,
              37.3295906
            ],
            [
              -121.8891475,
              37.3295851
            ],
            [
              -121.8891735,
              37.3295727
            ],
            [
              -121.889177,
              37.3295773
            ],
            [
              -121.8892238,
              37.329555
            ],
            [
              -121.8892009,
              37.3295247
            ],
            [
              -121.8891617,
              37.3295435
            ],
            [
              -121.8891401,
              37.3295538
            ],
            [
              -121.8891118,
              37.3295674
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "622692ae-2e80-4b70-a771-b5b89c6d48a6",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889197,
            37.32958
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891718,
              37.3295929
            ],
            [
              -121.8891825,
              37.3295878
            ],
            [
              -121.8891922,
              37.3296006
            ],
            [
              -121.8892407,
              37.3295774
            ],
            [
              -121.8892238,
              37.329555
            ],
            [
              -121.889177,
              37.3295773
            ],
            [
              -121.8891735,
              37.3295727
            ],
            [
              -121.8891475,
              37.3295851
            ],
            [
              -121.8891516,
              37.3295906
            ],
            [
              -121.8891583,
              37.3295994
            ],
            [
              -121.8891718,
              37.3295929
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "13db747d-a407-4f3e-8b87-10f5d9ddd209",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.889228,
            37.329627
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889168,
              37.3296122
            ],
            [
              -121.8891524,
              37.3296194
            ],
            [
              -121.8891507,
              37.3296202
            ],
            [
              -121.8891677,
              37.3296427
            ],
            [
              -121.8891939,
              37.3296301
            ],
            [
              -121.8892295,
              37.3296772
            ],
            [
              -121.8892932,
              37.3296467
            ],
            [
              -121.8892407,
              37.3295774
            ],
            [
              -121.8891922,
              37.3296006
            ],
            [
              -121.889168,
              37.3296122
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "dbf081ed-120a-4124-b4f2-219321cd5d90",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888979,
            37.329706
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890589,
              37.3297923
            ],
            [
              -121.88903,
              37.3297541
            ],
            [
              -121.88895,
              37.3296485
            ],
            [
              -121.8889201,
              37.329609
            ],
            [
              -121.8888996,
              37.3296188
            ],
            [
              -121.8889156,
              37.32964
            ],
            [
              -121.8889827,
              37.3297286
            ],
            [
              -121.8890384,
              37.3298021
            ],
            [
              -121.8890469,
              37.3297981
            ],
            [
              -121.8890589,
              37.3297923
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "412f88b8-d469-43a4-99d3-1d71a92d2ea3",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.889013,
            37.32969
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8889974,
              37.3296559
            ],
            [
              -121.8889807,
              37.3296338
            ],
            [
              -121.8889646,
              37.3296415
            ],
            [
              -121.889004813558131,
              37.329694662826746
            ],
            [
              -121.8890446,
              37.3297472
            ],
            [
              -121.8890606,
              37.3297395
            ],
            [
              -121.8889974,
              37.3296559
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "269236f4-b17b-45bf-bd31-820dee3807a2",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.888997,
            37.329698
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.88903,
              37.3297541
            ],
            [
              -121.8890446,
              37.3297472
            ],
            [
              -121.889004813558131,
              37.329694662826746
            ],
            [
              -121.8889646,
              37.3296415
            ],
            [
              -121.88895,
              37.3296485
            ],
            [
              -121.88903,
              37.3297541
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a1ad20e6-8e96-41e5-b41e-abdad0e912ff",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888902,
            37.329707
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888975,
              37.3296486
            ],
            [
              -121.888839,
              37.3296766
            ],
            [
              -121.888907,
              37.3297654
            ],
            [
              -121.8889646,
              37.3297372
            ],
            [
              -121.8888975,
              37.3296486
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "385f6201-ea8e-4248-81e8-6dd7d48b7d42",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.88894,
            37.329689
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8889827,
              37.3297286
            ],
            [
              -121.8889156,
              37.32964
            ],
            [
              -121.8888975,
              37.3296486
            ],
            [
              -121.8889646,
              37.3297372
            ],
            [
              -121.8889827,
              37.3297286
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "92e395d7-bd94-4f34-8ab5-d41bcaef5a50",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888655,
            37.329825
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8887162,
              37.3298566
            ],
            [
              -121.8886495,
              37.3297675
            ],
            [
              -121.8885932,
              37.3297943
            ],
            [
              -121.88866,
              37.3298833
            ],
            [
              -121.8887162,
              37.3298566
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ea3f1c81-d47b-41bb-9411-6099033d951a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "escalator",
        "display_point": {
          "coordinates": [
            -121.888612,
            37.329846
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.88866,
              37.3298833
            ],
            [
              -121.8885932,
              37.3297943
            ],
            [
              -121.8885638,
              37.3298083
            ],
            [
              -121.888631,
              37.3298971
            ],
            [
              -121.88866,
              37.3298833
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ccf0e163-0c11-478b-ae65-0d5343e9d1c8",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.888474,
            37.329797
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8885529,
              37.3297939
            ],
            [
              -121.888514,
              37.3297425
            ],
            [
              -121.8883952,
              37.3297992
            ],
            [
              -121.8884341,
              37.3298508
            ],
            [
              -121.8885529,
              37.3297939
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "120bce7f-b8ec-4eef-b59f-36c99daad4b4",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.888333,
            37.329864
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8884108,
              37.3298619
            ],
            [
              -121.8883716,
              37.3298105
            ],
            [
              -121.888256,
              37.3298663
            ],
            [
              -121.8882947,
              37.3299175
            ],
            [
              -121.8884108,
              37.3298619
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "6b2c870d-6976-40ea-a360-85180578789f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888152,
            37.330027
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881272,
              37.3300522
            ],
            [
              -121.8881904,
              37.3300219
            ],
            [
              -121.8881758,
              37.3300028
            ],
            [
              -121.8881128,
              37.3300331
            ],
            [
              -121.8881272,
              37.3300522
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "2770213a-acfe-4688-a4db-37b8a81446f1",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887942,
            37.330128
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879859,
              37.3301198
            ],
            [
              -121.8879716,
              37.3301006
            ],
            [
              -121.8878972,
              37.3301362
            ],
            [
              -121.8879117,
              37.3301553
            ],
            [
              -121.8879859,
              37.3301198
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "18e4963d-0a52-495d-b9ae-d27420cba0d1",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.887881,
            37.33015
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8878972,
              37.3301362
            ],
            [
              -121.8879716,
              37.3301006
            ],
            [
              -121.8879558,
              37.3300791
            ],
            [
              -121.8878453,
              37.3301322
            ],
            [
              -121.8878824,
              37.3301812
            ],
            [
              -121.8879927,
              37.3301288
            ],
            [
              -121.8879859,
              37.3301198
            ],
            [
              -121.8879117,
              37.3301553
            ],
            [
              -121.8878972,
              37.3301362
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "1abd2708-f66b-430f-81b3-87f7480a06b7",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.888539,
            37.32953
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8886997,
              37.3294984
            ],
            [
              -121.888663,
              37.3294499
            ],
            [
              -121.8886495,
              37.329432
            ],
            [
              -121.8885576,
              37.3294766
            ],
            [
              -121.888466,
              37.329521
            ],
            [
              -121.888378,
              37.3295637
            ],
            [
              -121.8884278,
              37.3296286
            ],
            [
              -121.8886997,
              37.3294984
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ffbb515b-cd1a-42a5-b907-f85b14dcef96",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888701,
            37.32942
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8887517,
              37.3294074
            ],
            [
              -121.8887385,
              37.3293897
            ],
            [
              -121.8886495,
              37.329432
            ],
            [
              -121.888663,
              37.3294499
            ],
            [
              -121.8887517,
              37.3294074
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "93c5ff15-f4e7-422e-9f57-c984f68c758a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888107,
            37.329914
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881589,
              37.3299093
            ],
            [
              -121.8881365,
              37.3298798
            ],
            [
              -121.8880556,
              37.3299192
            ],
            [
              -121.8880775,
              37.3299479
            ],
            [
              -121.8881589,
              37.3299093
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "cddc0698-5d8d-4830-bf4d-b12ca7ff4618",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887982,
            37.329975
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879787,
              37.3299558
            ],
            [
              -121.8879617,
              37.329964
            ],
            [
              -121.8879848,
              37.3299944
            ],
            [
              -121.8880019,
              37.3299862
            ],
            [
              -121.8879787,
              37.3299558
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a0326108-69ce-45b2-87bf-8b327eedcab5",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887576,
            37.329282
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8875535,
              37.3292688
            ],
            [
              -121.8875803,
              37.3293043
            ],
            [
              -121.8875986,
              37.3292956
            ],
            [
              -121.8875717,
              37.3292601
            ],
            [
              -121.8875535,
              37.3292688
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4f297988-ed46-405d-b55b-01d606bdc000",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.88805,
            37.329647
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881702,
              37.3295935
            ],
            [
              -121.8881597,
              37.3295795
            ],
            [
              -121.8881564,
              37.3295811
            ],
            [
              -121.8879056,
              37.3297011
            ],
            [
              -121.8878774,
              37.3296639
            ],
            [
              -121.8878592,
              37.3296727
            ],
            [
              -121.8878979,
              37.3297238
            ],
            [
              -121.8879895,
              37.3296799
            ],
            [
              -121.8880831,
              37.3296352
            ],
            [
              -121.8881049,
              37.329664
            ],
            [
              -121.8881298,
              37.329652
            ],
            [
              -121.8881267,
              37.3296479
            ],
            [
              -121.8881813,
              37.3296218
            ],
            [
              -121.8881891,
              37.3296181
            ],
            [
              -121.8881702,
              37.3295935
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "37395f92-7865-48fc-9c92-927f31781db8",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.887861,
            37.329422
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "210A, 210B, 210C, 210D, 210E, 210F, 210G, 210H"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8878774,
              37.3296639
            ],
            [
              -121.8879056,
              37.3297011
            ],
            [
              -121.8881564,
              37.3295811
            ],
            [
              -121.8881202,
              37.3295334
            ],
            [
              -121.8881077,
              37.3295168
            ],
            [
              -121.888042,
              37.3294301
            ],
            [
              -121.8880297,
              37.3294138
            ],
            [
              -121.8879571,
              37.3293179
            ],
            [
              -121.8879449,
              37.3293018
            ],
            [
              -121.8878724,
              37.3292059
            ],
            [
              -121.8878597,
              37.3291892
            ],
            [
              -121.8878225,
              37.3291401
            ],
            [
              -121.8875717,
              37.3292601
            ],
            [
              -121.8875986,
              37.3292956
            ],
            [
              -121.8875803,
              37.3293043
            ],
            [
              -121.8876083,
              37.3293413
            ],
            [
              -121.8876265,
              37.3293325
            ],
            [
              -121.8876569,
              37.3293727
            ],
            [
              -121.8876825,
              37.3294065
            ],
            [
              -121.8876643,
              37.3294152
            ],
            [
              -121.8876922,
              37.3294521
            ],
            [
              -121.8877104,
              37.3294434
            ],
            [
              -121.8877399,
              37.3294824
            ],
            [
              -121.8877657,
              37.3295163
            ],
            [
              -121.8877474,
              37.329525
            ],
            [
              -121.8877754,
              37.329562
            ],
            [
              -121.8877936,
              37.3295532
            ],
            [
              -121.8878238,
              37.3295931
            ],
            [
              -121.8878496,
              37.3296272
            ],
            [
              -121.8878314,
              37.3296359
            ],
            [
              -121.8878592,
              37.3296727
            ],
            [
              -121.8878774,
              37.3296639
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "426e42db-4696-48b0-ba52-5f8d1f831edb",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887812,
            37.329595
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8878496,
              37.3296272
            ],
            [
              -121.8878238,
              37.3295931
            ],
            [
              -121.8877936,
              37.3295532
            ],
            [
              -121.8877754,
              37.329562
            ],
            [
              -121.8878314,
              37.3296359
            ],
            [
              -121.8878496,
              37.3296272
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "106b8511-ac35-4a94-b7ab-a2abab021422",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887729,
            37.329484
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8877657,
              37.3295163
            ],
            [
              -121.8877399,
              37.3294824
            ],
            [
              -121.8877104,
              37.3294434
            ],
            [
              -121.8876922,
              37.3294521
            ],
            [
              -121.8877474,
              37.329525
            ],
            [
              -121.8877657,
              37.3295163
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9c0d35fa-e804-4582-b04f-ee46a1151f3a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887645,
            37.329374
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8876825,
              37.3294065
            ],
            [
              -121.8876569,
              37.3293727
            ],
            [
              -121.8876265,
              37.3293325
            ],
            [
              -121.8876083,
              37.3293413
            ],
            [
              -121.8876643,
              37.3294152
            ],
            [
              -121.8876825,
              37.3294065
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "c07a5f92-a334-4029-92c5-91a2bad270c0",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888168,
            37.329646
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881267,
              37.3296479
            ],
            [
              -121.8881298,
              37.329652
            ],
            [
              -121.8881468,
              37.3296744
            ],
            [
              -121.8881565,
              37.3296698
            ],
            [
              -121.8882092,
              37.3296445
            ],
            [
              -121.8881891,
              37.3296181
            ],
            [
              -121.8881813,
              37.3296218
            ],
            [
              -121.8881267,
              37.3296479
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "e3e69b9a-54b8-48f0-b7db-2e07d2828ef2",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887971,
            37.329771
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879489,
              37.3297931
            ],
            [
              -121.8880065,
              37.3297656
            ],
            [
              -121.8879931,
              37.3297479
            ],
            [
              -121.8879356,
              37.3297755
            ],
            [
              -121.8879489,
              37.3297931
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "1f6860b8-3d75-4ee5-9e08-a0b7fb360561",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.888126,
            37.329669
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881218,
              37.3296863
            ],
            [
              -121.8881282,
              37.3296833
            ],
            [
              -121.8881398,
              37.3296777
            ],
            [
              -121.8881468,
              37.3296744
            ],
            [
              -121.8881298,
              37.329652
            ],
            [
              -121.8881049,
              37.329664
            ],
            [
              -121.8881218,
              37.3296863
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ff26de56-0a31-445d-9922-1ac27969cb09",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.887963,
            37.329728
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879931,
              37.3297479
            ],
            [
              -121.8880154,
              37.3297373
            ],
            [
              -121.8880243,
              37.329733
            ],
            [
              -121.8880283,
              37.3297311
            ],
            [
              -121.888008062022521,
              37.329704271600548
            ],
            [
              -121.8879895,
              37.3296799
            ],
            [
              -121.8878979,
              37.3297238
            ],
            [
              -121.8879356,
              37.3297755
            ],
            [
              -121.8879931,
              37.3297479
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f21aeff0-d46d-43c9-bf66-b5f3c78d957f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.888056,
            37.329683
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8881218,
              37.3296863
            ],
            [
              -121.8881049,
              37.329664
            ],
            [
              -121.8880831,
              37.3296352
            ],
            [
              -121.8879895,
              37.3296799
            ],
            [
              -121.888008062022521,
              37.329704271600548
            ],
            [
              -121.8880283,
              37.3297311
            ],
            [
              -121.8880325,
              37.3297291
            ],
            [
              -121.8880419,
              37.3297246
            ],
            [
              -121.8881218,
              37.3296863
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "c3d9f038-08b1-4d22-bb09-dbc1ec6588be",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.887658,
            37.329166
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8875956,
              37.3291661
            ],
            [
              -121.8876206,
              37.3291992
            ],
            [
              -121.8876284,
              37.3292094
            ],
            [
              -121.8876311,
              37.3292129
            ],
            [
              -121.8877096,
              37.3291754
            ],
            [
              -121.8877184,
              37.3291711
            ],
            [
              -121.8877233,
              37.3291688
            ],
            [
              -121.887703604253517,
              37.329142314575385
            ],
            [
              -121.8876852,
              37.3291185
            ],
            [
              -121.887593,
              37.3291626
            ],
            [
              -121.8875956,
              37.3291661
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "0b65c895-2faf-4154-bc60-60227754dc0d",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.88775,
            37.329122
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8878068,
              37.3291288
            ],
            [
              -121.8878121,
              37.3291263
            ],
            [
              -121.8878156,
              37.3291246
            ],
            [
              -121.8877775,
              37.3290743
            ],
            [
              -121.8876852,
              37.3291185
            ],
            [
              -121.887703604253517,
              37.329142314575385
            ],
            [
              -121.8877233,
              37.3291688
            ],
            [
              -121.887798,
              37.3291331
            ],
            [
              -121.8878068,
              37.3291288
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "91bf1dcc-4db8-411f-8304-2210d11c73c2",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887579,
            37.329228
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8876311,
              37.3292129
            ],
            [
              -121.8876284,
              37.3292094
            ],
            [
              -121.8876206,
              37.3291992
            ],
            [
              -121.8875521,
              37.329232
            ],
            [
              -121.8875488,
              37.3292277
            ],
            [
              -121.8875291,
              37.3292372
            ],
            [
              -121.8875317,
              37.3292407
            ],
            [
              -121.887537,
              37.3292477
            ],
            [
              -121.8875427,
              37.3292552
            ],
            [
              -121.8876311,
              37.3292129
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "6854b471-fc89-4a16-a9e7-76031131a07b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.888013,
            37.328996
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879818,
              37.3290403
            ],
            [
              -121.8879845,
              37.3290438
            ],
            [
              -121.8880593,
              37.329008
            ],
            [
              -121.8880682,
              37.3290037
            ],
            [
              -121.8880807,
              37.3289978
            ],
            [
              -121.888078,
              37.3289942
            ],
            [
              -121.8880452,
              37.3289509
            ],
            [
              -121.8880425,
              37.3289474
            ],
            [
              -121.8879463,
              37.3289934
            ],
            [
              -121.887949,
              37.328997
            ],
            [
              -121.8879818,
              37.3290403
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a517e630-182f-4552-91b6-882063eea03c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.888386,
            37.329181
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "HALL 1"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8880593,
              37.329008
            ],
            [
              -121.8879845,
              37.3290438
            ],
            [
              -121.8878916,
              37.3290882
            ],
            [
              -121.8882852,
              37.3296082
            ],
            [
              -121.8883029,
              37.3295997
            ],
            [
              -121.888378,
              37.3295637
            ],
            [
              -121.8883393,
              37.3295125
            ],
            [
              -121.8883484,
              37.3295082
            ],
            [
              -121.8883572,
              37.329504
            ],
            [
              -121.8884095,
              37.329479
            ],
            [
              -121.8884276,
              37.3294703
            ],
            [
              -121.8884355,
              37.3294665
            ],
            [
              -121.8884449,
              37.329462
            ],
            [
              -121.8884501,
              37.3294595
            ],
            [
              -121.8885195,
              37.3294263
            ],
            [
              -121.8885884,
              37.3293933
            ],
            [
              -121.888595,
              37.3293902
            ],
            [
              -121.8886039,
              37.3293859
            ],
            [
              -121.8886116,
              37.3293822
            ],
            [
              -121.8886304,
              37.3293732
            ],
            [
              -121.8887006,
              37.3293396
            ],
            [
              -121.8887107,
              37.329353
            ],
            [
              -121.8887385,
              37.3293897
            ],
            [
              -121.8888191,
              37.3293514
            ],
            [
              -121.8888029,
              37.3293299
            ],
            [
              -121.888781,
              37.3293011
            ],
            [
              -121.8888728,
              37.3292572
            ],
            [
              -121.888518,
              37.3287885
            ],
            [
              -121.8884341,
              37.3288286
            ],
            [
              -121.8883551,
              37.3288664
            ],
            [
              -121.8883462,
              37.3288707
            ],
            [
              -121.888338,
              37.3288748
            ],
            [
              -121.8881078,
              37.3289848
            ],
            [
              -121.8880807,
              37.3289978
            ],
            [
              -121.8880682,
              37.3290037
            ],
            [
              -121.8880593,
              37.329008
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "99adf139-dc8e-4f8f-81e7-43b245f4642b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.888367,
            37.328826
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8883352,
              37.3288711
            ],
            [
              -121.888338,
              37.3288748
            ],
            [
              -121.8883462,
              37.3288707
            ],
            [
              -121.8883551,
              37.3288664
            ],
            [
              -121.8884341,
              37.3288286
            ],
            [
              -121.888396,
              37.3287783
            ],
            [
              -121.8882998,
              37.3288243
            ],
            [
              -121.8883024,
              37.3288278
            ],
            [
              -121.8883352,
              37.3288711
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "56248e99-8767-492f-9dcd-13a02ab2c11b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.888632,
            37.3287
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8885648,
              37.3286974
            ],
            [
              -121.8886029,
              37.3287478
            ],
            [
              -121.8886817,
              37.3287101
            ],
            [
              -121.8886905,
              37.3287059
            ],
            [
              -121.8886989,
              37.3287019
            ],
            [
              -121.8886613,
              37.3286513
            ],
            [
              -121.8885648,
              37.3286974
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ff033dba-6b6e-47ee-88d4-94efd6f4c4e9",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889039,
            37.32892
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "HALL 2"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890162,
              37.3292991
            ],
            [
              -121.8890271,
              37.329294
            ],
            [
              -121.8890453,
              37.3292853
            ],
            [
              -121.8890892,
              37.3292642
            ],
            [
              -121.8891077,
              37.3292554
            ],
            [
              -121.8891159,
              37.3292514
            ],
            [
              -121.8891247,
              37.3292472
            ],
            [
              -121.8891302,
              37.3292446
            ],
            [
              -121.8892686,
              37.3291783
            ],
            [
              -121.8892751,
              37.3291752
            ],
            [
              -121.8892838,
              37.3291711
            ],
            [
              -121.8892921,
              37.3291671
            ],
            [
              -121.8893103,
              37.3291584
            ],
            [
              -121.8893544,
              37.3291373
            ],
            [
              -121.8893721,
              37.3291288
            ],
            [
              -121.8893805,
              37.3291248
            ],
            [
              -121.8894186,
              37.3291752
            ],
            [
              -121.889499,
              37.3291367
            ],
            [
              -121.8894835,
              37.3291163
            ],
            [
              -121.8894609,
              37.3290863
            ],
            [
              -121.8895537,
              37.3290419
            ],
            [
              -121.8891375,
              37.328492
            ],
            [
              -121.8890448,
              37.3285363
            ],
            [
              -121.8889737,
              37.3285703
            ],
            [
              -121.8889642,
              37.3285749
            ],
            [
              -121.888937,
              37.3285879
            ],
            [
              -121.8889017,
              37.3286048
            ],
            [
              -121.8888944,
              37.3285951
            ],
            [
              -121.8888874,
              37.3285859
            ],
            [
              -121.8888814,
              37.3285779
            ],
            [
              -121.8888753,
              37.3285699
            ],
            [
              -121.8888684,
              37.3285607
            ],
            [
              -121.8888636,
              37.3285544
            ],
            [
              -121.8888377,
              37.3285668
            ],
            [
              -121.8888755,
              37.3286173
            ],
            [
              -121.8887373,
              37.3286835
            ],
            [
              -121.8886989,
              37.3287019
            ],
            [
              -121.8886905,
              37.3287059
            ],
            [
              -121.8886817,
              37.3287101
            ],
            [
              -121.8886029,
              37.3287478
            ],
            [
              -121.888518,
              37.3287885
            ],
            [
              -121.8888728,
              37.3292572
            ],
            [
              -121.8888914,
              37.3292818
            ],
            [
              -121.8889109,
              37.3293075
            ],
            [
              -121.8889624,
              37.3293755
            ],
            [
              -121.8889716,
              37.3293711
            ],
            [
              -121.8889806,
              37.3293668
            ],
            [
              -121.889021,
              37.3293475
            ],
            [
              -121.8890444,
              37.3293363
            ],
            [
              -121.8890162,
              37.3292991
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "32c0a4b5-9675-407f-a8e8-8e13e2f21f7c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.88889,
            37.328558
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888636,
              37.3285544
            ],
            [
              -121.8888684,
              37.3285607
            ],
            [
              -121.8888753,
              37.3285699
            ],
            [
              -121.8888814,
              37.3285779
            ],
            [
              -121.88889916110233,
              37.328569094475029
            ],
            [
              -121.8889167,
              37.328561
            ],
            [
              -121.8888989,
              37.3285375
            ],
            [
              -121.8888636,
              37.3285544
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ced955bd-4fd6-477b-b62a-8690449d9814",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.888909,
            37.328583
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.888937,
              37.3285879
            ],
            [
              -121.8889167,
              37.328561
            ],
            [
              -121.88889916110233,
              37.328569094475029
            ],
            [
              -121.8888814,
              37.3285779
            ],
            [
              -121.8888874,
              37.3285859
            ],
            [
              -121.8888944,
              37.3285951
            ],
            [
              -121.8889017,
              37.3286048
            ],
            [
              -121.888937,
              37.3285879
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ed2d2226-70f1-4ebf-abff-6680f0c1d474",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.888985,
            37.32853
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8889642,
              37.3285749
            ],
            [
              -121.8889737,
              37.3285703
            ],
            [
              -121.8890448,
              37.3285363
            ],
            [
              -121.8890066,
              37.328486
            ],
            [
              -121.8889261,
              37.3285245
            ],
            [
              -121.8889642,
              37.3285749
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4ed639d1-95e6-4a19-8fa6-91d0705c4057",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.88925,
            37.328404
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8892213,
              37.3284518
            ],
            [
              -121.8893005,
              37.3284139
            ],
            [
              -121.8893094,
              37.3284097
            ],
            [
              -121.8893175,
              37.3284058
            ],
            [
              -121.8892794,
              37.3283555
            ],
            [
              -121.8891832,
              37.3284015
            ],
            [
              -121.8892213,
              37.3284518
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f157b1d0-dd9c-4d59-a216-ad52893c2694",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.88965,
            37.328691
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "HALL 3"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8893175,
              37.3284058
            ],
            [
              -121.8893094,
              37.3284097
            ],
            [
              -121.8893005,
              37.3284139
            ],
            [
              -121.8892213,
              37.3284518
            ],
            [
              -121.8891375,
              37.328492
            ],
            [
              -121.8895537,
              37.3290419
            ],
            [
              -121.8895723,
              37.3290664
            ],
            [
              -121.8895918,
              37.3290923
            ],
            [
              -121.889637,
              37.3291519
            ],
            [
              -121.8896449,
              37.3291624
            ],
            [
              -121.8896528,
              37.3291586
            ],
            [
              -121.8896621,
              37.3291541
            ],
            [
              -121.8897288,
              37.3291222
            ],
            [
              -121.8897366,
              37.3291185
            ],
            [
              -121.8897093,
              37.3290824
            ],
            [
              -121.8897899,
              37.3290438
            ],
            [
              -121.8897982,
              37.3290398
            ],
            [
              -121.8898067,
              37.3290357
            ],
            [
              -121.8898136,
              37.3290324
            ],
            [
              -121.8899506,
              37.3289668
            ],
            [
              -121.8899563,
              37.3289641
            ],
            [
              -121.8899658,
              37.3289595
            ],
            [
              -121.8900627,
              37.3289131
            ],
            [
              -121.8901147,
              37.3289818
            ],
            [
              -121.8901981,
              37.3289419
            ],
            [
              -121.889982,
              37.3286564
            ],
            [
              -121.8896661,
              37.3282389
            ],
            [
              -121.8895826,
              37.3282789
            ],
            [
              -121.8895037,
              37.3283167
            ],
            [
              -121.8894946,
              37.328321
            ],
            [
              -121.8894864,
              37.328325
            ],
            [
              -121.8894771,
              37.3283294
            ],
            [
              -121.8894059,
              37.3283635
            ],
            [
              -121.8893175,
              37.3284058
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "19483a8e-c95d-468e-bf76-8125c1ae262c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889423,
            37.328309
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8893678,
              37.3283131
            ],
            [
              -121.8893893,
              37.3283415
            ],
            [
              -121.8894602,
              37.3283075
            ],
            [
              -121.8894771,
              37.3283294
            ],
            [
              -121.8894864,
              37.328325
            ],
            [
              -121.8894483,
              37.3282746
            ],
            [
              -121.8893678,
              37.3283131
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7178233c-dd1e-4c2d-9402-46fd960b53c4",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.889515,
            37.328277
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8894864,
              37.328325
            ],
            [
              -121.8894946,
              37.328321
            ],
            [
              -121.8895037,
              37.3283167
            ],
            [
              -121.8895826,
              37.3282789
            ],
            [
              -121.8895445,
              37.3282286
            ],
            [
              -121.8894483,
              37.3282746
            ],
            [
              -121.8894864,
              37.328325
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "35f3ebb3-5e9d-4ae5-8117-cfea0877678b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.887508,
            37.329542
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "212A, 212B, 212C, 212D"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8876525,
              37.3295457
            ],
            [
              -121.8875735,
              37.3294414
            ],
            [
              -121.8875631,
              37.3294277
            ],
            [
              -121.887557,
              37.3294196
            ],
            [
              -121.8873437,
              37.3295216
            ],
            [
              -121.8873645,
              37.329549
            ],
            [
              -121.8873751,
              37.3295631
            ],
            [
              -121.8873762,
              37.3295645
            ],
            [
              -121.8873941,
              37.329556
            ],
            [
              -121.8874223,
              37.3295933
            ],
            [
              -121.8874335,
              37.3296081
            ],
            [
              -121.8874158,
              37.3296168
            ],
            [
              -121.8874205,
              37.3296231
            ],
            [
              -121.8874311,
              37.3296371
            ],
            [
              -121.8874554,
              37.3296692
            ],
            [
              -121.8875739,
              37.3296125
            ],
            [
              -121.8875586,
              37.3295923
            ],
            [
              -121.8875794,
              37.3295823
            ],
            [
              -121.8875948,
              37.3296025
            ],
            [
              -121.8876687,
              37.3295671
            ],
            [
              -121.8876634,
              37.3295601
            ],
            [
              -121.8876525,
              37.3295457
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7fde4015-9e6d-46c0-9423-07a079dd7437",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887577,
            37.329597
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8875794,
              37.3295823
            ],
            [
              -121.8875586,
              37.3295923
            ],
            [
              -121.8875739,
              37.3296125
            ],
            [
              -121.8875948,
              37.3296025
            ],
            [
              -121.8875794,
              37.3295823
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "c8621ddf-d3fd-4b81-a89c-6b71f9466ec9",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887405,
            37.329586
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8874335,
              37.3296081
            ],
            [
              -121.8874223,
              37.3295933
            ],
            [
              -121.8873941,
              37.329556
            ],
            [
              -121.8873762,
              37.3295645
            ],
            [
              -121.8874158,
              37.3296168
            ],
            [
              -121.8874335,
              37.3296081
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ab5b5d50-60aa-4bb8-9f30-4ed4076ff1cd",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.887646,
            37.329725
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "211A, 211B, 211C, 211D"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8875908,
              37.3298481
            ],
            [
              -121.8878038,
              37.3297462
            ],
            [
              -121.8878027,
              37.3297447
            ],
            [
              -121.887792,
              37.3297306
            ],
            [
              -121.8877123,
              37.3296252
            ],
            [
              -121.8877016,
              37.3296112
            ],
            [
              -121.8876961,
              37.3296038
            ],
            [
              -121.8876225,
              37.329639
            ],
            [
              -121.8876377,
              37.3296593
            ],
            [
              -121.8876268,
              37.3296645
            ],
            [
              -121.8876168,
              37.3296692
            ],
            [
              -121.8876015,
              37.3296491
            ],
            [
              -121.8874831,
              37.3297057
            ],
            [
              -121.8875081,
              37.3297389
            ],
            [
              -121.8875188,
              37.3297529
            ],
            [
              -121.8875253,
              37.3297615
            ],
            [
              -121.8875432,
              37.329753
            ],
            [
              -121.887556,
              37.3297698
            ],
            [
              -121.8875792,
              37.3298006
            ],
            [
              -121.8875613,
              37.3298091
            ],
            [
              -121.8875631,
              37.3298115
            ],
            [
              -121.8875737,
              37.3298255
            ],
            [
              -121.8875908,
              37.3298481
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3d9f77c1-47b6-4b9e-bb3d-04dc54cb2289",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.88762,
            37.329654
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8876225,
              37.329639
            ],
            [
              -121.8876015,
              37.3296491
            ],
            [
              -121.8876168,
              37.3296692
            ],
            [
              -121.8876268,
              37.3296645
            ],
            [
              -121.8876377,
              37.3296593
            ],
            [
              -121.8876225,
              37.329639
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "347af07d-2a25-4553-a43d-fa970def8f62",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.887552,
            37.329781
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8875253,
              37.3297615
            ],
            [
              -121.8875613,
              37.3298091
            ],
            [
              -121.8875792,
              37.3298006
            ],
            [
              -121.887556,
              37.3297698
            ],
            [
              -121.8875432,
              37.329753
            ],
            [
              -121.8875253,
              37.3297615
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "899b5ff7-5fb3-4f73-ab9a-74015412b545",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.887355,
            37.329642
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "213"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8873484,
              37.3296979
            ],
            [
              -121.8873713,
              37.3296867
            ],
            [
              -121.8873892,
              37.3296779
            ],
            [
              -121.88742,
              37.3296627
            ],
            [
              -121.8873738,
              37.3296017
            ],
            [
              -121.8873632,
              37.3295877
            ],
            [
              -121.8873621,
              37.3295861
            ],
            [
              -121.8873311,
              37.329601
            ],
            [
              -121.8872899,
              37.3296207
            ],
            [
              -121.8873484,
              37.3296979
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "306cf8de-3549-4920-a9e5-b57631d6b564",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.887294,
            37.329582
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "214"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8872899,
              37.3296207
            ],
            [
              -121.8873311,
              37.329601
            ],
            [
              -121.8873621,
              37.3295861
            ],
            [
              -121.8873342,
              37.3295493
            ],
            [
              -121.8873235,
              37.3295352
            ],
            [
              -121.8873213,
              37.3295323
            ],
            [
              -121.8872904,
              37.3295471
            ],
            [
              -121.8872265,
              37.3295777
            ],
            [
              -121.8872673,
              37.3296315
            ],
            [
              -121.8872899,
              37.3296207
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7f1428fc-2e39-4417-ab73-e036f3ca48ff",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887619,
            37.32989
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8876323,
              37.3298509
            ],
            [
              -121.8875767,
              37.3298775
            ],
            [
              -121.887568,
              37.3298817
            ],
            [
              -121.8875616,
              37.3298848
            ],
            [
              -121.8876147,
              37.3299279
            ],
            [
              -121.8876704,
              37.3299012
            ],
            [
              -121.8876323,
              37.3298509
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "8f072c0c-44c5-439a-9b31-2d83afa5fefa",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.890265,
            37.32874
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902712,
              37.3287734
            ],
            [
              -121.8902992,
              37.32876
            ],
            [
              -121.8902583,
              37.328706
            ],
            [
              -121.8902303,
              37.3287194
            ],
            [
              -121.8902712,
              37.3287734
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "30563f52-ffaf-4b50-9129-ee003a065869",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "opentobelow",
        "display_point": {
          "coordinates": [
            -121.890268,
            37.328794
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902712,
              37.3287734
            ],
            [
              -121.8902303,
              37.3287194
            ],
            [
              -121.8902028,
              37.3287326
            ],
            [
              -121.8902437,
              37.3287865
            ],
            [
              -121.8902158,
              37.3287999
            ],
            [
              -121.8902574,
              37.3288549
            ],
            [
              -121.8903408,
              37.328815
            ],
            [
              -121.8902992,
              37.32876
            ],
            [
              -121.8902712,
              37.3287734
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9926cf27-8f60-498d-b7c9-e6870e1c4859",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.890209,
            37.328766
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902028,
              37.3287326
            ],
            [
              -121.8901764,
              37.3287452
            ],
            [
              -121.8901749,
              37.3287459
            ],
            [
              -121.8902158,
              37.3287999
            ],
            [
              -121.8902437,
              37.3287865
            ],
            [
              -121.8902028,
              37.3287326
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "889cfc5a-e28a-481a-bda0-03fd9c6769c1",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888403,
            37.329517
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8883393,
              37.3295125
            ],
            [
              -121.888378,
              37.3295637
            ],
            [
              -121.888466,
              37.329521
            ],
            [
              -121.8884484,
              37.3294978
            ],
            [
              -121.8884276,
              37.3294703
            ],
            [
              -121.8884095,
              37.329479
            ],
            [
              -121.8883572,
              37.329504
            ],
            [
              -121.8883484,
              37.3295082
            ],
            [
              -121.8883393,
              37.3295125
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4500a0fa-ca5c-4056-ab78-0799806aa0a6",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.888493,
            37.32948
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8884355,
              37.3294665
            ],
            [
              -121.8884276,
              37.3294703
            ],
            [
              -121.8884484,
              37.3294978
            ],
            [
              -121.888466,
              37.329521
            ],
            [
              -121.8885576,
              37.3294766
            ],
            [
              -121.888544154916843,
              37.329458931844911
            ],
            [
              -121.8885311,
              37.3294416
            ],
            [
              -121.8884617,
              37.3294748
            ],
            [
              -121.8884501,
              37.3294595
            ],
            [
              -121.8884449,
              37.329462
            ],
            [
              -121.8884355,
              37.3294665
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "2e1f6751-9f22-444e-847b-2da650064940",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.888592,
            37.329433
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.888595,
              37.3293902
            ],
            [
              -121.8885884,
              37.3293933
            ],
            [
              -121.8886,
              37.3294086
            ],
            [
              -121.8885311,
              37.3294416
            ],
            [
              -121.888544154916843,
              37.329458931844911
            ],
            [
              -121.8885576,
              37.3294766
            ],
            [
              -121.8886495,
              37.329432
            ],
            [
              -121.8886116,
              37.3293822
            ],
            [
              -121.8886039,
              37.3293859
            ],
            [
              -121.888595,
              37.3293902
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "d175b92c-06e4-49ea-a92a-175e55063e89",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888835,
            37.329293
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.888781,
              37.3293011
            ],
            [
              -121.8888029,
              37.3293299
            ],
            [
              -121.8888107,
              37.3293262
            ],
            [
              -121.888835,
              37.3293145
            ],
            [
              -121.8888318,
              37.3293103
            ],
            [
              -121.8888836,
              37.3292855
            ],
            [
              -121.8888914,
              37.3292818
            ],
            [
              -121.8888728,
              37.3292572
            ],
            [
              -121.888781,
              37.3293011
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "df978e76-691a-4a96-bdf0-eb7038c51b8a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888871,
            37.329309
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888318,
              37.3293103
            ],
            [
              -121.888835,
              37.3293145
            ],
            [
              -121.8888513,
              37.3293361
            ],
            [
              -121.8888536,
              37.329335
            ],
            [
              -121.8888625,
              37.3293307
            ],
            [
              -121.8889109,
              37.3293075
            ],
            [
              -121.8888914,
              37.3292818
            ],
            [
              -121.8888836,
              37.3292855
            ],
            [
              -121.8888318,
              37.3293103
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "6af372b9-be95-4bcb-ba7e-cbc8d65e140f",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.888827,
            37.329333
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8888107,
              37.3293262
            ],
            [
              -121.8888029,
              37.3293299
            ],
            [
              -121.8888191,
              37.3293514
            ],
            [
              -121.888827,
              37.3293477
            ],
            [
              -121.8888331,
              37.3293448
            ],
            [
              -121.8888447,
              37.3293392
            ],
            [
              -121.8888513,
              37.3293361
            ],
            [
              -121.888835,
              37.3293145
            ],
            [
              -121.8888107,
              37.3293262
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "0d664157-1ee1-46b2-b1e6-cf7eaae93e03",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.888676,
            37.329392
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8886495,
              37.329432
            ],
            [
              -121.8887385,
              37.3293897
            ],
            [
              -121.8887107,
              37.329353
            ],
            [
              -121.8886401,
              37.3293862
            ],
            [
              -121.8886304,
              37.3293732
            ],
            [
              -121.8886116,
              37.3293822
            ],
            [
              -121.8886495,
              37.329432
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "0a8b2a23-e71d-4dd9-89ea-5eb1a01f90a1",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888525,
            37.329434
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8885311,
              37.3294416
            ],
            [
              -121.8886,
              37.3294086
            ],
            [
              -121.8885884,
              37.3293933
            ],
            [
              -121.8885195,
              37.3294263
            ],
            [
              -121.8884501,
              37.3294595
            ],
            [
              -121.8884617,
              37.3294748
            ],
            [
              -121.8885311,
              37.3294416
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f8bed870-c227-4789-a652-9c07c24dccc1",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.889507,
            37.329119
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8895314,
              37.3291212
            ],
            [
              -121.889516,
              37.3291008
            ],
            [
              -121.8894914,
              37.3291126
            ],
            [
              -121.8894835,
              37.3291163
            ],
            [
              -121.889499,
              37.3291367
            ],
            [
              -121.8895094,
              37.3291317
            ],
            [
              -121.889521,
              37.3291262
            ],
            [
              -121.8895314,
              37.3291212
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "20fe702e-c016-467a-b905-b5ed9f01782a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889515,
            37.329079
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889516,
              37.3291008
            ],
            [
              -121.8895119,
              37.3290953
            ],
            [
              -121.8895723,
              37.3290664
            ],
            [
              -121.8895537,
              37.3290419
            ],
            [
              -121.8894609,
              37.3290863
            ],
            [
              -121.8894835,
              37.3291163
            ],
            [
              -121.8894914,
              37.3291126
            ],
            [
              -121.889516,
              37.3291008
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "ea630126-a12b-419f-bd95-36800cfa75ff",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889552,
            37.329094
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8895314,
              37.3291212
            ],
            [
              -121.8895346,
              37.3291196
            ],
            [
              -121.8895434,
              37.3291154
            ],
            [
              -121.8895918,
              37.3290923
            ],
            [
              -121.8895723,
              37.3290664
            ],
            [
              -121.8895119,
              37.3290953
            ],
            [
              -121.889516,
              37.3291008
            ],
            [
              -121.8895314,
              37.3291212
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a837f5a3-67cf-48c3-a03b-87e5f2c09849",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889081,
            37.329302
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8891077,
              37.3292554
            ],
            [
              -121.8890892,
              37.3292642
            ],
            [
              -121.8890453,
              37.3292853
            ],
            [
              -121.8890271,
              37.329294
            ],
            [
              -121.8890162,
              37.3292991
            ],
            [
              -121.8890444,
              37.3293363
            ],
            [
              -121.8890543,
              37.3293495
            ],
            [
              -121.8891458,
              37.3293057
            ],
            [
              -121.8891077,
              37.3292554
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9a0262c9-f4ce-4aa4-8d55-3ceaf5adb94b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889008,
            37.329363
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8890543,
              37.3293495
            ],
            [
              -121.8890444,
              37.3293363
            ],
            [
              -121.889021,
              37.3293475
            ],
            [
              -121.8889806,
              37.3293668
            ],
            [
              -121.8889716,
              37.3293711
            ],
            [
              -121.8889624,
              37.3293755
            ],
            [
              -121.8889724,
              37.3293888
            ],
            [
              -121.889031,
              37.3293606
            ],
            [
              -121.8890543,
              37.3293495
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9fb407af-982e-43a5-bfce-12aac9378925",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.889173,
            37.329265
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8892378,
              37.3292617
            ],
            [
              -121.889224683866601,
              37.329244494687188
            ],
            [
              -121.889211,
              37.3292263
            ],
            [
              -121.8891409,
              37.3292591
            ],
            [
              -121.8891302,
              37.3292446
            ],
            [
              -121.8891247,
              37.3292472
            ],
            [
              -121.8891159,
              37.3292514
            ],
            [
              -121.8891077,
              37.3292554
            ],
            [
              -121.8891458,
              37.3293057
            ],
            [
              -121.8892378,
              37.3292617
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "d1b6e68a-9ea6-48a1-b79d-cf80200e3493",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889351,
            37.329173
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8892838,
              37.3291711
            ],
            [
              -121.8893217,
              37.3292215
            ],
            [
              -121.8893302,
              37.3292174
            ],
            [
              -121.8894186,
              37.3291752
            ],
            [
              -121.8893805,
              37.3291248
            ],
            [
              -121.8893721,
              37.3291288
            ],
            [
              -121.8893544,
              37.3291373
            ],
            [
              -121.8893103,
              37.3291584
            ],
            [
              -121.8892921,
              37.3291671
            ],
            [
              -121.8892838,
              37.3291711
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "54650f3b-c895-4873-a733-3bf2a6e0a331",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.889268,
            37.329221
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8892751,
              37.3291752
            ],
            [
              -121.8892686,
              37.3291783
            ],
            [
              -121.8892802,
              37.3291939
            ],
            [
              -121.889211,
              37.3292263
            ],
            [
              -121.889224683866601,
              37.329244494687188
            ],
            [
              -121.8892378,
              37.3292617
            ],
            [
              -121.8893217,
              37.3292215
            ],
            [
              -121.8892838,
              37.3291711
            ],
            [
              -121.8892751,
              37.3291752
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "a6734b2e-3c83-42c4-943c-e02d92cd1a68",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889206,
            37.329219
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8892686,
              37.3291783
            ],
            [
              -121.8891302,
              37.3292446
            ],
            [
              -121.8891409,
              37.3292591
            ],
            [
              -121.889211,
              37.3292263
            ],
            [
              -121.8892802,
              37.3291939
            ],
            [
              -121.8892686,
              37.3291783
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "eb13a379-e11e-49cd-b04b-184f406c685c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889769,
            37.329088
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889766,
              37.3291237
            ],
            [
              -121.8898093,
              37.329103
            ],
            [
              -121.889828,
              37.3290941
            ],
            [
              -121.8897899,
              37.3290438
            ],
            [
              -121.8897093,
              37.3290824
            ],
            [
              -121.8897366,
              37.3291185
            ],
            [
              -121.8897473,
              37.3291327
            ],
            [
              -121.889766,
              37.3291237
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "676771c0-8574-41ef-8d3c-36f446a9eb0a",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.889856,
            37.329053
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889828,
              37.3290941
            ],
            [
              -121.8899203,
              37.3290499
            ],
            [
              -121.889906077753167,
              37.329030911969468
            ],
            [
              -121.8898921,
              37.3290125
            ],
            [
              -121.8898234,
              37.3290453
            ],
            [
              -121.8898136,
              37.3290324
            ],
            [
              -121.8898067,
              37.3290357
            ],
            [
              -121.8897982,
              37.3290398
            ],
            [
              -121.8897899,
              37.3290438
            ],
            [
              -121.889828,
              37.3290941
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "f6307f56-8481-450e-be62-e8a0cc138b25",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.89004,
            37.328971
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8900627,
              37.3289131
            ],
            [
              -121.8899658,
              37.3289595
            ],
            [
              -121.8900039,
              37.3290099
            ],
            [
              -121.8900178,
              37.3290282
            ],
            [
              -121.8901147,
              37.3289818
            ],
            [
              -121.8900627,
              37.3289131
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4874118e-38a8-4f5e-bb28-8020d4448f36",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.889949,
            37.329009
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8899604,
              37.3289799
            ],
            [
              -121.8898921,
              37.3290125
            ],
            [
              -121.889906077753167,
              37.329030911969468
            ],
            [
              -121.8899203,
              37.3290499
            ],
            [
              -121.8900039,
              37.3290099
            ],
            [
              -121.8899658,
              37.3289595
            ],
            [
              -121.8899563,
              37.3289641
            ],
            [
              -121.8899506,
              37.3289668
            ],
            [
              -121.8899604,
              37.3289799
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "be16b937-85b1-4632-93eb-b3a662ea8a15",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889887,
            37.329006
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8898136,
              37.3290324
            ],
            [
              -121.8898234,
              37.3290453
            ],
            [
              -121.8898921,
              37.3290125
            ],
            [
              -121.8899604,
              37.3289799
            ],
            [
              -121.8899506,
              37.3289668
            ],
            [
              -121.8898136,
              37.3290324
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "bc56cc2c-f1c3-47e5-8248-6bc0036f6ef5",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.889696,
            37.329148
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8896621,
              37.3291541
            ],
            [
              -121.8896528,
              37.3291586
            ],
            [
              -121.8896449,
              37.3291624
            ],
            [
              -121.8896556,
              37.3291766
            ],
            [
              -121.8896643,
              37.3291724
            ],
            [
              -121.8897473,
              37.3291327
            ],
            [
              -121.8897366,
              37.3291185
            ],
            [
              -121.8897288,
              37.3291222
            ],
            [
              -121.8896621,
              37.3291541
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "7b6343c4-cb60-4f65-9fb5-3cdab62dee2c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.88965,
            37.329174
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8896556,
              37.3291766
            ],
            [
              -121.8896449,
              37.3291624
            ],
            [
              -121.889637,
              37.3291519
            ],
            [
              -121.889627,
              37.3291567
            ],
            [
              -121.8896547,
              37.3291932
            ],
            [
              -121.8896732,
              37.3291844
            ],
            [
              -121.8896643,
              37.3291724
            ],
            [
              -121.8896556,
              37.3291766
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "39f70aee-d4aa-4414-9c32-c31a92cecaf0",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.890076,
            37.32866
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8900906,
              37.3286906
            ],
            [
              -121.8901203,
              37.3286764
            ],
            [
              -121.890103,
              37.3286536
            ],
            [
              -121.8901318,
              37.3286398
            ],
            [
              -121.8901179,
              37.3286214
            ],
            [
              -121.8900891,
              37.3286351
            ],
            [
              -121.8900594,
              37.3286493
            ],
            [
              -121.8900427,
              37.3286273
            ],
            [
              -121.8900182,
              37.3286391
            ],
            [
              -121.8900661,
              37.3287024
            ],
            [
              -121.8900906,
              37.3286906
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4cb6693e-1ddc-4ea0-8773-f17644e37249",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.88987,
            37.328214
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "230C"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897021,
              37.3282217
            ],
            [
              -121.8897102,
              37.3282324
            ],
            [
              -121.8897349,
              37.3282206
            ],
            [
              -121.8897693,
              37.3282661
            ],
            [
              -121.889808,
              37.3283172
            ],
            [
              -121.8900162,
              37.3282175
            ],
            [
              -121.889935,
              37.3281103
            ],
            [
              -121.8897021,
              37.3282217
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "74a29cfa-f995-4ce2-aba8-b1c7f18d5d95",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.890028,
            37.328425
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "230A"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8899278,
              37.3285197
            ],
            [
              -121.8899397,
              37.3285354
            ],
            [
              -121.8900505,
              37.3284823
            ],
            [
              -121.8900667,
              37.3284745
            ],
            [
              -121.8901468,
              37.3284362
            ],
            [
              -121.8901668,
              37.3284266
            ],
            [
              -121.8901725,
              37.3284239
            ],
            [
              -121.8900958,
              37.3283226
            ],
            [
              -121.8898875,
              37.3284223
            ],
            [
              -121.8899211,
              37.3284666
            ],
            [
              -121.8899524,
              37.328508
            ],
            [
              -121.8899278,
              37.3285197
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "2b42921c-895b-4e2a-86dd-75915a28c987",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.889948,
            37.328322
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "230B"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.889845,
              37.3284104
            ],
            [
              -121.889856,
              37.3284249
            ],
            [
              -121.8898806,
              37.3284132
            ],
            [
              -121.8898875,
              37.3284223
            ],
            [
              -121.8900958,
              37.3283226
            ],
            [
              -121.8900162,
              37.3282175
            ],
            [
              -121.889808,
              37.3283172
            ],
            [
              -121.8897833,
              37.328329
            ],
            [
              -121.889796,
              37.3283457
            ],
            [
              -121.8898206,
              37.3283339
            ],
            [
              -121.8898696,
              37.3283986
            ],
            [
              -121.889845,
              37.3284104
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b3a74ebf-d538-4e9b-ac98-b17ce57d3201",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.889808,
            37.328388
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8898206,
              37.3283339
            ],
            [
              -121.889796,
              37.3283457
            ],
            [
              -121.8897833,
              37.328329
            ],
            [
              -121.8897447,
              37.3282779
            ],
            [
              -121.8897693,
              37.3282661
            ],
            [
              -121.8897349,
              37.3282206
            ],
            [
              -121.8897102,
              37.3282324
            ],
            [
              -121.8897021,
              37.3282217
            ],
            [
              -121.8896661,
              37.3282389
            ],
            [
              -121.889982,
              37.3286564
            ],
            [
              -121.8899849,
              37.328655
            ],
            [
              -121.8900154,
              37.3286404
            ],
            [
              -121.8900182,
              37.3286391
            ],
            [
              -121.8900427,
              37.3286273
            ],
            [
              -121.890045,
              37.3286262
            ],
            [
              -121.8900539,
              37.328622
            ],
            [
              -121.8901333,
              37.328584
            ],
            [
              -121.8902061,
              37.3285491
            ],
            [
              -121.890215,
              37.3285449
            ],
            [
              -121.8902183,
              37.3285433
            ],
            [
              -121.890251,
              37.3285277
            ],
            [
              -121.8901725,
              37.3284239
            ],
            [
              -121.8901668,
              37.3284266
            ],
            [
              -121.8901468,
              37.3284362
            ],
            [
              -121.8901639,
              37.3284593
            ],
            [
              -121.8901748,
              37.3284738
            ],
            [
              -121.8901812,
              37.3284822
            ],
            [
              -121.8901878,
              37.3284909
            ],
            [
              -121.8901984,
              37.328505
            ],
            [
              -121.8902134,
              37.3285247
            ],
            [
              -121.8901356,
              37.3285619
            ],
            [
              -121.8901184,
              37.3285702
            ],
            [
              -121.8901174,
              37.3285707
            ],
            [
              -121.8901136,
              37.3285725
            ],
            [
              -121.8900959,
              37.328581
            ],
            [
              -121.8900066,
              37.3286237
            ],
            [
              -121.8899921,
              37.3286046
            ],
            [
              -121.8899812,
              37.3285902
            ],
            [
              -121.8899744,
              37.3285813
            ],
            [
              -121.8899685,
              37.3285735
            ],
            [
              -121.8899578,
              37.3285593
            ],
            [
              -121.8899397,
              37.3285354
            ],
            [
              -121.8899278,
              37.3285197
            ],
            [
              -121.8899524,
              37.328508
            ],
            [
              -121.8899211,
              37.3284666
            ],
            [
              -121.8898965,
              37.3284784
            ],
            [
              -121.889856,
              37.3284249
            ],
            [
              -121.889845,
              37.3284104
            ],
            [
              -121.8898696,
              37.3283986
            ],
            [
              -121.8898206,
              37.3283339
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "fc224228-3a3e-44d2-a863-e8859ea1063b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889889,
            37.328446
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8899211,
              37.3284666
            ],
            [
              -121.8898875,
              37.3284223
            ],
            [
              -121.8898806,
              37.3284132
            ],
            [
              -121.889856,
              37.3284249
            ],
            [
              -121.8898965,
              37.3284784
            ],
            [
              -121.8899211,
              37.3284666
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "c7dcb790-544c-4014-8d3d-54a81561c568",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889776,
            37.328298
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8897447,
              37.3282779
            ],
            [
              -121.8897833,
              37.328329
            ],
            [
              -121.889808,
              37.3283172
            ],
            [
              -121.8897693,
              37.3282661
            ],
            [
              -121.8897447,
              37.3282779
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "29e48c4d-da06-4a64-a810-9597adb4fc6b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.890124,
            37.328478
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "233"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8900667,
              37.3284745
            ],
            [
              -121.8901006,
              37.328519
            ],
            [
              -121.8901017,
              37.3285204
            ],
            [
              -121.8901812,
              37.3284822
            ],
            [
              -121.8901748,
              37.3284738
            ],
            [
              -121.8901639,
              37.3284593
            ],
            [
              -121.8901468,
              37.3284362
            ],
            [
              -121.8900667,
              37.3284745
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b4407b80-8479-4fbf-9e70-331650c0d7ed",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.890076,
            37.328501
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8900667,
              37.3284745
            ],
            [
              -121.8900505,
              37.3284823
            ],
            [
              -121.8900842,
              37.3285268
            ],
            [
              -121.8900853,
              37.3285282
            ],
            [
              -121.8901017,
              37.3285204
            ],
            [
              -121.8901006,
              37.328519
            ],
            [
              -121.8900667,
              37.3284745
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3beb9daf-68fc-40b0-84d3-d5c42277e755",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.890012,
            37.328532
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "231B"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8900505,
              37.3284823
            ],
            [
              -121.8899397,
              37.3285354
            ],
            [
              -121.8899578,
              37.3285593
            ],
            [
              -121.8899685,
              37.3285735
            ],
            [
              -121.8899744,
              37.3285813
            ],
            [
              -121.8900853,
              37.3285282
            ],
            [
              -121.8900842,
              37.3285268
            ],
            [
              -121.8900505,
              37.3284823
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "b6f87afb-358d-43d0-93c7-43336d5ba8a1",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.890149,
            37.328526
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "232"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8900853,
              37.3285282
            ],
            [
              -121.8901174,
              37.3285707
            ],
            [
              -121.8901184,
              37.3285702
            ],
            [
              -121.8901356,
              37.3285619
            ],
            [
              -121.8902134,
              37.3285247
            ],
            [
              -121.8901984,
              37.328505
            ],
            [
              -121.8901878,
              37.3284909
            ],
            [
              -121.8901812,
              37.3284822
            ],
            [
              -121.8901017,
              37.3285204
            ],
            [
              -121.8900853,
              37.3285282
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "8eeb7c6a-29d0-4822-9f1f-74ef80cfffd6",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "room",
        "display_point": {
          "coordinates": [
            -121.890046,
            37.328576
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": {
          "en": "231A"
        },
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8901136,
              37.3285725
            ],
            [
              -121.8901174,
              37.3285707
            ],
            [
              -121.8900853,
              37.3285282
            ],
            [
              -121.8899744,
              37.3285813
            ],
            [
              -121.8899812,
              37.3285902
            ],
            [
              -121.8899921,
              37.3286046
            ],
            [
              -121.8900066,
              37.3286237
            ],
            [
              -121.8900959,
              37.328581
            ],
            [
              -121.8901136,
              37.3285725
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "d894937b-0a10-4519-b1af-e733c6f31eb6",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "elevator",
        "display_point": {
          "coordinates": [
            -121.890126,
            37.328658
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8901491,
              37.3286627
            ],
            [
              -121.8901318,
              37.3286398
            ],
            [
              -121.890103,
              37.3286536
            ],
            [
              -121.8901203,
              37.3286764
            ],
            [
              -121.8901287,
              37.3286724
            ],
            [
              -121.8901403,
              37.3286668
            ],
            [
              -121.8901491,
              37.3286627
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3a589851-264f-4d34-bfd0-aba8d7070551",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.890127,
            37.328606
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8901491,
              37.3286627
            ],
            [
              -121.8901812,
              37.3286473
            ],
            [
              -121.890155876552271,
              37.328613846561218
            ],
            [
              -121.8901333,
              37.328584
            ],
            [
              -121.8900539,
              37.328622
            ],
            [
              -121.890045,
              37.3286262
            ],
            [
              -121.8900427,
              37.3286273
            ],
            [
              -121.8900594,
              37.3286493
            ],
            [
              -121.8900891,
              37.3286351
            ],
            [
              -121.8901179,
              37.3286214
            ],
            [
              -121.8901318,
              37.3286398
            ],
            [
              -121.8901491,
              37.3286627
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3a6ebefc-311d-4786-8ae8-70882f23c9c7",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.8902,
            37.328595
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8902061,
              37.3285491
            ],
            [
              -121.8901333,
              37.328584
            ],
            [
              -121.890155876552271,
              37.328613846561218
            ],
            [
              -121.8901812,
              37.3286473
            ],
            [
              -121.8902662,
              37.3286066
            ],
            [
              -121.8902183,
              37.3285433
            ],
            [
              -121.890215,
              37.3285449
            ],
            [
              -121.8902061,
              37.3285491
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "5e915cb0-3e67-4829-b2f6-22cd935afa54",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.890259,
            37.328567
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.890251,
              37.3285277
            ],
            [
              -121.8902183,
              37.3285433
            ],
            [
              -121.8902662,
              37.3286066
            ],
            [
              -121.8902989,
              37.3285909
            ],
            [
              -121.890251,
              37.3285277
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4aa0b7c4-a819-48bb-aa2b-f35302576674",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.889378,
            37.329208
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8893302,
              37.3292174
            ],
            [
              -121.8893217,
              37.3292215
            ],
            [
              -121.8893367,
              37.3292414
            ],
            [
              -121.8894337,
              37.3291953
            ],
            [
              -121.8894186,
              37.3291752
            ],
            [
              -121.8893302,
              37.3292174
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "bd3c989c-ca1c-45d8-830c-4b9597e770a2",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.male",
        "display_point": {
          "coordinates": [
            -121.887791,
            37.329809
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8877304,
              37.329804
            ],
            [
              -121.8877249,
              37.3298066
            ],
            [
              -121.887743374553452,
              37.329831173790673
            ],
            [
              -121.887763,
              37.329857
            ],
            [
              -121.8878495,
              37.3298157
            ],
            [
              -121.8878565,
              37.3298124
            ],
            [
              -121.8878182,
              37.3297619
            ],
            [
              -121.8877392,
              37.3297997
            ],
            [
              -121.8877304,
              37.329804
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "5162423c-f22d-4196-bb51-e01ed6c40cd5",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "restroom.female",
        "display_point": {
          "coordinates": [
            -121.887698,
            37.329854
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8877249,
              37.3298066
            ],
            [
              -121.8877215,
              37.3298082
            ],
            [
              -121.8877127,
              37.3298124
            ],
            [
              -121.8876323,
              37.3298509
            ],
            [
              -121.8876704,
              37.3299012
            ],
            [
              -121.887763,
              37.329857
            ],
            [
              -121.887743374553452,
              37.329831173790673
            ],
            [
              -121.8877249,
              37.3298066
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "53142457-eafe-40a7-a672-ff4a1c232813",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "nonpublic",
        "display_point": {
          "coordinates": [
            -121.888671,
            37.329363
          ],
          "type": "Point"
        },
        "level_id": "81e9fd76-b34a-45f6-a6dc-1f172f01e849",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8886401,
              37.3293862
            ],
            [
              -121.8887107,
              37.329353
            ],
            [
              -121.8887006,
              37.3293396
            ],
            [
              -121.8886304,
              37.3293732
            ],
            [
              -121.8886401,
              37.3293862
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4c3805ae-3403-4867-b7e8-277576ebe89b",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.887334,
            37.329716
          ],
          "type": "Point"
        },
        "level_id": "5a36be2d-4e7b-42b4-b30a-3a13ad399502",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8874491,
              37.3298578
            ],
            [
              -121.8874902,
              37.329827
            ],
            [
              -121.8874927,
              37.329829
            ],
            [
              -121.8875047,
              37.3298232
            ],
            [
              -121.8874978,
              37.3298141
            ],
            [
              -121.8874696,
              37.3297769
            ],
            [
              -121.8874484,
              37.3297489
            ],
            [
              -121.8874263,
              37.3297594
            ],
            [
              -121.8874175,
              37.3297478
            ],
            [
              -121.8873866,
              37.3297069
            ],
            [
              -121.8873713,
              37.3296867
            ],
            [
              -121.8873484,
              37.3296979
            ],
            [
              -121.8872899,
              37.3296207
            ],
            [
              -121.8872673,
              37.3296315
            ],
            [
              -121.8872265,
              37.3295777
            ],
            [
              -121.8872245,
              37.329575
            ],
            [
              -121.8872139,
              37.329561
            ],
            [
              -121.8872125,
              37.3295592
            ],
            [
              -121.8871745,
              37.329577
            ],
            [
              -121.8870924,
              37.3295107
            ],
            [
              -121.8872066,
              37.3296031
            ],
            [
              -121.8871745,
              37.3296295
            ],
            [
              -121.887171,
              37.3296325
            ],
            [
              -121.8874491,
              37.3298578
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "5a27256c-04fe-48cd-90a8-c2a71065303c",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.88753,
            37.329891
          ],
          "type": "Point"
        },
        "level_id": "5a36be2d-4e7b-42b4-b30a-3a13ad399502",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8874491,
              37.3298578
            ],
            [
              -121.8875651,
              37.3299517
            ],
            [
              -121.8876147,
              37.3299279
            ],
            [
              -121.8875616,
              37.3298848
            ],
            [
              -121.8875201,
              37.3298512
            ],
            [
              -121.8874927,
              37.329829
            ],
            [
              -121.8874902,
              37.329827
            ],
            [
              -121.8874491,
              37.3298578
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "126bc6ab-bc08-4044-886d-8a7d5779c014",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887132,
            37.329572
          ],
          "type": "Point"
        },
        "level_id": "5a36be2d-4e7b-42b4-b30a-3a13ad399502",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8870567,
              37.32954
            ],
            [
              -121.887171,
              37.3296325
            ],
            [
              -121.8871745,
              37.3296295
            ],
            [
              -121.8872066,
              37.3296031
            ],
            [
              -121.8870924,
              37.3295107
            ],
            [
              -121.8870567,
              37.32954
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4d427809-7374-4133-a642-ffc6351cd261",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.889351,
            37.32997
          ],
          "type": "Point"
        },
        "level_id": "5a36be2d-4e7b-42b4-b30a-3a13ad399502",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8894605,
              37.3301343
            ],
            [
              -121.8895169,
              37.3301073
            ],
            [
              -121.8895457,
              37.3300864
            ],
            [
              -121.8894937,
              37.3300178
            ],
            [
              -121.8894853,
              37.3300218
            ],
            [
              -121.8894664,
              37.3300309
            ],
            [
              -121.8894531,
              37.3300373
            ],
            [
              -121.8894513,
              37.3300349
            ],
            [
              -121.8893961,
              37.3299621
            ],
            [
              -121.8891473,
              37.3297928
            ],
            [
              -121.8891236,
              37.3297614
            ],
            [
              -121.8891172,
              37.3297645
            ],
            [
              -121.8890996,
              37.3297729
            ],
            [
              -121.8890925,
              37.3297763
            ],
            [
              -121.8891152,
              37.3298057
            ],
            [
              -121.8893555,
              37.3299955
            ],
            [
              -121.8894605,
              37.3301343
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "4b95cf80-d27b-438a-9294-0776976c97fe",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.887823,
            37.329935
          ],
          "type": "Point"
        },
        "level_id": "5a36be2d-4e7b-42b4-b30a-3a13ad399502",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879133,
              37.3299865
            ],
            [
              -121.8879366,
              37.3300175
            ],
            [
              -121.8879586,
              37.330007
            ],
            [
              -121.8879772,
              37.329998
            ],
            [
              -121.8879848,
              37.3299944
            ],
            [
              -121.8879617,
              37.329964
            ],
            [
              -121.8879574,
              37.3299583
            ],
            [
              -121.8879465,
              37.3299438
            ],
            [
              -121.8879209,
              37.3299101
            ],
            [
              -121.8878994,
              37.3298816
            ],
            [
              -121.8878741,
              37.3298482
            ],
            [
              -121.8878635,
              37.3298341
            ],
            [
              -121.8878495,
              37.3298157
            ],
            [
              -121.887763,
              37.329857
            ],
            [
              -121.8876704,
              37.3299012
            ],
            [
              -121.8877822,
              37.3300489
            ],
            [
              -121.8879133,
              37.3299865
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "3a6bdfc1-1ddf-4f7e-b964-608545f6b3fa",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "stairs",
        "display_point": {
          "coordinates": [
            -121.887859,
            37.330033
          ],
          "type": "Point"
        },
        "level_id": "5a36be2d-4e7b-42b4-b30a-3a13ad399502",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8879366,
              37.3300175
            ],
            [
              -121.8879133,
              37.3299865
            ],
            [
              -121.8877822,
              37.3300489
            ],
            [
              -121.8878058,
              37.3300801
            ],
            [
              -121.887813,
              37.3300766
            ],
            [
              -121.8879366,
              37.3300175
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "feature_type": "unit",
      "id": "9aab1fa4-8e7e-47b1-a40f-8269047ccd40",
      "properties": {
        "accessibility": null,
        "alt_name": null,
        "category": "walkway",
        "display_point": {
          "coordinates": [
            -121.890074,
            37.329778
          ],
          "type": "Point"
        },
        "level_id": "5a36be2d-4e7b-42b4-b30a-3a13ad399502",
        "name": null,
        "restriction": null
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -121.8899713,
              37.3297852
            ],
            [
              -121.8899809,
              37.329798
            ],
            [
              -121.8900064,
              37.3298315
            ],
            [
              -121.8900275,
              37.3298593
            ],
            [
              -121.8900709,
              37.3298385
            ],
            [
              -121.890063,
              37.3298278
            ],
            [
              -121.8901776,
              37.3297732
            ],
            [
              -121.8901189,
              37.3296962
            ],
            [
              -121.890015,
              37.3297634
            ],
            [
              -121.8900127,
              37.3297654
            ],
            [
              -121.8899713,
              37.3297852
            ]
          ]
        ]
      }
    }
  ]
},
{
  "features": [
      {
          "feature_type": "venue",
          "geometry": {
              "coordinates": [
                  [
                      [
                          -121.8877302,
                          37.3302817
                      ],
                      [
                          -121.8884902,
                          37.3299083
                      ],
                      [
                          -121.888998,
                          37.3305496
                      ],
                      [
                          -121.8913729,
                          37.3294515
                      ],
                      [
                          -121.8899391,
                          37.3275123
                      ],
                      [
                          -121.8898073,
                          37.3273687
                      ],
                      [
                          -121.8888698,
                          37.3278571
                      ],
                      [
                          -121.886689,
                          37.3294575
                      ],
                      [
                          -121.8869795,
                          37.3296993
                      ],
                      [
                          -121.887412,
                          37.3300593
                      ],
                      [
                          -121.8877302,
                          37.3302817
                      ]
                  ]
              ],
              "type": "Polygon"
          },
          "id": "c3ec5ea2-8839-434a-a7a8-34dbe35c9a4c",
          "properties": {
              "address_id": "e105efb7-b0d1-4144-8b8e-72eadf95724f",
              "alt_name": null,
              "category": "museum",
              "display_point": {
                  "coordinates": [
                      -121.889164,
                      37.32925
                  ],
                  "type": "Point"
              },
              "hours": "Su-Sa 09:00-17:00",
              "name": {
                  "en": "Dinoseum"
              },
              "phone": null,
              "restriction": null,
              "website": "https://developer.apple.com"
          },
          "type": "Feature"
      }
  ],
  "name": "venue",
  "type": "FeatureCollection"
}





  
];
