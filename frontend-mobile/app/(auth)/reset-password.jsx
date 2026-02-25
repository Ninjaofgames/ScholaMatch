import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../src/services/authService';
import PasswordInput from '../../src/components/PasswordInput';
import Button from '../../src/components/Button';
import { showSnack } from '../../src/components/Snackbar';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams();

    const [code, setCode] = useState('');
    const [pass, setPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const resend = async () => {
        setResendLoading(true);
        try {
            await authService.passwordResetRequest(email);
            showSnack('New code sent to your email');
        } catch (e) {
            showSnack(e.message, true);
        } finally {
            setResendLoading(false);
        }
    };

    const submit = async () => {
        if (code.length !== 6) { showSnack('Enter the 6-digit code', true); return; }
        if (pass !== confirm) { showSnack('Passwords do not match', true); return; }
        if (pass.length < 8) { showSnack('Min 8 characters', true); return; }

        setLoading(true);
        try {
            const res = await authService.passwordResetConfirm({
                email,
                code,
                new_password: pass,
                confirm_password: confirm,
            });
            if (res.success) {
                showSnack('Password reset successfully!');
                router.replace('/(auth)/login');
            }
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
                                <Ionicons name="shield-checkmark" size={48} color="#fff" />
                            </View>
                            <Text style={styles.title}>Secure Reset</Text>
                            <Text style={styles.subtitle}>
                                Enter the 6-digit code sent to you and set your new password.
                            </Text>
                            <Text style={styles.emailText}>{email}</Text>
                        </View>

                        <View style={styles.formCard}>
                            <View style={styles.codeHeader}>
                                <Text style={styles.codeLabel}>VERIFICATION CODE</Text>
                                <TouchableOpacity onPress={resend} disabled={resendLoading}>
                                    <Text style={[styles.resendLink, resendLoading && { opacity: 0.5 }]}>
                                        {resendLoading ? 'Sending...' : 'Resend Code'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.codeInput}
                                maxLength={6}
                                keyboardType="numeric"
                                textAlign="center"
                                placeholder="000000"
                                placeholderTextColor="#64748B"
                                value={code}
                                onChangeText={(t) => setCode(t.replace(/[^0-9]/g, ''))}
                            />

                            {code.length === 6 ? (
                                <View>
                                    <PasswordInput placeholder="New Password" value={pass} onChangeText={setPass} />
                                    <PasswordInput placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} onSubmitEditing={submit} />

                                    <Button
                                        label="Reset Password"
                                        onPress={submit}
                                        loading={loading}
                                        style={styles.btn}
                                    />
                                </View>
                            ) : (
                                <View style={styles.waitingStep}>
                                    <Ionicons name="lock-closed-outline" size={24} color="#64748B" style={styles.waitingIcon} />
                                    <Text style={styles.waitingText}>Enter the full code above to reveal password fields</Text>
                                </View>
                            )}
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
    illustrationWrap: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
    iconCircle: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    },
    title: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 15, color: '#94A3B8', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10, marginBottom: 8 },
    emailText: { fontSize: 14, color: '#818CF8', fontWeight: '600' },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 24, padding: 24,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    codeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },
    codeLabel: { fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5 },
    resendLink: { fontSize: 13, color: '#818CF8', fontWeight: '600' },
    codeInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16, paddingVertical: 14,
        fontSize: 32, fontWeight: '700', letterSpacing: 10, color: '#F8FAFC',
        marginBottom: 24,
    },
    waitingStep: { alignItems: 'center', paddingVertical: 20 },
    waitingIcon: { marginBottom: 10, opacity: 0.5 },
    waitingText: { color: '#64748B', fontSize: 13, textAlign: 'center' },
    btn: { marginTop: 12, height: 56, borderRadius: 28 },
});
