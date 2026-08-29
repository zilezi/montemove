import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquare, Phone, Star, X } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { RideMap } from '@/components/RideMap';
import { SosSheet } from '@/components/SosSheet';
import { colors, radii, shadows } from '@/theme';
import { pointAlong } from '@/lib/geo';
import { eur } from '@/lib/format';
import { driversFor } from '@/data/fleet';
import { useApp } from '@/store/store';
import type { LatLng } from '@/types';

const TICK_MS = 420;

export default function TrackScreen() {
  const router = useRouter();
  const { active, updateActive, completeActive, cancelActive } = useApp();
  const [sos, setSos] = useState(false);
  const [tip, setTip] = useState<number | null>(null);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!active) {
      router.replace('/');
    }
  }, [active, router]);

  useEffect(() => {
    if (!active || active.status === 'complete') return;
    const timer = setInterval(() => {
      tickRef.current += 1;
      const b = useApp.getState().active;
      if (!b) return;

      if (b.status === 'matching') {
        if (tickRef.current >= 6) {
          const pool = driversFor(
            b.kind === 'courier' ? 'courier' : b.service === 'vanxl' ? 'vanxl' : b.service === 'comfort' ? 'comfort' : b.service === 'van6' ? 'van6' : 'standard'
          );
          const driver = pool[Math.floor(Math.random() * pool.length)] ?? null;
          updateActive({ status: 'arriving', driver });
        }
        return;
      }

      const route = b.phase === 'to_pickup' ? b.routeDriver : b.routeTrip;
      if (route.length < 2) return;
      const seconds = b.phase === 'to_pickup' ? 40 + b.etaPickupMin * 6 : 55 + b.etaTripMin * 2.2;
      const step = TICK_MS / 1000 / seconds;
      const next = b.progress + step;
      if (next >= 1) {
        if (b.phase === 'to_pickup') {
          updateActive({ progress: 0, phase: 'on_job', status: 'working' });
        } else {
          updateActive({ progress: 1, status: 'complete' });
        }
      } else {
        updateActive({ progress: next });
      }
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [active?.id, active?.status, updateActive]);

  const driverPos: LatLng = useMemo(() => {
    if (!active) return { latitude: 0, longitude: 0 };
    if (active.status === 'complete') return pointAlong(active.routeTrip, 1);
    const route = active.phase === 'to_pickup' ? active.routeDriver : active.routeTrip;
    return pointAlong(route, active.progress);
  }, [active]);

  const etaNow = useMemo(() => {
    if (!active || active.status === 'complete') return 0;
    const remainingSec =
      (1 - active.progress) * (active.phase === 'to_pickup' ? 40 + active.etaPickupMin * 6 : 55 + active.etaTripMin * 2.2);
    return Math.max(1, Math.round(remainingSec / 6));
  }, [active]);

  if (!active) return null;

  const statusLine =
    active.status === 'matching'
      ? 'Finding your driver nearby…'
      : active.status === 'arriving'
        ? `${active.driver?.name.split(' ')[0]} is coming to pick up`
        : active.status === 'working'
          ? active.kind === 'courier'
            ? 'Package on the way'
            : 'On the way to destination'
          : 'Delivered — receipt';

  const headerLabel = active.kind === 'courier' ? active.serviceName : `${active.serviceName} · ${active.scheduledLabel === 'Now' ? 'now' : active.scheduledLabel.toLowerCase()}`;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.mapWrap}>
        <RideMap
          center={driverPos}
          driverPos={driverPos}
          driverKind={active.kind === 'courier' ? (active.service === 'vanxl' ? 'van' : 'courier') : 'car'}
          pickup={active.pickup}
          dropoff={active.dropoff}
          routeDriver={active.status === 'matching' ? undefined : active.phase === 'to_pickup' ? active.routeDriver : undefined}
          routeTrip={active.phase === 'on_job' || active.status === 'complete' ? active.routeTrip : undefined}
        />
        <Pressable
          style={styles.closeFab}
          onPress={() => {
            if (active.status === 'complete') {
              completeActive();
              router.replace('/');
            } else {
              Alert.alert('Cancel ride?', 'You can keep tracking the trip instead.', [
                { text: 'Keep tracking', style: 'cancel' },
                {
                  text: 'Cancel ride',
                  style: 'destructive',
                  onPress: () => {
                    cancelActive();
                    router.replace('/');
                  },
                },
              ]);
            }
          }}
        >
          <X size={19} color={active.status === 'complete' ? colors.accent : colors.text} />
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: active.status === 'complete' ? colors.gold : colors.accent }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headTitle}>{headerLabel}</Text>
            <Text style={styles.headStatus}>{statusLine}</Text>
          </View>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{eur(active.price)}</Text>
            <Text style={styles.priceSub}>{active.payment === 'cash' ? 'cash' : 'card'}</Text>
          </View>
        </View>

        {active.status === 'matching' && (
          <View style={styles.matchingBox}>
            <View style={styles.pulse} />
            <Text style={styles.matchingText}>Connecting to nearby drivers…</Text>
          </View>
        )}

        {(active.status === 'arriving' || active.status === 'working') && (
          <>
            <View style={styles.driverCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{active.driver?.name.slice(0, 1) ?? '?'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>{active.driver?.name}</Text>
                <Text style={styles.driverCar}>
                  {active.driver ? `${active.driver.car} · ${active.driver.color} · ${active.driver.plate}` : ''}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  <Star size={12} color={colors.gold} fill={colors.gold} />
                  <Text style={styles.rating}>
                    {active.driver?.rating.toFixed(2)} · {active.driver?.trips} trips · {active.driver?.yearsExp}y exp
                  </Text>
                </View>
              </View>
              <View style={{ gap: 8 }}>
                <View style={styles.etaChip}>
                  <Text style={styles.etaChipText}>
                    {active.status === 'arriving' ? `${etaNow} min` : `${etaNow} min left`}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
                  <Pressable style={styles.circleBtn}>
                    <MessageSquare size={16} color={colors.text} />
                  </Pressable>
                  <Pressable style={styles.circleBtn}>
                    <Phone size={16} color={colors.text} />
                  </Pressable>
                </View>
              </View>
            </View>

            {active.kind === 'courier' && active.courier && (
              <View style={styles.packageBox}>
                <Text style={styles.packageText}>
                  {active.courier.size} package{active.courier.express ? ' · express' : ''}
                  {active.courier.helpers > 0 ? ` · ${active.courier.helpers} helper(s)` : ''}
                  {active.courier.description ? ` — ${active.courier.description}` : ''}
                </Text>
              </View>
            )}
          </>
        )}

        {active.status === 'complete' && (
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 210 }}>
            <View style={styles.receipt}>
              <Text style={styles.receiptTitle}>Trip receipt</Text>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptK}>From</Text>
                <Text style={styles.receiptV} numberOfLines={1}>{active.pickup.name}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptK}>To</Text>
                <Text style={styles.receiptV} numberOfLines={1}>{active.dropoff.name}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptK}>Service</Text>
                <Text style={styles.receiptV}>{active.serviceName}</Text>
              </View>
              <View style={[styles.receiptRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.receiptK}>Paid ({active.payment})</Text>
                <Text style={[styles.receiptV, { color: colors.accent, fontWeight: '900' }]}>{eur(active.price)}</Text>
              </View>
            </View>

            <Text style={styles.tipLabel}>Add a tip</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              {[1, 2, 3, 5].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTip(t)}
                  style={[styles.tipChip, tip === t && { backgroundColor: colors.accent }]}
                >
                  <Text style={[styles.tipText, tip === t && { color: '#0A0E13' }]}>{eur(t)}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}

        {active.status !== 'complete' ? (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button label="SOS" variant="danger" style={{ flex: 1 }} onPress={() => setSos(true)} />
            <Button label="Share trip" variant="ghost" style={{ flex: 1.4 }} onPress={() => Alert.alert('Live link copied', 'montemove.app/live/demo — friends can follow your trip.')} />
          </View>
        ) : (
          <Button
            label="Done"
            onPress={() => {
              completeActive();
              router.replace('/');
            }}
          />
        )}
      </View>

      <SosSheet visible={sos} onClose={() => setSos(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  mapWrap: { flex: 1 },
  closeFab: {
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
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
    ...shadows.floating,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  headTitle: { color: colors.text, fontSize: 15.5, fontWeight: '900' },
  headStatus: { color: colors.text2, fontSize: 13, marginTop: 2 },
  priceTag: { alignItems: 'flex-end' },
  priceText: { color: colors.text, fontSize: 17, fontWeight: '900' },
  priceSub: { color: colors.text3, fontSize: 11.5, fontWeight: '700', textTransform: 'uppercase' },
  matchingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface2,
    borderRadius: radii.md,
    padding: 14,
  },
  pulse: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: colors.accent },
  matchingText: { color: colors.text2, fontSize: 14, fontWeight: '600' },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface2,
    borderRadius: radii.lg,
    padding: 13,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#0A0E13', fontSize: 19, fontWeight: '900' },
  driverName: { color: colors.text, fontSize: 15.5, fontWeight: '800' },
  driverCar: { color: colors.text2, fontSize: 12.5, marginTop: 2 },
  rating: { color: colors.text3, fontSize: 11.5, fontWeight: '600' },
  etaChip: { backgroundColor: colors.accent, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-end' },
  etaChipText: { color: '#0A0E13', fontWeight: '900', fontSize: 13 },
  circleBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface3, alignItems: 'center', justifyContent: 'center' },
  packageBox: { backgroundColor: colors.surface2, borderRadius: radii.md, padding: 12, marginTop: -4 },
  packageText: { color: colors.text2, fontSize: 13, fontWeight: '600' },
  receipt: { backgroundColor: colors.surface2, borderRadius: radii.lg, padding: 14 },
  receiptTitle: { color: colors.text, fontSize: 15, fontWeight: '900', marginBottom: 8 },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  receiptK: { color: colors.text3, fontSize: 13.5, fontWeight: '600' },
  receiptV: { color: colors.text, fontSize: 13.5, fontWeight: '700', maxWidth: '62%' },
  tipLabel: { color: colors.text3, fontSize: 12.5, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  tipChip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: { color: colors.text, fontWeight: '800', fontSize: 13.5 },
});
