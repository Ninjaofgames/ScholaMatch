import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE } from '../../../src/services/storage';

const { width } = Dimensions.get('window');

export default function SchoolDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/schools/${id}/`)
            .then(res => res.json())
            .then(data => {
                setSchool(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleCall = () => {
        if (school?.phone) Linking.openURL(`tel:${school.phone}`);
    };

    const handleEmail = () => {
        if (school?.mail) Linking.openURL(`mailto:${school.mail}`);
    };

    const handleWeb = () => {
        if (school?.website_link) Linking.openURL(school.website_link);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#818CF8" />
            </View>
        );
    }

    if (!school) {
        return (
            <View style={styles.center}>
                <Text style={{ color: '#fff' }}>School not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image 
                        source={{ uri: school.image || 'https://via.placeholder.com/600x400?text=ScholaMatch' }} 
                        style={styles.heroImage} 
                    />
                    <View style={styles.imageOverlay} />
                    
                    <TouchableOpacity 
                        style={styles.backBtn}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <Text style={styles.name}>{school.name}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{school.funding_type}</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <Ionicons name="location-sharp" size={18} color="#818CF8" />
                        <Text style={styles.locationText}>{school.location}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.description}>
                        {school.description || 'No description available for this institution.'}
                    </Text>

                    <View style={styles.infoGrid}>
                        <InfoItem icon="school-outline" label="Level" value={school.education_level} />
                        <InfoItem icon="language-outline" label="Language" value={school.teaching_language} />
                        <InfoItem icon="business-outline" label="University" value={school.university_name || 'N/A'} />
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Contact & Connect</Text>
                    <View style={styles.contactRow}>
                        <ContactBtn icon="call" onPress={handleCall} label="Call" disabled={!school.phone} />
                        <ContactBtn icon="mail" onPress={handleEmail} label="Email" disabled={!school.mail} />
                        <ContactBtn icon="globe" onPress={handleWeb} label="Website" disabled={!school.website_link} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <View style={styles.infoItem}>
            <View style={styles.infoIconBox}>
                <Ionicons name={icon} size={20} color="#818CF8" />
            </View>
            <View>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );
}

function ContactBtn({ icon, onPress, label, disabled }) {
    return (
        <TouchableOpacity 
            style={[styles.contactBtn, disabled && { opacity: 0.3 }]} 
            onPress={onPress}
            disabled={disabled}
        >
            <Ionicons name={icon} size={24} color="#fff" />
            <Text style={styles.contactBtnLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E17' },
    container: { flex: 1, backgroundColor: '#0A0E17' },
    heroContainer: { height: 300, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 14, 23, 0.4)' },
    backBtn: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    content: { flex: 1, backgroundColor: '#0A0E17', marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    name: { flex: 1, fontSize: 28, fontWeight: '800', color: '#fff', marginRight: 12 },
    badge: { backgroundColor: 'rgba(129, 140, 248, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.4)' },
    badgeText: { color: '#818CF8', fontSize: 12, fontWeight: '700' },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    locationText: { color: '#94A3B8', marginLeft: 6, fontSize: 15 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 },
    description: { fontSize: 15, color: '#94A3B8', lineHeight: 24, marginBottom: 24 },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    infoItem: { width: (width - 64) / 2, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(129, 140, 248, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    infoLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },
    infoValue: { fontSize: 14, color: '#CBD5E1', fontWeight: '700' },
    contactRow: { flexDirection: 'row', gap: 12 },
    contactBtn: { flex: 1, height: 80, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    contactBtnLabel: { color: '#94A3B8', fontSize: 12, marginTop: 8, fontWeight: '600' },
});
