import { Pressable, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { colors, radii } from '@/theme';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost' | 'danger' | 'dark';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', disabled, style }: Props) {
  const bg =
    variant === 'primary'
      ? colors.accent
      : variant === 'danger'
        ? colors.danger
        : variant === 'ghost'
          ? colors.surface2
          : colors.surface3;
  const fg = variant === 'primary' ? '#06231E' : variant === 'danger' ? colors.white : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.82 : 1 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: { fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
});

export function SectionTitle({ children, right }: { children: string; right?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <Text style={{ color: colors.text2, fontSize: 13, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' }}>
        {children}
      </Text>
      {right ? <Text style={{ color: colors.text3, fontSize: 13 }}>{right}</Text> : null}
    </View>
  );
}

export function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor={colors.text3}
      {...props}
      style={[{ backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, color: colors.text, paddingHorizontal: 14, height: 46, fontSize: 14.5, fontWeight: '600' }, props.style]}
    />
  );
}
