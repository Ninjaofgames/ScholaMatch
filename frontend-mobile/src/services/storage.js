import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = 'scholamatch_token';

// Ton IP Wi-Fi d'après ta capture d'écran (100.90.177.128)
// Attention : Pas de slash '/' à la fin pour éviter //user/login/
export const API_BASE = 'http://100.90.178.181:8080/api';

export const saveToken = (token) => AsyncStorage.setItem(TOKEN_KEY, token);
export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);
export const clearToken = () => AsyncStorage.removeItem(TOKEN_KEY);
