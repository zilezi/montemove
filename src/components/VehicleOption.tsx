import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Users } from 'lucide-react-native';
import { colors, radii } from '@/theme';
import { eur } from '@/lib/format';
import type { VehicleClass } from '@/types';

type Props = {
  vehicle: VehicleClass;
  price: number;
  etaMin: number;
  selected: boolean;
  onSelect: () => void;
};

export function VehicleOption({ vehicle, price, etaMin, selected, onSelect }: Props) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.card,
        { borderColor: selected ? colors.accent : colors.border, backgroundColor: selected ? colors.accentSoft : colors.surface },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.surface3 }]}>
        <Users size={18} color={colors.text} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.name}>{vehicle.name}</Text>
          <Text style={styles.seats}>· {vehicle.seats}</Text>
        </View>
        <Text style={styles.sample} numberOfLines={1}>
          {vehicle.sample}
        </Text>
        <Text style={styles.tagline} numberOfLines={1}>
          {vehicle.tagline}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.price}>{eur(price)}</Text>
        <Text style={styles.eta}>{etaMin} min away</Text>
        {selected && (
          <View style={styles.check}>
            <Check size={12} color="#0A0E13" />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 10,
  },
  icon: { width: 44, height: 44, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.text, fontSize: 15.5, fontWeight: '700' },
  seats: { color: colors.text3, fontSize: 13, fontWeight: '600' },
  sample: { color: colors.text2, fontSize: 12.5, marginTop: 2 },
  tagline: { color: colors.text3, fontSize: 12, marginTop: 1 },
  price: { color: colors.text, fontSize: 16, fontWeight: '800' },
  eta: { color: colors.text3, fontSize: 12, marginTop: 2 },
  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
});
