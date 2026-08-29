import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Box, MapPin, Minus, Plus, Refrigerator, Zap } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { RideMap } from '@/components/RideMap';
import { colors, radii, shadows } from '@/theme';
import { PODGORICA } from '@/data/places';
import { distanceKm, useApp } from '@/store/store';
import { quote } from '@/lib/pricing';
import { eur, mins } from '@/lib/format';
import type { PackageSize, ServiceId } from '@/types';

const SIZES: { id: PackageSize; title: string; sub: string; example: string }[] = [
  { id: 'S', title: 'Small', sub: '≤ 2 kg · envelope or box', example: 'Documents, phone, keys' },
  { id: 'M', title: 'Medium', sub: '≤ 10 kg · shoebox size', example: 'Clothes, bakery, meds' },
  { id: 'L', title: 'Large', sub: '≤ 30 kg · big bag', example: 'Suitcase, monitor, crate' },
  { id: 'XL', title: 'XL · Van', sub: 'Furniture & appliances', example: 'Bed, fridge, Ducato class' },
];

export default function CourierScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode: ServiceId = params.mode === 'vanxl' ? 'vanxl' : 'courier';
  const isVan = mode === 'vanxl';

  const { draft, setDraft, createBooking, homeLabel } = useApp();
  const [size, setSize] = useState<PackageSize>(isVan ? 'XL' : draft.size);
  const [express, setExpress] = useState(false);
  const [helpers, setHelpers] = useState(0);
  const [payment, setPayment] = useState<'cash' | 'card'>(draft.payment);

  const pickup = useMemo(
    () =>
      draft.pickup ?? {
        ...PODGORICA,
        id: 'current',
        name: 'Current location',
        detail: homeLabel,
        kind: 'current' as const,
      },
    [draft.pickup, homeLabel]
  );
  const dropoff = draft.dropoff;
  const km = useMemo(() => (dropoff ? distanceKm(pickup, dropoff) : 0), [pickup, dropoff]);
  const etaTrip = useMemo(() => Math.round((km / (km > 25 ? 70 : 24)) * 60), [km]);

  const q = useMemo(
    () => quote({ service: mode, km, min: etaTrip, size, express, helpers }),
    [mode, km, etaTrip, size, express, helpers]
  );

  if (!dropoff) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.missing}>
          <MapPin size={26} color={colors.accent} />
          <Text style={styles.missingTitle}>{isVan ? 'Where should we deliver?' : 'Where is it going?'}</Text>
          <Button
            label="Search address"
            onPress={() => router.push({ pathname: '/search', params: { field: 'dropoff' } })}
            style={{ alignSelf: 'stretch', marginTop: 18 }}
          />
          <Button label="Back" variant="ghost" onPress={() => router.back()} style={{ alignSelf: 'stretch', marginTop: 10 }} />
        </View>
      </SafeAreaView>
    );
  }

  const confirm = () => {
    createBooking({
      kind: 'courier',
      service: mode,
      serviceName: isVan ? 'Van XL delivery' : 'Courier delivery',
      pickup,
      dropoff,
      price: q.total,
      payment,
      scheduledLabel: 'Now',
      etaPickupMin: 4 + ((km * 3) | 0) % 7,
      etaTripMin: etaTrip,
      courier: {
        size,
        description: draft.description,
        recipient: draft.recipient,
        recipientPhone: draft.recipientPhone,
        express,
        helpers,
      },
    });
    setDraft({ payment, size });
    router.replace('/track');
  };

  const visibleSizes = isVan ? SIZES.filter((s) => s.id === 'XL') : SIZES.filter((s) => s.id !== 'XL');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.mapWrap}>
        <RideMap center={{ latitude: pickup.lat, longitude: pickup.lng }} pickup={pickup} dropoff={dropoff} />
        <Pressable style={styles.backFab} onPress={() => router.back()}>
          <ArrowLeft size={19} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
          <Text style={styles.title}>{isVan ? 'Van XL — big stuff' : 'Courier — send a package'}</Text>

          <View style={styles.stops}>
            <View style={styles.stopRow}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <Text style={styles.stopText} numberOfLines={1}>
                Pickup · {pickup.name}
              </Text>
            </View>
            <View style={styles.stopLine} />
            <View style={styles.stopRow}>
              <View style={[styles.dot, { backgroundColor: colors.danger }]} />
              <Text style={styles.stopText} numberOfLines={1}>
                Drop-off · {dropoff.name}
              </Text>
            </View>
          </View>

          <View style={styles.factsRow}>
            <Text style={styles.fact}>
              {km.toFixed(1)} km · {mins(etaTrip)}
            </Text>
            <Text style={[styles.fact, { color: colors.accent, fontWeight: '800' }]}>
              {eur(q.total)} · fixed
            </Text>
          </View>

          <Text style={styles.label}>{isVan ? 'Vehicle' : 'Package size'}</Text>
          {visibleSizes.map((s) => {
            const active = size === s.id;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSize(s.id)}
                style={[styles.sizeCard, active && { borderColor: colors.accent, backgroundColor: colors.accentSoft }]}
              >
                <View style={[styles.sizeIcon, { backgroundColor: colors.surface3 }]}>
                  {s.id === 'XL' ? <Refrigerator size={18} color={colors.text} /> : <Box size={18} color={colors.text} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sizeTitle}>{s.title}</Text>
                  <Text style={styles.sizeSub}>{s.sub}</Text>
                </View>
                <Text style={styles.sizeExample}>{s.example}</Text>
              </Pressable>
            );
          })}

          {!isVan && (
            <Pressable style={[styles.sizeCard, express && { borderColor: colors.gold, backgroundColor: 'rgba(245,197,66,0.1)' }]} onPress={() => setExpress(!express)}>
              <View style={[styles.sizeIcon, { backgroundColor: colors.surface3 }]}>
                <Zap size={18} color={express ? colors.gold : colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sizeTitle}>Express</Text>
                <Text style={styles.sizeSub}>Priority pickup · +25%</Text>
              </View>
            </Pressable>
          )}

          {isVan && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>Helpers</Text>
              <View style={[styles.sizeCard, { justifyContent: 'space-between' }]}>
                <Text style={styles.sizeTitle}>Carry help (€10 each)</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <Pressable
                    onPress={() => setHelpers(Math.max(0, helpers - 1))}
                    style={styles.stepBtn}
                  >
                    <Minus size={16} color={colors.text} />
                  </Pressable>
                  <Text style={styles.stepNum}>{helpers}</Text>
                  <Pressable
                    onPress={() => setHelpers(Math.min(2, helpers + 1))}
                    style={styles.stepBtn}
                  >
                    <Plus size={16} color={colors.text} />
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View style={{ marginTop: 12 }}>
            <Text style={styles.label}>{isVan ? 'What are we moving?' : 'What is in the package?'}</Text>
            <TextInput
              value={draft.description}
              onChangeText={(t) => setDraft({ description: t })}
              placeholder={isVan ? 'e.g. Washing machine, 2nd floor' : 'e.g. Books, fragile'}
              placeholderTextColor={colors.text3}
              style={styles.input}
            />
          </View>

          {!isVan && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Recipient</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  value={draft.recipient}
                  onChangeText={(t) => setDraft({ recipient: t })}
                  placeholder="Name"
                  placeholderTextColor={colors.text3}
                  style={[styles.input, { flex: 1 }]}
                />
                <TextInput
                  value={draft.recipientPhone}
                  onChangeText={(t) => setDraft({ recipientPhone: t })}
                  placeholder="+382…"
                  placeholderTextColor={colors.text3}
                  keyboardType="phone-pad"
                  style={[styles.input, { width: 120 }]}
                />
              </View>
            </View>
          )}

          <View style={{ marginTop: 12 }}>
            <Text style={styles.label}>Payment</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Chip label="Cash" active={payment === 'cash'} onPress={() => setPayment('cash')} />
              <Chip label="Card on delivery" active={payment === 'card'} onPress={() => setPayment('card')} />
            </View>
          </View>
        </ScrollView>

        <Button label={`Order courier · ${eur(q.total)}`} onPress={confirm} style={{ marginTop: 10 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  mapWrap: { flex: 1 },
  backFab: {
    position: 'absolute',
    top: 12,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    ...shadows.floating,
  },
  title: { color: colors.text, fontSize: 19, fontWeight: '900' },
  stops: { marginTop: 12 },
  stopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  stopLine: { width: 1.5, height: 14, backgroundColor: colors.border, marginLeft: 4.25 },
  stopText: { color: colors.text, fontSize: 14.5, fontWeight: '600', flex: 1 },
  factsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 4 },
  fact: { color: colors.text2, fontSize: 13.5, fontWeight: '600' },
  label: {
    color: colors.text3,
    fontSize: 12.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 10,
  },
  sizeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    padding: 13,
    marginBottom: 8,
  },
  sizeIcon: { width: 42, height: 42, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  sizeTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  sizeSub: { color: colors.text3, fontSize: 12.5, marginTop: 2 },
  sizeExample: { color: colors.text3, fontSize: 11.5, maxWidth: 90, textAlign: 'right' },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    color: colors.text,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14.5,
    fontWeight: '600',
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { color: colors.text, fontSize: 17, fontWeight: '800', minWidth: 22, textAlign: 'center' },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  missingTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 12 },
});
