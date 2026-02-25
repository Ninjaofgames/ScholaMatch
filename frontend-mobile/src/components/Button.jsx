import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function Button({
    label,
    onPress,
    loading = false,
    outlined = false,
    style,
}) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                outlined ? styles.outlined : styles.solid,
                (loading || !onPress) ? styles.disabled : null,
                style,
            ]}
            onPress={loading ? null : onPress}
            activeOpacity={0.8}
            disabled={loading || !onPress}
        >
            {loading ? (
                <ActivityIndicator color={outlined ? '#fff' : '#0F172A'} />
            ) : (
                <Text
                    style={[
                        styles.label,
                        outlined ? styles.outlinedLabel : styles.solidLabel,
                    ]}
                >
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 28, // fully rounded pill
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    solid: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    disabled: {
        opacity: 0.6,
    },
    label: {
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    solidLabel: {
        color: '#0F172A',
    },
    outlinedLabel: {
        color: '#FFFFFF',
    },
});
