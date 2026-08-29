import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react-native';
import { PlaceRow, RecentRow } from '@/components/PlaceRow';
import { colors, radii } from '@/theme';
import { PLACES, PODGORICA, searchPlaces } from '@/data/places';
import { useApp } from '@/store/store';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ field?: string }>();
  const field = params.field === 'pickup' ? 'pickup' : 'dropoff';
  const [q, setQ] = useState('');
  const { recents, draft, setDraft, addRecent, homeLabel } = useApp();

  const results = useMemo(() => searchPlaces(q), [q]);

  const currentPlace = useMemo(() => {
    const src = field === 'pickup' ? draft.pickup : draft.dropoff;
    if (src) return src;
    return { ...PODGORICA, id: 'current', name: 'Current location', detail: homeLabel, kind: 'current' as const };
  }, [field, draft, homeLabel]);

  const pick = (p: (typeof PLACES)[number]) => {
    setDraft({ [field]: p });
    addRecent(p);
    router.back();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <View style={styles.inputWrap}>
          <SearchIcon size={17} color={colors.text3} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={field === 'pickup' ? 'Set pickup point' : 'Where to?'}
            placeholderTextColor={colors.text3}
            style={styles.input}
            autoFocus
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={styles.body}>
        {q.trim() === '' && (
          <>
            <Text style={styles.label}>{field === 'pickup' ? 'Pickup' : 'Destination'}</Text>
            <PlaceRow place={currentPlace} onPress={() => router.back()} sub="Selected" />
            {recents.length > 0 && (
              <>
                <Text style={[styles.label, { marginTop: 14 }]}>Recent</Text>
                {recents.slice(0, 4).map((r) => (
                  <RecentRow key={r.id + r.name} label={`${r.name} · ${r.city}`} onPress={() => pick(r)} />
                ))}
              </>
            )}
            <Text style={[styles.label, { marginTop: 14 }]}>Popular in Montenegro</Text>
          </>
        )}
        <FlatList
          data={results}
          keyExtractor={(p) => p.id + p.name}
          renderItem={({ item }) => <PlaceRow place={item} onPress={() => pick(item)} />}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    backgroundColor: colors.bg,
  },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.surface2,
    borderRadius: radii.pill,
    paddingHorizontal: 15,
    height: 44,
  },
  input: { flex: 1, color: colors.text, fontSize: 15.5, fontWeight: '600' },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  label: { color: colors.text3, fontSize: 12.5, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4, marginTop: 8 },
});
