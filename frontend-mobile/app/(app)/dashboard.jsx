import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { API_BASE } from '../../src/services/storage';
import SchoolCard from '../../src/components/SchoolCard';

export default function DashboardScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [schools, setSchools] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const res = await fetch(`${API_BASE}/schools/search/?q=${query}`);
                const data = await res.json();
                setSchools(data);
            } catch (e) {
                console.error("Fetch schools failed:", e);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchSchools, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
            <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: 'rgba(79, 70, 229, 0.3)' }]} />

            <SafeAreaView style={styles.safe}>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.logoRow}>
                            <Ionicons name="school" size={24} color="#4F46E5" />
                            <Text style={styles.brandText}>ScholaMatch</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/(app)/profile')} style={styles.iconCircle}>
                            <Ionicons name="person-outline" size={20} color="#F8FAFC" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.welcomeText}>Find Your Place 👋</Text>
                    
                    <View style={styles.searchBox}>
                        <Ionicons name="search" size={20} color="#64748B" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search schools, cities..."
                            placeholderTextColor="#64748B"
                            value={query}
                            onChangeText={setQuery}
                        />
                    </View>
                </View>

                {loading && schools.length === 0 ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#4F46E5" />
                    </View>
                ) : (
                    <FlatList
                        data={schools}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <SchoolCard school={item} />}
                        contentContainerStyle={styles.listContent}
                        ListHeaderComponent={<Text style={styles.sectionTitle}>Featured Institutions</Text>}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.1)" />
                                <Text style={styles.emptyText}>No schools found for "{query}"</Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    glowOrb: { position: 'absolute', width: 300, height: 300, borderRadius: 150, filter: 'blur(80px)', opacity: 0.6 },
    safe: { flex: 1 },
    header: { paddingHorizontal: 24, paddingVertical: 20 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    logoRow: { flexDirection: 'row', alignItems: 'center' },
    brandText: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginLeft: 8, letterSpacing: 0.5 },
    iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    welcomeText: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 20 },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
    searchInput: { flex: 1, marginLeft: 12, color: '#fff', fontSize: 16 },
    listContent: { paddingHorizontal: 24, paddingBottom: 40 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16, marginTop: 10 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyText: { color: '#64748B', fontSize: 16, marginTop: 16, textAlign: 'center' },
});
