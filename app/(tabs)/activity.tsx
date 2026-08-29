import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, Package } from 'lucide-react-native';
import { colors, radii } from '@/theme';
import { useApp } from '@/store/store';
import { dateLabel, eur } from '@/lib/format';

export default function ActivityScreen() {
  const history = useApp((s) => s.history);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={styles.title}>Activity</Text>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Car size={26} color={colors.text3} />
          </View>
          <Text style={styles.emptyTitle}>No trips yet</Text>
          <Text style={styles.emptySub}>Your rides and deliveries will show up here.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(h) => h.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={[styles.icon, { backgroundColor: item.kind === 'courier' ? 'rgba(255,159,90,0.14)' : colors.accentSoft }]}>
                {item.kind === 'courier' ? <Package size={17} color="#FF9F5A" /> : <Car size={17} color={colors.accent} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.service}>{item.serviceName}</Text>
                  <Text style={styles.price}>{eur(item.price)}</Text>
                </View>
                <Text style={styles.route} numberOfLines={1}>
                  {item.from} → {item.to}
                </Text>
                <Text style={styles.meta}>
                  {dateLabel(item.date)} · {item.driverName} · {item.car}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 26, fontWeight: '900', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 50 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  emptySub: { color: colors.text3, fontSize: 13.5, textAlign: 'center', marginTop: 6 },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 14,
    marginBottom: 10,
  },
  icon: { width: 40, height: 40, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  service: { color: colors.text, fontSize: 14.5, fontWeight: '800' },
  price: { color: colors.accent, fontSize: 14.5, fontWeight: '800' },
  route: { color: colors.text2, fontSize: 13, marginTop: 3 },
  meta: { color: colors.text3, fontSize: 11.5, marginTop: 3 },
});
