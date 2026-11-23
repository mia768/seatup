import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, Marker, Popup, AttributionControl, useMap, useMapEvents } from 'react-leaflet';
import { divIcon, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.web.css';
import type { MapHandle, MapProps } from './mapTypes';

const Controller = forwardRef<MapHandle, Pick<MapProps, 'onCenterChange'>>(function Controller({ onCenterChange }, ref) {
  const map = useMap();
  useMapEvents({ moveend: () => { const c = map.getCenter(); onCenterChange({ latitude: c.lat, longitude: c.lng }); } });
  useImperativeHandle(ref, () => ({
    animateToRegion: (r, duration) => { map.flyTo([r.latitude, r.longitude], 15, { duration: duration / 1000 }); },
    fitToCoordinates: (coordinates, { edgePadding: p }) => {
      if (coordinates.length) map.fitBounds(latLngBounds(coordinates.map(c => [c.latitude, c.longitude])), { paddingTopLeft: [p.left, p.top], paddingBottomRight: [p.right, p.bottom], maxZoom: 15 });
    },
  }), [map]);
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
});
export default forwardRef<MapHandle, MapProps>(function MapCanvas({ restaurants, locations, active, onSelect, onOpen, onCenterChange }, ref) {
  return <MapContainer center={[43.25, 76.935]} zoom={13} zoomControl={false}
    style={{ position: 'absolute', inset: 0, zIndex: 0 }} attributionControl={false}>
    <AttributionControl position="topright" />
    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
    <Controller ref={ref} onCenterChange={onCenterChange} />
    {restaurants.map(r => <Marker key={r.id} position={[locations[r.id].latitude, locations[r.id].longitude]}
      title={r.name} icon={divIcon({ className: 'seatup-marker', html: `<div style="background:${active === r.id ? '#272B24' : '#FF5100'};border:3px solid white;border-radius:50%;width:24px;height:24px;box-shadow:0 2px 6px #0004"></div>`, iconSize: [30, 30], iconAnchor: [15, 15] })}
      eventHandlers={{ click: () => onSelect(r) }}>
      <Popup autoPanPaddingBottomRight={[20, 250]}><strong>{r.name}</strong><p>{r.cuisine} · ★ {r.rating}</p><button type="button" onClick={() => onOpen(r)} style={{ background: '#FF5100', color: 'white', border: 0, borderRadius: 8, padding: 10, cursor: 'pointer' }}>Открыть ресторан</button></Popup>
    </Marker>)}
  </MapContainer>;
});
