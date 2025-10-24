
import React, { useEffect, useRef, useState } from 'react';
import { Issue } from '../types';
import { STATUS_MARKER_COLORS } from '../constants';

// Add TypeScript declaration for the google maps object on the window
declare global {
  interface Window {
    google: any;
  }
}

interface MapDisplayProps {
  issues: Issue[];
}

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      return resolve();
    }
    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
       const interval = setInterval(() => {
         if (window.google && window.google.maps) {
           clearInterval(interval);
           resolve();
         }
       }, 100);
       return;
    }
    
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&maps_ids=IMPROVE_MY_CITY_MAP`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script failed to load.'));
    document.head.appendChild(script);
  });
};

const MapDisplay: React.FC<MapDisplayProps> = ({ issues }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  // FIX: Replaced `google.maps.Map` with `any` to resolve "Cannot find namespace 'google'" error. In a real-world scenario, installing @types/google.maps or adding ambient declarations would be preferred.
  const [map, setMap] = useState<any | null>(null);
  // FIX: Replaced `google.maps.Marker` with `any` to resolve "Cannot find namespace 'google'" error.
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      loadGoogleMapsScript(apiKey)
        .then(() => setIsScriptLoaded(true))
        .catch(console.error);
    } else {
        console.error("Google Maps API key not found in process.env.API_KEY");
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (isScriptLoaded && mapRef.current && !map) {
      const defaultCenter = { lat: 21.1702, lng: 72.8311 }; // Default: Surat, India
      const issuesWithLocation = issues.filter(issue => issue.location);
      
      let center = defaultCenter;
      if (issuesWithLocation.length > 0) {
        const totalLat = issuesWithLocation.reduce((sum, issue) => sum + issue.location!.lat, 0);
        const totalLng = issuesWithLocation.reduce((sum, issue) => sum + issue.location!.lon, 0);
        center = { lat: totalLat / issuesWithLocation.length, lng: totalLng / issuesWithLocation.length };
      }

      const newMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: issuesWithLocation.length > 0 ? 12 : 10,
        mapId: 'IMPROVE_MY_CITY_MAP',
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
      });
      setMap(newMap);
    }
  }, [isScriptLoaded, issues, map]);

  // Update markers
  useEffect(() => {
    if (map) {
      // Clear old markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      const issuesWithLocation = issues.filter(issue => issue.location);

      issuesWithLocation.forEach(issue => {
        const markerIcon = {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: STATUS_MARKER_COLORS[issue.status],
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: '#fff',
          rotation: 0,
          scale: 1.5,
          anchor: new window.google.maps.Point(12, 24),
        };

        const marker = new window.google.maps.Marker({
          position: { lat: issue.location!.lat, lng: issue.location!.lon },
          map,
          icon: markerIcon,
          title: issue.title,
        });
        
        const infowindow = new window.google.maps.InfoWindow({
            content: `<div style="color: #1F2937; font-family: sans-serif; max-width: 200px;">
                            <strong style="font-size: 1.1em;">${issue.title}</strong>
                            <p style="margin: 4px 0;"><strong>Priority:</strong> ${issue.priority}</p>
                            <p style="font-style: italic; margin: 4px 0 0 0;">"${issue.summary}"</p>
                         </div>`
        });

        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    }
  }, [map, issues]);


  if (!process.env.API_KEY) {
      return (
          <div className="h-[400px] w-full bg-gray-200 rounded-lg flex items-center justify-center text-center text-gray-600 p-4 mb-8">
              Google Maps could not be loaded. The API key is missing.
          </div>
      );
  }

  return <div ref={mapRef} className="h-[400px] w-full bg-gray-200 rounded-lg mb-8 shadow-md" aria-label="Map of reported issues" />;
};

export default MapDisplay;
