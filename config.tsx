import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.GOOGLE_PLACES_API_KEY;
export const BASE_URL = Platform.OS === 'ios' ? 'http://10.43.105.3:5000' : 'http://10.0.2.2:5000';