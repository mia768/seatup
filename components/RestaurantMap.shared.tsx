import React, { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MapCanvas from './MapCanvas';
import type { MapHandle } from './mapTypes';

export type MapRestaurant = { id: number; name: string; cuisine: string; rating: string; price: number; address: string; image: string };
// Demo locations, not verified business addresses. No device location is collected.
export const locations: Record<number, { latitude: number; longitude: number }> = {
  1: { latitude: 43.2425, longitude: 76.9152 },
  2: { latitude: 43.2586, longitude: 76.9455 },
  3: { latitude: 43.2482, longitude: 76.9564 },
};
export default function RestaurantMap({ restaurants, onOpen }: { restaurants: MapRestaurant[]; onOpen: (restaurant: MapRestaurant) => void }) {
  const map = useRef<MapHandle>(null);
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('Все');
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [nearby, setNearby] = useState(false);
  const [center, setCenter] = useState({ latitude: 43.25, longitude: 76.935 });
  const visible = restaurants.filter(r => (r.name + ' ' + r.cuisine).toLowerCase().includes(query.trim().toLowerCase()) && (cuisine === 'Все' || r.cuisine === cuisine));
  const ordered = [...visible].sort((a, b) => nearby ? distance(locations[a.id], center) - distance(locations[b.id], center) : Number(b.id === active) - Number(a.id === active));
  const select = (r: MapRestaurant) => {
    setActive(r.id);
    map.current?.animateToRegion({ ...locations[r.id], latitudeDelta: 0.018, longitudeDelta: 0.018 }, 400);
  };
  return <View style={s.root}>
    <MapCanvas ref={map} restaurants={visible} locations={locations} active={active}
      onSelect={select} onOpen={onOpen} onCenterChange={setCenter} />
    <View style={s.mapTitle}><Text style={s.city}>⌖ Алматы</Text><Text style={s.demo}>Демо-места</Text></View>
    <Pressable accessibilityRole="button" accessibilityLabel="Показать все рестораны на карте" style={s.reset} onPress={() => {
      if (visible.length) map.current?.fitToCoordinates(visible.map(r => locations[r.id]), { edgePadding: { top: 80, right: 45, bottom: 220, left: 45 }, animated: true });
    }}><Text style={{ fontSize: 22 }}>⌖</Text></Pressable>
    <View style={[s.sheet, { height: expanded ? '76%' : '46%' }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={expanded ? 'Свернуть список' : 'Развернуть список'} onPress={() => setExpanded(!expanded)} style={s.handleButton}><View style={s.handle} /></Pressable>
      <View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput style={s.input} placeholder="Поиск ресторанов…" value={query} onChangeText={setQuery} accessibilityLabel="Поиск ресторанов на карте" /><Pressable onPress={() => setQuery('')} accessibilityLabel="Очистить поиск"><Text style={s.clear}>{query ? '×' : ''}</Text></Pressable></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filters} contentContainerStyle={{ alignItems: 'center', gap: 7 }}>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: nearby }} onPress={() => setNearby(!nearby)} style={[s.chip, nearby && s.activeChip]}><Text style={[s.chipText, nearby && s.white]}>Рядом с центром карты</Text></Pressable>
        {['Все', 'Итальянская', 'Японская'].map(c => <Pressable key={c} onPress={() => setCuisine(c)} style={[s.chip, cuisine === c && s.activeChip]}><Text style={[s.chipText, cuisine === c && s.white]}>{c}</Text></Pressable>)}
      </ScrollView>
      <Text style={s.caption}>{visible.length} ресторана · расположение демонстрационное</Text>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {ordered.map(r => <View key={r.id} style={[s.card, active === r.id && s.activeCard]}>
          <Pressable style={s.restaurant} onPress={() => { select(r); onOpen(r); }} accessibilityLabel={'Открыть ' + r.name}>
            <Image source={{ uri: `https://images.unsplash.com/${r.image}?w=250&q=80` }} style={s.photo} />
            <View style={{ flex: 1, gap: 5 }}><Text style={s.name}>{r.name}</Text><Text style={s.secondary}>{r.cuisine}</Text><Text style={s.secondary}><Text style={{ color: '#FF5100' }}>★ {r.rating}</Text>  ·  {r.price.toLocaleString('ru-RU')} ₸</Text></View><Text style={{ color: '#FF5100' }}>›</Text>
          </Pressable>
          <Pressable accessibilityLabel={'Показать на карте ' + r.name} onPress={() => select(r)} style={s.locate}><Text style={s.locateText}>⌖ Показать на карте</Text></Pressable>
        </View>)}
        {!visible.length && <Text style={s.empty}>Ничего не найдено. Измените поиск или кухню.</Text>}
      </ScrollView>
    </View>
  </View>;
}
function distance(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  return (a.latitude - b.latitude) ** 2 + ((a.longitude - b.longitude) * Math.cos(b.latitude * Math.PI / 180)) ** 2;
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ECEEE8' }, mapTitle: { position: 'absolute', top: 14, left: 16, zIndex: 1000, borderRadius: 16, backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 10 }, city: { fontWeight: '700', fontSize: 14, color: '#282D24' }, demo: { fontSize: 10, color: '#85877F', marginTop: 3 }, reset: { position: 'absolute', right: 16, top: 16, zIndex: 1000, backgroundColor: '#FFF', borderRadius: 24, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: '#FFF', paddingHorizontal: 16, elevation: 6, zIndex: 1000 }, handleButton: { alignItems: 'center', padding: 12 }, handle: { width: 38, height: 4, borderRadius: 2, backgroundColor: '#D9DBDF' }, search: { flexDirection: 'row', alignItems: 'center', borderColor: '#E3E3E3', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, height: 42 }, searchIcon: { fontSize: 24, color: '#89919D', marginRight: 8 }, input: { flex: 1, fontSize: 13, color: '#242824', height: 42 }, clear: { fontSize: 24, color: '#888', minWidth: 24, textAlign: 'center' },
  filters: { flexGrow: 0, marginTop: 10, minHeight: 34, maxHeight: 38 }, chip: { backgroundColor: '#F2F2F4', borderRadius: 9, paddingVertical: 8, paddingHorizontal: 12 }, activeChip: { backgroundColor: '#FF5100' }, chipText: { color: '#454840', fontSize: 11 }, white: { color: '#FFF' }, caption: { color: '#91948C', fontSize: 10, marginVertical: 10 }, card: { borderWidth: 1, borderColor: '#ECEDE8', borderRadius: 13, marginBottom: 10, overflow: 'hidden' }, activeCard: { borderColor: '#FF5100', backgroundColor: '#FFF9F5' }, restaurant: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 12 }, photo: { width: 62, height: 62, borderRadius: 8, backgroundColor: '#EEE' }, name: { fontSize: 14, fontWeight: '700', color: '#282D24' }, secondary: { fontSize: 11, color: '#85877F' }, locate: { paddingHorizontal: 12, paddingBottom: 10 }, locateText: { fontSize: 11, color: '#FF5100' }, empty: { color: '#85877F', paddingVertical: 22, textAlign: 'center', lineHeight: 22 },
});
