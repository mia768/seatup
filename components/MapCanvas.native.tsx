import React, { forwardRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { MapHandle, MapProps } from './mapTypes';
export default forwardRef<MapHandle, MapProps>(function MapCanvas({ restaurants, locations, active, onSelect, onOpen, onCenterChange }, ref) {
  return <MapView ref={ref as React.Ref<MapView>} style={StyleSheet.absoluteFill}
    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
    initialRegion={{ latitude: 43.25, longitude: 76.935, latitudeDelta: 0.055, longitudeDelta: 0.065 }}
    onRegionChangeComplete={r => onCenterChange({ latitude: r.latitude, longitude: r.longitude })}
    mapPadding={{ top: 35, right: 20, bottom: 180, left: 20 }} toolbarEnabled={false} showsUserLocation={false}>
    {restaurants.map(r => <Marker key={r.id} coordinate={locations[r.id]} title={r.name} description={r.cuisine}
      pinColor={active === r.id ? '#272B24' : '#FF5100'} onPress={() => onSelect(r)} onCalloutPress={() => onOpen(r)} />)}
  </MapView>;
});
