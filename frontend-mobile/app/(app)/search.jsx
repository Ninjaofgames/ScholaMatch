import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Image,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE } from '../../src/services/storage';

export default function SearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState([]);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchMode, setSearchMode] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const availableFilters = [
        { id: 'good teachers', label: 'Good Teachers', icon: 'person-outline' },
        { id: 'affordable', label: 'Affordable', icon: 'cash-outline' },
        { id: 'good facilities', label: 'Facilities', icon: 'business-outline' },
        { id: 'recommended', label: 'Recommended', icon: 'thumbs-up-outline' },
    ];

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const qs = new URLSearchParams();
            if (query) qs.append('q', query);
            filters.forEach(f => qs.append('filter', f));
            
            const response = await fetch(`${API_BASE}/schools/search/?${qs.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setSchools(Array.isArray(data) ? data : (data.results || []));
                setSearchMode(data.search_mode || '');
            }
        } catch (error) {
            console.error("Failed to fetch schools", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, [query, filters]);

    const toggleFilter = (id) => {
        if (filters.includes(id)) {
            setFilters(filters.filter(f => f !== id));
        } else {
            setFilters([...filters, id]);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
            
            <SafeAreaView style={styles.safe}>
                <View style={styles.header}>
                    <View style={styles.searchBarWrapper}>
                        <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Search schools..."
                            placeholderTextColor="#64748B"
                            value={query}
                            onChangeText={setQuery}
                            autoCorrect={false}
                        />
                        <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterBtn}>
                            <Ionicons name="options-outline" size={20} color={filters.length > 0 ? '#818CF8' : '#fff'} />
                        </TouchableOpacity>
                    </View>

                    {showFilters && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                            {availableFilters.map(f => {
                                const active = filters.includes(f.id);
                                return (
                                    <TouchableOpacity 
                                        key={f.id} 
                                        style={[styles.chip, active && styles.chipActive]}
                                        onPress={() => toggleFilter(f.id)}
                                    >
                                        <Ionicons name={f.icon} size={14} color={active ? '#fff' : '#94A3B8'} style={{ marginRight: 6 }} />
                                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>

                {searchMode === 'smart' && (
                    <View style={styles.aiBadge}>
                        <Ionicons name="sparkles" size={12} color="#818CF8" />
                        <Text style={styles.aiText}>AI-Powered matching — optimized for you</Text>
                    </View>
                )}

                {loading ? (
                    <View style={styles.center}><ActivityIndicator color="#4F46E5" /></View>
                ) : (
                    <ScrollView contentContainerStyle={styles.scroll}>
                        {schools.length > 0 ? (
                            schools.map(school => (
                                <TouchableOpacity 
                                    key={school.id} 
                                    style={styles.card}
                                    onPress={() => router.push(`/(app)/school/${school.id}`)}
                                >
                                    <View style={styles.cardImgWrap}>
                                        {school.image ? (
                                            <Image source={{ uri: school.image }} style={styles.cardImg} />
                                        ) : (
                                            <View style={styles.imgPlaceholder}><Ionicons name="school" size={32} color="rgba(255,255,255,0.2)" /></View>
                                        )}
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{school.education_level || 'School'}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.cardBody}>
                                        <Text style={styles.cardTitle}>{school.name}</Text>
                                        <View style={styles.locRow}>
                                            <Ionicons name="location-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                                            <Text style={styles.locText} numberOfLines={1}>{school.location || 'Local'}</Text>
                                        </View>
                                        <View style={styles.ratingRow}>
                                            {[1,2,3,4,5].map(i => (
                                                <Ionicons key={i} name="star" size={12} color={i <= (school.rating || 0) ? '#F59E0B' : '#1E293B'} />
                                            ))}
                                            <Text style={styles.ratingText}>({school.review_count || 0})</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.empty}>
                                <Text style={styles.emptyText}>No schools found</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    safe: { flex: 1 },
    header: { padding: 20, backgroundColor: '#0A0E17', zIndex: 100 },
    searchBarWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    searchIcon: { marginRight: 12 },
    input: { flex: 1, color: '#fff', fontSize: 16 },
    filterBtn: { width: 40, height: 40, backgroundColor: 'rgba(79, 70, 229, 0.15)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    filterRow: { flexDirection: 'row', marginTop: 16 },
    chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    chipActive: { backgroundColor: 'rgba(79, 70, 229, 0.2)', borderColor: '#4F46E5' },
    chipText: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
    chipTextActive: { color: '#fff' },
    aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(129, 140, 248, 0.1)', marginHorizontal: 20, marginBottom: 16, padding: 10, borderRadius: 12 },
    aiText: { color: '#818CF8', fontSize: 12, marginLeft: 8, fontWeight: '600' },
    scroll: { paddingHorizontal: 20, paddingBottom: 40 },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 24, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardImgWrap: { height: 180, position: 'relative' },
    cardImg: { width: '100%', height: '100%' },
    imgPlaceholder: { width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    badge: { position: 'absolute', top: 16, right: 16, backgroundColor: '#4F46E5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    cardBody: { padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 8 },
    locRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    locText: { color: '#94A3B8', fontSize: 13 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { color: '#64748B', fontSize: 12, marginLeft: 6 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#64748B', fontSize: 16 },
});
