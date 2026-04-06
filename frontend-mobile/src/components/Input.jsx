import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Input({
    icon,
    error,
    style,
    ...props
}) {
    return (
        <View style={[styles.container, style, error && styles.containerError]}>
            {icon && (
                <Ionicons name={icon} size={20} color="#94A3B8" style={styles.icon} />
            )}
            <TextInput
                style={[
                    styles.input,
                    !props.editable && props.editable !== undefined ? styles.inputDisabled : null,
                ]}
                placeholderTextColor="#64748B"
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.53)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
    },
    containerError: {
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#F8FAFC',
        height: '100%',
    },
    inputDisabled: {
        color: '#64748B',
    },
});
