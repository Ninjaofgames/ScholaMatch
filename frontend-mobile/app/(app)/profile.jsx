import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth, getInitials } from '../../src/context/AuthContext';
import { authService } from '../../src/services/authService';
import { prefsService } from '../../src/services/preferencesService';
import { API_BASE } from '../../src/services/storage';
import Input from '../../src/components/Input';
import PasswordInput from '../../src/components/PasswordInput';
import Button from '../../src/components/Button';
import { showSnack } from '../../src/components/Snackbar';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, refreshUser, logout } = useAuth();

    const [prefs, setPrefs] = useState(null);
    const [prefsLoading, setPrefsLoading] = useState(true);

    const [form, setForm] = useState({ first: '', last: '', email: '' });
    const [pass, setPass] = useState({ current: '', new: '', confirm: '' });

    const [editingInfo, setEditingInfo] = useState(false);
    const [editingPass, setEditingPass] = useState(false);

    const [savingInfo, setSavingInfo] = useState(false);
    const [savingPass, setSavingPass] = useState(false);

    const [avatarUri, setAvatarUri] = useState(null);

    useEffect(() => {
        if (user) setForm({ first: user.first_name, last: user.last_name, email: user.email });
        prefsService.fetchMyPreferences()
            .then((p) => { setPrefs(p); setPrefsLoading(false); })
            .catch(() => setPrefsLoading(false));
    }, [user]);

    const pickAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setAvatarUri(result.assets[0].uri);
        }
    };

    const saveProfile = async () => {
        setSavingInfo(true);
        try {
            const data = new FormData();
            if (form.first) data.append('first_name', form.first);
            if (form.last) data.append('last_name', form.last);
            if (form.email) data.append('email', form.email);
            if (avatarUri) {
                data.append('avatar', {
                    uri: avatarUri,
                    name: 'avatar.jpg',
                    type: 'image/jpeg',
                });
            }
            await authService.updateProfile(data);
            await refreshUser();
            showSnack('Profile updated');
            setEditingInfo(false);
            setAvatarUri(null);
        } catch (e) {
            showSnack(e.message, true);
        } finally {
            setSavingInfo(false);
        }
    };

    const savePassword = async () => {
        if (pass.new !== pass.confirm) { showSnack('Passwords do not match', true); return; }
        if (pass.new.length < 8) { showSnack('Min 8 chars', true); return; }
        setSavingPass(true);
        try {
            await authService.changePassword({
                current_password: pass.current,
                new_password: pass.new,
                confirm_password: pass.confirm,
            });
            showSnack('Password updated');
            setPass({ current: '', new: '', confirm: '' });
            setEditingPass(false);
        } catch (e) {
            showSnack(e.message, true);
        } finally {
            setSavingPass(false);
        }
    };

    const avatarUrl = user?.avatar_url
        ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${API_BASE.replace('/api', '')}${user.avatar_url}`)
        : null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
            <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: 'rgba(79, 70, 229, 0.3)' }]} />

            <SafeAreaView style={styles.safe}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { logout(); router.replace('/(auth)/login'); }} style={styles.backBtn}>
                            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.hero}>
                        <TouchableOpacity onPress={pickAvatar} style={styles.avatarWrap}>
                            {avatarUri ? (
                                <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                            ) : avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
                            ) : (
                                <View style={styles.avatarFallback}>
                                    <Text style={styles.avatarLetters}>{getInitials(user)}</Text>
                                </View>
                            )}
                            <View style={styles.camBadge}>
                                <Ionicons name="camera" size={14} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.heroName}>{user?.first_name} {user?.last_name}</Text>
                        <Text style={styles.heroEmail}>{user?.email}</Text>
                    </View>

                    <View style={styles.content}>
                        <Card
                            title="Personal Info"
                            icon="person-outline"
                            action={editingInfo ? "Cancel" : "Edit"}
                            onAction={() => setEditingInfo(!editingInfo)}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, marginRight: 12 }}>
                                    <Input icon="person" editable={editingInfo} value={form.first} onChangeText={(t) => setForm({ ...form, first: t })} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Input editable={editingInfo} value={form.last} onChangeText={(t) => setForm({ ...form, last: t })} />
                                </View>
                            </View>
                            <Input icon="mail" editable={editingInfo} value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} />

                            {avatarUri && (
                                <View style={styles.newFilesRow}>
                                    <Ionicons name="image-outline" size={16} color="#10B981" />
                                    <Text style={styles.newFilesText}>New photo selected</Text>
                                </View>
                            )}

                            {editingInfo && (
                                <Button label="Save Changes" onPress={saveProfile} loading={savingInfo} />
                            )}
                        </Card>

                        <Card
                            title="Security"
                            icon="lock-closed-outline"
                            action={editingPass ? "Cancel" : "Change Password"}
                            onAction={() => setEditingPass(!editingPass)}
                        >
                            {editingPass ? (
                                <View>
                                    <PasswordInput placeholder="Current Password" value={pass.current} onChangeText={(t) => setPass({ ...pass, current: t })} />
                                    <PasswordInput placeholder="New Password" value={pass.new} onChangeText={(t) => setPass({ ...pass, new: t })} />
                                    <PasswordInput placeholder="Confirm Password" value={pass.confirm} onChangeText={(t) => setPass({ ...pass, confirm: t })} />
                                    <Button label="Update Password" onPress={savePassword} loading={savingPass} />
                                </View>
                            ) : (
                                <Text style={styles.mutedText}>Tap "Change Password" to update your password</Text>
                            )}
                        </Card>

                        <Card
                            title="Academic DNA"
                            icon="analytics-outline"
                            action="Retake"
                            onAction={() => router.push('/(app)/preferences')}
                        >
                            {prefsLoading ? (
                                <ActivityIndicator color="#818CF8" />
                            ) : !prefs?.has_completed ? (
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 32, marginBottom: 8 }}>🎯</Text>
                                    <Text style={[styles.mutedText, { textAlign: 'center', marginBottom: 16 }]}>Take the personality test to see your school matching analytics.</Text>
                                    <Button label="Take the Test" onPress={() => router.push('/(app)/preferences')} color="#4F46E5" />
                                </View>
                            ) : (
                                <View>
                                    <ScoreBar label="Location" value={prefs.location_score} color="#3B82F6" icon="location-outline" />
                                    <ScoreBar label="Financial" value={prefs.financial_score} color="#10B981" icon="cash-outline" />
                                    <ScoreBar label="Pedagogical" value={prefs.pedagogical_score} color="#F59E0B" icon="school-outline" />
                                    <ScoreBar label="Infrastructure" value={prefs.infrastructure_score} color="#818CF8" icon="business-outline" />
                                </View>
                            )}
                        </Card>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const ScoreBar = ({ label, value, color, icon }) => (
    <View style={styles.scoreRow}>
        <View style={styles.scoreHeader}>
            <Ionicons name={icon} size={14} color={color} style={{ marginRight: 6 }} />
            <Text style={styles.scoreLabel}>{label}</Text>
            <Text style={[styles.scoreVal, { color }]}>{value}%</Text>
        </View>
        <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBarFill, { width: `${value}%`, backgroundColor: color }]} />
        </View>
    </View>
);

const Card = ({ title, icon, action, onAction, children }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}><Ionicons name={icon} size={18} color="#818CF8" /></View>
            <Text style={styles.cardTitle}>{title}</Text>
            <View style={{ flex: 1 }} />
            {action && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={styles.cardAction}>{action}</Text>
                </TouchableOpacity>
            )}
        </View>
        {children}
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    glowOrb: { position: 'absolute', width: 300, height: 300, borderRadius: 150, filter: 'blur(80px)', opacity: 0.6 },
    safe: { flex: 1 },
    scroll: { flexGrow: 1, paddingBottom: 40 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    hero: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    avatarWrap: { position: 'relative', marginBottom: 12 },
    avatarImg: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: 'rgba(255,255,255,0.1)' },
    avatarFallback: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    avatarLetters: { color: '#fff', fontSize: 28, fontWeight: '700' },
    camBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4F46E5', padding: 6, borderRadius: 16 },
    heroName: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 4 },
    heroEmail: { color: '#94A3B8', fontSize: 13 },
    content: { padding: 20 },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    cardIconWrap: { backgroundColor: 'rgba(79, 70, 229, 0.15)', padding: 8, borderRadius: 10, marginRight: 12 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
    cardAction: { fontSize: 13, fontWeight: '600', color: '#818CF8' },
    mutedText: { fontSize: 13, color: '#64748B' },
    tagWrap: { backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 10 },
    tagLabel: { fontSize: 12, fontWeight: '700', color: '#F8FAFC', marginBottom: 2 },
    tagVal: { fontSize: 12, color: '#94A3B8' },
    accRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    accLabel: { fontSize: 13, color: '#94A3B8' },
    accVal: { fontSize: 13, fontWeight: '600', color: '#F8FAFC' },
    badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
    badgeText: { fontSize: 12, fontWeight: '600', color: '#10B981' },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 12 },
    newFilesRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 10, marginBottom: 16 },
    newFilesText: { color: '#10B981', fontSize: 13, marginLeft: 8 },
    scoreRow: { marginBottom: 16 },
    scoreHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    scoreLabel: { flex: 1, fontSize: 13, color: '#94A3B8', fontWeight: '600' },
    scoreVal: { fontSize: 13, fontWeight: '700' },
    scoreBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' },
    scoreBarFill: { height: '100%', borderRadius: 3 },
});
