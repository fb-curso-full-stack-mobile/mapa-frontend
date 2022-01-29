import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import "./MapPage.css";

import pin from "../images/pin.png";
import pinPoi from "../images/pin_poi.png";
import SearchBox from "../components/SearchBox";
import POIBox from "../components/POIBox";
import { Poi } from "../models/poi";

// -27.596433, -48.558353
const center = { lat: -27.596433, lng: -48.558353 };

const TABS = {
  search: 0,
  poi: 1,
};

export default function MapPage() {
  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>();

  const [activeTab, setActiveTab] = useState(TABS.search);

  const [pois, setPois] = useState<Poi[]>([]);
  const [poiSelected, setPoiSelected] = useState<Poi | null>();

  const handleOnPlacesChanged = () => {
    const searchBoxPlaces = searchBox!.getPlaces();
    const place = searchBoxPlaces![0];
    const newPlaces = [...places, place];
    setSelectedPlace(null);
    setPlaces(newPlaces);
    mapPanTo(place);
  };

  const mapPanTo = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      map?.panTo(place.geometry.location);
    }
  };

  const updatePois = () => {
    fetch("http://localhost:3001/v1/poi", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then(async (response) => {
      const json = await response.json();
      if (response.ok) {
        console.log(json.pois);
        setPois(json.pois);
      } else {
        console.log("Erro ", json.message);
      }
    });
  };

  useEffect(() => {
    updatePois();
  }, []);

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
              <nav>
                <button
                  className={activeTab === TABS.search ? "active" : ""}
                  onClick={() => setActiveTab(TABS.search)}
                >
                  Busca
                </button>
                <button
                  className={activeTab === TABS.poi ? "active" : ""}
                  onClick={() => setActiveTab(TABS.poi)}
                >
                  POI
                </button>
              </nav>
              {activeTab === TABS.search ? (
                <SearchBox
                  onLoad={setSearchBox}
                  onPlacesChanged={handleOnPlacesChanged}
                />
              ) : activeTab === TABS.poi ? (
                <POIBox
                  onPlaceSelected={(place) => mapPanTo(place)}
                  onPoiSaved={updatePois}
                />
              ) : null}
            </div>
          </div>
          {places.map((place, index) => (
            <>
              {place.geometry && place.geometry.location ? (
                <Marker
                  key={index}
                  position={place.geometry.location}
                  onClick={() => setSelectedPlace(place)}
                  icon={pin}
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
          {pois.map((poi, index) => (
            <Marker
              key={`marker-poi-${index}`}
              position={{ lat: poi.lat, lng: poi.lng }}
              onClick={() => setPoiSelected(poi)}
              icon={pinPoi}
            >
              {poiSelected && poiSelected === poi ? (
                <InfoWindow
                  key={`info-window-poi-${index}`}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div>
                    <h1>Ponto de Interesse (POI)</h1>
                    <div>
                      <strong>Endereço: </strong>
                      {poiSelected.address}
                    </div>
                    <div>
                      <strong>Nome: </strong>
                      {poiSelected.name}
                    </div>
                    <div>
                      <strong>Descrição: </strong>
                      {poiSelected.description}
                    </div>
                  </div>
                </InfoWindow>
              ) : null}
            </Marker>
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
