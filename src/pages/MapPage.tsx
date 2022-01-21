import { LoadScript, GoogleMap } from "@react-google-maps/api";
import "./MapPage.css";

const center = { lat: -27.601235, lng: -48.503915 };

export default function MapPage() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDe3w7PYQfOlzEvh-lyr5HdHiC9ICTW4qY">
      <div className="map">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        />
      </div>
    </LoadScript>
  );
}
