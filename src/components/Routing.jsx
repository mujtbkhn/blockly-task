import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import markerImage from "../assets/marker.webp";
import carImage from "../assets/carImage.png";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const customMarkerIcon = new L.Icon({
  iconUrl: markerImage,
  iconSize: [45, 45],
  popupAnchor: [0, -20],
});

const customCarImage = new L.Icon({
  iconUrl: carImage,
  iconSize: [45, 45],
  popupAnchor: [0, -20],
});

const RoutingComponent = ({ map, start, end, isPlaying, speed }) => {
  const routeRef = useRef(null);
  const markerRef = useRef(null);
  const [routingControl, setRoutingControl] = useState(null);

  useEffect(() => {
    if (!map || !start.length || !end.length) return;

    if (!markerRef.current) {
      markerRef.current = L.marker(start, {
        icon: customCarImage,
      }).addTo(map);
    } else {
      markerRef.current.setLatLng(start);
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: true,
      createMarker: function (i, waypoint, n) {
        return L.marker(waypoint.latLng, {
          icon: customMarkerIcon,
        });
      },
    }).addTo(map);

    control.on("routesfound", function (e) {
      routeRef.current = e.routes[0].coordinates;
    });

    setRoutingControl(control);

    return () => {
      if (map && control) {
        map.removeControl(control);
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, start, end]);

  useEffect(() => {
    let animationFrameId;
    let lastTimestamp = 0;
    let currentIndex = 0;

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      if (elapsed > (1000 / speed)) {
        if (currentIndex < routeRef.current.length) {
          markerRef.current.setLatLng([
            routeRef.current[currentIndex].lat,
            routeRef.current[currentIndex].lng
          ]);
          currentIndex++;
          lastTimestamp = timestamp;
        } else {
          cancelAnimationFrame(animationFrameId)
        }
      }
      if (currentIndex < routeRef.current.length) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (isPlaying && routeRef.current && markerRef.current) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, speed]);

  return null;
};

export default RoutingComponent;
