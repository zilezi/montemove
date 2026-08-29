import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Clock, MapPin, Navigation, Plane } from 'lucide-react-native';
import { colors, radii } from '@/theme';
import type { Place } from '@/types';

export function PlaceRow({ place, onPress, sub }: { place: Place; onPress?: () => void; sub?: string }) {
  const icon =
    place.kind === 'airport' ? (
      <Plane size={17} color={colors.text2} />
    ) : place.kind === 'current' ? (
      <Navigation size={16} color={colors.accent} />
    ) : (
      <MapPin size={17} color={colors.text2} />
    );
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <View style={styles.icon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.detail} numberOfLines={1}>
          {sub ?? `${place.detail} · ${place.city}`}
        </Text>
      </View>
    </Pressable>
  );
}

export function RecentRow({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <View style={styles.icon}>
        <Clock size={16} color={colors.text3} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 4 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  detail: { color: colors.text3, fontSize: 12.5, marginTop: 2 },
});
