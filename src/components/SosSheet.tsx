import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { PhoneCall, Siren, Share2, X } from 'lucide-react-native';
import { colors, radii, shadows } from '@/theme';

export function SosSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const call = (n: string) => Linking.openURL(`tel:${n}`);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.badge}>
              <Siren size={18} color={colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Emergency</Text>
              <Text style={styles.sub}>Your live trip link can be shared with family or police.</Text>
            </View>
            <Pressable onPress={onClose} style={styles.close}>
              <X size={16} color={colors.text2} />
            </Pressable>
          </View>

          <Pressable style={styles.action} onPress={() => call('112')}>
            <PhoneCall size={17} color={colors.text} />
            <Text style={styles.actionText}>Call 112 — General emergency</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={() => call('122')}>
            <PhoneCall size={17} color={colors.text} />
            <Text style={styles.actionText}>Call 122 — Traffic police</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={() => Linking.openURL('https://montemove.app/live/bk_demo')}>
            <Share2 size={17} color={colors.text} />
            <Text style={styles.actionText}>Share live trip link</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(4,6,9,0.65)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: 20,
    paddingBottom: 34,
    gap: 10,
    ...shadows.floating,
  },
  handle: { alignSelf: 'center', width: 44, height: 4.5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  badge: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 17, fontWeight: '800' },
  sub: { color: colors.text2, fontSize: 12.5, marginTop: 2, flex: 1 },
  close: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface2,
    borderRadius: radii.md,
    padding: 15,
  },
  actionText: { color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 },
});
