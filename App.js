import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Pantallas con los nombres EXACTOS de tu estructura
import LoginScreen from './frontend/src/screens/LoginScreen';
import HomeScreen from './frontend/src/screens/HomeScreen';
import ProfileScreen from './frontend/src/screens/ProfileScreen';
import SettingsScreen from './frontend/src/screens/SettingsScreen';
import PacienteScreen from './frontend/src/screens/PacienteScreen'; // 👈 Nombre en singular
import AppointmentScreen from './frontend/src/screens/AppointmentScreen';
import MedicalHistoryScreen from './frontend/src/screens/MedicalHistoryScreen';
import HelpScreen from './frontend/src/screens/HelpScreen';
import { SessionProvider, useSession } from './frontend/src/context/SessionContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#087EA4',
      tabBarInactiveTintColor: '#64748B',
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      tabBarStyle: {
        height: 62 + bottom,
        paddingTop: 5,
        paddingBottom: Math.max(bottom, 6),
        borderTopColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
      },
      tabBarIcon: ({ color, focused }) => {
        const icons = {
          Inicio: focused ? 'home' : 'home-outline',
          Pacientes: focused ? 'people' : 'people-outline',
          Configuracion: focused ? 'settings' : 'settings-outline',
          Ayuda: focused ? 'help-circle' : 'help-circle-outline',
        };
        return <Ionicons name={icons[route.name]} size={18} color={color} />;
      },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Pacientes" component={PacienteScreen} options={{ tabBarLabel: 'Pacientes' }} />
      <Tab.Screen name="Configuracion" component={SettingsScreen} options={{ tabBarLabel: 'Configuración' }} />
      <Tab.Screen name="Ayuda" component={HelpScreen} options={{ tabBarLabel: 'Ayuda' }} />
    </Tab.Navigator>
  );
};

const PrivateStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#0A4D68' },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <Stack.Screen name="Citas" component={AppointmentScreen} options={{ title: 'Citas' }} />
    <Stack.Screen name="Historial" component={MedicalHistoryScreen} options={{ title: 'Historial Médico' }} />
    <Stack.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Mi Perfil' }} />
  </Stack.Navigator>
);

const AppContent = () => {
  const { darkMode } = useSession();

  return (
    <NavigationContainer theme={{
      ...(darkMode ? DarkTheme : DefaultTheme),
      colors: {
        ...(darkMode ? DarkTheme.colors : DefaultTheme.colors),
        primary: '#0A4D68',
        background: darkMode ? '#0F172A' : '#FFFFFF',
        card: darkMode ? '#1E293B' : '#FFFFFF',
        text: darkMode ? '#F8FAFC' : '#0F172A',
        border: darkMode ? '#475569' : '#E2E8F0',
        notification: '#DC2626',
      },
    }}>
        <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Private" component={PrivateStack} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
};

export default App;