import { useState } from "react";
import Button from "./Button";
import SearchBox from "./SearchBox";

type RouteBoxProps = {
  traceRoute: () => void;
  originChanged: (point: google.maps.LatLngLiteral) => void;
  destinationChanged: (point: google.maps.LatLngLiteral) => void;
};

export default function RouteBox({
  traceRoute,
  originChanged,
  destinationChanged,
}: RouteBoxProps) {
  const [searchBoxA, setSearchBoxA] = useState<google.maps.places.SearchBox>();
  const [searchBoxB, setSearchBoxB] = useState<google.maps.places.SearchBox>();

  const handleOriginChanged = () => {
    const places = searchBoxA!.getPlaces();
    const place = places![0];
    const location = {
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
    };
    originChanged(location);
  };

  const handleDestinationChanged = () => {
    const places = searchBoxB!.getPlaces();
    const place = places![0];
    const location = {
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
    };
    destinationChanged(location);
  };

  return (
    <>
      <SearchBox
        onLoad={setSearchBoxA}
        onPlacesChanged={handleOriginChanged}
        placeholder="Ponto A"
      />
      <SearchBox
        onLoad={setSearchBoxB}
        onPlacesChanged={handleDestinationChanged}
        placeholder="Ponto B"
      />
      <Button type="button" onClick={traceRoute}>
        Traçar rota
      </Button>
    </>
  );
}
