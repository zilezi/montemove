import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Car, Package, Plane, Route, Star, Truck, Users } from 'lucide-react-native';
import { colors, radii, shadows } from '@/theme';
import { SERVICES } from '@/data/fleet';
import type { ServiceId } from '@/types';

const ICONS = {
  car: Car,
  star: Star,
  users: Users,
  route: Route,
  plane: Plane,
  package: Package,
  truck: Truck,
} as const;

export function ServiceChips({ selected, onSelect }: { selected: ServiceId | null; onSelect: (id: ServiceId) => void }) {
  const order: ServiceId[] = ['taxi', 'comfort', 'van6', 'transfer', 'airport', 'courier', 'vanxl'];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {order.map((id) => {
        const s = SERVICES[id];
        const Icon = ICONS[s.icon];
        const active = selected === id;
        return (
          <Pressable
            key={id}
            onPress={() => onSelect(id)}
            style={[
              styles.chip,
              { borderColor: active ? s.accent : colors.border, backgroundColor: active ? colors.surface2 : colors.surface },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: active ? s.accent : colors.surface3 }]}>
              <Icon size={15} color={active ? '#0A0E13' : s.accent} />
            </View>
            <View>
              <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13 }}>{s.label}</Text>
              <Text style={{ color: colors.text3, fontSize: 11, marginTop: 1 }}>{s.blurb}</Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 16, gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1.5,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...shadows.card,
  },
  iconWrap: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
