import type { MapRestaurant } from './RestaurantMap.shared';
export type Coordinate = { latitude: number; longitude: number };
export type MapHandle = {
  animateToRegion: (region: Coordinate & { latitudeDelta: number; longitudeDelta: number }, duration: number) => void;
  fitToCoordinates: (coordinates: Coordinate[], options: { edgePadding: { top: number; right: number; bottom: number; left: number }; animated: boolean }) => void;
};
export type MapProps = {
  restaurants: MapRestaurant[];
  locations: Record<number, Coordinate>;
  active: number | null;
  onSelect: (restaurant: MapRestaurant) => void;
  onOpen: (restaurant: MapRestaurant) => void;
  onCenterChange: (center: Coordinate) => void;
};
