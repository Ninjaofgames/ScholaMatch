import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { prefsService } from '../../src/services/preferencesService';

export default function DashboardScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [prefs, setPrefs] = useState(null);

    useEffect(() => {
        prefsService
            .fetchMyPreferences()
            .then((p) => setPrefs(p))
            .catch(() => { });
    }, []);

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
            <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: 'rgba(79, 70, 229, 0.3)' }]} />

            <SafeAreaView style={styles.safe}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <View style={styles.logoRow}>
                                <Ionicons name="school" size={24} color="#4F46E5" />
                                <Text style={styles.brandText}>ScholaMatch</Text>
                            </View>
                            <View style={styles.headerActions}>
                                <TouchableOpacity onPress={() => router.push('/(app)/profile')} style={styles.iconBtn}>
                                    <View style={styles.iconCircle}>
                                        <Ionicons name="person-outline" size={20} color="#F8FAFC" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.welcomeText}>Hello, {user?.first_name || 'there'} 👋</Text>
                        <Text style={styles.welcomeSub}>Welcome back to ScholaMatch</Text>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconWrap, { backgroundColor: 'rgba(79, 70, 229, 0.15)' }]}>
                                    <Ionicons name="person" size={18} color="#818CF8" />
                                </View>
                                <Text style={styles.cardTitle}>Account Info</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="mail-outline" size={16} color="#64748B" />
                                <Text style={styles.infoLabel}>Email:</Text>
                                <Text style={styles.infoValue}>{user?.email}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="person-outline" size={16} color="#64748B" />
                                <Text style={styles.infoLabel}>Name:</Text>
                                <Text style={styles.infoValue}>{user?.first_name} {user?.last_name}</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(app)/preferences')}>
                                <View style={[styles.iconWrapBig, { backgroundColor: 'rgba(79, 70, 229, 0.15)' }]}>
                                    <Ionicons name="options-outline" size={24} color="#818CF8" />
                                </View>
                                <Text style={styles.quickText}>Preferences</Text>
                            </TouchableOpacity>
                            <View style={{ width: 16 }} />
                            <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(app)/profile')}>
                                <View style={[styles.iconWrapBig, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                                    <Ionicons name="settings-outline" size={24} color="#34D399" />
                                </View>
                                <Text style={styles.quickText}>Settings</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    glowOrb: { position: 'absolute', width: 300, height: 300, borderRadius: 150, filter: 'blur(80px)', opacity: 0.6 },
    safe: { flex: 1 },
    scroll: { flexGrow: 1 },
    header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    logoRow: { flexDirection: 'row', alignItems: 'center' },
    brandText: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginLeft: 8, letterSpacing: 0.5 },
    headerActions: { flexDirection: 'row' },
    iconBtn: { marginLeft: 16 },
    iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    welcomeText: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 8 },
    welcomeSub: { color: '#94A3B8', fontSize: 15 },
    content: { padding: 24, flex: 1 },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 24, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    iconWrap: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    infoLabel: { fontSize: 14, color: '#94A3B8', marginLeft: 10, marginRight: 8, width: 50 },
    infoValue: { fontSize: 14, fontWeight: '600', color: '#F8FAFC', flex: 1 },
    prefCard: { backgroundColor: 'rgba(79, 70, 229, 0.1)', borderColor: 'rgba(79, 70, 229, 0.3)' },
    prefCardDone: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' },
    prefRow: { flexDirection: 'row', alignItems: 'center' },
    prefTextCol: { flex: 1 },
    prefTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 6 },
    prefSub: { color: '#94A3B8', fontSize: 13, lineHeight: 20 },
    prefBtn: { backgroundColor: '#4F46E5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginLeft: 16 },
    prefBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16, marginTop: 12 },
    quickActions: { flexDirection: 'row' },
    quickCard: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 24, padding: 20,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    iconWrapBig: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    quickText: { fontWeight: '600', fontSize: 14, color: '#F8FAFC' },
});
