import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../src/components/Button';
import { prefsService } from '../../src/services/preferencesService';
import { showSnack } from '../../src/components/Snackbar';

export default function WelcomeScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleChoice = async (startTest) => {
        setLoading(true);
        try {
            if (startTest) {
                // startSession(skip=false)
                await prefsService.startSession(false);
                router.replace('/(app)/preferences');
            } else {
                // startSession(skip=true) - records skipping in DB
                await prefsService.startSession(true);
                router.replace('/(app)/dashboard');
            }
        } catch (e) {
            showSnack(e.message, true);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
            
            {/* Background Glows */}
            <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: 'rgba(79, 70, 229, 0.3)' }]} />
            <View style={[styles.glowOrb, { bottom: -150, right: -100, backgroundColor: 'rgba(124, 58, 237, 0.2)' }]} />

            <SafeAreaView style={styles.safe}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.header}>
                        <View style={styles.iconBox}>
                            <Ionicons name="sparkles" size={32} color="#fff" />
                        </View>
                        <Text style={styles.successBadge}>EMAIL VERIFIED</Text>
                        <Text style={styles.title}>Welcome to{'\n'}ScholaMatch!</Text>
                        <Text style={styles.subtitle}>
                            Your account is now active. To get the best school recommendations, we recommend taking our short personality test.
                        </Text>
                    </View>

                    <View style={styles.choices}>
                        <TouchableOpacity 
                            style={styles.choiceCard} 
                            onPress={() => handleChoice(true)}
                            activeOpacity={0.7}
                            disabled={loading}
                        >
                            <View style={styles.choiceIconWrap}>
                                <Ionicons name="school" size={28} color="#fff" />
                            </View>
                            <View style={styles.choiceTextWrap}>
                                <Text style={styles.choiceTitle}>Start Personality Test</Text>
                                <Text style={styles.choiceDesc}>Find schools that match your Academic DNA in 2 minutes.</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.choiceCard, styles.skipCard]} 
                            onPress={() => handleChoice(false)}
                            activeOpacity={0.7}
                            disabled={loading}
                        >
                            <View style={[styles.choiceIconWrap, styles.skipIconWrap]}>
                                <Ionicons name="arrow-forward" size={24} color="#94A3B8" />
                            </View>
                            <View style={styles.choiceTextWrap}>
                                <Text style={styles.choiceTitle}>Browse Schools Directly</Text>
                                <Text style={styles.choiceDesc}>Skip the test and explore the app on your own.</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    glowOrb: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.6 },
    safe: { flex: 1 },
    scroll: { paddingHorizontal: 24, paddingVertical: 40 },
    header: { alignItems: 'center', marginBottom: 48 },
    iconBox: { width: 80, height: 80, backgroundColor: 'rgba(79, 70, 229, 0.2)', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(79,70,229,0.5)' },
    successBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: 12, fontWeight: '700', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginBottom: 16, letterSpacing: 1 },
    title: { fontSize: 36, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 16, lineHeight: 44 },
    subtitle: { fontSize: 16, color: '#94A3B8', textAlign: 'center', lineHeight: 26 },
    choices: { gap: 16 },
    choiceCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
        padding: 20, 
        borderRadius: 24, 
        borderWidth: 1.5, 
        borderColor: '#4F46E5',
    },
    skipCard: { borderColor: 'rgba(255,255,255,0.1)' },
    choiceIconWrap: { width: 56, height: 56, backgroundColor: '#4F46E5', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    skipIconWrap: { backgroundColor: 'rgba(255,255,255,0.05)' },
    choiceTextWrap: { flex: 1 },
    choiceTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
    choiceDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 18 },
});
