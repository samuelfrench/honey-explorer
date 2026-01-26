import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { SourceMarker } from './SourceMarker';
import type { LocalSource } from '../../services/api';
import 'leaflet/dist/leaflet.css';

interface LocalSourceMapProps {
  sources: LocalSource[];
  center?: [number, number];
  zoom?: number;
  fitToMarkers?: boolean;
  onMapMove?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

// Component to fit map to markers
function FitBounds({ sources }: { sources: LocalSource[] }) {
  const map = useMap();

  useEffect(() => {
    if (sources.length > 0) {
      const bounds = sources.map(s => [s.latitude, s.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [sources, map]);

  return null;
}

export function LocalSourceMap({
  sources,
  center = [39.8283, -98.5795], // Center of US
  zoom = 4,
  fitToMarkers = false,
}: LocalSourceMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-2xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
        maxClusterRadius={50}
      >
        {sources.map((source) => (
          <SourceMarker key={source.id} source={source} />
        ))}
      </MarkerClusterGroup>
      {fitToMarkers && sources.length > 0 && <FitBounds sources={sources} />}
    </MapContainer>
  );
}
