import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SchoolCard({ school }) {
    const router = useRouter();

    const getBadgeColor = (level) => {
        const l = level?.toLowerCase() || '';
        if (l.includes('primary')) return '#EF4444';
        if (l.includes('middle')) return '#F59E0B';
        if (l.includes('high')) return '#3B82F6';
        if (l.includes('university') || l.includes('higher')) return '#10B981';
        return '#6366F1';
    };

    return (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => router.push(`/(app)/school/${school.id}`)}
        >
            <View style={styles.imageContainer}>
                {school.image ? (
                    <Image source={{ uri: school.image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="school" size={40} color="rgba(255,255,255,0.2)" />
                    </View>
                ) }
                <View style={[styles.badge, { backgroundColor: getBadgeColor(school.education_level) }]}>
                    <Text style={styles.badgeText}>{school.education_level || 'School'}</Text>
                </View>
            </View>
            
            <View style={styles.body}>
                <Text style={styles.title} numberOfLines={1}>{school.name}</Text>
                
                <View style={styles.ratingRow}>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <Ionicons 
                                key={i} 
                                name={i <= (school.rating || 0) ? "star" : "star-outline"} 
                                size={14} 
                                color={i <= (school.rating || 0) ? "#F59E0B" : "#475569"} 
                            />
                        ))}
                    </View>
                    <Text style={styles.ratingText}>{school.rating || 0} ({school.review_count || 0})</Text>
                </View>

                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color="#94A3B8" />
                    <Text style={styles.locationText} numberOfLines={1}>{school.location || 'Unknown'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    imageContainer: {
        height: 160,
        position: 'relative',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    body: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    ratingText: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: '600',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: '#94A3B8',
        fontSize: 13,
        marginLeft: 4,
    },
});
