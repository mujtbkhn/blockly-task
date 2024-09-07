import { useState, useRef, useEffect } from "react";
import markerImage from "../assets/marker.png";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useLocation from "../customHooks/useLocation"
import Routing from "./Routing";

const center = { lat: 19.876165, lng: 75.343315 };

const markerIcon = new L.Icon({
  iconUrl: markerImage,
  iconSize: [45, 45],
  popupAnchor: [0, -20],
});

const MapComponent = () => {
  const [position, setPosition] = useState(center);
  const [routes, setRoutes] = useState({
    start: [],
    end: [],
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(20);
  const mapRef = useRef();
  const ZOOM = 12;

  const myLocation = useLocation();

  useEffect(() => {
    if (myLocation.loaded && !routes.start.length) {
      setRoutes({
        ...routes,
        start: [myLocation.coordinates.lat, myLocation.coordinates.lng],
      });
    }
  }, [myLocation.loaded]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;

        if (routes.start.length === 0) {
          setRoutes({
            ...routes,
            start: [lat, lng],
          });
        } else if (routes.end.length === 0) {
          setRoutes({
            ...routes,
            end: [lat, lng],
          });
        }
      },
    });
    return null;
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleSpeedChange = (e) => {
    setSpeed(Number(e.target.value));
  };

  const resetRoute = () => {
    setRoutes({ start: [], end: [] });
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div style={{ height: "400px", width: "100%" }}>
        <MapContainer
          center={position}
          zoom={ZOOM}
          ref={mapRef}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler />
          {routes.start.length !== 0 && (
            <Marker position={routes.start} icon={markerIcon}></Marker>
          )}
          {routes.start.length !== 0 && routes.end.length !== 0 && (
            <Routing
              map={mapRef.current}
              start={routes.start}
              end={routes.end}
              isPlaying={isPlaying}
              speed={speed}
            />
          )}
        </MapContainer>
      </div>
      <div className="flex gap-10 items-center">
        {routes.end.length !== 0 && !isPlaying && (
          <button onClick={handlePlay} className="px-4 mx-auto py-2 bg-green-500 text-white rounded">
            Play
          </button>
        )}
        {routes.end.length !== 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="speed">Speed:</label>
            <input
              type="range"
              id="speed"
              min="10"
              max="100"
              value={speed}
              onChange={handleSpeedChange}
            />
            <span>{speed}</span>
          </div>
        )}
        <button
          onClick={resetRoute}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset the Route
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
