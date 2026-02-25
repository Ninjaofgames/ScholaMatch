import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordInput({
    icon = "lock-closed-outline",
    error,
    style,
    ...props
}) {
    const [show, setShow] = useState(false);

    return (
        <View style={[styles.container, style, error && styles.containerError]}>
            <Ionicons name={icon} size={20} color="#94A3B8" style={styles.iconLeft} />

            <TextInput
                style={styles.input}
                placeholderTextColor="#64748B"
                secureTextEntry={!show}
                {...props}
            />

            <TouchableOpacity style={styles.iconRight} onPress={() => setShow(!show)}>
                <Ionicons name={show ? "eye-outline" : "eye-off-outline"} size={20} color="#94A3B8" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    iconLeft: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#F8FAFC',
        height: '100%',
    },
    iconRight: {
        paddingLeft: 12,
    },
});
