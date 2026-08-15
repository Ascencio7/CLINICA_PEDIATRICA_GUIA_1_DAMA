import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Resolución de host para llamadas al backend:
// - Android emulator: 10.0.2.2
// - Web: 127.0.0.1
// - Dispositivo real: usa la IP del packager / debuggerHost real de Expo
// - Fallback: IP LAN por defecto si no se puede detectar automáticamente
const DEFAULT_LAN_HOST = '192.168.1.123';

function normalizeHost(value) {
  if (!value) return null;

  const text = String(value).trim();
  if (!text || text === 'localhost' || text === '0.0.0.0') {
    return null;
  }

  return text.replace(/^https?:\/\//, '').split(':')[0];
}

function resolveHost() {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.expoConfig?.debuggerHost,
    Constants.expoConfig?.packagerOpts?.devClient?.hostUri,
    Constants.manifest?.debuggerHost,
    Constants.manifest2?.debuggerHost,
    Constants.manifest?.packagerOpts?.devClient?.debuggerHost,
  ];

  for (const candidate of candidates) {
    const host = normalizeHost(candidate);
    if (host) return host;
  }

  if (Platform.OS === 'web') return '127.0.0.1';

  if (Platform.OS === 'android') return '10.0.2.2';

  return DEFAULT_LAN_HOST;
}

const host = resolveHost();
const API = process.env.EXPO_PUBLIC_API_URL || `http://${host}:5000/api`;

export default API;
