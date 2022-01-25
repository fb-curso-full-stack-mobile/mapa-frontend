import {
  LoadScript,
  GoogleMap,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useState } from "react";
import "./MapPage.css";

// -27.596433, -48.558353
const center = { lat: -27.596433, lng: -48.558353 };

export default function MapPage() {
  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [locations, setLocations] = useState<google.maps.LatLngLiteral[]>([]);

  const handleOnPlacesChanged = () => {
    const places = searchBox!.getPlaces();
    const place = places![0];
    const location = {
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
    };
    const newLocations = [...locations, location];
    setLocations(newLocations);
    map?.panTo(location);
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
      libraries={["places"]}
    >
      <div className="map">
        <GoogleMap
          onLoad={setMap}
          center={center}
          zoom={16}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          <div className="search-box-container">
            <div className="search-box-layer">
              <StandaloneSearchBox
                onLoad={setSearchBox}
                onPlacesChanged={handleOnPlacesChanged}
              >
                <input type="text" className="search-box-input" />
              </StandaloneSearchBox>
            </div>
          </div>
          {locations.map((location, index) => (
            <Marker key={index} position={location} />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
