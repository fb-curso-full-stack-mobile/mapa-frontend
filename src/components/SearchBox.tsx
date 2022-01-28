import { StandaloneSearchBox } from "@react-google-maps/api";

type SearchBoxProps = {
  onLoad?: (searchBox: google.maps.places.SearchBox) => void;
  onPlacesChanged?: () => void;
};

export default function SearchBox({ onLoad, onPlacesChanged }: SearchBoxProps) {
  return (
    <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
      <input type="text" className="search-box-input" />
    </StandaloneSearchBox>
  );
}
