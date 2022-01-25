import {
  LoadScript,
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";
import "./MapPage.css";

// -27.596433, -48.558353
const center = { lat: -27.596433, lng: -48.558353 };

export default function MapPage() {
  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>();

  const handleOnPlacesChanged = () => {
    const searchBoxPlaces = searchBox!.getPlaces();
    const place = searchBoxPlaces![0];
    const newPlaces = [...places, place];
    setSelectedPlace(null);
    setPlaces(newPlaces);
    if (place.geometry && place.geometry.location) {
      map?.panTo(place.geometry.location);
    }
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
          {places.map((place, index) => (
            <>
              {place.geometry && place.geometry.location ? (
                <Marker
                  key={index}
                  position={place.geometry.location}
                  onClick={() => setSelectedPlace(place)}
                >
                  {selectedPlace && selectedPlace === place ? (
                    <InfoWindow
                      key={`info-window-${index}`}
                      onCloseClick={() => setSelectedPlace(null)}
                    >
                      <div>
                        <h1>Info Window</h1>
                        <p>{selectedPlace.formatted_address}</p>
                      </div>
                    </InfoWindow>
                  ) : null}
                </Marker>
              ) : null}
            </>
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
