import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Car, MapPin, Package, Square } from 'lucide-react-native';
import { colors } from '@/theme';
import type { LatLng, Place } from '@/types';

type IdleDriver = { id: string; coord: LatLng; kind: 'car' | 'courier' };

type Props = {
  center: LatLng;
  zoom?: number;
  routeTrip?: LatLng[];
  routeDriver?: LatLng[];
  driverPos?: LatLng | null;
  driverKind?: 'car' | 'courier' | 'van';
  pickup?: Place | null;
  dropoff?: Place | null;
  idleDrivers?: IdleDriver[];
  fitAll?: boolean;
  interactive?: boolean;
};

const DELTA = 0.012;

export function RideMap({
  center,
  zoom = 1,
  routeTrip,
  routeDriver,
  driverPos,
  driverKind = 'car',
  pickup,
  dropoff,
  idleDrivers = [],
  fitAll = false,
  interactive = true,
}: Props) {
  type MapHandle = React.ComponentRef<typeof MapView>;
  const ref = useRef<MapHandle | null>(null);

  const all: LatLng[] = useMemo(() => {
    const pts: LatLng[] = [center];
    if (fitAll) {
      routeTrip?.forEach((p) => pts.push(p));
      routeDriver?.forEach((p) => pts.push(p));
      if (driverPos) pts.push(driverPos);
    }
    return pts;
  }, [center, fitAll, routeTrip, routeDriver, driverPos]);

  useEffect(() => {
    if (fitAll && all.length > 1 && ref.current) {
      ref.current.fitToCoordinates(all, {
        edgePadding: { top: 140, right: 80, bottom: 320, left: 80 },
        animated: true,
      });
    }
  }, [fitAll, all]);

  const pin = (color: string, icon: React.ReactNode) => (
    <View style={[styles.pin, { backgroundColor: color }]}>{icon}</View>
  );

  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      userInterfaceStyle="dark"
      initialRegion={{
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: DELTA * zoom,
        longitudeDelta: DELTA * zoom,
      }}
      toolbarEnabled={false}
      showsCompass={false}
      rotateEnabled={false}
      pitchEnabled={false}
      scrollEnabled={interactive}
      zoomEnabled={interactive}
      showsUserLocation={false}
    >
      {routeDriver && routeDriver.length > 1 && (
        <Polyline coordinates={routeDriver} strokeWidth={4} strokeColor={colors.accentDim} lineDashPattern={[1, 6]} />
      )}
      {routeTrip && routeTrip.length > 1 && (
        <Polyline coordinates={routeTrip} strokeWidth={5} strokeColor={colors.mapRoute} />
      )}

      {idleDrivers.map((d) => (
        <Marker key={d.id} coordinate={d.coord} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <View style={[styles.idleDot, { backgroundColor: d.kind === 'courier' ? '#FF9F5A' : colors.accent }]}>
            {d.kind === 'courier' ? <Package size={12} color="#0A0E13" /> : <Car size={12} color="#0A0E13" />}
          </View>
        </Marker>
      ))}

      {driverPos && (
        <Marker coordinate={driverPos} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={[styles.driverDot, { backgroundColor: driverKind === 'courier' ? '#FF9F5A' : colors.accent }]}>
            {driverKind === 'courier' ? <Package size={16} color="#0A0E13" /> : <Car size={16} color="#0A0E13" />}
          </View>
        </Marker>
      )}

      {pickup && (
        <Marker coordinate={{ latitude: pickup.lat, longitude: pickup.lng }} anchor={{ x: 0.5, y: 1 }}>
          {pin(colors.accent, <MapPin size={13} color="#0A0E13" />)}
        </Marker>
      )}
      {dropoff && (
        <Marker coordinate={{ latitude: dropoff.lat, longitude: dropoff.lng }} anchor={{ x: 0.5, y: 1 }}>
          {pin(colors.danger, <Square size={11} color={colors.white} fill={colors.white} />)}
        </Marker>
      )}
      {!pickup && !dropoff && !driverPos && (
        <Marker coordinate={center} anchor={{ x: 0.5, y: 1 }}>
          {pin(colors.accent, <MapPin size={13} color="#0A0E13" />)}
        </Marker>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0A0E13',
  },
  idleDot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', opacity: 0.9 },
  driverDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#0A0E13',
  },
});
