import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Resolución de host para llamadas al backend:
// - Android emulator: 10.0.2.2
// - Web: 127.0.0.1
// - Native device (Expo Go): se intenta obtener la IP del packager (debuggerHost) a través de Constants
//   si no se detecta, caerá a la IP LAN por defecto abajo (ajústala si tu IP cambia).
const DEFAULT_LAN_HOST = '192.168.1.123';

function resolveHost() {
	// Intenta leer debuggerHost desde el manifiesto (varía según SDK/version)
	const manifest = Constants.manifest || Constants.expoConfig || Constants.manifest2 || null;
	const debuggerHost = manifest && (manifest.debuggerHost || manifest.debuggerHost?.split?.length ? manifest.debuggerHost : null) || (manifest && manifest.packagerOpts && manifest.packagerOpts.devClient && manifest.debuggerHost) || null;
	if (debuggerHost) {
		// formato: "192.168.1.10:8081"
		return String(debuggerHost).split(':')[0];
	}

	if (Platform.OS === 'web') return '127.0.0.1';

	// Si es Android y no detectamos debuggerHost, asumimos emulador y usamos 10.0.2.2
	if (Platform.OS === 'android') return '10.0.2.2';

	return DEFAULT_LAN_HOST;
}

const host = resolveHost();
const API = `http://${host}:5000/api`;

export default API;
