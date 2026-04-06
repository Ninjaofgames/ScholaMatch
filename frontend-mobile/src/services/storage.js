import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = 'scholamatch_token';

// IP Configuration for your environment
// 1. Local Machine IP (replace 10.10.18.193 with your actual IP)
export const API_BASE = 'http://10.221.1.50:8000/api'; 

// 2. Android Emulator (use this if testing on Android Studio emulator)
// export const API_BASE = 'http://10.0.2.2:8000/api'; 

// 3. Tailscale / VPN (if you are testing remotely)
// export const API_BASE = 'http://100.90.178.181:8000/api';

export const saveToken = (token) => AsyncStorage.setItem(TOKEN_KEY, token);
export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);
export const clearToken = () => AsyncStorage.removeItem(TOKEN_KEY);
