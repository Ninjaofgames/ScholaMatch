import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../src/services/authService';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { showSnack } from '../../src/components/Snackbar';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!email.trim() || !email.includes('@')) {
            showSnack('Enter a valid email address', true);
            return;
        }
        setLoading(true);
        try {
            await authService.passwordResetRequest(email.trim());
            router.push(`/(auth)/reset-password?email=${encodeURIComponent(email.trim())}`);
        } catch (e) {
            showSnack(e.message, true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />

            {/* Glow Effects */}
            <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: 'rgba(79, 70, 229, 0.3)' }]} />
            <View style={[styles.glowOrb, { bottom: -150, right: -100, backgroundColor: 'rgba(124, 58, 237, 0.2)' }]} />

            <SafeAreaView style={styles.safe}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                        <View style={styles.illustrationWrap}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="lock-closed" size={48} color="#fff" />
                            </View>
                            <Text style={styles.title}>Forgot Password?</Text>
                            <Text style={styles.subtitle}>
                                No worries! Enter your email address and we will send you a 6-digit reset code.
                            </Text>
                        </View>

                        <View style={styles.formCard}>
                            <Input
                                icon="mail-outline"
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <Button
                                label="Send Reset Code"
                                onPress={submit}
                                loading={loading}
                                style={styles.btn}
                            />
                        </View>
                    </ScrollView>
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
    header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    content: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
    illustrationWrap: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
    iconCircle: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    },
    title: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#94A3B8', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 24, padding: 24,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    btn: { marginTop: 12, height: 56, borderRadius: 28 },
});
