import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, CreditCard, Globe, Info, Lock, ShieldCheck, Trash2 } from 'lucide-react-native';
import { colors, radii } from '@/theme';
import { useApp } from '@/store/store';

const SECTIONS: { icon: React.ReactNode; label: string; sub: string; onPress?: (reset: () => void) => void }[][] = [
  [
    { icon: <CreditCard size={17} color={colors.text2} />, label: 'Payment methods', sub: 'Cash & card on delivery' },
    { icon: <Globe size={17} color={colors.text2} />, label: 'Language', sub: 'English (more coming)' },
  ],
  [
    { icon: <ShieldCheck size={17} color={colors.text2} />, label: 'Safety', sub: 'SOS, trusted contacts' },
    { icon: <Lock size={17} color={colors.text2} />, label: 'Privacy', sub: 'Your data, your rules' },
    { icon: <Info size={17} color={colors.text2} />, label: 'About MonteMove', sub: 'v1.0.0 · demo build' },
  ],
];

export default function AccountScreen() {
  const reset = () => useApp.persist.clearStorage();

  const handleReset = () => {
    Alert.alert('Reset demo data?', 'Clears trip history and saved addresses.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          useApp.setState({ history: [], recents: [] });
          reset();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={styles.title}>Account</Text>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>NM</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Demo Rider</Text>
            <Text style={styles.sub}>+382 67 000 000 · demo account</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>DEMO</Text>
          </View>
        </View>

        {SECTIONS.map((group, gi) => (
          <View key={gi} style={styles.group}>
            {group.map((row) => (
              <Pressable key={row.label} style={styles.row} onPress={() => undefined}>
                <View style={styles.rowIcon}>{row.icon}</View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowSub}>{row.sub}</Text>
                </View>
                <ChevronRight size={16} color={colors.text3} />
              </Pressable>
            ))}
          </View>
        ))}

        <Pressable style={styles.reset} onPress={handleReset}>
          <Trash2 size={16} color={colors.danger} />
          <Text style={styles.resetText}>Reset demo data</Text>
        </Pressable>

        <Text style={styles.foot}>
          MonteMove is a concept demo for rides & courier services across Montenegro. All drivers, prices and trips are
          simulated for testing.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 26, fontWeight: '900', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14 },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 16,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#0A0E13', fontWeight: '900', fontSize: 19 },
  name: { color: colors.text, fontSize: 16.5, fontWeight: '800' },
  sub: { color: colors.text3, fontSize: 12.5, marginTop: 2 },
  tag: { backgroundColor: colors.surface3, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.pill },
  tagText: { color: colors.gold, fontSize: 10.5, fontWeight: '900', letterSpacing: 1 },
  group: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginTop: 14,
    paddingHorizontal: 14,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { color: colors.text, fontSize: 14.5, fontWeight: '700' },
  rowSub: { color: colors.text3, fontSize: 12, marginTop: 1.5 },
  reset: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.dangerSoft,
    borderRadius: radii.lg,
    padding: 14,
    marginTop: 16,
  },
  resetText: { color: colors.danger, fontWeight: '800', fontSize: 14 },
  foot: { color: colors.text3, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 22, paddingHorizontal: 10 },
});
