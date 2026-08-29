import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii } from '@/theme';

type Props = {
  label: string;
  active?: boolean;
  accent?: string;
  onPress?: () => void;
};

export function Chip({ label, active, accent = colors.accent, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? accent : colors.surface2, borderColor: active ? accent : colors.border },
      ]}
    >
      <Text style={{ color: active ? '#0A0E13' : colors.text2, fontWeight: '700', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
