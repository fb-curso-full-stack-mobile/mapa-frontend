import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./MapPage.css";

import pin from "../images/pin.png";
import pinPoi from "../images/pin_poi.png";
import pinRoute from "../images/pin_route.png";
import SearchBox from "../components/SearchBox";
import POIBox from "../components/POIBox";
import { Poi } from "../models/poi";
import RouteBox from "../components/RouteBox";

// -27.596433, -48.558353
const center = { lat: -27.596433, lng: -48.558353 };

const TABS = {
  search: 0,
  poi: 1,
  route: 2,
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

  // Rota
  const [pointA, setPointA] = useState<google.maps.LatLngLiteral>();
  const [pointB, setPointB] = useState<google.maps.LatLngLiteral>();
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>();
  const [destination, setDestination] =
    useState<google.maps.LatLngLiteral | null>();
  const [response, setResponse] =
    useState<google.maps.DistanceMatrixRequest | null>();

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

  const traceRoute = () => {
    if (pointA && pointB) {
      setOrigin(pointA);
      setDestination(pointB);
    }
  };

  const onPointChanged = (point: google.maps.LatLngLiteral) => {
    setOrigin(null);
    setDestination(null);
    setResponse(null);
    map?.panTo(point);
  };

  const onOriginChanged = (point: google.maps.LatLngLiteral) => {
    setPointA(point);
    onPointChanged(point);
  };

  const onDestinationChanged = (point: google.maps.LatLngLiteral) => {
    setPointB(point);
    onPointChanged(point);
  };

  const directionsServiceOption =
    // @ts-ignore
    useMemo<google.maps.DirectionsRequest>(() => {
      return {
        origin,
        destination,
        travelMode: "DRIVING",
      };
    }, [origin, destination]);

  const directionsCallback = useCallback((res) => {
    if (res !== null && res.status === "OK") {
      setResponse(res);
    } else {
      console.log(res);
    }
  }, []);

  const directionsRendererOptions = useMemo<any>(() => {
    return {
      directions: response,
      markerOptions: {
        icon: { url: pinRoute },
      },
    };
  }, [response]);

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
                <button
                  className={activeTab === TABS.route ? "active" : ""}
                  onClick={() => setActiveTab(TABS.route)}
                >
                  Rota
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
              ) : activeTab === TABS.route ? (
                <RouteBox
                  traceRoute={traceRoute}
                  originChanged={onOriginChanged}
                  destinationChanged={onDestinationChanged}
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
          {/* Rotas */}
          {!response && pointA ? (
            <Marker position={pointA} icon={pinRoute} />
          ) : null}
          {!response && pointB ? (
            <Marker position={pointB} icon={pinRoute} />
          ) : null}
          {origin && destination ? (
            <DirectionsService
              options={directionsServiceOption}
              callback={directionsCallback}
            />
          ) : null}
          {response && directionsRendererOptions ? (
            <DirectionsRenderer options={directionsRendererOptions} />
          ) : null}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
