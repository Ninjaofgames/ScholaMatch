import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { prefsService } from '../../src/services/preferencesService';
import Button from '../../src/components/Button';
import { showSnack } from '../../src/components/Snackbar';

export default function PreferencesScreen() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [selectedChoiceId, setSelectedChoiceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([
            prefsService.fetchQuestions(),
            prefsService.fetchMyPreferences(),
        ])
            .then(([qs, prefs]) => {
                setQuestions(qs);
                setSessionId(prefs.session?.id || null);
                setLoading(false);
            })
            .catch((e) => {
                showSnack('Failed to load questions', true);
                setLoading(false);
            });
    }, []);

    const startSession = async (skip = false) => {
        setSubmitting(true);
        try {
            const res = await prefsService.startSession(skip);
            if (skip) {
                router.replace('/(app)/dashboard');
                return;
            }
            setSessionId(res.session_id);
        } catch (e) {
            showSnack(e.message, true);
        } finally {
            setSubmitting(false);
        }
    };

    const next = async () => {
        if (!selectedChoiceId || !sessionId) return;
        const current = questions[currentIndex];
        setSubmitting(true);
        try {
            await prefsService.submitAnswer(current.id, selectedChoiceId, sessionId);
            if (currentIndex === questions.length - 1) {
                await prefsService.finishSession(sessionId);
                showSnack('Preferences saved!');
                router.replace('/(app)/dashboard');
            } else {
                setCurrentIndex(currentIndex + 1);
                setSelectedChoiceId(null);
            }
        } catch (e) {
            showSnack(e.message, true);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#818CF8" />
            </View>
        );
    }

    const hasSession = sessionId !== null;
    const question = hasSession && questions.length > 0 ? questions[currentIndex] : null;
    const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
            <View style={[styles.glowOrb, { top: -100, left: -50, backgroundColor: 'rgba(79, 70, 229, 0.3)' }]} />
            <View style={[styles.glowOrb, { bottom: -150, right: -100, backgroundColor: 'rgba(124, 58, 237, 0.2)' }]} />

            <SafeAreaView style={styles.safe}>
                <View style={styles.header}>
                    {hasSession ? (
                        <TouchableOpacity onPress={() => router.replace('/(app)/dashboard')}>
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 28 }} />
                    )}
                    <Text style={styles.headerText}>
                        {hasSession ? `Question ${currentIndex + 1} of ${questions.length}` : ''}
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

                {!hasSession ? (
                    <ScrollView contentContainerStyle={styles.introScroll}>
                        <View style={styles.iconBox}>
                            <Ionicons name="color-wand" size={32} color="#fff" />
                        </View>
                        <Text style={styles.title}>Personalize Your{'\n'}School Matches</Text>
                        <Text style={styles.subtitle}>
                            Answer a short preference test so we can recommend schools that truly match your needs, priorities, and learning goals.
                        </Text>

                        <View style={styles.infoCard}>
                            <View style={styles.infoTitleRow}>
                                <View style={styles.infoIconBox}>
                                    <Ionicons name="bulb-outline" size={20} color="#818CF8" />
                                </View>
                                <Text style={styles.infoTitle}>Why take this test?</Text>
                            </View>
                            <Text style={styles.infoText}>
                                Your answers help our intelligent system filter and rank schools based on what matters most to you — location, budget, quality, and environment.
                            </Text>
                        </View>

                        <Button label="Start Preference Test" onPress={() => startSession()} loading={submitting} style={styles.btn} />
                        <Button label="Skip for now" onPress={() => startSession(true)} outlined />
                    </ScrollView>
                ) : (
                    <View style={styles.qContainer}>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                        </View>

                        <Text style={styles.qText}>{question?.text}</Text>

                        <ScrollView style={styles.choicesList}>
                            {question?.choices?.map((c) => {
                                const selected = selectedChoiceId === c.id;
                                return (
                                    <TouchableOpacity
                                        key={c.id}
                                        style={[styles.choiceItem, selected && styles.choiceSelected]}
                                        onPress={() => setSelectedChoiceId(c.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.radio, selected && styles.radioSelected]}>
                                            {selected && <View style={styles.radioDot} />}
                                        </View>
                                        <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
                                            {c.text}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <View style={styles.actionRow}>
                            <View style={{ flex: 1 }}>
                                <Button label="Skip" onPress={() => router.replace('/(app)/dashboard')} outlined />
                            </View>
                            <View style={{ width: 16 }} />
                            <View style={{ flex: 1 }}>
                                <Button
                                    label={currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
                                    onPress={next}
                                    loading={submitting}
                                    style={!selectedChoiceId ? { opacity: 0.5 } : {}}
                                />
                            </View>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E17' },
    container: { flex: 1, backgroundColor: '#0A0E17' },
    glowOrb: { position: 'absolute', width: 300, height: 300, borderRadius: 150, filter: 'blur(80px)', opacity: 0.6 },
    safe: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20 },
    headerText: { fontSize: 13, fontWeight: '700', color: '#818CF8', letterSpacing: 0.5 },
    introScroll: { paddingHorizontal: 24, paddingBottom: 40 },
    iconBox: { width: 64, height: 64, backgroundColor: 'rgba(79, 70, 229, 0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(79,70,229,0.5)' },
    title: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 16, lineHeight: 44 },
    subtitle: { fontSize: 16, color: '#94A3B8', lineHeight: 26, marginBottom: 32 },
    infoCard: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 40 },
    infoTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    infoIconBox: { backgroundColor: 'rgba(79, 70, 229, 0.15)', padding: 8, borderRadius: 12, marginRight: 12 },
    infoTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
    infoText: { fontSize: 15, color: '#94A3B8', lineHeight: 24 },
    btn: { marginBottom: 16 },
    qContainer: { flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
    progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999, marginBottom: 32 },
    progressBarFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 999, shadowColor: '#4F46E5', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 0 } },
    qText: { fontSize: 24, fontWeight: '700', color: '#fff', lineHeight: 32, marginBottom: 32 },
    choicesList: { flex: 1 },
    choiceItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, padding: 20, marginBottom: 16 },
    choiceSelected: { borderColor: '#4F46E5', backgroundColor: 'rgba(79, 70, 229, 0.1)' },
    radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#64748B', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    radioSelected: { borderColor: '#4F46E5', backgroundColor: '#4F46E5' },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
    choiceText: { fontSize: 16, color: '#CBD5E1', flex: 1 },
    choiceTextSelected: { color: '#fff', fontWeight: '700' },
    actionRow: { flexDirection: 'row', marginTop: 24 },
});
