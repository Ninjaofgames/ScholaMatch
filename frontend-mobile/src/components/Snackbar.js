import { Alert } from 'react-native';

export const showSnack = (message, isError = false) => {
    Alert.alert(isError ? 'Error' : 'Success', message);
};
