import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

const InitialLayout = () => {
    const { isAuthenticated, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAppGroup = segments[0] === '(app)';
        const inAuthGroup = segments[0] === '(auth)';

        if (isAuthenticated && !inAppGroup) {
            router.replace('/(app)/dashboard');
        } else if (!isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return <Slot />;
};

export default function RootLayout() {
    return (
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}
