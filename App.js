import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas con los nombres EXACTOS de tu estructura
import LoginScreen from './frontend/src/screens/LoginScreen';
import HomeScreen from './frontend/src/screens/HomeScreen';
import ProfileScreen from './frontend/src/screens/ProfileScreen';
import SettingsScreen from './frontend/src/screens/SettingsScreen';
import PacienteScreen from './frontend/src/screens/PacienteScreen'; // 👈 Nombre en singular
import AppointmentScreen from './frontend/src/screens/AppointmentScreen';
import MedicalHistoryScreen from './frontend/src/screens/MedicalHistoryScreen';
import { SessionProvider, useSession } from './frontend/src/context/SessionContext';

const Stack = createNativeStackNavigator();

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
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#0A4D68' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Clínica Pediátrica' }} 
        />
        {/* Usamos "Pacientes" para que navigation.navigate('Pacientes') funcione */}
        <Stack.Screen 
          name="Pacientes" 
          component={PacienteScreen} 
          options={{ title: 'Gestión de Pacientes' }} 
        />
        <Stack.Screen
          name="Citas"
          component={AppointmentScreen}
          options={{ title: 'Citas' }}
        />
        <Stack.Screen
          name="Historial"
          component={MedicalHistoryScreen}
          options={{ title: 'Historial Médico' }}
        />
        <Stack.Screen 
          name="Perfil" 
          component={ProfileScreen} 
          options={{ title: 'Mi Perfil' }} 
        />
        <Stack.Screen 
          name="Configuracion" 
          component={SettingsScreen} 
          options={{ title: 'Ajustes' }} 
        />
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