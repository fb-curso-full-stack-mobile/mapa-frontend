import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import "./MapPage.css";

// -27.596433, -48.558353
const center = { lat: -27.596433, lng: -48.558353 };

export default function MapPage() {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
    >
      <div className="map">
        <GoogleMap
          center={center}
          zoom={16}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          <Marker position={center} title="Centro" />
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
