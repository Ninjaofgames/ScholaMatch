import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { useAuth } from '../../src/context/AuthContext';
import Input from '../../src/components/Input';
import PasswordInput from '../../src/components/PasswordInput';
import Button from '../../src/components/Button';
import { showSnack } from '../../src/components/Snackbar';

const { height, width } = Dimensions.get('window');

export default function AuthScreen() {
    const router = useRouter();
    const { login, register } = useAuth();

    const [mode, setMode] = useState('login');
    const animation = useSharedValue(0);

    const [logEmail, setLogEmail] = useState('');
    const [logPass, setLogPass] = useState('');
    const [regForm, setRegForm] = useState({ first: '', last: '', email: '', pass: '', confirm: '' });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        animation.value = withTiming(mode === 'login' ? 0 : 1, {
            duration: 1000,
            Easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [mode]);

    const loginStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(animation.value, [0, 1], [0, height * 0.5]) }],
        opacity: interpolate(animation.value, [0, 0.4], [1, 0]),
        zIndex: mode === 'login' ? 10 : 1,
    }));

    const registerStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(animation.value, [0, 1], [height * 0.5, 0]) }],
        opacity: interpolate(animation.value, [0.6, 1], [0, 1]),
        zIndex: mode === 'register' ? 10 : 1,
    }));

    const handleLogin = async () => {
        if (!logEmail.trim() || !logPass) { showSnack('Please fill all fields', true); return; }
        setLoading(true);
        try {
            await login(logEmail.trim(), logPass);
            router.replace('/(app)/dashboard');
        } catch (e) { showSnack(e.message, true); }
        finally { setLoading(false); }
    };

    const handleRegister = async () => {
        if (!regForm.first || !regForm.last || !regForm.email || !regForm.pass) { showSnack('Please fill all fields', true); return; }
        if (regForm.pass !== regForm.confirm) { showSnack('Passwords mismatch', true); return; }
        setLoading(true);
        try {
            const res = await register({
                first_name: regForm.first.trim(), last_name: regForm.last.trim(), email: regForm.email.trim(), password: regForm.pass, confirm_password: regForm.confirm,
            });
            router.push(`/(auth)/verify?email=${encodeURIComponent(res?.user?.email ?? regForm.email.trim())}`);
        } catch (e) { showSnack(e.message, true); }
        finally { setLoading(false); }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />

            {/* Glow Effects */}
            <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: 'rgba(79, 70, 229, 0.3)' }]} />
            <View style={[styles.glowOrb, { bottom: -150, right: -100, backgroundColor: 'rgba(124, 58, 237, 0.2)' }]} />

            <SafeAreaView style={styles.safe}>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.content}>
                    <View style={styles.formsWrapper}>

                        {/* LOGIN FORM */}
                        <Animated.View style={[styles.absoluteWrap, loginStyle]} pointerEvents={mode === 'login' ? 'auto' : 'none'}>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                                <View style={styles.illustrationWrap}>
                                    <View style={styles.logoBadge}>
                                        <Ionicons name="school" size={20} color="#fff" />
                                        <Text style={styles.logoBadgeText}>ScholaMatch</Text>
                                    </View>
                                    <Text style={styles.title}>Find the Right School{'\n'}for You</Text>
                                    <Text style={styles.subtitle}>Discover schools that truly match your needs through intelligent recommendations.</Text>
                                </View>

                                <Input icon="mail-outline" placeholder="Email address" value={logEmail} onChangeText={setLogEmail} keyboardType="email-address" autoCapitalize="none" />
                                <PasswordInput placeholder="Password" value={logPass} onChangeText={setLogPass} onSubmitEditing={handleLogin} />

                                <TouchableOpacity style={styles.forgotBtn} onPress={() => router.push('/(auth)/forgot-password')}>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>

                                <Button label="Sign In" onPress={handleLogin} loading={loading && mode === 'login'} style={styles.btn} />

                                <View style={styles.footerRow}>
                                    <Text style={styles.footerText}>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => setMode('register')}>
                                        <Text style={styles.footerLink}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </Animated.View>

                        {/* REGISTER FORM */}
                        <Animated.View style={[styles.absoluteWrap, registerStyle]} pointerEvents={mode === 'register' ? 'auto' : 'none'}>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                                <View style={[styles.illustrationWrap, { marginTop: 10 }]}>
                                    <View style={styles.logoBadge}>
                                        <Ionicons name="school" size={20} color="#fff" />
                                        <Text style={styles.logoBadgeText}>ScholaMatch</Text>
                                    </View>
                                    <Text style={[styles.title, { fontSize: 32 }]}>Create Account</Text>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.col}><Input icon="person-outline" placeholder="First Name" value={regForm.first} onChangeText={t => setRegForm({ ...regForm, first: t })} /></View>
                                    <View style={{ width: 12 }} />
                                    <View style={styles.col}><Input placeholder="Last Name" value={regForm.last} onChangeText={t => setRegForm({ ...regForm, last: t })} /></View>
                                </View>

                                <Input icon="mail-outline" placeholder="Email Address" value={regForm.email} onChangeText={t => setRegForm({ ...regForm, email: t })} keyboardType="email-address" autoCapitalize="none" />
                                <PasswordInput placeholder="Password" value={regForm.pass} onChangeText={t => setRegForm({ ...regForm, pass: t })} />
                                <PasswordInput placeholder="Confirm Password" value={regForm.confirm} onChangeText={t => setRegForm({ ...regForm, confirm: t })} onSubmitEditing={handleRegister} />

                                <Button label="Sign Up" onPress={handleRegister} loading={loading && mode === 'register'} style={styles.btn} />

                                <View style={styles.footerRow}>
                                    <Text style={styles.footerText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => setMode('login')}>
                                        <Text style={styles.footerLink}>Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ height: 40 }} />
                            </ScrollView>
                        </Animated.View>

                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    glowOrb: {
        position: 'absolute', width: 300, height: 300, borderRadius: 150,
        filter: 'blur(80px)', opacity: 0.6,
    },
    safe: { flex: 1, zIndex: 10 },
    content: { flex: 1 },
    formsWrapper: { flex: 1, position: 'relative' },
    absoluteWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingHorizontal: 24 },
    scroll: { flexGrow: 1, justifyContent: 'center' },
    illustrationWrap: { alignItems: 'flex-start', marginBottom: 32 },
    logoBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
    logoBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13, marginLeft: 6 },
    title: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 12, lineHeight: 42 },
    subtitle: { fontSize: 15, color: '#94A3B8', lineHeight: 24 },
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 32, marginTop: -4 },
    forgotText: { color: '#818CF8', fontSize: 14, fontWeight: '600' },
    btn: { marginBottom: 32 },
    footerRow: { flexDirection: 'row', justifyContent: 'center' },
    footerText: { color: '#94A3B8', fontSize: 15 },
    footerLink: { color: '#fff', fontSize: 15, fontWeight: '800' },
    row: { flexDirection: 'row' },
    col: { flex: 1 },
});
