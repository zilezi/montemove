import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { RideMap } from '@/components/RideMap';
import { VehicleOption } from '@/components/VehicleOption';
import { colors, radii, shadows } from '@/theme';
import { SERVICES, VEHICLE_CLASSES } from '@/data/fleet';
import { PODGORICA } from '@/data/places';
import { distanceKm, useApp } from '@/store/store';
import { quote } from '@/lib/pricing';
import { eur, mins } from '@/lib/format';
import type { ServiceId, VehicleClassId } from '@/types';

const CLASS_OPTIONS: Record<string, VehicleClassId[]> = {
  taxi: ['standard', 'comfort', 'van6'],
  comfort: ['comfort'],
  van6: ['van6'],
  transfer: ['standard', 'comfort', 'van6'],
  airport: ['standard', 'comfort', 'van6'],
};

const SCHEDULES = ['Now', 'In 1 hour', 'In 3 hours', 'Tomorrow 09:00'];

export default function RideScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ service?: string }>();
  const service: ServiceId = SERVICES[(params.service ?? 'taxi') as ServiceId]
    ? ((params.service ?? 'taxi') as ServiceId)
    : 'taxi';
  const meta = SERVICES[service];

  const { draft, setDraft, createBooking, homeLabel } = useApp();
  const [classId, setClassId] = useState<VehicleClassId>(meta.classId);
  const [schedule, setSchedule] = useState('Now');
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
  const etaTrip = useMemo(() => Math.round((km / (km > 25 ? 74 : 26)) * 60), [km]);

  const options = useMemo(() => {
    const list = CLASS_OPTIONS[service] ?? [meta.classId];
    return list.map((id) => {
      const v = VEHICLE_CLASSES[id];
      const q = quote({ service, km, min: etaTrip });
      const total = q.total * (id === 'standard' ? 1 : v.multiplier);
      return { vehicle: v, price: Math.round(total * 20) / 20, etaMin: 2 + ((id.length * 7 + km) | 0) % 9 };
    });
  }, [service, km, etaTrip, meta.classId]);

  const selected = options.find((o) => o.vehicle.id === classId) ?? options[0];
  const fixed = quote({ service, km, min: etaTrip }).fixed;

  if (!dropoff) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.missing}>
          <MapPin size={26} color={colors.accent} />
          <Text style={styles.missingTitle}>Choose a destination</Text>
          <Button
            label="Search destination"
            onPress={() => router.push({ pathname: '/search', params: { field: 'dropoff' } })}
            style={{ alignSelf: 'stretch', marginTop: 18 }}
          />
          <Button label="Back" variant="ghost" onPress={() => router.back()} style={{ alignSelf: 'stretch', marginTop: 10 }} />
        </View>
      </SafeAreaView>
    );
  }

  const confirm = () => {
    if (!selected) return;
    createBooking({
      kind: 'ride',
      service,
      serviceName: service === 'airport' ? 'Airport transfer' : meta.label,
      pickup,
      dropoff,
      price: selected.price,
      payment,
      scheduledLabel: schedule,
      etaPickupMin: selected.etaMin,
      etaTripMin: etaTrip,
      courier: null,
    });
    setDraft({ payment });
    router.replace('/track');
  };

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
          <Text style={styles.title}>{service === 'airport' ? 'Airport transfer' : `${meta.label} ride`}</Text>

          <View style={styles.stops}>
            <View style={styles.stopRow}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <Text style={styles.stopText} numberOfLines={1}>
                {pickup.name}
              </Text>
            </View>
            <View style={styles.stopLine} />
            <View style={styles.stopRow}>
              <View style={[styles.dot, { backgroundColor: colors.danger }]} />
              <Text style={styles.stopText} numberOfLines={1}>
                {dropoff.name}
              </Text>
            </View>
          </View>

          <View style={styles.factsRow}>
            <Text style={styles.fact}>
              {km.toFixed(1)} km · {mins(etaTrip)}
            </Text>
            {selected && (
              <Text style={[styles.fact, { color: colors.accent, fontWeight: '800' }]}>
                {eur(selected.price)}
                {fixed ? ' · fixed price' : ''}
              </Text>
            )}
          </View>

          {(service === 'transfer' || service === 'airport') && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Schedule</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {SCHEDULES.map((s) => (
                  <Chip key={s} label={s} active={schedule === s} onPress={() => setSchedule(s)} />
                ))}
              </ScrollView>
            </View>
          )}

          <View style={{ marginTop: 14 }}>
            <Text style={styles.label}>Choose your ride</Text>
            {options.map((o) => (
              <VehicleOption
                key={o.vehicle.id}
                vehicle={o.vehicle}
                price={o.price}
                etaMin={o.etaMin}
                selected={selected?.vehicle.id === o.vehicle.id}
                onSelect={() => setClassId(o.vehicle.id)}
              />
            ))}
          </View>

          <View style={{ marginTop: 4 }}>
            <Text style={styles.label}>Payment</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Chip label="Cash to driver" active={payment === 'cash'} onPress={() => setPayment('cash')} />
              <Chip label="Card on arrival" active={payment === 'card'} onPress={() => setPayment('card')} />
            </View>
          </View>
        </ScrollView>

        <Button label={`Confirm ${selected ? eur(selected.price) : ''}`} onPress={confirm} style={{ marginTop: 10 }} />
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
  title: { color: colors.text, fontSize: 19, fontWeight: '900', letterSpacing: 0.2 },
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
  },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  missingTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 12 },
});
