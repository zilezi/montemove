import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, Navigation, Search } from 'lucide-react-native';
import * as Location from 'expo-location';
import { RideMap } from '@/components/RideMap';
import { ServiceChips } from '@/components/ServiceChips';
import { colors, radii, shadows } from '@/theme';
import { SERVICES } from '@/data/fleet';
import { PODGORICA } from '@/data/places';
import { jitterAround } from '@/lib/geo';
import { useApp } from '@/store/store';
import type { LatLng, ServiceId } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const { homeCoord, homeLabel, locationDenied, setHome, active, draft } = useApp();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHome('Podgorica (demo)', { latitude: PODGORICA.lat, longitude: PODGORICA.lng }, true);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const inME =
        pos.coords.latitude > 41.1 && pos.coords.latitude < 43.6 &&
        pos.coords.longitude > 18.4 && pos.coords.longitude < 20.4;
      if (inME) setHome('Current location', { latitude: pos.coords.latitude, longitude: pos.coords.longitude }, false);
      else setHome('Podgorica (demo)', { latitude: PODGORICA.lat, longitude: PODGORICA.lng }, true);
    })();
  }, [setHome]);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2600);
    return () => clearInterval(t);
  }, []);

  const idleDrivers = useMemo(() => {
    const base = tick * 3;
    return Array.from({ length: 7 }, (_, i) => {
      const seed = base + i * 137 + 11;
      const kind = i % 4 === 3 ? 'courier' : 'car';
      return { id: 'idle' + i, coord: jitterAround(homeCoord, 0.25, 1.6, seed), kind } as const;
    });
  }, [homeCoord, tick]);

  const center: LatLng = draft.pickup
    ? { latitude: draft.pickup.lat, longitude: draft.pickup.lng }
    : homeCoord;

  const onSelectService = (id: ServiceId) => {
    const s = SERVICES[id];
    if (s.kind === 'ride') router.push({ pathname: '/ride', params: { service: id } });
    else router.push({ pathname: '/courier', params: { mode: id } });
  };

  return (
    <View style={styles.root}>
      <RideMap center={center} idleDrivers={idleDrivers} interactive />

      <SafeAreaView edges={['top']} style={styles.topWrap} pointerEvents="box-none">
        <View style={styles.topRow} pointerEvents="box-none">
          <View style={styles.brand}>
            <Text style={styles.brandA}>Monte</Text>
            <Text style={[styles.brandA, { color: colors.accent }]}>Move</Text>
          </View>
          {locationDenied && (
            <View style={styles.demoPill}>
              <Text style={styles.demoText}>Demo location</Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      {active && (
        <Pressable style={styles.resumeCard} onPress={() => router.push('/track')}>
          <View style={styles.pulse} />
          <View style={{ flex: 1 }}>
            <Text style={styles.resumeTitle}>{active.serviceName} in progress</Text>
            <Text style={styles.resumeSub}>{active.dropoff.name} · tap to track</Text>
          </View>
          <Navigation size={18} color={colors.accent} />
        </Pressable>
      )}

      <View style={styles.sheet} pointerEvents="box-none">
        <Pressable
          style={styles.whereBar}
          onPress={() => router.push({ pathname: '/search', params: { field: 'dropoff' } })}
        >
          <Search size={18} color={colors.text3} />
          <Text style={styles.whereText}>Where to?</Text>
          <View style={styles.goDot}>
            <Navigation size={13} color="#0A0E13" />
          </View>
        </Pressable>

        <ServiceChips selected={null} onSelect={onSelectService} />

        <View style={styles.homeRow}>
          <Car size={14} color={colors.text3} />
          <Text style={styles.homeText}>{homeLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topWrap: { position: 'absolute', top: 0, left: 0, right: 0 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  brand: { flexDirection: 'row', backgroundColor: 'rgba(10,14,19,0.82)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border },
  brandA: { color: colors.text, fontWeight: '900', fontSize: 16, letterSpacing: 0.3 },
  demoPill: { backgroundColor: 'rgba(10,14,19,0.82)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border },
  demoText: { color: colors.gold, fontSize: 12, fontWeight: '700' },
  resumeCard: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface2,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 14,
    ...shadows.floating,
  },
  pulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  resumeTitle: { color: colors.text, fontWeight: '800', fontSize: 14.5 },
  resumeSub: { color: colors.text2, fontSize: 12.5, marginTop: 2 },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 96 : 80,
    gap: 12,
  },
  whereBar: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    height: 54,
    ...shadows.card,
  },
  whereText: { color: colors.text, fontSize: 16, fontWeight: '600', flex: 1 },
  goDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  homeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 22, paddingBottom: 2 },
  homeText: { color: colors.text3, fontSize: 12.5, fontWeight: '600' },
});
